"""Paired forward-hook capture with guaranteed detach on the way out."""

from __future__ import annotations

from collections.abc import Callable, Iterable
from typing import Any

import numpy as np
import torch
import torch.nn as nn


LayerTap = tuple[str, nn.Module]


def discover_taps(model: nn.Module) -> list[LayerTap]:
    """Find an embedding tap plus every transformer block, across common HF layouts."""

    taps: list[LayerTap] = []
    embed = _first_module(
        model,
        (
            "embed_tap",
            "embed",
            "model.embed_tokens",
            "transformer.wte",
            "model.decoder.embed_tokens",
            "gpt_neox.embed_in",
        ),
    )
    if embed is not None:
        taps.append(("embed", embed))
    blocks = _first_module(
        model,
        (
            "blocks",
            "model.layers",
            "transformer.h",
            "model.decoder.layers",
            "gpt_neox.layers",
            "transformer.layers",
        ),
    )
    if blocks is None:
        raise ValueError(
            "Could not find transformer blocks. Expected .blocks, .model.layers, or .transformer.h."
        )
    if not isinstance(blocks, Iterable):
        raise ValueError("Located block container is not iterable")
    for index, block in enumerate(blocks):
        if not isinstance(block, nn.Module):
            raise ValueError(f"Block {index} is not an nn.Module")
        taps.append((f"block.{index}", block))
    if len(taps) < 2 and embed is None:
        raise ValueError("No hookable layers were discovered")
    return taps


def _first_module(root: nn.Module, paths: tuple[str, ...]) -> nn.Module | None:
    for path in paths:
        current: Any = root
        ok = True
        for part in path.split("."):
            if not hasattr(current, part):
                ok = False
                break
            current = getattr(current, part)
        if ok and isinstance(current, nn.Module):
            return current
    return None


def select_devices(mode: str) -> tuple[torch.device, torch.device]:
    """Route both checkpoints to cuda, cpu, or a dual-device split."""

    requested = mode.lower()
    cuda = torch.cuda.is_available()
    count = torch.cuda.device_count() if cuda else 0
    if requested == "auto":
        requested = "cuda" if cuda else "cpu"
    if requested == "cpu":
        return torch.device("cpu"), torch.device("cpu")
    if requested == "cuda":
        if not cuda:
            raise RuntimeError("CUDA was requested but torch.cuda.is_available() is false")
        device = torch.device("cuda:0")
        return device, device
    if requested == "split":
        if count >= 2:
            return torch.device("cuda:0"), torch.device("cuda:1")
        if count == 1:
            return torch.device("cuda:0"), torch.device("cpu")
        return torch.device("cpu"), torch.device("cpu")
    raise ValueError(f"Unknown device mode '{mode}'")


def select_dtype(device: torch.device, preference: str = "auto") -> torch.dtype:
    """Prefer BF16, then FP16, on CUDA. CPU stays FP32 unless explicitly asked."""

    if preference == "fp32":
        return torch.float32
    if preference == "fp16":
        return torch.float16
    if preference == "bf16":
        return torch.bfloat16
    if device.type == "cuda":
        supported = getattr(torch.cuda, "is_bf16_supported", lambda: False)()
        return torch.bfloat16 if supported else torch.float16
    return torch.float32


def cast_floating(model: nn.Module, dtype: torch.dtype) -> nn.Module:
    if dtype == torch.float32:
        return model
    return model.to(dtype=dtype)


class ModelPairInspector:
    """Capture detached hidden states from two models and always remove hooks.

    Use as a context manager. Activations are copied to CPU float32 inside the
    hook so the autograd graph and the accelerator resident tensor can be freed
    before the next token batch.
    """

    def __init__(
        self,
        model_a: nn.Module,
        model_b: nn.Module,
        taps_a: list[LayerTap] | None = None,
        taps_b: list[LayerTap] | None = None,
    ) -> None:
        self.model_a = model_a
        self.model_b = model_b
        self.taps_a = taps_a if taps_a is not None else discover_taps(model_a)
        self.taps_b = taps_b if taps_b is not None else discover_taps(model_b)
        self._handles: list[torch.utils.hooks.RemovableHandle] = []
        self._open = False
        self.buffers_a: dict[str, list[np.ndarray]] = {}
        self.buffers_b: dict[str, list[np.ndarray]] = {}
        self.captured_a: dict[str, list[np.ndarray]] = {}
        self.captured_b: dict[str, list[np.ndarray]] = {}
        self.hook_log: list[str] = []

    def __enter__(self) -> "ModelPairInspector":
        if self._open:
            raise RuntimeError("Inspector is already entered")
        self._register(self.taps_a, "A", self.buffers_a)
        self._register(self.taps_b, "B", self.buffers_b)
        self._open = True
        self.hook_log.append(f"attached {len(self._handles)} forward hooks")
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        self.close()
        return False

    def close(self) -> None:
        for handle in self._handles:
            handle.remove()
        removed = len(self._handles)
        self._handles.clear()
        self.buffers_a.clear()
        self.buffers_b.clear()
        self._open = False
        if removed:
            self.hook_log.append(f"detached {removed} forward hooks")

    @property
    def hook_count(self) -> int:
        return len(self._handles)

    def _register(self, taps: list[LayerTap], side: str, sink: dict[str, list[np.ndarray]]) -> None:
        for name, module in taps:
            sink.setdefault(name, [])
            handle = module.register_forward_hook(self._make_hook(name, sink))
            self._handles.append(handle)
            self.hook_log.append(f"hook {side}:{name} -> {module.__class__.__name__}")

    @staticmethod
    def _make_hook(name: str, sink: dict[str, list[np.ndarray]]) -> Callable:
        def _hook(_module: nn.Module, _inputs: tuple, output: Any) -> None:
            tensor = _extract_hidden(output)
            # Detach, cast, and copy to host immediately. Do not keep the view.
            host = tensor.detach().to(dtype=torch.float32, device="cpu")
            array = host.numpy()
            if array.ndim == 3:
                # (batch, seq, width) — one row-block per batch element.
                for row in array:
                    sink[name].append(np.array(row, dtype=np.float32, copy=True))
            elif array.ndim == 2:
                sink[name].append(np.array(array, dtype=np.float32, copy=True))
            else:
                raise RuntimeError(f"Hook {name} saw unexpected shape {array.shape}")

        return _hook

    def consume(self) -> None:
        """Move this forward's buffers into the retained store and clear them."""

        if not self._open:
            raise RuntimeError("consume() called after hooks were removed")
        for name, chunks in self.buffers_a.items():
            self.captured_a.setdefault(name, []).extend(chunks)
        for name, chunks in self.buffers_b.items():
            self.captured_b.setdefault(name, []).extend(chunks)
        for chunks in self.buffers_a.values():
            chunks.clear()
        for chunks in self.buffers_b.values():
            chunks.clear()

    def assert_released(self) -> None:
        if self._open or self._handles:
            raise RuntimeError("Hooks are still attached")
        # A forward after release must not grow the retained store.
        before = {key: len(value) for key, value in self.captured_a.items()}
        # Touch modules that previously had hooks by reading hook registries.
        for _, module in self.taps_a + self.taps_b:
            hooks = getattr(module, "_forward_hooks", {})
            if hooks:
                raise RuntimeError(f"{module.__class__.__name__} still has forward hooks: {list(hooks)}")
        after = {key: len(value) for key, value in self.captured_a.items()}
        if before != after:
            raise RuntimeError("Capture store changed during release check")


def _extract_hidden(output: Any) -> torch.Tensor:
    if isinstance(output, torch.Tensor):
        return output
    if isinstance(output, (tuple, list)) and output and isinstance(output[0], torch.Tensor):
        return output[0]
    hidden = getattr(output, "last_hidden_state", None)
    if isinstance(hidden, torch.Tensor):
        return hidden
    raise RuntimeError(f"Cannot pull a hidden tensor from hook output of type {type(output).__name__}")


def forward_logits(model: nn.Module, token_ids: torch.Tensor) -> torch.Tensor:
    """Run a causal LM that either returns logits or a Hugging Face output."""

    with torch.no_grad():
        output = model(token_ids)
    logits = output.logits if hasattr(output, "logits") else output
    if not isinstance(logits, torch.Tensor):
        raise RuntimeError(f"Model returned {type(logits).__name__}, expected logits")
    return logits
