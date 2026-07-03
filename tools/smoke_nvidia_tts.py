#!/usr/bin/env python
"""Smoke and sample generation for active NVIDIA Magpie TTS.

Reads local .env but never prints secrets. Produces a tiny WAV sample under
assets/generated-cards/ for quality checks.
"""
from __future__ import annotations

import argparse
import json
import os
import uuid
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
OUT_DIR = ROOT / "assets" / "generated-cards"
DEFAULT_VOICES_URL = "https://877104f7-e885-42b9-8de8-f6e4c6303969.invocation.api.nvcf.nvidia.com/v1/audio/list_voices"
DEFAULT_SYNTH_URL = "https://877104f7-e885-42b9-8de8-f6e4c6303969.invocation.api.nvcf.nvidia.com/v1/audio/synthesize"
DEFAULT_VOICE = "Magpie-Multilingual.EN-US.Aria"
DEFAULT_LANGUAGE = "en-US"


def load_dotenv() -> None:
    if not ENV_PATH.exists():
        return
    for raw in ENV_PATH.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def env(name: str, default: str = "") -> str:
    value = os.environ.get(name, "").strip()
    if not value or value == "***":
        return default
    return value


def api_key() -> str:
    key = env("NVIDIA_MAGPIE_TTS_MULTILINGUAL_API_KEY") or env("NVIDIA_API_KEY")
    if not key:
        raise RuntimeError("missing NVIDIA_MAGPIE_TTS_MULTILINGUAL_API_KEY or NVIDIA_API_KEY")
    return key


def list_voices(key: str) -> dict:
    url = env("NVIDIA_MAGPIE_TTS_MULTILINGUAL_VOICES_ENDPOINT", DEFAULT_VOICES_URL)
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode("utf-8"))


def flatten_voices(data: dict) -> list[str]:
    voices: list[str] = []
    for group in data.values():
        if isinstance(group, dict) and isinstance(group.get("voices"), list):
            voices.extend(v for v in group["voices"] if isinstance(v, str))
    return voices


def synthesize(key: str, text: str, language: str, voice: str, out_path: Path) -> int:
    boundary = f"----hanguel-{uuid.uuid4().hex}"
    fields = {
        "text": text,
        "language": language,
        "voice": voice,
        "encoding": "LINEAR_PCM",
        "sample_rate_hz": "44100",
    }
    chunks: list[bytes] = []
    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode())
        chunks.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode())
    body = b"".join(chunks)
    url = env("NVIDIA_MAGPIE_TTS_MULTILINGUAL_ENDPOINT", DEFAULT_SYNTH_URL)
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as res:
        audio = res.read()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(audio)
    return len(audio)


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", default="하니야, 아 소리를 따라 말해 보자. 아, 아, 아.")
    parser.add_argument("--language", default=env("NVIDIA_MAGPIE_TTS_MULTILINGUAL_LANGUAGE", DEFAULT_LANGUAGE))
    parser.add_argument("--voice", default=env("NVIDIA_MAGPIE_TTS_MULTILINGUAL_VOICE", DEFAULT_VOICE))
    parser.add_argument("--out", default=str(OUT_DIR / "magpie-tts-hani.wav"))
    args = parser.parse_args()

    key = api_key()
    try:
        voices = flatten_voices(list_voices(key))
        langs = []
        data = list_voices(key)
        for lang_group in data.keys():
            langs.extend([s.strip() for s in lang_group.split(",") if s.strip()])
        ko_supported = any(lang.lower().startswith("ko") for lang in langs)
        print(f"magpie-tts-multilingual: voices={len(voices)} ko_supported={ko_supported} selected_voice={args.voice}")
        size = synthesize(key, args.text, args.language, args.voice, Path(args.out))
        print(f"magpie-tts-multilingual: OK synth bytes={size} file={Path(args.out).as_posix()}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:400].replace("\n", " ")
        print(f"magpie-tts-multilingual: FAIL http={exc.code} {detail}")
    except Exception as exc:
        print(f"magpie-tts-multilingual: FAIL {type(exc).__name__}: {str(exc)[:400]}")


if __name__ == "__main__":
    main()
