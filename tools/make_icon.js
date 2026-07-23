// 앱 아이콘을 store/icon-candidates.html에서 렌더한다.
//
// 왜 필요한가: 아이콘에 하니 캐릭터를 살리기로 하면서, 앱이 쓰는 icon-192/512와
// 스토어 업로드용 아이콘을 같은 원본에서 뽑아야 서로 어긋나지 않는다.
// 하니 그림은 app-data.js의 aiHaniCore()를 그대로 재사용하므로 앱 화면과 동일하다.
//
// 사용 (저장소 루트에서):
//   python -m http.server 5399 --bind 127.0.0.1 &
//   node tools/make_icon.js b          # 후보 b를 192/512/180으로 렌더
//
// 각 크기를 512에서 축소하지 않고 **그 크기로 직접 렌더**한다 — 축소하면 가장자리가 뭉개진다.
//
// macOS 주의: 샌드박스 안에서 돌리면 Chrome이 'Mach rendezvous failed'로 죽는다(screenshot.js와 동일).
//
// 알파 채널: 여기서 나오는 PNG는 불투명 배경이라 colorType=2다. Play 스토어용 아이콘은
// 32-bit(알파 포함)를 요구하므로 tools/png_add_alpha.py로 한 번 더 변환해야 한다.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5399';
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ARGS = [
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-component-update', '--disable-background-networking',
  '--disable-sync', '--disable-default-apps', '--no-service-autorun',
  '--metrics-recording-only', '--disable-breakpad', '--disable-gpu',
  '--hide-scrollbars', '--force-color-profile=srgb',
];

// 어떤 크기를 어디에 쓰는지 — 파일명이 곧 용도다.
const TARGETS = [
  { size: 512, out: 'icon-512.png' },          // manifest (any maskable)
  { size: 192, out: 'icon-192.png' },          // manifest (any maskable)
  { size: 180, out: 'apple-touch-icon.png' },  // iOS 홈 화면
];

async function main() {
  const which = process.argv[2] || 'b';
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ARGS });
  try {
    const page = await browser.newPage();
    for (const { size, out } of TARGETS) {
      await page.setViewport({ width: size + 40, height: size + 40, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/store/icon-candidates.html?only=${which}&size=${size}`,
        { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');

      const hani = await page.evaluate(() => document.documentElement.dataset.hani);
      if (hani !== 'ok') throw new Error(`하니 SVG 주입 실패 (dataset.hani=${hani})`);

      const el = await page.$(`#${which}`);
      if (!el) throw new Error(`후보 #${which}를 찾을 수 없다`);
      const box = await el.boundingBox();
      if (Math.round(box.width) !== size || Math.round(box.height) !== size) {
        throw new Error(`크기 불일치: ${box.width}×${box.height} (기대 ${size})`);
      }

      const dest = path.join(ROOT, out);
      await el.screenshot({ path: dest, omitBackground: false });
      console.log(`✅ ${out} — ${size}×${size}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
