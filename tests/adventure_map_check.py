from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


def read_index():
    return INDEX.read_text(encoding="utf-8")


def test_home_has_hangul_village_adventure_map():
    html = read_index()
    assert 'id="adventureMap"' in html
    assert "한글 마을 지도" in html
    assert "map-node" in html
    assert "map-path" in html


def test_map_places_reframe_existing_features_as_locations():
    html = read_index()
    for place in ["글자 숲", "글자 공방", "단어 동산", "쓰기 연못", "카드 광장", "소리 동굴", "스티커 집"]:
        assert place in html
    for target in ["letters", "syl", "word", "trace", "match", "quiz", "listen", "sticker"]:
        assert f"target:'{target}'" in html or f'target:"{target}"' in html


def test_map_nodes_can_light_up_with_mission_progress():
    html = read_index()
    assert "updateAdventureMap" in html
    assert "map-lit" in html
    assert "map-current" in html
    assert "한글 마을 불빛" in html
