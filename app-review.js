// 지난 글자 복습(SRS) 라운드 — 뗀 글자를 '소리 듣고 글자 찾기'로 재확인. 비처벌·관대.
// app-state.js의 dueReviewChs/gradeReview, app-data.js의 ALL_LETTER_OBJS/CONS/VOWS/jamoCharSVG,
// 인라인 스크립트의 go/speak/sfx*/confetti/earnSticker/shuffle/renderReviewCard 를 런타임에 사용.
var revQueue=[],revIdx=0,revTarget=null,revLock=false,revRight=0;
function _isVowCh(ch){return (typeof VOWS!=='undefined')&&VOWS.some(function(v){return v.ch===ch;});}
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
  revLock=false;
  if(revIdx>=revQueue.length){finishReview();return;}
  var ch=revQueue[revIdx];var obj=(typeof ALL_LETTER_OBJS!=='undefined'&&ALL_LETTER_OBJS[ch])||{ch:ch,sound:ch};
  revTarget={ch:ch,say:obj.sound||obj.name||ch};
  var isV=_isVowCh(ch);
  var pool=(isV?VOWS:CONS).filter(function(x){return x.ch!==ch;});
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
  if(revLock)return;revLock=true;
  var ch=revTarget.ch;var fb=document.getElementById('revFeedback');
  if(g===ch){
    if(typeof sfxCorrect==='function')sfxCorrect();
    btn.classList.add('good','pop');revRight++;
    if(typeof gradeReview==='function')gradeReview(ch,true);
    if(typeof speak==='function')speak(revTarget.say);
    document.querySelectorAll('#revOpts .lopt').forEach(function(x){x.disabled=true;});
    var sc=document.getElementById('revScore');if(sc)sc.textContent=revRight+' / '+revQueue.length;
    if(fb)fb.textContent='딩동! 기억했어요 ⭐';
    revIdx++;setTimeout(nextReviewQ,1000);
  }else{
    if(typeof sfxWrong==='function')sfxWrong();
    btn.classList.add('bad');
    if(typeof gradeReview==='function')gradeReview(ch,false);
    if(fb)fb.textContent='이 글자예요! 다시 만나요';
    var ans=document.querySelector('#revOpts .lopt[data-g="'+ch+'"]');if(ans)ans.classList.add('reveal');
    if(typeof speak==='function')speak(revTarget.say);
    document.querySelectorAll('#revOpts .lopt').forEach(function(x){x.disabled=true;});
    revIdx++;setTimeout(function(){if(ans)ans.classList.remove('reveal');nextReviewQ();},1900);
  }
}
function finishReview(){
  if(typeof confetti==='function')confetti();
  if(typeof earnSticker==='function'&&revRight>0)earnSticker();
  var q=document.getElementById('revQ');if(q)q.textContent='복습 끝! 지난 글자가 다시 반짝여요 ⭐';
  var box=document.getElementById('revOpts');if(box)box.innerHTML='';
  var fb=document.getElementById('revFeedback');if(fb)fb.textContent=revRight+'개 글자를 다시 기억했어요!';
  setTimeout(function(){if(typeof renderReviewCard==='function')renderReviewCard();if(typeof go==='function')go('home');},1700);
}
