"""Publication figure: two executive donuts, a CKA depth curve, a JSD timeline."""

from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch


INK = "#1c2118"
PAPER = "#f6f3ea"
GRID = "#e3ddcf"
SHARED = "#2f6a45"
SOFT = "#a7843a"
CONFLICT = "#a3472a"
ACQUIRED = "#2c5278"
BONE = "#8d7040"
MUTED = "#6e6a60"


def _donut(ax, sizes, colors, title: str) -> None:
    sizes = np.asarray(sizes, dtype=float)
    if sizes.sum() <= 0:
        sizes = np.ones_like(sizes)
    wedges, _ = ax.pie(
        sizes,
        startangle=90,
        colors=colors,
        wedgeprops={"width": 0.42, "edgecolor": PAPER, "linewidth": 2},
    )
    ax.set_title(title, color=INK, fontsize=11, pad=8, loc="left", fontweight="medium")
    return wedges


def render_comparison_report(briefing: dict, path: str | Path) -> Path:
    """Draw comparison_report.png. Seaborn themes the axes when it is installed."""

    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        import seaborn as sns

        sns.set_theme(style="white", rc={"axes.facecolor": PAPER, "figure.facecolor": PAPER})
    except ImportError:
        plt.style.use("default")

    fig = plt.figure(figsize=(13.4, 9.2), dpi=140, facecolor=PAPER)
    fig.suptitle("Meridian checkpoint brief", fontsize=16, color=INK, x=0.045, ha="left", fontweight="medium")
    models = briefing["models"]
    fig.text(
        0.045,
        0.935,
        f"A  {models['a']['name']}     B  {models['b']['name']}",
        color=MUTED,
        fontsize=8,
    )
    grid = fig.add_gridspec(2, 2, left=0.05, right=0.97, top=0.88, bottom=0.08, hspace=0.38, wspace=0.22)
    ax_beh = fig.add_subplot(grid[0, 0])
    ax_geo = fig.add_subplot(grid[0, 1])
    ax_cka = fig.add_subplot(grid[1, 0])
    ax_jsd = fig.add_subplot(grid[1, 1])
    for ax in (ax_beh, ax_geo, ax_cka, ax_jsd):
        ax.set_facecolor(PAPER)

    macro = briefing["macro"]
    beh_sizes = [
        macro["top1_identical_pct"],
        macro["soft_parity_pct"],
        macro["hard_conflict_pct"],
    ]
    beh_labels = [
        f"Identical top-1  {macro['top1_identical_pct']:.1f}%",
        f"Soft parity  {macro['soft_parity_pct']:.1f}%",
        f"Hard conflict  {macro['hard_conflict_pct']:.1f}%",
    ]
    beh_wedges = _donut(ax_beh, beh_sizes, [SHARED, SOFT, CONFLICT], "Behavioral delta")
    ax_beh.legend(
        beh_wedges,
        beh_labels,
        loc="lower center",
        bbox_to_anchor=(0.5, -0.22),
        frameon=False,
        fontsize=8,
    )
    ax_beh.text(0, 0, f"{macro['top1_identical_pct']:.0f}%", ha="center", va="center", fontsize=16, color=INK)

    geo_sizes = [
        macro["shared_latent_pct"],
        macro["model_a_unique_pct"],
        macro["model_b_unique_pct"],
    ]
    geo_labels = [
        f"Shared core  {macro['shared_latent_pct']:.1f}%",
        f"A residual / lost  {macro['model_a_unique_pct']:.1f}%",
        f"B residual / acquired  {macro['model_b_unique_pct']:.1f}%",
    ]
    geo_wedges = _donut(ax_geo, geo_sizes, [BONE, CONFLICT, ACQUIRED], "Representation delta")
    ax_geo.legend(
        geo_wedges,
        geo_labels,
        loc="lower center",
        bbox_to_anchor=(0.5, -0.22),
        frameon=False,
        fontsize=8,
    )
    ax_geo.text(0, 0, f"{macro['shared_latent_pct']:.0f}%", ha="center", va="center", fontsize=16, color=INK)

    layers = briefing["layers"]
    xs = np.arange(len(layers))
    cka = [layer["cka"] for layer in layers]
    bar_colors = [BONE if name.startswith("embed") else SHARED for name in (layer["name"] for layer in layers)]
    ax_cka.bar(xs, cka, color=bar_colors, width=0.72, zorder=2)
    ax_cka.plot(xs, cka, color=INK, linewidth=1.1, marker="o", markersize=3.5, zorder=3)
    ax_cka.set_ylim(0, 1.05)
    ax_cka.set_xticks(xs)
    ax_cka.set_xticklabels([layer["name"] for layer in layers], rotation=35, ha="right", fontsize=7)
    ax_cka.set_ylabel("Linear CKA", fontsize=8, color=MUTED)
    ax_cka.set_title("Depth-wise geometric similarity", loc="left", fontsize=11, color=INK, pad=8)
    ax_cka.axhline(macro["mean_cka"], color=SOFT, linewidth=0.8, linestyle="--", zorder=1)
    ax_cka.spines["top"].set_visible(False)
    ax_cka.spines["right"].set_visible(False)
    ax_cka.spines["left"].set_color(GRID)
    ax_cka.spines["bottom"].set_color(GRID)
    ax_cka.tick_params(colors=MUTED, labelsize=7)
    ax_cka.yaxis.grid(True, color=GRID, linewidth=0.6, zorder=0)
    ax_cka.set_axisbelow(True)

    stream = briefing["stream"]
    ks = [point["global_k"] for point in stream]
    jsd = [point["jsd"] for point in stream]
    thr = [np.sqrt(max(point["threshold"], 0.0)) for point in stream]
    ax_jsd.plot(ks, jsd, color=INK, linewidth=1.15, label="JSD (bits)", zorder=3)
    ax_jsd.plot(ks, thr, color=SOFT, linewidth=0.9, linestyle="--", label="μ+3σ (as bits)", zorder=2)
    kind_color = {"lost": CONFLICT, "acquired": ACQUIRED, "conflict": SOFT, "drift": "#b7b1a4"}
    labeled: set[str] = set()
    for span in briefing["spans"]:
        if not span.get("highlight"):
            continue
        x0 = span["global_start"] - 0.4
        x1 = span["global_end"] + 0.4
        color = kind_color.get(span["kind"], GRID)
        ax_jsd.axvspan(x0, x1, color=color, alpha=0.16, zorder=0)
        if span["kind"] not in labeled:
            ax_jsd.plot([], [], color=color, linewidth=6, alpha=0.45, label=span["kind"])
            labeled.add(span["kind"])
        if span.get("annotate"):
            y = min(0.98, span["peak_jsd"] + 0.06)
            ax_jsd.annotate(
                span["snippet"][:42],
                xy=(0.5 * (span["global_start"] + span["global_end"]), span["peak_jsd"]),
                xytext=(0.5 * (span["global_start"] + span["global_end"]), y),
                fontsize=6.5,
                color=INK,
                ha="center",
                arrowprops={"arrowstyle": "-", "color": MUTED, "lw": 0.6},
                annotation_clip=True,
            )
    ax_jsd.set_ylim(0, 1.05)
    ax_jsd.set_xlabel("Token position along the paired stream", fontsize=8, color=MUTED)
    ax_jsd.set_ylabel("Divergence (bits)", fontsize=8, color=MUTED)
    ax_jsd.set_title("Token-level divergence horizon", loc="left", fontsize=11, color=INK, pad=8)
    ax_jsd.spines["top"].set_visible(False)
    ax_jsd.spines["right"].set_visible(False)
    ax_jsd.spines["left"].set_color(GRID)
    ax_jsd.spines["bottom"].set_color(GRID)
    ax_jsd.tick_params(colors=MUTED, labelsize=7)
    ax_jsd.yaxis.grid(True, color=GRID, linewidth=0.6)
    ax_jsd.set_axisbelow(True)
    ax_jsd.legend(frameon=False, fontsize=7, loc="upper right")

    # Quiet score strip so the print figure stands alone without the web brief.
    fig.text(
        0.045,
        0.02,
        f"Macro overlap {macro['overlap_score']:.1f}%    "
        f"mean CKA {macro['mean_cka']:.3f}    "
        f"residual floor {macro['mean_residual_fraction']:.3f}    "
        f"spans {macro['n_spans']}",
        color=MUTED,
        fontsize=8,
    )
    fig.add_artist(
        FancyBboxPatch(
            (0.012, 0.012),
            0.976,
            0.976,
            boxstyle="square,pad=0",
            fill=False,
            ec="#d9d2c3",
            lw=0.6,
            transform=fig.transFigure,
            clip_on=False,
        )
    )
    fig.savefig(path, dpi=140)
    plt.close(fig)
    if not path.is_file() or path.stat().st_size < 1000:
        raise RuntimeError(f"Chart was not written: {path}")
    return path
