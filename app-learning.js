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
function openLetterDetail(it){curLetter=it;markLetterSeen(it.ch);if(typeof todayLetter!=='undefined'&&todayLetter&&it.ch===todayLetter.ch)completeMission('letter');const isVow=lettersTab==='vow';letterDetail.classList.toggle('vow',isVow);ldGlyph.textContent=it.ch;ldName.textContent=isVow?('소리: '+it.sound):it.name;ldWords.innerHTML='';(LETTER_WORDS[it.ch]||[]).forEach(w=>{const b=document.createElement('button');b.className='ld-word';b.innerHTML='<span class="em">'+w[1]+'</span>'+w[0]+'<span class="spk">🔊</span>';b.addEventListener('click',()=>speak(w[0]));ldWords.appendChild(b);});twemojify(ldWords);mtSelect(it.ch);go('letterDetail');}
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
function renderWords(cat){wordGrid.innerHTML='';WORDS[cat].forEach(w=>{const b=document.createElement('button');b.className='card';b.innerHTML='<span class="spk">🔍</span><div class="big">'+w[1]+'</div><div class="wd">'+w[0]+'</div>';b.addEventListener('click',()=>openWord(w[0],w[1]));wordGrid.appendChild(b);});twemojify(wordGrid);}
function initWordStudy(){Object.keys(WORDS).forEach((cat,i)=>{const b=document.createElement('button');if(i===0)b.className='on';b.textContent=cat;b.addEventListener('click',()=>{document.querySelectorAll('#wordCats button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderWords(cat);});wordCats.appendChild(b);});
  renderWords(Object.keys(WORDS)[0]);
  document.getElementById('mPlay').addEventListener('click',()=>speak(curWord));
  var mEx=document.getElementById('mExplain');if(mEx)mEx.addEventListener('click',()=>explainWord(curWord));
  var mWr=document.getElementById('mWrite');if(mWr)mWr.addEventListener('click',()=>{if(typeof loadCustomTrace==='function')loadCustomTrace([...curWord]);modal.classList.remove('show');if(typeof go==='function')go('trace');});
  document.getElementById('modalX').addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show');});
}

function initLearningScreens(){
  initLetterTabs();
  renderLetters();
  ldSound.addEventListener('click',()=>{if(curLetter)sayJamo(curLetter.ch);});
  document.getElementById('ldBack').addEventListener('click',()=>go('letters'));
  initWordStudy();
}
