# 구조 및 내용 (ARCHITECTURE)

> 이 문서는 "구현된 앱의 구조와 내용"을 한눈에 보기 위한 지도입니다.
> 개발 목적·방향은 [`README.md`](README.md), 작업 이력은 [`PROGRESS.md`](PROGRESS.md) 참고.

## 1. 기술 스택 / 실행

- **정적(static) PWA**: 빌드 도구 없음. `index.html` + 외부 JS 모듈 + `styles.css` + `sw.js` + `audio/`.
- 서버: `python -m http.server 5301`(LAN 노출 시 `--bind 0.0.0.0`). 같은 WiFi 아이패드에서 `http://<PC_LAN_IP>:5301/index.html`.
- 음성: **edge-tts 신경망 음성**(ko-KR-SunHiNeural=여성, InJoon=남성 등) 사전 생성 MP3. 없으면 기기 TTS 폴백.
- 대상 레이아웃: **아이패드 가로 / 모니터(가로 와이드)** 우선.

## 2. 파일 지도

| 파일 | 줄수 | 역할 |
|------|------|------|
| `index.html` | (대) | 모든 화면(`section.screen`) DOM + 메인 inline 부트스트랩 |
| `app-data.js` | ~231 | **정적 데이터**: 자모/단어/획순/커리큘럼/인트로/스토리/보상 상수 + 순수 헬퍼 |
| `app-state.js` | ~62 | localStorage, 오늘의 글자 선택(`pickToday`), 미션/진행도(`progress`), 마스터 판정, 테마 풀 |
| `app-router.js` | ~8 | 화면 이동 `go(id)`, 홈 버튼, 메뉴 초기화 |
| `app-episode.js` | ~420 | 에피소드 배너, **여정(별빛 앨범) 렌더 + 이전 단계 이동**, 인트로 그림책, recap, 맛보기 |
| `app-adventure.js` | ~169 | 한글 마을 지도, 스토리 줄기/바이블/하니 반응, 이야기 복사 |
| `app-learning.js` | ~402 | **글자 숲(letterDetail)**, **단어 동산(wordBuild)**: 단어 조립·드래그·풀어듣기·구조도 |
| `app-writing.js` | ~123 | 따라쓰기/획순 canvas, `strokesFor`/`strokeSVGMarkup`/`glyphInkBox`, 미니 받아쓰기 |
| `app-listen.js` | ~124 | **소리 동굴(듣고 찾기)**: 단계형 문제, 진행 종, 차등 피드백 |
| `styles.css` | (대) | 전체 스타일, 가로 와이드 2단 레이아웃, 인트로 장면, 차등 효과 |
| `sw.js` | ~16 | service worker, **network-first + cache:'no-cache'**, 캐시명 `hangul-playground-v83` |
| `manifest.json` | — | PWA 설치(`landscape-primary`, education/kids) |
| `generate_voices.py` | — | 단어/자모 음성 MP3 생성(app-data.js에서 단어 목록 파싱, 멱등) |
| `generate_explain.py` | — | "이응에 ㅗ를 더하면 오" 풀어듣기 MP3 생성(통 MP3, 멱등) |
| `audio/` | ~4600 MP3 | `audio/<voice>/<key>.mp3`, `audio/explain/{f,kid,m}/`, `audio/narr/intro1~6.mp3` |
| `tests/*_check.py` | 76 | 정적 토큰/DOM/캐시 + node 실행 회귀 테스트 |

로드 순서: `app-data → app-state → app-listen → app-router → app-adventure → app-learning → app-writing → app-games → app-episode → (메인 inline)`.

## 3. 화면 인벤토리

> **2026-07-21 정리 완료.** 초기 '한글 놀이터' 잔재 화면은 전부 제거됐고, 지금은 모험 플로우 화면만 남는다.

### ✅ 현재 모험 플로우 (전부)
| 화면 id | 이름 | 내용 |
|---------|------|------|
| `intro` | 인트로 그림책 | 6장 SVG + 하니 내레이션(최초 1회) |
| `home` | 홈/지도 | 상단 여정 status(이전 단계 이동) + 오늘의 3모험 + 별자리 지도 |
| `letterDetail` | **글자 숲** | 가로 2단: 왼쪽 글자+소리+낱말 / 오른쪽 받아쓰기(획순) |
| `wordBuild` | **단어 동산** | 그림+단어+구조도 조립판(드래그) + 도구 버튼(듣기·설명·다시·써보기) |
| `trace` | **따라쓰기** | 단어 동산 '✏️ 써보기'로 진입. 획순 가이드 위에 손으로 쓴다 |
| `listen` | **소리 동굴** | 소리 동굴 패널 + 큰 보기 카드 + 진행 종 + 차등 효과 |
| `combine` | **글자 공방(3막)** | 자음+모음 드래그 합치기(`openCombine`) + 결합원리 음성 |
| `story` | **이야기 책(8막·졸업)** | 문장 읽기(`openStory`): 단어칩 소리·하이라이트 → 졸업 |
| `review` | 복습 ⭐ | 간격반복(SRS)으로 지난 글자 재확인 |
| `find` | 글자 찾기 | 여러 글자 속에서 오늘 글자 찾기 |
| `sticker` | 스티커 | 보상 도장 |
| `set` | 설정 | 부모 대시보드·리포트·하루 목표·이용권·소리·약관/정책 (부모 게이트 뒤) |
| (오버레이) | recap/milestone/big-correct | 마무리 정리·맛보기·완성 축하 |

### 🗑️ 제거된 잔재 화면 (2026-07-21)
`letters`(글자 목록) · `syl`(글자 만들기) · `word`(단어 공부) · `sent`(문장 고르기) · `sentWrite`(문장 쓰기)

- 제거 근거: **다섯 화면 모두 어디서도 진입할 수 없는 죽은 화면이었다.** 홈 메뉴(`MENU`)에는
  듣고 찾기·스티커·설정 3개뿐이고, 지도 노드는 `action`으로 모험 플로우(`openTodayLetter`/
  `openWordBuild`)에 직결되며, `sent`↔`sentWrite`는 서로만 오가는 고립된 섬이었다.
- 기능은 이미 대체돼 있었다: `syl`→`combine`(3막), `sent`/`sentWrite`→`story`(8막),
  `word`→`wordBuild`(단어 동산), `letters`→오늘의 글자 직행.
- `match`·`quiz` 화면과 `app-games.js`는 그 이전에 이미 삭제된 상태였다(문서만 뒤늦게 반영).
- ⚠️ **`trace`는 잔재가 아니다.** 단어 동산 '써보기'에서 진입하는 살아있는 화면이라 유지했다.
- 회귀 방지: `tests/legacy_screens_removed_check.py`(마크업·이동 경로·공유 데이터·CSS)와
  `tools/smoke_runtime.js`(실제 화면 전환 런타임 스모크).

## 4. 핵심 데이터 모델 (`app-data.js`)

- `CONS` / `VOWS` / `ALL_LETTERS` / `ALL_LETTER_OBJS` — 자모 객체(ch, 이름, 소리).
- `CHO` / `JUNG` / `JONG` — 한글 음절 분해/조합용 자모 배열.
- `STROKES` — 자모 24개 획순 좌표(0~100). 완성 음절·쌍자음·겹받침은 `composedStrokes()`/주입으로 합성 → `strokesFor(ch)`.
- `LETTER_WORDS` — 글자별 예시 낱말(이모지 포함, ~117개). `WORDS` — 카테고리별 단어 풀.
- `CURRICULUM`(8막) / `EPISODE_PATH`(글자형 막은 글자 1개=1화, ~50화) / `STORY_MILESTONES`(빠른 성취 맛보기).
- `INTRO_PAGES`(6장 SVG+내레이션), `STORY_ARC` / `STORY_CHAPTERS` / `HANI_REACTIONS`(스토리 패널), `CRAYONS`(첫=검정), `VOICES`(f/kid/m).

## 5. 핵심 흐름

- **진행 포인터**: `progress.idx`(localStorage `hp_progress`)가 `EPISODE_PATH`의 현재 화. `curEpisode()`/`pickToday()`가 여기서 오늘의 글자를 뽑음(날짜 랜덤 아님). `advanceEpisode()`/`goToEpisode(i)`(이전 단계 이동).
- **익힘 판정**(관대): `markLetterProgress(part)` 누적 → met+matched+quizzed면 마스터, 별빛 앨범 별 점등. `completeMission('letter'|'word'|'play')`.
- **테마 풀**: `themeLetterChs()`/`themeWordList()` = 오늘의 글자 + 이미 익힌 글자. 모든 게임이 이 풀만 사용(주제 일관성).

## 6. 음성 파이프라인

- 경로 규칙: `audio/<voice>/<key>.mp3`, `key` = 텍스트 각 코드포인트 16진수를 `-`로 연결.
- `generate_voices.py`/`generate_explain.py`가 `app-data.js`에서 단어를 정규식으로 읽어 **데이터 주도·멱등**(있으면 건너뜀) 생성. 풀어듣기는 끊김 방지를 위해 **단어당 통 MP3 1개**.
- 음량 균일화: ffmpeg `loudnorm I=-18`로 전체 정규화(자음·모음·단어·풀어듣기 음량 편차 제거).
- 중복 재생 방지: 모든 음성 시작 시 `stopAllVoice()`로 이전 음성 정지.

## 7. 서비스워커 / 캐시 (개발 시 주의)

- `sw.js`는 **network-first** + `fetch(req,{cache:'no-cache'})` → 온라인이면 항상 최신, 오프라인 폴백. 캐시명 변경 시 `*_check.py`의 버전 핀도 함께 수정.
- 그래도 브라우저/SW에 옛 파일이 남으면: SW unregister + `caches` 삭제 후 **두 번** 재로드. (검증 시 새 함수 존재를 먼저 확인)
- 실기기 접속 불가 시: 윈도우 방화벽(공용 프로필 + 5301 인바운드 규칙 없음) 의심 → 관리자 PowerShell로 인바운드 허용.

## 8. 테스트

```bash
python -m pytest -q tests/ -o python_files="*_check.py"   # 76개
```

- 정적 **토큰/DOM/캐시** 검증 + 일부 node 실행 검증. 함수 토큰을 문자열로 핀하므로, 리팩터 시 요구 토큰(예: `function openWord`, `mtRenderStrokes()`)을 유지해야 함.
