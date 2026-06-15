from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
ADVENTURE = (ROOT / "app-adventure.js").read_text(encoding="utf-8")


def test_storyline_has_visible_arc_panel_and_labels():
    assert 'id="storyArc"' in HTML
    assert 'id="storyArcList"' in HTML
    assert "오늘의 이야기 줄기" in HTML
    for label in ["시작", "사건", "위기", "선택", "해결", "약속"]:
        assert label in DATA


def test_storyline_has_clear_motivation_conflict_and_resolution():
    assert "STORY_ARC" in DATA
    for key in ["premise:", "inciting:", "conflict:", "choice:", "climax:", "resolution:", "promise:"]:
        assert key in DATA
    for copy in [
        "별빛 우체국의 편지가 하얗게 비어 버렸다",
        "이름 없는 편지는 길을 잃고 한글 마을 곳곳에 흩어졌다",
        "글자와 단어와 소리를 차례로 되찾아야 편지가 다시 읽힌다",
        "아이가 하니의 탐험대장이 되어 오늘의 글자부터 불러준다",
        "세 빛 조각이 모이면 하얀 편지에 오늘 배운 말이 떠오른다",
    ]:
        assert copy in DATA


def test_storyline_render_and_copy_include_arc():
    assert "renderStoryArc" in ADVENTURE
    assert "storyArcList" in HTML
    assert "이야기 줄기" in HTML
    assert "getStoryCopyText" in ADVENTURE
    assert "STORY_ARC.forEach" in ADVENTURE
