from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
REVIEW = (ROOT / "app-review.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_stats_and_adaptive_helpers_in_state():
    for token in [
        "progress.stats",
        "function recordAttempt",
        "function letterStrength",
        "function reviewOptionCount",
        "function orderByWeakness",
    ]:
        assert token in STATE, token
    # 채점 시 통계 기록.
    assert "recordAttempt(ch,correct)" in STATE


def test_delayed_mastery_confirmation():
    # 복습 1회 통과(box>=2) 전엔 '익히는 중', 통과 후 '완전히 뗌' 확정.
    assert "function confirmedLetters" in STATE
    assert "function isConfirmed" in STATE
    assert ">=2" in STATE[STATE.index("function confirmedLetters"):STATE.index("function confirmedLetters") + 200]


def test_weakness_ordering_is_zero_safe():
    # weak의 rank 0이 falsy로 덮이지 않게(||1 버그 방지) null 체크 사용.
    oi = STATE.index("function orderByWeakness")
    body = STATE[oi:oi + 260]
    assert "v==null?1:v" in body
    assert "||1" not in body            # 0을 덮는 폴백 금지


def test_review_round_uses_adaptive_difficulty():
    assert "reviewOptionCount(ch)" in REVIEW      # 보기 수 적응
    assert "orderByWeakness" in REVIEW            # 약한 글자 우선


def test_dashboard_shows_delayed_mastery():
    di = HTML.index("function renderParentDashboard")
    body = HTML[di:di + 2900]
    assert "confirmedLetters" in body
    assert "완전히 뗌" in body and "익히는 중" in body
    assert "pd-legend" in body
    for sel in [".dg.prov", ".pd-legend"]:
        assert sel in CSS, sel
