import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
DATA = ROOT / "app-data.js"
STATE = ROOT / "app-state.js"
EPISODE = ROOT / "app-episode.js"
CSS = ROOT / "styles.css"


def test_each_act_has_a_relic_emoji_in_data():
    data = DATA.read_text(encoding="utf-8")
    # 막마다 보물 이모지(relicEmoji)가 데이터로 붙어 있어야 한다.
    assert "relicEmoji:" in data
    for relic, emoji in [
        ("모음 별빛", "✨"),
        ("자음 열쇠", "🔑"),
        ("글자 망치", "🔨"),
        ("받침 돌", "🪨"),
        ("쌍둥이 종", "🔔"),
        ("숨은 별빛", "🌟"),
        ("단어 꽃다발", "💐"),
        ("별빛 편지", "💌"),
    ]:
        assert relic in data, relic
        assert emoji in data, emoji


def test_relic_award_and_detection_live_in_state():
    state = STATE.read_text(encoding="utf-8")
    for token in [
        "relics:[]",          # 진행도 기본값에 relics 배열
        "if(!progress.relics)",  # 옛 저장본 관대 처리
        "function awardRelic",
        "function relicForAct",
        "function actCompletedAt",
        "function actCurriculum",
    ]:
        assert token in state, token
        assert token not in HTML, token


def test_relic_overlay_and_shelf_live_in_episode_module():
    ep = EPISODE.read_text(encoding="utf-8")
    # 로직/렌더 함수는 외부 모듈에만 (HTML에 인라인되지 않음).
    for token in ["function showRelic", "function relicShelfHTML"]:
        assert token in ep, token
        assert token not in HTML, token
    # 연출 문구/컨테이너 참조는 에피소드 모듈에 존재 (relicPop DOM id는 HTML에도 정상 존재).
    for token in ["막 클리어", "relicPop", "relic-shelf", "보물 창고"]:
        assert token in ep, token
    # 막 클리어 감지 + 보물 적립이 에피소드 완료에 연결됨
    assert "actCompletedAt(progress.idx)" in ep
    assert "awardRelic(actDone)" in ep
    # 보물 연출은 기존 축하 패턴(confetti/speakSeq) 재사용
    assert "confetti" in ep
    assert "speakSeq" in ep


def test_relic_dom_and_css_exist():
    assert 'id="relicPop"' in HTML
    css = CSS.read_text(encoding="utf-8")
    for token in [".relic-card", ".relic-emoji", ".relic-name", ".relic-shelf", ".relic-slot"]:
        assert token in css, token


def test_service_worker_cache_bumped_for_relic_feature():
    assert "hangul-playground-v72" in SW


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


def test_act_completion_detection_identifies_correct_act():
    # 막 클리어 감지(actCompletedAt): 막의 마지막 에피소드면 그 막 번호, 아니면 0.
    # app-data.js의 EPISODE_PATH를 쓰고 상태의 actCompletedAt을 재현해 VM에서 검증.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";function actCompletedAt(idx){if(idx<0||idx>=EPISODE_PATH.length)return 0;"
        "var cur=EPISODE_PATH[idx];if(!cur)return 0;var nxt=EPISODE_PATH[idx+1];"
        "if(!nxt||nxt.act!==cur.act)return cur.act;return 0;}"
        + ";var a1last=-1;for(var z=0;z<EPISODE_PATH.length;z++){if(EPISODE_PATH[z].act===1)a1last=z;}"
        + ";this.__out=JSON.stringify({"
        + "a1lastCh:EPISODE_PATH[a1last].ch,"            # 1막 마지막 글자
        + "a1done:actCompletedAt(a1last),"               # 그 자리는 1막 클리어
        + "a1interior:actCompletedAt(a1last-1),"         # 1막 도중은 0
        + "lastNode:actCompletedAt(EPISODE_PATH.length-1),"  # 경로 끝 = 8막 클리어
        + "nextAct:EPISODE_PATH[a1last+1].act"            # 바로 다음은 2막
        + "});"
    )
    out = _run_probe(probe)
    assert out["a1lastCh"] == "ㅠ"      # 1막 마지막 모음
    assert out["a1done"] == 1           # 마지막 1막 글자 → 1막 클리어
    assert out["a1interior"] == 0       # 막 도중에는 보물 없음
    assert out["nextAct"] == 2          # 막 경계 다음은 2막
    assert out["lastNode"] == 8         # 경로 끝(8막 마지막) → 8막 클리어


def test_relic_for_act_maps_emoji_and_name():
    # relicForAct(n): 막 번호 → {act,relic,emoji}. 데이터 매핑이 맞는지 VM에서 확인.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";function actCurriculum(n){for(var i=0;i<CURRICULUM.length;i++){if(CURRICULUM[i].act===n)return CURRICULUM[i];}return null;}"
        + ";function relicForAct(n){var a=actCurriculum(n);return a?{act:n,relic:a.relic,emoji:a.relicEmoji||'\\u2b50'}:null;}"
        + ";this.__out=JSON.stringify({r1:relicForAct(1),r8:relicForAct(8)});"
    )
    out = _run_probe(probe)
    assert out["r1"]["relic"] == "모음 별빛"
    assert out["r1"]["emoji"] == "✨"
    assert out["r8"]["relic"] == "별빛 편지"
    assert out["r8"]["emoji"] == "💌"
