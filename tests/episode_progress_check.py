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


def test_index_loads_episode_module_after_writing_before_main():
    writing_tag = '<script src="app-writing.js"></script>'
    episode_tag = '<script src="app-episode.js"></script>'
    main_tag = "<script>"
    assert episode_tag in HTML
    assert HTML.index(writing_tag) < HTML.index(episode_tag) < HTML.index(main_tag)


def test_index_calls_episode_initializer_after_writing():
    assert "initEpisodeScreens();" in HTML
    assert HTML.index("initWritingScreens();") < HTML.index("initEpisodeScreens();")


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
    assert "hangul-playground-v38" in SW


def test_stage_b_combine_act_is_playable():
    data = DATA.read_text(encoding="utf-8")
    state = STATE.read_text(encoding="utf-8")
    ep = EPISODE.read_text(encoding="utf-8")
    learning = (ROOT / "app-learning.js").read_text(encoding="utf-8")
    # 3막 combine 콘텐츠: 목표 음절 + 예시 단어/그림
    assert "syllables:['가','나','다','마','고','모']" in data
    assert "sylWords:" in data
    # EPISODE_PATH가 combine 막을 음절별 노드로 펼침(ch 트릭으로 글자 기계장치 재사용)
    assert "a.type==='combine'" in data
    assert "type:'combine',ch:ch" in data
    # 상태 분기점: curLetterObj/markLetterProgress/addAlbumStar가 combine 허용, 단일 완료 함수
    assert "function combineTarget" in state
    assert "ep.type==='combine'" in state
    assert "function completeCombine" in state
    # 배너/내레이션 combine 분기
    assert "ep.type==='combine'" in ep
    assert "자음과 모음을 합쳐" in ep
    # 글자 공방 드래그 화면(wordBuild 기계장치 재사용)
    for token in ["function openCombine", "function cbTap", "function cbDragStart", "function combineTeach", "function initCombine"]:
        assert token in learning, token
    # 화면 DOM + 미션 라우팅이 combine을 인식
    assert 'id="combine"' in HTML
    assert 'id="cbTarget"' in HTML
    assert 'id="cbTray"' in HTML
    assert "openCombine()" in HTML
    assert "initCombine();" in learning


def test_combine_episode_does_not_fall_back_to_random_letter():
    # combine 막에서 curLetterObj는 null이 아닌 목표 음절 객체를 돌려줘야 한다(랜덤 글자 폴백 방지).
    # app-data.js의 EPISODE_PATH/CHO/JUNG/JONG를 쓰고, 상태 분기(combineTarget/curLetterObj)를 재현해 검증.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";function decompose(word){var out=[];for(var k=0;k<word.length;k++){var chr=word[k];"
        "var code=chr.charCodeAt(0)-0xAC00;if(code<0||code>11171){out.push([chr]);continue;}"
        "var i=Math.floor(code/588),m=Math.floor((code%588)/28),f=code%28;var j=[CHO[i],JUNG[m]];"
        "if(f>0)j.push(JONG[f]);out.push(j);}return out;}"
        + ";var ci=-1;for(var z=0;z<EPISODE_PATH.length;z++){if(EPISODE_PATH[z].type==='combine'){ci=z;break;}}"
        + "var progress={idx:ci,mastery:{},album:[],milestones:[]};"
        + "function curEpisode(){return EPISODE_PATH[Math.min(progress.idx,EPISODE_PATH.length-1)];}"
        + "function combineTarget(ep){if(!ep||ep.type!=='combine'||!ep.ch)return null;var jamo=(typeof decompose==='function')?(decompose(ep.ch)[0]||[]):[];return {ch:ep.ch,sound:ep.ch,combine:true,jamo:jamo,word:ep.word||'',emoji:ep.emoji||''};}"
        + "function curLetterObj(){var ep=curEpisode();if(!ep)return null;if(ep.type==='letter')return ALL_LETTER_OBJS[ep.ch]||null;if(ep.type==='combine')return combineTarget(ep);return null;}"
        + ";this.__out=JSON.stringify({ci:ci,ch:curEpisode().ch,jamo:(curLetterObj()||{}).jamo,word:(curLetterObj()||{}).word});"
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
    assert out["ci"] >= 0  # combine 노드가 경로에 존재
    assert out["ch"] == "가"  # 첫 combine 음절
    assert out["jamo"] == ["ㄱ", "ㅏ"]  # 분해된 자모(랜덤 폴백 아님)
    assert out["word"] == "가방"


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
