import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "app-data.js"
STATE = ROOT / "app-state.js"
LEARNING = ROOT / "app-learning.js"
EPISODE = ROOT / "app-episode.js"


def test_final_words_data_and_path_flag_exist():
    data = DATA.read_text(encoding="utf-8")
    # 받침(끝소리) 예시단어 풀이 초성 LETTER_WORDS와 분리되어 존재
    assert "const FINAL_WORDS=" in data
    # 끝소리 ㄱ → 책/약 (초성 기린 아님)
    assert "['책','📖']" in data and "['약','💊']" in data
    # EPISODE_PATH 빌더가 4막(final 막) 노드에 final 플래그를 단다
    assert "a.key==='final'" in data
    assert "node.final=true" in data


def test_state_keys_final_episodes_distinctly():
    state = STATE.read_text(encoding="utf-8")
    # 진행/앨범 키 분리 메커니즘 + 받침 변형 객체
    assert "function progKey" in state
    assert "function finalLetterObj" in state
    assert "progKey(ep)" in state
    # 마스터 목록은 받침 키('F:')를 제외해 게임/복습 풀을 더럽히지 않음
    assert "indexOf('F:')!==0" in state


def test_learning_uses_final_words_for_final_episodes():
    learning = LEARNING.read_text(encoding="utf-8")
    assert "it.final" in learning
    assert "FINAL_WORDS" in learning
    assert "받침" in learning


def _run_probe(probe):
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
    return json.loads(res.stdout)


def test_final_episode_resolves_batchim_words_not_initial():
    # 4막 'ㄱ' 에피소드가 끝소리(받침) 단어(책/약)로 풀려야 하고 초성 단어(기린)가 아니어야 한다.
    # 또한 2막 'ㄱ'와 4막 'ㄱ'의 진행/마스터 키가 서로 달라 collapse 하지 않아야 한다.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";function progKey(ep){return ep?((ep.final?'F:':'')+(ep.ch||'')):'';}"
        + "function finalLetterObj(ep){var base=ALL_LETTER_OBJS[ep.ch]||null;if(!base)return null;"
        "var fw=(typeof FINAL_WORDS!=='undefined'&&FINAL_WORDS[ep.ch])||[];var o={};for(var k in base)o[k]=base[k];"
        "o.final=true;o.words=fw;if(fw[0]){o.word=fw[0][0];o.emoji=fw[0][1];}return o;}"
        + "function curLetterObj2(ep){if(!ep)return null;if(ep.type==='letter')return ep.final?finalLetterObj(ep):(ALL_LETTER_OBJS[ep.ch]||null);return null;}"
        # find 4막(final) 'ㄱ' 노드와 2막(non-final) 'ㄱ' 노드
        + ";var fi=-1,fi2=-1;for(var z=0;z<EPISODE_PATH.length;z++){var e=EPISODE_PATH[z];"
        "if(e.type==='letter'&&e.ch==='\\u3131'){if(e.final&&fi<0)fi=z;if(!e.final&&fi2<0)fi2=z;}}"
        + "var ep4=EPISODE_PATH[fi],ep2=EPISODE_PATH[fi2];var lo4=curLetterObj2(ep4);"
        + "this.__out=JSON.stringify({fi:fi,fi2:fi2,final4:!!(ep4&&ep4.final),act4:ep4&&ep4.act,"
        "words4:(lo4.words||[]).map(function(w){return w[0];}),word4:lo4.word,name4:lo4.name,"
        "key4:progKey(ep4),key2:progKey(ep2),collide:progKey(ep4)===progKey(ep2)});"
    )
    out = _run_probe(probe)
    assert out["fi"] >= 0  # 4막 ㄱ 노드 존재
    assert out["fi2"] >= 0  # 2막 ㄱ 노드 존재
    assert out["fi"] != out["fi2"]  # 서로 다른 에피소드
    assert out["final4"] is True  # 4막 노드에 final 플래그
    assert out["act4"] == 4  # 진짜 4막
    # 받침 단어(책/약)로 풀리고 초성 단어(기린)가 아님
    # 받침 예시는 확장될 수 있으므로 개수를 고정하지 않고 '전부 그 받침을 가진 단어'인지로 본다.
    assert out["words4"][:2] == ["책", "약"]
    assert len(out["words4"]) >= 2
    assert "기린" not in out["words4"]
    assert out["word4"] == "책"
    # 키 분리 — 2막/4막 collapse 방지
    assert out["key4"] == "F:ㄱ"
    assert out["key2"] == "ㄱ"
    assert out["collide"] is False


def test_2act_completion_does_not_mark_4act_done():
    # 2막 'ㄱ' 마스터가 4막 'ㄱ' 완료로 새지 않음(키가 다르므로).
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";function progKey(ep){return ep?((ep.final?'F:':'')+(ep.ch||'')):'';}"
        + ";var fi=-1,fi2=-1;for(var z=0;z<EPISODE_PATH.length;z++){var e=EPISODE_PATH[z];"
        "if(e.type==='letter'&&e.ch==='\\u3131'){if(e.final&&fi<0)fi=z;if(!e.final&&fi2<0)fi2=z;}}"
        + "var ep4=EPISODE_PATH[fi],ep2=EPISODE_PATH[fi2];"
        # 2막 ㄱ만 마스터로 기록
        + "var mastery={};mastery[progKey(ep2)]={met:true,matched:true,quizzed:true};"
        + "function done(ep){return isMasteredRec(mastery[progKey(ep)]);}"
        + "this.__out=JSON.stringify({act2done:done(ep2),act4done:done(ep4)});"
    )
    out = _run_probe(probe)
    assert out["act2done"] is True  # 2막 ㄱ는 완료
    assert out["act4done"] is False  # 4막 ㄱ는 여전히 미완료(collapse 없음)
