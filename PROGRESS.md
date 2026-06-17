# 한글 놀이터 작업일지

> 마지막 업데이트: 2026-06-17 (가로 와이드 UI·차등 피드백·획순·문서 정리)
>
> 📌 개발 목적·방향은 [`README.md`](README.md), 구조·내용(현재 플로우 vs 잔재 화면)은 [`ARCHITECTURE.md`](ARCHITECTURE.md) 참고.

## 현재 상태

- 정적 PWA 형태의 한글 학습 앱입니다.
- 앱 핵심은 `index.html`의 HTML/JavaScript, `styles.css`의 스타일, `app-data.js`의 정적 데이터, `app-state.js`의 미션 상태 로직, `app-listen.js`의 듣고 찾기 로직, `app-router.js`의 화면 이동/메뉴 초기화, `app-adventure.js`의 지도/스토리 렌더링, `app-learning.js`의 글자/단어 학습 로직, `app-writing.js`의 쓰기/획순 로직, `app-games.js`의 게임 로직, `app-episode.js`의 에피소드 진행/별빛 앨범 렌더링으로 분리되었습니다.
- 핵심 경험이 `한글 떼기 커리큘럼(별빛 우체국 8막 여정)`으로 확장되었습니다. 스토리 진행 = 실제 한글 학습 순서이며, 만 4세·자모 백지 기준으로 한 화 = 글자 1개, 관대한 익힘 판정, 빠른 성취 맛보기로 설계되었습니다.
- 첫 실행 시 `인트로 그림책`(6장)이 나옵니다. 손그림 SVG 일러스트(종이 그레인 질감, 일관된 하니 캐릭터)에 장면별 의미 있는 CSS 애니메이션이 들어가고, 하니가 edge-tts 신경망 음성(`audio/narr/intro1~6.mp3`)으로 읽어줍니다. 글 못 읽는 4세를 위해 그림+소리 중심, 줄글 스토리는 `부모님 보기`로 접힙니다.
- service worker는 개발 중 캐시 꼬임을 막기 위해 `network-first`로 동작합니다(온라인이면 항상 최신, 오프라인이면 캐시 폴백).
- 오디오 MP3 리소스와 PWA manifest/service worker가 포함되어 있습니다.
- 현재 중심 경험은 `하니의 한글 모험`입니다.
- iPad 기준 홈 화면, 한글 마을 지도, 오늘의 모험, 한글 마을 이야기, 이야기 줄기, 스토리 바이블, 하니 반응까지 1차 고도화가 완료되었습니다.
- 전체 정적 회귀 테스트는 `python -m pytest -q tests/*_check.py`로 실행합니다. 일반 `python -m pytest -q`는 파일명 규칙 때문에 테스트를 자동 발견하지 못합니다.

## 완료한 작업

- [x] 프로젝트 위치 확인: `C:\Users\neofi\hangul-playground-pwa`
- [x] 로컬 실행 확인: `python -m http.server 5187 --bind 127.0.0.1`
- [x] 브라우저 초기 로딩 확인
- [x] 초기 콘솔 오류 없음 확인
- [x] git 저장소 초기화
- [x] README.md 생성
- [x] PROGRESS.md 생성

## 진행 중인 방향

### Story Adventure Shell

목표:

```text
한글 놀이터를 단순 기능 메뉴에서
캐릭터가 이끄는 오늘의 한글 모험으로 바꾸기
```

1차 범위:

- 병아리 마스코트에 `하니` 캐릭터 부여
- `오늘의 미션`을 `오늘의 모험`으로 변경
- 오늘의 글자/단어/놀이를 스토리 퀘스트처럼 보여주기
- 기존 기능 연결은 유지
- 미션 완료/스티커 보상을 스토리 대사로 강화

## 다음 작업

- [x] Story Adventure Shell 검증 스크립트 작성
- [x] 검증 스크립트 실패 확인
- [x] 홈 화면/미션 카피와 DOM 구조 수정
- [x] 로컬 브라우저 smoke test
- [x] 콘솔 오류 확인
- [x] 변경사항 커밋
- [x] README 최신화
- [x] 전체 정적 테스트와 JS 문법 재검증

## 다음 확장 후보

- [x] `index.html`에서 CSS를 `styles.css`로 1차 분리
- [x] `index.html`에서 한글/단어/스토리 데이터 상수 분리
- [x] localStorage helper, 오늘의 선택, 미션/출석 상태 로직을 `app-state.js`로 분리
- [x] 듣고 찾기 게임 로직을 `app-listen.js`로 분리
- [x] 화면 이동/기능 메뉴 초기화 로직을 `app-router.js`로 분리
- [x] 지도/스토리/하니 반응/이야기 복사 로직을 `app-adventure.js`로 분리
- [x] 글자/단어 학습 화면 로직을 `app-learning.js`로 분리
- [x] 쓰기/획순 로직을 `app-writing.js`로 분리
- [x] 남은 게임 로직을 `app-games.js`로 분리
- [x] 보조 화면/설정/부모 리포트 또는 에피소드형 스토리 확장 중 다음 우선순위 결정 → 에피소드형 스토리 확장(한글 떼기 커리큘럼) 선택
- [x] 하니 스토리를 여러 날 이어지는 에피소드/저장 진행도로 확장 (1막 모음·2막 자음 글자형 에피소드 + 별빛 앨범 + 빠른 성취 맛보기)
- [x] 7막 단어 마을(단어 읽기) — 단어 동산(`wordBuild`)으로 사실상 구현(드래그 조립·구조도·차등 피드백)
- [ ] **(우선) 잔재 화면 정리** — 초기 놀이터 화면(`letters/syl/word/match/quiz/trace/sent/sentWrite`)이 모험 플로우와 공존. `ARCHITECTURE.md` §3 기준으로 (a) syl→3막·sent→8막 재설계 편입, (b) word/trace/match/quiz/letters 중복 제거 또는 부모용 격리 결정.
- [ ] 비글자형 막 엔진 편입: 3막 글자 공방(자모 결합), 8막 이야기 책(문장 읽기) — 현재 데이터만 정의됨
- [ ] (옵션) 듣고 찾기 #4: 정답 단어 속 글자 반짝(예 "오리"에서 ㅗ 강조)
- [ ] iPad 실기기에서 홈 화면 설치, standalone 실행, 오디오 재생, service worker 캐시 확인

## 작업 이력

### 2026-06-17 (Telegram) — 가로 와이드 UI 통일 · 차등 피드백 · 획순 보강 · 문서 정리

소리/음성·획순·레이아웃·문서를 한 차례 정리한 세션. 커밋 `5abb7c8`~`7c18c01`.

- **소리 균일화 & 데이터 주도 생성**: ffmpeg `loudnorm I=-18`로 전체 MP3 음량 정규화(편차 7→3dB). `generate_voices.py`/`generate_explain.py`가 `app-data.js`에서 단어를 파싱해 멱등 생성. 풀어듣기는 단어당 통 MP3 1개(끊김 해결), 모든 음성 시작 시 `stopAllVoice()`(중복 제거). `LETTER_WORDS` ~117개로 확장.
- **글자 숲(letterDetail) 자체완결화**: 낱말을 누르면 단어동산으로 넘어가던 것 → 글자 숲 안에서 듣고(위) 음절 받아쓰기(아래)로. 단어동산 진입 시 긴 풀어듣기 자동재생이 카드 탭에 잘리던 문제 → 단어만 짧게 재생, 설명은 버튼으로.
- **획순 보강**: `STROKES`에 자모 24개뿐이라 완성 음절(어/항)·쌍자음(ㅃ)·겹받침(ㄳ)에 음영·획순이 안 나오던 문제 → `composedStrokes()`로 음절을 초/중/종성으로 분해해 블록 내 올바른 위치에 합성, 쌍자음·겹받침은 기본 자음 좌우 합성으로 주입. `strokesFor()`로 통일.
- **음영-획순 정렬**: 음영(폰트 글리프)과 0~100 좌표 획순이 비정사각 칸에서 어긋남 → 음영을 획순과 동일 좌표의 연한 획으로 그려 정확히 겹치게.
- **펜 색**: 분홍 획순과 아이 글씨가 둘 다 분홍이라 구분 안 됨 → 글씨 펜을 검정(#222)으로, 크레용 기본=검정.
- **대시보드 여정**: '1막' 진행 status를 `이야기 다시 보기` 바로 밑 상단으로 넓게 배치, 지난 글자(↩+라벨) 클릭 시 `goToEpisode`로 이전 단계 복귀(미래는 ❔ 유지).
- **가로 와이드 2단 통일**: 글자 숲·단어 동산·듣고 찾기를 모두 가로 2단으로. 단어 동산은 왼쪽 세로 스택(큰 그림+단어+구조도 조립판+소리) / 오른쪽 큰 카드 8~10장으로 밀도 개선.
- **단어 동산 드래그 조립**: 오른쪽 카드를 왼쪽 조립판으로 끌어다 놓기(터치 포인터 드래그, 탭도 유지). 음절 라벨을 구조도 `ㅍ + ㅗ`로, 완성 시 `ㅍ + ㅗ = 포`.
- **차등 피드백**: 글자 하나 맞춤 = 작은 "맞아요!"+pop / 단어·라운드 완성 = 큰 중앙 오버레이("정답이에요!" / "소리 동굴 문이 열렸어요!")+confetti.
- **듣고 찾기 재설계**: 왼쪽 소리 동굴 테마 패널(하니+오늘의 글자+질문+큰 듣기 버튼+소리종 5칸 진행) / 오른쪽 큰 보기 카드. **글자 찾기 단계는 정답 글자를 `?`로 가려 소리로만 찾게**(단어 단계는 글자=단서).
- **운영**: 실기기 접속 불가 원인 = 윈도우 방화벽(공용 프로필 + 5301 인바운드 규칙 없음)으로 규명. 검증 시 SW 캐시가 옛 JS를 줘서 캐시 비우고 두 번 로드하는 절차 정립.
- **문서**: `README.md`(목적·방향), `ARCHITECTURE.md`(구조 + 현재 플로우 vs 잔재 화면 구분) 정리.
- 검증: 76개 테스트 통과, 각 변경을 fresh 브라우저(아이패드 가로 1024×768)에서 스크린샷/평가로 확인.



- A. 풀어듣기를 '가르치듯' 설명으로: `explainWord`가 "이응에 오를 더하면 오, 이응에 이를 더하면 이, 오이"(받침은 "받침을 더하면 산")로 읽어줌. 연결어(에/를 더하면/받침을 더하면) edge-tts 신경망 MP3 추가 후 음절 MP3와 이어 붙임.
- B. 글자 숲: 글자 따라쓰기(기존)에 더해, 관련 단어를 누르면 단어 조립 화면으로 → 단어도 써볼 수 있음(✏️ 써보기→따라쓰기).
- C. 단어 동산: 작은 팝업 → 전체 화면(`#wordBuild`)으로. 그림 + 음절 슬롯 + 자음·모음 카드 트레이를 주고 순서대로 눌러 단어를 조립(`openWordBuild`/`wbTap`). 단어/풀어듣기/써보기/다시 도구. 완성 시 음절 점등 + completeMission('word'). 미션 단어 퀘스트·지도 경로·단어 카드·글자 숲 단어가 모두 이 화면으로 연결.
- D. 듣고 찾기 단계 상승: 처음엔 글자(ㅓ) 찾기 → 2개 맞히면 'ㅓ로 시작하는 단어'(어항·어묵…) 찾기. 화면 안내 문구 + 오답 반복학습 유지.
- 검증: 76개 테스트 통과, fresh 브라우저에서 A(가르치는 시퀀스)·B(글자숲→조립→쓰기)·C(조립 완성)·D(단계 상승) 모두 확인.

### 2026-06-17 (Telegram) — 주제 통일 퀘스트 + 학습 강화

- 게임들이 전체 풀에서 랜덤으로 콘텐츠를 뽑아 '오늘의 글자'와 무관했던 문제 해결. `themeLetterChs()`/`themeWordList()`(오늘의 글자 + 이미 익힌 글자 우선) 추가, 카드 맞추기·소리 퀴즈가 이 풀을 쓰도록 변경.
- ① 듣고 찾기 재설계: '같은 글자 반복' → '오늘의 글자가 들어간 단어 찾기'(`wordHasLetter` 분해 기반). 매 문제 다른 단어, 오답 시 정답 강조 + 글자/단어 소리로 잠깐 반복학습.
- ② 단어 동산 강화: 단어를 열면 분해를 소리로 풀어 설명(`explainWord`: 자모→음절→단어, 예 "이응·오·오·이응·이·이·오이", 기존 신경망 음절 MP3 활용). `🔊 풀어 듣기`/`✏️ 써보기`(따라쓰기 연결) 버튼 추가.
- ③④ 글자 마무리 정리(recap): 글자를 다 익히면 `오늘은 [글자] 완성!` + 그 글자 단어 + 지난 글자 복습 + 음성 정리(`showRecap`)를 띄우고 `다음 글자로`.
- service worker를 `network-first` + `cache:'no-cache'`(매 요청 재검증)로 보강 → 브라우저 휴리스틱 HTTP 캐시 때문에 옛 스크립트가 섞여 나오던 문제 근본 해결. 캐시 `hangul-playground-v35`.
- 검증: 전체 76개 테스트 통과, 브라우저(fresh)에서 게임 주제 통일·듣고찾기 반복학습·단어 분해 음성·recap 동작 확인.

### 2026-06-16 ~ 2026-06-17 (Telegram) — 그림책 모드 + 인트로 그림책

- 텍스트 위주 화면이 글 못 읽는 만 4세에게 안 맞는다는 피드백 → 핵심 경험을 `그림+소리 중심`으로 전환.
- 홈에 `그림책 페이지`(큰 글자+그림+하니 음성)와 `진행 그림길`(징검다리) 추가, 줄글 스토리는 `부모님 보기`(접힘)로 이동.
- `인트로 그림책` 신설: 첫 실행 시 6장(별빛 우체국→편지 하얘짐→글자 친구 숨음→하니 등장→글자 모아 편지 살리기→지도 출발)을 하니가 음성으로 읽어주며 넘김. 본 뒤엔 `hp_intro_seen` 저장, 홈의 `이야기 다시 보기`로 재생.
- 인트로 6장을 손그림 SVG 일러스트로 제작(레퍼런스: 텍스처드 그림책). 종이 그레인(feTurbulence), 한국 우체국(우체국 간판+제비), 일관된 하니 캐릭터. 장면별 의미 있는 CSS 애니메이션: 편지 배달(send), 글자 지워짐+느낌표 번뜩(fade/pop), 숲·동산·동굴 빼꼼(peekR/Up/L)+하니 두리번(search), 두 주먹 불끈(determined pump), 글자 친구 편지로 모여듦(gather), 역동적 출발(dash+dust+pathflow).
- 인트로 내레이션을 기기 TTS(기계음)에서 edge-tts 신경망 음성(`ko-KR-SunHiNeural`)으로 교체. `audio/narr/intro1~6.mp3` 사전 생성, MP3 없으면 기기 TTS 폴백.
- service worker를 cache-first → `network-first`로 변경(개발 중 옛 캐시가 새 파일과 섞여 깨지는 문제 해결). 캐시 `hangul-playground-v34`.
- 회귀 테스트 `tests/episode_progress_check.py`에 그림책/인트로/내레이션 검증 추가. 전체 76개 통과, 6개 페이지 애니메이션 실제 경로 작동 확인.

### 2026-06-16 18:10 (Telegram)

- 에피소드형 스토리 확장 1차 완료: 핵심 경험을 `한글 떼기 커리큘럼(별빛 우체국 8막 여정)`으로 전환.
- 사용자와 방향 확정: 스토리 클리어 = 실제 한글 떼기. 대상 만 4세·자모 백지 → 한 화 = 글자 1개, 관대한 익힘 판정, 빠른 성취형(맛보기) 선택.
- `app-data.js`에 커리큘럼 데이터 추가: `CURRICULUM`(8막), `STORY_MILESTONES`(빠른 성취 맛보기), `EPISODE_PATH`(진행 경로 50스텝), 순수 헬퍼 `isMasteredRec`/`pendingMilestone`, 조회용 `ALL_LETTER_OBJS`.
- `app-state.js`에 진행도 상태 추가: `progress`(idx/mastery/album/milestones)와 `saveProgress`, `curEpisode`, `curLetterObj`, `masteredLetters`, `markLetterProgress`, `addAlbumStar`, `advanceEpisode`, `checkMilestone`, `markMilestoneShown`.
- `pickToday`를 날짜 랜덤에서 커리큘럼 진행 포인터 기반으로 변경. `loadMission`을 날짜가 아닌 에피소드(`mission.ep!==progress.idx`)에 묶고, `completeMission`이 `markLetterProgress(part)`로 글자별 익힘을 누적하도록 함.
- 렌더링 모듈 `app-episode.js` 신설: 에피소드 배너, 별빛 앨범, 빠른 성취 맛보기 팝업, 다음 글자 진행(`goNextLetter`), `initEpisodeScreens`.
- `index.html`에 DOM 추가(`episodeBanner`, `nextLetterBtn`, `starAlbum`, `milestonePop`)와 훅 연결(`renderEpisodeBanner`/`renderStarAlbum`, 완료 시 `onEpisodeComplete()`), `app-episode.js` 로드/`initEpisodeScreens()` 호출. `styles.css`에 관련 스타일 추가.
- service worker 캐시를 `hangul-playground-v32`로 올리고 `./app-episode.js`를 precache에 추가(기존 테스트의 캐시 버전 핀도 v32로 보정).
- 회귀 테스트 `tests/episode_progress_check.py` 추가(RED→GREEN): 정적 토큰/DOM/캐시 검증 + node로 진행 경로 순서·익힘 판정·맛보기 로직 실행 검증.
- 검증: 전체 정적 테스트 74개 통과, JS 문법 체크(외부 9개 + inline) 통과. 브라우저 smoke: 배너 `1막 모음의 빛 · 제1화 ㅏ`, ㅏ 완료→별빛 앨범 별 적립→다음 글자 진행, ㅏ+ㅣ 마스터 시 `아이` 맛보기, 새로고침 후 진행도 유지 확인. 콘솔 오류는 favicon 404(무해)만.

### 2026-06-15 19:01 (Hermes / Telegram)

- 구조 분리 9단계로 짝 맞추기와 소리 퀴즈/선 잇기 게임 로직을 `app-games.js`로 분리.
- `newMatch`, `flip`, `newQuiz`, `redrawLines`, `qMove`, `qUp` 등 게임 함수는 외부 모듈에 두고, 초기 이벤트 바인딩은 `initGameScreens()`로 묶음.
- 보상 연결(`confetti`, `earnSticker`)과 음성/효과음 연결(`speak`, `sayJamo`, `sfxCorrect`, `sfxWrong`) 유지.
- service worker 캐시를 `hangul-playground-v31`로 올리고 `./app-games.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/games_extraction_check.py` 추가.

### 2026-06-15 18:54 (Hermes / Telegram)

- 구조 분리 8단계로 미니 따라쓰기, 글자 만들기, 문장 쓰기, 획순 따라쓰기 로직을 `app-writing.js`로 분리.
- `mtSelect`, `renderBuilder`, `startWriting`, `strokeSVGMarkup`, `buildTraceChips`, `loadCustomTrace` 등 쓰기/획순 관련 함수는 외부 모듈에 두고, 초기 실행은 `initWritingScreens()`로 묶음.
- `app-learning.js`의 글자 상세 화면이 호출하는 `mtSelect()` 전역 함수 연결은 유지.
- service worker 캐시를 `hangul-playground-v30`으로 올리고 `./app-writing.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/writing_extraction_check.py` 추가.

### 2026-06-15 17:15 (Hermes / Telegram)

- 구조 분리 7단계로 글자/단어 학습 화면 로직을 `app-learning.js`로 분리.
- 분리 대상: 글자 목록/탭 렌더링, 글자 상세 열기, 글자 상세 음성/뒤로가기 바인딩, 단어 카테고리/단어 카드 렌더링, 단어 상세 모달/분해 보기/음성/닫기 바인딩.
- 즉시 실행되던 글자/단어 초기화는 `initLearningScreens()`로 묶고, 메인 inline script에서 helper 정의 후 호출하도록 정리.
- 미니 따라쓰기/획순 canvas는 상태와 resize 처리 범위가 커서 다음 `app-writing.js` 후보로 유지.
- service worker 캐시를 `hangul-playground-v29`로 올리고 `./app-learning.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/learning_extraction_check.py` 추가.

### 2026-06-15 17:06 (Hermes / Telegram)

- 구조 분리 6단계로 한글 마을 지도/스토리 렌더링 레이어를 `app-adventure.js`로 분리.
- 분리 대상: 지도 생성/상태 갱신, 오늘의 모험 경로 상태, 하니 반응, 이야기 줄기/챕터/스토리 바이블 렌더링, 이야기 복사 및 clipboard fallback.
- 즉시 실행되던 `renderStoryArc()`/`buildAdventureMap()`/경로 버튼 바인딩은 `initAdventureHome()`으로 묶고, 메인 inline script에서 helper 정의 후 호출하도록 정리.
- `renderMission()`은 미션 카드 전용 DOM 갱신과 여러 모험 렌더러 호출을 묶고 있어 이번 단계에서는 `index.html`에 유지.
- service worker 캐시를 `hangul-playground-v28`로 올리고 `./app-adventure.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/adventure_extraction_check.py` 추가.

### 2026-06-15 10:33 (Hermes / Telegram)

- 구조 분리 5단계로 화면 이동/기능 메뉴 초기화 로직을 `app-router.js`로 분리.
- 분리 대상: `go(id)`, 홈 버튼 이동, 기능 메뉴 버튼 생성/이동 바인딩.
- `index.html`은 `app-data.js` → `app-state.js` → `app-listen.js` → `app-router.js` → 메인 inline script 순서로 로드.
- 라우팅 side effect는 유지: 설정 리포트 렌더링, 듣고 찾기 최초 라운드 시작, 따라쓰기/획순/문장쓰기 크기 보정, 짝맞추기/퀴즈 초기화, 스크롤 리셋.
- service worker 캐시를 `hangul-playground-v27`로 올리고 `./app-router.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/router_extraction_check.py` 추가.

### 2026-06-15 10:27 (Hermes / Telegram)

- 구조 분리 4단계로 듣고 찾기 게임 로직을 `app-listen.js`로 분리.
- 분리 대상: 듣기 모드/난이도/점수 상태, 듣기 문제 후보 생성, 새 문제 생성, 라운드 시작, 정답 판정, 소리 동굴 버튼 초기화.
- `index.html`은 `app-data.js` → `app-state.js` → `app-listen.js` → 메인 inline script 순서로 로드.
- `completeMission('play')` 연결은 유지해 듣고 찾기 완료가 오늘의 모험 `소리 동굴` 완료로 반영됨.
- service worker 캐시를 `hangul-playground-v26`으로 올리고 `./app-listen.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/listen_extraction_check.py` 추가.

### 2026-06-15 10:20 (Hermes / Telegram)

- 구조 분리 3단계로 미션 상태 로직을 `app-state.js`로 분리.
- 분리 대상: `lsGet`/`lsSet`, JSON 저장 helper, 오늘 날짜/어제 날짜 계산, 오늘의 글자/단어 선택, 학습 통계 저장, 미션 로드/저장/완료, 출석 streak 업데이트.
- DOM 렌더링 함수(`renderMission`, 지도/스토리/하니 반응 갱신)는 아직 `index.html`에 유지해 리스크를 낮춤.
- `index.html`은 `app-data.js` → `app-state.js` → 메인 inline script 순서로 로드.
- service worker 캐시를 `hangul-playground-v25`로 올리고 `./app-state.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/state_extraction_check.py` 추가 및 캐시 버전 관련 기존 테스트 보정.

### 2026-06-15 10:05 (Hermes / Telegram)

- 구조 분리 2단계로 정적 데이터 상수를 `app-data.js`로 분리.
- 분리 대상: 자음/모음/단어/문장/따라쓰기/지도/스토리 줄기/스토리 챕터/하니 반응/보상/설정 옵션 데이터.
- `index.html`은 `app-data.js`를 메인 inline script보다 먼저 로드하도록 변경.
- service worker 캐시를 `hangul-playground-v24`로 올리고 `./app-data.js`를 precache 목록에 추가.
- 회귀 테스트 `tests/data_extraction_check.py` 추가 및 기존 테스트를 새 데이터 파일 기준으로 보정.
- 검증: `python -m pytest -q tests/*_check.py` 35개 통과, `node --check app-data.js` 및 inline script 문법 체크 통과.

### 2026-06-15 09:50 (Hermes / Telegram)

- 구조 분리 1단계로 CSS를 `index.html`의 inline `<style>`에서 `styles.css`로 분리.
- `index.html`에는 `styles.css` 외부 stylesheet link만 남김.
- service worker 캐시를 `hangul-playground-v23`으로 올리고 `./styles.css`를 precache 목록에 추가.
- 회귀 테스트 `tests/css_extraction_check.py` 추가: 외부 stylesheet, CSS 핵심 스타일, service worker 캐시 포함 여부 검증.

### 2026-06-15 09:30 (Hermes / Telegram)

- Hanguel 1차 고도화 마무리 정리 완료.
- README를 현재 앱 상태(`하니의 한글 모험`, iPad/PWA 기준, 스토리 경험, 검증 명령)로 최신화.
- PROGRESS 상단 현재 상태와 다음 확장 후보를 갱신.
- 검증: `python -m pytest -q tests/*_check.py` 29개 통과, JS 문법 체크 통과.
- 브라우저 smoke: 로컬 서버 `127.0.0.1:5187`에서 홈, 단어 동산 모달, 소리 동굴 진입 확인. 콘솔 오류 0건.

### 2026-06-14 20:20 (Hermes / Telegram)

- 하니 반응 풍성화 1차 완료.
- `하니의 반응` 라이브 패널을 추가해 모험 완료 직후 하니의 축하 대사/보물 반응/짧은 로그가 보이도록 구현.
- `HANI_REACTIONS` 데이터 추가: 글자 숲, 단어 동산, 소리 동굴, 전체 완료마다 다른 배지/대사/기록 제공.
- `completeMission(part)`가 `mission.lastReaction`을 저장하고 `showHaniReaction(part)`를 호출해 방금 완료한 모험 반응을 즉시 갱신하도록 변경.
- 완료 상태에서는 반응 카드가 `reaction-lit`, 전체 완료 시 `reaction-complete`로 강조됨.
- 검증: hani reactions 테스트 RED-GREEN 완료, 전체 정적 테스트 29개 통과, JS 문법 체크 통과, 브라우저 iPad smoke 및 console error 0건 확인.

### 2026-06-14 20:13 (Hermes / Telegram)

- 스토리라인 탄탄화 1차 완료.
- `오늘의 이야기 줄기` 패널을 추가해 이야기의 뼈대를 `시작 → 사건 → 위기 → 선택 → 해결 → 약속 → 다음 모험` 순서로 정리.
- `STORY_ARC` 데이터를 추가해 핵심 동기/갈등/선택/해결/연속성을 코드에서 재사용 가능하게 구성.
- 스토리 복사 텍스트에도 `이야기 줄기` 전체가 포함되도록 확장.
- 검증: storyline arc 테스트 RED-GREEN 완료, 전체 정적 테스트 26개 통과, JS 문법 체크 통과, 브라우저 iPad smoke 및 console error 0건 확인.

### 2026-06-14 20:07 (Hermes / Telegram)

- 게임스토리 풍성화 2차 완료.
- `한글 마을 이야기`에 스토리 바이블 성격의 4개 축 추가: `하니의 마음`, `마을의 비밀`, `다음 예고`, `오늘의 보물`.
- 각 챕터 데이터에 감정(`emotion`), 세계관 비밀(`secret`), 다음 장 예고(`next`), 유물/보물(`relic`), 아이와 하니의 유대(`bond`)를 추가.
- 현재 진행 단계에 따라 하니의 마음/마을의 비밀/다음 예고/오늘의 보물이 동적으로 바뀌도록 `updateStoryBible` 구현.
- 이야기 복사 텍스트에도 하니의 마음, 마을의 비밀, 다음 예고, 오늘의 보물이 포함되도록 확장.
- 검증: story bible 테스트 RED-GREEN 완료, 전체 정적 테스트 23개 통과, JS 문법 체크 통과, 브라우저 iPad smoke 및 console error 0건 확인.

### 2026-06-14 20:00 (Hermes / Telegram)

- 게임스토리 풍부화 1차 완료.
- `한글 마을 이야기`에 프롤로그를 추가: 별빛 우체국, 하얗게 변한 편지, 숨은 이름표와 빛 조각, 마을의 주문이라는 세계관 축을 부여.
- 각 장에 장소/장면/단서/보상을 추가: `글자 숲-반짝 이름표`, `단어 동산-단어 꽃씨`, `소리 동굴-소리 종`.
- 현재 진행 단계에 따라 장면/단서/보상 문구와 챕터 카드 상태가 갱신되도록 구현.
- 이야기 복사 텍스트에도 프롤로그, 장면, 단서, 보상 정보를 포함하도록 확장.
- 검증: rich story 테스트 RED-GREEN 완료, 전체 정적 테스트 20개 통과, JS 문법 체크 통과, 브라우저 iPad smoke 및 console error 0건 확인.

### 2026-06-14 19:55 (Hermes / Telegram)

- 한글 마을 이야기 영역에 `이야기 복사` 버튼 추가.
- 복사 대상 텍스트는 현재 스토리 문구, `빛 조각 n / 3`, 오늘의 모험 3개 챕터 진행 상태를 포함.
- `navigator.clipboard.writeText` 우선 사용, 미지원 환경에서는 숨김 textarea + `document.execCommand('copy')` fallback 사용.
- 복사 성공 시 `복사됐어요` 상태 문구를 표시하고, 실패 시 직접 복사 안내를 표시.
- 검증: story copy 테스트 RED-GREEN 완료, 전체 정적 테스트 17개 통과, JS 문법 체크 통과, 브라우저에서 복사 함수 smoke 및 console error 0건 확인.

### 2026-06-14 19:48 (Hermes / Telegram)

- iPad PWA 사용성 1차 보강 완료.
- iOS/iPadOS 홈 화면 실행을 고려해 `viewport-fit=cover`, `black-translucent` status bar, safe-area inset 여백, standalone 모드 CSS를 추가.
- manifest를 iPad 중심으로 갱신: `start_url=./index.html?source=pwa`, `orientation=landscape-primary`, education/kids/games categories 추가.
- service worker 캐시를 `hangul-playground-v22`로 갱신하고 PWA 시작 URL도 앱 셸 캐시에 포함.
- 게임스토리 확장 1차 완료: `한글 마을 이야기`, `빛 조각 0 / 3`, 3개 챕터(`글자 숲의 첫 불빛`, `단어 동산의 꽃`, `소리 동굴의 문`) 추가.
- 오늘의 모험 진행도에 따라 챕터가 `chapter-current`/`chapter-done`으로 바뀌고, 스토리 문구와 빛 조각 수가 갱신되도록 구현.
- 검증: iPad PWA/story 테스트 RED-GREEN 완료, 전체 정적 테스트 14개 통과, JS 문법 체크 통과, 브라우저 smoke 및 console error 0건 확인.

### 2026-06-14 19:34 (Hermes / Telegram)

- 사용 기준을 `iPad 기준 · 어디서든 이어서 보기`로 전환.
- 홈 화면을 iPad 폭에서 2열 workbench로 배치: 왼쪽 `오늘의 모험`, 오른쪽 `한글 마을 지도`.
- `오늘의 모험 길` 경로를 추가해 `글자 숲 → 단어 동산 → 소리 동굴` 순서를 지도 상단에서 바로 확인 가능하게 함.
- 오늘의 모험 진행도에 따라 경로 단계가 `route-current`/`route-lit` 상태로 바뀌도록 구현.
- 검증: iPad layout 테스트 RED-GREEN 완료, 전체 정적 테스트 10개 통과, JS 문법 체크 통과, 브라우저 smoke 및 console error 0건 확인.

### 2026-06-14 19:25 (Hermes / Telegram)

- Adventure Map 1차 적용 완료.
- 홈의 단순 기능 메뉴를 `한글 마을 지도` 카드로 재구성.
- 주요 기능을 `글자 숲`, `글자 공방`, `단어 동산`, `쓰기 연못`, `카드 광장`, `소리 동굴`, `듣기 전망대`, `스티커 집` 장소로 표현.
- 오늘의 모험 진행도에 따라 지도 노드가 `map-current`/`map-lit` 상태로 바뀌고, `한글 마을 불빛 0 / 3`이 갱신되도록 구현.
- 기존 전체 기능 메뉴는 `더 많은 놀이터 보기` 접힘 영역에 보존.
- 검증: Adventure Map 테스트 RED-GREEN 완료, 전체 정적 테스트 7개 통과, JS 문법 체크 통과, 브라우저 smoke 및 console error 0건 확인.

### 2026-06-14 19:08 (Hermes / Telegram)

- 필수 안전장치 완료: git 저장소 초기화, README.md/PROGRESS.md 생성, 기준선 커밋 생성.
- Story Adventure Shell 1차 적용 완료.
- 홈 화면을 `하니의 한글 모험`으로 전환하고, `오늘의 미션`을 `오늘의 모험`으로 재구성.
- 기존 미션 3개를 `글자 숲`, `단어 동산`, `소리 동굴` 스토리 퀘스트로 표현.
- 하니 캐릭터 대사 영역(`storyHero`)과 진행 상태별 안내 문구 추가.
- 미션 완료/스티커 보상 문구를 스토리 보상 톤으로 변경.
- PWA title/manifest 이름을 `하니의 한글 모험`으로 갱신.
- 검증: Story Adventure Shell 테스트 RED-GREEN 완료, JS 문법 체크 통과, 브라우저 smoke 및 console error 0건 확인.

### 2026-06-14 (Hermes / Telegram)

- 사용자가 기능 모음형 구조의 흥미 저하를 지적했습니다.
- 캐릭터와 스토리 기반 진행 구조를 도입하는 방향에 동의했습니다.
- 작업 순서는 `필수 안전장치 → Story Adventure Shell`로 결정했습니다.
- 필수 안전장치로 git 저장소 초기화와 README/PROGRESS 생성 작업을 시작했습니다.
