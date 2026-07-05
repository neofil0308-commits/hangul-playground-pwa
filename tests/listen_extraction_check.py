from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
LISTEN = ROOT / "app-listen.js"


def test_index_loads_app_listen_after_state_before_main_inline_script():
    data_tag = '<script src="app-data.js"></script>'
    state_tag = '<script src="app-state.js"></script>'
    listen_tag = '<script src="app-listen.js"></script>'
    main_tag = '<script>'
    assert listen_tag in HTML
    assert HTML.index(data_tag) < HTML.index(state_tag) < HTML.index(listen_tag) < HTML.index(main_tag)


def test_listen_game_logic_lives_in_external_listen_file():
    assert LISTEN.exists()
    listen = LISTEN.read_text(encoding="utf-8")
    for token in [
        "var listenMode",
        "function listenPool",
        "function newListenQuestion",
        "function startListenRound",
        "function checkListen",
        "completeMission('play')",
        "listenModeBox",
        "listenDiffBox",
        "document.getElementById('listenPlay').addEventListener",
    ]:
        assert token in listen
        assert token not in HTML


def test_service_worker_precaches_external_listen_file_with_new_cache_version():
    assert "./app-listen.js" in SW
    assert "hangul-playground-v69" in SW
