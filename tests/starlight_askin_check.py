"""별빛 그림책 리스킨(ASSET TONE) 검증.

이 패스의 3가지 시각 변경을 잠근다:
1) 이모지 → 네이티브(트웨모지 이미지 치환 제거)
2) 자모 타일(부드러운 둥근 색 타일 + 광택 + 그림자)
3) 하니 병아리 마스코트 둥글게/헤더 SVG 사용
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
LEARN = (ROOT / "app-learning.js").read_text(encoding="utf-8")
LISTEN = (ROOT / "app-listen.js").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")


# ---- 1) 네이티브 이모지 (트웨모지 드롭) ----
def test_twemojify_is_native_noop_not_twe_image():
    # 트웨모지 <img class="twe"> 생성 코드는 사라져야 한다.
    assert "img.className='twe'" not in HTML
    assert "class=\"twe\"" not in HTML
    # 함수는 여전히 호출 가능(안전한 no-op 패스스루)해야 한다.
    assert "function twemojify(root){ return; }" in HTML
    # 죽은 .twe 이미지 CSS 규칙 제거.
    assert "img.twe{" not in CSS


def test_twemojify_still_called_by_render_paths():
    # 호출부가 깨지지 않도록 여전히 호출되어야 한다.
    assert "twemojify(document.body)" in HTML
    assert "twemojify(" in LEARN and "twemojify(" in LISTEN


# ---- 2) 자모 타일 트리트먼트 ----
def test_jamo_tile_reusable_treatment_exists():
    assert ".jamo-tile" in CSS
    assert ".jamo-tile.jamo-vow" in CSS
    # 광택(gloss) + 도톰한 그림자.
    assert "inset 0 3px 5px rgba(255,255,255" in CSS


def test_jamo_tile_uses_semantic_colors():
    # 자음 파랑 / 모음 분홍.
    assert "#7FB5E8" in CSS  # con
    assert "#F3899F" in CSS  # vow


def test_jamo_tile_applied_to_prominent_jamo():
    # 큰 글자(글자 숲) / 소리·찾기 자모 보기 / 조립 트레이.
    assert ".lopt-jamo .lglyph" in CSS
    assert ".wb-tray .wb-card.jrole-c{background:linear-gradient(180deg,#a9d0f2,#7FB5E8" in CSS
    assert ".wb-tray .wb-card.jrole-v{background:linear-gradient(180deg,#f8b3c1,#F3899F" in CSS
    # 큰 글자(글자 숲)는 Phase2a에서 자모 캐릭터 SVG 컨테이너로 바뀜(letterforest 체크에서 잠금).
    assert ".ld-glyph{" in CSS and ".ld-glyph .jamo-char" in CSS


def test_listen_and_find_cards_tag_jamo_role():
    # 자모 보기 카드는 색 지정을 위해 jrole/lopt-jamo 클래스를 단다(단어 이모지 카드는 제외).
    assert "lopt lopt-jamo jrole-" in LEARN
    assert "lopt lopt-jamo jrole-" in LISTEN


# ---- 3) 하니 병아리 ----
def test_hani_chick_refined_and_reusable_svg():
    assert "function aiHaniSVG" in DATA
    # 더 둥근 병아리: 큰 머리 색 + 발그레 볼.
    assert "#ffdd63" in DATA  # 큰 머리
    assert "#ff9eb0" in DATA  # 볼 blush
    # 헤더/이야기 얼굴을 병아리 SVG로 교체.
    assert "aiHaniSVG()" in HTML


# ---- 서비스워커 캐시 ----
def test_service_worker_cache_v52():
    assert "hangul-playground-v52" in SW
