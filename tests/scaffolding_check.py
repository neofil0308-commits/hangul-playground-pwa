from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REVIEW = (ROOT / "app-review.js").read_text(encoding="utf-8")
LISTEN = (ROOT / "app-listen.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_review_graduated_scaffolding():
    assert "revWrong" in REVIEW
    # 3회 오답에 정답 공개, 2회에 보기 축소(dim).
    assert "revWrong>=3" in REVIEW
    assert "revWrong===2" in REVIEW and "'dim'" in REVIEW
    # 힌트 없이 맞혀야 승급.
    assert "gradeReview(ch,revWrong===0)" in REVIEW


def test_listen_word_stage_graduated_not_instant_reveal():
    assert "listenWrong" in LISTEN
    assert "listenWrong>=3" in LISTEN         # 3회에만 정답 공개
    assert "listenWrong===2" in LISTEN and "'dim'" in LISTEN


def test_dim_option_style():
    assert ".lopt.dim" in CSS
