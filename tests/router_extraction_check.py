from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
ROUTER = ROOT / "app-router.js"


def test_index_loads_app_router_after_listen_before_main_inline_script():
    data_tag = '<script src="app-data.js"></script>'
    state_tag = '<script src="app-state.js"></script>'
    listen_tag = '<script src="app-listen.js"></script>'
    router_tag = '<script src="app-router.js"></script>'
    main_tag = '<script>'
    assert router_tag in HTML
    assert HTML.index(data_tag) < HTML.index(state_tag) < HTML.index(listen_tag) < HTML.index(router_tag) < HTML.index(main_tag)


def test_router_logic_lives_in_external_router_file():
    assert ROUTER.exists()
    router = ROUTER.read_text(encoding="utf-8")
    for token in [
        "const homeBtn=document.getElementById('homeBtn')",
        "function go(id)",
        "homeBtn.addEventListener('click',()=>go('home'))",
        "const menu=document.getElementById('menu')",
        "MENU.forEach",
        "b.addEventListener('click',()=>go(m.id))",
    ]:
        assert token in router
        assert token not in HTML


def test_router_keeps_route_side_effects_for_existing_screens():
    router = ROUTER.read_text(encoding="utf-8")
    for token in [
        "if(id==='set')renderReport()",
        "if(id==='listen'&&!listenBuilt)",
        "startListenRound()",
        "if(id==='trace')",
        "if(id==='letterDetail')",
        "window.scrollTo",
    ]:
        assert token in router


def test_router_drops_legacy_match_and_quiz_branches():
    router = ROUTER.read_text(encoding="utf-8")
    for token in ["matchBuilt", "newMatch", "quizBuilt", "newQuiz"]:
        assert token not in router, token


def test_service_worker_precaches_external_router_file_with_new_cache_version():
    assert "./app-router.js" in SW
    assert "hangul-playground-v49" in SW
