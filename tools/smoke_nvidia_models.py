#!/usr/bin/env python
"""Smoke-test selected NVIDIA Build/NIM model keys without printing secrets.

This is a manual integration helper. It reads local .env, makes tiny real calls,
and prints only status/response-shape summaries.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"


def load_dotenv() -> None:
    if not ENV_PATH.exists():
        return
    for raw in ENV_PATH.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def key(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value or value == "***":
        raise RuntimeError(f"missing {name}")
    return value


def post_json(url: str, api_key: str, payload: dict[str, Any], timeout: int = 240) -> tuple[int, dict[str, Any] | list[Any] | str]:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as res:
        body = res.read().decode("utf-8", errors="replace")
        try:
            parsed: dict[str, Any] | list[Any] | str = json.loads(body)
        except json.JSONDecodeError:
            parsed = body[:300]
        return res.status, parsed


def summarize_json(parsed: dict[str, Any] | list[Any] | str) -> str:
    if isinstance(parsed, dict):
        keys = list(parsed)[:8]
        extra = ""
        if isinstance(parsed.get("choices"), list):
            extra = f", choices={len(parsed['choices'])}"
        if isinstance(parsed.get("data"), list):
            extra = f", data={len(parsed['data'])}"
        if isinstance(parsed.get("artifacts"), list):
            extra = f", artifacts={len(parsed['artifacts'])}"
        return f"dict keys={keys}{extra}"
    if isinstance(parsed, list):
        return f"list len={len(parsed)}"
    return f"text len={len(parsed)}"


IMAGE_PAYLOAD = {
    "prompt": "simple child-safe icon of a yellow chick, no text",
    "mode": "base",
    "cfg_scale": 2.5,
    "width": 768,
    "height": 768,
    "seed": 7,
    "steps": 5,
}
TINY_PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAJklEQVR4nO3NMQ0AAAwDoPo33arYsQQMkB6LQCAQCAQCgUAg+BIMi1X0pjxKe0gAAAAASUVORK5CYII="

TESTS = {
    "qwen-image": {
        "key_env": "NVIDIA_QWEN_IMAGE_API_KEY",
        "url": "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev",
        "payload": IMAGE_PAYLOAD,
    },
    "qwen-image-edit": {
        "key_env": "NVIDIA_QWEN_IMAGE_EDIT_API_KEY",
        "url": "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev",
        "payload": IMAGE_PAYLOAD,
    },
    "flux.1-dev": {
        "key_env": "NVIDIA_FLUX_1_DEV_API_KEY",
        "url": "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev",
        "payload": IMAGE_PAYLOAD,
    },
    "llama-nemotron-embed-1b-v2": {
        "key_env": "NVIDIA_LLAMA_NEMOTRON_EMBED_1B_V2_API_KEY",
        "url": "https://integrate.api.nvidia.com/v1/embeddings",
        "payload": {"model": "nvidia/llama-nemotron-embed-1b-v2", "input": ["한글 카드"], "input_type": "query"},
    },
    "llama-nemotron-rerank-1b-v2": {
        "key_env": "NVIDIA_LLAMA_NEMOTRON_RERANK_1B_V2_API_KEY",
        "url": "https://ai.api.nvidia.com/v1/retrieval/nvidia/llama-nemotron-rerank-1b-v2/reranking",
        "payload": {"model": "nvidia/llama-nemotron-rerank-1b-v2", "query": {"text": "한글 학습"}, "passages": [{"text": "아이에게 모음을 알려주는 카드"}, {"text": "자동차 정비 설명서"}]},
    },
    "llama-3.1-nemotron-nano-vl-8b-v1": {
        "key_env": "NVIDIA_LLAMA_3_1_NEMOTRON_NANO_VL_8B_V1_API_KEY",
        "url": "https://integrate.api.nvidia.com/v1/chat/completions",
        "payload": {"model": "nvidia/llama-3.1-nemotron-nano-vl-8b-v1", "messages": [{"role": "user", "content": "Reply with exactly OK."}], "max_tokens": 8, "temperature": 0},
    },
    "nemotron-ocr-v2": {
        "key_env": "NVIDIA_NEMOTRON_OCR_V2_API_KEY",
        "url": "https://ai.api.nvidia.com/v1/cv/nvidia/nemotron-ocr-v2",
        "payload": {"input": [{"type": "image_url", "url": TINY_PNG_DATA_URL}]},
    },
    "nemotron-3-content-safety": {
        "key_env": "NVIDIA_NEMOTRON_3_CONTENT_SAFETY_API_KEY",
        "url": "https://integrate.api.nvidia.com/v1/chat/completions",
        "payload": {"model": "nvidia/nemotron-3-content-safety", "messages": [{"role": "user", "content": "Classify this child-safe phrase: 안녕 하니"}], "max_tokens": 32, "temperature": 0},
    },
}


def run_one(name: str) -> None:
    cfg = TESTS[name]
    try:
        status, parsed = post_json(cfg["url"], key(cfg["key_env"]), cfg["payload"])
        print(f"{name}: OK http={status} {summarize_json(parsed)}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:400].replace("\n", " ")
        print(f"{name}: FAIL http={exc.code} {detail}")
    except Exception as exc:
        print(f"{name}: FAIL {type(exc).__name__}: {str(exc)[:400]}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("models", nargs="*", default=list(TESTS), choices=sorted(TESTS))
    args = parser.parse_args()
    load_dotenv()
    for name in args.models:
        run_one(name)


if __name__ == "__main__":
    main()
