from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
ADVENTURE = (ROOT / "app-adventure.js").read_text(encoding="utf-8")


def test_hani_reaction_panel_exists_with_live_feedback():
    for dom_id in [
        'id="haniReaction"',
        'id="haniReactionBadge"',
        'id="haniReactionText"',
        'id="haniReactionLog"',
    ]:
        assert dom_id in HTML
    assert 'aria-live="polite"' in HTML
    assert "하니의 반응" in HTML


def test_hani_reactions_have_per_quest_completion_copy():
    assert "HANI_REACTIONS" in DATA
    for key in ["letter:", "word:", "play:", "all:"]:
        assert key in DATA
    for copy in [
        "좋아! 이름표가 반짝였어",
        "단어 꽃이 활짝 피었어",
        "소리 종이 맑게 울렸어",
        "오늘의 편지가 다시 읽히기 시작했어",
        "반짝 이름표가 빛나요",
        "노란 꽃씨 주머니가 흔들려요",
        "맑은 소리 종이 울려요",
    ]:
        assert copy in DATA


def test_reaction_state_updates_when_mission_completes():
    assert "showHaniReaction" in ADVENTURE
    assert "renderHaniReaction" in ADVENTURE
    assert "mission.lastReaction" in STATE
    assert "reaction-lit" in ADVENTURE
    assert "reaction-complete" in ADVENTURE
    assert "completeMission(part)" in STATE
    assert "showHaniReaction(part)" in STATE
