import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
LEARNING = (ROOT / "app-learning.js").read_text(encoding="utf-8")


def test_find_screen_dom_exists():
    # 글자 찾기 화면 + 4번째 미션 타일 DOM (소리 동굴 스타일 재사용)
    for token in [
        'id="find"',
        'id="fdGrid"',
        'id="fdCue"',
        'id="fdProgress"',
        'id="fdPlay"',
        'id="fdBack"',
        'id="mrowFind"',
        'id="mcF"',
        'id="mtF"',
    ]:
        assert token in HTML, token
    # 미션 행 라우팅이 openFind를 호출
    assert "openFind()" in HTML


def test_find_game_logic_lives_in_learning_module_not_html():
    for token in [
        "function openFind",
        "function fdTap",
        "function renderFindProgress",
        "function initFind",
        "completeMission('find')",
    ]:
        assert token in LEARNING, token
        assert token not in HTML, token
    # learning 초기화가 글자 찾기도 켠다
    assert "initFind();" in LEARNING


def test_find_uses_forgiving_visual_recognition_mechanics():
    # 그림/소리 단서 + 관대한 판정(오답에 감점/실패 없음) + 차등 피드백
    assert "sfxCorrect" in LEARNING and "sfxWrong" in LEARNING
    assert "confetti" in LEARNING and "earnSticker" in LEARNING
    # 같은 종류(자음/모음) 방해 카드 로직
    assert "function fdKind" in LEARNING
    assert "masteredLetters" in LEARNING
    # 소리 단서
    assert "speak(fdSayText())" in LEARNING


def test_mission_state_has_find_flag_and_mastery_unaffected():
    # loadMission이 find 플래그를 포함
    assert "find:false" in STATE
    # 글자 찾기는 추가 활동 플래그 — 마스터 키(met/matched/quizzed)에 영향 없음
    assert "part==='find'" in STATE
    # 마스터 판정 키는 그대로
    assert "met=true" in STATE and "matched=true" in STATE and "quizzed=true" in STATE


def test_service_worker_cache_bumped_to_v52():
    assert "hangul-playground-v68" in SW


def test_generalized_completion_gate_tokens_present():
    # 게이트가 3으로 하드코딩되지 않고 에피소드별 필요 단계로 일반화됨
    assert "['letter','word','play','find']" in HTML
    assert "allDone" in HTML
    assert "!mission.rewarded" in HTML
    # 옛 저장본 관대 처리(이미 보상받은 미션도 다음 버튼 노출)
    assert "mission.rewarded" in HTML


def test_completion_gate_fires_once_for_both_letter_and_single_paths():
    # index.html 인라인 게이트 공식을 그대로 재현해, 두 경로가 정확히 한 번 보상하는지 검증.
    # letter 막 = 4단계(letter,word,play,find), combine/sentence 막 = 단일 트립(letter,word,play).
    probe = r"""
    function gate(single, mission){
      var req=single?['letter','word','play']:['letter','word','play','find'];
      var done=0;for(var ri=0;ri<req.length;ri++){if(mission[req[ri]])done++;}
      var total=req.length, allDone=done===total;
      var fired=false;
      if(allDone && !mission.rewarded){mission.rewarded=true;fired=true;}
      return {done:done,total:total,allDone:allDone,fired:fired,rewarded:!!mission.rewarded};
    }
    var out={};
    // --- LETTER 막: 4단계 ---
    var L={letter:false,word:false,play:false,find:false,rewarded:false};
    out.L_after3 = gate(false, (L.letter=true,L.word=true,L.play=true,L));   // 3/4 → 아직
    out.L_afterFind = gate(false, (L.find=true,L));                           // 4/4 → 보상
    out.L_again = gate(false, L);                                             // 재호출 → 재보상 안 함
    // --- COMBINE/SENTENCE 막: 단일 트립 ---
    var S={letter:false,word:false,play:false,find:false,rewarded:false};
    // completeCombine/completeStory가 letter/word/play를 한 번에 채움
    S.letter=true;S.word=true;S.play=true;
    out.S_trip = gate(true, S);                                              // 3/3 → 보상
    out.S_again = gate(true, S);                                             // 재호출 → 재보상 안 함
    this.__out=JSON.stringify(out);
    """
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
    # LETTER: 3단계로는 아직 미완, find까지 해야 4/4로 보상, 재호출 시 다시 보상 안 함(정확히 1회)
    assert out["L_after3"] == {"done": 3, "total": 4, "allDone": False, "fired": False, "rewarded": False}
    assert out["L_afterFind"]["allDone"] is True
    assert out["L_afterFind"]["fired"] is True
    assert out["L_again"]["fired"] is False
    # COMBINE/SENTENCE: 단일 트립으로 3/3 보상, 재호출 시 다시 보상 안 함(정확히 1회)
    assert out["S_trip"] == {"done": 3, "total": 3, "allDone": True, "fired": True, "rewarded": True}
    assert out["S_again"]["fired"] is False
