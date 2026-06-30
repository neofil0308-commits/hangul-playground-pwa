from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
DATA = ROOT / "app-data.js"
ADVENTURE = ROOT / "app-adventure.js"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def test_home_has_hangul_village_adventure_map():
    html = read_index()
    assert 'id="adventureMap"' in html
    assert "한글 마을 지도" in html
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "map-node" in adventure
    assert "map-path" in html


def test_map_places_reframe_existing_features_as_locations():
    data = DATA.read_text(encoding="utf-8")
    # Stage A: map exposes only the real adventure + utility places.
    for place in ["글자 숲", "단어 동산", "소리 동굴", "스티커 집"]:
        assert place in data
    for target in ["letters", "word", "listen", "sticker"]:
        assert f"target:'{target}'" in data or f'target:"{target}"' in data
    # Legacy free-browse nodes were removed from the map.
    for target in ["syl", "trace", "match", "quiz"]:
        assert f"target:'{target}'" not in data and f'target:"{target}"' not in data


def test_map_core_learning_nodes_enter_the_adventure():
    # 글자 숲/단어 동산 nodes repoint into the daily adventure entries.
    data = DATA.read_text(encoding="utf-8")
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "action:'letter'" in data
    assert "action:'word'" in data
    assert "openTodayLetter()" in adventure
    assert "openWordBuild(todayWord[0],todayWord[1])" in adventure


def test_map_nodes_can_light_up_with_mission_progress():
    html = read_index()
    adventure = ADVENTURE.read_text(encoding="utf-8")
    assert "updateAdventureMap" in adventure
    assert "map-lit" in adventure
    assert "map-current" in adventure
    assert "한글 마을 불빛" in adventure
