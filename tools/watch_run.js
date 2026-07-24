// 눈으로 보는 자동 점검 — 진짜 Chrome 창을 띄워 앱을 화면마다 돌아보며,
// 실제로 정답을 눌러 풀어 보이고, 사람이 중간에 멈춰 지적사항을 남길 수 있게 한다.
//
// screenshot.js(headless PNG)·smoke_runtime.js(jsdom, 안 보임)와 다르다: 창을 실제로 띄우고,
// 각 화면 위에 배너를 얹어 천천히 순회하며, 조립·소리·찾기 화면은 정답 카드를 눌러 완성까지 보여준다.
//
// 사용 (저장소 루트에서):
//   node tools/watch_run.js                 # 라이브 사이트 점검(TWA가 받는 그 URL). 화면마다 멈춤(제어 버튼)
//   node tools/watch_run.js --auto          # 멈추지 않고 끝까지 자동 순회
//   node tools/watch_run.js --local         # 로컬 http.server(127.0.0.1:5399)
//   node tools/watch_run.js --pace=2500     # 화면 전환/탭 간격(ms). 기본 1600
//   node tools/watch_run.js --only=combine,listen,find
//
// 멈춤 모드(기본): 각 화면에서 자동으로 정답까지 눌러 보인 뒤 멈춘다. 브라우저 하단 막대에서
//   [다음 ▶]  진행    ·    [✎ 문제 지적] 입력창에 적고 누르면 기록    ·    [⏹ 끝내기]
// 남긴 지적사항은 순회가 끝나면 터미널과 파일(scratchpad/점검_지적사항.md)에 모아 준다.
//
// macOS 함정(screenshot.js와 동일): ① 샌드박스 안에선 Chrome이 'Mach rendezvous failed'로
// 죽는다 → 샌드박스 밖에서 실행. ② 자동 업데이터가 딸려오면 종료가 안 된다 → --disable-* 로 막음.
// 라이브 PWA는 서비스워커 재부착 때문에 networkidle이 'frame detached'로 깨진다 →
// domcontentloaded + waitForFunction(go)로 받는다.

const fs = require('fs');
const puppeteer = require('puppeteer-core');

const arg = (k, d) => {
  const hit = process.argv.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.slice(k.length + 3) : d;
};
const has = k => process.argv.includes(`--${k}`);

const LIVE = 'https://neofil0308-commits.github.io/hangul-playground-pwa';
const BASE = process.env.WATCH_BASE || (has('local') ? 'http://127.0.0.1:5399' : LIVE);
const PACE = parseInt(arg('pace', '1600'), 10);
const STEP = Math.max(450, Math.min(1000, Math.round(PACE / 2))); // 카드 한 장 놓는 간격
const AUTO = has('auto');           // 멈추지 않고 끝까지
const ONLY = arg('only', '');
const NOTES_FILE = (process.env.WATCH_NOTES ||
  (process.env.SCRATCHPAD ? `${process.env.SCRATCHPAD}/점검_지적사항.md` : '점검_지적사항.md'));
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const ARGS = [
  '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-component-update', '--disable-background-networking',
  '--disable-sync', '--disable-default-apps', '--no-service-autorun',
  '--metrics-recording-only', '--disable-breakpad',
  '--force-color-profile=srgb', '--window-size=1180,940',
];
const VIEWPORT = { width: 1180, height: 860, deviceScaleFactor: 1 };

// 각 장면: 화면을 여는 setup, (있으면) 정답을 눌러 푸는 solve, 무엇이 맞아야 하는지 assert.
// solve는 window.__hp.* 드라이버를 부른다(아래에서 페이지에 주입). 전부 페이지 안 JS 문자열.
const SCENES = [
  {
    name: 'home', label: '홈 — 오늘의 모험 지도',
    setup: `go('home')`,
    assert: `[
      ['홈 화면이 활성', document.getElementById('home').classList.contains('active')],
      ['지도 노드 5곳', document.querySelectorAll('#mapGrid .map-node').length === 5,
        document.querySelectorAll('#mapGrid .map-node').length + '곳'],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'letterDetail', label: '글자 숲 — 오늘의 낱자',
    setup: `progress.idx=0; loadMission(); renderMission(); openTodayLetter()`,
    assert: `[
      ['낱자 상세가 열림', document.getElementById('letterDetail').classList.contains('active')],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'wordBuild', label: '단어 동산 — 바다를 눌러서 완성',
    setup: `openWordBuild('바다','🌊')`,
    solve: `window.__hp.solveWord(${STEP})`,
    assert: `[
      ['단어 만들기 화면 활성', document.getElementById('wordBuild').classList.contains('active')],
      ['모든 자모를 채움', wbPos >= wbExpected.length, wbPos+'/'+wbExpected.length],
      ['완성 안내가 뜸', /정답이에요/.test(document.getElementById('wbFeedback').textContent)],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'combine', label: '글자 공방 — 4막 받침을 눌러서 조립',
    setup: `unlockPremium();
            progress.idx=EPISODE_PATH.findIndex(e=>e.act===4&&e.type==='combine');
            loadMission(); renderMission(); openTodayLetter()`,
    solve: `window.__hp.solveCombine(${STEP})`,
    assert: `[
      ['조립 화면이 활성', document.getElementById('combine').classList.contains('active')],
      ['모든 자모를 채움', cbPos >= cbExpected.length, cbPos+'/'+cbExpected.length],
      ['완성 안내가 뜸', /완성/.test(document.getElementById('cbFeedback').textContent)],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'trace', label: '따라쓰기 — 단어 동산 → 써보기',
    setup: `openWordBuild('바다','🌊'); document.getElementById('wbWrite').click()`,
    assert: `[
      ['따라쓰기 화면이 열림', document.getElementById('trace').classList.contains('active')],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'listen', label: '소리 놀이 — 정답 소리를 눌러 맞히기',
    setup: `go('listen'); startListenRound()`,
    solve: `window.__hp.solveListen(${STEP})`,
    assert: `[
      ['소리 놀이 화면 활성', document.getElementById('listen').classList.contains('active')],
      ['정답을 골라 점수가 올랐다', listenScore >= 1, listenScore+'점'],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
  {
    name: 'find', label: '글자 찾기 — 같은 글자를 모두 눌러 찾기',
    setup: `progress.idx=0; loadMission(); renderMission(); openFind()`,
    solve: `window.__hp.solveFind(${STEP})`,
    // 다 찾으면 앱이 축하 후 자동으로 넘어가므로 '화면 활성'이 아니라 '다 찾음'을 성공 신호로 본다.
    assert: `[
      ['목표 글자를 다 찾음', fdFound >= fdTargetCount, fdFound+'/'+fdTargetCount],
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
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
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
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
      ['가로 스크롤 없음', noOverflow(), overflowPx()+'px'],
    ]`,
  },
];

// 페이지에 한 번 주입: 정답 자동 풀이 드라이버 + 작은 헬퍼 + 조립 자동이동 무력화.
// 앱의 최상위 const/함수(jamoCharSVG·CHO·wbTap…)는 페이지 전역 스코프라 이름으로 바로 참조된다.
const DRIVER = () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // 조립 완성 뒤 1.3초 자동이동을 끈다 — 멈춰서 완성판을 볼 수 있게.
  try { window.completeCombine = function () {}; } catch (e) {}
  window.noOverflow = () =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  window.overflowPx = () =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth;
  // jamoCharSVG()의 원본 문자열과 DOM이 다시 직렬화한 innerHTML은 따옴표·태그순서가 달라
  // 문자열 비교가 어긋난다 → 양쪽을 <template>로 한 번 통과시켜 같은 규칙으로 정규화한 뒤 비교.
  const norm = html => { const t = document.createElement('template'); t.innerHTML = html || ''; return t.innerHTML; };
  const svgFor = j => norm(jamoCharSVG(j, CHO.indexOf(j) < 0));
  // 트레이(wb-card: 래퍼 없음)에서 특정 자모 카드 찾기.
  const cardFor = (sel, j) => { const want = svgFor(j); return [...document.querySelectorAll(sel)]
    .find(b => !b.disabled && !b.classList.contains('used') && norm(b.innerHTML) === want); };
  window.__hp = {
    async solveWord(step) {
      let guard = 0;
      while (wbPos < wbExpected.length && guard++ < 30) {
        const j = wbExpected[wbPos];
        const card = cardFor('#wbTray .wb-card', j);
        if (!card) break;
        wbTap(card, j);
        await sleep(step);
      }
      return { placed: wbPos, total: wbExpected.length };
    },
    async solveCombine(step) {
      let guard = 0;
      while (cbPos < cbExpected.length && guard++ < 30) {
        const j = cbExpected[cbPos];
        const card = cardFor('#cbTray .wb-card', j);
        if (!card) break;
        cbTap(card, j);
        await sleep(step);
      }
      return { placed: cbPos, total: cbExpected.length };
    },
    async solveListen(step) {
      // 단어 단계로 올려(정답 버튼을 data-word로 특정) 정답을 누른다.
      listenScore = 2; newListenQuestion();
      await sleep(step);
      const w = listenTarget && listenTarget.word;
      const btn = w && document.querySelector('#listenOpts .lopt[data-word="' + w + '"]');
      if (btn) { btn.click(); await sleep(step); return { clicked: true }; }
      return { clicked: false };
    },
    async solveFind(step) {
      // 찾기 카드는 <div class="lglyph">SVG</div> 래퍼. 안쪽 SVG를 정규화해 목표 글자와 대조.
      const want = norm(jamoCharSVG(fdCh, fdKind(fdCh) === 'v'));
      const targets = [...document.querySelectorAll('#fdGrid .lopt')].filter(b => {
        const g = b.querySelector('.lglyph'); return g && norm(g.innerHTML) === want;
      });
      for (const b of targets) { b.click(); await sleep(step); }
      return { found: fdFound, targets: targets.length };
    },
  };
};

// 화면 상단 배너 — 지금 무엇을 보고 있는지.
const BANNER = (label, status, lines) => `(() => {
  let b = document.getElementById('__hpwatch');
  if (!b) {
    b = document.createElement('div'); b.id = '__hpwatch';
    b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483647;' +
      'font:600 15px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;color:#fff;' +
      'padding:10px 16px 12px;box-shadow:0 2px 12px rgba(0,0,0,.25);white-space:pre;' +
      'pointer-events:none;transition:background .2s';
    document.body.appendChild(b);
  }
  const s = ${JSON.stringify(status)};
  b.style.background = s === 'run' ? '#3a7bd5' : s === 'pass' ? '#2e9e5b' : '#d64545';
  b.textContent = ${JSON.stringify(label)} + '\\n' + ${JSON.stringify(lines)};
})()`;

// 하단 제어 막대 — 멈춤 모드에서만. 버튼이 window.__hpAction(node로 콜백)을 부른다.
const CONTROLBAR = sceneLabel => `(() => {
  let c = document.getElementById('__hpctl');
  if (!c) {
    c = document.createElement('div'); c.id = '__hpctl';
    c.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;' +
      'display:flex;gap:10px;align-items:center;padding:12px 16px;' +
      'background:#1f2733;box-shadow:0 -2px 12px rgba(0,0,0,.3);' +
      'font:600 14px -apple-system,BlinkMacSystemFont,sans-serif';
    const mk = (txt, bg) => { const b = document.createElement('button');
      b.textContent = txt; b.style.cssText = 'border:0;border-radius:8px;padding:9px 16px;' +
      'font:inherit;color:#fff;cursor:pointer;background:' + bg; return b; };
    const inp = document.createElement('input'); inp.id = '__hpnote';
    inp.placeholder = '여기에 고칠 점을 적고 [문제 지적]을 누르세요';
    inp.style.cssText = 'flex:1;min-width:120px;border:0;border-radius:8px;padding:10px 12px;' +
      'font:400 14px -apple-system,sans-serif;background:#fff;color:#111';
    const toast = document.createElement('span'); toast.id = '__hptoast';
    toast.style.cssText = 'color:#7fe0a0;min-width:64px';
    const next = mk('다음 ▶', '#3a7bd5');
    const note = mk('✎ 문제 지적', '#e0a13a');
    const stop = mk('⏹ 끝내기', '#d64545');
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') note.click(); });
    note.addEventListener('click', () => { const v = inp.value.trim(); if (!v) return;
      window.__hpAction('note', v); inp.value = '';
      toast.textContent = '기록됨 ✓'; setTimeout(() => toast.textContent = '', 1500); });
    next.addEventListener('click', () => window.__hpAction('next'));
    stop.addEventListener('click', () => window.__hpAction('stop'));
    c.append(inp, note, toast, next, stop);
    document.body.appendChild(c);
  }
  c.style.display = 'flex';
  const n = document.getElementById('__hpnote');
  if (n) { n.value = ''; n.setAttribute('data-scene', ${JSON.stringify(sceneLabel)}); }
})()`;

async function main() {
  const wanted = ONLY ? new Set(ONLY.split(',')) : null;
  const scenes = wanted ? SCENES.filter(s => wanted.has(s.name)) : SCENES;

  console.log(`\n🌐 대상: ${BASE}`);
  console.log(`🖥  Chrome 창을 띄웁니다 — ${AUTO ? '끝까지 자동으로 순회합니다.' : '화면마다 멈춥니다. 하단 버튼으로 진행하세요.'}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: false, args: ARGS,
    defaultViewport: VIEWPORT, protocolTimeout: 0,
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // 브라우저 버튼 → node 콜백. note는 모아 두고, next/stop은 대기 중인 약속을 푼다.
  const notes = [];
  let currentSceneLabel = '';
  let resolveStep = null;
  await page.exposeFunction('__hpAction', (action, payload) => {
    if (action === 'note') {
      if (payload && payload.trim()) {
        notes.push({ scene: currentSceneLabel, text: payload.trim() });
        console.log(`   ✎ 지적 기록: [${currentSceneLabel}] ${payload.trim()}`);
      }
      return;
    }
    if (resolveStep) { const r = resolveStep; resolveStep = null; r(action); }
  });

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

  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction("typeof window.go === 'function'", { timeout: 40000 });
  await page.evaluate(DRIVER);
  await page.evaluate(() => document.fonts.ready);

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const results = [];
  let stopped = false;

  for (const scene of scenes) {
    currentSceneLabel = scene.label;
    try { await page.evaluate(`go('home')`); } catch (e) {}
    await page.evaluate(BANNER(`▶ 점검 중: ${scene.label}`, 'run', '화면을 여는 중…'));
    await wait(Math.min(700, PACE / 2));

    let checks = [], err = null;
    try {
      await page.evaluate(scene.setup);
      await page.evaluate(() => document.fonts.ready);
      await wait(Math.min(700, PACE / 2));
      if (scene.solve) {
        await page.evaluate(BANNER(`▶ 푸는 중: ${scene.label}`, 'run', '정답을 눌러 봅니다…'));
        await page.evaluate(scene.solve);
      }
      await wait(PACE);
      checks = await page.evaluate(`(${scene.assert})`);
    } catch (e) {
      err = e.message.split('\n')[0];
    }

    const fails = checks.filter(c => !c[1]);
    const passed = !err && fails.length === 0;
    const summary = err ? `⚠ 오류: ${err}`
      : checks.map(c => `${c[1] ? '✓' : '✗'} ${c[0]}${c[2] ? ` (${c[2]})` : ''}`).join('\n');
    await page.evaluate(BANNER(
      `${passed ? '✅ 통과' : '❌ 확인 필요'}: ${scene.label}`,
      passed ? 'pass' : 'fail', summary));

    results.push({ name: scene.name, label: scene.label, passed, checks, err });
    console.log(`${passed ? '✅' : '❌'} ${scene.label}`);
    for (const c of checks) console.log(`     ${c[1] ? '✓' : '✗'} ${c[0]}${c[2] ? ` (${c[2]})` : ''}`);
    if (err) console.log(`     ⚠ ${err}`);

    if (AUTO) {
      await wait(PACE);
    } else {
      // 멈춤: 사용자가 [다음]/[끝내기]를 누를 때까지 기다린다. 그 사이 [문제 지적]도 가능.
      await page.evaluate(CONTROLBAR(scene.label));
      const action = await new Promise(res => { resolveStep = res; });
      await page.evaluate(`(() => { const c=document.getElementById('__hpctl'); if(c) c.style.display='none'; })()`);
      if (action === 'stop') { stopped = true; break; }
    }
  }

  const failCount = results.filter(r => !r.passed).length;
  console.log(`\n=== 자동 점검 요약 ===`);
  console.log(`  화면 ${results.length}개 순회${stopped ? '(중간에 끝냄)' : ''} · 통과 ${results.length - failCount} · 확인 필요 ${failCount}`);
  console.log(`  대상: ${BASE}`);

  if (notes.length) {
    const body = `# 점검 지적사항 (${BASE})\n\n` +
      notes.map((n, i) => `${i + 1}. **[${n.scene}]** ${n.text}`).join('\n') + '\n';
    try { fs.writeFileSync(NOTES_FILE, body); } catch (e) {}
    console.log(`\n📝 남긴 지적사항 ${notes.length}건 → ${NOTES_FILE}`);
    notes.forEach((n, i) => console.log(`   ${i + 1}. [${n.scene}] ${n.text}`));
  } else {
    console.log(`\n📝 남긴 지적사항 없음.`);
  }

  await page.evaluate(BANNER(
    stopped ? '점검을 끝냈습니다.' : (failCount ? `점검 끝 — 확인 필요 ${failCount}건` : '점검 끝 — 전부 통과 🎉'),
    failCount ? 'fail' : 'pass', '잠시 후 창이 닫힙니다.'));
  await wait(2000);
  await browser.close();
  process.exit(failCount ? 1 : 0);
}

main().catch(e => { console.error('실패:', e.message); process.exit(1); });
