import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "app-data.js"
STATE = ROOT / "app-state.js"

# 6막 숨은 모음(복합·이중 모음) — curLetterObj가 ㅐ 등을 풀어내고(랜덤 ㅏ 폴백 금지),
# 예시 단어/그림이 있는지 검증. (기존 combine/sentence 검증과 같은 node VM 프로브 패턴.)

COMPLEX = ["ㅐ", "ㅔ", "ㅒ", "ㅖ", "ㅘ", "ㅙ", "ㅚ", "ㅝ", "ㅞ", "ㅟ", "ㅢ"]


def test_complex_vowels_defined_with_correct_jung_index():
    data = DATA.read_text(encoding="utf-8")
    # 6막 글자가 별도 복합모음 객체로 정의되고, 같은 조회 경로(ALL_LETTER_OBJS)에 합류
    assert "const VOWS_COMPLEX=" in data
    assert "CONS.concat(VOWS).concat(VOWS_COMPLEX)" in data
    # LETTER_WORDS에 6막 모음별 예시 단어
    for ch in COMPLEX:
        assert f"'{ch}':[" in data, ch


def _run(probe):
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


def test_act6_episode_resolves_to_complex_vowel_not_fallback():
    # 6막(ㅐ) 에피소드에서 curLetterObj가 ㅏ로 폴백하지 않고 ㅐ를 풀어내야 한다.
    # app-data.js를 그대로 쓰고, 상태 분기(curLetterObj)를 재현해 검증.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        # 6막(vowel-complex) 첫 글자 ㅐ 노드를 찾는다
        + ";var ci=-1;for(var z=0;z<EPISODE_PATH.length;z++){"
        "if(EPISODE_PATH[z].actKey==='vowel-complex'&&EPISODE_PATH[z].ch==='\\u3150'){ci=z;break;}}"
        + "var progress={idx:ci,mastery:{},album:[],milestones:[]};"
        + "function curEpisode(){return EPISODE_PATH[Math.min(progress.idx,EPISODE_PATH.length-1)];}"
        + "function curLetterObj(){var ep=curEpisode();if(!ep)return null;"
        "if(ep.type==='letter')return ALL_LETTER_OBJS[ep.ch]||null;return null;}"
        + ";var ep=curEpisode();var lo=curLetterObj();"
        + "this.__out=JSON.stringify({ci:ci,epCh:ep&&ep.ch,act:ep&&ep.act,"
        "resolved:!!lo,ch:lo&&lo.ch,sound:lo&&lo.sound,word:lo&&lo.word,emoji:lo&&lo.emoji});"
    )
    out = _run(probe)
    assert out["ci"] >= 0  # 6막 ㅐ 노드가 경로에 존재
    assert out["act"] == 6
    assert out["epCh"] == "ㅐ"
    assert out["resolved"] is True  # 폴백(null→랜덤 ㅏ) 아님
    assert out["ch"] == "ㅐ"  # ㅏ가 아니라 ㅐ로 해석
    assert out["sound"] == "애"
    assert out["word"] == "개미"
    assert out["emoji"] == "🐜"


def test_all_act6_vowels_resolve_with_word_and_emoji():
    # 6막 11개 글자가 모두 자기 자신으로 해석되고 단어/그림을 갖는다.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";var letters=[];CURRICULUM.forEach(function(a){if(a.key==='vowel-complex')letters=a.letters;});"
        + "var out=letters.map(function(ch){var o=ALL_LETTER_OBJS[ch];"
        "return {ch:ch,ok:!!o,same:!!o&&o.ch===ch,med:o&&o.med,word:o&&o.word,emoji:o&&o.emoji};});"
        + "this.__out=JSON.stringify({n:letters.length,rows:out});"
    )
    out = _run(probe)
    assert out["n"] == 11
    # JUNG 인덱스 검증값(med)
    expect_med = {
        "ㅐ": 1, "ㅔ": 5, "ㅒ": 3, "ㅖ": 7, "ㅘ": 9, "ㅙ": 10,
        "ㅚ": 11, "ㅝ": 14, "ㅞ": 15, "ㅟ": 16, "ㅢ": 19,
    }
    for row in out["rows"]:
        ch = row["ch"]
        assert row["ok"] is True, ch
        assert row["same"] is True, ch  # 자기 자신으로 해석(폴백 아님)
        assert row["med"] == expect_med[ch], ch
        assert row["word"], ch
        assert row["emoji"], ch


def test_med_matches_actual_jung_array():
    # 각 복합모음의 med가 JUNG 배열의 실제 인덱스와 일치하는지(직접 대조).
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";var out={};VOWS_COMPLEX.forEach(function(v){out[v.ch]=(JUNG[v.med]===v.ch);});"
        + "this.__out=JSON.stringify(out);"
    )
    out = _run(probe)
    for ch in COMPLEX:
        assert out[ch] is True, ch


def test_strokes_has_all_complex_vowels():
    # 복합·이중 모음 11개가 STROKES에 추가되어 단일 자모 획순 오버레이가 나오는지.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";var cv=['\\u3150','\\u3154','\\u3152','\\u3156','\\u3158','\\u3159',"
        "'\\u315a','\\u315d','\\u315e','\\u315f','\\u3162'];"
        + "var out=cv.map(function(ch){var a=STROKES[ch];"
        "return {ch:ch,ok:Array.isArray(a),n:a?a.length:0};});"
        + "this.__out=JSON.stringify(out);"
    )
    out = _run(probe)
    expect_n = {
        "ㅐ": 3, "ㅔ": 3, "ㅒ": 4, "ㅖ": 4, "ㅘ": 4, "ㅙ": 5,
        "ㅚ": 3, "ㅝ": 4, "ㅞ": 5, "ㅟ": 3, "ㅢ": 2,
    }
    assert len(out) == 11
    for row in out:
        assert row["ok"] is True, row["ch"]
        assert row["n"] == expect_n[row["ch"]], row["ch"]


def test_composed_strokes_for_complex_vowel_syllables_nonnull():
    # 개/게/과/외/의 — 복합모음이 STROKES에 생겼으니 자음만 들어간 부분 오버레이가 아니라
    # 자음+모음 전체 획순(>= 자음획수+모음획수)이 합성돼야 한다.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";var out={};['\\uac1c','\\uac8c','\\uacfc','\\uc678','\\uc758'].forEach("
        "function(ch){var r=composedStrokes(ch);out[ch]=r?r.length:0;});"
        + "this.__out=JSON.stringify(out);"
    )
    out = _run(probe)
    for ch in ["개", "게", "과", "외", "의"]:
        assert out[ch] > 0, ch


def test_basic_vowel_set_for_act1_unchanged():
    # 복합모음 추가가 1막 기본 모음 집합을 바꾸지 않아야 한다.
    src = DATA.read_text(encoding="utf-8")
    probe = (
        src
        + ";var a1=[];CURRICULUM.forEach(function(a){if(a.act===1)a1=a.letters;});"
        + "this.__out=JSON.stringify({act1:a1,vows:VOWS.map(function(v){return v.ch;})});"
    )
    out = _run(probe)
    assert out["act1"] == ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅑ", "ㅕ", "ㅛ", "ㅠ"]
    # 기본 VOWS 10개는 그대로(복합모음은 별도 배열)
    assert out["vows"] == ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"]
