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
function openLetterDetail(it){curLetter=it;markLetterSeen(it.ch);if(typeof todayLetter!=='undefined'&&todayLetter&&it.ch===todayLetter.ch)completeMission('letter');const isVow=lettersTab==='vow';letterDetail.classList.toggle('vow',isVow);ldGlyph.textContent=it.ch;ldName.textContent=isVow?('소리: '+it.sound):it.name;ldWords.innerHTML='';(LETTER_WORDS[it.ch]||[]).forEach(w=>{const b=document.createElement('button');b.className='ld-word';b.innerHTML='<span class="em">'+w[1]+'</span>'+w[0]+'<span class="spk">✏️</span>';b.addEventListener('click',()=>openWordBuild(w[0],w[1]));ldWords.appendChild(b);});twemojify(ldWords);mtSelect(it.ch);go('letterDetail');}
ldSound.addEventListener('click',()=>{if(curLetter)sayJamo(curLetter.ch);});
document.getElementById('ldBack').addEventListener('click',()=>go('letters'));

/* 단어 공부 + 분해 + 합쳐보기 */
const wordCats=document.getElementById('wordCats'),wordGrid=document.getElementById('wordGrid');
const modal=document.getElementById('wordModal'),mEmoji=document.getElementById('mEmoji'),mWord=document.getElementById('mWord'),mSyls=document.getElementById('mSyls');
let curWord='';
// 자모 한 개의 읽는 이름/소리 (이응, 오 …)
function jamoSay(j){var c=CONS.find(function(x){return x.ch===j;});if(c)return c.name;var v=VOWS.find(function(x){return x.ch===j;});if(v)return v.sound;return j;}
// 단어를 가르치듯 풀어서 설명: "이응에 오를 더하면 오, 이응에 이를 더하면 이, 오이"
// CVC는 "…를 더하면 가, [받침]받침을 더하면 강". 연결어/음절은 신경망 MP3로 자연스럽게 이어짐.
function explainWord(word){
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
  var tgt=document.getElementById('wbTarget');tgt.innerHTML='';
  groups.forEach(function(g,si){var blk=document.createElement('div');blk.className='wb-syl';var head=document.createElement('div');head.className='wb-syl-head';head.textContent=word[si]||'';blk.appendChild(head);g.forEach(function(j){wbExpected.push(j);var s=document.createElement('div');s.className='wb-slot';blk.appendChild(s);});tgt.appendChild(blk);});
  wbPos=0;
  var need=wbExpected.slice();var distract=[];var pool=CHO.concat(JUNG);var tries=0;
  while(distract.length<2&&tries<40){tries++;var r=pool[Math.floor(Math.random()*pool.length)];if(need.indexOf(r)<0&&distract.indexOf(r)<0)distract.push(r);}
  var trayEl=document.getElementById('wbTray');trayEl.innerHTML='';
  shuffle(need.concat(distract)).forEach(function(j){var b=document.createElement('button');b.className='wb-card jchip jrole-'+(CHO.indexOf(j)>=0?'c':'v');b.textContent=j;b.addEventListener('click',function(){wbTap(b,j);});trayEl.appendChild(b);});
  document.getElementById('wbFeedback').textContent='카드를 순서대로 눌러 단어를 만들어요';
  go('wordBuild');
  setTimeout(function(){explainWord(word);},450);
}
function wbTap(btn,j){
  if(wbPos>=wbExpected.length)return;
  if(j===wbExpected[wbPos]){
    sfxCorrect();var slot=document.querySelectorAll('#wbTarget .wb-slot')[wbPos];if(slot){slot.textContent=j;slot.classList.add('filled');}
    btn.disabled=true;btn.classList.add('used');sayJamo(j);wbPos++;
    if(wbPos>=wbExpected.length){
      document.querySelectorAll('#wbTarget .wb-syl-head').forEach(function(h){h.classList.add('done');});
      document.getElementById('wbFeedback').textContent='완성! '+wbWord+' 🎉';
      confetti();earnSticker();
      if(typeof todayWord!=='undefined'&&todayWord&&wbWord===todayWord[0])completeMission('word');
      setTimeout(function(){explainWord(wbWord);},500);
    }
  }else{sfxWrong();btn.classList.add('bad');setTimeout(function(){btn.classList.remove('bad');},400);}
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
