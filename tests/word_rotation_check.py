from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")


def test_featured_word_rotation():
    assert "function featuredWord" in STATE
    fi = STATE.index("function featuredWord")
    body = STATE[fi:fi + 700]
    assert "LETTER_WORDS" in body            # 예시 뱅크에서 뽑음
    assert "86400000" in body                # 날짜 순번 기반 로테이션
    # pickToday가 로테이션 함수를 사용(글자형 막은 featuredWord, 7막 단어 마을은 wordActWord).
    pi = STATE.index("function pickToday")
    picktoday = STATE[pi:pi + 800]
    assert "featuredWord(" in picktoday
    assert "wordActWord(" in picktoday          # 7막: 오늘의 단어 로테이션
    # 7막 단어 로테이션도 날짜 순번 기반.
    assert "function wordActWord" in STATE
    wi = STATE.index("function wordActWord")
    assert "86400000" in STATE[wi:wi + 400]


def test_word_bank_has_multiple_examples_per_letter():
    # 대표 자음은 로테이션이 의미 있으려면 예시가 여러 개.
    for ch in ["ㄱ", "ㄴ", "ㅁ", "ㅅ", "ㅇ"]:
        m = re.search(r"'" + ch + r"':\[(.*?)\]\]", DATA)
        assert m, ch
        assert m.group(0).count("[") >= 4, ch   # 최소 3~4개 이상
