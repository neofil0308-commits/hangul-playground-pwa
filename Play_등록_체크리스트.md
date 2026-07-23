# Google Play 무료 등록 체크리스트

> 「하니의 한글 모험」을 **무료 앱**으로 Google Play에 등록하기 위한 실행 순서.
> 유료(IAP) 관련 절차는 [유료배포_검토.md](유료배포_검토.md)에 남겨 두었고, 이 문서는 무료 배포만 다룬다.
> 작성 2026-07-23.

---

## 0. 무료 전환으로 **없어진** 절차

이전 로드맵(4단계)에서 요구했지만, 무료 배포에서는 **하지 않아도 되는** 것들:

| 항목 | 무료 배포에서 |
|---|---|
| 사업자등록 | **불필요** — 재화·용역 판매가 없음 |
| 통신판매업 신고 | **불필요** — 전자상거래법상 통신판매 아님 |
| 법적 문서의 사업자정보 14건 | **제거 완료** — 개발자명 1건만 남음 |
| Play Billing 연동 · 구매 복원 | **불필요** — IAP 상품 자체를 만들지 않음 |
| `UNLOCK_CODE` 평문 상수 폐기 | **위험 소멸** — 게이트가 항상 통과라 코드가 아무 권한도 열지 않음 |

앱 안의 결제 화면(`#paywallBtn` / `openUnlockModal()`)은 **되돌리기 쉽도록 코드에 남겨 두되,
어떤 경로로도 표시되지 않는 상태**다(접근 게이트 2개가 모두 `true` 반환). 유료 재전환 시 그대로 되살릴 수 있다.

---

## 1. 사용자(하니 아빠)가 먼저 해야 하는 일

### 1-1. ✅ 개발자명 확정 — **완료 (2026-07-23): 「하니아빠」**
[legal/terms.html](legal/terms.html)의 개발자명과 [legal/privacy.html](legal/privacy.html)의
개인정보 보호책임자에 기입 완료. 자리표시자 0건.

```bash
python tools/check_legal_placeholders.py   # ✅ 0건
```

> ⚠️ **Play Console 개발자 이름도 「하니아빠」로 맞출 것.** 스토어에 표시되는 개발자명과
> 개인정보처리방침의 책임자명이 다르면 심사에서 소명을 요구받을 수 있다.

### 1-2. 🔴 Google Play 개발자 계정 — $25 (1회, 평생)
- https://play.google.com/console → 개인 계정으로 가입
- **개인 개발자는 신원 확인(신분증·주소)이 필요**하고 며칠 걸릴 수 있으니 먼저 시작해 둘 것
- 개인 계정으로 등록한 앱은 **개발자 이름·주소가 스토어에 공개**된다(Google 정책). 공개가 부담되면
  주소는 우편 수령 가능한 대체 주소를 쓰는 편이 낫다.

### 1-3. 🟠 신규 개인 개발자 테스트 요건 확인
Google은 신규 **개인** 개발자 계정에 대해 "프로덕션 출시 전 비공개 테스트(테스터 다수·일정 기간)"를
요구해 왔다. 요건이 계속 바뀌므로 **계정 생성 직후 Play Console이 안내하는 조건을 그대로 확인**할 것.
해당되면 지인 테스터 모집이 실제 병목이 된다.

---

## 2. 내가 할 수 있는 일 (개발자 계정 없이도 선행 가능)

### 2-1. TWA 빌드 (Bubblewrap)
현재 PWA를 Android 앱으로 감싼다. 서버가 필요 없는 정적 PWA라 TWA가 가장 적합.

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://neofil0308-commits.github.io/hangul-playground-pwa/manifest.json
bubblewrap build
```

`manifest.json` 점검 결과 — TWA 요구사항 **충족**:
- `name` / `short_name` / `start_url` / `scope` ✅
- `display: standalone` ✅ (TWA 필수)
- 아이콘 192·512 `purpose: "any maskable"` ✅
- `orientation: landscape-primary` — 태블릿 학습앱 의도대로. Play 심사 문제 없음.

### 2-2. Digital Asset Links (`.well-known/assetlinks.json`)
TWA가 주소창 없이 뜨려면 웹사이트가 앱을 인증해야 한다. 저장소 루트에
`.well-known/assetlinks.json`을 올린다(`.nojekyll`이 있어 GitHub Pages가 dot 디렉터리를 서빙함).

> ⚠️ **가장 흔한 실패 지점**: 여기 넣는 SHA-256 지문은 로컬 업로드 키가 아니라
> **Play Console → 앱 서명 → "앱 서명 키 인증서"의 SHA-256**이어야 한다.
> Play 앱 서명을 쓰면 Google이 재서명하므로, 업로드 키 지문을 넣으면 주소창이 그대로 노출된다.
> 앱을 Play Console에 한 번 올린 뒤에야 이 값을 알 수 있으므로 **순서상 마지막**이다.

### 2-3. 스토어 등록 정보 초안
- 앱 이름(30자), 짧은 설명(80자), 자세한 설명(4000자) — 초안 작성 가능
- 스크린샷: 폰 최소 2장 + 7인치/10인치 태블릿 — `shots/` 에 기존 캡처 있음, 규격 맞춰 재촬영 필요
- 앱 아이콘 512×512 ✅ (`icon-512.png`)
- 그래픽 이미지(feature graphic) 1024×500 — **없음, 새로 만들어야 함**

---

## 3. Play Console 양식 — 미리 정해 둔 답

### 3-1. 데이터 보안(Data safety)
| 질문 | 답 |
|---|---|
| 사용자 데이터를 수집/공유합니까? | **아니요** |
| 데이터가 전송 중 암호화됩니까? | 해당 없음(외부 전송 자체가 없음) |
| 사용자가 데이터 삭제를 요청할 수 있습니까? | 해당 없음(기기 내 저장, 보호자가 직접 삭제) |

근거: 광고 SDK·분석 도구 없음, 외부 CDN 호출 없음(폰트 self-host), localStorage만 사용.
**이 답은 [legal/privacy.html](legal/privacy.html)과 정확히 일치해야 한다** — 불일치는 정책 위반 사유.

### 3-2. 대상 연령층 및 콘텐츠 (Target audience and content)
- 대상 연령: **만 5세 이하 포함** → **Google Play Families 정책** 적용 대상
- 광고 포함: **아니요**
- 아동에게 부적합한 콘텐츠: 없음
- Families 정책상 요구되는 것들 — 현재 모두 충족:
  - 개인정보처리방침 URL 게시 ✅
  - 아동 데이터 수집 없음 ✅
  - 광고·인앱결제 없음 ✅
  - 외부 웹 브라우징 기능 없음 ✅ (TWA지만 자체 콘텐츠만 로드, `scope` 내부로 제한)

> ⚠️ TWA는 내부적으로 Chrome을 쓰므로, 심사에서 "웹 브라우저 기능" 여부를 물을 수 있다.
> `scope`가 앱 자체 경로로 한정되어 외부 사이트로 이동할 수 없다는 점을 소명하면 된다.

### 3-3. 콘텐츠 등급 (IARC 설문)
폭력·성적 표현·언어·도박·사용자 간 소통 **모두 없음** → **전체이용가(3+)** 예상.

### 3-4. 개인정보처리방침 URL
```
https://neofil0308-commits.github.io/hangul-playground-pwa/legal/privacy.html
```
Families 정책상 **필수**. 이미 게시되어 있고 자리표시자만 채우면 된다.

---

## 4. 진행 순서 요약

1. ~~**[사용자]** 개발자명 확정 → 자리표시자 채우기~~ ✅ **완료** (「하니아빠」, 0건)
2. **[사용자]** Play 개발자 계정 $25 결제 + 신원 확인 시작 (며칠 소요) ← **현재 여기**
3. **[나]** Bubblewrap TWA 빌드 + 서명 키 생성 (키스토어는 **절대 저장소에 커밋 금지**, `.gitignore` 확인)
4. **[나]** 스토어 등록 문안 + 스크린샷 규격 정리 + feature graphic 제작
5. **[사용자]** Play Console에 AAB 업로드 → 데이터 보안·연령층·콘텐츠 등급 양식 제출(3장 답안 사용)
6. **[나]** Play Console의 **앱 서명 키 SHA-256**으로 `.well-known/assetlinks.json` 생성 → master push
7. **[사용자]** 비공개 테스트 요건 충족(해당 시) → 프로덕션 출시 심사 제출

---

## 5. 웹 버전은 이미 무료 배포 완료

Play 등록과 무관하게 **웹 PWA는 이미 라이브**이며 전체 콘텐츠가 무료로 열려 있다.

- https://neofil0308-commits.github.io/hangul-playground-pwa/
- master push → GitHub Actions 자동 배포

Play 심사가 길어지더라도 웹 주소로 바로 공유·설치(홈 화면에 추가)가 가능하다.
