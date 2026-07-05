import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
STYLES = ROOT / "styles.css"
MANIFEST = ROOT / "manifest.json"
SW = ROOT / "sw.js"
DATA = ROOT / "app-data.js"
ADVENTURE = ROOT / "app-adventure.js"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def read_styles():
    return STYLES.read_text(encoding="utf-8")


def test_ipad_pwa_uses_safe_area_and_app_status_bar():
    html = read_index()
    css = read_styles()
    assert 'apple-mobile-web-app-status-bar-style" content="black-translucent"' in html
    assert "viewport-fit=cover" in html
    assert "env(safe-area-inset-top)" in css
    assert "env(safe-area-inset-bottom)" in css
    assert "@media (display-mode:standalone)" in css


def test_manifest_and_service_worker_are_ipad_pwa_ready():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sw = SW.read_text(encoding="utf-8")
    assert manifest["display"] == "standalone"
    assert manifest["orientation"] == "landscape-primary"
    assert manifest["start_url"] == "./index.html?source=pwa"
    assert "categories" in manifest and "education" in manifest["categories"]
    assert "hangul-playground-v68" in sw
    assert "./styles.css" in sw
    assert "./app-data.js" in sw
    assert "./app-state.js" in sw
    assert "./index.html?source=pwa" in sw


def test_story_world_has_chapters_and_lore_panel():
    html = read_index()
    data = DATA.read_text(encoding="utf-8")
    assert 'id="storyWorld"' in html
    assert "한글 마을 이야기" in html
    for chapter in ["1장 글자 숲의 첫 불빛", "2장 단어 동산의 꽃", "3장 소리 동굴의 문"]:
        assert chapter in data
    assert "빛 조각" in html
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "chapter-current" in adventure
    assert "chapter-done" in adventure


def test_story_world_state_updates_with_mission_progress():
    html = read_index()
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "updateStoryWorld" in adventure
    assert "storyChapterText" in html
    assert "storyLightPieces" in html
