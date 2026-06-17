// Matching and sound-quiz games for 하니의 한글 모험.
// Loaded before the main inline app script; run initGameScreens() after helpers exist.

/* 짝 맞추기 (글자 / 단어) */
const board=document.getElementById('board'),mscore=document.getElementById('mscore'),mfeedback=document.getElementById('mfeedback');
let PAIRS=6,matchMode='letter',matchBuilt=false,open=[],matched=0,lock=false;
function newMatch(){matchBuilt=true;matched=0;open=[];lock=false;mfeedback.textContent='';mscore.textContent='짝 0 / '+PAIRS;let deck=[];if(matchMode==='letter'){const pri=themeLetterChs();const allL=shuffle(CONS.map(c=>c.ch).concat(VOWS.map(v=>v.ch)));const sn={};const pool=[];pri.concat(allL).forEach(ch=>{if(!sn[ch]){sn[ch]=1;pool.push(ch);}});pool.slice(0,PAIRS).forEach(ch=>{deck.push({id:ch,face:ch,kind:'l'});deck.push({id:ch,face:ch,kind:'l'});});}else{const pri=themeWordList();const all=[];Object.values(WORDS).forEach(arr=>arr.forEach(w=>all.push(w)));const sn={};const pool=[];pri.concat(shuffle(all)).forEach(w=>{if(!sn[w[0]]){sn[w[0]]=1;pool.push(w);}});pool.slice(0,PAIRS).forEach(w=>{deck.push({id:w[0],face:w[1],kind:'e'});deck.push({id:w[0],face:w[0],kind:'w'});});}deck=shuffle(deck);board.innerHTML='';deck.forEach(item=>{const card=document.createElement('button');card.className='mcard';card.dataset.id=item.id;const fs=item.kind==='w'?([...item.face].length>3?'.8rem':'1.05rem'):(item.kind==='e'?'2.4rem':'2.2rem');card.innerHTML='<div class="minner"><div class="mface mback">?</div><div class="mface mfront" style="font-size:'+fs+'">'+item.face+'</div></div>';card.addEventListener('click',()=>flip(card));board.appendChild(card);});twemojify(board);}
function flip(card){if(lock||card.classList.contains('flipped')||card.classList.contains('matched'))return;card.classList.add('flipped');open.push(card);if(matchMode==='letter')sayJamo(card.dataset.id);else speak(card.dataset.id);if(open.length===2){lock=true;if(open[0].dataset.id===open[1].dataset.id){setTimeout(()=>{sfxCorrect();open.forEach(c=>c.classList.add('matched'));open=[];matched++;mscore.textContent='짝 '+matched+' / '+PAIRS;lock=false;if(matched===PAIRS){mfeedback.textContent='모두 찾았어요! 🎉';confetti();earnSticker();}},450);}else{sfxWrong();setTimeout(()=>{open.forEach(c=>c.classList.remove('flipped'));open=[];lock=false;},850);}}}


/* 소리 퀴즈 (선 잇기) */
const LETTER_POOL=CONS.map(c=>({key:c.ch,say:c.name,show:c.ch})).concat(VOWS.map(v=>({key:v.ch,say:v.sound,show:v.ch})));
const WORD_POOL=[];Object.values(WORDS).forEach(arr=>arr.forEach(w=>WORD_POOL.push({key:w[0],say:w[0],show:w[0]})));
let quizMode='letter',quizPairs=4,qMatched=0,qDragging=false,qStart=null,qPairsList=[],qStartC=null,qStartMoved=false,quizBuilt=false;
const qBoard=document.getElementById('qBoard'),qLeft=document.getElementById('qLeft'),qRight=document.getElementById('qRight'),qLines=document.getElementById('qLines'),qscore=document.getElementById('qscore'),qfeedback=document.getElementById('qfeedback');
function qPool(){
  function letItem(ch){var o=ALL_LETTER_OBJS[ch];return{key:ch,say:(o&&(o.name||o.sound))||ch,show:ch};}
  function wordItem(w){return{key:w[0],say:w[0],show:w[0]};}
  function build(pri,all){var seen={},out=[];pri.forEach(function(o){if(!seen[o.key]){seen[o.key]=1;out.push(o);}});shuffle(all.slice()).forEach(function(o){if(!seen[o.key]){seen[o.key]=1;out.push(o);}});return out;}
  if(quizMode==='word')return build(themeWordList().map(wordItem),WORD_POOL);
  if(quizMode==='mix')return build(themeLetterChs().map(letItem).concat(themeWordList().map(wordItem)),LETTER_POOL.concat(WORD_POOL));
  return build(themeLetterChs().map(letItem),LETTER_POOL);
}
function nodeCenter(node){const b=qBoard.getBoundingClientRect(),r=node.getBoundingClientRect();return{x:r.left+r.width/2-b.left,y:r.top+r.height/2-b.top};}
function qLine(x1,y1,x2,y2,cls){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);l.setAttribute('class',cls);return l;}
function redrawLines(temp){qLines.innerHTML='';qPairsList.forEach(p=>{const a=nodeCenter(p.l),b=nodeCenter(p.r);qLines.appendChild(qLine(a.x,a.y,b.x,b.y,'qline done'));});if(temp)qLines.appendChild(qLine(temp.x1,temp.y1,temp.x2,temp.y2,'qline temp'));}
function qDown(e){const node=e.currentTarget;if(node.classList.contains('matched'))return;qDragging=true;qStart=node;qStartMoved=false;qStartC=nodeCenter(node);redrawLines({x1:qStartC.x,y1:qStartC.y,x2:qStartC.x,y2:qStartC.y});e.preventDefault();}
function qMakeNode(item,side){const b=document.createElement('button');b.className='qnode'+(side==='l'?' sound':'');b.dataset.side=side;b.dataset.key=item.key;b.textContent=side==='l'?'🔊':item.show;b._item=item;b.addEventListener('pointerdown',qDown);return b;}
function newQuiz(){qMatched=0;qPairsList=[];qfeedback.textContent='';qLines.innerHTML='';const items=qPool().slice(0,quizPairs);qscore.textContent='0 / '+items.length;qLeft.innerHTML='';qRight.innerHTML='';shuffle(items).forEach(it=>qLeft.appendChild(qMakeNode(it,'l')));shuffle(items).forEach(it=>qRight.appendChild(qMakeNode(it,'r')));twemojify(qBoard);}
function qPoint(e){const b=qBoard.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top};}
function qMove(e){if(!qDragging)return;const p=qPoint(e);if(Math.abs(p.x-qStartC.x)+Math.abs(p.y-qStartC.y)>8)qStartMoved=true;redrawLines({x1:qStartC.x,y1:qStartC.y,x2:p.x,y2:p.y});e.preventDefault();}
function qUp(e){if(!qDragging)return;qDragging=false;if(!qStartMoved){if(qStart)speak(qStart._item.say);redrawLines();qStart=null;return;}const el=document.elementFromPoint(e.clientX,e.clientY);const target=el?el.closest('.qnode'):null;if(target&&target!==qStart&&target.dataset.side!==qStart.dataset.side&&!target.classList.contains('matched')){if(target.dataset.key===qStart.dataset.key){const l=qStart.dataset.side==='l'?qStart:target,r=qStart.dataset.side==='r'?qStart:target;sfxCorrect();qStart.classList.add('matched');target.classList.add('matched');qPairsList.push({l:l,r:r});qMatched++;qscore.textContent=qMatched+' / '+qLeft.children.length;speak(qStart._item.say);if(qMatched===qLeft.children.length){qfeedback.textContent='다 이었어요! 🎉';confetti();earnSticker();}}else{sfxWrong();target.classList.add('bad');setTimeout(()=>target.classList.remove('bad'),400);}}redrawLines();qStart=null;}

function initMatchGame(){
  const matchModeBox=document.getElementById('matchMode');
  [['글자','letter'],['단어','word']].forEach((m,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=m[0];b.addEventListener('click',()=>{document.querySelectorAll('#matchMode button').forEach(x=>x.classList.remove('on'));b.classList.add('on');matchMode=m[1];newMatch();});matchModeBox.appendChild(b);});
  const matchDiff=document.getElementById('matchDiff');
  [['쉬움',4],['보통',6],['어려움',8]].forEach((d,i)=>{const b=document.createElement('button');if(i===1)b.className='on';b.textContent=d[0];b.addEventListener('click',()=>{document.querySelectorAll('#matchDiff button').forEach(x=>x.classList.remove('on'));b.classList.add('on');PAIRS=d[1];newMatch();});matchDiff.appendChild(b);});
  document.getElementById('matchNew').addEventListener('click',newMatch);
}
function initSoundQuizGame(){
  window.addEventListener('pointermove',qMove);
  window.addEventListener('pointerup',qUp);
  window.addEventListener('pointercancel',()=>{qDragging=false;redrawLines();});
  const quizModeBox=document.getElementById('quizMode');
  [['글자','letter'],['단어','word'],['섞기','mix']].forEach((m,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=m[0];b.addEventListener('click',()=>{quizMode=m[1];document.querySelectorAll('#quizMode button').forEach(x=>x.classList.remove('on'));b.classList.add('on');newQuiz();});quizModeBox.appendChild(b);});
  const quizDiffBox=document.getElementById('quizDiff');
  [['쉬움',3],['보통',4],['어려움',5]].forEach((d,i)=>{const b=document.createElement('button');if(i===1)b.className='on';b.textContent=d[0];b.addEventListener('click',()=>{quizPairs=d[1];document.querySelectorAll('#quizDiff button').forEach(x=>x.classList.remove('on'));b.classList.add('on');newQuiz();});quizDiffBox.appendChild(b);});
  document.getElementById('quizNew').addEventListener('click',newQuiz);
  window.addEventListener('resize',()=>{if(document.getElementById('quiz').classList.contains('active'))redrawLines();});
}
function initGameScreens(){
  initMatchGame();
  initSoundQuizGame();
}
