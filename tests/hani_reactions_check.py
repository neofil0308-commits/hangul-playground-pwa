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
    # 문안은 해요체로 통일됨 — 하니가 화면마다 다른 말투로 들리던 문제(2026-07-22).
    for copy in [
        "좋아요! 이름표가 반짝였어요",
        "단어 꽃이 활짝 피었어요",
        "소리 종이 맑게 울렸어요",
        "오늘의 편지가 다시 읽히기 시작했어요",
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


def test_hani_speaks_in_consistent_polite_register():
    """하니 대사는 해요체로 통일한다.

    이전에는 막마다 반말/존댓말이 갈려(1·5·6막 존대, 3·7·8막 반말) 같은 하니가
    화면마다 다른 사람처럼 들렸다. 4세 교육 문안의 표준은 해요체다.
    """
    import re
    banmal = re.compile(r"(줄래\?|겠니\?|준비됐니\?|걱정 마!|좋아! )")
    hits = [m.group(0) for m in banmal.finditer(DATA)]
    assert not hits, f"하니 대사에 반말이 남아 있다: {set(hits)}"
