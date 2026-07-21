"""법적 문서 3종(개인정보처리방침·이용약관·환불정책) 검증.

스토어 심사와 전자상거래법이 요구하는 항목들이다. 결제 진입 지점에서 약관·환불정책에
닿을 수 없으면 심사에서 막히므로, 문서 존재뿐 아니라 **앱에서의 연결**까지 확인한다.

주의: 판매자 정보는 아직 자리표시자(`[상호]` 등)다. 스토어 등록 전에 반드시 실제 값으로
교체해야 하며, `test_placeholders_use_known_markers`가 오타 난 마커를 잡아 준다.
남은 자리표시자 목록은 `python tools/check_legal_placeholders.py`로 확인.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEGAL = ROOT / "legal"

INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")
DOCS = {name: (LEGAL / f"{name}.html").read_text(encoding="utf-8")
        for name in ("privacy", "terms", "refund")}

# 배포 전 실제 값으로 교체해야 하는 자리표시자. 여기 없는 마커가 문서에 있으면 오타다.
KNOWN_PLACEHOLDERS = {
    "[시행일]", "[상호 또는 개발자명]", "[대표자 성명]", "[사업자등록번호]",
    "[통신판매업 신고번호]", "[사업장 주소]", "[문의 이메일]", "[책임자 성명]", "[판매가]",
}


def test_all_three_documents_exist():
    for name in ("privacy", "terms", "refund"):
        assert (LEGAL / f"{name}.html").exists(), f"legal/{name}.html 없음"


def test_documents_cross_link_to_each_other():
    # 어느 문서에서 시작해도 나머지 둘에 닿아야 한다(심사자·이용자 모두).
    for name, html in DOCS.items():
        others = [n for n in DOCS if n != name]
        for other in others:
            assert f'href="{other}.html"' in html, f"{name} → {other} 링크 누락"


def test_documents_link_back_to_app():
    for name, html in DOCS.items():
        assert 'href="../index.html"' in html, f"{name}에 앱 복귀 링크 없음"


def test_settings_screen_links_all_three_documents():
    for name in ("privacy", "terms", "refund"):
        assert f'href="legal/{name}.html"' in INDEX, f"앱에서 legal/{name}.html 링크 없음"


def test_payment_modal_discloses_terms_and_refund():
    # 전자상거래법: 결제 전에 약관·환불정책을 고지해야 한다.
    modal = INDEX[INDEX.index('id="unlockModal"'):]
    modal = modal[:modal.index("</div></div>")]
    assert "legal/terms.html" in modal, "결제 모달에 이용약관 고지 없음"
    assert "legal/refund.html" in modal, "결제 모달에 환불정책 고지 없음"


def test_privacy_policy_states_no_collection_and_no_third_party():
    p = DOCS["privacy"]
    # 앱의 실제 동작(외부 요청 0건, localStorage 전용)과 일치해야 한다.
    assert "수집하지 않습니다" in p
    assert "localStorage" in p
    assert "만 14세 미만" in p, "아동 대상 서비스의 필수 고지"
    assert "개인정보 보호책임자" in p


def test_terms_cover_price_payment_and_jurisdiction():
    t = DOCS["terms"]
    for token in ("판매자 정보", "무료", "구매 복원", "지적재산권", "준거법"):
        assert token in t, f"이용약관에 '{token}' 항목 없음"


def test_refund_covers_store_route_and_withdrawal_period():
    r = DOCS["refund"]
    for token in ("Google Play", "App Store", "청약철회", "7일", "미성년자"):
        assert token in r, f"환불정책에 '{token}' 항목 없음"


def test_placeholders_use_known_markers():
    for name, html in DOCS.items():
        for marker in re.findall(r"\[[^\]<>\n]+\]", html):
            assert marker in KNOWN_PLACEHOLDERS, f"{name}에 알 수 없는 자리표시자 {marker}"


def test_legal_pages_use_selfhosted_fonts_only():
    # 법적 문서 페이지도 앱과 같은 원칙 — 제3자 CDN 호출 금지.
    for name, html in DOCS.items():
        assert "../assets/fonts/fonts.css" in html, f"{name}이 자체 호스팅 폰트를 안 씀"
        for host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            assert host not in html, f"{name}에 {host} 참조"
    css = (LEGAL / "legal.css").read_text(encoding="utf-8")
    assert "@import" not in css and "http" not in css


def test_service_worker_precaches_legal_pages():
    for asset in ("./legal/privacy.html", "./legal/terms.html",
                  "./legal/refund.html", "./legal/legal.css"):
        assert f"'{asset}'" in SW, f"SW precache에 {asset} 없음"
