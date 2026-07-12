// 듣고 찾기 — '오늘의 글자가 들어간 단어 찾기'(글자를 단어 속에서 인식). 오답 시 잠깐 반복학습.
// Depends on app-data.js, app-state.js, decompose() from the main inline script, and UI helpers.

var listenMode='word',listenN=3,listenScore=0,listenTarget=null,listenBuilt=false,LISTEN_LEN=5,listenLock=false,listenWrong=0;
var listenCh='',listenSay=''; // 이 라운드의 '드릴 대상' 낱자/소리 — 음절·문장 막에선 분해로 채운다.
function todayCh(){return (typeof todayLetter!=='undefined'&&todayLetter&&todayLetter.ch)||'';}
function todaySay(){return (typeof todayLetter!=='undefined'&&todayLetter&&(todayLetter.sound||todayLetter.name))||todayCh();}
function _isJamo(j){return (typeof CHO!=='undefined'&&CHO.indexOf(j)>=0)||(typeof JUNG!=='undefined'&&JUNG.indexOf(j)>=0);}
// 듣고 찾기의 대상 낱자: 이미 낱자면 그대로, 음절 막(3막)·문장 막(8막)이면 대표 음절을 분해해 초성(없으면 모음) 낱자를 뽑는다.
// → '바'(3막)는 'ㅂ'으로, '📖'/문장(8막)은 첫 글자의 초성으로. 낱자·색·소리가 문제와 일치.
function listenLetterTarget(){
  var lo=(typeof todayLetter!=='undefined')?todayLetter:null;
  var ch=lo&&lo.ch;
  if(ch&&_isJamo(ch))return {ch:ch,say:todaySay()};
  var syl='';
  if(lo&&lo.combine)syl=ch;                                   // 3막: ch가 음절
  else if(lo&&lo.sentence)syl=((lo.words&&lo.words[0])||'').charAt(0); // 8막: 첫 단어의 첫 글자
  else if(ch)syl=ch;
  var parts=(typeof decompose==='function'&&syl)?(decompose(syl)[0]||[]):[];
  var jamo=parts.filter(_isJamo);
  var pick=jamo[0]||ch||'';                                    // 초성 우선
  var obj=(typeof ALL_LETTER_OBJS!=='undefined'&&ALL_LETTER_OBJS[pick])||{ch:pick,sound:pick,name:pick};
  return {ch:pick,say:obj.sound||obj.name||pick};
}
function wordHasLetter(word,ch){if(!ch||typeof decompose!=='function')return false;var g=decompose(word);for(var i=0;i<g.length;i++){if(g[i].indexOf(ch)>=0)return true;}return false;}
// 후보 풀: letter 모드는 글자 목록, word 모드는 전체 단어쌍.
function listenPool(){
  if(listenMode==='letter')return (typeof ALL_LETTERS!=='undefined'?ALL_LETTERS:[]).map(function(x){return{glyph:x.ch,say:(x.name||x.sound)};});
  var seen={},out=[];ALL_WORDS.forEach(function(w){if(!seen[w[0]]){seen[w[0]]=1;out.push(w);}});
  if(typeof LETTER_WORDS!=='undefined')Object.keys(LETTER_WORDS).forEach(function(k){LETTER_WORDS[k].forEach(function(w){if(!seen[w[0]]){seen[w[0]]=1;out.push(w);}});});
  return out;
}
function wordsStartingWith(ch){return ((typeof LETTER_WORDS!=='undefined')&&LETTER_WORDS[ch])||[];}
// 단계 상승: 처음엔 글자(ㅓ) 찾기 → 2개 맞히면 'ㅓ로 시작하는 단어'(어묵·어항…) 찾기
function newListenQuestion(){
  listenLock=false;listenWrong=0;
  var tgt=listenLetterTarget();var ch=tgt.ch;listenCh=ch;listenSay=tgt.say; // 음절/문장 막이면 분해된 낱자
  var stage=(listenScore<2)?'letter':'word';
  listenMode=stage;
  var box=document.getElementById('listenOpts');if(box)box.innerHTML='';
  var fb=document.getElementById('lfeedback');if(fb)fb.textContent='';
  var ll=document.getElementById('listenLetter');if(ll)ll.textContent=(stage==='letter')?'?':ch; // 글자 찾기 단계엔 정답을 숨김(소리로만)
  renderListenProgress();
  if(stage==='letter'){
    var others=shuffle((typeof ALL_LETTERS!=='undefined'?ALL_LETTERS:[]).filter(function(x){return x.ch!==ch;})).slice(0,Math.max(1,listenN-1)).map(function(x){return{glyph:x.ch,say:x.name||x.sound};});
    var opts=shuffle([{glyph:ch,say:listenSay}].concat(others));
    listenTarget={glyph:ch,say:listenSay,isLetter:true};
    opts.forEach(function(o){var isV=(typeof JUNG!=='undefined'&&JUNG.indexOf(o.glyph)>=0);var b=document.createElement('button');b.className='lopt lopt-jamo jrole-'+(isV?'v':'c');b.innerHTML='<div class="lglyph">'+jamoCharSVG(o.glyph,isV)+'</div>';b.addEventListener('click',function(){checkListen(b,o);});if(box)box.appendChild(b);});
    var lq=document.getElementById('listenQ');if(lq)lq.textContent='같은 소리의 글자를 찾아요';
    if(box)twemojify(box);setTimeout(function(){speak(listenSay);},250);return;
  }
  // word 단계: ch로 시작하는 단어 찾기 (오답 보기는 ch가 없는 단어)
  var starts=wordsStartingWith(ch);var startKeys=starts.map(function(w){return w[0];});
  var all=listenPool();
  var distract=shuffle(all.filter(function(w){return startKeys.indexOf(w[0])<0&&!wordHasLetter(w[0],ch);}));
  var target=starts.length?shuffle(starts.slice())[0]:null;
  if(!target||distract.length<1){listenScore=Math.min(listenScore,1);listenMode='letter';return newListenQuestion();}
  var opts2=shuffle([target].concat(distract.slice(0,Math.max(1,listenN-1))));
  listenTarget={word:target[0],emoji:target[1],say:target[0]};
  opts2.forEach(function(w){var b=document.createElement('button');b.className='lopt';b.dataset.word=w[0];b.innerHTML='<div class="lglyph">'+w[1]+'</div><div class="lwd">'+w[0]+'</div>';b.addEventListener('click',function(){checkListen(b,{word:w[0],emoji:w[1]});});if(box)box.appendChild(b);});
  var lq2=document.getElementById('listenQ');if(lq2)lq2.textContent=ch+' 소리로 시작하는 단어를 찾아요';
  if(box)twemojify(box);setTimeout(function(){speak(listenTarget.word);},250);
}
// 진행 표시: 소리종 5칸이 하나씩 켜짐
function renderListenProgress(){
  var p=document.getElementById('listenProgress');if(!p)return;
  var h='';for(var i=0;i<LISTEN_LEN;i++){h+='<span class="lc-bell'+(i<listenScore?' on':'')+'">🔔</span>';}
  p.innerHTML=h;if(typeof twemojify==='function')twemojify(p);
}
// 하나 맞춤(작게) / 라운드 완료(크게)
function listenMini(btn,text){
  var s=document.createElement('span');s.className='lc-mini';s.textContent=text;
  btn.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},900);
}
function listenBigOpen(){
  var sec=document.getElementById('listen');if(!sec)return;
  var o=document.createElement('div');o.className='lc-big';
  o.innerHTML='<div class="lc-big-inner"><div class="lc-big-emoji">🔓🎉</div><div class="lc-big-label">소리 동굴 문이 열렸어요!</div></div>';
  sec.appendChild(o);if(typeof twemojify==='function')twemojify(o);
  setTimeout(function(){o.classList.add('show');},10);
  setTimeout(function(){o.classList.remove('show');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},420);},1800);
}
function startListenRound(){listenScore=0;var s=document.getElementById('lscore');if(s)s.textContent='0 / '+LISTEN_LEN;newListenQuestion();}
function checkListen(btn,o){
  if(listenLock)return;
  listenTry++;lsSet('hp_listen_try',listenTry);
  var ch=listenCh;var fb=document.getElementById('lfeedback');
  var correct=listenTarget.isLetter?(o.glyph===ch):wordHasLetter(o.word,ch);
  if(correct){
    listenCorrect++;lsSet('hp_listen_correct',listenCorrect);
    sfxCorrect();btn.classList.add('good','pop');listenLock=true;speak(o.word||listenSay);
    listenScore++;var s=document.getElementById('lscore');if(s)s.textContent=listenScore+' / '+LISTEN_LEN;
    renderListenProgress();
    document.querySelectorAll('#listenOpts .lopt').forEach(function(x){x.disabled=true;});
    if(listenScore>=LISTEN_LEN){if(fb)fb.textContent='';confetti();earnSticker();listenBigOpen();completeMission('play');setTimeout(startListenRound,2000);}
    else{listenMini(btn,'딩동! 맞아요!');if(fb)fb.textContent='';setTimeout(newListenQuestion,1100);}
  }else{
    sfxWrong();btn.classList.add('bad');listenWrong++;
    // 글자 단계: 정답 공개 없이 힌트만 점점 강하게(다시 듣기).
    if(listenTarget.isLetter){if(fb)fb.textContent=(listenWrong>=2)?'잘 들어봐요 — 이 소리예요':'다시 들어볼까요?';speak(listenSay);setTimeout(function(){btn.classList.remove('bad');},500);return;}
    // 단어 단계: 단계별 스캐폴딩 — 1회 다시듣기 → 2회 오답 보기 하나 지우기 → 3회 정답 공개.
    if(listenWrong>=3){
      listenLock=true;if(fb)fb.textContent='이거예요! '+ch+'가 들어 있어요';
      var ansBtn=document.querySelector('#listenOpts .lopt[data-word="'+listenTarget.word+'"]');if(ansBtn)ansBtn.classList.add('reveal');
      speak(ch);setTimeout(function(){speak(listenTarget.word);},750);
      setTimeout(function(){btn.classList.remove('bad');if(ansBtn)ansBtn.classList.remove('reveal');listenLock=false;if(fb)fb.textContent=ch+'가 든 단어를 찾아봐요';},2400);
      return;
    }
    if(listenWrong===2){
      var wrongs=[].slice.call(document.querySelectorAll('#listenOpts .lopt')).filter(function(x){return x.dataset.word!==listenTarget.word&&!x.disabled&&x!==btn;});
      if(wrongs.length){wrongs[0].disabled=true;wrongs[0].classList.add('dim');}
      if(fb)fb.textContent=ch+' 소리를 잘 들어봐요';
    }else{
      if(fb)fb.textContent='다시 들어볼까요?';
    }
    speak(ch);setTimeout(function(){speak(listenTarget.word);},650);
    setTimeout(function(){btn.classList.remove('bad');},500);
  }
}
var listenModeBox=document.getElementById('listenMode');
if(listenModeBox){[['단어','word'],['글자','letter']].forEach(function(m,i){var b=document.createElement('button');if(i===0)b.className='on';b.textContent=m[0];b.addEventListener('click',function(){listenMode=m[1];document.querySelectorAll('#listenMode button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');startListenRound();});listenModeBox.appendChild(b);});}
var listenDiffBox=document.getElementById('listenDiff');
if(listenDiffBox){[['쉬움',3],['보통',4]].forEach(function(d,i){var b=document.createElement('button');if(i===0)b.className='on';b.textContent=d[0];b.addEventListener('click',function(){listenN=d[1];document.querySelectorAll('#listenDiff button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');newListenQuestion();});listenDiffBox.appendChild(b);});}
document.getElementById('listenPlay').addEventListener('click',function(){speak((listenTarget&&listenTarget.word)?listenTarget.word:(listenSay||todaySay()));});
