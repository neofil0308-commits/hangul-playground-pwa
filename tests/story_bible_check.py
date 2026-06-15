from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
ADVENTURE = (ROOT / "app-adventure.js").read_text(encoding="utf-8")


def test_story_has_compact_bible_regions_for_richer_narrative():
    for dom_id in [
        'id="storyEmotionText"',
        'id="storySecretText"',
        'id="storyNextText"',
        'id="storyRelicText"',
        'id="storyBonds"',
    ]:
        assert dom_id in HTML
    assert "하니의 마음" in HTML
    assert "마을의 비밀" in HTML
    assert "다음 예고" in HTML
    assert "오늘의 보물" in HTML


def test_story_chapter_bible_contains_emotion_secret_next_and_relic():
    for token in ["emotion:", "secret:", "next:", "relic:", "bond:"]:
        assert token in DATA
    for copy in [
        "편지 봉투가 바스락거리자 하니가 숨을 작게 들이마셔요",
        "글자 숲의 잎맥은 자음과 모음이 지나간 길을 기억해요",
        "이름표가 깨어나면 단어 동산의 꽃봉오리가 열릴 거예요",
        "별빛 봉투",
        "하니는 아이가 읽어주는 소리를 믿고 앞으로 걸어요",
    ]:
        assert copy in DATA


def test_story_bible_updates_and_copy_includes_new_sections():
    assert "updateStoryBible" in ADVENTURE
    assert "storyEmotionText" in HTML
    assert "storySecretText" in HTML
    assert "storyNextText" in HTML
    assert "storyRelicText" in HTML
    assert "storyBonds" in HTML
    assert "하니의 마음:" in ADVENTURE
    assert "마을의 비밀:" in ADVENTURE
    assert "다음 예고:" in ADVENTURE
    assert "오늘의 보물:" in ADVENTURE
