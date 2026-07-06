from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
REVIEW = (ROOT / "app-review.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")


def test_srs_model_and_helpers_live_in_state():
    for token in [
        "progress.review",           # 저장소
        "var REVIEW_INTERVALS=",     # Leitner 간격
        "function scheduleReview",
        "function dueReviewChs",
        "function gradeReview",
        "function dayKeyAdd",
        "function dayKeyLE",
    ]:
        assert token in STATE, token


def test_mastery_schedules_review():
    # 글자를 떼면(3게이트 충족) 즉시 복습 일정 등록.
    assert "scheduleReview(ep.ch)" in STATE
    # 3막 합치기 마스터도 복습 등록.
    mi = STATE.index("function completeCombine")
    assert "scheduleReview(ep.ch)" in STATE[mi:mi + 400]


def test_existing_users_seeded():
    # 이미 뗀 글자도 복습 대상으로 시딩(기능 도입 전 사용자 구제).
    assert "function seedReview" in STATE


def test_review_round_logic_present():
    for token in ["function startReview", "function nextReviewQ", "function checkReview", "function finishReview"]:
        assert token in REVIEW, token
    # 채점은 gradeReview로, 목표 소리는 speak로 재생.
    assert "gradeReview(ch,true)" in REVIEW and "gradeReview(ch,false)" in REVIEW
    # 비처벌: 오답 시 정답 강조(reveal) 후 진행.
    assert "reveal" in REVIEW


def test_review_screen_and_home_card_wired():
    assert 'id="review" class="screen"' in HTML
    assert 'id="revOpts"' in HTML and 'id="revScore"' in HTML
    assert 'id="reviewCard"' in HTML and 'onclick="startReview()"' in HTML
    assert "function renderReviewCard" in HTML
    assert "renderReviewCard();" in HTML            # 미션 렌더 시 갱신
    assert 'src="app-review.js"' in HTML
    assert ".review-card" in CSS


def test_service_worker_precaches_review_module():
    assert "./app-review.js" in SW
    assert "hangul-playground-v73" in SW
