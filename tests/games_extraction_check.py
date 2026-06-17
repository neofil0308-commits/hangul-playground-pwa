from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
GAMES = ROOT / "app-games.js"


def test_index_loads_app_games_after_writing_before_main_inline_script():
    writing_tag = '<script src="app-writing.js"></script>'
    games_tag = '<script src="app-games.js"></script>'
    main_tag = '<script>'
    assert games_tag in HTML
    assert HTML.index(writing_tag) < HTML.index(games_tag) < HTML.index(main_tag)


def test_games_logic_lives_in_external_games_file():
    assert GAMES.exists()
    games = GAMES.read_text(encoding="utf-8")
    for token in [
        "const board=document.getElementById('board')",
        "let PAIRS=6",
        "function newMatch",
        "function flip",
        "const LETTER_POOL=CONS.map",
        "function qPool",
        "function redrawLines",
        "function qMakeNode",
        "function newQuiz",
        "function qMove",
        "function qUp",
        "function initGameScreens",
    ]:
        assert token in games
        assert token not in HTML


def test_index_calls_games_initializer_after_writing_before_voice_settings():
    assert "initWritingScreens();" in HTML
    assert "initGameScreens();" in HTML
    assert HTML.index("initWritingScreens();") < HTML.index("initGameScreens();")
    assert HTML.index("initGameScreens();") < HTML.index("const voicePick=document.getElementById('voicePick')")


def test_games_file_keeps_match_quiz_reward_and_audio_tokens():
    games = GAMES.read_text(encoding="utf-8")
    for token in [
        "speak(card.dataset.id)",
        "sayJamo(card.dataset.id)",
        "sfxCorrect()",
        "sfxWrong()",
        "confetti();earnSticker();",
        "qLines.appendChild(qLine",
        "qStart._item.say",
        "qscore.textContent=qMatched+' / '+qLeft.children.length",
        "window.addEventListener('pointermove',qMove)",
        "window.addEventListener('resize',()=>{if(document.getElementById('quiz').classList.contains('active'))redrawLines();})",
    ]:
        assert token in games


def test_service_worker_precaches_external_games_file_with_new_cache_version():
    assert "./app-games.js" in SW
    assert "hangul-playground-v34" in SW
