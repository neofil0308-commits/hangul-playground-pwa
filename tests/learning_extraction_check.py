from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
LEARNING = ROOT / "app-learning.js"


def test_index_loads_app_learning_after_adventure_before_main_inline_script():
    data_tag = '<script src="app-data.js"></script>'
    state_tag = '<script src="app-state.js"></script>'
    listen_tag = '<script src="app-listen.js"></script>'
    router_tag = '<script src="app-router.js"></script>'
    adventure_tag = '<script src="app-adventure.js"></script>'
    learning_tag = '<script src="app-learning.js"></script>'
    main_tag = '<script>'
    assert learning_tag in HTML
    assert HTML.index(data_tag) < HTML.index(state_tag) < HTML.index(listen_tag) < HTML.index(router_tag) < HTML.index(adventure_tag) < HTML.index(learning_tag) < HTML.index(main_tag)


def test_learning_logic_lives_in_external_learning_file():
    assert LEARNING.exists()
    learning = LEARNING.read_text(encoding="utf-8")
    for token in [
        "const lettersGrid=document.getElementById('lettersGrid')",
        "let lettersTab='con'",
        "function renderLetters",
        "const letterTabsBox=document.getElementById('letterTabs')",
        "function openLetterDetail",
        "const wordCats=document.getElementById('wordCats')",
        "function openWordBuild",
        "function renderWords",
        "function initLearningScreens",
    ]:
        assert token in learning
        assert token not in HTML


def test_index_calls_learning_initializer_after_helpers_exist_before_mission_load():
    assert "initLearningScreens();" in HTML
    assert HTML.index("function twemojify") < HTML.index("initLearningScreens();")
    assert HTML.index("initLearningScreens();") < HTML.index("loadMission();renderMission();")


def test_learning_file_keeps_mission_and_audio_behavior_tokens():
    learning = LEARNING.read_text(encoding="utf-8")
    for token in [
        "markLetterSeen(it.ch)",
        "completeMission('letter')",
        "mtSelect(it.ch)",
        "sayJamo(curLetter.ch)",
        "markWordSeen(word)",
        "completeMission('word')",
        "decompose(word)",
        "speak(word)",
        "go('wordBuild')",
    ]:
        assert token in learning


def test_learning_drops_legacy_word_modal():
    learning = LEARNING.read_text(encoding="utf-8")
    for token in ["function openWord(", "wordModal", "modal.classList", "getElementById('mPlay')"]:
        assert token not in learning, token


def test_service_worker_precaches_external_learning_file_with_new_cache_version():
    assert "./app-learning.js" in SW
    assert "hangul-playground-v73" in SW
