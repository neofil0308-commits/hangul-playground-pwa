const CACHE='hangul-playground-v34';
const ASSETS=['./','./index.html','./index.html?source=pwa','./styles.css','./app-data.js','./app-state.js','./app-listen.js','./app-router.js','./app-adventure.js','./app-learning.js','./app-writing.js','./app-games.js','./app-episode.js','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// 네트워크 우선: 온라인이면 항상 최신 파일을 받아 캐시 갱신, 오프라인이면 캐시로 폴백.
// (개발 중 옛 캐시가 새 파일과 섞여 깨지는 문제를 막아줌)
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      const cp=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
