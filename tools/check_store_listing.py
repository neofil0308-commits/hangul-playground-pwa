"""스토어 등록정보 문안이 Play의 글자 수 제한을 넘지 않는지 확인한다.

왜 필요한가: Play Console은 붙여넣는 순간 잘라내거나 거부한다. 제출 직전에 발견하면
문안을 급히 줄이게 되고, 급히 줄인 문장은 대개 어색해진다. 미리 잡는다.

세는 단위는 **문자 수**다(바이트 아님). 한글 한 글자가 1자다.

사용: python tools/check_store_listing.py
      제한을 넘으면 종료 코드 1 (배포 게이트로 쓸 수 있음).
"""

import pathlib
import re
import sys

DOC = pathlib.Path(__file__).resolve().parent.parent / "스토어_등록정보.md"

# (문서의 절 제목, Play 제한)
LIMITS = [
    ("앱 이름", 30),
    ("짧은 설명", 80),
    ("자세한 설명", 4000),
]


def extract(md, heading):
    """`## <heading> (…)` 절 안의 첫 코드블록 내용을 돌려준다."""
    pattern = rf"^## {re.escape(heading)}.*?^```\n(.*?)^```"
    m = re.search(pattern, md, re.S | re.M)
    if not m:
        raise SystemExit(f"❌ '{heading}' 절의 코드블록을 찾지 못했다 — 문서 형식이 바뀌었나?")
    return m.group(1).rstrip("\n")


def main():
    md = DOC.read_text(encoding="utf-8")
    failed = False

    for heading, limit in LIMITS:
        text = extract(md, heading)
        n = len(text)
        over = n - limit
        if over > 0:
            print(f"❌ {heading}: {n}자 — 제한 {limit}자를 {over}자 초과")
            failed = True
        else:
            bar = "여유 " + str(-over) + "자"
            print(f"✅ {heading}: {n}자 / {limit}자 ({bar})")

    if failed:
        print("\n제한을 넘은 항목을 줄인 뒤 다시 실행하세요.")
        return 1

    print("\n모든 항목이 Play 글자 수 제한 안에 있습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
