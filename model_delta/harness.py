"""Synthetic paired checkpoints, optional Hugging Face load, and the briefing."""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from model_delta.alignment import RepresentationalAlignmentAuditor, run_numeric_self_test as alignment_self_test
from model_delta.behavior import LMSBehaviorTracker, run_numeric_self_test as behavior_self_test
from model_delta.inspector import (
    ModelPairInspector,
    cast_floating,
    forward_logits,
    select_devices,
    select_dtype,
)
from model_delta.visualize import render_comparison_report

ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "corpus"
WORD = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    return WORD.findall(text.lower())


class WordVocab:
    def __init__(self, texts: list[str]) -> None:
        words: list[str] = []
        seen: set[str] = set()
        for text in texts:
            for word in tokenize(text):
                if word not in seen:
                    seen.add(word)
                    words.append(word)
        self.id_to_token = ["<pad>", "<unk>", *words]
        self.token_to_id = {token: index for index, token in enumerate(self.id_to_token)}

    def encode(self, text: str) -> list[int]:
        ids = [self.token_to_id.get(word, 1) for word in tokenize(text)]
        if len(ids) < 2:
            raise ValueError(f"Prompt needs at least 2 tokens: {text!r}")
        return ids

    @property
    def size(self) -> int:
        return len(self.id_to_token)


class RMSNorm(nn.Module):
    def __init__(self, width: int, eps: float = 1e-5) -> None:
        super().__init__()
        self.weight = nn.Parameter(torch.ones(width))
        self.eps = eps

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        var = x.float().pow(2).mean(dim=-1, keepdim=True)
        normed = x.float() * torch.rsqrt(var + self.eps)
        return (normed * self.weight.float()).to(dtype=x.dtype)


class CausalBlock(nn.Module):
    def __init__(self, width: int, n_heads: int) -> None:
        super().__init__()
        self.norm1 = RMSNorm(width)
        self.attn = nn.MultiheadAttention(width, n_heads, batch_first=True)
        self.norm2 = RMSNorm(width)
        self.up = nn.Linear(width, 4 * width)
        self.down = nn.Linear(4 * width, width)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.norm1(x)
        length = h.size(1)
        causal = torch.triu(torch.ones(length, length, device=h.device, dtype=torch.bool), diagonal=1)
        attended, _ = self.attn(h, h, h, attn_mask=causal, need_weights=False)
        x = x + attended
        mid = F.gelu(self.up(self.norm2(x)))
        return x + self.down(mid)


class TinyCausalLM(nn.Module):
    """Small causal transformer with an explicit embedding tap for hooks.

    This is the offline stand-in for a Hugging Face decoder (Qwen-style block
    list). ``load_hf_causal_lm`` is the real checkpoint path when transformers
    and the weights are available.
    """

    def __init__(self, vocab: int, width: int, n_layers: int, n_heads: int) -> None:
        super().__init__()
        self.embed = nn.Embedding(vocab, width)
        self.embed_tap = nn.Identity()
        self.blocks = nn.ModuleList(CausalBlock(width, n_heads) for _ in range(n_layers))
        self.final_norm = RMSNorm(width)
        self.lm_head = nn.Linear(width, vocab, bias=False)
        self.reset_parameters()

    def reset_parameters(self) -> None:
        for name, param in self.named_parameters():
            if param.dim() >= 2:
                nn.init.xavier_uniform_(param)
            elif "norm" in name:
                nn.init.ones_(param)
            else:
                nn.init.zeros_(param)

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        hidden = self.embed_tap(self.embed(token_ids))
        for block in self.blocks:
            hidden = block(hidden)
        return self.lm_head(self.final_norm(hidden))


def load_hf_causal_lm(name: str, device: torch.device, dtype: torch.dtype) -> nn.Module:
    from transformers import AutoModelForCausalLM

    model = AutoModelForCausalLM.from_pretrained(name, torch_dtype=dtype)
    model.to(device)
    model.eval()
    return model


def load_lines(corpus: Path) -> list[dict]:
    rows: list[dict] = []
    for path in sorted(corpus.glob("*.txt")):
        if "archive" in path.name:
            role = "archive"
        elif "acquired" in path.name:
            role = "acquired"
        elif "novel" in path.name:
            role = "novel"
        else:
            role = "shared"
        for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            text = raw.strip()
            if not text or text.startswith("#"):
                continue
            rows.append(
                {
                    "file": str(path.relative_to(corpus.parent)),
                    "line": line_no,
                    "text": text,
                    "role": role,
                }
            )
    if not rows:
        raise FileNotFoundError(f"No prompts in {corpus}")
    return rows


def _trainable(model: nn.Module) -> list[nn.Parameter]:
    return [param for param in model.parameters() if param.requires_grad]


def set_prefix_frozen(model: TinyCausalLM, frozen_blocks: int) -> None:
    for param in model.parameters():
        param.requires_grad_(True)
    model.embed.requires_grad_(False)
    for index, block in enumerate(model.blocks):
        if index < frozen_blocks:
            for param in block.parameters():
                param.requires_grad_(False)


def train_sequences(model: nn.Module, sequences: list[torch.Tensor], steps: int, lr: float) -> float:
    params = _trainable(model)
    if not params:
        raise RuntimeError("No trainable parameters")
    opt = torch.optim.AdamW(params, lr=lr, weight_decay=0.0)
    model.train()
    last = 0.0
    for _ in range(steps):
        total = 0.0
        for ids in sequences:
            opt.zero_grad(set_to_none=True)
            logits = model(ids)
            loss = F.cross_entropy(logits[:, :-1, :].reshape(-1, logits.size(-1)), ids[:, 1:].reshape(-1))
            loss.backward()
            torch.nn.utils.clip_grad_norm_(params, 1.0)
            opt.step()
            total += float(loss.detach())
        last = total / len(sequences)
    model.eval()
    return last


def _jsonable(value):
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None
        return round(value, 6)
    if isinstance(value, dict):
        return {key: _jsonable(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_jsonable(item) for item in value]
    if isinstance(value, (np.floating,)):
        return _jsonable(float(value))
    if isinstance(value, (np.integer,)):
        return int(value)
    return value


def _obs_dict(obs, target: str) -> dict:
    return {
        "k": obs.k,
        "token": obs.token,
        "target": target,
        "jsd": obs.jsd_bits,
        "power": obs.power,
        "ema": obs.ema_power,
        "lmsPrediction": obs.lms_prediction,
        "innovation": obs.innovation,
        "mu": obs.online_mu,
        "sigma": obs.online_sigma,
        "threshold": obs.online_threshold,
        "flagged": obs.flagged,
        "entropyA": obs.entropy_a,
        "entropyB": obs.entropy_b,
        "normEntropyA": obs.norm_entropy_a,
        "normEntropyB": obs.norm_entropy_b,
        "perplexityA": obs.perplexity_a,
        "perplexityB": obs.perplexity_b,
        "top1A": obs.top1_token_a,
        "top1B": obs.top1_token_b,
        "agree": obs.top1_agree,
        "bucket": obs.bucket,
        "kind": obs.kind,
    }


def build_briefing(report_alignment, report_behavior, prompts, models_meta, verification, hook_log) -> dict:
    mean_cka = report_alignment.mean_cka
    identical = report_behavior.identical_pct / 100.0
    soft_or_better = (report_behavior.identical_pct + report_behavior.soft_pct) / 100.0
    overlap = 100.0 * (0.40 * identical + 0.25 * soft_or_better + 0.35 * mean_cka)
    by_prompt: dict[str, list] = {}
    for obs in report_behavior.observations:
        by_prompt.setdefault(obs.prompt_id, []).append(obs)

    prompt_rows = []
    stream = []
    global_offset = 0
    span_global = {}
    for prompt in prompts:
        pid = prompt["id"]
        observations = by_prompt.get(pid, [])
        series = []
        for obs in observations:
            target = prompt["tokens"][obs.k + 1] if obs.k + 1 < len(prompt["tokens"]) else ""
            point = _obs_dict(obs, target)
            point["globalK"] = global_offset + obs.k
            series.append(point)
            stream.append(
                {
                    "global_k": point["globalK"],
                    "jsd": obs.jsd_bits,
                    "threshold": obs.online_threshold,
                    "promptId": pid,
                    "flagged": obs.flagged,
                    "kind": obs.kind,
                }
            )
        span_global[pid] = global_offset
        prompt_rows.append(
            {
                "id": pid,
                "file": prompt["file"],
                "line": prompt["line"],
                "text": prompt["text"],
                "role": prompt["role"],
                "tokens": prompt["tokens"],
                "series": series,
            }
        )
        global_offset += len(observations)

    spans = []
    for index, span in enumerate(report_behavior.spans):
        offset = span_global[span.prompt_id]
        spans.append(
            {
                "promptId": span.prompt_id,
                "file": span.file,
                "line": span.line,
                "start": span.start,
                "end": span.end,
                "global_start": offset + span.start,
                "global_end": offset + span.end,
                "kind": span.kind,
                "peak_jsd": span.peak_jsd,
                "mean_jsd": span.mean_jsd,
                "snippet": span.snippet,
                "predictionA": span.prediction_a,
                "predictionB": span.prediction_b,
                "highlight": index < 5,
                "annotate": index < 3,
            }
        )

    layers = [
        {
            "name": layer.name,
            "depth": layer.depth,
            "cka": layer.cka,
            "residual": layer.residual_fraction,
            "insampleResidual": layer.insample_residual,
            "r2AB": layer.r2_a_to_b,
            "r2BA": layer.r2_b_to_a,
            "orthogonalResidual": layer.orthogonal_residual,
            "samples": layer.n_samples,
            "widthA": layer.width_a,
            "widthB": layer.width_b,
        }
        for layer in report_alignment.layers
    ]
    return {
        "product": "Meridian",
        "models": models_meta,
        "macro": {
            "overlap_score": overlap,
            "top1_identical_pct": report_behavior.identical_pct,
            "soft_parity_pct": report_behavior.soft_pct,
            "hard_conflict_pct": report_behavior.conflict_pct,
            "shared_latent_pct": 100.0 * report_alignment.shared,
            "model_a_unique_pct": 100.0 * report_alignment.unique_a,
            "model_b_unique_pct": 100.0 * report_alignment.unique_b,
            "mean_cka": mean_cka,
            "mean_residual_fraction": report_alignment.mean_residual_fraction,
            "mean_r2_a_to_b": report_alignment.mean_r2_a_to_b,
            "mean_r2_b_to_a": report_alignment.mean_r2_b_to_a,
            "mean_orthogonal_residual": report_alignment.mean_orthogonal_residual,
            "background_mu": report_behavior.background_mu,
            "background_sigma": report_behavior.background_sigma,
            "power_floor": report_behavior.power_floor,
            "cert_threshold": report_behavior.cert_threshold,
            "uncertain_threshold": report_behavior.uncertain_threshold,
            "n_tokens": len(report_behavior.observations),
            "n_spans": len(report_behavior.spans),
            "lms_weights": report_behavior.lms_weights,
        },
        "layers": layers,
        "prompts": prompt_rows,
        "stream": stream,
        "spans": spans,
        "top_spans": spans[:5],
        "hook_log": hook_log,
        "verification": verification,
        "definitions": {
            "overlap": (
                "Macro overlap = 100 × (0.40 × top-1 agreement + 0.25 × soft-or-better rate "
                "+ 0.35 × mean linear CKA). Soft-or-better counts identical top-1 and top-5 overlap."
            ),
            "buckets": (
                "Identical: same top-1 next token. Soft parity: top-1 differs but the top-5 sets intersect. "
                "Hard conflict: the top-5 sets are disjoint. The three rates sum to 100%."
            ),
            "jsd": (
                "At each position, symmetric Jensen-Shannon divergence (bits) is computed on the union of "
                "the two top-K supports plus a residual OTHER bin. Divergence power is JSD squared. "
                "J(k) is the EMA of that power."
            ),
            "threshold": (
                "μ and σ are seeded with a robust estimate (median and MAD) on positions where top-1 agrees, "
                "then a slow EMA updates them only while the stream is unflagged. A position opens a span "
                "when power exceeds μ + 3σ and an absolute floor of (0.08 bits)². The span stays open "
                "until power falls under μ + σ."
            ),
            "kinds": (
                "Lost / forgotten: A's normalized entropy ≤ 0.22 and B's ≥ 0.30. "
                "Acquired: B ≤ 0.22 and A ≥ 0.30. "
                "Conflict: both ≤ 0.22 and the top-1 tokens differ. "
                "Drift: flagged, but neither certainty pattern. Normalized entropy is H / ln(vocab)."
            ),
            "cka": (
                "Linear CKA compares column-centered hidden states with the Gram form of HSIC. "
                "It is invariant to orthogonal rotation and isotropic scaling."
            ),
            "residual": (
                "Unlearnable residual fraction = held-out Var(h_B − h_A W) / Var(h_B). "
                "W is refit on complementary token folds so a wide layer cannot interpolate. "
                "In-sample residual is also logged. λ = 0.05 · tr(XᵀX) / width. "
                "The pie uses shared = mean predictive R², A-unique = 1 − R²(B→A), B-unique = 1 − R²(A→B), normalized to 100%."
            ),
        },
    }


def _count_params(model: nn.Module) -> int:
    return sum(param.numel() for param in model.parameters())


def verify_hooks(width: int, vocab: int) -> dict:
    torch.manual_seed(0)
    model_a = TinyCausalLM(vocab, width, n_layers=2, n_heads=4)
    model_b = TinyCausalLM(vocab, width, n_layers=2, n_heads=4)
    model_a.eval()
    model_b.eval()
    ids = torch.randint(0, vocab, (1, 5))
    with ModelPairInspector(model_a, model_b) as inspector:
        attached = inspector.hook_count
        if attached < 4:
            raise AssertionError(f"expected hooks on embed + blocks, attached {attached}")
        forward_logits(model_a, ids)
        forward_logits(model_b, ids)
        inspector.consume()
        embed = inspector.captured_a.get("embed")
        if not embed or embed[0].shape != (5, width):
            raise AssertionError(f"embed capture shape {None if not embed else embed[0].shape}")
        if not inspector.captured_b.get("block.1"):
            raise AssertionError("model B deep block was not captured")
        retained = len(inspector.captured_a["embed"])
    if inspector.hook_count != 0:
        raise AssertionError("hooks survived the context manager")
    forward_logits(model_a, ids)
    if len(inspector.captured_a["embed"]) != retained:
        raise AssertionError("a forward after exit still wrote activations")
    inspector.assert_released()
    return {"hooks_attached": attached, "hooks_released": True, "retained_rows": retained}


def _dtype_name(dtype: torch.dtype) -> str:
    return str(dtype).replace("torch.", "")


def run_synthetic(device_mode: str, dtype_preference: str) -> dict:
    alignment_stats = alignment_self_test()
    behavior_stats = behavior_self_test()
    hook_stats = verify_hooks(width=32, vocab=24)

    lines = load_lines(CORPUS)
    vocab = WordVocab([row["text"] for row in lines])
    encoded = []
    for row in lines:
        ids = vocab.encode(row["text"])
        row = dict(row)
        row["ids"] = ids
        row["tokens"] = [vocab.id_to_token[index] for index in ids]
        row["id"] = f"{row['file']}:{row['line']}"
        encoded.append(row)

    def batch(role: str) -> list[torch.Tensor]:
        return [torch.tensor(row["ids"], dtype=torch.long).unsqueeze(0) for row in encoded if row["role"] == role]

    torch.manual_seed(7)
    width, layers, heads = 64, 4, 4
    model_a = TinyCausalLM(vocab.size, width, layers, heads)
    shared_loss = train_sequences(model_a, batch("shared"), steps=60, lr=6e-3)
    model_b = TinyCausalLM(vocab.size, width, layers, heads)
    model_b.load_state_dict(model_a.state_dict())
    set_prefix_frozen(model_a, frozen_blocks=1)
    set_prefix_frozen(model_b, frozen_blocks=1)
    archive_loss = train_sequences(model_a, batch("archive") + batch("shared"), steps=45, lr=4e-3)
    acquired_loss = train_sequences(model_b, batch("acquired") + batch("shared"), steps=45, lr=4e-3)

    device_a, device_b = select_devices(device_mode)
    dtype_a = select_dtype(device_a, dtype_preference)
    dtype_b = select_dtype(device_b, dtype_preference)
    model_a.to(device_a)
    model_b.to(device_b)
    # Prove the requested low-precision path, then fall back if a CPU kernel is missing.
    dtype_a, dtype_b = _maybe_cast(model_a, dtype_a, device_a), _maybe_cast(model_b, dtype_b, device_b)
    model_a.eval()
    model_b.eval()

    sequences = []
    hook_log: list[str] = []
    with torch.no_grad():
        with ModelPairInspector(model_a, model_b) as inspector:
            hook_log.extend(inspector.hook_log)
            for row in encoded:
                ids_a = torch.tensor(row["ids"], dtype=torch.long, device=device_a).unsqueeze(0)
                ids_b = torch.tensor(row["ids"], dtype=torch.long, device=device_b).unsqueeze(0)
                logits_a = forward_logits(model_a, ids_a)
                logits_b = forward_logits(model_b, ids_b)
                inspector.consume()
                sequences.append(
                    {
                        "prompt_id": row["id"],
                        "file": row["file"],
                        "line": row["line"],
                        "tokens": row["tokens"],
                        "logits_a": logits_a[0].detach().float().cpu().numpy(),
                        "logits_b": logits_b[0].detach().float().cpu().numpy(),
                    }
                )
            attached_live = inspector.hook_count
        hook_log.extend(inspector.hook_log)
    inspector.assert_released()

    names = list(inspector.captured_a.keys())
    activations_a = [inspector.captured_a[name] for name in names]
    activations_b = [inspector.captured_b[name] for name in names]
    alignment = RepresentationalAlignmentAuditor().evaluate(activations_a, activations_b, names=names)
    tracker = LMSBehaviorTracker(top_k=8, id_to_token={i: t for i, t in enumerate(vocab.id_to_token)})
    behavior = tracker.analyze(sequences)

    verification = {
        **alignment_stats,
        **behavior_stats,
        **hook_stats,
        "live_hooks_attached": attached_live,
        "live_hooks_released": True,
        "shared_loss": shared_loss,
        "archive_loss": archive_loss,
        "acquired_loss": acquired_loss,
        "dtype_a": _dtype_name(dtype_a),
        "dtype_b": _dtype_name(dtype_b),
        "device_a": str(device_a),
        "device_b": str(device_b),
    }
    models = {
        "a": {
            "name": "synthetic://base-then-archive",
            "label": "Model A · reference + archive",
            "params": _count_params(model_a),
            "layers": layers,
            "width": width,
            "vocab": vocab.size,
            "dtype": _dtype_name(dtype_a),
            "device": str(device_a),
            "note": "Trained on shared ops, then specialized on archive doctrine. Embedding and block 0 stay frozen at the shared checkpoint.",
        },
        "b": {
            "name": "synthetic://base-then-protocol",
            "label": "Model B · reference + protocol",
            "params": _count_params(model_b),
            "layers": layers,
            "width": width,
            "vocab": vocab.size,
            "dtype": _dtype_name(dtype_b),
            "device": str(device_b),
            "note": "Copied from A after shared training, then specialized on the acquired protocol. Same frozen prefix, so early geometry should match and late blocks should move.",
        },
        "pair": "Controlled synthetic checkpoints. The same hook, CKA, residual, and JSD path runs on Hugging Face weights via --model-a / --model-b.",
    }
    briefing = build_briefing(alignment, behavior, encoded, models, verification, hook_log)
    _sanity_story(briefing)
    return _jsonable(briefing)


def _maybe_cast(model: nn.Module, dtype: torch.dtype, device: torch.device) -> torch.dtype:
    if dtype == torch.float32:
        return dtype
    cast_floating(model, dtype)
    probe = torch.zeros(1, 4, dtype=torch.long, device=device)
    try:
        with torch.no_grad():
            model(probe)
        return dtype
    except Exception:
        model.float()
        return torch.float32


def _sanity_story(briefing: dict) -> None:
    """The harness is only useful if archive and protocol actually separate."""

    def mean_jsd(role: str) -> float:
        vals = [point["jsd"] for prompt in briefing["prompts"] if prompt["role"] == role for point in prompt["series"]]
        if not vals:
            raise AssertionError(f"no tokens for role {role}")
        return float(sum(vals) / len(vals))

    shared = mean_jsd("shared")
    archive = mean_jsd("archive")
    acquired = mean_jsd("acquired")
    if not (archive > shared + 0.05 and acquired > shared + 0.05):
        raise AssertionError(
            f"specialization did not separate the streams: shared {shared:.3f}, "
            f"archive {archive:.3f}, acquired {acquired:.3f}"
        )
    cka = [layer["cka"] for layer in briefing["layers"]]
    if cka[0] + 0.02 < cka[-1]:
        raise AssertionError(f"expected early CKA to hold up relative to the last block, got {cka}")


def run_hf_pair(name_a: str, name_b: str, prompts: list[str], device_mode: str, dtype_preference: str) -> dict:
    """Same inspector path on two pretrained causal LMs. Prompts are raw strings."""

    device_a, device_b = select_devices(device_mode)
    dtype_a = select_dtype(device_a, dtype_preference)
    dtype_b = select_dtype(device_b, dtype_preference)
    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained(name_a)
    model_a = load_hf_causal_lm(name_a, device_a, dtype_a)
    model_b = load_hf_causal_lm(name_b, device_b, dtype_b)
    sequences = []
    encoded_prompts = []
    hook_log: list[str] = []
    with torch.no_grad():
        with ModelPairInspector(model_a, model_b) as inspector:
            hook_log.extend(inspector.hook_log)
            for index, text in enumerate(prompts, start=1):
                ids = tokenizer(text, return_tensors="pt").input_ids
                tokens = tokenizer.convert_ids_to_tokens(ids[0].tolist())
                logits_a = forward_logits(model_a, ids.to(device_a))
                logits_b = forward_logits(model_b, ids.to(device_b))
                inspector.consume()
                pid = f"prompt:{index}"
                encoded_prompts.append(
                    {
                        "id": pid,
                        "file": "prompts.txt",
                        "line": index,
                        "text": text,
                        "role": "user",
                        "tokens": [token.replace("Ġ", " ").replace("▁", " ").strip() or token for token in tokens],
                        "ids": ids[0].tolist(),
                    }
                )
                sequences.append(
                    {
                        "prompt_id": pid,
                        "file": "prompts.txt",
                        "line": index,
                        "tokens": encoded_prompts[-1]["tokens"],
                        "logits_a": logits_a[0].detach().float().cpu().numpy(),
                        "logits_b": logits_b[0].detach().float().cpu().numpy(),
                    }
                )
        hook_log.extend(inspector.hook_log)
    inspector.assert_released()
    names = list(inspector.captured_a.keys())
    # Pair by depth inside the auditor; names follow model A when counts match.
    if len(inspector.captured_b) != len(names):
        names = None
        acts_a = list(inspector.captured_a.values())
        acts_b = list(inspector.captured_b.values())
    else:
        acts_a = [inspector.captured_a[name] for name in names]
        acts_b = [inspector.captured_b[name] for name in names]
    alignment = RepresentationalAlignmentAuditor().evaluate(acts_a, acts_b, names=names)
    id_to_token = {index: tokenizer.convert_ids_to_tokens([index])[0] for index in range(tokenizer.vocab_size)}
    behavior = LMSBehaviorTracker(top_k=8, id_to_token=id_to_token).analyze(sequences)
    models = {
        "a": {"name": name_a, "label": name_a, "params": _count_params(model_a), "dtype": _dtype_name(dtype_a), "device": str(device_a), "note": "Hugging Face checkpoint"},
        "b": {"name": name_b, "label": name_b, "params": _count_params(model_b), "dtype": _dtype_name(dtype_b), "device": str(device_b), "note": "Hugging Face checkpoint"},
        "pair": "Pretrained causal language models.",
    }
    verification = {"hooks_released": True, "dtype_a": _dtype_name(dtype_a), "dtype_b": _dtype_name(dtype_b)}
    return _jsonable(build_briefing(alignment, behavior, encoded_prompts, models, verification, hook_log))


def write_outputs(briefing: dict, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    public = ROOT / "public"
    data_dir = ROOT / "src" / "data"
    public.mkdir(parents=True, exist_ok=True)
    data_dir.mkdir(parents=True, exist_ok=True)
    chart = render_comparison_report(briefing, out_dir / "comparison_report.png")
    public_chart = public / "comparison_report.png"
    public_chart.write_bytes(chart.read_bytes())
    payload = json.dumps(briefing, indent=2)
    (out_dir / "briefing.json").write_text(payload + "\n", encoding="utf-8")
    (data_dir / "briefing.json").write_text(payload + "\n", encoding="utf-8")
    ts = (
        'import type { Briefing } from "./types";\n\n'
        f"const briefing = {payload} as Briefing;\n\n"
        "export default briefing;\n"
    )
    (data_dir / "briefing.ts").write_text(ts, encoding="utf-8")
    briefing["verification"]["chart_bytes"] = chart.stat().st_size
    return chart


def print_summary(briefing: dict) -> None:
    macro = briefing["macro"]
    models = briefing["models"]
    print()
    print("MERIDIAN  ·  checkpoint comparison")
    print(f"  A  {models['a']['name']}  ({models['a'].get('dtype')}, {models['a'].get('device')})")
    print(f"  B  {models['b']['name']}  ({models['b'].get('dtype')}, {models['b'].get('device')})")
    print()
    print(f"  {'Macro overlap':<28} {macro['overlap_score']:6.1f}%")
    print(f"  {'Top-1 identical':<28} {macro['top1_identical_pct']:6.1f}%")
    print(f"  {'Soft parity (top-5 overlap)':<28} {macro['soft_parity_pct']:6.1f}%")
    print(f"  {'Hard conflict':<28} {macro['hard_conflict_pct']:6.1f}%")
    print(f"  {'Shared latent architecture':<28} {macro['shared_latent_pct']:6.1f}%")
    print(f"  {'A-unique / deprecated':<28} {macro['model_a_unique_pct']:6.1f}%")
    print(f"  {'B-unique / acquired':<28} {macro['model_b_unique_pct']:6.1f}%")
    print(f"  {'Mean linear CKA':<28} {macro['mean_cka']:6.3f}")
    print(f"  {'Residual variance floor':<28} {macro['mean_residual_fraction']:6.3f}")
    print()
    print("  Top divergence spans")
    print(f"  {'#':<3} {'Kind':<10} {'Where':<34} {'Offsets':<12} {'Peak':>6}  Snippet")
    for index, span in enumerate(briefing["top_spans"], start=1):
        where = f"{span['file']}:{span['line']}"
        offsets = f"{span['start']}–{span['end']}"
        snippet = span["snippet"][:48]
        print(f"  {index:<3} {span['kind']:<10} {where:<34} {offsets:<12} {span['peak_jsd']:6.3f}  {snippet}")
    if not briefing["top_spans"]:
        print("  (none — no position crossed μ + 3σ)")
    print()
    checks = briefing["verification"]
    print(
        "  Verification  "
        f"CKA(linear)={checks.get('cka_linear')}  "
        f"JSD(P,P)={checks.get('jsd_identical')}  "
        f"hooks_released={checks.get('hooks_released') or checks.get('live_hooks_released')}"
    )
    print()


def main(argv: list[str] | None = None) -> dict:
    import argparse

    parser = argparse.ArgumentParser(description="Compare two causal language models.")
    parser.add_argument("--model-a", default="synthetic://base-then-archive")
    parser.add_argument("--model-b", default="synthetic://base-then-protocol")
    parser.add_argument("--device", default="auto", choices=("auto", "cpu", "cuda", "split"))
    parser.add_argument("--dtype", default="auto", choices=("auto", "fp32", "fp16", "bf16"))
    parser.add_argument("--prompts", default="", help="Text file of prompts, one per line, for HF models.")
    parser.add_argument("--out", default=str(ROOT / "artifacts"))
    args = parser.parse_args(argv)
    torch.set_num_threads(max(1, min(2, torch.get_num_threads())))
    synthetic = args.model_a.startswith("synthetic://") and args.model_b.startswith("synthetic://")
    if synthetic:
        briefing = run_synthetic(args.device, args.dtype)
    else:
        if not args.prompts:
            raise SystemExit("HF comparison needs --prompts file with one string per line")
        texts = [
            line.strip()
            for line in Path(args.prompts).read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        briefing = run_hf_pair(args.model_a, args.model_b, texts, args.device, args.dtype)
    chart = write_outputs(briefing, Path(args.out))
    print_summary(briefing)
    print(f"  Chart  {chart}")
    return briefing
