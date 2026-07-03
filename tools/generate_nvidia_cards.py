#!/usr/bin/env python
"""Generate Hanguel learning-card assets through NVIDIA Build/NIM.

Security rules:
- Reads secrets only from local .env / process env.
- Never prints the API key.
- Writes generated image files under assets/generated-cards/.
- Unit/static tests should use --dry-run; live calls require --live.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import textwrap
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "generated-cards"
ENV_PATH = ROOT / ".env"
DEFAULT_ENDPOINT = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev"
DEFAULT_MODEL_KEY = "qwen-image"
MODEL_ENV_PREFIXES = {
    # Keep only NVIDIA models that passed real smoke calls for Hanguel.
    # Resolves model-specific *_API_KEY / _ENDPOINT / _MODEL before generic NVIDIA_API_KEY.
    "flux.1-dev": "NVIDIA_FLUX_1_DEV",
    "qwen-image": "NVIDIA_QWEN_IMAGE",
    "qwen-image-edit": "NVIDIA_QWEN_IMAGE_EDIT",
}


@dataclass(frozen=True)
class NvidiaConfig:
    api_key: str
    endpoint: str
    model: str
    api_key_env: str
    endpoint_env: str
    model_env: str


CARD_SPECS = [
    {
        "id": "hani-postbox",
        "korean_text": "하니",
        "label": "별빛 우체국의 하니",
        "filename": "hani-postbox.svg",
        "prompt": "Warm hand-drawn Korean picture-book learning card for a 4-year-old child. A small yellow chick mascot named Hani stands beside a cozy red star-mailbox in Hangul village. Include one large clean Korean word '하니' on a wooden sign. Soft paper texture, rounded shapes, no photorealism, child-safe, iPad landscape app asset.",
    },
    {
        "id": "letter-a",
        "korean_text": "ㅏ",
        "label": "모음 ㅏ 카드",
        "filename": "letter-a.svg",
        "prompt": "Korean Hangul learning flashcard for preschool. Center one large accurate Korean vowel 'ㅏ' as friendly rounded lettering, with a tiny sunbeam and Hani chick nearby. Minimal background, warm hand-drawn picture-book style, high contrast, no extra text.",
    },
    {
        "id": "word-oi",
        "korean_text": "오이",
        "label": "오이 단어 카드",
        "filename": "word-oi.svg",
        "prompt": "Korean word learning card for preschool. Show a cute cucumber and one large clean Korean word '오이'. Hand-drawn picture-book style, soft colors, simple composition, readable Hangul, no other text.",
    },
]


def load_dotenv(path: Path = ENV_PATH) -> None:
    """Small .env loader to avoid adding a dependency just for local secrets."""
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def non_placeholder(value: str | None) -> str:
    if not value:
        return ""
    value = value.strip()
    if value == "***" or "실제키" in value or "여기에" in value:
        return ""
    return value


def resolve_nvidia_config(model_key: str = DEFAULT_MODEL_KEY) -> NvidiaConfig:
    """Resolve model-specific NVIDIA env first, then fall back to generic vars."""
    prefix = MODEL_ENV_PREFIXES.get(model_key, MODEL_ENV_PREFIXES[DEFAULT_MODEL_KEY])
    api_key_env = f"{prefix}_API_KEY"
    endpoint_env = f"{prefix}_ENDPOINT"
    model_env = f"{prefix}_MODEL"

    api_key = non_placeholder(os.environ.get(api_key_env)) or non_placeholder(os.environ.get("NVIDIA_API_KEY"))
    endpoint = non_placeholder(os.environ.get(endpoint_env)) or non_placeholder(os.environ.get("NVIDIA_IMAGE_ENDPOINT")) or DEFAULT_ENDPOINT
    model = non_placeholder(os.environ.get(model_env)) or non_placeholder(os.environ.get("NVIDIA_IMAGE_MODEL")) or model_key

    return NvidiaConfig(
        api_key=api_key,
        endpoint=endpoint,
        model=model,
        api_key_env=api_key_env if api_key == non_placeholder(os.environ.get(api_key_env)) else "NVIDIA_API_KEY",
        endpoint_env=endpoint_env if endpoint == non_placeholder(os.environ.get(endpoint_env)) else "NVIDIA_IMAGE_ENDPOINT",
        model_env=model_env if model == non_placeholder(os.environ.get(model_env)) else "NVIDIA_IMAGE_MODEL",
    )


def build_payload(prompt: str) -> dict[str, Any]:
    return {
        "prompt": prompt,
        "mode": "base",
        "width": 1024,
        "height": 1024,
        "cfg_scale": 3.5,
        "steps": 30,
        "seed": 20260630,
    }


def extract_image_bytes(response_json: dict[str, Any]) -> bytes:
    """Accept common NVIDIA/partner image response shapes."""
    candidates: list[Any] = []
    for key in ("image", "b64_json", "data"):
        if key in response_json:
            candidates.append(response_json[key])
    if isinstance(response_json.get("artifacts"), list):
        candidates.extend(response_json["artifacts"])
    if isinstance(response_json.get("images"), list):
        candidates.extend(response_json["images"])

    for item in candidates:
        if isinstance(item, str):
            if item.startswith("data:image"):
                item = item.split(",", 1)[1]
            try:
                return base64.b64decode(item, validate=False)
            except Exception:
                continue
        if isinstance(item, dict):
            for key in ("base64", "b64_json", "image", "data"):
                val = item.get(key)
                if isinstance(val, str):
                    if val.startswith("data:image"):
                        val = val.split(",", 1)[1]
                    try:
                        return base64.b64decode(val, validate=False)
                    except Exception:
                        pass
            url = item.get("url")
            if isinstance(url, str) and url.startswith("http"):
                with urllib.request.urlopen(url, timeout=60) as res:
                    return res.read()
    raise ValueError("Could not find image bytes in NVIDIA response")


def call_nvidia(endpoint: str, api_key: str, prompt: str) -> bytes:
    data = json.dumps(build_payload(prompt)).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as res:
            body = res.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:1000]
        raise RuntimeError(f"NVIDIA request failed with HTTP {exc.code}: {detail}") from exc
    return extract_image_bytes(json.loads(body))


def placeholder_svg(spec: dict[str, str]) -> str:
    text = spec["korean_text"]
    title = spec["label"]
    return textwrap.dedent(f"""\
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="{title}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff4d8"/><stop offset="1" stop-color="#ffe2ee"/></linearGradient>
        <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="7"/><feColorMatrix type="saturate" values="0.15"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
      </defs>
      <rect width="1024" height="1024" rx="84" fill="url(#bg)"/>
      <circle cx="806" cy="188" r="92" fill="#ffd15c" opacity=".72"/>
      <ellipse cx="512" cy="742" rx="330" ry="86" fill="#000" opacity=".06"/>
      <text x="512" y="515" text-anchor="middle" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="250" font-weight="900" fill="#3b2f2f">{text}</text>
      <text x="512" y="648" text-anchor="middle" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="54" font-weight="800" fill="#7a5544">{title}</text>
      <g transform="translate(150 650)">
        <ellipse cx="95" cy="95" rx="78" ry="72" fill="#ffd64d" stroke="#3b2f2f" stroke-width="12"/>
        <circle cx="70" cy="78" r="9" fill="#3b2f2f"/><circle cx="116" cy="78" r="9" fill="#3b2f2f"/>
        <path d="M91 92 L126 107 L91 122 Z" fill="#ff8d45" stroke="#3b2f2f" stroke-width="8"/>
        <path d="M48 28 Q95 -18 142 28" fill="none" stroke="#3b2f2f" stroke-width="12" stroke-linecap="round"/>
      </g>
      <rect x="96" y="96" width="832" height="832" rx="72" fill="none" stroke="#fff" stroke-width="24" opacity=".65"/>
    </svg>
    """)


def write_manifest(records: list[dict[str, Any]]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "source": "nvidia-build-pipeline",
        "note": "Placeholder SVGs are safe static defaults; live NVIDIA generations can overwrite image files locally.",
        "cards": records,
    }
    (OUT_DIR / "cards.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def generate(dry_run: bool, live: bool, only: str | None = None, model_key: str = DEFAULT_MODEL_KEY) -> None:
    load_dotenv()
    config = resolve_nvidia_config(model_key)
    if live and not config.api_key:
        raise SystemExit(
            f"{config.api_key_env} is missing. Put the model-specific key in local .env "
            "or set NVIDIA_API_KEY as a fallback; do not commit .env."
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, Any]] = []
    specs = [s for s in CARD_SPECS if only in (None, s["id"])]
    for spec in specs:
        out = OUT_DIR / spec["filename"]
        if live and not dry_run:
            image_bytes = call_nvidia(config.endpoint, config.api_key, spec["prompt"])
            png_path = out.with_suffix(".png")
            png_path.write_bytes(image_bytes)
            image_path = png_path
        else:
            out.write_text(placeholder_svg(spec), encoding="utf-8")
            image_path = out
        records.append({
            "id": spec["id"],
            "korean_text": spec["korean_text"],
            "label": spec["label"],
            "image": str(image_path.relative_to(ROOT)).replace("\\", "/"),
            "prompt": spec["prompt"],
            "provider": "nvidia-build",
            "model": config.model,
        })
    write_manifest(records)
    print(f"wrote {len(records)} card record(s) under {OUT_DIR.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="write placeholder SVGs and manifest without calling NVIDIA")
    parser.add_argument("--live", action="store_true", help="call NVIDIA using a model-specific *_API_KEY from .env/environment, with NVIDIA_API_KEY fallback")
    parser.add_argument("--only", help="generate one card id")
    parser.add_argument("--model-key", default=DEFAULT_MODEL_KEY, choices=sorted(MODEL_ENV_PREFIXES), help="NVIDIA model env group to use")
    args = parser.parse_args()
    generate(dry_run=args.dry_run or not args.live, live=args.live, only=args.only, model_key=args.model_key)


if __name__ == "__main__":
    main()
