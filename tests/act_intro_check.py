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
    # 1~8막 각 항목이 존재하고 pages 배열(쪽마다 cap/say/svg)을 갖는지(순서대로 등장 확인).
    pos = DATA.index("const ACT_INTROS=")
    block = DATA[pos:]
    prev = -1
    for n in range(1, 9):
        key = f"\n  {n}:{{act:{n},pages:["
        i = block.find(key)
        assert i > prev, f"act {n} missing or out of order"
        prev = i
        # 이 막 항목 = 다음 막 키(또는 블록 끝)까지.
        nxt = block.find(f"\n  {n+1}:{{act:{n+1},pages:[") if n < 8 else len(block)
        entry = block[i:nxt if nxt > 0 else len(block)]
        # 막마다 정확히 3쪽: cap/say/svg:aiScene(가 세 번씩 등장.
        assert entry.count("cap:") == 3, f"act {n} needs 3 pages (cap)"
        assert entry.count("say:") == 3, f"act {n} needs 3 pages (say)"
        assert entry.count("svg:aiScene(") == 3, f"act {n} needs 3 pages (svg)"


def test_act_intro_caps_tell_a_connected_letter_story():
    # 도착 → 도우미+개념 → 전환의 3쪽 흐름을 잇는 대표 caps.
    for cap in ["텅 빈 편지", "반딧불이 깜빡이", "모음을 불러요",
                "숲지기 도토리", "대장장이 곰", "받침돌을 얹어요",
                "메아리 동굴", "별빛 뒤", "글자가 모여 단어", "편지가 살아나요"]:
        assert cap in DATA, cap
    # 도우미 캐릭터(도토리/뚝딱/끄떡/요정)와 편지 모티프가 이야기에 등장.
    for token in ["다람쥐 도토리", "두꺼비 끄떡", "별빛 요정", "별빛 우체국 편지"]:
        assert token in DATA, token


def test_act_intro_shared_svg_builders_exist():
    for fn in ["function aiBub", "function aiHani", "function aiScene", "function aiOp",
               "function aiHelper", "function aiLetter"]:
        assert fn in DATA, fn


def test_subcharacters_are_handdrawn_character_builders():
    # 막 도우미 7종이 하니 톤 손그림 빌더로 정의돼야 한다(이모지 카드 aiHelper 아님).
    for fn in ["function aiFirefly", "function aiSquirrel", "function aiBear", "function aiToad",
               "function aiBats", "function aiFairy", "function aiButterfly", "function aiName"]:
        assert fn in DATA, fn
    # ACT_INTROS가 실제로 캐릭터 빌더를 호출한다.
    for call in ["aiFirefly(", "aiSquirrel(", "aiBear(", "aiToad(", "aiBats(", "aiFairy(", "aiButterfly("]:
        assert call in DATA, call
    # 옛 이모지 도우미 카드 호출(동물 이모지)은 더 이상 남아있지 않다.
    for gone in ["'✨','반딧불이", "'🐿️','다람쥐", "'🐻','대장장이", "'🐸','두꺼비", "'🦇🦇'", "'🧚'", "'🦋','나비"]:
        assert gone not in DATA, gone


def test_act_intro_engine_is_multi_page():
    # 오프닝처럼 dots/prev/next로 막의 3쪽을 페이징.
    for token in ["function renderActIntroPage", "function actIntroNext",
                  "function actIntroPrev", "var actIntroPage"]:
        assert token in EPISODE, token


def test_open_act_intro_engine_exists_in_episode():
    for token in [
        "function openActIntro",
        "function speakActIntro",
        "function finishActIntro",
        "function maybeShowActIntro",
        "var actIntroActive",
        "deviceSpeak",          # MP3 재생 실패 시 기기 TTS 폴백
    ]:
        assert token in EPISODE, token
    # 오프닝 인트로 함수를 재사용하도록 분기했는지.
    assert "if(actIntroActive)" in EPISODE


def test_act_intro_narration_prefers_neural_mp3_with_device_fallback():
    # 시나리오 내레이션은 오프닝처럼 뉴럴 MP3(audio/narr/act{막}_{쪽}.mp3) 우선,
    # 재생이 막히면 deviceSpeak로 폴백한다.
    sa = EPISODE.index("function speakActIntro")
    body = EPISODE[sa:sa + 900]
    assert "audio/narr/act" in body, "막 내레이션 MP3 경로 없음"
    assert "actIntroAct" in body and "actIntroPage+1" in body, "막/쪽 인덱스로 MP3 파일명 구성해야 함"
    assert "onerror" in body and "deviceSpeak" in body, "MP3 실패 시 기기 TTS 폴백 필요"


def test_all_24_act_narration_mp3_files_exist():
    # 1~8막 × 3쪽 = 24개 내레이션 MP3가 실제로 존재하고 비어있지 않아야 한다.
    narr = ROOT / "audio" / "narr"
    for act in range(1, 9):
        for page in range(1, 4):
            f = narr / f"act{act}_{page}.mp3"
            assert f.exists(), f"missing {f.name}"
            assert f.stat().st_size > 1000, f"{f.name} too small"


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
