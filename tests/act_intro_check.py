from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = (ROOT / "app-data.js").read_text(encoding="utf-8")
EPISODE = (ROOT / "app-episode.js").read_text(encoding="utf-8")
STATE = (ROOT / "app-state.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_act_intros_data_lives_in_app_data_with_all_eight_acts():
    assert "const ACT_INTROS=" in DATA
    assert "const ACT_INTROS" not in HTML
    # 1~8막 각 항목이 존재하고 cap/say/svg 필드를 갖는지(순서대로 등장 확인).
    pos = DATA.index("const ACT_INTROS=")
    block = DATA[pos:]
    prev = -1
    for n in range(1, 9):
        key = f"\n  {n}:{{act:{n},"
        i = block.find(key)
        assert i > prev, f"act {n} missing or out of order"
        prev = i
        entry = block[i:i + 1400]
        assert "cap:" in entry, f"act {n} cap"
        assert "say:" in entry, f"act {n} say"
        assert "svg:aiScene(" in entry, f"act {n} svg"


def test_act_intro_caps_match_curriculum_concepts():
    for cap in ["모음의 빛", "자음 친구들", "글자 공방", "받침의 문",
                "쌍둥이 소리", "숨은 모음", "단어 마을", "이야기 책"]:
        assert cap in DATA, cap


def test_act_intro_shared_svg_builders_exist():
    for fn in ["function aiBub", "function aiHani", "function aiScene", "function aiOp"]:
        assert fn in DATA, fn


def test_open_act_intro_engine_exists_in_episode():
    for token in [
        "function openActIntro",
        "function speakActIntro",
        "function finishActIntro",
        "function maybeShowActIntro",
        "var actIntroActive",
        "deviceSpeak",          # 기기 TTS로 내레이션(MP3 없음)
    ]:
        assert token in EPISODE, token
    # 오프닝 인트로 함수를 재사용하도록 분기했는지.
    assert "if(actIntroActive)" in EPISODE


def test_act_intro_seen_tracking_lives_in_state():
    for token in [
        "actIntrosSeen",
        "function actIntroSeen",
        "function markActIntroSeen",
    ]:
        assert token in STATE, token
    assert "actIntrosSeen" not in HTML


def test_first_launch_dedup_marks_act_one_seen_when_opening_intro_finishes():
    # finishIntro가 1막을 본 것으로 표시해 첫 실행 중복을 막는다.
    fi = EPISODE.index("function finishIntro")
    assert "markActIntroSeen(1)" in EPISODE[fi:fi + 400]


def test_trigger_wired_into_render_mission_and_replay_button_present():
    assert "maybeShowActIntro" in HTML
    assert 'id="replayActIntro"' in HTML


def test_combine_animation_css_present():
    for token in [".scene .merge", ".scene .slideL", ".scene .drop", "@keyframes mergePulse"]:
        assert token in CSS, token
