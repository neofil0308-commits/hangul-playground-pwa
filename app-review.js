// 지난 글자 복습(SRS) 라운드 — 뗀 글자를 '소리 듣고 글자 찾기'로 재확인. 비처벌·관대.
// app-state.js의 dueReviewChs/gradeReview, app-data.js의 ALL_LETTER_OBJS/CONS/VOWS/jamoCharSVG,
// 인라인 스크립트의 go/speak/sfx*/confetti/earnSticker/shuffle/renderReviewCard 를 런타임에 사용.
var revQueue=[],revIdx=0,revTarget=null,revLock=false,revRight=0,revWrong=0;
// 복모음(6막)도 모음으로 봐야 타일 색(jrole-v)과 오답 후보가 맞는다 — app-state.js에 단일화.
function _isVowCh(ch){return (typeof isVowelCh==='function')?isVowelCh(ch)
  :((typeof VOWS!=='undefined')&&VOWS.some(function(v){return v.ch===ch;}));}
function startReview(){
  var due=shuffle((typeof dueReviewChs==='function'?dueReviewChs():[]).slice());
  revQueue=((typeof orderByWeakness==='function')?orderByWeakness(due):due).slice(0,6); // 약한 글자 먼저
  revIdx=0;revRight=0;revLock=false;
  if(!revQueue.length){if(typeof go==='function')go('home');return;}
  if(typeof go==='function')go('review');
  var sc=document.getElementById('revScore');if(sc)sc.textContent='0 / '+revQueue.length;
  nextReviewQ();
}
function nextReviewQ(){
  revLock=false;revWrong=0;
  if(revIdx>=revQueue.length){finishReview();return;}
  var ch=revQueue[revIdx];var obj=(typeof ALL_LETTER_OBJS!=='undefined'&&ALL_LETTER_OBJS[ch])||{ch:ch,sound:ch};
  revTarget={ch:ch,say:obj.sound||obj.name||ch};
  var isV=_isVowCh(ch);
  var pool=(typeof letterPool==='function')?letterPool(ch):(isV?VOWS:CONS).filter(function(x){return x.ch!==ch;});
  var nDist=((typeof reviewOptionCount==='function')?reviewOptionCount(ch):3)-1; // 적응: 약한 글자=보기 적게
  var others=shuffle(pool).slice(0,Math.max(1,nDist)).map(function(x){return x.ch;});
  var opts=shuffle([ch].concat(others));
  var box=document.getElementById('revOpts');if(box)box.innerHTML='';
  var fb=document.getElementById('revFeedback');if(fb)fb.textContent='';
  var q=document.getElementById('revQ');if(q)q.textContent='이 소리의 글자를 찾아요';
  opts.forEach(function(g){var iv=_isVowCh(g);var b=document.createElement('button');
    b.className='lopt lopt-jamo jrole-'+(iv?'v':'c');b.setAttribute('data-g',g);
    b.innerHTML='<div class="lglyph">'+jamoCharSVG(g,iv)+'</div>';
    b.addEventListener('click',function(){checkReview(b,g);});if(box)box.appendChild(b);});
  var prog=document.getElementById('revProgress');
  if(prog){var h='';for(var i=0;i<revQueue.length;i++)h+='<span class="lc-bell'+(i<revIdx?' on':'')+'">⭐</span>';prog.innerHTML=h;if(typeof twemojify==='function')twemojify(prog);}
  setTimeout(function(){if(typeof speak==='function')speak(revTarget.say);},250);
}
function checkReview(btn,g){
  if(revLock)return;
  var ch=revTarget.ch;var fb=document.getElementById('revFeedback');
  if(g===ch){
    revLock=true;
    if(typeof sfxCorrect==='function')sfxCorrect();
    btn.classList.add('good','pop');revRight++;
    // 힌트 없이 맞히면 승급, 힌트 후 맞히면 다시 볼 대상으로 유지(오답 처리).
    if(typeof gradeReview==='function')gradeReview(ch,revWrong===0);
    if(typeof speak==='function')speak(revTarget.say);
    document.querySelectorAll('#revOpts .lopt').forEach(function(x){x.disabled=true;});
    var sc=document.getElementById('revScore');if(sc)sc.textContent=revRight+' / '+revQueue.length;
    if(fb)fb.textContent='딩동! 기억했어요 ⭐';
    revIdx++;setTimeout(nextReviewQ,1000);
    return;
  }
  // 오답 — 단계별 스캐폴딩(즉시 정답공개 X): 1회 다시듣기 → 2회 보기 줄이기 → 3회 정답 공개
  revWrong++;
  if(typeof sfxWrong==='function')sfxWrong();
  btn.classList.add('bad');
  if(revWrong>=3){
    revLock=true;
    if(typeof gradeReview==='function')gradeReview(ch,false);
    if(fb)fb.textContent='이 글자예요! 다시 만나요';
    var ans=document.querySelector('#revOpts .lopt[data-g="'+ch+'"]');if(ans)ans.classList.add('reveal');
    if(typeof speak==='function')speak(revTarget.say);
    document.querySelectorAll('#revOpts .lopt').forEach(function(x){x.disabled=true;});
    revIdx++;setTimeout(function(){if(ans)ans.classList.remove('reveal');nextReviewQ();},1900);
    return;
  }
  if(revWrong===2){
    // 오답 보기 하나를 지워 선택지를 줄여준다(정답·현재 버튼 제외).
    var wrongs=[].slice.call(document.querySelectorAll('#revOpts .lopt')).filter(function(x){return x.getAttribute('data-g')!==ch&&!x.disabled&&x!==btn;});
    if(wrongs.length){wrongs[0].disabled=true;wrongs[0].classList.add('dim');}
    if(fb)fb.textContent='잘 들어봐요 — 이 소리예요';
  }else{
    if(fb)fb.textContent='다시 들어볼까요?';
  }
  if(typeof speak==='function')speak(revTarget.say);
  setTimeout(function(){btn.classList.remove('bad');},500);
}
function finishReview(){
  if(typeof confetti==='function')confetti();
  if(typeof earnSticker==='function'&&revRight>0)earnSticker();
  var q=document.getElementById('revQ');if(q)q.textContent='복습 끝! 지난 글자가 다시 반짝여요 ⭐';
  var box=document.getElementById('revOpts');if(box)box.innerHTML='';
  var fb=document.getElementById('revFeedback');if(fb)fb.textContent=revRight+'개 글자를 다시 기억했어요!';
  setTimeout(function(){if(typeof renderReviewCard==='function')renderReviewCard();if(typeof go==='function')go('home');},1700);
}
