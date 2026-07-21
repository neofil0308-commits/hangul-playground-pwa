"""웹폰트 자체 호스팅 검증.

아동 대상 서비스라 제3자(구글 CDN) 런타임 로드가 다시 새어 들어오면 안 된다.
개인정보처리방침의 "제3자 전송 없음"과 오프라인 동작이 둘 다 여기에 달려 있다.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"

INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
STYLES = (ROOT / "styles.css").read_text(encoding="utf-8")
FONT_CSS = (FONTS / "fonts.css").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")

# 런타임에 실제로 네트워크를 타는 파일만 검사한다(문서·주석의 URL 언급은 무관).
RUNTIME_FILES = ["index.html", "styles.css", "sw.js", "manifest.json"] + [
    p.name for p in ROOT.glob("app-*.js")
]


def test_no_google_font_cdn_in_runtime_files():
    for name in RUNTIME_FILES:
        text = (ROOT / name).read_text(encoding="utf-8")
        # 주석 줄은 제외 — 왜 제거했는지 설명하며 도메인을 언급할 수 있다.
        for host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            for line in text.splitlines():
                stripped = line.strip()
                if stripped.startswith(("//", "/*", "*", "<!--")):
                    continue
                assert host not in line, f"{name}에 {host} 런타임 참조가 남아 있다"


def test_index_loads_local_font_stylesheet_before_styles():
    assert 'href="assets/fonts/fonts.css"' in INDEX
    # 폰트 선언이 styles.css보다 먼저 와야 첫 페인트에서 폰트가 적용된다.
    assert INDEX.index("assets/fonts/fonts.css") < INDEX.index('href="styles.css"')


def test_styles_has_no_import_rule():
    # 실제 @import 규칙만 본다(주석 속 언급은 제외).
    rules = [ln for ln in STYLES.splitlines() if ln.lstrip().startswith("@import")]
    assert not rules, f"styles.css의 @import는 렌더링을 막고 CDN을 되살린다: {rules}"


def test_font_css_references_only_local_woff2():
    urls = re.findall(r"url\(([^)]+)\)", FONT_CSS)
    assert urls, "fonts.css에 @font-face src가 없다"
    for url in urls:
        assert url.startswith("./") and url.endswith(".woff2"), url
        assert (FONTS / url[2:]).exists(), f"{url} 파일이 없다"


def test_all_three_families_present():
    for family in ("Gowun Dodum", "Jua", "Gaegu"):
        assert f"font-family: '{family}'" in FONT_CSS, f"{family} 선언 누락"
    # Gaegu는 400/700 두 굵기를 쓴다(.hint/.feedback 등이 700).
    assert "font-weight: 700" in FONT_CSS


def test_ofl_license_shipped():
    ofl = (FONTS / "OFL.txt").read_text(encoding="utf-8")
    assert "SIL Open Font License" in ofl
    for family in ("Gowun Dodum", "Jua", "Gaegu"):
        assert family in ofl, f"{family} 저작권 고지 누락"


def test_service_worker_precaches_font_css():
    assert "'./assets/fonts/fonts.css'" in SW
