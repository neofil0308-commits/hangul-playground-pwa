"""법적 문서 3종(개인정보처리방침·이용약관·결제 및 환불 안내) 검증.

**무료 배포 기준**(2026-07-23 전환). 판매가 없으므로 전자상거래법상 사업자정보 표시 의무는
없지만, Play 스토어 심사는 개인정보처리방침 게시와 그 내용이 앱의 실제 동작과 일치할 것을
요구한다. 그래서 문서 존재뿐 아니라 **앱에서의 연결**과 **무료라는 사실의 일관성**을 확인한다.

유료 전환 시 되살려야 할 것: 판매자 정보(사업자등록번호·통신판매업 신고번호·주소·판매가),
청약철회 7일 기준, 구매 복원 조항. 이력은 git에 남아 있다.

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
# 무료 배포에서는 개발자명 하나만 남는다(Play Console 표시명 = 개인정보 보호책임자).
KNOWN_PLACEHOLDERS = {"[개발자명]"}


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


def test_settings_screen_links_privacy_and_terms():
    # 무료 배포에서 보호자가 상시 닿아야 하는 건 개인정보처리방침·이용약관 둘이다
    # (결제·환불 안내는 결제가 없으므로 설정에 노출하지 않고 문서 간 링크로만 닿는다).
    box = INDEX[INDEX.index('class="legal-links"'):]
    box = box[:box.index("</div>")]
    for name in ("privacy", "terms"):
        assert f'href="legal/{name}.html"' in box, f"설정 화면에 legal/{name}.html 링크 없음"


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


def test_terms_cover_developer_info_free_pricing_and_jurisdiction():
    t = DOCS["terms"]
    for token in ("개발자 정보", "이용 요금", "전액 무료", "지적재산권", "준거법"):
        assert token in t, f"이용약관에 '{token}' 항목 없음"


def test_refund_doc_states_app_is_free_and_has_no_payment():
    r = DOCS["refund"]
    for token in ("무료", "환불의 대상이 되는 결제도 없습니다", "neofil0308@gmail.com"):
        assert token in r, f"결제·환불 안내에 '{token}' 항목 없음"


def test_documents_never_advertise_a_price():
    # 무료 배포의 핵심 계약: 법적 문서가 요금을 표시하면 허위 표시이자 스토어 정책 위반이다.
    # 유료로 되돌릴 때 이 테스트가 먼저 깨져서 "문서도 같이 고쳐라"라고 알려 준다.
    for name, html in DOCS.items():
        assert "₩" not in html, f"{name}에 가격 표시(₩)가 남아 있음 — 무료 배포와 모순"
        assert "1회 구매" not in html, f"{name}에 '1회 구매' 문구가 남아 있음"


def test_privacy_data_safety_answer_stays_no_collection():
    # Play '데이터 보안' 양식에 "수집·공유 없음"으로 제출한다. 문서가 이와 어긋나면 정책 위반이다.
    p = DOCS["privacy"]
    assert "결제수단 정보를 수집·저장·열람하지 않으며" in p
    for token in ("광고 SDK", "추적 픽셀"):
        assert token in p, f"개인정보처리방침에 '{token}' 미사용 고지 없음"


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
