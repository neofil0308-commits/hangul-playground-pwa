# 한글 놀이터 작업일지

> 마지막 업데이트: 2026-06-14 19:55

## 현재 상태

- 정적 PWA 형태의 한글 학습 앱입니다.
- 앱 핵심은 `index.html` 단일 파일에 집중되어 있습니다.
- 오디오 MP3 리소스와 PWA manifest/service worker가 포함되어 있습니다.
- 기능은 충분하지만, 단순 기능 모음처럼 느껴져 장기 흥미 유지가 약할 수 있습니다.

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

## 작업 이력

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
