from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
STATE = ROOT / "app-state.js"


def test_index_loads_app_state_after_data_before_main_inline_script():
    data_tag = '<script src="app-data.js"></script>'
    state_tag = '<script src="app-state.js"></script>'
    main_tag = '<script>'
    assert state_tag in HTML
    assert HTML.index(data_tag) < HTML.index(state_tag) < HTML.index(main_tag)


def test_mission_state_logic_lives_in_external_state_file():
    assert STATE.exists()
    state = STATE.read_text(encoding="utf-8")
    for token in [
        "function lsGet",
        "function lsSet",
        "function lsJSON",
        "function lsSetJSON",
        "function todayKey",
        "function yKey",
        "var MD",
        "var mission",
        "function loadMission",
        "function saveMission",
        "function updateStreak",
        "function completeMission",
    ]:
        assert token in state
        assert token not in HTML


def test_service_worker_precaches_external_state_file_with_new_cache_version():
    assert "./app-state.js" in SW
    assert "hangul-playground-v30" in SW
