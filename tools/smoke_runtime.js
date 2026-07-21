// 런타임 스모크 — 실제 index.html + app-*.js를 jsdom에 로드해 화면 전환과 핵심 경로를 눌러 본다.
//
// 왜 필요한가: tests/*_check.py는 전부 정적 문자열 검사라 "함수가 사라졌다"는 잡아도
// "버튼 핸들러가 안 걸렸다"는 못 잡는다. 실제로 2026-07-21 잔재 화면 정리 때 단어 동산
// 버튼 바인딩이 initWordStudy 안에 섞여 있다가 통째로 지워졌는데, 정적 테스트 193개는
// 전부 통과했고 이 스모크만 잡아냈다.
//
// 사용 (저장소 루트에서):
//   python -m http.server 5399 --bind 127.0.0.1 &
//   npm install jsdom          # 최초 1회. 저장소에는 포함하지 않는다(정적 배포라 런타임 의존 없음).
//   node tools/smoke_runtime.js
//
// jsdom을 다른 곳에 설치했다면: NODE_PATH=<그 경로>/node_modules node tools/smoke_runtime.js
//
// 종료 코드 0 = 통과. 서버 주소는 SMOKE_BASE 환경변수로 바꿀 수 있다.

const { JSDOM } = require('jsdom');
const fs = require('fs');
const errors = [];

// 실제 로컬 HTTP 서버에서 받아온다 — 브라우저와 동일한 순서로 <script src>가 로드되고
// 스크립트끼리 최상위 const/함수를 공유한다(window.eval은 스코프가 분리돼 재현 불가).
const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:5399';

async function build() {
  const html = await (await fetch(BASE + '/index.html')).text();
  return new JSDOM(html, {
    url: BASE + '/index.html', runScripts: 'dangerously',
    resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => ({
        setTransform(){}, clearRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){},
        save(){}, restore(){}, measureText: () => ({width:10, actualBoundingBoxAscent:10,
          actualBoundingBoxDescent:2, fontBoundingBoxAscent:12, fontBoundingBoxDescent:3}),
        fillText(){}, getImageData: () => ({data:new Uint8ClampedArray(4)}), drawImage(){},
      });
      w.HTMLMediaElement.prototype.play = () => Promise.resolve();
      w.speechSynthesis = { getVoices: () => [], speak(){}, cancel(){} };
      w.SpeechSynthesisUtterance = function(){};
      w.matchMedia = () => ({matches:false, addEventListener(){}, addListener(){}});
      w.scrollTo = () => {};
      w.onerror = (m, s, l) => errors.push(`window.onerror: ${m} @${s}:${l}`);
      w.addEventListener('unhandledrejection', e => errors.push('unhandled: ' + e.reason));
    },
  });
}

async function main() {
const dom = await build();
const w = dom.window;
await new Promise(r => { if (w.document.readyState === 'complete') r();
                         else w.addEventListener('load', r); setTimeout(r, 4000); });

// ── 검증 ──────────────────────────────────────────────
const checks = [];
const ok = (name, cond, detail='') => checks.push([cond, name, detail]);

ok('제거한 화면 5종이 DOM에 없다',
   ['letters','syl','word','sent','sentWrite'].every(id => !w.document.getElementById(id)));
ok('살아있는 화면이 전부 있다',
   ['letterDetail','wordBuild','combine','story','trace','listen','review','find','sticker','set']
     .every(id => !!w.document.getElementById(id)));

// 단어 동산 도구 버튼 — 방금 소실됐다가 복구한 바인딩
for (const id of ['wbBack','wbHear','wbExplain','wbReset','wbWrite']) {
  const el = w.document.getElementById(id);
  ok(`단어 동산 #${id} 존재`, !!el);
}
// 핵심 함수가 살아 있는지
for (const fn of ['go','openTodayLetter','openLetterDetail','openWordBuild','openCombine',
                  'openStory','loadCustomTrace','initWordGarden','isUnlocked','accessAllowed']) {
  ok(`함수 ${fn} 정의됨`, typeof w[fn] === 'function');
}
// 실제 화면 전환 — go()가 제거된 화면을 참조하지 않는지
for (const id of ['letterDetail','wordBuild','combine','story','trace','listen','sticker']) {
  try { w.go(id); ok(`go('${id}') 동작`, w.document.getElementById(id).classList.contains('active')); }
  catch (e) { ok(`go('${id}') 동작`, false, e.message); }
}
// 단어 동산 → 따라쓰기 경로(trace의 유일한 입구)
try {
  w.openWordBuild('바다','🌊');
  w.document.getElementById('wbWrite').dispatchEvent(new w.Event('click'));
  ok("단어 동산 '써보기' → trace 진입", w.document.getElementById('trace').classList.contains('active'));
} catch (e) { ok("단어 동산 '써보기' → trace 진입", false, e.message); }
// ── 2026-07-22 콘텐츠 정합성 수정 회귀 방어 ──────────────────────────
// 게임 오답 후보: 정답과 같은 계열이어야 하고, 정답 자신은 빠져야 한다.
// (5막 쌍자음·6막 복모음이 풀에 없어 정답만 모양이 달랐던 문제)
try {
  const pool = w.letterPool('ㄲ');
  ok('letterPool(ㄲ)이 후보를 낸다', pool.length > 0);
  ok('letterPool(ㄲ)에 정답이 없다', !pool.some(o => o.ch === 'ㄲ'));
  ok('letterPool(ㄲ)이 전부 자음', pool.every(o => !w.isVowelCh(o.ch)));
  const vpool = w.letterPool('ㅐ');
  ok('letterPool(ㅐ)이 전부 모음', vpool.length > 0 && vpool.every(o => w.isVowelCh(o.ch)));
  ok('복모음이 모음으로 인식된다', w.isVowelCh('ㅐ') && w.isVowelCh('ㅘ'));
} catch (e) { ok('letterPool 동작', false, e.message); }

// 미션 단계 수가 홈·지도·빛조각에서 하나로 통일됐는가
try {
  ok('missionParts/missionTotal 정의됨',
     typeof w.missionParts === 'function' && typeof w.missionTotal === 'function');
  ok('missionTotal이 3 또는 4', [3, 4].includes(w.missionTotal()));
} catch (e) { ok('미션 단계 헬퍼', false, e.message); }

// 지도에 네 번째 모험(글자 찾기) 장소가 생겼는가
try {
  const nodes = [...w.document.querySelectorAll('#mapGrid .map-node')];
  ok('지도에 글자 찾기 노드가 있다', nodes.some(n => n.dataset.target === 'find'));
  ok('지도 노드가 5곳', nodes.length === 5, `실제 ${nodes.length}곳`);
} catch (e) { ok('지도 노드', false, e.message); }

// 낱자 발화가 쌍자음·복모음까지 이름/소릿값으로 바뀌는가
try {
  ok('ㄲ 발화형이 이름', w.jamoSpeech('ㄲ') === '쌍기역', w.jamoSpeech('ㄲ'));
  ok('ㅐ 발화형이 소릿값', w.jamoSpeech('ㅐ') === '애', w.jamoSpeech('ㅐ'));
  ok('ㄱ 발화형이 이름', w.jamoSpeech('ㄱ') === '기역', w.jamoSpeech('ㄱ'));
} catch (e) { ok('낱자 발화', false, e.message); }

// 커리큘럼 보강(3단계) 회귀 방어 — 각 막이 최소 분량을 갖고, 새 화 유형이 실제로 열린다.
try {
  const path = w.eval('EPISODE_PATH');
  const byAct = {};
  path.forEach(e => { byAct[e.act] = (byAct[e.act] || 0) + 1; });
  ok('모든 막이 5화 이상', Object.values(byAct).every(n => n >= 5), JSON.stringify(byAct));
  ok('4막에 받침 조립 화가 있다', path.some(e => e.act === 4 && e.type === 'combine'));
  ok('7막이 단어마다 한 화', path.filter(e => e.act === 7).every(e => !!e.word));
  ok('7막이 10화 이상', path.filter(e => e.act === 7).length >= 10);
} catch (e) { ok('커리큘럼 구성', false, e.message); }

// 4막 받침 조립: 3자모(초성+중성+종성)로 분해되어야 드래그 판이 만들어진다.
try {
  const ep = w.eval('EPISODE_PATH').find(e => e.act === 4 && e.type === 'combine');
  const jamo = w.eval('decompose')(ep.ch)[0];
  ok('받침 음절이 3자모로 분해된다', jamo.length === 3, `${ep.ch} → ${jamo.join('')}`);
} catch (e) { ok('받침 조립 분해', false, e.message); }

// 오늘의 글자 열기(글자 숲)
try { w.go('home'); w.openTodayLetter();
  ok('openTodayLetter 동작', w.document.getElementById('letterDetail').classList.contains('active')
     || w.document.getElementById('combine').classList.contains('active')
     || w.document.getElementById('story').classList.contains('active'));
} catch (e) { ok('openTodayLetter 동작', false, e.message); }

console.log('\n=== 런타임 스모크 ===');
let fail = 0;
for (const [cond, name, detail] of checks) {
  if (!cond) { fail++; console.log(`  ✗ ${name} ${detail}`); }
}
console.log(`  검사 ${checks.length}건 · 실패 ${fail}건`);
if (errors.length) { console.log('\n스크립트 오류:'); errors.forEach(e => console.log('  ' + e)); }
else console.log('  스크립트 오류 0건');
process.exit(fail || errors.length ? 1 : 0);
}
main();
