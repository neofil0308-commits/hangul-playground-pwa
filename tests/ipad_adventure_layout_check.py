from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def test_home_declares_ipad_primary_workbench_shell():
    html = read_index()
    assert 'id="homeWorkbench"' in html
    assert "iPad 기준" in html
    assert "@media (min-width:760px)" in html
    assert "grid-template-columns:minmax(280px,.85fr) minmax(0,1.35fr)" in html


def test_adventure_map_has_visible_quest_route_for_ipad():
    html = read_index()
    assert 'id="questRoute"' in html
    assert "오늘의 모험 길" in html
    assert "route-step" in html
    assert "route-lit" in html
    assert "route-current" in html


def test_route_state_updates_with_today_mission_progress():
    html = read_index()
    assert "updateQuestRoute" in html
    assert "questRoute" in html
    assert "글자 숲" in html
    assert "단어 동산" in html
    assert "소리 동굴" in html
