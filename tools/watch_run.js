// 눈으로 보는 자동 점검 — 진짜 Chrome 창을 띄워 앱을 화면마다 돌아보며 검사한다.
//
// screenshot.js(headless, PNG만)와 다르다: 이건 창을 실제로 띄우고(headless:false),
// 각 화면 위에 "지금 점검 중" 배너를 얹어 사람이 눈으로 따라볼 수 있게 천천히 순회한다.
// smoke_runtime.js(jsdom, 보이지 않음)와도 다르다: 실제 렌더링·레이아웃까지 눈에 보인다.
//
// 왜: Play 계정 승인을 기다리는 동안, TWA가 실제로 불러올 라이브 사이트가 화면마다
// 멀쩡히 뜨는지(가로 스크롤·요소 소실·화면 전환 실패) 사람이 직접 확인하려는 용도.
//
// 사용 (저장소 루트에서):
//   node tools/watch_run.js                 # 라이브 사이트를 점검(TWA가 받는 그 URL)
//   node tools/watch_run.js --local         # 로컬 http.server(127.0.0.1:5399)를 점검
//   node tools/watch_run.js --pace=2500     # 화면당 머무는 시간(ms). 기본 1600
//   node tools/watch_run.js --keep          # 끝나도 창을 닫지 않고 열어 둔다
//   node tools/watch_run.js --only=home,finale
//
// macOS 함정(screenshot.js와 동일, 2026-07-22 실측):
//   ① 샌드박스 안에서 돌리면 Chrome 자식이 'Mach rendezvous failed'로 죽는다 →
//      반드시 샌드박스 밖에서 실행(도구 호출 시 dangerouslyDisableSandbox).
//   ② 자동 업데이터가 딸려 오면 종료가 안 된다 → 아래 --disable-* 플래그로 막는다.
//
// CHROME 환경변수로 다른 브라우저 실행 파일 지정 가능.

const path = require('path');
const puppeteer = require('puppeteer-core');

const arg = (k, d) => {
  const hit = process.argv.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.slice(k.length + 3) : d;
};
const has = k => process.argv.includes(`--${k}`);

const LIVE = 'https://neofil0308-commits.github.io/hangul-playground-pwa';
const BASE = process.env.WATCH_BASE || (has('local') ? 'http://127.0.0.1:5399' : LIVE);
const PACE = parseInt(arg('pace', '1600'), 10);
const KEEP = has('keep');
const ONLY = arg('only', '');
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ARGS = [
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-component-update', '--disable-background-networking',
  '--disable-sync', '--disable-default-apps', '--no-service-autorun',
  '--metrics-recording-only', '--disable-breakpad',
  '--force-color-profile=srgb', '--window-size=1180,900',
];

// 아이패드 가로가 주 타깃. 눈으로 보기 좋게 실물 크기 비율.
const VIEWPORT = { width: 1180, height: 820, deviceScaleFactor: 1 };

// 각 장면: 어떤 화면을 어떤 상태로 만들고(setup), 무엇이 맞아야 하는지(assert).
// setup/assert는 페이지 안에서 평가되는 JS 문자열. 앱 전역 함수를 그대로 부른다.
// assert는 [라벨, 불리언, 상세]들의 배열을 반환한다.
const SCENES = [
  {
    name: 'home', label: '홈 — 오늘의 모험 지도',
    setup: `go('home')`,
    assert: `[
      ['홈 화면이 활성', document.getElementById('home').classList.contains('active')],
      ['지도 노드 5곳', document.querySelectorAll('#mapGrid .map-node').length === 5,
        document.querySelectorAll('#mapGrid .map-node').length + '곳'],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'letterDetail', label: '글자 숲 — 오늘의 낱자',
    setup: `progress.idx=0; loadMission(); renderMission(); openTodayLetter()`,
    assert: `[
      ['낱자 상세가 열림', document.getElementById('letterDetail').classList.contains('active')],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'wordBuild', label: '단어 동산 — 바다 만들기',
    setup: `openWordBuild('바다','🌊')`,
    assert: `[
      ['단어 만들기 화면 활성', document.getElementById('wordBuild').classList.contains('active')],
      ['도구 버튼 5개 존재', ['wbBack','wbHear','wbExplain','wbReset','wbWrite']
        .every(id => !!document.getElementById(id))],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'combine', label: '글자 공방 — 4막 받침 조립',
    setup: `unlockPremium();
            progress.idx=EPISODE_PATH.findIndex(e=>e.act===4&&e.type==='combine');
            loadMission(); renderMission(); openTodayLetter()`,
    assert: `[
      ['조립 화면이 열림', document.getElementById('combine').classList.contains('active')],
      ['조립 카드 풀이 채워짐', taughtJamo().length >= 10, taughtJamo().length + '장'],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'trace', label: '따라쓰기 — 단어 동산 → 써보기',
    setup: `openWordBuild('바다','🌊'); document.getElementById('wbWrite').click()`,
    assert: `[
      ['따라쓰기 화면이 열림', document.getElementById('trace').classList.contains('active')],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'listen', label: '소리 놀이 — 듣고 고르기',
    setup: `go('listen')`,
    assert: `[
      ['소리 놀이 화면 활성', document.getElementById('listen').classList.contains('active')],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'find', label: '글자 찾기 — 네 번째 모험',
    setup: `go('find')`,
    assert: `[
      ['글자 찾기 화면 활성', document.getElementById('find').classList.contains('active')],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'finale', label: '피날레 — 오프닝의 편지',
    setup: `unlockPremium(); progress.idx=EPISODE_PATH.length-1;
            loadMission(); renderMission(); openTodayLetter()`,
    assert: `[
      ['이야기 책 화면으로 열림', document.getElementById('story').classList.contains('active')],
      ['편지 단어 5칩', document.querySelectorAll('#stSentence .st-word').length === 5,
        document.querySelectorAll('#stSentence .st-word').length + '개'],
      ['졸업 화가 마지막', isLastEpisode() === true],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
  {
    name: 'settings', label: '설정 — 문서 링크',
    setup: `parentUnlocked=true; go('set')`,
    assert: `[
      ['설정 화면 활성', document.getElementById('set').classList.contains('active')],
      ['개인정보·이용약관 링크 존재',
        /privacy\\.html/.test(document.getElementById('set').innerHTML) &&
        /terms\\.html/.test(document.getElementById('set').innerHTML)],
      ['가로 스크롤 없음', document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        (document.documentElement.scrollWidth - document.documentElement.clientWidth) + 'px'],
    ]`,
  },
];

// 화면 위에 얹는 배너 — 사람이 "지금 뭘 보고 있는지" 눈으로 따라가게.
const BANNER = (label, status, lines) => `(() => {
  let b = document.getElementById('__hpwatch');
  if (!b) {
    b = document.createElement('div'); b.id = '__hpwatch';
    b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483647;' +
      'font:600 15px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;color:#fff;' +
      'padding:10px 16px;box-shadow:0 2px 12px rgba(0,0,0,.25);white-space:pre;' +
      'pointer-events:none;transition:background .2s';
    document.body.appendChild(b);
  }
  const bg = ${JSON.stringify(status)} === 'run' ? '#3a7bd5'
           : ${JSON.stringify(status)} === 'pass' ? '#2e9e5b' : '#d64545';
  b.style.background = bg;
  b.textContent = ${JSON.stringify(label)} + '\\n' + ${JSON.stringify(lines)};
})()`;

async function main() {
  const wanted = ONLY ? new Set(ONLY.split(',')) : null;
  const scenes = wanted ? SCENES.filter(s => wanted.has(s.name)) : SCENES;

  console.log(`\n🌐 대상: ${BASE}`);
  console.log(`🖥  Chrome 창을 띄웁니다 — 화면이 하나씩 바뀌는 걸 지켜보세요.\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: false, args: ARGS,
    defaultViewport: VIEWPORT, protocolTimeout: 60000,
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // 인트로 그림책·소리를 건너뛴다 — 매 화면 6쪽을 넘길 수 없다.
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('p1:hp_intro_seen', '1');
      localStorage.setItem('p1:hp_progress', JSON.stringify(
        { idx: 0, mastery: {}, album: [], milestones: [], relics: [],
          review: {}, actIntrosSeen: [1, 2, 3, 4, 5, 6, 7, 8] }));
    } catch (e) {}
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
    window.speechSynthesis = { getVoices: () => [], speak() {}, cancel() {} };
  });

  // 라이브 PWA는 서비스워커를 등록해 로드 중 프레임이 재부착될 수 있다 →
  // networkidle 대신 domcontentloaded로 받고, 앱 전역(go)이 뜰 때까지 명시적으로 기다린다.
  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction("typeof window.go === 'function'", { timeout: 40000 });
  await page.evaluate(() => document.fonts.ready);

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const results = [];

  for (const scene of scenes) {
    // 1) 홈으로 되돌려 화면 전환이 눈에 보이게 하고, 배너로 "점검 중" 표시.
    try { await page.evaluate(`go('home')`); } catch (e) {}
    await page.evaluate(BANNER(`▶ 점검 중: ${scene.label}`, 'run', '화면을 여는 중…'));
    await wait(Math.min(700, PACE / 2));

    // 2) 화면을 실제로 열고 자리 잡을 시간을 준다.
    let checks = [], setupErr = null;
    try {
      await page.evaluate(scene.setup);
      await page.evaluate(() => document.fonts.ready);
      await wait(PACE);
      checks = await page.evaluate(`(${scene.assert})`);
    } catch (e) {
      setupErr = e.message.split('\n')[0];
    }

    // 3) 판정 → 배너 색과 콘솔에 반영.
    const fails = checks.filter(c => !c[1]);
    const passed = !setupErr && fails.length === 0;
    const summary = setupErr
      ? `⚠ 오류: ${setupErr}`
      : checks.map(c => `${c[1] ? '✓' : '✗'} ${c[0]}${c[2] ? ` (${c[2]})` : ''}`).join('\n');
    await page.evaluate(BANNER(
      `${passed ? '✅ 통과' : '❌ 확인 필요'}: ${scene.label}`,
      passed ? 'pass' : 'fail', summary));

    results.push({ name: scene.name, label: scene.label, passed, checks, setupErr });
    console.log(`${passed ? '✅' : '❌'} ${scene.label}`);
    for (const c of checks) console.log(`     ${c[1] ? '✓' : '✗'} ${c[0]}${c[2] ? ` (${c[2]})` : ''}`);
    if (setupErr) console.log(`     ⚠ ${setupErr}`);

    await wait(PACE); // 결과를 눈으로 읽을 시간.
  }

  const failCount = results.filter(r => !r.passed).length;
  console.log(`\n=== 자동 점검 요약 ===`);
  console.log(`  화면 ${results.length}개 · 통과 ${results.length - failCount} · 확인 필요 ${failCount}`);
  console.log(`  대상: ${BASE}`);

  await page.evaluate(BANNER(
    failCount ? `점검 끝 — 확인 필요 ${failCount}건` : '점검 끝 — 전부 통과 🎉',
    failCount ? 'fail' : 'pass',
    KEEP ? '창을 열어 둡니다. 직접 눌러 보세요.' : '잠시 후 창이 닫힙니다.'));

  if (KEEP) {
    console.log('\n  --keep: 창을 열어 둡니다. 끝내려면 이 터미널에서 Ctrl+C.');
    await new Promise(() => {}); // 사용자가 직접 종료.
  } else {
    await wait(2500);
    await browser.close();
  }
  process.exit(failCount ? 1 : 0);
}

main().catch(e => { console.error('실패:', e.message); process.exit(1); });
