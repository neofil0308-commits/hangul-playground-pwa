from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


def test_story_world_has_prologue_and_richer_chapter_elements():
    assert 'id="storyPrologue"' in HTML
    assert 'id="storySceneText"' in HTML
    assert 'id="storyClueText"' in HTML
    assert 'id="storyChapterList"' in HTML
    assert "별빛 우체국" in HTML
    assert "숨은 이름표" in HTML
    assert "주문" in HTML


def test_story_chapters_have_scene_clue_and_reward_copy():
    for token in ["scene:", "clue:", "reward:", "place:"]:
        assert token in HTML
    for copy in [
        "낮잠 자던 글자들이 숲잎 뒤에 숨어 있어요",
        "단어 꽃은 글자 친구의 이름을 불러주면 피어나요",
        "문은 하니의 목소리와 같은 소리를 찾을 때 열려요",
        "반짝 이름표",
        "단어 꽃씨",
        "소리 종",
    ]:
        assert copy in HTML


def test_story_update_renders_chapter_notes_and_copy_includes_richer_story():
    assert "STORY_CHAPTERS" in HTML
    assert "renderStoryChapterList" in HTML
    assert "storySceneText" in HTML
    assert "storyClueText" in HTML
    assert "storyPrologue" in HTML
    assert "storyChapterList" in HTML
    assert "보상" in HTML
