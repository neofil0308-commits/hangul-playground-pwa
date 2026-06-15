# 하니의 한글 모험

아이들이 자음·모음·단어·문장·소리 놀이를 통해 한글을 익히는 정적 PWA입니다. 현재 앱의 중심 경험은 **병아리 캐릭터 `하니`가 이끄는 오늘의 한글 모험**입니다.

## 현재 구조

- `index.html` — 앱의 HTML/JavaScript와 화면 구조
- `styles.css` — 앱 전체 스타일, iPad/PWA 레이아웃, 스토리 UI 스타일
- `manifest.json` — iPad/PWA 설치 설정
- `sw.js` — 오프라인 캐시용 service worker
- `audio/` — 한글 음성 MP3 리소스
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — PWA 아이콘
- `tests/*_check.py` — 정적 회귀 테스트
- `PROGRESS.md` — 작업 이력과 다음 재개 지점
- `generate_voices.py` — 음성 리소스 생성 보조 스크립트

## 로컬 실행

Git Bash 또는 터미널에서 프로젝트 폴더로 이동한 뒤 실행합니다.

```bash
python -m http.server 5187 --bind 127.0.0.1
```

브라우저에서 엽니다.

```text
http://127.0.0.1:5187/index.html
```

같은 Wi-Fi의 iPad에서 확인하려면 PC의 LAN IP를 사용합니다.

```text
http://<PC_LAN_IP>:5187/index.html
```

## 현재 기능

### 하니의 한글 모험

- 홈 화면 브랜드: `하니의 한글 모험`
- 오늘의 모험 3단계:
  - `글자 숲` — 오늘의 글자 친구를 만나요
  - `단어 동산` — 글자 친구가 좋아하는 단어를 찾아요
  - `소리 동굴` — 소리를 듣고 글자 친구를 찾아요
- 한글 마을 지도:
  - `글자 숲`, `글자 공방`, `단어 동산`, `쓰기 연못`, `카드 광장`, `소리 동굴`, `듣기 전망대`, `스티커 집`
- 진행 상태에 따라 지도/경로/챕터가 `현재`, `완료`, `다음` 상태로 바뀝니다.

### 스토리 경험

- `한글 마을 이야기` 패널
- 프롤로그: 별빛 우체국, 하얗게 변한 편지, 빛 조각, 마을 주문
- 오늘의 이야기 줄기:
  - 시작 → 사건 → 위기 → 선택 → 해결 → 약속 → 다음 모험
- 스토리 바이블:
  - 하니의 마음
  - 마을의 비밀
  - 다음 예고
  - 오늘의 보물
- 하니의 반응:
  - 모험 완료 직후 하니의 축하 대사, 보물 반응, 짧은 로그 표시
- `이야기 복사` 버튼:
  - 현재 스토리, 빛 조각, 챕터 진행, 이야기 줄기, 스토리 바이블을 텍스트로 복사

### 학습 기능

- 글자 친구들
- 글자 만들기
- 단어 공부
- 문장 쓰기
- 따라쓰기
- 짝 맞추기
- 소리 퀴즈
- 듣고 찾기
- 스티커 보상
- 설정
- PWA 설치/오프라인 캐시

## iPad/PWA 기준

이 앱은 **iPad 기준 · 어디서든 이어서 보기**를 우선합니다.

- `viewport-fit=cover`
- iOS/iPadOS safe-area 대응
- 홈 화면 standalone 모드 CSS
- `apple-mobile-web-app-title`: `하니의 한글 모험`
- manifest:
  - `start_url`: `./index.html?source=pwa`
  - `orientation`: `landscape-primary`
  - `categories`: `education`, `kids`, `games`

## 검증 방법

정적 회귀 테스트:

```bash
python -m pytest -q tests/*_check.py
```

JS 문법 체크:

```bash
python - <<'PY'
from pathlib import Path
import re, subprocess, tempfile, os
html=Path('index.html').read_text(encoding='utf-8')
scripts='\n'.join(re.findall(r'<script>([\s\S]*?)</script>', html))
fd=tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8')
fd.write(scripts); fd.close()
try:
    subprocess.run(['node','--check',fd.name], check=True)
finally:
    os.unlink(fd.name)
print(f'js syntax ok: {len(scripts)} bytes')
PY
```

브라우저 smoke test:

1. 로컬 서버 실행
2. `http://127.0.0.1:5187/index.html` 접속
3. 홈 화면, 지도, 오늘의 모험, 이야기 복사, 주요 학습 화면 이동 확인
4. 개발자 콘솔 오류 확인

## 작업 원칙

- 큰 변경 전후로 git 커밋을 남깁니다.
- 기능 추가보다 먼저 기존 앱이 깨지지 않는지 테스트와 브라우저 smoke test를 확인합니다.
- 현재는 CSS를 `styles.css`로 분리했고, JavaScript/데이터는 아직 `index.html`에 남아 있습니다.
- 다음 구조 분리는 데이터 상수 → 게임 로직 → 화면 초기화 순서로 작게 진행합니다.
- service worker/cache 변경 시 `sw.js`의 캐시 이름을 갱신하고 브라우저에서 stale cache 여부를 확인합니다.
