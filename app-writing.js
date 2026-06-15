// Writing, tracing, syllable-building screens for 하니의 한글 모험.
// Loaded before the main inline app script; run initWritingScreens() after helpers exist.

/* 미니 따라쓰기 (상세 화면) */
const mtStage=document.getElementById('mtStage'),mtGuide=document.getElementById('mtGuide'),mtCanvas=document.getElementById('mtCanvas'),mtCtx=mtCanvas.getContext('2d'),mtSvg=document.getElementById('mtSvg');
let mtStrokeOn=true,mtChar='ㄱ',mtDrawing=false,mlx,mly;
function mtSize(){const r=mtStage.getBoundingClientRect();if(r.width===0)return;const dpr=window.devicePixelRatio||1;mtCanvas.width=r.width*dpr;mtCanvas.height=r.height*dpr;mtCtx.setTransform(dpr,0,0,dpr,0,0);mtCtx.lineCap='round';mtCtx.lineJoin='round';mtCtx.lineWidth=14;mtCtx.strokeStyle='#ff6fa5';}
function mtClearCanvas(){mtCtx.save();mtCtx.setTransform(1,0,0,1,0,0);mtCtx.clearRect(0,0,mtCanvas.width,mtCanvas.height);mtCtx.restore();}
function mtRenderStrokes(){mtSvg.innerHTML=(mtStrokeOn&&STROKES[mtChar])?strokeSVGMarkup(mtChar):'';}
function mtSelect(ch){mtChar=ch;mtGuide.textContent=ch;mtSize();mtClearCanvas();mtRenderStrokes();}
function mtpos(e){const r=mtCanvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}


/* 글자 만들기 (+ 받침 통합) */
let selInit=0,selMed=VOWS[0].med,selJong=0;
const slotC=document.getElementById('slotC'),slotV=document.getElementById('slotV'),slotF=document.getElementById('slotF'),resultEl=document.getElementById('result');
function renderBuilder(an){slotC.textContent=CHO[selInit];slotV.textContent=JUNG[selMed];slotF.textContent=selJong>0?JONG[selJong]:'·';resultEl.textContent=compose(selInit,selMed,selJong);if(an){resultEl.classList.remove('go');void resultEl.offsetWidth;resultEl.classList.add('go');}}
function saySyl(){speak(compose(selInit,selMed,selJong));}


/* 받침은 글자 만들기에 통합됨 */



/* 문장 쓰기: ② 문장 선택 + ③ 따라쓰기 */
let selSub=SUBJ[0],selObj=OBJ[0],selVerb=VERB[0],writeText='고양이가 우유를 먹어요';
const sentence=document.getElementById('sentence'),writeSentence=document.getElementById('writeSentence'),sentBoxes=document.getElementById('sentBoxes');
function composedText(){return selSub[0]+' '+selObj[0]+' '+selVerb[0];}

let penColor=CRAYONS[0][1];

let sentCells=[];
function attachCellDraw(rec){let drawing=false,lx,ly;function pos(e){const r=rec.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}rec.canvas.addEventListener('pointerdown',e=>{drawing=true;const p=pos(e);lx=p.x;ly=p.y;try{rec.canvas.setPointerCapture(e.pointerId);}catch(_){}});rec.canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=pos(e);rec.ctx.strokeStyle=penColor;rec.ctx.beginPath();rec.ctx.moveTo(lx,ly);rec.ctx.lineTo(p.x,p.y);rec.ctx.stroke();lx=p.x;ly=p.y;});rec.canvas.addEventListener('pointerup',()=>drawing=false);rec.canvas.addEventListener('pointercancel',()=>drawing=false);}
function buildSentBoxes(){sentBoxes.innerHTML='';sentCells=[];for(const ch of writeText){if(ch===' '){const g=document.createElement('div');g.className='sent-gap';sentBoxes.appendChild(g);continue;}const cell=document.createElement('div');cell.className='sent-cell';cell.innerHTML='<div class="cell-grid"></div><div class="cell-guide">'+ch+'</div>';const cv=document.createElement('canvas');cell.appendChild(cv);sentBoxes.appendChild(cell);const rec={canvas:cv,ctx:cv.getContext('2d')};sentCells.push(rec);attachCellDraw(rec);}}
function sizeCells(){const dpr=window.devicePixelRatio||1;sentCells.forEach(rec=>{const r=rec.canvas.getBoundingClientRect();if(r.width===0)return;rec.canvas.width=r.width*dpr;rec.canvas.height=r.height*dpr;rec.ctx.setTransform(dpr,0,0,dpr,0,0);rec.ctx.lineCap='round';rec.ctx.lineJoin='round';rec.ctx.lineWidth=10;});}
function clearCells(){sentCells.forEach(rec=>{rec.ctx.save();rec.ctx.setTransform(1,0,0,1,0,0);rec.ctx.clearRect(0,0,rec.canvas.width,rec.canvas.height);rec.ctx.restore();});}
function startWriting(){writeSentence.textContent=writeText;buildSentBoxes();go('sentWrite');}
function renderPreview(an){sentence.textContent=composedText();if(an){sentence.classList.remove('go');void sentence.offsetWidth;sentence.classList.add('go');}}
function buildSent(box,list,setFn){list.forEach((it,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.innerHTML='<span class="em">'+it[1]+'</span>'+it[0];b.addEventListener('click',()=>{setFn(it);box.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderPreview(true);speak(it[0]);});box.appendChild(b);});}


/* 따라쓰기 + 획순 */
const traceStage=document.getElementById('traceStage'),traceGuide=document.getElementById('traceGuide'),canvas=document.getElementById('traceCanvas'),ctx=canvas.getContext('2d'),strokeSvg=document.getElementById('traceStrokeSvg');
let strokeOn=false;
function sizeTrace(){const r=traceStage.getBoundingClientRect();if(r.width===0)return;const dpr=window.devicePixelRatio||1;canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=16;ctx.strokeStyle='#ff6fa5';}
function clearTrace(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();}
function strokeSVGMarkup(ch){if(!STROKES[ch])return '';let s='<defs><marker id="ah" markerWidth="5" markerHeight="5" refX="2.2" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#ff4f95"/></marker></defs>';STROKES[ch].forEach((st,idx)=>{let sx,sy;if(st.circle){const c=st.circle;s+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="none" stroke="#ff4f95" stroke-width="3.2"/>';sx=c[0];sy=c[1]-c[2];}else{const pts=st.map(p=>p.join(',')).join(' ');s+='<polyline points="'+pts+'" fill="none" stroke="#ff4f95" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)"/>';sx=st[0][0];sy=st[0][1];}s+='<circle cx="'+sx+'" cy="'+sy+'" r="7" fill="#ff4f95"/><text x="'+sx+'" y="'+(sy+3.2)+'" text-anchor="middle" font-size="9" fill="#fff" font-family="Jua">'+(idx+1)+'</text>';});return s;}
function renderStrokes(ch){strokeSvg.innerHTML=(strokeOn&&STROKES[ch])?strokeSVGMarkup(ch):'';}
let drawing=false,lx,ly;
function tpos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

let traceChar='ㄱ';
function sayTrace(ch){if([...ch].length>1){speak(ch);return;}const c=CONS.find(x=>x.ch===ch);const v=VOWS.find(x=>x.ch===ch);speak(c?c.name:(v?v.sound:ch));}
function fitGuide(){const h=traceStage.getBoundingClientRect().height||330;const n=[...traceChar].length;const frac=n>=3?0.33:(n===2?0.52:0.80);traceGuide.style.fontSize=Math.round(h*frac)+'px';}
function selectTrace(ch,silent){traceChar=ch;traceGuide.textContent=ch;fitGuide();clearTrace();renderStrokes(ch);if(!silent)sayTrace(ch);}
const traceChips=document.getElementById('traceChips');
function makeTraceChip(ch,on){const b=document.createElement('button');b.className='chip t'+(on?' on':'');b.textContent=ch;const long=[...ch].length>1;b.style.fontSize=long?'.85rem':'1.3rem';b.style.width=long?'auto':'50px';b.style.padding=long?'0 12px':'0';b.addEventListener('click',()=>{selectTrace(ch);document.querySelectorAll('#traceChips .chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');});return b;}
function buildTraceChips(mode){traceChips.innerHTML='';let list=mode==='자음'?CONS.map(c=>c.ch):(mode==='모음'?VOWS.map(v=>v.ch):(mode==='받침'?BATCHIM_SYLL:TRACE_WORDS));list.forEach((ch,i)=>traceChips.appendChild(makeTraceChip(ch,i===0)));selectTrace(list[0],true);}
function loadCustomTrace(list){document.querySelectorAll('#traceModes button').forEach(x=>x.classList.remove('on'));traceChips.innerHTML='';list.forEach((ch,i)=>traceChips.appendChild(makeTraceChip(ch,i===0)));selectTrace(list[0],true);}

function initMiniTrace(){
  mtCanvas.addEventListener('pointerdown',e=>{mtDrawing=true;const p=mtpos(e);mlx=p.x;mly=p.y;try{mtCanvas.setPointerCapture(e.pointerId);}catch(_){}});
  mtCanvas.addEventListener('pointermove',e=>{if(!mtDrawing)return;e.preventDefault();const p=mtpos(e);mtCtx.beginPath();mtCtx.moveTo(mlx,mly);mtCtx.lineTo(p.x,p.y);mtCtx.stroke();mlx=p.x;mly=p.y;});
  mtCanvas.addEventListener('pointerup',()=>mtDrawing=false);mtCanvas.addEventListener('pointercancel',()=>mtDrawing=false);
  document.getElementById('mtClear').addEventListener('click',mtClearCanvas);
  const mtStrokeBtn=document.getElementById('mtStroke');
  mtStrokeBtn.addEventListener('click',()=>{mtStrokeOn=!mtStrokeOn;mtStrokeBtn.classList.toggle('off',!mtStrokeOn);mtRenderStrokes();});
  window.addEventListener('resize',()=>{if(document.getElementById('letterDetail').classList.contains('active'))mtSize();});
}
function initSyllableBuilder(){
  const sylC=document.getElementById('sylC');
  CHO.forEach((ch,i)=>{const b=document.createElement('button');b.className='chip c'+(i===selInit?' on':'');b.textContent=ch;b.addEventListener('click',()=>{selInit=i;document.querySelectorAll('#sylC .chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderBuilder(true);saySyl();});sylC.appendChild(b);});
  const sylV=document.getElementById('sylV');
  VOWS.forEach(v=>{const b=document.createElement('button');b.className='chip v'+(v.med===selMed?' on':'');b.textContent=v.ch;b.addEventListener('click',()=>{selMed=v.med;document.querySelectorAll('#sylV .chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderBuilder(true);saySyl();});sylV.appendChild(b);});
  const sylF=document.getElementById('sylF');
  JONG.forEach((ch,i)=>{const b=document.createElement('button');b.className='chip f'+(i===selJong?' on':'');b.textContent=i===0?'·':ch;b.addEventListener('click',()=>{selJong=i;document.querySelectorAll('#sylF .chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderBuilder(true);saySyl();});sylF.appendChild(b);});
  document.getElementById('sylPlay').addEventListener('click',()=>{renderBuilder(true);saySyl();});
  renderBuilder(false);
}
function initSentenceWriting(){
  const sentPresets=document.getElementById('sentPresets');
  PRESET_SENTS.forEach(s=>{const b=document.createElement('button');b.className='preset-sent';b.textContent=s;b.addEventListener('click',()=>{writeText=s;startWriting();});sentPresets.appendChild(b);});
  const crayonsBox=document.getElementById('crayons');
  CRAYONS.forEach((c,i)=>{const b=document.createElement('button');b.className='crayon'+(i===0?' on':'');b.style.background=c[1];b.setAttribute('aria-label',c[0]);b.addEventListener('click',()=>{penColor=c[1];document.querySelectorAll('#crayons .crayon').forEach(x=>x.classList.remove('on'));b.classList.add('on');});crayonsBox.appendChild(b);});
  buildSent(document.getElementById('sSub'),SUBJ,it=>selSub=it);
  buildSent(document.getElementById('sObj'),OBJ,it=>selObj=it);
  buildSent(document.getElementById('sVerb'),VERB,it=>selVerb=it);
  document.getElementById('sentPreview').addEventListener('click',()=>speakSeq(composedText().split(' ')));
  document.getElementById('sentToWrite').addEventListener('click',()=>{writeText=composedText();startWriting();});
  document.getElementById('sentBack').addEventListener('click',()=>go('sent'));
  document.getElementById('sentPlay').addEventListener('click',()=>speakSeq(writeText.split(' ')));
  document.getElementById('sentClear').addEventListener('click',clearCells);
  document.getElementById('sentDone').addEventListener('click',()=>{speakSeq(writeText.split(' '));confetti();earnSticker();});
  window.addEventListener('resize',()=>{if(document.getElementById('sentWrite').classList.contains('active'))sizeCells();});
  renderPreview(false);
}
function initTraceWriting(){
  canvas.addEventListener('pointerdown',e=>{drawing=true;const p=tpos(e);lx=p.x;ly=p.y;try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
  canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=tpos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(p.x,p.y);ctx.stroke();lx=p.x;ly=p.y;});
  canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
  window.addEventListener('resize',()=>{if(document.getElementById('trace').classList.contains('active'))sizeTrace();});
  const traceModes=document.getElementById('traceModes');
  ['자음','모음','받침','단어'].forEach((mo,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=mo;b.addEventListener('click',()=>{document.querySelectorAll('#traceModes button').forEach(x=>x.classList.remove('on'));b.classList.add('on');buildTraceChips(mo);});traceModes.appendChild(b);});
  buildTraceChips('자음');
  document.getElementById('traceClear').addEventListener('click',clearTrace);
  document.getElementById('traceSound').addEventListener('click',()=>sayTrace(traceChar));
  const strokeBtn=document.getElementById('traceStrokeBtn');
  strokeBtn.addEventListener('click',()=>{strokeOn=!strokeOn;strokeBtn.classList.toggle('off',!strokeOn);renderStrokes(traceChar);});
}
function initWritingScreens(){
  initMiniTrace();
  initSyllableBuilder();
  initSentenceWriting();
  initTraceWriting();
}
