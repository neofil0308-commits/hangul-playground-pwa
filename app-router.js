// Screen routing and top-level menu bootstrap for 하니의 한글 모험.
// Depends on app-data.js for MENU. Route side-effect functions are provided by the main app script.

const homeBtn=document.getElementById('homeBtn');
function go(id){if(id==='set'&&!parentUnlocked){showGate();return;}document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='set')renderReport();if(id==='listen'&&!listenBuilt){listenBuilt=true;startListenRound();}homeBtn.style.display=id==='home'?'none':'block';if(id==='trace')setTimeout(function(){sizeTrace();fitGuide();},30);if(id==='letterDetail')setTimeout(function(){mtSize();mtRenderStrokes();},30);if(id==='sentWrite')setTimeout(function(){sizeCells();},30);window.scrollTo({top:0,behavior:'smooth'});}
homeBtn.addEventListener('click',()=>go('home'));
const menu=document.getElementById('menu');
MENU.forEach(m=>{const b=document.createElement('button');b.className=m.cls;b.innerHTML='<span class="ic">'+m.ic+'</span>'+m.label;b.addEventListener('click',()=>go(m.id));menu.appendChild(b);});
