from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
WRITING = ROOT / "app-writing.js"


def test_index_loads_app_writing_after_learning_before_main_inline_script():
    learning_tag = '<script src="app-learning.js"></script>'
    writing_tag = '<script src="app-writing.js"></script>'
    main_tag = '<script>'
    assert writing_tag in HTML
    assert HTML.index(learning_tag) < HTML.index(writing_tag) < HTML.index(main_tag)


def test_writing_logic_lives_in_external_writing_file():
    assert WRITING.exists()
    writing = WRITING.read_text(encoding="utf-8")
    for token in [
        "const mtStage=document.getElementById('mtStage')",
        "function mtSelect",
        "function renderBuilder",
        "function saySyl",
        "function composedText",
        "function startWriting",
        "function strokeSVGMarkup",
        "function selectTrace",
        "function buildTraceChips",
        "function loadCustomTrace",
        "function initWritingScreens",
    ]:
        assert token in writing
        assert token not in HTML


def test_index_calls_writing_initializer_after_learning_before_episode():
    assert "initLearningScreens();" in HTML
    assert "initWritingScreens();" in HTML
    assert "initGameScreens();" not in HTML
    assert HTML.index("initLearningScreens();") < HTML.index("initWritingScreens();")
    assert HTML.index("initWritingScreens();") < HTML.index("initEpisodeScreens();")


def test_writing_file_keeps_canvas_and_audio_behavior_tokens():
    writing = WRITING.read_text(encoding="utf-8")
    for token in [
        "mtCanvas.setPointerCapture",
        "mtCtx.lineWidth=14",
        "mtRenderStrokes()",
        "compose(selInit,selMed,selJong)",
        "speak(compose(selInit,selMed,selJong))",
        "rec.canvas.setPointerCapture",
        "speakSeq(writeText.split(' '))",
        "confetti();earnSticker();",
        "canvas.setPointerCapture",
        "marker-end=\"url(#ah)\"",
        "sayTrace(traceChar)",
    ]:
        assert token in writing


def test_service_worker_precaches_external_writing_file_with_new_cache_version():
    assert "./app-writing.js" in SW
    assert "hangul-playground-v53" in SW
