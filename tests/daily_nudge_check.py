from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
EP = (ROOT / "app-episode.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_daily_count_and_goal_in_state():
    for t in ["hp_today", "function bumpTodayCount", "function todayEpisodeCount",
              "var dailyGoal", "function setDailyGoal", "function dailyGoalReached"]:
        assert t in STATE, t


def test_episode_complete_bumps_count():
    ci = EP.index("function onEpisodeComplete")
    assert "bumpTodayCount()" in EP[ci:ci + 200]


def test_recap_shows_gentle_stop_nudge_not_forced():
    ri = EP.index("function showRecap")
    body = EP[ri:ri + 1600]
    assert "dailyGoalReached" in body
    assert "recap-rest" in body and 'id="recapHome"' in body
    # 강제 아님: '조금 더 할래요'로 계속 가능.
    assert "조금 더" in body


def test_parent_can_set_daily_goal():
    assert 'id="goalPick"' in HTML
    assert "setDailyGoal" in HTML


def test_nudge_styles():
    for sel in [".recap-rest", ".recap-home", ".recap-actions"]:
        assert sel in CSS, sel
