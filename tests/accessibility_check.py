"""접근성·디자인 정합성 회귀 방어 (2026-07-22 전수 검사 반영).

전수 검사에서 나온 것들:
  · `.hint`(전 화면 안내문)가 대비 1.91:1 — 아이도 부모도 읽기 어려웠다
  · `prefers-reduced-motion`이 `.scene`/인트로만 덮어 홈 화면 6곳이 계속 움직였다
  · 4세가 직접 누르는 버튼이 38px대(권장 44px)
  · 전역 버튼 두 개(홈·스티커)에만 aria-label이 없었다
  · 같은 키프레임/속성이 두 번 선언돼 '설계와 다른 값'이 적용 중이었다
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


def _luminance(hex_color):
    h = hex_color.lstrip("#")
    parts = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in parts]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(fg, bg):
    a, b = sorted([_luminance(fg), _luminance(bg)], reverse=True)
    return (a + 0.05) / (b + 0.05)


def rule_for(selector):
    """최상위에서 선언된 그 선택자의 본문을 돌려준다."""
    m = re.search(re.escape(selector) + r"\{([^}]*)\}", CSS)
    assert m, f"{selector} 규칙이 없다"
    return m.group(1)


# ── 대비 ────────────────────────────────────────────────────────────────────
# (텍스트 색, 실제로 얹히는 배경, 설명)
CONTRAST_CASES = [
    (".hint", "#D8C7A6", "전 화면 안내 문구"),
    ("header .sub", "#D8C7A6", "헤더 부제"),
    (".legal-note", "#FBF2DF", "결제 전 법적 고지"),
]


def test_text_contrast_meets_wcag_aa():
    for selector, bg, label in CONTRAST_CASES:
        body = rule_for(selector)
        m = re.search(r"color:(#[0-9A-Fa-f]{6})", body)
        assert m, f"{selector}에 color 선언이 없다"
        ratio = contrast(m.group(1), bg)
        assert ratio >= 4.5, (
            f"{label}({selector}) 대비 {ratio:.2f}:1 — WCAG AA 4.5 미만. "
            f"색 {m.group(1)} on {bg}")


def test_legal_note_is_large_enough_to_read():
    # 전자상거래법상 '명확히 표시'해야 하는 고지다. 12.5px는 너무 작았다.
    body = rule_for(".legal-note")
    m = re.search(r"font-size:([\d.]+)rem", body)
    assert m and float(m.group(1)) >= 0.85, f".legal-note 글자 크기가 너무 작다: {body}"


# ── 모션 ────────────────────────────────────────────────────────────────────
def test_reduced_motion_covers_home_animations():
    """홈 화면의 무한 반복 애니가 모두 reduced-motion에 덮여야 한다.

    이 설정을 켜는 가정은 대개 감각 예민이 이유라, 부분 대응은 대응 안 한 것과 같다.
    """
    m = re.search(r"@media \(prefers-reduced-motion: reduce\)\{(.*?)\n\}", CSS, re.S)
    assert m, "reduced-motion 블록이 없다"
    block = m.group(1)
    for selector in [".blob", "header .mascot", ".story-hero .story-face",
                     ".route-step.route-current", ".map-tw",
                     ".map-node.map-current .map-coin"]:
        assert selector in block, f"reduced-motion이 {selector}를 안 덮는다"


def test_no_duplicate_keyframes():
    """같은 이름의 @keyframes가 두 번 선언되면 뒤엣것이 이겨 설계와 다른 값이 적용된다."""
    names = re.findall(r"@keyframes\s+([\w-]+)", CSS)
    dupes = {n for n in names if names.count(n) > 1}
    assert not dupes, f"중복 정의된 키프레임: {dupes}"


def test_no_duplicate_property_in_same_rule():
    """한 규칙 안에서 같은 속성을 두 번 선언하면 앞엣것이 조용히 죽는다."""
    bad = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", CSS):
        props = re.findall(r"(?:^|;)\s*([a-z-]+):", m.group(2))
        for prop in ("padding", "font-size"):
            if props.count(prop) > 1:
                bad.append(m.group(1).strip()[:60])
    assert not bad, f"같은 속성이 중복 선언된 규칙: {bad}"


# ── 터치 타깃 ────────────────────────────────────────────────────────────────
def test_child_facing_buttons_are_large_enough():
    """4세가 직접 누르는 버튼은 최소 44px. 손가락 접촉면이 성인보다 크고 부정확하다."""
    for selector in [".wb-tool", ".cat-pills button", ".replay-intro", ".route-step"]:
        body = rule_for(selector)
        m = re.search(r"min-height:(\d+)px", body)
        assert m and int(m.group(1)) >= 44, (
            f"{selector}에 44px 이상 min-height가 없다: {body[:70]}")


# ── 라벨 ────────────────────────────────────────────────────────────────────
def test_global_icon_buttons_have_labels():
    for button_id in ["homeBtn", "stickerBtn"]:
        m = re.search(r'<button[^>]*id="' + button_id + r'"[^>]*>', HTML)
        assert m, f"#{button_id} 없음"
        assert "aria-label" in m.group(0), f"#{button_id}에 aria-label이 없다"


# ── 캐릭터 동일성 ────────────────────────────────────────────────────────────
def test_hani_is_the_same_drawing_everywhere():
    """주인공이 화면마다 OS 이모지와 손그림으로 갈리면 4세는 같은 친구로 인지하지 못한다."""
    assert "document.querySelectorAll('.lc-hani')" in HTML, (
        "게임 화면(.lc-hani)의 하니가 손그림 SVG로 교체되지 않는다")
    assert "aiHaniSVG()" in HTML


def test_intro_jamo_follows_consonant_blue_rule():
    """자음=파랑 규칙을 앱 첫 화면(인트로)에서부터 지켜야 한다.

    이전에는 인트로의 ㅁ이 주황, ㅇ이 초록이라 색으로 범주를 배우는 4세에게 반례가 됐다.
    """
    data = (ROOT / "app-data.js").read_text(encoding="utf-8")
    intro = data[data.index("const INTRO_PAGES"):data.index("var SCENE_ENV")]
    for stray in ("#f4b13c", "#5fae7a", "#7ec4e8"):
        assert stray not in intro, f"인트로 자모에 팔레트 밖 색 {stray}이 남아 있다"


# ── 반응형 ───────────────────────────────────────────────────────────────────
def test_portrait_and_short_viewport_are_handled():
    """아이패드 가로가 주 타깃이지만, 세로로 들거나 가로 폰이어도 깨지지 않아야 한다."""
    assert "@media (orientation:portrait)" in CSS
    assert "@media (max-height:" in CSS
