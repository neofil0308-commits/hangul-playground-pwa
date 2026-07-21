"""초기 '한글 놀이터' 잔재 화면이 되살아나지 않는지 검증.

배경: 모험 플로우(커리큘럼)와 초기 놀이터 화면이 공존해 "엉망진창" 느낌의 원인이었다.
2026-07-21에 도달 경로를 전수 추적한 결과 `letters/syl/word/sent/sentWrite` 5종은
**어디서도 진입할 수 없는 죽은 화면**이었고(match/quiz는 이미 이전에 삭제됨), 전부 제거했다.

주의 — `trace`는 잔재가 아니다. 단어 동산의 '✏️ 써보기'(wbWrite)에서 진입하는 살아있는
화면이므로 지우면 기능이 사라진다. 이 테스트가 그 경계를 지킨다.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JS = {p.name: p.read_text(encoding="utf-8") for p in ROOT.glob("app-*.js")}
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")

REMOVED = ["letters", "syl", "word", "sent", "sentWrite", "match", "quiz"]
# 모험 플로우의 살아있는 화면 — 하나라도 사라지면 기능 회귀다.
LIVE = ["intro", "letterDetail", "wordBuild", "combine", "story",
        "trace", "listen", "review", "find", "sticker", "set"]


def screens():
    return re.findall(r'<section id="(\w+)" class="screen">', HTML)


def test_removed_screens_have_no_markup():
    present = screens()
    for name in REMOVED:
        assert name not in present, f"잔재 화면 '{name}' 마크업이 되살아났다"


def test_live_screens_all_present():
    present = screens()
    for name in LIVE:
        assert name in present, f"모험 플로우 화면 '{name}' 누락"
    assert len(present) == len(LIVE), f"예상 밖 화면: {set(present) - set(LIVE)}"


def test_no_navigation_into_removed_screens():
    corpus = HTML + "".join(JS.values())
    for name in REMOVED:
        assert f"go('{name}')" not in corpus, f"제거된 화면 '{name}'으로 이동하는 코드가 있다"


def test_trace_screen_stays_reachable_from_word_garden():
    # 단어 동산 '써보기' → loadCustomTrace + go('trace'). 이 경로가 trace의 유일한 입구다.
    learning = JS["app-learning.js"]
    assert "loadCustomTrace" in learning and "go('trace')" in learning, (
        "단어 동산에서 따라쓰기로 가는 경로가 끊겼다"
    )
    assert "function loadCustomTrace" in JS["app-writing.js"]


def _strip_comments(text):
    """주석 제거 — 왜 지웠는지 설명하며 옛 함수명을 언급하는 것은 정상이다."""
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"^\s*//.*$", "", text, flags=re.M)


def test_removed_screen_helpers_are_gone():
    corpus = _strip_comments(HTML + "".join(JS.values()))
    for fn in ("renderLetters", "initLetterTabs", "renderWords", "initWordStudy",
               "initSyllableBuilder", "initSentenceWriting", "startWriting",
               "buildSentBoxes", "composedText"):
        assert f"function {fn}" not in corpus, f"제거된 함수 '{fn}' 정의가 남아 있다"
        assert f"{fn}()" not in corpus, f"제거된 함수 '{fn}' 호출이 남아 있다"


def test_shared_data_survived():
    # 제거한 화면이 쓰던 데이터 중 살아있는 막이 공유하는 것들 — 같이 지우면 안 된다.
    data = (ROOT / "app-data.js").read_text(encoding="utf-8")
    for name in ("SUBJ", "OBJ", "VERB", "PRESET_SENTS", "WORDS", "CHO", "JUNG", "JONG"):
        assert re.search(rf"const {name}=", data), f"공유 데이터 {name}이 사라졌다"


def test_lettersTab_kept_for_letter_detail_styling():
    # 목록 화면은 없어졌지만 openLetterDetail이 자음/모음 표시에 이 값을 쓴다.
    learning = JS["app-learning.js"]
    assert "let lettersTab='con'" in learning
    assert "lettersTab==='vow'" in learning


def test_dead_css_for_removed_screens_is_gone():
    for cls in (".builder", ".formula", ".pick3", ".sent-boxes", ".sent-cell",
                ".crayons", ".preset-sent", ".letter-tabs"):
        assert cls not in CSS, f"제거된 화면의 CSS '{cls}'가 남아 있다"
