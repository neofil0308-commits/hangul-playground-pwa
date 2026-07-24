// Writing, tracing, syllable-building screens for 하니의 한글 모험.
// Loaded before the main inline app script; run initWritingScreens() after helpers exist.

/* 미니 받아쓰기 (상세 화면) — 단어는 음절 칸을 가로로 나란히, 낱글자는 한 칸에 */
const mtStage=document.getElementById('mtStage');
let mtStrokeOn=true,mtChars=['ㄱ'],mtCells=[];
function mtCellPos(rec,e){const r=rec.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function mtAttachDraw(rec){let drawing=false,lx,ly;rec.canvas.addEventListener('pointerdown',e=>{drawing=true;const p=mtCellPos(rec,e);lx=p.x;ly=p.y;try{rec.canvas.setPointerCapture(e.pointerId);}catch(_){}});rec.canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=mtCellPos(rec,e);rec.ctx.strokeStyle='#4A3524';rec.ctx.beginPath();rec.ctx.moveTo(lx,ly);rec.ctx.lineTo(p.x,p.y);rec.ctx.stroke();lx=p.x;ly=p.y;});rec.canvas.addEventListener('pointerup',()=>drawing=false);rec.canvas.addEventListener('pointercancel',()=>drawing=false);}
function mtSizeCell(rec){const r=rec.canvas.getBoundingClientRect();if(r.width===0)return;const dpr=window.devicePixelRatio||1;rec.canvas.width=r.width*dpr;rec.canvas.height=r.height*dpr;rec.ctx.setTransform(dpr,0,0,dpr,0,0);rec.ctx.lineCap='round';rec.ctx.lineJoin='round';rec.ctx.lineWidth=14;rec.ctx.strokeStyle='#4A3524';}
function mtSize(){mtCells.forEach(mtSizeCell);}
function mtClearCanvas(){mtCells.forEach(rec=>{rec.ctx.save();rec.ctx.setTransform(1,0,0,1,0,0);rec.ctx.clearRect(0,0,rec.canvas.width,rec.canvas.height);rec.ctx.restore();});}
// 획순을 켜도 통글자 가이드는 계속 보이게 둔다(정확한 글자꼴 위에 획순 화살표를 얹음).
function mtRenderStrokes(){mtCells.forEach(rec=>{var on=mtStrokeOn&&!!strokesFor(rec.ch);rec.svg.innerHTML=on?strokeSVGMarkup(rec.ch,0.6):'';if(rec.guide)rec.guide.style.opacity=on?'0.55':'0.5';});}
function mtBuild(chars){mtChars=chars.slice();mtCells=[];if(!mtStage)return;mtStage.innerHTML='';mtStage.classList.toggle('mt-multi',chars.length>1);chars.forEach(function(ch){const cell=document.createElement('div');cell.className='mt-cell';cell.innerHTML='<div class="mt-grid"></div><div class="mt-guide">'+ch+'</div><svg viewBox="0 0 100 100"></svg><canvas></canvas>';mtStage.appendChild(cell);const rec={ch:ch,cell:cell,guide:cell.querySelector('.mt-guide'),svg:cell.querySelector('svg'),canvas:cell.querySelector('canvas')};rec.ctx=rec.canvas.getContext('2d');mtAttachDraw(rec);mtCells.push(rec);});mtSize();mtClearCanvas();mtRenderStrokes();}
function mtSelect(ch){mtBuild([ch]);}
function mtWord(word){mtBuild([...word].filter(function(c){return c!==' ';}));}




/* 받침은 글자 만들기에 통합됨 */





/* 따라쓰기 + 획순 */
const traceStage=document.getElementById('traceStage'),traceGuide=document.getElementById('traceGuide'),canvas=document.getElementById('traceCanvas'),ctx=canvas.getContext('2d'),strokeSvg=document.getElementById('traceStrokeSvg');
let strokeOn=false;
function sizeTrace(){const r=traceStage.getBoundingClientRect();if(r.width===0)return;const dpr=window.devicePixelRatio||1;canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=16;ctx.strokeStyle='#222';}
function clearTrace(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();}
// 통글자 가이드(실제 글자꼴)는 그대로 두고, 그 위에 획순(방향 화살표+번호)만 얹는다.
// (예전엔 자모를 합성해 글자를 통째로 다시 그렸는데 비율이 안 맞아 뺐다 — 밑그림 없음.)
// ===== 획순-음영 정밀 정렬 =====
// 음영은 폰트 글리프라 셀 안에서 차지하는 영역이 글자·폰트크기 비율(frac)마다 다르다.
// canvas TextMetrics로 글리프의 실제 잉크 박스를 계측해, 0~100 가정으로 만든 획순 좌표를
// 그 잉크 박스에 정확히 옮겨 심는다. (따라쓰기 frac=0.8, 미니 받아쓰기 frac=0.6 — styles.css와 짝)
var _inkCanvas=null,_inkCache={};
function glyphInkBox(ch,frac){
  var key=ch+'@'+frac;
  if(_inkCache[key])return _inkCache[key];
  try{
    if(!_inkCanvas)_inkCanvas=document.createElement('canvas');
    var c=_inkCanvas.getContext('2d');var S=400;
    c.font=Math.round(S*frac)+'px Jua';c.textAlign='center';
    var m=c.measureText(ch);
    if(!m||m.actualBoundingBoxAscent===undefined)return null;
    // flex 중앙정렬 + line-height:1 기준 베이스라인 위치 = S/2 + (fbAsc-fbDesc)/2 (실측 검증됨)
    // 실측 보정: line-height:1 flex 중앙정렬에서 Jua 글리프가 계산 베이스라인보다 살짝 위로 떠
    // 획순이 음영보다 위로 밀린다 → 베이스라인을 소폭 내려 음영에 얹는다.
    var by=S/2+(m.fontBoundingBoxAscent-m.fontBoundingBoxDescent)/2+S*0.022;
    var box=[(S/2-m.actualBoundingBoxLeft)/S*100,(by-m.actualBoundingBoxAscent)/S*100,
             (S/2+m.actualBoundingBoxRight)/S*100,(by+m.actualBoundingBoxDescent)/S*100];
    if(box[2]-box[0]<5||box[3]-box[1]<5)return null;
    var fontOk=false;try{fontOk=document.fonts&&document.fonts.check('16px Jua');}catch(e){}
    if(fontOk)_inkCache[key]=box; // 폰트 로드 전 측정값은 캐시하지 않음(로드 후 재계측)
    return box;
  }catch(e){return null;}
}
function calibrateStrokes(data,ink){
  var x0=999,y0=999,x1=-999,y1=-999;
  data.forEach(function(st){
    if(st.circle){var c=st.circle;x0=Math.min(x0,c[0]-c[2]);x1=Math.max(x1,c[0]+c[2]);y0=Math.min(y0,c[1]-c[2]);y1=Math.max(y1,c[1]+c[2]);}
    else st.forEach(function(p){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});
  });
  var IN=2.4; // 획순 선은 획의 중심선이라 잉크 가장자리에서 획 두께 절반쯤 안쪽으로(음영에 더 꽉 차게 축소)
  var tx0=ink[0]+IN,ty0=ink[1]+IN,tx1=ink[2]-IN,ty1=ink[3]-IN;
  var sx=(x1-x0)<12?1:(tx1-tx0)/(x1-x0), sy=(y1-y0)<12?1:(ty1-ty0)/(y1-y0);
  sx=Math.max(0.55,Math.min(1.6,sx)); sy=Math.max(0.55,Math.min(1.6,sy));
  var cx=(x0+x1)/2,cy=(y0+y1)/2,tcx=(tx0+tx1)/2,tcy=(ty0+ty1)/2;
  function mx(v){return Math.round((tcx+(v-cx)*sx)*10)/10;}
  function my(v){return Math.round((tcy+(v-cy)*sy)*10)/10;}
  return data.map(function(st){
    if(st.circle){var c=st.circle;return {circle:[mx(c[0]),my(c[1]),Math.round(c[2]*Math.min(sx,sy)*10)/10]};}
    return st.map(function(p){return [mx(p[0]),my(p[1])];});
  });
}
function strokeSVGMarkup(ch,frac){let data=strokesFor(ch);if(!data)return '';
  var ink=glyphInkBox(ch,frac||0.8);if(ink)data=calibrateStrokes(data,ink);
  let s='<defs><marker id="ah" markerWidth="5.4" markerHeight="5.4" refX="2.2" refY="2.7" orient="auto"><path d="M0,0 L5.4,2.7 L0,5.4 Z" fill="#ff7fb0"/></marker></defs>';
  // 번호 배지: 시작점 정확히 위가 아니라 획 안쪽(2번째 점 방향 18%)에 놓고, 같은 좌표에서 겹치면 획 방향으로 밀어 분리(ㅁㄹㄷㅌ 등).
  // 배지는 글자를 덮지 않게 작게(r5) — 통글자 가이드 위에 획순만 얹는 방식이라 배지가 크면 글자를 가림.
  // 배지 크기는 획 수에 반비례(획 많은 ㅃ·ㅆ·겹받침은 작게 해 서로 덜 겹치고 글자를 덜 가림).
  var R=data.length>=6?4:(data.length>=4?4.5:5),MIN=2*R+1,FS=Math.round(R*1.32*10)/10;
  var placed=[];
  function clamp(v){return Math.max(R,Math.min(100-R,v));}
  function collides(bx,by){for(var i=0;i<placed.length;i++){var ddx=bx-placed[i][0],ddy=by-placed[i][1];if(ddx*ddx+ddy*ddy<MIN*MIN)return true;}return false;}
  // 겹치면 획 방향 앞/뒤 → 획에 수직 양쪽으로 점점 크게 밀며 빈자리를 찾는다(한쪽으로만 밀던 예전보다 촘촘한 글자에 강함).
  function placeBadge(bx,by,dx,dy){
    var len=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/len,uy=dy/len,px=-uy,py=ux;
    if(!collides(bx,by)){bx=clamp(bx);by=clamp(by);placed.push([bx,by]);return [bx,by];}
    for(var g=1;g<=12;g++){var step=g*MIN*0.55;
      var cand=[[bx+ux*step,by+uy*step],[bx-ux*step,by-uy*step],[bx+px*step,by+py*step],[bx-px*step,by-py*step]];
      for(var k=0;k<cand.length;k++){var cx=clamp(cand[k][0]),cy=clamp(cand[k][1]);if(!collides(cx,cy)){placed.push([cx,cy]);return [cx,cy];}}}
    var fx=clamp(bx),fy=clamp(by);placed.push([fx,fy]);return [fx,fy];}
  data.forEach((st,idx)=>{let bx,by,dx,dy;if(st.circle){const c=st.circle;s+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="none" stroke="#ff9ec2" stroke-width="3.2"/>';bx=c[0];by=c[1]-c[2];dx=0;dy=c[2];}else{const pts=st.map(p=>p.join(',')).join(' ');s+='<polyline points="'+pts+'" fill="none" stroke="#ff9ec2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)"/>';var p0=st[0],p1=st[1]||st[0];bx=p0[0]+(p1[0]-p0[0])*0.08;by=p0[1]+(p1[1]-p0[1])*0.08;dx=p1[0]-p0[0];dy=p1[1]-p0[1];}var bp=placeBadge(bx,by,dx,dy);bx=bp[0];by=bp[1];s+='<circle cx="'+bx+'" cy="'+by+'" r="'+R+'" fill="#ff7fb0"/><text x="'+bx+'" y="'+(by+R*0.46)+'" text-anchor="middle" font-size="'+FS+'" fill="#fff" font-family="Jua">'+(idx+1)+'</text>';});return s;}
function renderStrokes(ch){var on=strokeOn&&!!strokesFor(ch);strokeSvg.innerHTML=on?strokeSVGMarkup(ch,0.8):'';if(typeof traceGuide!=='undefined'&&traceGuide)traceGuide.style.opacity=on?'0.55':'0.5';}
let drawing=false,lx,ly;
function tpos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

let traceChar='ㄱ';
// 따라쓰기 대상 읽기. 낱말/음절은 그대로, 낱자는 ALL_LETTER_OBJS의 이름·소릿값으로.
function sayTrace(ch){if([...ch].length>1){speak(ch);return;}
  const o=(typeof ALL_LETTER_OBJS!=='undefined')?ALL_LETTER_OBJS[ch]:null;
  speak((o&&(o.name||o.sound))||ch);}
function fitGuide(){const h=traceStage.getBoundingClientRect().height||330;const n=[...traceChar].length;const frac=n>=3?0.33:(n===2?0.52:0.80);traceGuide.style.fontSize=Math.round(h*frac)+'px';}

/* ===== 따라쓰기 단어 모드: 음절칸 분할 =====
   단어는 여러 음절이라 단일 SVG(0-100)에 획순을 못 얹는다 → 글자 숲 미니처럼 음절칸으로 쪼개
   칸마다 음영·합성 획순(composedStrokes)·그리기 캔버스를 둔다. 낱자(자음/모음/받침 음절)는 기존 단일 스테이지 유지. */
const traceCellsHost=document.getElementById('traceCells');
let traceCells=[],traceWordMode=false;
function traceCellPos(rec,e){const r=rec.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function traceCellAttach(rec){let d=false,ux,uy;
  rec.canvas.addEventListener('pointerdown',e=>{d=true;const p=traceCellPos(rec,e);ux=p.x;uy=p.y;try{rec.canvas.setPointerCapture(e.pointerId);}catch(_){}});
  rec.canvas.addEventListener('pointermove',e=>{if(!d)return;e.preventDefault();const p=traceCellPos(rec,e);rec.ctx.beginPath();rec.ctx.moveTo(ux,uy);rec.ctx.lineTo(p.x,p.y);rec.ctx.stroke();ux=p.x;uy=p.y;});
  rec.canvas.addEventListener('pointerup',()=>d=false);rec.canvas.addEventListener('pointercancel',()=>d=false);}
function traceCellSize(rec){const r=rec.canvas.getBoundingClientRect();if(r.width===0)return;const dpr=window.devicePixelRatio||1;rec.canvas.width=r.width*dpr;rec.canvas.height=r.height*dpr;rec.ctx.setTransform(dpr,0,0,dpr,0,0);rec.ctx.lineCap='round';rec.ctx.lineJoin='round';rec.ctx.lineWidth=15;rec.ctx.strokeStyle='#222';}
function traceCellsSize(){traceCells.forEach(traceCellSize);}
function traceCellsClear(){traceCells.forEach(rec=>{rec.ctx.save();rec.ctx.setTransform(1,0,0,1,0,0);rec.ctx.clearRect(0,0,rec.canvas.width,rec.canvas.height);rec.ctx.restore();});}
function traceCellsRenderStrokes(){traceCells.forEach(rec=>{var on=strokeOn&&!!strokesFor(rec.ch);rec.svg.innerHTML=on?strokeSVGMarkup(rec.ch,0.8):'';rec.guide.style.opacity=on?'0.55':'0.5';});}
function enterTraceWord(word){
  traceWordMode=true;traceCells=[];
  traceGuide.style.display='none';strokeSvg.style.display='none';canvas.style.display='none';
  var grid=traceStage.querySelector('.trace-grid');if(grid)grid.style.display='none';
  traceCellsHost.style.display='flex';traceCellsHost.innerHTML='';
  [...word].filter(function(c){return c!==' ';}).forEach(function(ch){
    var cell=document.createElement('div');cell.className='trace-cell';
    cell.innerHTML='<div class="tc-grid"></div><div class="tc-guide">'+ch+'</div><svg viewBox="0 0 100 100"></svg><canvas></canvas>';
    traceCellsHost.appendChild(cell);
    var rec={ch:ch,guide:cell.querySelector('.tc-guide'),svg:cell.querySelector('svg'),canvas:cell.querySelector('canvas')};
    rec.ctx=rec.canvas.getContext('2d');traceCellAttach(rec);traceCells.push(rec);
  });
  traceCellsSize();traceCellsClear();traceCellsRenderStrokes();
}
function exitTraceWord(){
  traceWordMode=false;traceCells=[];
  if(traceCellsHost){traceCellsHost.style.display='none';traceCellsHost.innerHTML='';}
  traceGuide.style.display='';strokeSvg.style.display='';canvas.style.display='';
  var grid=traceStage.querySelector('.trace-grid');if(grid)grid.style.display='';
}
function selectTrace(ch,silent){traceChar=ch;
  if([...ch].length>1){enterTraceWord(ch);}
  else{exitTraceWord();traceGuide.textContent=ch;fitGuide();clearTrace();renderStrokes(ch);}
  if(!silent)sayTrace(ch);}
const traceChips=document.getElementById('traceChips');
function makeTraceChip(ch,on){const b=document.createElement('button');b.className='chip t'+(on?' on':'');b.textContent=ch;const long=[...ch].length>1;b.style.fontSize=long?'.85rem':'1.3rem';b.style.width=long?'auto':'50px';b.style.padding=long?'0 12px':'0';b.addEventListener('click',()=>{selectTrace(ch);document.querySelectorAll('#traceChips .chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');});return b;}
function buildTraceChips(mode){traceChips.innerHTML='';let list=mode==='자음'?CONS.map(c=>c.ch):(mode==='모음'?VOWS.map(v=>v.ch):(mode==='받침'?BATCHIM_SYLL:TRACE_WORDS));list.forEach((ch,i)=>traceChips.appendChild(makeTraceChip(ch,i===0)));selectTrace(list[0],true);}
function loadCustomTrace(list){document.querySelectorAll('#traceModes button').forEach(x=>x.classList.remove('on'));traceChips.innerHTML='';list.forEach((ch,i)=>traceChips.appendChild(makeTraceChip(ch,i===0)));selectTrace(list[0],true);}

function initMiniTrace(){
  // 그리기는 mtBuild가 만든 각 셀(mtAttachDraw)에서 처리 — 여기선 공용 버튼만 배선.
  document.getElementById('mtClear').addEventListener('click',mtClearCanvas);
  const mtStrokeBtn=document.getElementById('mtStroke');
  mtStrokeBtn.addEventListener('click',()=>{mtStrokeOn=!mtStrokeOn;mtStrokeBtn.classList.toggle('off',!mtStrokeOn);mtRenderStrokes();});
  window.addEventListener('resize',()=>{if(document.getElementById('letterDetail').classList.contains('active'))mtSize();});
}
function initTraceWriting(){
  canvas.addEventListener('pointerdown',e=>{drawing=true;const p=tpos(e);lx=p.x;ly=p.y;try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
  canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=tpos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;});
  canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
  window.addEventListener('resize',()=>{if(document.getElementById('trace').classList.contains('active')){if(traceWordMode)traceCellsSize();else sizeTrace();}});
  const traceModes=document.getElementById('traceModes');
  ['자음','모음','받침','단어'].forEach((mo,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=mo;b.addEventListener('click',()=>{document.querySelectorAll('#traceModes button').forEach(x=>x.classList.remove('on'));b.classList.add('on');buildTraceChips(mo);});traceModes.appendChild(b);});
  buildTraceChips('자음');
  document.getElementById('traceClear').addEventListener('click',()=>{if(traceWordMode)traceCellsClear();else clearTrace();});
  document.getElementById('traceSound').addEventListener('click',()=>sayTrace(traceChar));
  const strokeBtn=document.getElementById('traceStrokeBtn');
  strokeBtn.addEventListener('click',()=>{strokeOn=!strokeOn;strokeBtn.classList.toggle('off',!strokeOn);if(traceWordMode)traceCellsRenderStrokes();else renderStrokes(traceChar);});
}
function initWritingScreens(){
  initMiniTrace();
  initTraceWriting();
  // Jua 로드 전에 계측하면 대체 폰트 기준이라 어긋난다 — 로드 완료 후 한 번 다시 그림.
  try{if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){mtRenderStrokes();if(traceWordMode)traceCellsRenderStrokes();else renderStrokes(traceChar);});}catch(e){}
}
