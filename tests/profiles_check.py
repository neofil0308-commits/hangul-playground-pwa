from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_profile_storage_layer():
    for t in ["function activeProfile", "function _pk", "_GLOBAL_KEYS",
              "function getProfiles", "function addProfile", "function switchProfile"]:
        assert t in STATE, t
    # 저장 함수가 프로필 접두를 적용.
    for fn in ["function lsGet", "function lsSet", "function lsJSON", "function lsSetJSON"]:
        i = STATE.index(fn)
        assert "_pk(" in STATE[i:i + 120], fn


def test_existing_user_migration_to_p1():
    assert "_migrateProfiles" in STATE
    mi = STATE.index("_migrateProfiles")
    body = STATE[mi:mi + 700]
    assert "hp_profiles" in body and "'p1:'" in body
    # 진도·미션·도장 등 핵심 키를 이전.
    assert "hp_progress" in body and "hp_stickers" in body


def test_profile_ui_wired():
    assert 'id="profileModal"' in HTML
    assert 'id="profileBtn"' in HTML and "openProfileModal()" in HTML
    for fn in ["function renderProfileChip", "function renderProfileList", "function openProfileModal"]:
        assert fn in HTML, fn
    assert "renderProfileChip();" in HTML
    for sel in [".profile-item", ".profile-chip"]:
        assert sel in CSS, sel
