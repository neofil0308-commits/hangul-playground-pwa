from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_premium_config():
    assert "const FREE_MAX_ACT=2" in DATA
    assert "UNLOCK_CODE" in DATA and "PREMIUM_PRICE" in DATA


def test_premium_hooks_device_global():
    for fn in ["function isUnlocked", "function unlockPremium", "function accessAllowed",
               "function canAddProfile", "function tryUnlockCode"]:
        assert fn in STATE, fn
    # 기기/가정 단위: 프로필 접두 없는 전역 키(raw).
    assert "_rawGet('hp_unlocked')" in STATE and "_rawSet('hp_unlocked','1')" in STATE
    # 콘텐츠 게이트는 FREE_MAX_ACT 기준.
    ai = STATE.index("function accessAllowed")
    assert "FREE_MAX_ACT" in STATE[ai:ai + 200]
    # 프로필 게이트: 첫 아이 무료(미구매면 1개 미만일 때만 추가).
    ci = STATE.index("function canAddProfile")
    assert "getProfiles().length<1" in STATE[ci:ci + 120]


def test_content_gate_and_paywall_in_home():
    assert 'id="paywall"' in HTML
    assert "accessAllowed" in HTML and "'epHearBtn'" in HTML   # 잠금 시 활동/미리보기 숨김
    # 활동 진입점 가드.
    assert HTML.count("!accessAllowed()") >= 2                 # resume/openTodayLetter 등


def test_profile_gate_and_unlock_modal():
    assert 'id="unlockModal"' in HTML and "function openUnlockModal" in HTML
    # 둘째 프로필 추가 시 캔애드 가드→이용권 모달.
    assert "!canAddProfile()" in HTML and "openUnlockModal()" in HTML
    assert "tryUnlockCode" in HTML


def test_paywall_styles():
    for sel in [".paywall", ".unlock-card"]:
        assert sel in CSS, sel
