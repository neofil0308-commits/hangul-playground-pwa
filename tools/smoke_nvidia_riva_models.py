#!/usr/bin/env python
"""Manual gRPC smoke test for active NVIDIA Riva-backed ASR model.
Prints no secrets; uses tiny silent audio input.
"""
from __future__ import annotations

import os
from pathlib import Path

import riva.client
from riva.client.proto import riva_asr_pb2

ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"

FUNCTION_IDS = {
    "canary-1b-asr": "b0e8b4a5-217c-40b7-9b96-17d84e666317",
}
KEY_ENVS = {
    "canary-1b-asr": "NVIDIA_CANARY_1B_ASR_API_KEY",
}


def load_dotenv() -> None:
    if not ENV_PATH.exists():
        return
    for raw in ENV_PATH.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def auth(model: str) -> riva.client.Auth:
    api_key = os.environ.get(KEY_ENVS[model], "").strip() or os.environ.get("NVIDIA_API_KEY", "").strip()
    if not api_key or api_key == "***":
        raise RuntimeError(f"missing {KEY_ENVS[model]} or NVIDIA_API_KEY")
    return riva.client.Auth(
        uri="grpc.nvcf.nvidia.com:443",
        use_ssl=True,
        metadata_args=[
            ["function-id", FUNCTION_IDS[model]],
            ["authorization", f"Bearer {api_key}"],
        ],
    )


def silent_pcm_bytes(sample_rate: int = 16000, seconds: float = 0.25) -> bytes:
    n = int(sample_rate * seconds)
    return b"\x00\x00" * n


def test_canary() -> None:
    service = riva.client.ASRService(auth("canary-1b-asr"))
    config = riva_asr_pb2.RecognitionConfig(
        encoding=1,  # LINEAR_PCM
        sample_rate_hertz=16000,
        language_code="en-US",
        max_alternatives=1,
        enable_automatic_punctuation=False,
    )
    response = service.offline_recognize(silent_pcm_bytes(), config)
    results = len(response.results) if hasattr(response, "results") else 0
    print(f"canary-1b-asr: OK grpc results={results}")


def main() -> None:
    load_dotenv()
    try:
        test_canary()
    except Exception as exc:
        print(f"canary-1b-asr: FAIL {type(exc).__name__}: {str(exc)[:400]}")


if __name__ == "__main__":
    main()
