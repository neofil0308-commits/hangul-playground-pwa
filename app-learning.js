// Letter and word learning screens for 하니의 한글 모험.
// Depends on app-data.js/app-state.js and UI/audio helpers from the main app script.

/* 글자 친구들 (자음/모음 통합) */
const lettersGrid=document.getElementById('lettersGrid');
let lettersTab='con';
function renderLetters(){lettersGrid.className='grid '+lettersTab;lettersGrid.innerHTML='';const list=lettersTab==='con'?CONS:VOWS;list.forEach(it=>{const b=document.createElement('button');b.className='card';const sub=lettersTab==='con'?it.name:it.sound;b.innerHTML='<span class="arrow">▶</span><div class="big">'+it.ch+'</div><span class="nm">'+sub+'</span>';b.addEventListener('click',()=>openLetterDetail(it));lettersGrid.appendChild(b);});twemojify(lettersGrid);}
const letterTabsBox=document.getElementById('letterTabs');
function initLetterTabs(){[['con','자음 친구들'],['vow','모음 친구들']].forEach((t,i)=>{const b=document.createElement('button');b.textContent=t[1];if(i===0)b.classList.add(t[0]+'-on');b.addEventListener('click',()=>{lettersTab=t[0];document.querySelectorAll('#letterTabs button').forEach(x=>x.classList.remove('con-on','vow-on'));b.classList.add(t[0]+'-on');renderLetters();});letterTabsBox.appendChild(b);});}

/* 상세 화면 */
const ldGlyph=document.getElementById('ldGlyph'),ldName=document.getElementById('ldName'),ldWords=document.getElementById('ldWords'),letterDetail=document.getElementById('letterDetail'),ldSound=document.getElementById('ldSound');
let curLetter=null;
// 글자 숲: 낱말을 눌러 듣고(위) 받아쓰기(아래) — 단어동산으로 넘어가지 않고 이 화면에서.
var lfWord='';
function studyWord(word,emoji){
  lfWord=word;
  var wn=document.getElementById('lfWordNow');if(wn)wn.textContent=word;
  var chips=document.getElementById('lfChips');
  if(chips){chips.innerHTML='';[...word].forEach(function(syl,i){var b=document.createElement('button');b.className='lf-chip'+(i===0?' on':'');b.textContent=syl;b.addEventListener('click',function(){document.querySelectorAll('#lfChips .lf-chip').forEach(function(x){x.classList.remove('on');});b.classList.add('on');mtSelect(syl);});chips.appendChild(b);});}
  if(word.length)mtSelect(word[0]);
  speak(word);
}
function openLetterDetail(it){curLetter=it;markLetterSeen(it.ch);if(typeof todayLetter!=='undefined'&&todayLetter&&it.ch===todayLetter.ch)completeMission('letter');const isVow=lettersTab==='vow';letterDetail.classList.toggle('vow',isVow);ldGlyph.textContent=it.ch;ldName.textContent=isVow?('소리: '+it.sound):it.name;ldWords.innerHTML='';(LETTER_WORDS[it.ch]||[]).forEach(w=>{const b=document.createElement('button');b.className='ld-word';b.innerHTML='<span class="em">'+w[1]+'</span>'+w[0]+'<span class="spk">🔊✏️</span>';b.addEventListener('click',()=>studyWord(w[0],w[1]));ldWords.appendChild(b);});twemojify(ldWords);mtSelect(it.ch);lfWord=it.ch;var lwn=document.getElementById('lfWordNow');if(lwn)lwn.textContent=it.ch;var lch=document.getElementById('lfChips');if(lch)lch.innerHTML='';go('letterDetail');}
ldSound.addEventListener('click',()=>{if(curLetter)sayJamo(curLetter.ch);});
(function(){var h=document.getElementById('lfHear');if(h)h.addEventListener('click',()=>{if(lfWord)speak(lfWord);else if(curLetter)sayJamo(curLetter.ch);});})();
document.getElementById('ldBack').addEventListener('click',()=>go('letters'));

/* 단어 공부 + 분해 + 합쳐보기 */
const wordCats=document.getElementById('wordCats'),wordGrid=document.getElementById('wordGrid');
const modal=document.getElementById('wordModal'),mEmoji=document.getElementById('mEmoji'),mWord=document.getElementById('mWord'),mSyls=document.getElementById('mSyls');
let curWord='';
// 자모 한 개의 읽는 이름/소리 (이응, 오 …)
function jamoSay(j){var c=CONS.find(function(x){return x.ch===j;});if(c)return c.name;var v=VOWS.find(function(x){return x.ch===j;});if(v)return v.sound;return j;}
// 풀어듣기(가르치는 설명): 단어별 통 신경망 MP3가 있으면 매끄럽게 재생, 없으면 조각 이어붙이기로 폴백.
var explainAudio=null;
function explainWord(word){
  try{
    var v=(typeof VOICE!=='undefined'&&VOICE)?VOICE:'f';
    var key=[...word].map(function(c){return c.codePointAt(0).toString(16);}).join('-');
    if(typeof stopAllVoice==='function')stopAllVoice();
    var a=new Audio();var fell=false;
    function fb(){if(fell)return;fell=true;explainWordStitch(word);}
    a.onerror=fb;
    try{a.volume=Math.max(0,Math.min(1,(typeof volVoice!=='undefined'?volVoice:1)));}catch(e){}
    a.src='audio/explain/'+v+'/'+key+'.mp3';
    explainAudio=a;
    var pr=a.play();if(pr&&pr.catch)pr.catch(fb);
  }catch(e){explainWordStitch(word);}
}
// 통 MP3가 없을 때: 자모·음절 조각을 가르치듯 이어 붙임("이응에 오를 더하면 오, … 오이")
function explainWordStitch(word){
  try{
    var seq=[];
    [...word].forEach(function(syl){
      var code=syl.charCodeAt(0)-0xAC00;
      if(code<0||code>11171){seq.push(syl);return;}
      var i=Math.floor(code/588),m=Math.floor((code%588)/28),f=code%28;
      seq.push(jamoSay(CHO[i]));seq.push('에');seq.push(jamoSay(JUNG[m]));seq.push('를 더하면');
      if(f>0){seq.push(String.fromCharCode(0xAC00+i*588+m*28));seq.push(jamoSay(JONG[f]));seq.push('받침을 더하면');}
      seq.push(syl);
    });
    seq.push(word);
    if(typeof speakSeq==='function')speakSeq(seq);else if(typeof speak==='function')speak(word);
  }catch(e){if(typeof speak==='function')speak(word);}
}
function openWord(word,emoji){mEmoji.textContent=emoji;markWordSeen(word);if(typeof todayWord!=='undefined'&&todayWord&&word===todayWord[0])completeMission('word');mWord.textContent=word;curWord=word;const groups=decompose(word);mSyls.innerHTML='';[...word].forEach((syl,si)=>{const g=groups[si]||[syl];const block=document.createElement('div');block.className='syl-block';const sb=document.createElement('button');sb.className='jchip jsyl';sb.textContent=syl;sb.addEventListener('click',()=>speak(syl));block.appendChild(sb);const eq=document.createElement('span');eq.className='jop';eq.textContent='=';block.appendChild(eq);g.forEach((j,ji)=>{if(ji>0){const p=document.createElement('span');p.className='jop';p.textContent='+';block.appendChild(p);}const role=ji===0?'c':(ji===1?'v':'f');const b=document.createElement('button');b.className='jchip jrole-'+role;b.textContent=j;b.addEventListener('click',()=>sayJamo(j));block.appendChild(b);});mSyls.appendChild(block);});twemojify(modal);modal.classList.add('show');setTimeout(function(){explainWord(word);},250);}
/* 합쳐보기 제거: 글자별 자음·모음·받침 보기로 대체됨 */
/* 단어 동산: 전체 화면에서 자음·모음 카드로 단어 조립 (팝업 대신 넓게) */
var wbWord='',wbEmoji='',wbExpected=[],wbPos=0;
function openWordBuild(word,emoji){
  wbWord=word;wbEmoji=emoji;curWord=word;markWordSeen(word);
  var groups=decompose(word);wbExpected=[];
  document.getElementById('wbPic').textContent=emoji;
  var wn=document.getElementById('wbWord');if(wn)wn.textContent=word;
  var tgt=document.getElementById('wbTarget');tgt.innerHTML='';
  groups.forEach(function(g,si){var blk=document.createElement('div');blk.className='wb-syl';var head=document.createElement('div');head.className='wb-syl-head';head.textContent=word[si]||'';blk.appendChild(head);g.forEach(function(j){wbExpected.push(j);var s=document.createElement('div');s.className='wb-slot';blk.appendChild(s);});tgt.appendChild(blk);});
  wbPos=0;
  var need=wbExpected.slice();var distract=[];var pool=CHO.concat(JUNG);var tries=0;
  var distractN=Math.min(7,Math.max(4,9-need.length)); // 총 8~10장
  while(distract.length<distractN&&tries<120){tries++;var r=pool[Math.floor(Math.random()*pool.length)];if(need.indexOf(r)<0&&distract.indexOf(r)<0)distract.push(r);}
  var trayEl=document.getElementById('wbTray');trayEl.innerHTML='';
  shuffle(need.concat(distract)).forEach(function(j){var b=document.createElement('button');b.className='wb-card jchip jrole-'+(CHO.indexOf(j)>=0?'c':'v');b.textContent=j;b.addEventListener('pointerdown',function(e){wbDragStart(e,b,j);});trayEl.appendChild(b);});
  document.getElementById('wbFeedback').textContent='카드를 왼쪽으로 끌어다 놓거나 눌러서 순서대로 만들어요';
  go('wordBuild');
  setTimeout(function(){speak(word);},450); // 열 때는 단어만 짧게(설명은 '풀어듣기' 버튼)
}
function wbTap(btn,j){
  if(wbPos>=wbExpected.length)return;
  if(j===wbExpected[wbPos]){
    sfxCorrect();var slot=document.querySelectorAll('#wbTarget .wb-slot')[wbPos];
    if(slot){slot.textContent=j;slot.classList.add('filled');slot.classList.remove('pop');void slot.offsetWidth;slot.classList.add('pop');wbMiniPraise(slot);}
    btn.disabled=true;btn.classList.add('used');sayJamo(j);wbPos++;
    if(wbPos>=wbExpected.length){
      document.querySelectorAll('#wbTarget .wb-syl-head').forEach(function(h){h.classList.add('done');});
      document.getElementById('wbFeedback').textContent='정답이에요! '+wbWord+' 🎉';
      confetti();earnSticker();wbBigCorrect(wbWord);
      if(typeof todayWord!=='undefined'&&todayWord&&wbWord===todayWord[0])completeMission('word');
      setTimeout(function(){explainWord(wbWord);},650);
    }
  }else{sfxWrong();btn.classList.add('bad');setTimeout(function(){btn.classList.remove('bad');},400);}
}
// 글자 하나 맞춤 → 작은 "맞아요!" / 단어 완성 → 큰 "정답이에요!"
function wbMiniPraise(slot){
  var s=document.createElement('span');s.className='wb-mini';s.textContent='맞아요!';
  slot.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},850);
}
function wbBigCorrect(word){
  var sec=document.getElementById('wordBuild');if(!sec)return;
  var o=document.createElement('div');o.className='wb-big-correct';
  o.innerHTML='<div class="wb-big-inner"><div class="wb-big-word">'+word+'</div><div class="wb-big-label">정답이에요! 🎉</div></div>';
  sec.appendChild(o);if(typeof twemojify==='function')twemojify(o);
  setTimeout(function(){o.classList.add('show');},10);
  setTimeout(function(){o.classList.remove('show');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},420);},1800);
}
// 단어동산: 오른쪽 카드를 왼쪽 조립판으로 끌어다 놓기(터치 포인터 드래그). 거의 안 움직이면 탭으로 처리.
function wbOverTarget(ev,tgt){var r=tgt.getBoundingClientRect();return ev.clientX>=r.left-14&&ev.clientX<=r.right+14&&ev.clientY>=r.top-14&&ev.clientY<=r.bottom+14;}
function wbDragStart(e,btn,j){
  if(btn.disabled||btn.classList.contains('used'))return;
  try{e.preventDefault();}catch(_){}
  var sx=e.clientX,sy=e.clientY,moved=false,ghost=null;
  var tgt=document.getElementById('wbTarget');
  function mv(ev){
    if(!moved&&(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy))>8){
      moved=true;ghost=btn.cloneNode(true);ghost.className=btn.className+' wb-ghost';
      ghost.style.position='fixed';ghost.style.pointerEvents='none';ghost.style.margin='0';ghost.style.zIndex='9999';ghost.style.transform='translate(-50%,-50%) scale(1.08)';
      document.body.appendChild(ghost);btn.classList.add('wb-dragging');
    }
    if(ghost){ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px';tgt.classList.toggle('wb-target-over',wbOverTarget(ev,tgt));}
  }
  function up(ev){
    document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
    tgt.classList.remove('wb-target-over');if(ghost)ghost.remove();btn.classList.remove('wb-dragging');
    if(!moved){wbTap(btn,j);return;}            // 거의 안 움직임 → 탭
    if(wbOverTarget(ev,tgt))wbTap(btn,j);         // 조립판에 떨어뜨림 → 순서 검증(wbTap 재사용)
  }
  document.addEventListener('pointermove',mv);
  document.addEventListener('pointerup',up);
  document.addEventListener('pointercancel',up);
}
function renderWords(cat){wordGrid.innerHTML='';WORDS[cat].forEach(w=>{const b=document.createElement('button');b.className='card';b.innerHTML='<span class="spk">🔍</span><div class="big">'+w[1]+'</div><div class="wd">'+w[0]+'</div>';b.addEventListener('click',()=>openWordBuild(w[0],w[1]));wordGrid.appendChild(b);});twemojify(wordGrid);}
function initWordStudy(){Object.keys(WORDS).forEach((cat,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=cat;b.addEventListener('click',()=>{document.querySelectorAll('#wordCats button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderWords(cat);});wordCats.appendChild(b);});
  renderWords(Object.keys(WORDS)[0]);
  document.getElementById('mPlay').addEventListener('click',()=>speak(curWord));
  var mEx=document.getElementById('mExplain');if(mEx)mEx.addEventListener('click',()=>explainWord(curWord));
  var mWr=document.getElementById('mWrite');if(mWr)mWr.addEventListener('click',()=>{if(typeof loadCustomTrace==='function')loadCustomTrace([...curWord]);modal.classList.remove('show');if(typeof go==='function')go('trace');});
  document.getElementById('modalX').addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');});
  var wbB=document.getElementById('wbBack');if(wbB)wbB.addEventListener('click',()=>go('word'));
  var wbH=document.getElementById('wbHear');if(wbH)wbH.addEventListener('click',()=>speak(wbWord));
  var wbE=document.getElementById('wbExplain');if(wbE)wbE.addEventListener('click',()=>explainWord(wbWord));
  var wbR=document.getElementById('wbReset');if(wbR)wbR.addEventListener('click',()=>{if(wbWord)openWordBuild(wbWord,wbEmoji);});
  var wbW=document.getElementById('wbWrite');if(wbW)wbW.addEventListener('click',()=>{if(typeof loadCustomTrace==='function'&&wbWord)loadCustomTrace([...wbWord]);if(typeof go==='function')go('trace');});
}

function initLearningScreens(){
  initLetterTabs();
  renderLetters();
  ldSound.addEventListener('click',()=>{if(curLetter)sayJamo(curLetter.ch);});
  document.getElementById('ldBack').addEventListener('click',()=>go('letters'));
  initWordStudy();
}
