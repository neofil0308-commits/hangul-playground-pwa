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

### 2-1. ✅ TWA 빌드 — **완료 (2026-07-23)**

산출물(`twa/`, **git 추적 안 됨**):

| 파일 | 용도 |
|---|---|
| `twa/app-release-bundle.aab` (1.3MB) | **Play Console 업로드용** |
| `twa/app-release-signed.apk` (1.2MB) | 실기기 사이드로드 테스트용 |
| `twa/android.keystore` | 업로드 서명 키 — **분실 주의, 백업 필수** |
| `twa/keystore-password.txt` | 키스토어 비밀번호 (chmod 600) |
| `twa/twa-manifest.json` | 빌드 설정 — 재빌드 시 이 파일 기준 |

빌드 결과 확인: `packageId=io.github.neofil0308.hangul` · `versionCode=1` · `versionName=1.0.0` ·
`targetSdk=35` · `minSdk=21` · 앱 이름 「하니의 한글 모험」.

업로드 키 SHA-256 (참고용 — **assetlinks에는 이 값을 쓰지 않는다**, 2-2 참고):
```
1B:8C:90:9A:F5:E5:44:2F:5C:4E:03:A1:73:AF:8C:35:BC:F8:31:4B:F7:B3:3F:EB:33:CA:22:E8:0B:DD:80:7E
```

`manifest.json` 점검 — TWA 요구사항 **충족**: `display: standalone` ✅ ·
아이콘 192·512 `purpose: "any maskable"` ✅ · `orientation: landscape-primary`(태블릿 의도대로) ✅

#### 빌드 환경 재현 방법 (이 맥에서 한 것)
Bubblewrap이 자동 설치하는 JDK는 x64라 Apple Silicon에서 Rosetta로 돈다. 네이티브로 직접 깔았다.

```bash
brew install openjdk@17
brew install --cask android-commandlinetools
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
yes | sdkmanager --sdk_root="$ANDROID_HOME" --licenses
yes | sdkmanager --sdk_root="$ANDROID_HOME" platform-tools "platforms;android-36" "build-tools;36.0.0" "build-tools;34.0.0"
ln -sfn "$ANDROID_HOME/cmdline-tools/latest/bin" "$ANDROID_HOME/bin"   # ← 아래 함정 참고
cat > ~/.bubblewrap/config.json <<'EOF'
{ "jdkPath": "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk",
  "androidSdkPath": "/opt/homebrew/share/android-commandlinetools" }
EOF
bubblewrap doctor   # "Your jdkpath and androidSdkPath are valid."
```

> **함정 3개** (다 겪음):
> 1. `bubblewrap doctor/init`의 프롬프트는 TTY를 요구해 파이프·`script`로 못 넘긴다 →
>    프롬프트를 아예 피하려면 `~/.bubblewrap/config.json`을 직접 쓰고 `twa-manifest.json`도 손으로 작성한 뒤 `bubblewrap update`.
> 2. Bubblewrap은 sdkmanager를 `<sdk>/bin/`에서 찾는데 Homebrew는 `<sdk>/cmdline-tools/latest/bin/`에 둔다 →
>    **심볼릭 링크 필요**. 안 하면 "androidSdkPath isn't correct"가 계속 뜬다.
> 3. Bubblewrap은 `build-tools;34.0.0`을 **버전 고정**으로 요구한다(`BUILD_TOOLS_VERSION` 상수). 최신 버전만 깔면 실패.

재빌드:
```bash
cd twa
export BUBBLEWRAP_KEYSTORE_PASSWORD="$(cat keystore-password.txt)"
export BUBBLEWRAP_KEY_PASSWORD="$BUBBLEWRAP_KEYSTORE_PASSWORD"
bubblewrap build --skipPwaValidation
```

### 2-2. ✅ Digital Asset Links — **해결 (2026-07-24)**, 단 지문 하나 더 필요

**무엇이 문제였나** — Chrome은 assetlinks를 **오리진(scheme + host) 루트에서만** 찾고 경로는
무시한다. 이 저장소는 `/hangul-playground-pwa/` 하위 경로에 배포되므로 여기에 파일을 넣어도
Chrome이 보지 않는다.

**어떻게 풀었나** — 도메인 뿌리를 담당하는 저장소를 따로 만들었다:
👉 https://github.com/neofil0308-commits/neofil0308-commits.github.io

| 파일 | 이유 |
|---|---|
| `.well-known/assetlinks.json` | 앱 인증. 이 저장소의 존재 이유 |
| `.nojekyll` | 없으면 Jekyll이 점(.)으로 시작하는 폴더를 무시해 404가 된다 |
| `index.html` | 도메인 뿌리가 404가 되지 않도록 앱으로 가는 링크 한 장 |

검증 완료:
```bash
curl -s https://neofil0308-commits.github.io/.well-known/assetlinks.json   # 200, application/json
```
Google 검증 API도 statement를 정상 인식한다:
```
https://digitalassetlinks.googleapis.com/v1/statements:list
  ?source.web.site=https://neofil0308-commits.github.io
  &relation=delegate_permission/common.handle_all_urls
```
앱 배포 경로(`/hangul-playground-pwa/`)는 영향 없이 그대로 200이다.

#### 🔴 남은 일 — Play 앱 서명 키 지문 추가

지금은 **업로드 키** 지문만 들어 있다. AAB를 Play Console에 올리면 Google이 재서명하므로
(Play 앱 서명), **스토어에서 설치한 앱**은 아직 인증되지 않는다 → 주소창이 뜬다.

```
Play Console → 앱 무결성 → 앱 서명 → "앱 서명 키 인증서"의 SHA-256 복사
→ assetlinks.json의 sha256_cert_fingerprints 배열에 추가 (업로드 키 지문은 지우지 말 것)
```

`sha256_cert_fingerprints`는 배열이라 둘을 함께 둘 수 있다. 업로드 키 지문을 남겨 둬야
로컬 빌드 APK를 실기기에 설치해 테스트할 때도 주소창이 사라진다.

#### 지금 할 수 있는 검증 — 실기기 사이드로드
업로드 키 지문이 이미 게시되어 있으므로, **Play에 올리기 전에 TWA가 제대로 도는지 확인할 수 있다.**
```bash
adb install twa/app-release-signed.apk
```
확인할 것: ① 앱 상단에 주소창이 없는가 ② 가로 전체화면으로 뜨는가 ③ 아이콘이 하니인가

### 2-2-1. ⚠️ TWA는 첫 실행에 인터넷이 필요하다
AAB가 1.1MB인 이유는 **앱 안에 콘텐츠가 없기 때문**이다. TWA는 웹사이트를 띄우는 껍데기이고,
실제 화면·오디오(269MB)는 첫 실행 때 웹에서 받아 서비스 워커가 캐시한다.
설치 직후 오프라인 상태면 앱이 뜨지 않는다. 완전 오프라인 앱이 필요하면 TWA가 아니라
콘텐츠를 통째로 번들하는 방식(Capacitor 등)으로 가야 한다.

### 2-3. 스토어 등록 정보

| 항목 | 상태 |
|---|---|
| 앱 아이콘 512×512 (32-bit, 알파 **필수**) | ✅ `store/play-icon-512.png` |
| feature graphic 1024×500 (알파 **불가**) | ✅ `store/play-feature-1024x500.png` |
| 스크린샷 (태블릿) | ✅ `shots/` 2360×1640 8장 |
| 앱 이름 30자 / 짧은 설명 80자 / 자세한 설명 4000자 | ⬜ 미작성 |

> 아이콘과 배너의 알파 요구가 **정반대**다. 아이콘은 알파가 있어야 하고 배너는 있으면 안 된다.
> 둘 다 PNG 헤더로 확인함(colorType 6 / 2).

**아이콘은 2026-07-23에 「한」 글자에서 하니 캐릭터로 교체했다.** 앱의 `icon-192/512`·
`apple-touch-icon`도 같이 바꿨고, TWA는 빌드 시점에 라이브 URL에서 아이콘을 받아 굽기 때문에
**배포 → AAB 재빌드** 순서를 지켜야 한다(APK 안의 리소스를 꺼내 새 아이콘이 맞는지 확인함).
아이콘을 또 바꾸면 같은 순서를 반복할 것. 서비스 워커 캐시명도 함께 올려야 기존 이용자에게 반영된다.

재생성:
```bash
python -m http.server 5399 --bind 127.0.0.1 &
node tools/make_icon.js b                       # icon-512/192 + apple-touch-icon
python tools/png_add_alpha.py icon-512.png store/play-icon-512.png
node tools/make_feature_graphic.js              # store/play-feature-1024x500.png
```

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

1. ~~**[사용자]** 개발자명 확정 → 자리표시자 채우기~~ ✅ (「하니아빠」, 0건)
2. ~~**[나]** Bubblewrap TWA 빌드 + 서명 키 생성~~ ✅ (`twa/app-release-bundle.aab`)
3. ~~**[나]** 스토어 자산 — 아이콘·feature graphic·문안~~ ✅ (`store/`, `스토어_등록정보.md`)
4. ~~**[나]** assetlinks 호스팅 저장소 생성~~ ✅ (`neofil0308-commits.github.io`, Google API 검증됨)
5. **[사용자]** Play 개발자 계정 $25 결제 + 신원 확인 시작 (며칠 소요) ← **현재 여기 · 유일한 병목**
6. **[사용자]** Play Console에 AAB 업로드 → 데이터 보안·연령층·콘텐츠 등급 양식 제출(3장 답안 사용)
7. **[나]** Play Console의 **앱 서명 키 SHA-256**을 assetlinks 배열에 추가
8. **[사용자]** 비공개 테스트 요건 충족(해당 시) → 프로덕션 출시 심사 제출

> 5번이 며칠 걸리는 유일한 항목이다. 그 사이 실기기 사이드로드(2-2 끝)로 앱을 미리 확인할 수 있다.

### 백업해야 할 것 (git에 없음)
`twa/android.keystore` + `twa/keystore-password.txt`. `/twa/`는 `.gitignore`로 막혀 있어
저장소에 없다. 이 맥이 고장 나면 **같은 키로 업데이트를 올릴 수 없다**(Play 앱 서명을 쓰면
업로드 키는 재설정 신청이 가능하지만, 번거롭다). 비밀번호는 암호관리자로 옮기고
키스토어는 별도 백업해 둘 것.

---

## 5. 웹 버전은 이미 무료 배포 완료

Play 등록과 무관하게 **웹 PWA는 이미 라이브**이며 전체 콘텐츠가 무료로 열려 있다.

- https://neofil0308-commits.github.io/hangul-playground-pwa/
- master push → GitHub Actions 자동 배포

Play 심사가 길어지더라도 웹 주소로 바로 공유·설치(홈 화면에 추가)가 가능하다.

---

## 6. Apple App Store — 지금은 권하지 않음

**iOS에는 TWA에 해당하는 통로가 없다.** Android의 TWA는 구글이 공식 지원하는 방식이지만,
Apple은 그런 경로를 제공하지 않고 오히려 웹뷰 래퍼 앱을 **App Review Guideline 4.2
(Minimum Functionality)**로 리젝하는 것으로 알려져 있다.

| 항목 | 내용 |
|---|---|
| Apple Developer Program | **$99/년** (무료 앱이어도 매년 갱신 — Play의 $25 1회와 다름) |
| Xcode | 현재 이 맥엔 **CommandLineTools만** 있음 → 정식 Xcode **10GB+** 추가 설치 |
| 래핑 도구 | Capacitor 등으로 직접 감싸야 함 (자동 변환 없음) |
| 심사 리스크 | 4.2 리젝 가능성이 실재 |

**통과 가능성을 높이는 요소** — 정적 자산 269MB(오디오 86MB 포함)를 전부 앱 번들에 넣으면
네트워크 호출 0건의 완전 오프라인 앱이 되어 "웹사이트 래퍼"가 아니라는 근거가 된다.
Kids Category 요건(광고·서드파티 분석 금지, 부모 게이트, 개인정보처리방침)도 이미 전부 충족한다
— 부모 잠금(수학 게이트)이 이미 있고 광고·분석은 0건이다.

**그럼에도 지금은 하지 않기를 권한다.** 주 타겟이 아이패드인데, iPad Safari에서
**"홈 화면에 추가"** 하면 이미 전체화면 standalone으로 실행되고 오프라인도 된다
([index.html:9-14](index.html#L9-L14)에 `apple-mobile-web-app-capable`과 터치 아이콘이 이미 있음).
$99 + Xcode 10GB + 리젝 리스크를 들여 얻는 실익이 크지 않다.

Play 등록을 먼저 끝내고 반응을 본 뒤, 그때도 iOS 스토어가 필요하면 Capacitor로 진행한다.
