"""Representational topology: linear CKA and ridge / orthogonal residuals.

Samples are token positions (rows). Features are hidden widths (columns), which
may differ across the two checkpoints.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


def _as_2d(name: str, value: np.ndarray) -> np.ndarray:
    arr = np.asarray(value, dtype=np.float64)
    if arr.ndim != 2:
        raise ValueError(f"{name} must be rank-2 (samples, features), got {arr.shape}")
    if arr.shape[0] < 3:
        raise ValueError(f"{name} needs at least 3 samples, got {arr.shape[0]}")
    if not np.isfinite(arr).all():
        raise ValueError(f"{name} contains non-finite values")
    return arr


def center_columns(x: np.ndarray) -> np.ndarray:
    return x - x.mean(axis=0, keepdims=True)


def total_variance(x: np.ndarray) -> float:
    xc = center_columns(x)
    denom = max(x.shape[0] - 1, 1)
    return float(np.sum(xc * xc) / denom)


def linear_cka(x: np.ndarray, y: np.ndarray) -> float:
    """Biased linear CKA (Kornblith et al., 2019) on column-centered features.

    Uses the Gram form ``<Xc Xcᵀ, Yc Ycᵀ> / sqrt(<K,K><L,L>)``, which matches
    the feature-covariance form and stays well-defined when width exceeds the
    sample count.
    """

    x = center_columns(_as_2d("x", x))
    y = center_columns(_as_2d("y", y))
    if x.shape[0] != y.shape[0]:
        raise ValueError(f"CKA sample mismatch: {x.shape[0]} vs {y.shape[0]}")
    k = x @ x.T
    l = y @ y.T
    hsic = float(np.sum(k * l))
    norm = float(np.sqrt(np.sum(k * k) * np.sum(l * l)))
    if norm < 1e-12:
        return float("nan")
    value = hsic / norm
    # Numerical noise can drift a true 1.0 by ~1e-12.
    return float(np.clip(value, 0.0, 1.0))


def ridge_map(x: np.ndarray, y: np.ndarray, lam: float = 0.05) -> np.ndarray:
    """Min-norm ridge map W (dx, dy) minimizing ||X W - Y|| with λ ∝ tr(XᵀX)/dx.

    The dual (Woodbury) path is used when features outnumber samples so a short
    prompt cannot interpolate a wide residual stream and report a fake zero residual.
    """

    x = _as_2d("x", x)
    y = _as_2d("y", y)
    if x.shape[0] != y.shape[0]:
        raise ValueError(f"probe sample mismatch: {x.shape[0]} vs {y.shape[0]}")
    x = center_columns(x)
    y = center_columns(y)
    n, dx = x.shape
    gram_trace = float(np.sum(x * x))
    lam_abs = float(lam) * gram_trace / max(dx, 1)
    lam_abs = max(lam_abs, 1e-8)
    if dx <= n:
        system = x.T @ x
        system.flat[:: dx + 1] += lam_abs
        return np.linalg.solve(system, x.T @ y)
    system = x @ x.T
    system.flat[:: n + 1] += lam_abs
    return x.T @ np.linalg.solve(system, y)


def residual_fraction(x: np.ndarray, y: np.ndarray, lam: float = 0.05) -> float:
    """Unlearnable residual variance floor Var(Y - X W) / Var(Y)."""

    x = center_columns(_as_2d("x", x))
    y = center_columns(_as_2d("y", y))
    if x.shape[0] != y.shape[0]:
        raise ValueError("residual sample mismatch")
    var_y = total_variance(y)
    if var_y < 1e-12:
        return float("nan")
    weight = ridge_map(x, y, lam=lam)
    resid = y - x @ weight
    frac = total_variance(resid) / var_y
    return float(np.clip(frac, 0.0, 1.0))


def predictive_residual_fraction(x: np.ndarray, y: np.ndarray, lam: float = 0.05, folds: int = 4) -> float:
    """Held-out residual. Refit W on complementary token folds.

    In-sample ridge can interpolate when width exceeds the token count and report
    a fake zero floor. Scoring held-out positions is the unlearnable floor: if the
    map cannot predict the tokens it did not fit, that variance is still there.
    Ratios above 1 (worse than the mean) are clipped to 1.
    """

    x = _as_2d("x", x)
    y = _as_2d("y", y)
    if x.shape[0] != y.shape[0]:
        raise ValueError("predictive residual sample mismatch")
    n = x.shape[0]
    if n < folds * 2:
        return residual_fraction(x, y, lam=lam)
    pred = np.empty_like(y, dtype=np.float64)
    for fold in range(folds):
        test = np.arange(fold, n, folds)
        train = np.ones(n, dtype=bool)
        train[test] = False
        x_train = x[train]
        y_train = y[train]
        mean_x = x_train.mean(axis=0, keepdims=True)
        mean_y = y_train.mean(axis=0, keepdims=True)
        weight = ridge_map(x_train, y_train, lam=lam)
        pred[test] = (x[test] - mean_x) @ weight + mean_y
    var_y = total_variance(y)
    if var_y < 1e-12:
        return float("nan")
    return float(np.clip(total_variance(y - pred) / var_y, 0.0, 1.0))


def _pca_scores(x: np.ndarray, rank: int) -> np.ndarray:
    # x is centered. Economy SVD: scores = U * S.
    _u, s, vt = np.linalg.svd(x, full_matrices=False)
    rank = max(1, min(rank, s.shape[0], x.shape[0] - 1))
    components = vt[:rank].T
    return x @ components


def orthogonal_residual_fraction(x: np.ndarray, y: np.ndarray, rank: int = 32) -> float:
    """Orthogonal Procrustes residual after PCA into a shared rank.

    Complements the unrestricted ridge probe: this is the variance left once
    the best rotation (no shear, no uneven scaling) aligns the principal axes.
    """

    x = center_columns(_as_2d("x", x))
    y = center_columns(_as_2d("y", y))
    if x.shape[0] != y.shape[0]:
        raise ValueError("procrustes sample mismatch")
    k = int(min(rank, x.shape[0] - 1, x.shape[1], y.shape[1]))
    if k < 2:
        return float("nan")
    xs = _pca_scores(x, k)
    ys = _pca_scores(y, k)
    # Re-center scores (PCA already centered, but be strict).
    xs = center_columns(xs)
    ys = center_columns(ys)
    u, _, vt = np.linalg.svd(xs.T @ ys, full_matrices=False)
    rotation = u @ vt
    if rotation.shape[0] == rotation.shape[1] and np.linalg.det(rotation) < 0:
        u = u.copy()
        u[:, -1] *= -1.0
        rotation = u @ vt
    pred = xs @ rotation
    var_y = total_variance(ys)
    if var_y < 1e-12:
        return float("nan")
    return float(np.clip(total_variance(ys - pred) / var_y, 0.0, 1.0))


def tripartite_ratios(r2_a_to_b: float, r2_b_to_a: float) -> dict[str, float]:
    """Normalize shared / A-unique / B-unique so the executive pie sums to 1.

    Raw directional R² is preserved by the caller. The pie uses:

        S   = (R²_{A→B} + R²_{B→A}) / 2          retained, both ways
        U_A = 1 - R²_{B→A}                       A not linearly in B
        U_B = 1 - R²_{A→B}                       B not linearly in A

    then divides by S + U_A + U_B.
    """

    r_ab = float(np.clip(r2_a_to_b, 0.0, 1.0))
    r_ba = float(np.clip(r2_b_to_a, 0.0, 1.0))
    shared = 0.5 * (r_ab + r_ba)
    unique_a = 1.0 - r_ba
    unique_b = 1.0 - r_ab
    total = shared + unique_a + unique_b
    if total <= 1e-12:
        return {"shared": 1.0, "unique_a": 0.0, "unique_b": 0.0}
    return {
        "shared": shared / total,
        "unique_a": unique_a / total,
        "unique_b": unique_b / total,
    }


@dataclass(frozen=True)
class LayerAlignment:
    name: str
    depth: float
    cka: float
    residual_fraction: float
    insample_residual: float
    r2_a_to_b: float
    r2_b_to_a: float
    orthogonal_residual: float
    n_samples: int
    width_a: int
    width_b: int


@dataclass(frozen=True)
class AlignmentReport:
    layers: list[LayerAlignment]
    mean_cka: float
    mean_residual_fraction: float
    mean_r2_a_to_b: float
    mean_r2_b_to_a: float
    mean_orthogonal_residual: float
    shared: float
    unique_a: float
    unique_b: float


class RepresentationalAlignmentAuditor:
    """Layer-paired CKA and linear residual floor for a captured token stream."""

    def __init__(self, ridge_lambda: float = 0.05, procrustes_rank: int = 32) -> None:
        self.ridge_lambda = ridge_lambda
        self.procrustes_rank = procrustes_rank

    def evaluate(
        self,
        activations_a: list[np.ndarray],
        activations_b: list[np.ndarray],
        names: list[str] | None = None,
    ) -> AlignmentReport:
        if len(activations_a) == 0 or len(activations_b) == 0:
            raise ValueError("both models need at least one tapped layer")
        pairs = _pair_by_depth(len(activations_a), len(activations_b))
        layers: list[LayerAlignment] = []
        for index, (ia, ib) in enumerate(pairs):
            xa = np.concatenate([np.asarray(chunk, dtype=np.float64) for chunk in activations_a[ia]], axis=0)
            xb = np.concatenate([np.asarray(chunk, dtype=np.float64) for chunk in activations_b[ib]], axis=0)
            if xa.shape[0] != xb.shape[0]:
                n = min(xa.shape[0], xb.shape[0])
                xa = xa[:n]
                xb = xb[:n]
            cka = linear_cka(xa, xb)
            resid = predictive_residual_fraction(xa, xb, lam=self.ridge_lambda)
            insample = residual_fraction(xa, xb, lam=self.ridge_lambda)
            r2_ab = float("nan") if np.isnan(resid) else 1.0 - resid
            resid_ba = predictive_residual_fraction(xb, xa, lam=self.ridge_lambda)
            r2_ba = float("nan") if np.isnan(resid_ba) else 1.0 - resid_ba
            orth = orthogonal_residual_fraction(xa, xb, rank=self.procrustes_rank)
            depth = 0.0 if len(pairs) == 1 else index / (len(pairs) - 1)
            if names is not None and len(names) == len(pairs):
                name = names[index]
            elif len(activations_a) == len(activations_b):
                name = f"layer.{ia}"
            else:
                name = f"a{ia}/b{ib}"
            layers.append(
                LayerAlignment(
                    name=name,
                    depth=depth,
                    cka=cka,
                    residual_fraction=resid,
                    insample_residual=insample,
                    r2_a_to_b=r2_ab,
                    r2_b_to_a=r2_ba,
                    orthogonal_residual=orth,
                    n_samples=int(xa.shape[0]),
                    width_a=int(xa.shape[1]),
                    width_b=int(xb.shape[1]),
                )
            )
        return _summarize(layers)


def _pair_by_depth(n_a: int, n_b: int) -> list[tuple[int, int]]:
    if n_a == n_b:
        return [(i, i) for i in range(n_a)]
    steps = max(n_a, n_b)
    pairs: list[tuple[int, int]] = []
    seen: set[tuple[int, int]] = set()
    for i in range(steps):
        ia = 0 if steps == 1 else int(round(i * (n_a - 1) / (steps - 1)))
        ib = 0 if steps == 1 else int(round(i * (n_b - 1) / (steps - 1)))
        key = (ia, ib)
        if key not in seen:
            seen.add(key)
            pairs.append(key)
    return pairs


def _nanmean(values: list[float]) -> float:
    arr = np.asarray(values, dtype=np.float64)
    if arr.size == 0 or np.all(np.isnan(arr)):
        return float("nan")
    return float(np.nanmean(arr))


def _summarize(layers: list[LayerAlignment]) -> AlignmentReport:
    # Executive geometry uses transformer blocks when an embedding tap is present,
    # so a frozen tied embedding cannot dominate the pie.
    body = [layer for layer in layers if not layer.name.startswith("embed")]
    used = body or layers
    mean_r_ab = _nanmean([layer.r2_a_to_b for layer in used])
    mean_r_ba = _nanmean([layer.r2_b_to_a for layer in used])
    parts = tripartite_ratios(
        0.0 if np.isnan(mean_r_ab) else mean_r_ab,
        0.0 if np.isnan(mean_r_ba) else mean_r_ba,
    )
    return AlignmentReport(
        layers=layers,
        mean_cka=_nanmean([layer.cka for layer in used]),
        mean_residual_fraction=_nanmean([layer.residual_fraction for layer in used]),
        mean_r2_a_to_b=mean_r_ab,
        mean_r2_b_to_a=mean_r_ba,
        mean_orthogonal_residual=_nanmean([layer.orthogonal_residual for layer in used]),
        shared=parts["shared"],
        unique_a=parts["unique_a"],
        unique_b=parts["unique_b"],
    )


def run_numeric_self_test() -> dict[str, float]:
    rng = np.random.default_rng(11)
    x = rng.normal(size=(48, 16))
    q, _ = np.linalg.qr(rng.normal(size=(16, 16)))
    y_orth = x @ q
    y_scale = 3.5 * x
    cka_orth = linear_cka(x, y_orth)
    cka_scale = linear_cka(x, y_scale)
    true_w = rng.normal(size=(16, 24)) / np.sqrt(16)
    y = x @ true_w
    cka_linear = linear_cka(x, y)
    resid_linear = residual_fraction(x, y, lam=1e-4)
    y_copy = x + rng.normal(scale=1e-3, size=x.shape)
    cka_near = linear_cka(x, y_copy)
    y_noise = rng.normal(size=(48, 16))
    cka_noise = linear_cka(x, y_noise)
    resid_noise = residual_fraction(x, y_noise, lam=0.05)
    if not (cka_orth > 0.99 and cka_scale > 0.99):
        raise AssertionError(f"CKA should be invariant to rotation and scale, got {cka_orth}, {cka_scale}")
    if not (cka_linear > 0.5):
        raise AssertionError(f"a full-rank linear image should stay related, got {cka_linear}")
    if not (resid_linear < 0.05):
        raise AssertionError(f"ridge residual on a linear map should be small, got {resid_linear}")
    if not (cka_near > 0.98):
        raise AssertionError(f"near-copy CKA collapsed: {cka_near}")
    if not (cka_noise < 0.35):
        raise AssertionError(f"independent draws should not look aligned: {cka_noise}")
    if not (resid_noise > 0.7):
        raise AssertionError(f"noise should not be linearly explained: {resid_noise}")
    # Wide, short sample: in-sample ridge can interpolate. The predictive floor must not.
    x_wide = rng.normal(size=(12, 64))
    y_wide = rng.normal(size=(12, 40))
    resid_wide = predictive_residual_fraction(x_wide, y_wide, lam=0.05)
    if not (resid_wide > 0.5):
        raise AssertionError(f"underdetermined probe interpolated noise: {resid_wide}")
    pred_linear = predictive_residual_fraction(x, y, lam=1e-3)
    if not (pred_linear < 0.08):
        raise AssertionError(f"held-out residual on a linear map should be small, got {pred_linear}")
    parts = tripartite_ratios(0.8, 0.6)
    if abs(parts["shared"] + parts["unique_a"] + parts["unique_b"] - 1.0) > 1e-9:
        raise AssertionError("tripartite ratios must sum to 1")
    return {
        "cka_orthogonal": cka_orth,
        "cka_scale": cka_scale,
        "cka_linear": cka_linear,
        "cka_near_copy": cka_near,
        "cka_noise": cka_noise,
        "residual_linear": resid_linear,
        "residual_noise": resid_noise,
        "residual_wide": resid_wide,
    }
