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
function openLetterDetail(it){curLetter=it;markLetterSeen(it.ch);if(typeof todayLetter!=='undefined'&&todayLetter&&it.ch===todayLetter.ch)completeMission('letter');const isVow=lettersTab==='vow';const isFinal=!!it.final;letterDetail.classList.toggle('vow',isVow);ldGlyph.innerHTML=jamoCharSVG(it.ch,isVow);ldName.textContent=isFinal?('끝소리 '+it.ch+' · 받침'):(isVow?('소리: '+it.sound):it.name);ldWords.innerHTML='';var ldList=isFinal?((it.words&&it.words.length?it.words:((typeof FINAL_WORDS!=='undefined'&&FINAL_WORDS[it.ch])||[]))):(LETTER_WORDS[it.ch]||[]);ldList.forEach(w=>{const b=document.createElement('button');b.className='ld-word';b.innerHTML='<span class="em">'+w[1]+'</span>'+w[0]+'<span class="spk">🔊✏️</span>';b.addEventListener('click',()=>studyWord(w[0],w[1]));ldWords.appendChild(b);});twemojify(ldWords);mtSelect(it.ch);lfWord=it.ch;var lwn=document.getElementById('lfWordNow');if(lwn)lwn.textContent=it.ch;var lch=document.getElementById('lfChips');if(lch)lch.innerHTML='';go('letterDetail');}
// #ldSound / #ldBack 클릭 리스너는 initLearningScreens()에서 한 번만 등록(중복 등록 시 소리 메아리/이중 재생).
(function(){var h=document.getElementById('lfHear');if(h)h.addEventListener('click',()=>{if(lfWord)speak(lfWord);else if(curLetter)sayJamo(curLetter.ch);});})();

/* 단어 공부 + 분해 + 합쳐보기 */
const wordCats=document.getElementById('wordCats'),wordGrid=document.getElementById('wordGrid');
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
/* 합쳐보기 제거: 글자별 자음·모음·받침 보기로 대체됨 */
/* 단어 동산: 전체 화면에서 자음·모음 카드로 단어 조립 (팝업 대신 넓게) */
var wbWord='',wbEmoji='',wbExpected=[],wbPos=0;
function openWordBuild(word,emoji){
  wbWord=word;wbEmoji=emoji;curWord=word;markWordSeen(word);
  var groups=decompose(word);wbExpected=[];
  document.getElementById('wbPic').textContent=emoji;
  var wn=document.getElementById('wbWord');if(wn)wn.textContent=word;
  var tgt=document.getElementById('wbTarget');tgt.innerHTML='';
  groups.forEach(function(g,si){var blk=document.createElement('div');blk.className='wb-syl';var head=document.createElement('div');head.className='wb-syl-head';head.textContent=g.join(' + ');head.setAttribute('data-syl',word[si]||'');blk.appendChild(head);g.forEach(function(j){wbExpected.push(j);var s=document.createElement('div');s.className='wb-slot';blk.appendChild(s);});tgt.appendChild(blk);});
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
      document.querySelectorAll('#wbTarget .wb-syl-head').forEach(function(h){h.classList.add('done');var syl=h.getAttribute('data-syl');if(syl&&h.textContent.indexOf('=')<0)h.textContent=h.textContent+' = '+syl;});
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
  var wbB=document.getElementById('wbBack');if(wbB)wbB.addEventListener('click',()=>go('home'));
  var wbH=document.getElementById('wbHear');if(wbH)wbH.addEventListener('click',()=>speak(wbWord));
  var wbE=document.getElementById('wbExplain');if(wbE)wbE.addEventListener('click',()=>explainWord(wbWord));
  var wbR=document.getElementById('wbReset');if(wbR)wbR.addEventListener('click',()=>{if(wbWord)openWordBuild(wbWord,wbEmoji);});
  var wbW=document.getElementById('wbWrite');if(wbW)wbW.addEventListener('click',()=>{if(typeof loadCustomTrace==='function'&&wbWord)loadCustomTrace([...wbWord]);if(typeof go==='function')go('trace');});
}

/* ===== 글자 공방 (3막 combine): 자음+모음을 끌어다 음절을 합치기 =====
   wordBuild 드래그 기계장치를 재사용. 목표 음절은 흐리게 힌트만, 소리·그림 우선, 관대한 판정. */
var cbCh='',cbWord='',cbEmoji='',cbExpected=[],cbPos=0;
function openCombine(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  if(!ep||ep.type!=='combine')return;
  var lo=(typeof curLetterObj==='function')?curLetterObj():null;
  cbCh=ep.ch;
  cbWord=(lo&&lo.word)||ep.word||'';
  cbEmoji=(lo&&lo.emoji)||ep.emoji||'';
  cbExpected=(lo&&lo.jamo&&lo.jamo.length)?lo.jamo.slice():((decompose(cbCh)[0])||[]);
  cbPos=0;
  var goal=document.getElementById('cbGoal');if(goal)goal.textContent=cbCh;
  var pic=document.getElementById('cbPic');if(pic){pic.textContent=cbEmoji;pic.style.display=cbEmoji?'':'none';}
  var wn=document.getElementById('cbWord');if(wn){wn.textContent=cbWord;wn.style.display=cbWord?'':'none';}
  var tgt=document.getElementById('cbTarget');tgt.innerHTML='';
  var blk=document.createElement('div');blk.className='wb-syl cb-syl';
  var head=document.createElement('div');head.className='wb-syl-head';head.textContent=cbExpected.join(' + ');head.setAttribute('data-syl',cbCh);blk.appendChild(head);
  cbExpected.forEach(function(){var s=document.createElement('div');s.className='wb-slot';blk.appendChild(s);});
  tgt.appendChild(blk);
  // 방해 카드: 이미 익힌 자모에서 1~2장(없으면 기본 자모로 폴백)
  var need=cbExpected.slice();var distract=[];
  var pool=(typeof masteredLetters==='function'?masteredLetters():[]).filter(function(c){return CHO.indexOf(c)>=0||JUNG.indexOf(c)>=0;});
  if(pool.length<3)pool=CHO.slice(0,9).concat(JUNG.slice(0,6));
  var tries=0;while(distract.length<2&&tries<200){tries++;var r=pool[Math.floor(Math.random()*pool.length)];if(need.indexOf(r)<0&&distract.indexOf(r)<0)distract.push(r);}
  var trayEl=document.getElementById('cbTray');trayEl.innerHTML='';
  shuffle(need.concat(distract)).forEach(function(j){var b=document.createElement('button');b.className='wb-card jchip jrole-'+(CHO.indexOf(j)>=0?'c':'v');b.textContent=j;b.addEventListener('pointerdown',function(e){cbDragStart(e,b,j);});trayEl.appendChild(b);});
  var fb=document.getElementById('cbFeedback');if(fb)fb.textContent=(cbExpected[0]||'')+'부터 끌어다 놓아요 👈';
  go('combine');
  setTimeout(combinePrompt,450);
}
// 합치기 전 안내: "ㄱ하고 ㅏ를 합쳐서 가를 만들어요"
function combinePrompt(){
  try{var seq=[];cbExpected.forEach(function(j,i){seq.push(jamoSay(j));if(i<cbExpected.length-1)seq.push('하고');});
    seq.push('합쳐서');seq.push(cbCh);seq.push('를 만들어요');
    if(typeof speakSeq==='function')speakSeq(seq);else if(typeof speak==='function')speak(cbCh);}catch(e){}
}
// 완성 순간 규칙 가르치기: "ㄱ에 ㅏ를 더하면 가!"
function combineTeach(){
  try{var seq=[];
    if(cbExpected.length>=2){
      seq.push(jamoSay(cbExpected[0]));seq.push('에');seq.push(jamoSay(cbExpected[1]));seq.push('를 더하면');
      if(cbExpected.length>=3){seq.push(String.fromCharCode(0xAC00+CHO.indexOf(cbExpected[0])*588+JUNG.indexOf(cbExpected[1])*28));seq.push(jamoSay(cbExpected[2]));seq.push('받침을 더하면');}
      seq.push(cbCh);
    }else seq.push(cbCh);
    if(typeof speakSeq==='function')setTimeout(function(){speakSeq(seq);},500);
  }catch(e){}
}
function cbTap(btn,j){
  if(cbPos>=cbExpected.length)return;
  if(j===cbExpected[cbPos]){
    sfxCorrect();var slot=document.querySelectorAll('#cbTarget .wb-slot')[cbPos];
    if(slot){slot.textContent=j;slot.classList.add('filled');slot.classList.remove('pop');void slot.offsetWidth;slot.classList.add('pop');wbMiniPraise(slot);}
    btn.disabled=true;btn.classList.add('used');sayJamo(j);cbPos++;
    if(cbPos>=cbExpected.length){
      var head=document.querySelector('#cbTarget .wb-syl-head');if(head){head.classList.add('done');if(head.textContent.indexOf('=')<0)head.textContent=head.textContent+' = '+cbCh;}
      var fb=document.getElementById('cbFeedback');if(fb)fb.textContent='완성! '+cbCh+' 🎉';
      confetti();earnSticker();wbBigCorrect(cbCh);combineTeach();
      setTimeout(function(){if(typeof completeCombine==='function')completeCombine();},1300);
    }
  }else{sfxWrong();btn.classList.add('bad');setTimeout(function(){btn.classList.remove('bad');},400);}
}
// 글자 공방 드래그: wbDragStart를 그대로 본떠 cbTarget/cbTap에 연결.
function cbDragStart(e,btn,j){
  if(btn.disabled||btn.classList.contains('used'))return;
  try{e.preventDefault();}catch(_){}
  var sx=e.clientX,sy=e.clientY,moved=false,ghost=null;
  var tgt=document.getElementById('cbTarget');
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
    if(!moved){cbTap(btn,j);return;}
    if(wbOverTarget(ev,tgt))cbTap(btn,j);
  }
  document.addEventListener('pointermove',mv);
  document.addEventListener('pointerup',up);
  document.addEventListener('pointercancel',up);
}
function initCombine(){
  var b=document.getElementById('cbBack');if(b)b.addEventListener('click',function(){go('home');});
  var h=document.getElementById('cbHear');if(h)h.addEventListener('click',combinePrompt);
  var r=document.getElementById('cbReset');if(r)r.addEventListener('click',openCombine);
}

/* ===== 이야기 책 (8막 sentence·졸업): 문장을 스스로 읽기 =====
   읽기 우선 화면 — 문장은 보여주는 게 맞다(원칙7 "정답 숨기기"는 듣기게임용, 읽기는 아님).
   단어 칩을 누르면 그 단어 소리, "하니가 읽어줄게"는 단어별 하이라이트로 전체 읽기,
   "읽었어요!"는 아이가 스스로 신고 → 관대한 판정으로 완료(졸업 축하). */
var stSent='',stWords=[],stCues=[];
function openStory(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  if(!ep||ep.type!=='sentence')return;
  var lo=(typeof curLetterObj==='function')?curLetterObj():null;
  stSent=ep.sent||(lo&&lo.sent)||'';
  stWords=(ep.words&&ep.words.length)?ep.words.slice():((lo&&lo.words&&lo.words.length)?lo.words.slice():stSent.split(' '));
  stCues=(ep.cues&&ep.cues.length)?ep.cues.slice():((lo&&lo.cues&&lo.cues.length)?lo.cues.slice():(typeof sentCues==='function'?sentCues(stWords):[]));
  var box=document.getElementById('stSentence');if(box){box.innerHTML='';
    stWords.forEach(function(w,i){
      var chip=document.createElement('button');chip.className='st-word';chip.setAttribute('data-i',i);
      var cue=stCues[i]||'';
      chip.innerHTML=(cue?'<span class="st-cue">'+cue+'</span>':'<span class="st-cue st-cue-empty">·</span>')+'<span class="st-text">'+w+'</span>';
      chip.addEventListener('click',function(){stTapWord(i);});
      box.appendChild(chip);
    });
    if(typeof twemojify==='function')twemojify(box);
  }
  var fb=document.getElementById('stFeedback');if(fb)fb.textContent='손가락으로 짚으며 읽어볼까요? 모르는 단어는 눌러요 👆';
  go('story');
}
// 단어 칩 탭: 그 단어 소리 + 부드러운 하이라이트(단어별 도움).
function stTapWord(i){
  var w=stWords[i];if(!w)return;
  var chips=document.querySelectorAll('#stSentence .st-word');
  if(chips[i]){chips[i].classList.remove('st-lit');void chips[i].offsetWidth;chips[i].classList.add('st-lit');}
  if(typeof speak==='function')speak(w);
}
// 하니가 전체 문장을 단어별 하이라이트로 읽어줌(도움 버튼).
function stReadAll(){
  if(!stWords.length)return;
  var chips=document.querySelectorAll('#stSentence .st-word');
  var i=0;
  (function nx(){
    if(i>=stWords.length){chips.forEach(function(c){c.classList.remove('st-lit');});return;}
    chips.forEach(function(c){c.classList.remove('st-lit');});
    if(chips[i])chips[i].classList.add('st-lit');
    var w=stWords[i++];
    if(typeof speakOne==='function')speakOne(w,nx);
    else if(typeof speak==='function'){speak(w);setTimeout(nx,750);}
  })();
}
// "읽었어요!" — 아이가 스스로 읽었다고 신고. 관대한 판정(정답 검사 없음) → 졸업 축하.
function stDoneReading(){
  var fb=document.getElementById('stFeedback');if(fb)fb.textContent='스스로 읽었어요! 🎉';
  document.querySelectorAll('#stSentence .st-word').forEach(function(c){c.classList.add('st-lit');});
  if(typeof confetti==='function')confetti();
  if(typeof earnSticker==='function')earnSticker();
  if(typeof wbBigCorrect==='function')wbBigCorrect('🎓');
  setTimeout(function(){if(typeof completeStory==='function')completeStory();},900);
}
function initStory(){
  var b=document.getElementById('stBack');if(b)b.addEventListener('click',function(){go('home');});
  var r=document.getElementById('stReadAll');if(r)r.addEventListener('click',stReadAll);
  var d=document.getElementById('stDone');if(d)d.addEventListener('click',stDoneReading);
}

/* ===== 글자 찾기 (LETTER 4단계 find): 여러 글자 카드 속에서 오늘의 글자 찾기 =====
   소리 동굴(듣고 찾기)의 시각판 — 그림·소리로 목표를 주고(정답 글자도 참고로 보여줌: 재인 게임이라 숨기지 않음),
   같은 종류(자음/모음)의 방해 카드, 관대한 판정(오답 감점 없음), 차등 피드백(하나씩 작게 / 다 찾으면 크게). */
var fdCh='',fdSay='',fdTargetCount=1,fdFound=0,fdLock=false;
// 글자 종류: 모음(v)/자음(c). CHO/JUNG 멤버십으로 판정(쌍자음·복합모음 포함).
function fdKind(ch){if(typeof JUNG!=='undefined'&&JUNG.indexOf(ch)>=0)return 'v';if(typeof CHO!=='undefined'&&CHO.indexOf(ch)>=0)return 'c';return '';}
function fdSayText(){return fdSay||fdCh;}
function openFind(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  // 글자(letter) 막 전용 — 합치기/문장 막은 이 게임을 쓰지 않음.
  if(ep&&(ep.type==='combine'||ep.type==='sentence')){go('home');return;}
  var lo=(typeof curLetterObj==='function')?curLetterObj():null;
  if((!lo||!lo.ch)&&typeof todayLetter!=='undefined')lo=todayLetter;
  if(!lo||!lo.ch){go('home');return;}
  fdCh=lo.ch;
  fdSay=lo.sound||lo.name||fdCh;
  fdLock=false;fdFound=0;
  var kind=fdKind(fdCh);
  var GRID=6;
  fdTargetCount=(Math.random()<0.4)?2:1;   // 오늘 글자가 1~2장 등장
  // 방해 카드 풀: 같은 종류의 이미 익힌 글자 우선 → 모자라면 기본 자모(자음 CONS / 모음 VOWS)로 보충.
  var mastered=(typeof masteredLetters==='function'?masteredLetters():[]).filter(function(c){return c!==fdCh&&fdKind(c)===kind;});
  var base=(kind==='v')?VOWS.map(function(v){return v.ch;}):CONS.map(function(c){return c.ch;});
  var pool=[];shuffle(mastered).forEach(function(c){if(pool.indexOf(c)<0)pool.push(c);});
  shuffle(base).forEach(function(c){if(c!==fdCh&&pool.indexOf(c)<0)pool.push(c);});
  var distract=pool.slice(0,Math.max(1,GRID-fdTargetCount));
  var cards=[];for(var t=0;t<fdTargetCount;t++)cards.push(fdCh);
  cards=shuffle(cards.concat(distract));
  var grid=document.getElementById('fdGrid');if(grid)grid.innerHTML='';
  cards.forEach(function(ch){
    var b=document.createElement('button');b.className='lopt lopt-jamo jrole-'+(fdKind(ch)||'c');
    b.innerHTML='<div class="lglyph">'+ch+'</div>';
    b.addEventListener('click',function(){fdTap(b,ch);});
    if(grid)grid.appendChild(b);
  });
  if(grid&&typeof twemojify==='function')twemojify(grid);
  var cue=document.getElementById('fdCue');if(cue)cue.textContent=fdCh;
  var q=document.getElementById('fdQ');if(q)q.textContent=fdCh+' 글자를 모두 찾아요!';
  var fb=document.getElementById('fdFeedback');if(fb)fb.textContent='그림처럼 생긴 글자를 콕 눌러요 👆';
  renderFindProgress();
  go('find');
  setTimeout(function(){if(typeof speak==='function')speak(fdSayText());},350);
}
// 진행 표시: 찾을 개수만큼 돋보기 칸이 하나씩 켜짐
function renderFindProgress(){
  var p=document.getElementById('fdProgress');if(!p)return;
  var h='';for(var i=0;i<fdTargetCount;i++){h+='<span class="lc-bell'+(i<fdFound?' on':'')+'">🔎</span>';}
  p.innerHTML=h;if(typeof twemojify==='function')twemojify(p);
}
// 하나 찾음(작게)
function fdMini(btn,text){
  var s=document.createElement('span');s.className='lc-mini';s.textContent=text;
  btn.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},900);
}
// 모두 찾음(크게)
function fdBigOpen(){
  var sec=document.getElementById('find');if(!sec)return;
  var o=document.createElement('div');o.className='lc-big';
  o.innerHTML='<div class="lc-big-inner"><div class="lc-big-emoji">🔎🎉</div><div class="lc-big-label">'+fdCh+' 글자를 다 찾았어요!</div></div>';
  sec.appendChild(o);if(typeof twemojify==='function')twemojify(o);
  setTimeout(function(){o.classList.add('show');},10);
  setTimeout(function(){o.classList.remove('show');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},420);},1800);
}
function fdTap(btn,ch){
  if(fdLock)return;
  if(btn.classList.contains('good'))return;   // 이미 찾은 카드
  if(ch===fdCh){
    if(typeof sfxCorrect==='function')sfxCorrect();
    btn.classList.add('good','pop');btn.disabled=true;
    if(typeof speak==='function')speak(fdSayText());
    fdFound++;renderFindProgress();
    if(fdFound>=fdTargetCount){
      fdLock=true;
      var fb=document.getElementById('fdFeedback');if(fb)fb.textContent='';
      if(typeof confetti==='function')confetti();
      if(typeof earnSticker==='function')earnSticker();
      fdBigOpen();
      if(typeof completeMission==='function')completeMission('find');
      setTimeout(function(){if(typeof go==='function')go('home');},1900);
    }else{
      fdMini(btn,'찾았다!');
      var fb2=document.getElementById('fdFeedback');if(fb2)fb2.textContent='하나 더 있어요! 찾아봐요 👀';
    }
  }else{
    // 관대한 판정: 감점 없이 부드럽게 다시 시도(쉐이크 + 소리 힌트)
    if(typeof sfxWrong==='function')sfxWrong();
    btn.classList.add('bad');
    var fb3=document.getElementById('fdFeedback');if(fb3)fb3.textContent=fdCh+' 글자를 찾아봐요!';
    if(typeof speak==='function')speak(fdSayText());
    setTimeout(function(){btn.classList.remove('bad');},500);
  }
}
function initFind(){
  var b=document.getElementById('fdBack');if(b)b.addEventListener('click',function(){go('home');});
  var p=document.getElementById('fdPlay');if(p)p.addEventListener('click',function(){if(typeof speak==='function')speak(fdSayText());});
}

function initLearningScreens(){
  initLetterTabs();
  renderLetters();
  ldSound.addEventListener('click',()=>{if(curLetter)sayJamo(curLetter.ch);});
  document.getElementById('ldBack').addEventListener('click',()=>go('home'));
  initWordStudy();
  initCombine();
  initStory();
  initFind();
}
