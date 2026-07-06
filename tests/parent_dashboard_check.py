from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
ROUTER = (ROOT / "app-router.js").read_text(encoding="utf-8")


def test_active_day_logging_in_state():
    assert "hp_active_days" in STATE
    assert "function markActiveDay" in STATE
    # 미션 활동 시 활동일 기록.
    assert "markActiveDay()" in STATE


def test_parent_dashboard_renderer_and_host():
    assert 'id="parentDash"' in HTML
    assert "function renderParentDashboard" in HTML
    # 리포트 렌더 시 대시보드도 갱신.
    ri = HTML.index("function renderReport")
    assert "renderParentDashboard()" in HTML[ri:ri + 1400]


def test_dashboard_shows_key_learning_signals():
    di = HTML.index("function renderParentDashboard")
    body = HTML[di:di + 2600]
    for token in ["뗀 글자", "연속 출석", "복습 예정", "막 보물", "이번 주 출석", "masteredLetters", "dueReviewChs", "activeDays"]:
        assert token in body, token


def test_dashboard_is_behind_parent_gate():
    # #set 은 부모 잠금(showGate) 뒤에서만 열린다(라우터).
    assert "id==='set'&&!parentUnlocked" in ROUTER
    assert "showGate()" in ROUTER


def test_dashboard_styles_present():
    for sel in [".parent-dash", ".pd-top", ".pd-week", ".wk-day", ".dg-grid", ".dg.got", ".pd-tip"]:
        assert sel in CSS, sel
