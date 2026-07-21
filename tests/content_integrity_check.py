"""콘텐츠 불변식을 pytest에 연결한다 (tools/check_content.py 래퍼).

**래칫(ratchet) 방식**: 2026-07-22 전수 검사 시점에 위반이 13건 있었고, 개선 계획의
단계마다 줄어든다. 테스트는 "현재 기준치를 넘지 않는다"를 검사하므로

  · 위반이 늘어나면 → 즉시 실패 (회귀 차단)
  · 위반이 줄어들면 → 기준치를 낮추라고 알려 줌 (개선이 굳어짐)

최종 목표는 MAX_VIOLATIONS = 0이다. 그때 이 파일의 래칫은 지우고
`test_no_violations`만 남기면 된다.
"""

import json
import pathlib
import shutil
import subprocess

import pytest

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHECKER = ROOT / "tools" / "check_content.py"

# 남은 위반 수. 계획 단계가 끝날 때마다 낮춘다. 0이 목표.
MAX_VIOLATIONS = 4

# 이미 0건이라 절대 되돌아가면 안 되는 항목 (제목의 앞부분으로 매칭).
LOCKED_CLEAN = [
    "예시 낱말이 그 글자의 소리",
    "받침 예시 낱말",
    "음절 예시 낱말",
    "맛보기 선행조건",
    "게임 보기 풀",
    "낱자 발화",
    "선택지 이모지",
]


@pytest.fixture(scope="module")
def results():
    if not shutil.which("node"):
        pytest.skip("node 없음 — app-data.js를 평가할 수 없다")
    out = subprocess.run(["python3", str(CHECKER), "--json"],
                         capture_output=True, text=True, timeout=120, cwd=ROOT)
    if not out.stdout.strip():
        pytest.fail(f"검사기 실행 실패: {out.stderr[:400]}")
    return json.loads(out.stdout)


def test_checker_runs_and_reports_every_category(results):
    assert len(results) >= 8, "검사 항목이 줄었다 — 규칙을 지우지 말 것"
    for r in results:
        assert "title" in r and isinstance(r["violations"], list)


def test_violation_count_does_not_regress(results):
    total = sum(len(r["violations"]) for r in results)
    assert total <= MAX_VIOLATIONS, (
        f"콘텐츠 위반이 {total}건으로 늘었다(기준 {MAX_VIOLATIONS}건). "
        "`python tools/check_content.py`로 확인할 것."
    )
    if total < MAX_VIOLATIONS:
        pytest.fail(
            f"위반이 {total}건으로 줄었다 🎉 — MAX_VIOLATIONS를 {total}로 낮춰 "
            "이 개선을 고정하세요."
        )


@pytest.mark.parametrize("prefix", LOCKED_CLEAN)
def test_locked_categories_stay_clean(results, prefix):
    for r in results:
        if r["title"].startswith(prefix):
            assert not r["violations"], (
                f"'{r['title']}'는 통과 상태였는데 위반이 생겼다: {r['violations']}")
            return
    pytest.fail(f"검사 항목 '{prefix}'가 사라졌다")
