from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
ADVENTURE = (ROOT / "app-adventure.js").read_text(encoding="utf-8")


def test_story_copy_button_is_visible_and_accessible():
    assert 'id="copyStoryText"' in HTML
    assert 'aria-label="오늘의 한글 마을 이야기 복사"' in HTML
    assert "이야기 복사" in HTML
    assert 'id="copyStoryStatus"' in HTML


def test_story_copy_uses_clipboard_with_fallback():
    assert "function getStoryCopyText" in ADVENTURE
    assert "function copyTextToClipboard" in ADVENTURE
    assert "navigator.clipboard.writeText" in ADVENTURE
    assert "document.execCommand('copy')" in ADVENTURE
    assert "복사됐어요" in ADVENTURE


def test_story_copy_text_contains_progress_and_chapters():
    assert "한글 마을 이야기" in HTML
    assert "오늘의 모험" in HTML
    assert "빛 조각" in HTML
    assert "1장 글자 숲의 첫 불빛" in DATA
    assert "2장 단어 동산의 꽃" in DATA
    assert "3장 소리 동굴의 문" in DATA
