from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
ADVENTURE = ROOT / "app-adventure.js"


def test_index_loads_app_adventure_after_router_before_main_inline_script():
    data_tag = '<script src="app-data.js"></script>'
    state_tag = '<script src="app-state.js"></script>'
    listen_tag = '<script src="app-listen.js"></script>'
    router_tag = '<script src="app-router.js"></script>'
    adventure_tag = '<script src="app-adventure.js"></script>'
    main_tag = '<script>'
    assert adventure_tag in HTML
    assert HTML.index(data_tag) < HTML.index(state_tag) < HTML.index(listen_tag) < HTML.index(router_tag) < HTML.index(adventure_tag) < HTML.index(main_tag)


def test_adventure_home_logic_lives_in_external_adventure_file():
    assert ADVENTURE.exists()
    adventure = ADVENTURE.read_text(encoding="utf-8")
    for token in [
        "const mapGrid=document.getElementById('mapGrid')",
        "function buildAdventureMap",
        "function updateAdventureMap",
        "function updateQuestRoute",
        "function renderHaniReaction",
        "function showHaniReaction",
        "function renderStoryArc",
        "function renderStoryChapterList",
        "function updateStoryBible",
        "function updateStoryWorld",
        "function getStoryCopyText",
        "function copyTextToClipboard",
        "function handleStoryCopy",
        "function initAdventureHome",
    ]:
        assert token in adventure
        assert token not in HTML


def test_index_calls_adventure_initializer_after_helpers_exist():
    assert "initAdventureHome();" in HTML
    assert "initLearningScreens();" in HTML
    assert HTML.index("function twemojify") < HTML.index("initAdventureHome();")
    assert HTML.index("initAdventureHome();") < HTML.index("initLearningScreens();")


def test_adventure_file_keeps_visible_story_and_copy_behaviors():
    adventure = ADVENTURE.read_text(encoding="utf-8")
    for token in [
        "map-lit",
        "map-current",
        "route-current",
        "reaction-complete",
        "빛 조각 ",
        "이야기 줄기",
        "navigator.clipboard.writeText",
        "document.execCommand('copy')",
        "copyStoryText",
        "routePlay",
    ]:
        assert token in adventure


def test_service_worker_precaches_external_adventure_file_with_new_cache_version():
    assert "./app-adventure.js" in SW
    assert "hangul-playground-v54" in SW
