from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
DATA = ROOT / "app-data.js"


def test_index_loads_app_data_before_main_inline_script():
    assert '<script src="app-data.js"></script>' in HTML
    assert HTML.index('<script src="app-data.js"></script>') < HTML.index('<script>')


def test_learning_and_story_data_live_in_external_data_file():
    assert DATA.exists()
    data = DATA.read_text(encoding="utf-8")
    for name in [
        "CONS",
        "VOWS",
        "WORDS",
        "MENU",
        "MAP_PLACES",
        "HANI_REACTIONS",
        "STORY_ARC",
        "STORY_CHAPTERS",
        "LETTER_WORDS",
        "PRESET_SENTS",
        "CRAYONS",
        "VOICES",
        "SPEEDS",
    ]:
        assert f"const {name}" in data
        assert f"const {name}" not in HTML


def test_service_worker_precaches_external_data_file_with_new_cache_version():
    assert "./app-data.js" in SW
    assert "hangul-playground-v51" in SW
