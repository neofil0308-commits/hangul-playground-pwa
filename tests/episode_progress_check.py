import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
DATA = ROOT / "app-data.js"
STATE = ROOT / "app-state.js"
EPISODE = ROOT / "app-episode.js"


def test_curriculum_data_lives_in_app_data():
    data = DATA.read_text(encoding="utf-8")
    for token in [
        "const CURRICULUM=",
        "const STORY_MILESTONES=",
        "const EPISODE_PATH=",
        "function isMasteredRec",
        "function pendingMilestone",
        "1막 모음의 빛",
        "2막 자음 친구들",
        "8막 이야기 책",
    ]:
        assert token in data, token


def test_progress_logic_lives_in_state_not_html():
    state = STATE.read_text(encoding="utf-8")
    for token in [
        "var progress=",
        "function saveProgress",
        "function curEpisode",
        "function curLetterObj",
        "function masteredLetters",
        "function markLetterProgress",
        "function addAlbumStar",
        "function advanceEpisode",
        "function checkMilestone",
        "function markMilestoneShown",
    ]:
        assert token in state, token
        assert token not in HTML, token


def test_pick_today_and_mission_follow_curriculum():
    state = STATE.read_text(encoding="utf-8")
    assert "curLetterObj()" in state
    assert "mission.ep!==progress.idx" in state
    assert "markLetterProgress(part)" in state


def test_episode_render_lives_in_external_module():
    assert EPISODE.exists()
    ep = EPISODE.read_text(encoding="utf-8")
    for token in [
        "function renderEpisodeBanner",
        "function renderStarAlbum",
        "function showMilestone",
        "function onEpisodeComplete",
        "function goNextLetter",
        "function initEpisodeScreens",
        "function narrateEpisode",
        "function stopPic",
    ]:
        assert token in ep, token
        assert token not in HTML, token


def test_picture_book_is_audio_and_visual_for_prereaders():
    ep = EPISODE.read_text(encoding="utf-8")
    # 그림책 페이지: 큰 글자 + 그림 + 하니 음성
    assert "book-page" in ep
    assert "book-pic" in ep
    assert "하니가 읽어줄게" in ep
    # 하니가 소리로 읽어주기(글 대신 음성)
    assert "speakSeq" in ep or "speak(" in ep
    # 진행 그림길(징검다리)
    assert "journey-path" in ep
    assert "stop-now" in ep
    # 줄글 스토리는 부모님 보기로 접힘
    assert 'class="parent-zone"' in HTML
    assert "부모님 보기" in HTML


def test_intro_storybook_exists_and_is_narrated():
    data = DATA.read_text(encoding="utf-8")
    ep = EPISODE.read_text(encoding="utf-8")
    # 인트로 그림책 데이터(그림+하니 대사)
    assert "const INTRO_PAGES=" in data
    assert "별빛 우체국" in data
    # 인트로 진행/내레이션 로직
    for token in ["function showIntro", "function introNext", "function speakIntro", "function initIntro"]:
        assert token in ep, token
        assert token not in HTML, token
    # 첫 실행 시 인트로부터, 본 뒤엔 기억
    assert "hp_intro_seen" in ep
    # 따뜻한 신경망 음성 MP3로 내레이션 (기기 기계음 대신)
    assert "audio/narr/intro" in ep
    for i in range(1, 7):
        assert (ROOT / "audio" / "narr" / f"intro{i}.mp3").exists(), f"intro{i}.mp3"
    # 인트로 화면 DOM + 다시 보기 버튼
    for token in ['id="intro"', 'id="introArt"', 'id="introNext"', 'id="replayIntro"']:
        assert token in HTML, token


def test_index_loads_episode_module_after_games_before_main():
    games_tag = '<script src="app-games.js"></script>'
    episode_tag = '<script src="app-episode.js"></script>'
    main_tag = "<script>"
    assert episode_tag in HTML
    assert HTML.index(games_tag) < HTML.index(episode_tag) < HTML.index(main_tag)


def test_index_calls_episode_initializer_after_games():
    assert "initEpisodeScreens();" in HTML
    assert HTML.index("initGameScreens();") < HTML.index("initEpisodeScreens();")


def test_index_has_episode_and_album_dom_and_hooks():
    for token in [
        'id="episodeBanner"',
        'id="starAlbum"',
        'id="nextLetterBtn"',
        'id="milestonePop"',
        "onEpisodeComplete();",
        "renderEpisodeBanner();",
    ]:
        assert token in HTML, token


def test_service_worker_precaches_episode_module_with_bumped_cache():
    assert "./app-episode.js" in SW
    assert "hangul-playground-v35" in SW


def test_episode_engine_logic_runs_in_node():
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";this.__out=JSON.stringify({"
        + "len:EPISODE_PATH.length,"
        + "first10:EPISODE_PATH.slice(0,10).map(function(e){return e.ch;}),"
        + "act1:CURRICULUM[0].title,"
        + "mYes:isMasteredRec({met:true,matched:true,quizzed:true}),"
        + "mNo:isMasteredRec({met:true,matched:false,quizzed:true}),"
        + "milEarly:(function(){var m=pendingMilestone(['\\u314f','\\u3163'],[]);return m?m.word:null;})(),"
        + "milGated:(function(){var m=pendingMilestone(['\\u314f'],[]);return m?m.word:null;})()"
        + "});"
    )
    script = (
        "const vm=require('vm');"
        "let chunks='';process.stdin.on('data',d=>chunks+=d);"
        "process.stdin.on('end',()=>{const ctx={};vm.createContext(ctx);"
        "vm.runInContext(chunks,ctx);process.stdout.write(ctx.__out);});"
    )
    res = subprocess.run(
        ["node", "-e", script],
        input=probe,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    assert res.returncode == 0, res.stderr
    out = json.loads(res.stdout)
    # 1막 모음 10개가 진행 경로의 맨 앞, 학습 순서대로
    assert out["first10"] == ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅑ", "ㅕ", "ㅛ", "ㅠ"]
    assert out["act1"] == "1막 모음의 빛"
    assert out["len"] >= 24  # 모음10 + 자음14 이상
    # 익힘 판정: 셋 다 충족해야 마스터
    assert out["mYes"] is True
    assert out["mNo"] is False
    # 빠른 성취: ㅏ+ㅣ를 익히면 '아이' 맛보기, ㅏ만으로는 아직 안 열림
    assert out["milEarly"] == "아이"
    assert out["milGated"] is None
