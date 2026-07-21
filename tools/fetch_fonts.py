"""웹폰트 자체 호스팅 — Google Fonts에서 woff2 서브셋을 내려받아 assets/fonts/에 고정한다.

왜 자체 호스팅인가:
  ① 개인정보 — CDN 런타임 로드는 아동 사용자의 IP를 제3자(구글)로 보낸다.
     아동 대상 서비스라 개인정보처리방침에 "제3자 전송 없음"을 쓰려면 필수.
  ② 오프라인 — PWA가 네트워크 없이도 제 폰트로 뜬다.

구글이 서빙하는 woff2를 **그대로** 저장한다(재생성·서브셋 재가공 금지).
획순 정렬(app-writing.js `glyphInkBox`/`calibrateStrokes`)이 Jua 글리프 메트릭을
실측에 의존하므로, 폰트 바이너리가 바뀌면 획순이 글자와 어긋난다.

사용: python tools/fetch_fonts.py   (assets/fonts/*.woff2 + fonts.css 재생성)
"""

import pathlib
import re
import urllib.request

CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Gowun+Dodum&family=Jua&family=Gaegu:wght@400;700&display=swap"
)
# woff2를 받으려면 모던 브라우저 UA가 필요하다. 기본 UA로는 구형 ttf CSS가 내려온다.
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "fonts"
HEADER = """/* 자체 호스팅 웹폰트 — Google Fonts CDN 런타임 로드를 대체한다.
   이유: ① 아동 IP가 제3자(구글)로 전송되지 않게(개인정보처리방침 정합) ② 오프라인 동작.
   출처: Google Fonts css2 API가 서빙하는 woff2 서브셋 원본 그대로(글리프 메트릭 동일 —
   획순 정렬 calibrateStrokes/glyphInkBox가 Jua 메트릭에 의존하므로 재생성 금지).
   라이선스: 3종 모두 SIL Open Font License 1.1 (assets/fonts/OFL.txt).
   갱신 방법: tools/fetch_fonts.py 재실행. */
"""


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    css = get(CSS_URL).decode("utf-8")

    urls = sorted(set(re.findall(r"https://fonts\.gstatic\.com/[^)]*?\.woff2", css)))
    print(f"서브셋 {len(urls)}개 내려받는 중…")
    for i, url in enumerate(urls, 1):
        name = url.rsplit("/", 1)[-1]
        (OUT / name).write_bytes(get(url))
        if i % 60 == 0:
            print(f"  {i}/{len(urls)}")

    # url(https://fonts.gstatic.com/…/NAME.woff2) → url(./NAME.woff2)
    local = re.sub(
        r"url\(https://fonts\.gstatic\.com/[^)]*/([^/)]+\.woff2)\)", r"url(./\1)", css
    )
    assert "gstatic" not in local and "googleapis" not in local, "CDN 참조가 남았다"
    (OUT / "fonts.css").write_text(HEADER + local)
    print(f"완료: {OUT}/fonts.css ({len(urls)}개 로컬 경로)")


if __name__ == "__main__":
    main()
