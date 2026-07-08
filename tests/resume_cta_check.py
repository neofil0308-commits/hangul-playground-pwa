from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


def test_resume_cta_wired():
    assert "function resumeAdventure" in HTML
    assert 'onclick="resumeAdventure()"' in HTML
    # 복귀자면 '이어서 하기'로 라벨 변경.
    assert "이어서 하기 ▶" in HTML


def test_resume_goes_to_first_incomplete_step():
    ri = HTML.index("function resumeAdventure")
    body = HTML[ri:ri + 600]
    for row in ["mrowLetter", "mrowWord", "mrowPlay", "mrowFind"]:
        assert row in body, row
    assert "!mission.word" in body and "!mission.play" in body
