"""Token-stream behavioral divergence: top-K JSD, EMA power, NLMS, μ+3σ spans."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np


def softmax(logits: np.ndarray) -> np.ndarray:
    z = np.asarray(logits, dtype=np.float64)
    z = z - np.max(z)
    e = np.exp(z)
    total = e.sum()
    if total <= 0 or not np.isfinite(total):
        raise ValueError("softmax received non-finite logits")
    return e / total


def entropy_nats(probs: np.ndarray) -> float:
    p = np.asarray(probs, dtype=np.float64)
    mask = p > 0
    return float(-np.sum(p[mask] * np.log(p[mask])))


def jensen_shannon_bits(p: np.ndarray, q: np.ndarray) -> float:
    """Symmetric JSD in bits. Identical distributions → 0, disjoint one-hots → 1."""

    p = np.asarray(p, dtype=np.float64)
    q = np.asarray(q, dtype=np.float64)
    if p.shape != q.shape:
        raise ValueError(f"JSD shape mismatch {p.shape} vs {q.shape}")
    p = p / p.sum()
    q = q / q.sum()
    m = 0.5 * (p + q)

    def _kl(src: np.ndarray, dst: np.ndarray) -> float:
        mask = src > 0
        return float(np.sum(src[mask] * np.log2(src[mask] / np.clip(dst[mask], 1e-12, None))))

    return 0.5 * _kl(p, m) + 0.5 * _kl(q, m)


def topk_distribution_jsd(logits_a: np.ndarray, logits_b: np.ndarray, k: int) -> tuple[float, np.ndarray, np.ndarray]:
    """JSD on the union of the two top-K supports, plus a residual OTHER bin.

    Returns (jsd_bits, probs_a, probs_b) where the probabilities are the full
    softmax, so entropy and top-1 stay exact while the divergence itself follows
    the spec's top-K support.
    """

    la = np.asarray(logits_a, dtype=np.float64).reshape(-1)
    lb = np.asarray(logits_b, dtype=np.float64).reshape(-1)
    if la.shape != lb.shape:
        raise ValueError(f"logit mismatch {la.shape} vs {lb.shape}")
    vocab = la.shape[0]
    k = int(max(1, min(k, vocab)))
    pa = softmax(la)
    pb = softmax(lb)
    idx_a = np.argpartition(pa, -k)[-k:]
    idx_b = np.argpartition(pb, -k)[-k:]
    support = np.unique(np.concatenate([idx_a, idx_b]))
    pa_s = pa[support]
    pb_s = pb[support]
    pa_s = np.concatenate([pa_s, [max(0.0, 1.0 - float(pa_s.sum()))]])
    pb_s = np.concatenate([pb_s, [max(0.0, 1.0 - float(pb_s.sum()))]])
    pa_s = pa_s / pa_s.sum()
    pb_s = pb_s / pb_s.sum()
    return jensen_shannon_bits(pa_s, pb_s), pa, pb


def behavioral_bucket(top1_a: int, top1_b: int, top5_a: set[int], top5_b: set[int]) -> str:
    """Partition every position into identical / soft / conflict."""

    if top1_a == top1_b:
        return "identical"
    if top5_a.isdisjoint(top5_b):
        return "conflict"
    return "soft"


@dataclass
class TokenObservation:
    prompt_id: str
    k: int
    token: str
    jsd_bits: float
    power: float
    ema_power: float
    lms_prediction: float
    innovation: float
    online_mu: float
    online_sigma: float
    online_threshold: float
    flagged: bool
    entropy_a: float
    entropy_b: float
    norm_entropy_a: float
    norm_entropy_b: float
    perplexity_a: float
    perplexity_b: float
    top1_a: int
    top1_b: int
    top1_token_a: str
    top1_token_b: str
    top1_agree: bool
    bucket: str
    kind: str | None


@dataclass
class DivergenceSpan:
    prompt_id: str
    file: str
    line: int
    start: int
    end: int
    kind: str
    peak_jsd: float
    mean_jsd: float
    snippet: str
    prediction_a: str
    prediction_b: str


@dataclass
class BehaviorReport:
    observations: list[TokenObservation]
    spans: list[DivergenceSpan]
    identical_pct: float
    soft_pct: float
    conflict_pct: float
    background_mu: float
    background_sigma: float
    power_floor: float
    cert_threshold: float
    uncertain_threshold: float
    lms_weights: list[float]


@dataclass
class LMSBehaviorTracker:
    """Two-time-scale divergence tracker.

    Instantaneous divergence is symmetric top-K JSD in bits. Divergence power is
    its square. ``J(k)`` is an EMA of that power. An NLMS filter predicts power
    from a short delay line (the engineering innovation trace).

    Spans are not a global mean of a contaminated stream — anomalies would inflate
    σ and hide themselves. μ and σ are seeded on calm (top-1-agreed) positions,
    then a slow EMA updates **only while unflagged**. A position flags when power
    exceeds μ + 3σ and a small absolute floor. Hysteresis keeps a span open until
    power falls back under μ + σ.
    """

    top_k: int = 8
    ema_alpha: float = 0.65
    baseline_alpha: float = 0.08
    lms_order: int = 4
    lms_mu: float = 0.35
    sigma_multiplier: float = 3.0
    jsd_floor_bits: float = 0.08
    id_to_token: dict[int, str] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self._weights = np.zeros(self.lms_order, dtype=np.float64)
        self._delay = np.zeros(self.lms_order, dtype=np.float64)
        self._ema = 0.0
        self._mu = 0.0
        self._var = 1e-6
        self._calibrated = False

    @property
    def lms_weights(self) -> np.ndarray:
        return self._weights.copy()

    def reset_stream_memory(self, keep_baseline: bool = True) -> None:
        """Drop EMA / delay at prompt boundaries. Baseline μ, σ stay put."""

        self._ema = 0.0
        self._delay[:] = 0.0
        if not keep_baseline:
            self._mu = 0.0
            self._var = 1e-6
            self._calibrated = False
            self._weights[:] = 0.0

    def calibrate(self, calm_powers: np.ndarray) -> None:
        powers = np.asarray(calm_powers, dtype=np.float64).reshape(-1)
        powers = powers[np.isfinite(powers)]
        if powers.size < 4:
            self._mu = float(np.median(powers)) if powers.size else 0.0
            self._var = (self.jsd_floor_bits ** 2) ** 2
        else:
            self._mu = float(np.median(powers))
            mad = float(np.median(np.abs(powers - self._mu)))
            sigma = 1.4826 * mad
            self._var = max(sigma, self.jsd_floor_bits ** 2) ** 2
        self._calibrated = True

    def _step_filters(self, power: float, update_baseline: bool) -> tuple[float, float, float, float, float]:
        prediction = float(self._weights @ self._delay)
        innovation = float(power - prediction)
        norm = float(self._delay @ self._delay) + 1e-6
        self._weights = self._weights + (self.lms_mu * innovation / norm) * self._delay
        self._delay[1:] = self._delay[:-1]
        self._delay[0] = power
        self._ema = self.ema_alpha * self._ema + (1.0 - self.ema_alpha) * power
        if update_baseline:
            delta = power - self._mu
            self._mu = (1.0 - self.baseline_alpha) * self._mu + self.baseline_alpha * power
            self._var = (1.0 - self.baseline_alpha) * self._var + self.baseline_alpha * delta * delta
        sigma = float(np.sqrt(max(self._var, 1e-12)))
        threshold = self._mu + self.sigma_multiplier * sigma
        return prediction, innovation, self._ema, sigma, threshold

    def analyze(
        self,
        sequences: list[dict],
    ) -> BehaviorReport:
        """``sequences`` items: prompt_id, file, line, tokens (list[str]), logits_a/b (T, V)."""

        prelim: list[dict] = []
        for seq in sequences:
            logits_a = np.asarray(seq["logits_a"], dtype=np.float64)
            logits_b = np.asarray(seq["logits_b"], dtype=np.float64)
            tokens: list[str] = list(seq["tokens"])
            if logits_a.shape != logits_b.shape:
                raise ValueError(f"{seq['prompt_id']}: logit shape {logits_a.shape} vs {logits_b.shape}")
            if logits_a.shape[0] != len(tokens):
                raise ValueError(f"{seq['prompt_id']}: {len(tokens)} tokens vs {logits_a.shape[0]} steps")
            vocab = logits_a.shape[1]
            for k in range(len(tokens)):
                jsd, pa, pb = topk_distribution_jsd(logits_a[k], logits_b[k], self.top_k)
                ha = entropy_nats(pa)
                hb = entropy_nats(pb)
                log_v = float(np.log(max(vocab, 2)))
                top5_a = set(np.argpartition(pa, -min(5, vocab))[-min(5, vocab) :].tolist())
                top5_b = set(np.argpartition(pb, -min(5, vocab))[-min(5, vocab) :].tolist())
                top1_a = int(np.argmax(pa))
                top1_b = int(np.argmax(pb))
                prelim.append(
                    {
                        "seq": seq,
                        "k": k,
                        "jsd": jsd,
                        "power": jsd * jsd,
                        "ha": ha,
                        "hb": hb,
                        "na": ha / log_v,
                        "nb": hb / log_v,
                        "pa_top": top1_a,
                        "pb_top": top1_b,
                        "agree": top1_a == top1_b,
                        "bucket": behavioral_bucket(top1_a, top1_b, top5_a, top5_b),
                        "vocab": vocab,
                    }
                )
        calm = np.asarray([row["power"] for row in prelim if row["agree"]], dtype=np.float64)
        if calm.size < 4:
            all_powers = np.asarray([row["power"] for row in prelim], dtype=np.float64)
            calm = np.partition(all_powers, min(len(all_powers) // 2, len(all_powers) - 1))[
                : max(len(all_powers) // 2, 1)
            ]
        self.calibrate(calm)
        seed_mu = float(self._mu)
        seed_sigma = float(np.sqrt(max(self._var, 0.0)))
        # Absolute normalized-entropy bands. Percentiles collapse when both models
        # are peaked, and would relabel a confident disagreement as "uncertain".
        cert_thr = 0.22
        unc_thr = 0.30

        observations: list[TokenObservation] = []
        self.reset_stream_memory(keep_baseline=True)
        power_floor = self.jsd_floor_bits ** 2
        active = False
        current_id = None
        for row in prelim:
            seq = row["seq"]
            if seq["prompt_id"] != current_id:
                self.reset_stream_memory(keep_baseline=True)
                active = False
                current_id = seq["prompt_id"]
            sigma = float(np.sqrt(max(self._var, 1e-12)))
            mu_now = float(self._mu)
            threshold = mu_now + self.sigma_multiplier * sigma
            release = mu_now + sigma
            exceed = row["power"] > max(threshold, power_floor)
            if not active and exceed:
                active = True
            elif active and row["power"] < max(release, power_floor * 0.5):
                active = False
            kind = None
            if active:
                kind = _classify_kind(
                    row["na"],
                    row["nb"],
                    row["agree"],
                    cert_thr,
                    unc_thr,
                )
            prediction, innovation, ema, _sigma_after, _threshold_after = self._step_filters(
                row["power"],
                update_baseline=not active,
            )
            token = seq["tokens"][row["k"]]
            observations.append(
                TokenObservation(
                    prompt_id=seq["prompt_id"],
                    k=row["k"],
                    token=token,
                    jsd_bits=float(row["jsd"]),
                    power=float(row["power"]),
                    ema_power=float(ema),
                    lms_prediction=float(prediction),
                    innovation=float(innovation),
                    online_mu=mu_now,
                    online_sigma=float(sigma),
                    online_threshold=float(threshold),
                    flagged=bool(active),
                    entropy_a=float(row["ha"]),
                    entropy_b=float(row["hb"]),
                    norm_entropy_a=float(row["na"]),
                    norm_entropy_b=float(row["nb"]),
                    perplexity_a=float(np.exp(min(row["ha"], 20.0))),
                    perplexity_b=float(np.exp(min(row["hb"], 20.0))),
                    top1_a=int(row["pa_top"]),
                    top1_b=int(row["pb_top"]),
                    top1_token_a=self.id_to_token.get(int(row["pa_top"]), str(row["pa_top"])),
                    top1_token_b=self.id_to_token.get(int(row["pb_top"]), str(row["pb_top"])),
                    top1_agree=bool(row["agree"]),
                    bucket=row["bucket"],
                    kind=kind,
                )
            )

        spans = _collect_spans(observations, sequences)
        n = max(len(observations), 1)
        identical = sum(obs.bucket == "identical" for obs in observations) / n
        soft = sum(obs.bucket == "soft" for obs in observations) / n
        conflict = sum(obs.bucket == "conflict" for obs in observations) / n
        return BehaviorReport(
            observations=observations,
            spans=spans,
            identical_pct=100.0 * identical,
            soft_pct=100.0 * soft,
            conflict_pct=100.0 * conflict,
            background_mu=seed_mu,
            background_sigma=seed_sigma,
            power_floor=power_floor,
            cert_threshold=cert_thr,
            uncertain_threshold=unc_thr,
            lms_weights=self._weights.tolist(),
        )


def _classify_kind(
    norm_a: float,
    norm_b: float,
    agree: bool,
    cert_thr: float,
    unc_thr: float,
) -> str:
    certain_a = norm_a <= cert_thr
    certain_b = norm_b <= cert_thr
    unsure_a = norm_a >= unc_thr
    unsure_b = norm_b >= unc_thr
    if certain_a and unsure_b:
        return "lost"
    if certain_b and unsure_a:
        return "acquired"
    if certain_a and certain_b and not agree:
        return "conflict"
    return "drift"


def _collect_spans(observations: list[TokenObservation], sequences: list[dict]) -> list[DivergenceSpan]:
    meta = {seq["prompt_id"]: seq for seq in sequences}
    spans: list[DivergenceSpan] = []
    i = 0
    while i < len(observations):
        obs = observations[i]
        if not obs.flagged or obs.kind is None:
            i += 1
            continue
        j = i
        while (
            j + 1 < len(observations)
            and observations[j + 1].flagged
            and observations[j + 1].prompt_id == obs.prompt_id
        ):
            j += 1
        window = observations[i : j + 1]
        kinds = [item.kind or "drift" for item in window]
        peak = max(window, key=lambda item: item.jsd_bits)
        kind = peak.kind or "drift"
        # A hysteresis tail is often mild drift. If a real capability pattern
        # covers a solid share of the span, that is the label executives should see.
        if kind == "drift":
            for preferred in ("lost", "acquired", "conflict"):
                if kinds.count(preferred) >= max(2, len(window) // 5):
                    kind = preferred
                    break
        seq = meta[obs.prompt_id]
        snippet = " ".join(seq["tokens"][obs.k : observations[j].k + 1])
        spans.append(
            DivergenceSpan(
                prompt_id=obs.prompt_id,
                file=seq["file"],
                line=int(seq["line"]),
                start=obs.k,
                end=observations[j].k,
                kind=kind,
                peak_jsd=float(peak.jsd_bits),
                mean_jsd=float(np.mean([item.jsd_bits for item in window])),
                snippet=snippet,
                prediction_a=peak.top1_token_a,
                prediction_b=peak.top1_token_b,
            )
        )
        i = j + 1
    spans.sort(key=lambda span: span.peak_jsd, reverse=True)
    return spans


def run_numeric_self_test() -> dict[str, float]:
    one = np.array([1.0, 0.0, 0.0])
    other = np.array([0.0, 1.0, 0.0])
    same = jensen_shannon_bits(one, one)
    far = jensen_shannon_bits(one, other)
    if same > 1e-9:
        raise AssertionError(f"JSD(P,P) should be 0, got {same}")
    if abs(far - 1.0) > 1e-6:
        raise AssertionError(f"JSD of disjoint one-hots should be 1 bit, got {far}")
    uniform = np.full(4, 0.25)
    peaked = np.array([1.0, 0.0, 0.0, 0.0])
    mid = jensen_shannon_bits(uniform, peaked)
    if not (0.2 < mid < 1.0):
        raise AssertionError(f"unexpected uniform-vs-peak JSD {mid}")
    # EMA of a constant power converges to that power.
    tracker = LMSBehaviorTracker(ema_alpha=0.5, baseline_alpha=0.0, jsd_floor_bits=0.0)
    tracker.calibrate(np.array([0.01, 0.01, 0.012, 0.009]))
    tracker._mu = 0.01
    tracker._var = 1e-6
    ema = 0.0
    for _ in range(12):
        _, _, ema, _, _ = tracker._step_filters(0.25, update_baseline=False)
    if abs(ema - 0.25) > 1e-3:
        raise AssertionError(f"EMA did not converge: {ema}")
    bucket = behavioral_bucket(1, 1, {1, 2}, {1, 3})
    if bucket != "identical":
        raise AssertionError(bucket)
    if behavioral_bucket(1, 2, {1, 3}, {2, 3}) != "soft":
        raise AssertionError("expected soft parity")
    if behavioral_bucket(1, 2, {1, 4}, {2, 5}) != "conflict":
        raise AssertionError("expected hard conflict")
    return {"jsd_identical": same, "jsd_disjoint": far, "jsd_uniform_peak": mid, "ema_constant": ema}
