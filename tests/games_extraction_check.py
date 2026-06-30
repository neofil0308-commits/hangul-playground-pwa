from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
GAMES = ROOT / "app-games.js"


def test_legacy_games_module_is_removed():
    # Stage A cleanup: 짝 맞추기/소리 퀴즈 legacy games were deleted wholesale.
    assert not GAMES.exists()
    assert '<script src="app-games.js"></script>' not in HTML
    assert "./app-games.js" not in SW
    assert "initGameScreens()" not in HTML


def test_match_and_quiz_screens_are_gone_from_dom():
    for token in ['id="match"', 'id="quiz"', 'id="board"', 'id="qBoard"']:
        assert token not in HTML, token


def test_no_dangling_game_logic_references_remain():
    for token in ["newMatch", "newQuiz", "matchBuilt", "quizBuilt", "redrawLines"]:
        assert token not in HTML, token
