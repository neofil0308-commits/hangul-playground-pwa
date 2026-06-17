// 별빛 우체국 그림책 — 그림+소리 중심(만4세·글 못 읽는 아이용).
// 그림책 페이지(큰 글자+그림+하니 음성)와 진행 그림길(징검다리)을 렌더.
// 데이터는 app-data.js(CURRICULUM/EPISODE_PATH/STORY_MILESTONES), 상태는 app-state.js(progress).
// 음성/이동 helper(speak/speakSeq/go)와 renderMission/loadMission은 메인 스크립트에서 제공.

// 에피소드별 대표 그림(이모지). 기본 자모는 예시단어 그림, 그 외는 단계 아이콘.
function stopPic(ep){
  if(!ep)return '⭐';
  if(ep.type==='letter'){var o=(typeof ALL_LETTER_OBJS!=='undefined')?ALL_LETTER_OBJS[ep.ch]:null;return (o&&o.emoji)?o.emoji:ep.ch;}
  if(ep.type==='combine')return '🧩';
  if(ep.type==='word')return '📚';
  if(ep.type==='sentence')return '📖';
  return '⭐';
}
// 하니가 읽어주기: 글자 소리 + 예시 단어를 음성으로(글 대신 소리).
function narrateEpisode(){
  var ep=curEpisode();if(!ep)return;
  try{
    if(ep.type==='letter'){
      var lo=curLetterObj();
      var sound=lo?(lo.sound||lo.name||ep.ch):ep.ch;
      var word=(lo&&lo.word)?lo.word:'';
      if(word&&typeof speakSeq==='function')speakSeq([sound,word]);
      else if(typeof speak==='function')speak(sound);
    }else if(typeof speak==='function'){speak('곧 새로운 이야기가 열려요');}
  }catch(e){}
}
// 그림책 페이지: 큰 글자 + 큰 그림 + "하니가 읽어줄게" 버튼.
function renderEpisodeBanner(){
  var el=document.getElementById('episodeBanner');if(!el)return;
  var ep=curEpisode();if(!ep){el.innerHTML='';return;}
  if(ep.type==='letter'){
    var lo=curLetterObj();var pic=(lo&&lo.emoji)?lo.emoji:'';
    el.innerHTML='<button class="book-page" id="epHearBtn" aria-label="하니가 글자를 읽어줄게요">'
      +'<span class="book-ch">'+ep.ch+'</span>'
      +(pic?'<span class="book-pic">'+pic+'</span>':'')
      +'<span class="book-hear-label">🔊 하니가 읽어줄게</span>'
    +'</button>';
  }else{
    el.innerHTML='<button class="book-page book-page-soon" id="epHearBtn">'
      +'<span class="book-ch">📖</span>'
      +'<span class="book-hear-label">🔊 하니가 읽어줄게</span>'
    +'</button>';
  }
  var h=document.getElementById('epHearBtn');if(h)h.addEventListener('click',narrateEpisode);
  if(typeof twemojify==='function')twemojify(el);
}
// 진행 그림길: 익힌 글자(그림+별) — 지금(하니 🐥) — 앞으로(❔) 를 징검다리로.
function renderStarAlbum(){
  var el=document.getElementById('starAlbum');if(!el)return;
  var done=(progress.album||[]).length;
  var act=curEpisode()?curEpisode().actTitle:'';
  var html='<div class="journey-head"><span class="journey-act">'+(act||'')+'</span><span class="journey-count">'+done+'개 모았어요 ⭐</span></div>'
    +'<div class="journey-path" id="journeyPath">';
  EPISODE_PATH.forEach(function(ep,i){
    var pic=stopPic(ep),cls='stop',inner='';
    if(i<progress.idx){cls+=' stop-done';inner='<span class="stop-pic">'+pic+'</span><i class="stop-star">⭐</i>';}
    else if(i===progress.idx){cls+=' stop-now';inner='<span class="stop-pic">'+pic+'</span><i class="stop-hani">🐥</i>';}
    else{cls+=' stop-soon';inner='<span class="stop-pic stop-q">❔</span>';}
    html+='<span class="'+cls+'">'+inner+'</span>';
    if(i<EPISODE_PATH.length-1)html+='<span class="stop-link"></span>';
  });
  html+='</div>';
  el.innerHTML=html;
  if(typeof twemojify==='function')twemojify(el);
  try{var now=el.querySelector('.stop-now');if(now&&now.scrollIntoView)now.scrollIntoView({inline:'center',block:'nearest'});}catch(e){}
}
// 빠른 성취 맛보기 팝업: 진짜 말을 읽었다는 축하 + 음성.
function showMilestone(m){
  var el=document.getElementById('milestonePop');if(!el)return;
  el.innerHTML='<div class="ms-word">'+m.word+'</div><div class="ms-note">'+m.note+'</div>';
  el.style.display='block';el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
  if(typeof twemojify==='function')twemojify(el);
  try{if(typeof speak==='function')speak(m.say);}catch(e){}
  setTimeout(function(){el.classList.remove('show');setTimeout(function(){el.style.display='none';},400);},2800);
}
// 한 글자(에피소드)를 다 깬 순간: 별 추가 + 그림길 갱신 + 맛보기 검사.
function onEpisodeComplete(){
  addAlbumStar();
  renderStarAlbum();
  var m=checkMilestone();
  if(m){markMilestoneShown(m.word);setTimeout(function(){showMilestone(m);},1000);}
}
// 다음 글자로 진행: 포인터 +1, 미션 새로 깔고 홈으로, 하니가 새 글자 읽어줌.
function goNextLetter(){
  advanceEpisode();
  var btn=document.getElementById('nextLetterBtn');if(btn)btn.style.display='none';
  loadMission();
  renderMission();
  renderEpisodeBanner();
  if(typeof go==='function')go('home');
  setTimeout(narrateEpisode,200);
}
// ===== 인트로 그림책 (모험 시작 이야기, 하니 음성) =====
var introIdx=0;var introAudio=null;
function renderIntroPage(){
  var p=INTRO_PAGES[introIdx];if(!p)return;
  var art=document.getElementById('introArt');
  if(art){
    if(p.svg){art.innerHTML=p.svg;art.classList.add('has-scene');}
    else{art.innerHTML=p.art.map(function(e,i){return '<span class="ia ia'+i+'">'+e+'</span>';}).join('');art.classList.remove('has-scene');if(typeof twemojify==='function')twemojify(art);}
  }
  var cap=document.getElementById('introCap');if(cap)cap.textContent=p.cap;
  var dots=document.getElementById('introDots');
  if(dots)dots.innerHTML=INTRO_PAGES.map(function(_,i){return '<i class="idot'+(i===introIdx?' on':'')+'"></i>';}).join('');
  var prev=document.getElementById('introPrev');if(prev)prev.style.visibility=(introIdx===0)?'hidden':'visible';
  var next=document.getElementById('introNext');if(next){next.textContent=(introIdx===INTRO_PAGES.length-1)?'모험 떠나기 🗺️':'다음 ▶';if(typeof twemojify==='function')twemojify(next);}
}
// 따뜻한 신경망 음성(edge-tts) MP3로 내레이션. 없거나 막히면 기기 TTS로 폴백.
function stopIntroAudio(){try{if(introAudio){introAudio.pause();introAudio=null;}}catch(e){}try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}}
function speakIntro(){
  var p=INTRO_PAGES[introIdx];if(!p)return;
  stopIntroAudio();
  var a=new Audio();var fell=false;
  function fallback(){if(fell)return;fell=true;try{if(typeof speak==='function')speak(p.say);}catch(e){}}
  a.onerror=fallback;
  try{a.volume=Math.max(0,Math.min(1,(typeof volVoice!=='undefined'?volVoice:1)));}catch(e){}
  a.src='audio/narr/intro'+(introIdx+1)+'.mp3';
  var pr=a.play();if(pr&&pr.catch)pr.catch(fallback);
  introAudio=a;
}
function showIntro(){
  introIdx=0;
  if(typeof go==='function')go('intro');
  try{var hb=document.getElementById('homeBtn');if(hb)hb.style.display='none';}catch(e){}
  renderIntroPage();
  setTimeout(speakIntro,300);
}
function introNext(){if(introIdx<INTRO_PAGES.length-1){introIdx++;renderIntroPage();speakIntro();}else{finishIntro();}}
function introPrev(){if(introIdx>0){introIdx--;renderIntroPage();speakIntro();}}
function finishIntro(){stopIntroAudio();try{lsSet('hp_intro_seen','1');}catch(e){}if(typeof go==='function')go('home');}
function initIntro(){
  var n=document.getElementById('introNext');if(n)n.addEventListener('click',introNext);
  var p=document.getElementById('introPrev');if(p)p.addEventListener('click',introPrev);
  var h=document.getElementById('introHear');if(h)h.addEventListener('click',speakIntro);
  var art=document.getElementById('introArt');if(art)art.addEventListener('click',speakIntro);
  var s=document.getElementById('introSkip');if(s)s.addEventListener('click',finishIntro);
  var r=document.getElementById('replayIntro');if(r)r.addEventListener('click',showIntro);
  var seen='';try{seen=lsGet('hp_intro_seen','');}catch(e){}
  if(!seen)showIntro();
}
function initEpisodeScreens(){
  var btn=document.getElementById('nextLetterBtn');
  if(btn)btn.addEventListener('click',goNextLetter);
  renderEpisodeBanner();
  renderStarAlbum();
  initIntro();
}
