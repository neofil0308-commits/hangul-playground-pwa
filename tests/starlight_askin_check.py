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
    # Phase2b: 큰 글자(글자 숲)·소리 동굴/글자 찾기 자모 보기·조립 트레이는
    # 모두 자모 캐릭터 SVG(jamoCharSVG → <svg class="jamo-char">)를 담는 투명 컨테이너로 통일.
    assert ".lopt-jamo .lglyph" in CSS
    assert ".lopt.lopt-jamo .lglyph .jamo-char" in CSS
    assert ".wb-tray .wb-card .jamo-char" in CSS
    # 옛 Phase2a CSS 그라디언트 타일은 SVG 캐릭터로 대체되어 사라짐.
    assert "background:linear-gradient(180deg,#a9d0f2,#7FB5E8" not in CSS
    # 큰 글자(글자 숲)는 자모 캐릭터 SVG 컨테이너(letterforest 체크에서도 잠금).
    assert ".ld-glyph{" in CSS and ".ld-glyph .jamo-char" in CSS


def test_listen_and_find_cards_tag_jamo_role():
    # 자모 보기 카드는 색 지정을 위해 jrole/lopt-jamo 클래스를 단다(단어 이모지 카드는 제외).
    assert "lopt lopt-jamo jrole-" in LEARN
    assert "lopt lopt-jamo jrole-" in LISTEN


def test_prominent_jamo_rendered_with_jamocharsvg_phase2b():
    # 조립 트레이(글자 공방·단어 동산)·글자 찾기 카드 = jamoCharSVG 캐릭터.
    assert "b.innerHTML=jamoCharSVG(j,isV)" in LEARN
    assert "jamoCharSVG(ch,fdKind(ch)==='v')" in LEARN
    # 소리 동굴 letter 모드 카드 = jamoCharSVG.
    assert "jamoCharSVG(o.glyph,isV)" in LISTEN
    # 낡은 원시 글리프 주입(텍스트 노드/이모지)이 남아있지 않아야 한다.
    assert "b.textContent=j;" not in LEARN


def test_listen_find_screens_night_cave_panel():
    # 별빛 그림책 시안: 소리 동굴/글자 찾기 = 밤하늘 보라 '동굴' 풀패널 + 골드 별빛.
    assert ".listen-wrap .listen-top{flex:0 0 320px" in CSS
    assert "linear-gradient(180deg,var(--night1) 0%,var(--night2) 62%,var(--night3) 100%)" in CSS
    # 상단 패널은 밤 패널 위 반투명 카드.
    assert "background:rgba(255,250,238,.08)" in CSS
    # '다시 듣기' 메인 CTA는 도톰한 오렌지(홈과 통일).
    assert ".bigplay{" in CSS
    assert "background:var(--pri);box-shadow:0 6px 0 var(--pri-d)" in CSS


# ---- 3) 하니 병아리 (design reference 'Hani' 컴포넌트 원본 이식) ----
def test_hani_chick_refined_and_reusable_svg():
    assert "function aiHaniSVG" in DATA
    assert "function aiHaniCore" in DATA
    # 시안 원본 팔레트: 몸 #F7C24C + 발그레 볼 #F49E9A.
    assert "#F7C24C" in DATA  # 몸
    assert "#F49E9A" in DATA  # 볼 blush
    # 헤더/이야기 얼굴을 병아리 SVG로 교체.
    assert "aiHaniSVG()" in HTML


# ---- 서비스워커 캐시 ----
def test_service_worker_cache_v52():
    assert "hangul-playground-v90" in SW
