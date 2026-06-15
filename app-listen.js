// 듣고 찾기 game logic for 하니의 한글 모험.
// Depends on app-data.js, app-state.js, and UI helpers from the main app script.

var listenMode='letter',listenN=3,listenScore=0,listenTarget=null,listenBuilt=false,LISTEN_LEN=5;
function listenPool(){return listenMode==='letter'?ALL_LETTERS.map(function(x){return{glyph:x.ch,say:(x.name||x.sound)};}):ALL_WORDS.map(function(w){return{emoji:w[1],word:w[0],say:w[0]};});}
function newListenQuestion(){
  var pool=listenPool();var opts=shuffle(pool).slice(0,listenN);listenTarget=opts[Math.floor(Math.random()*opts.length)];
  var box=document.getElementById('listenOpts');box.innerHTML='';
  shuffle(opts).forEach(function(o){var b=document.createElement('button');b.className='lopt';
    if(listenMode==='letter')b.innerHTML='<div class="lglyph">'+o.glyph+'</div>';
    else b.innerHTML='<div class="lglyph">'+o.emoji+'</div><div class="lwd">'+o.word+'</div>';
    b.addEventListener('click',function(){checkListen(b,o);});box.appendChild(b);});
  twemojify(box);
  var fb=document.getElementById('lfeedback');if(fb)fb.textContent='';
  setTimeout(function(){if(listenTarget)speak(listenTarget.say);},250);
}
function startListenRound(){listenScore=0;var s=document.getElementById('lscore');if(s)s.textContent='0 / '+LISTEN_LEN;newListenQuestion();}
function checkListen(btn,o){
  var correct=(o.say===listenTarget.say);
  listenTry++;lsSet('hp_listen_try',listenTry);
  if(correct){
    listenCorrect++;lsSet('hp_listen_correct',listenCorrect);
    sfxCorrect();btn.classList.add('good');speak(listenTarget.say);listenScore++;
    var s=document.getElementById('lscore');if(s)s.textContent=listenScore+' / '+LISTEN_LEN;
    document.querySelectorAll('#listenOpts .lopt').forEach(function(x){x.disabled=true;});
    if(listenScore>=LISTEN_LEN){document.getElementById('lfeedback').textContent='다 맞혔어요! 🎉';confetti();earnSticker();completeMission('play');setTimeout(startListenRound,1500);}
    else{document.getElementById('lfeedback').textContent='잘했어요! 👍';setTimeout(newListenQuestion,950);}
  }else{sfxWrong();btn.classList.add('bad');setTimeout(function(){btn.classList.remove('bad');},420);speak(listenTarget.say);}
}
var listenModeBox=document.getElementById('listenMode');
[['글자','letter'],['단어','word']].forEach(function(m,i){var b=document.createElement('button');if(i===0)b.className='on';b.textContent=m[0];b.addEventListener('click',function(){listenMode=m[1];document.querySelectorAll('#listenMode button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');startListenRound();});listenModeBox.appendChild(b);});
var listenDiffBox=document.getElementById('listenDiff');
[['쉬움',3],['보통',4]].forEach(function(d,i){var b=document.createElement('button');if(i===0)b.className='on';b.textContent=d[0];b.addEventListener('click',function(){listenN=d[1];document.querySelectorAll('#listenDiff button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');newListenQuestion();});listenDiffBox.appendChild(b);});
document.getElementById('listenPlay').addEventListener('click',function(){if(listenTarget)speak(listenTarget.say);});
