const CACHE='hangul-playground-v73';
const ASSETS=['./','./index.html','./index.html?source=pwa','./styles.css','./app-data.js','./app-state.js','./app-listen.js','./app-router.js','./app-adventure.js','./app-learning.js','./app-writing.js','./app-episode.js','./app-review.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./assets/generated-cards/cards.json','./assets/generated-cards/hani-postbox.svg','./assets/generated-cards/letter-a.svg','./assets/generated-cards/word-oi.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// 네트워크 우선 + 항상 재검증(no-cache): 브라우저 휴리스틱 HTTP 캐시 때문에 옛 파일이
// 섞여 나오는 문제를 막는다. 온라인이면 항상 최신(변경 없으면 304), 오프라인이면 캐시 폴백.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'}).then(resp=>{
      const cp=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
