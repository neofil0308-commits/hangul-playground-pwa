from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
STYLES = ROOT / "styles.css"
ADVENTURE = ROOT / "app-adventure.js"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def read_styles():
    return STYLES.read_text(encoding="utf-8")


def test_home_declares_ipad_primary_workbench_shell():
    html = read_index()
    css = read_styles()
    assert 'id="homeWorkbench"' in html
    assert "iPad 기준" in html
    assert "@media (min-width:760px)" in css
    assert "grid-template-columns:minmax(280px,.85fr) minmax(0,1.35fr)" in css


def test_adventure_map_has_visible_quest_route_for_ipad():
    html = read_index()
    assert 'id="questRoute"' in html
    assert "오늘의 모험 길" in html
    assert "route-step" in html
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "route-lit" in adventure
    assert "route-current" in adventure


def test_route_state_updates_with_today_mission_progress():
    html = read_index()
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "updateQuestRoute" in adventure
    assert "questRoute" in html
    assert "글자 숲" in html
    assert "단어 동산" in html
    assert "소리 동굴" in html
