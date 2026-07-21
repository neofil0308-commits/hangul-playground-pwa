import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_nvidia_cards", ROOT / "tools" / "generate_nvidia_cards.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def test_env_files_are_ignored_and_documented():
    gitignore = read(".gitignore")
    env_example = read(".env.example")

    assert ".env" in gitignore
    assert ".env.*" in gitignore
    assert "!.env.example" in gitignore
    assert "NVIDIA_API_KEY=" in env_example
    assert "NVIDIA_IMAGE_ENDPOINT=" in env_example


def test_nvidia_card_generator_uses_env_and_never_hardcodes_secret():
    script = read("tools/generate_nvidia_cards.py")

    assert "load_dotenv" in script
    assert "NVIDIA_API_KEY" in script
    assert "NVIDIA_QWEN_IMAGE" in script
    assert "NVIDIA_FLUX_1_DEV" in script
    assert "Authorization" in script
    assert "Bearer {api_key}" in script
    assert "assets/generated-cards" in script
    assert "sk-" not in script
    assert "nvapi-" not in script.lower()


def test_nvidia_card_generator_prefers_model_specific_key(monkeypatch):
    generator = load_generator_module()
    monkeypatch.setenv("NVIDIA_API_KEY", "***")
    monkeypatch.setenv("NVIDIA_QWEN_IMAGE_API_KEY", "model-specific-secret")
    monkeypatch.setenv("NVIDIA_QWEN_IMAGE_ENDPOINT", "https://example.test/qwen-image")
    monkeypatch.setenv("NVIDIA_QWEN_IMAGE_MODEL", "qwen-image")

    config = generator.resolve_nvidia_config("qwen-image")

    assert config.api_key == "model-specific-secret"
    assert config.endpoint == "https://example.test/qwen-image"
    assert config.model == "qwen-image"
    assert config.api_key_env == "NVIDIA_QWEN_IMAGE_API_KEY"


def test_generated_card_manifest_is_static_app_asset():
    manifest = read("assets/generated-cards/cards.json")
    sw = read("sw.js")

    assert "hani-postbox" in manifest
    assert "korean_text" in manifest
    assert "./assets/generated-cards/cards.json" in sw
    assert "hangul-playground-v81" in sw


def test_quality_sample_prompts_request_isolated_objects_not_full_cards():
    script = read("tools/generate_nvidia_quality_samples.py")

    assert "isolated object" in script
    assert "plain white background" in script
    assert "single object only" in script
    assert "no card layout" in script
    assert "no Korean letters" in script
    assert "object_area" in script
    assert "safe_zone" not in script


def test_quality_sample_composer_builds_card_from_object_asset():
    script = read("tools/generate_nvidia_quality_samples.py")

    assert "extract_object_from_plain_background" in script
    assert "paste_object_centered" in script
    assert "draw_learning_card_background" in script
    assert "OBJECT_AREA" in script
    assert "TEXT_PANEL" in script
