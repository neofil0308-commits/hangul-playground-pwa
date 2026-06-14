from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def test_home_uses_hani_story_identity():
    html = read_index()
    assert "하니의 한글 모험" in html
    assert "한글 마을" in html
    assert "storyHero" in html


def test_today_mission_is_reframed_as_adventure():
    html = read_index()
    assert "오늘의 모험" in html
    assert "글자 숲" in html
    assert "단어 동산" in html
    assert "소리 동굴" in html


def test_completion_copy_rewards_story_progress():
    html = read_index()
    assert "한글 마을에 빛이 하나 켜졌어요" in html
    assert "모험 보상" in html
    assert "하니가 스티커를 준비했어요" in html


def test_app_metadata_matches_story_mode():
    html = read_index()
    manifest = (ROOT / "manifest.json").read_text(encoding="utf-8")
    assert "<title>하니의 한글 모험</title>" in html
    assert "\"name\": \"하니의 한글 모험\"" in manifest
