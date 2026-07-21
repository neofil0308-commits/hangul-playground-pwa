# -*- coding: utf-8 -*-
"""콘텐츠 불변식 검사기 — 학습 데이터가 '맞고 충분한가'를 기계적으로 검증한다.

왜 필요한가: 정적 문자열 테스트(tests/*_check.py)는 "함수가 있다"는 확인하지만
"ㄷ의 예시 낱말이 딸기(ㄸ)다" 같은 **내용의 오류**는 못 잡는다. 2026-07-21 전수 검사에서
이런 오류가 다수 발견돼, 같은 종류가 다시 들어오지 못하도록 규칙을 코드로 못 박는다.

app-data.js를 Node vm으로 실제 평가해 데이터를 JSON으로 받아온 뒤 검증한다
(정규식 파싱은 데이터 구조가 바뀔 때마다 깨지므로 쓰지 않는다).

사용:
    python tools/check_content.py            # 전부 검사
    python tools/check_content.py --json     # 결과를 JSON으로(테스트에서 사용)

종료 코드 0 = 통과. 위반이 있으면 1.
"""

import json
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

CHO = list("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ",
        "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]
JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
        "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]

# app-data.js에서 꺼내올 상수. 앱이 실제로 쓰는 이름 그대로.
_EXPORTS = ("CURRICULUM EPISODE_PATH CONS VOWS VOWS_COMPLEX CONS_DOUBLE FINALS "
            "LETTER_WORDS FINAL_WORDS WORDS STORY_MILESTONES PRESET_SENTS "
            "SUBJ OBJ VERB BATCHIM_SYLL TRACE_WORDS ALL_LETTER_OBJS SPOKEN_UI_TEXTS").split()

_DUMPER = """
const fs=require('fs'), vm=require('vm');
const src=fs.readFileSync(%r,'utf8')+';__OUT=JSON.stringify({%s});';
const ctx={document:{getElementById:()=>null},console,__OUT:null};
vm.createContext(ctx); vm.runInContext(src,ctx);
process.stdout.write(ctx.__OUT);
"""


def load_data():
    """app-data.js를 평가해 상수를 dict로 돌려준다."""
    if not shutil.which("node"):
        raise RuntimeError("node가 필요합니다 (app-data.js를 평가해야 함)")
    script = _DUMPER % (str(ROOT / "app-data.js"), ",".join(_EXPORTS))
    out = subprocess.run([shutil.which("node"), "-e", script],
                         capture_output=True, text=True, timeout=60)
    if out.returncode != 0:
        raise RuntimeError(f"app-data.js 평가 실패:\n{out.stderr[:500]}")
    return json.loads(out.stdout)


def decompose(syllable):
    """한글 음절 → (초성, 중성, 종성). 음절이 아니면 None."""
    code = ord(syllable) - 0xAC00
    if not 0 <= code < 11172:
        return None
    return CHO[code // 588], JUNG[(code % 588) // 28], JONG[code % 28]


def jamo_in_word(word, jamo, position=None):
    """단어의 어느 음절에든 그 자모가 들어 있는가.

    position: 'cho'(초성)·'jung'(중성)·'jong'(종성)으로 제한. None이면 아무 자리나.
    """
    for ch in word:
        parts = decompose(ch)
        if not parts:
            continue
        cho, jung, jong = parts
        if position == "cho" and cho == jamo:
            return True
        if position == "jung" and jung == jamo:
            return True
        if position == "jong" and jong == jamo:
            return True
        if position is None and jamo in (cho, jung, jong):
            return True
    return False


def word_jamo(word):
    """단어를 만드는 데 필요한 자모 전부(종성 포함)."""
    need = set()
    for ch in word:
        parts = decompose(ch)
        if parts:
            need.update(p for p in parts if p)
    return need


def key_of(text):
    """앱의 keyOf()와 동일한 오디오 파일명 규칙 (codePointAt → hex, '-' 연결)."""
    return "-".join(format(ord(c), "x") for c in text)


# ── 검사 항목 ────────────────────────────────────────────────────────────────
# 각 함수는 (제목, [위반 문자열...])을 돌려준다.

def check_example_words_contain_their_sound(d):
    """예시 낱말은 그 글자의 소리를 실제로 담고 있어야 한다.

    화면 제목이 '이 글자 낱말'이므로, ㄷ 아래 '딸기'(ㄸ)가 있으면 음가를 잘못 가르친다.
    자음은 초성, 모음은 중성으로 등장해야 한다(단어 어느 음절이든 무방).
    """
    bad = []
    vowels = {v["ch"] for v in d["VOWS"] + d["VOWS_COMPLEX"]}
    for ch, words in d["LETTER_WORDS"].items():
        pos = "jung" if ch in vowels else "cho"
        for word, _emoji in words:
            if not jamo_in_word(word, ch, pos):
                bad.append(f"{ch} 예시 낱말 '{word}'에 {ch} 소리가 없음")
    return "예시 낱말이 그 글자의 소리를 담는가", bad


def check_final_words_have_that_final(d):
    """받침 예시 낱말은 그 받침을 실제로 가진 음절을 포함해야 한다."""
    bad = []
    for ch, words in d["FINAL_WORDS"].items():
        for word, _emoji in words:
            if not jamo_in_word(word, ch, "jong"):
                bad.append(f"받침 {ch} 예시 '{word}'에 {ch} 받침이 없음")
    return "받침 예시 낱말이 그 받침을 가지는가", bad


def check_combine_syllables_use_taught_jamo(d):
    """합치기 화의 음절은 그 시점까지 배운 자모만으로 이루어져야 한다.

    4막 받침 조립처럼 음절을 직접 만드는 화에 아직 안 배운 모음·자음이 섞이면
    아이가 조립할 수 없는 카드가 나온다.
    """
    bad = []
    taught = set()
    for act in d["CURRICULUM"]:
        for syl in act.get("syllables", []):
            missing = sorted(word_jamo(syl) - taught - {"ㅇ"})
            if missing:
                bad.append(f"{act['act']}막 음절 '{syl}'에 아직 안 배운 자모: {' '.join(missing)}")
        # 낱자 화가 먼저 나오는 막은 그 글자들도 이 막에서 배운 것으로 친다.
        taught.update(act.get("letters", []))
        taught.update(syl for syl in act.get("syllables", []))
    return "합치기 음절이 배운 자모로만 되어 있는가", bad


def check_milestone_prerequisites(d):
    """맛보기 단어는 그 시점까지 배운 자모만으로 이루어져야 한다.

    'ㅂ와 ㅏ를 익혔으니 아빠를 읽었어요'는 거짓이다 — 아빠에는 ㅃ(5막)가 필요하다.
    """
    bad = []
    order = []
    for act in d["CURRICULUM"]:
        if act.get("type") == "letter":
            order.extend(act["letters"])
    for m in d["STORY_MILESTONES"]:
        gate = max((order.index(c) for c in m["after"] if c in order), default=-1)
        learned = set(order[:gate + 1])
        # ㅇ은 소릿값이 없는 자리채움이라 예외로 두되, 데이터에 근거가 있어야 한다.
        missing = sorted(word_jamo(m["word"]) - learned - {"ㅇ"})
        if missing:
            bad.append(f"맛보기 '{m['word']}'(조건 {'+'.join(m['after'])})에 "
                       f"아직 안 배운 자모: {' '.join(missing)}")
    return "맛보기 선행조건이 맞는가", bad


def check_option_pool_covers_taught_letters(d, state_js):
    """게임 보기 풀이 그 막의 글자를 담아야 한다.

    풀에 없으면 정답만 모양이 달라져, 아이가 소리를 안 듣고도 고를 수 있다.
    """
    bad = []
    pool = {x["ch"] for x in d["CONS"] + d["VOWS"]}
    if "CONS_DOUBLE" in state_js:
        pool |= {x["ch"] for x in d["CONS_DOUBLE"]}
    if "VOWS_COMPLEX" in state_js:
        pool |= {x["ch"] for x in d["VOWS_COMPLEX"]}
    for act in d["CURRICULUM"]:
        if act.get("type") != "letter":
            continue
        missing = [c for c in act["letters"] if c not in pool]
        if missing:
            bad.append(f"{act['act']}막 글자가 보기 풀(ALL_LETTERS)에 없음: {' '.join(missing)}")
    return "게임 보기 풀이 배운 글자를 담는가", bad


def spoken_form(obj):
    """글자 객체를 앱이 실제로 소리내어 읽는 텍스트로 바꾼다.

    앱은 낱자(ㄱ)를 그대로 읽지 않고 이름('기역')이나 소릿값('아')으로 바꿔 읽는다
    (`sayJamo`). 따라서 MP3가 필요한 것은 낱자가 아니라 이 발화형이다.
    """
    return obj.get("name") or obj.get("sound") or obj["ch"]


def collect_spoken_texts(d):
    """앱이 소리내어 읽는 모든 텍스트 → {텍스트: 출처}.

    검사기와 음성 생성기(generate_voices.py)가 **이 함수 하나**를 공유한다.
    각자 목록을 들고 있으면 "화면엔 있는데 MP3가 없는" 문구가 반드시 생긴다.
    """
    texts = {}

    def put(text, source):
        if text and text not in texts:
            texts[text] = source

    for c in d["CONS"]:
        put(spoken_form(c), "자음 발화"), put(c["word"], "자음 예시")
    for c in d["CONS_DOUBLE"]:
        put(spoken_form(c), "쌍자음 발화"), put(c["word"], "쌍자음 예시")
    for v in d["VOWS"]:
        put(spoken_form(v), "모음 발화"), put(v["word"], "모음 예시")
    for v in d["VOWS_COMPLEX"]:
        put(spoken_form(v), "복모음 발화"), put(v["word"], "복모음 예시")
    for words in d["LETTER_WORDS"].values():
        for w, _ in words:
            put(w, "글자별 낱말")
    for words in d["FINAL_WORDS"].values():
        for w, _ in words:
            put(w, "받침 낱말")
    for words in d["WORDS"].values():
        for w, _ in words:
            put(w, "단어뱅크")
    for phrase in d.get("SPOKEN_UI_TEXTS", []):
        put(phrase, "UI 문구")
    for s in d["BATCHIM_SYLL"]:
        put(s, "받침 음절")
    for s in d["TRACE_WORDS"]:
        put(s, "따라쓰기 낱말")
    for m in d["STORY_MILESTONES"]:
        put(m["say"], "맛보기")
    for act in d["CURRICULUM"]:
        for s in act.get("syllables", []):
            put(s, "음절")
        for pair in (act.get("sylWords") or {}).values():
            put(pair[0], "음절 예시단어")
        for s in act.get("sentences", []):
            for w in s.split(" "):
                put(w, "문장 단어")

    return texts


def check_audio_coverage(d):
    """수집한 텍스트에 3음성 MP3가 모두 있는지. 없으면 기기 TTS로 폴백한다
    — README 설계원칙 1(기계음 금지) 위반."""
    texts = collect_spoken_texts(d)
    bad = []
    for voice in ("f", "kid", "m"):
        folder = ROOT / "audio" / voice
        have = {p.stem for p in folder.glob("*.mp3")} if folder.is_dir() else set()
        missing = sorted(t for t in texts if key_of(t) not in have)
        if missing:
            preview = " ".join(missing[:12]) + ("…" if len(missing) > 12 else "")
            bad.append(f"[{voice}] {len(missing)}개 누락: {preview}")
    return f"음성 커버리지 (텍스트 {len(texts)}종)", bad


def check_speech_resolves_every_letter():
    """낱자를 소리로 바꾸는 함수가 네 글자군을 모두 다뤄야 한다.

    `sayJamo`/`jamoSay`/`sayTrace`가 CONS·VOWS만 찾으면 쌍자음(5막)·복모음(6막)은
    이름/소릿값을 못 찾아 낱자를 그대로 읽고, MP3가 없어 기기 TTS로 떨어진다.
    네 글자군을 모두 담은 `ALL_LETTER_OBJS`를 참조하는지로 판정한다.
    """
    bad = []
    targets = [("index.html", "sayJamo"), ("app-learning.js", "jamoSay"),
               ("app-writing.js", "sayTrace")]
    for filename, fn in targets:
        text = (ROOT / filename).read_text(encoding="utf-8")
        idx = text.find(f"function {fn}")
        if idx < 0:
            bad.append(f"{filename}에 {fn} 없음")
            continue
        body = text[idx:idx + 400]
        if "ALL_LETTER_OBJS" not in body:
            bad.append(f"{filename} {fn}()가 ALL_LETTER_OBJS를 안 씀 "
                       "→ 쌍자음·복모음 발화 불가")
    return "낱자 발화가 네 글자군을 모두 다루는가", bad


def check_act_episode_counts(d, minimum=5):
    """막마다 최소한의 분량이 있어야 한다. 1화짜리 막은 학습 곡선에 구멍을 낸다."""
    bad = []
    counts = {}
    for ep in d["EPISODE_PATH"]:
        counts[ep["act"]] = counts.get(ep["act"], 0) + 1
    for act in d["CURRICULUM"]:
        n = counts.get(act["act"], 0)
        if n < minimum:
            bad.append(f"{act['act']}막 '{act['title']}' {n}화 (최소 {minimum}화)")
    return f"막별 분량 (최소 {minimum}화)", bad


def check_no_duplicate_emoji(d):
    """같이 보여지는 선택지 안에 같은 이모지가 두 번 나오면 그림으로 구분할 수 없다."""
    bad = []
    for cat, words in d["WORDS"].items():
        seen = {}
        for w, e in words:
            seen.setdefault(e, []).append(w)
        for e, ws in seen.items():
            if len(ws) > 1:
                bad.append(f"단어뱅크 '{cat}'에 {e} 중복: {', '.join(ws)}")
    for ch, words in d["LETTER_WORDS"].items():
        seen = {}
        for w, e in words:
            seen.setdefault(e, []).append(w)
        for e, ws in seen.items():
            if len(ws) > 1:
                bad.append(f"{ch} 낱말에 {e} 중복: {', '.join(ws)}")
    return "선택지 이모지 중복 없음", bad


def check_syllable_example_starts_with_syllable(d):
    """음절 막(3막)의 예시 낱말은 그 음절로 시작해야 한다('가' → '가방')."""
    bad = []
    for act in d["CURRICULUM"]:
        for syl in act.get("syllables", []):
            pair = (act.get("sylWords") or {}).get(syl)
            if not pair:
                bad.append(f"{act['act']}막 음절 '{syl}'에 예시 낱말 없음")
            elif not pair[0].startswith(syl):
                bad.append(f"{act['act']}막 '{syl}' 예시 '{pair[0]}'가 그 음절로 시작하지 않음")
    return "음절 예시 낱말이 그 음절로 시작하는가", bad


def run_all():
    d = load_data()
    state_js = (ROOT / "app-state.js").read_text(encoding="utf-8")
    # ALL_LETTERS 선언 줄만 본다 — 보기 풀의 실제 구성.
    decl = ""
    for line in state_js.splitlines():
        if "ALL_LETTERS=" in line:
            decl = line
            break
    return [
        check_example_words_contain_their_sound(d),
        check_final_words_have_that_final(d),
        check_syllable_example_starts_with_syllable(d),
        check_combine_syllables_use_taught_jamo(d),
        check_milestone_prerequisites(d),
        check_option_pool_covers_taught_letters(d, decl),
        check_speech_resolves_every_letter(),
        check_audio_coverage(d),
        check_act_episode_counts(d),
        check_no_duplicate_emoji(d),
    ]


def main():
    results = run_all()
    if "--json" in sys.argv:
        print(json.dumps([{"title": t, "violations": v} for t, v in results],
                         ensure_ascii=False))
        return 0 if all(not v for _, v in results) else 1

    total = 0
    for title, violations in results:
        if violations:
            total += len(violations)
            print(f"\n✗ {title} — {len(violations)}건")
            for v in violations:
                print(f"    · {v}")
        else:
            print(f"✓ {title}")
    if total:
        print(f"\n총 {total}건의 콘텐츠 위반. 계획의 각 단계가 끝나면 줄어듭니다.")
        return 1
    print("\n모든 콘텐츠 불변식 통과 ✅")
    return 0


if __name__ == "__main__":
    sys.exit(main())
