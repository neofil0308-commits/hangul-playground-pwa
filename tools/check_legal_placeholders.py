"""법적 문서에 남아 있는 자리표시자를 나열한다.

`legal/*.html`의 판매자 정보는 초안 단계에서 `[상호 또는 개발자명]` 같은 자리표시자로 두었다.
**스토어 등록·유료 판매 전에 전부 실제 값으로 교체해야 한다** — 사업자 정보 미표시는
전자상거래법 위반이고, 스토어 심사에서도 반려 사유다.

사용: python tools/check_legal_placeholders.py
      남은 자리표시자가 있으면 목록을 출력하고 종료 코드 1을 반환한다(배포 게이트로 쓸 수 있음).
"""

import pathlib
import re
import sys

LEGAL = pathlib.Path(__file__).resolve().parent.parent / "legal"


def main():
    found = {}
    for path in sorted(LEGAL.glob("*.html")):
        markers = sorted(set(re.findall(r"\[[^\]<>\n]+\]", path.read_text(encoding="utf-8"))))
        if markers:
            found[path.name] = markers

    if not found:
        print("✅ 남은 자리표시자 없음 — 법적 문서에 실제 판매자 정보가 채워져 있습니다.")
        return 0

    total = sum(len(v) for v in found.values())
    print(f"⚠️  아직 채우지 않은 자리표시자 {total}건 — 유료 판매 전에 교체하세요.\n")
    for name, markers in found.items():
        print(f"  legal/{name}")
        for m in markers:
            print(f"    · {m}")
    print("\n교체 후 이 스크립트를 다시 실행해 0건인지 확인하세요.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
