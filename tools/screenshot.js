// 화면 캡처 — 실제 Chrome으로 앱을 띄워 주요 화면을 PNG로 남긴다.
//
// 왜 필요한가: tests/*_check.py는 문자열만, tools/smoke_runtime.js(jsdom)는 DOM만 본다.
// jsdom은 CSS 레이아웃을 계산하지 않으므로 "따라쓰기 판이 화면을 넘는다", "안내 문구가
// 배경에 묻힌다" 같은 **보이는 문제**는 원리적으로 못 잡는다. 그건 진짜 브라우저가 필요하다.
//
// 사용 (저장소 루트에서):
//   python -m http.server 5399 --bind 127.0.0.1 &
//   npm install puppeteer-core          # 최초 1회. 브라우저는 시스템 Chrome을 쓴다.
//   node tools/screenshot.js            # shots/ 에 PNG 생성
//   node tools/screenshot.js --only=home,letterDetail
//
// macOS 주의 — 두 가지 함정이 있다(2026-07-22 실측):
//   ① 명령을 샌드박스 안에서 돌리면 Chrome 자식 프로세스가 'Mach rendezvous failed'로
//      죽는다. Chrome은 프로세스 간 Mach IPC가 필수라 샌드박스 밖에서 실행해야 한다.
//   ② 맨손으로 `--screenshot` 플래그만 쓰면 캡처는 되는데 구글 자동 업데이터가 딸려
//      올라와 프로세스가 안 끝난다. 아래 --disable-* 플래그들이 그걸 막는다.
//
// CHROME 환경변수로 다른 브라우저 실행 파일을 지정할 수 있다.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5399';
const OUT = path.join(__dirname, '..', 'shots');
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// 자동 업데이터·크래시 리포터·백그라운드 네트워킹을 끈다 — 켜두면 종료가 안 된다.
const ARGS = [
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-component-update', '--disable-background-networking',
  '--disable-sync', '--disable-default-apps', '--no-service-autorun',
  '--metrics-recording-only', '--disable-breakpad', '--disable-gpu',
  '--hide-scrollbars', '--force-color-profile=srgb',
];

// 뷰포트 — 주 타깃은 아이패드 가로. 나머지는 '깨지지 않는지' 확인용.
const VIEWPORTS = {
  ipadLandscape: { width: 1180, height: 820, deviceScaleFactor: 2 },
  ipadPortrait: { width: 820, height: 1180, deviceScaleFactor: 2 },
  phoneLandscape: { width: 844, height: 390, deviceScaleFactor: 2 },
};

// 각 장면: 어떤 화면을, 어떤 상태로 만들어 찍을지.
// setup은 페이지 안에서 평가되는 JS 문자열(앱의 전역 함수를 그대로 부른다).
const SCENES = [
  { name: 'home', viewport: 'ipadLandscape',
    setup: `go('home')` },
  { name: 'home-portrait', viewport: 'ipadPortrait',
    setup: `go('home')` },
  { name: 'letterDetail', viewport: 'ipadLandscape',
    setup: `progress.idx=0; loadMission(); renderMission(); openTodayLetter()` },
  { name: 'wordBuild', viewport: 'ipadLandscape',
    setup: `openWordBuild('바다','🌊')` },
  { name: 'combine-batchim', viewport: 'ipadLandscape',
    // 4막 받침 조립 — 3자모 드래그 판이 제대로 잡히는지.
    setup: `unlockPremium();
            progress.idx=EPISODE_PATH.findIndex(e=>e.act===4&&e.type==='combine');
            loadMission(); renderMission(); openTodayLetter()` },
  { name: 'listen', viewport: 'ipadLandscape',
    setup: `go('listen')` },
  { name: 'finale', viewport: 'ipadLandscape',
    // 마지막 화 — 오프닝에서 지워졌던 편지.
    setup: `unlockPremium(); progress.idx=EPISODE_PATH.length-1;
            loadMission(); renderMission(); openTodayLetter()` },
  { name: 'trace-phone-landscape', viewport: 'phoneLandscape',
    // 가로 폰에서 따라쓰기 판(고정 높이)이 화면을 넘지 않는지 — 세로 대응의 핵심 확인점.
    setup: `openWordBuild('바다','🌊');
            document.getElementById('wbWrite').click()` },
  { name: 'settings', viewport: 'ipadLandscape',
    setup: `parentUnlocked=true; go('set')` },
];

async function main() {
  const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
  const wanted = only ? new Set(only.split(',')) : null;
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'shell', args: ARGS,
    protocolTimeout: 60000,
  });

  const results = [];
  for (const scene of SCENES) {
    if (wanted && !wanted.has(scene.name)) continue;
    const page = await browser.newPage();
    try {
      await page.setViewport(VIEWPORTS[scene.viewport]);
      // 인트로 그림책과 소리를 건너뛴다 — 캡처마다 6쪽을 넘길 수 없다.
      await page.evaluateOnNewDocument(() => {
        try {
          localStorage.setItem('p1:hp_intro_seen', '1');
          // 막 시작 그림책도 본 것으로 — 안 그러면 목표 화면 대신 인트로가 잡힌다.
          localStorage.setItem('p1:hp_progress', JSON.stringify(
            {idx:0, mastery:{}, album:[], milestones:[], relics:[],
             review:{}, actIntrosSeen:[1,2,3,4,5,6,7,8]}));
        } catch (e) {}
        window.HTMLMediaElement.prototype.play = () => Promise.resolve();
        window.speechSynthesis = { getVoices: () => [], speak() {}, cancel() {} };
      });
      await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate(scene.setup);
      // 폰트·애니메이션이 자리를 잡을 시간.
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 600));

      const file = path.join(OUT, `${scene.name}.png`);
      await page.screenshot({ path: file });
      // 세로 스크롤이 생기면(가로 와이드 설계 위반) 알려 준다.
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      results.push({ name: scene.name, ok: true, overflowX: overflow });
    } catch (e) {
      results.push({ name: scene.name, ok: false, error: e.message.split('\n')[0] });
    } finally {
      await page.close();
    }
  }
  await browser.close();

  console.log('\n=== 화면 캡처 ===');
  let fail = 0;
  for (const r of results) {
    if (!r.ok) { fail++; console.log(`  ✗ ${r.name} — ${r.error}`); continue; }
    const warn = r.overflowX > 0 ? `  ⚠️ 가로 스크롤 ${r.overflowX}px` : '';
    console.log(`  ✓ ${r.name}${warn}`);
  }
  console.log(`  ${results.length - fail}/${results.length} 캡처 · shots/`);
  process.exit(fail ? 1 : 0);
}

main().catch(e => { console.error('실패:', e.message); process.exit(1); });
