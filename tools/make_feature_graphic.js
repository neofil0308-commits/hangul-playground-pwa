// Play 스토어 feature graphic(1024×500)을 store/feature-graphic.html에서 렌더한다.
//
// 왜 필요한가: Play 등록정보의 필수 이미지인데 저장소에 없었다. 이미지 편집기로 따로 그리면
// 앱과 폰트·색·캐릭터가 미묘하게 어긋나므로, 앱과 같은 자산을 쓰는 HTML을 Chrome으로 찍는다.
//
// 사용 (저장소 루트에서):
//   python -m http.server 5399 --bind 127.0.0.1 &
//   node tools/make_feature_graphic.js        # store/play-feature-1024x500.png 생성
//
// macOS 주의 — tools/screenshot.js와 같은 함정이다:
//   샌드박스 안에서 돌리면 Chrome 자식 프로세스가 'Mach rendezvous failed'로 죽는다.
//   반드시 샌드박스 밖에서 실행할 것.
//
// Play 규격: 1024×500, PNG 또는 JPEG, **알파 채널 불가**.
// puppeteer의 기본 스크린샷은 불투명 배경을 그대로 담아 colorType=2로 나온다(확인함).

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5399';
const OUT = path.join(__dirname, '..', 'store', 'play-feature-1024x500.png');
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ARGS = [
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-component-update', '--disable-background-networking',
  '--disable-sync', '--disable-default-apps', '--no-service-autorun',
  '--metrics-recording-only', '--disable-breakpad', '--disable-gpu',
  '--hide-scrollbars', '--force-color-profile=srgb',
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', args: ARGS,
  });
  try {
    const page = await browser.newPage();
    // deviceScaleFactor 1 — 결과가 정확히 1024×500이어야 한다(Play가 크기를 강제한다).
    await page.setViewport({ width: 1200, height: 700, deviceScaleFactor: 1 });

    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto(`${BASE}/store/feature-graphic.html`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');   // 웹폰트가 다 실릴 때까지

    // 하니 캐릭터가 app-data.js에서 제대로 왔는지 — 조용히 빈 채로 찍히는 걸 막는다.
    const hani = await page.evaluate(() => document.documentElement.dataset.hani);
    if (hani !== 'ok') throw new Error(`하니 SVG 주입 실패 (dataset.hani=${hani})`);

    const el = await page.$('#fg');
    const box = await el.boundingBox();
    if (Math.round(box.width) !== 1024 || Math.round(box.height) !== 500) {
      throw new Error(`크기가 1024×500이 아니다: ${box.width}×${box.height}`);
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    await el.screenshot({ path: OUT, omitBackground: false });

    if (errors.length) {
      console.log('⚠️  콘솔 오류:\n  ' + errors.join('\n  '));
    }
    console.log(`✅ ${path.relative(process.cwd(), OUT)} 생성`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
