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
      if(lo&&lo.final)sound='끝소리 '+(lo.name||ep.ch);
      var word=(lo&&lo.word)?lo.word:'';
      if(word&&typeof speakSeq==='function')speakSeq([sound,word]);
      else if(typeof speak==='function')speak(sound);
    }else if(ep.type==='combine'){
      if(typeof speak==='function')speak('자음과 모음을 합쳐 '+ep.ch+'를 만들어요');
    }else if(ep.type==='sentence'){
      // 읽기 우선: 문장을 미리 읽어주지 않고, 아이가 먼저 읽어보도록 초대만 한다.
      if(typeof speak==='function')speak('오늘은 이 문장을 스스로 읽어볼까요?');
    }else if(typeof speak==='function'){speak('곧 새로운 이야기가 열려요');}
  }catch(e){}
}
// 그림책 페이지: 큰 글자 + 큰 그림 + "하니가 읽어줄게" 버튼.
function renderEpisodeBanner(){
  var el=document.getElementById('episodeBanner');if(!el)return;
  var ep=curEpisode();if(!ep){el.innerHTML='';return;}
  if(ep.type==='letter'){
    var lo=curLetterObj();var pic=(lo&&lo.emoji)?lo.emoji:'';var isFin=!!(lo&&lo.final);
    el.innerHTML='<button class="book-page" id="epHearBtn" aria-label="'+(isFin?'하니가 받침 끝소리를 읽어줄게요':'하니가 글자를 읽어줄게요')+'">'
      +'<span class="book-ch">'+ep.ch+'</span>'
      +(pic?'<span class="book-pic">'+pic+'</span>':'')
      +'<span class="book-hear-label">'+(isFin?'🔊 받침 끝소리 들어요':'🔊 하니가 읽어줄게')+'</span>'
    +'</button>';
  }else if(ep.type==='combine'){
    var co=curLetterObj();var cpic=(co&&co.emoji)?co.emoji:'🧩';
    el.innerHTML='<button class="book-page" id="epHearBtn" aria-label="하니가 글자 만들기를 알려줄게요">'
      +'<span class="book-ch">'+ep.ch+'</span>'
      +'<span class="book-pic">'+cpic+'</span>'
      +'<span class="book-hear-label">🔊 하니가 알려줄게</span>'
    +'</button>';
  }else if(ep.type==='sentence'){
    el.innerHTML='<button class="book-page book-page-sent" id="epHearBtn" aria-label="이야기 책에서 문장을 읽어요">'
      +'<span class="book-ch">📖</span>'
      +'<span class="book-sent">'+ep.sent+'</span>'
      +'<span class="book-hear-label">📖 이야기 책에서 읽기</span>'
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
    var label=(i<=progress.idx&&ep&&ep.ch)?ep.ch:'';
    html+='<span class="'+cls+(i<progress.idx?' stop-go':'')+'" data-i="'+i+'"'+(label?(' title="'+label+'로 가기"'):'')+'>'+inner+(label?'<i class="stop-lab">'+label+'</i>':'')+'</span>';
    if(i<EPISODE_PATH.length-1)html+='<span class="stop-link"></span>';
  });
  html+='</div>';
  html+=letterProgressHTML();
  html+=relicShelfHTML();
  el.innerHTML=html;
  if(typeof twemojify==='function')twemojify(el);
  el.querySelectorAll('.stop-go').forEach(function(s){s.addEventListener('click',function(){goToEpisode(+s.getAttribute('data-i'));});});
  try{var now=el.querySelector('.stop-now');if(now&&now.scrollIntoView)now.scrollIntoView({inline:'center',block:'nearest'});}catch(e){}
}
// 별빛 편지 진행: 되찾은 편지 조각(=막 클리어)만큼 편지에 반짝임이 켜진다. N/8 조각 되찾음.
// progress.relics.length로 계산 → renderStarAlbum이 다시 그릴 때 함께 갱신된다.
function letterProgressHTML(){
  if(typeof CURRICULUM==='undefined')return '';
  var total=CURRICULUM.length;var got=Math.min((progress.relics||[]).length,total);
  var stars='';for(var i=0;i<total;i++){var on=i<got;stars+='<i class="lp-star'+(on?' on':'')+'">'+(on?'✨':'·')+'</i>';}
  return '<div class="letter-progress" aria-label="별빛 편지 — 되찾은 조각 '+got+'/'+total+'">'
    +'<span class="lp-letter">'+(got>=total?'💌':'✉️')+'</span>'
    +'<span class="lp-body"><span class="lp-title">별빛 편지</span>'
    +'<span class="lp-bar"><i class="lp-fill" style="width:'+Math.round(got/total*100)+'%"></i></span>'
    +'<span class="lp-stars">'+stars+'</span>'
    +'<span class="lp-count">'+got+'/'+total+' 조각 되찾음</span></span></div>';
}
// 보물 창고 선반: 막마다 하나씩 모으는 보물. 얻은 막은 이모지, 아직이면 ❔(잠금).
// renderStarAlbum 안에서 같이 그려져 보물이 바뀌면 함께 다시 렌더된다.
function relicShelfHTML(){
  if(typeof CURRICULUM==='undefined')return '';
  var got=(progress.relics||[]);
  var slots=CURRICULUM.map(function(a){
    var have=got.indexOf(a.act)>=0;
    var em=have?(a.relicEmoji||'⭐'):'❔';
    var cls='relic-slot '+(have?'got':'lock');
    var tip=a.act+'막 '+a.relic+(have?'':' (아직)');
    return '<i class="'+cls+'" title="'+tip+'">'+em+'</i>';
  }).join('');
  return '<div class="relic-shelf" aria-label="보물 창고 — 막마다 보물 하나를 모아요">'
    +'<span class="relic-shelf-title">🏺 보물 창고</span>'
    +'<span class="relic-shelf-row">'+slots+'</span></div>';
}
// 아이가 지난 글자를 다시 익히고 싶을 때: 그 단계로 이동(이전 단계만 허용).
function goToEpisode(i){
  if(i<0||i>=EPISODE_PATH.length||i===progress.idx)return;
  progress.idx=i; if(typeof saveProgress==='function')saveProgress();
  if(typeof loadMission==='function')loadMission();
  if(typeof renderMission==='function')renderMission();
  if(typeof renderEpisodeBanner==='function')renderEpisodeBanner();
  renderStarAlbum();
  var btn=document.getElementById('nextLetterBtn');if(btn)btn.style.display='none';
  if(typeof go==='function')go('home');
  setTimeout(function(){if(typeof narrateEpisode==='function')narrateEpisode();},200);
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
// 글자 마무리 정리(recap) + 지난 글자 복습 — 글자를 다 익힌 뒤 한번 정리해 설명.
function showRecap(){
  var ep=curEpisode();if(!ep||(ep.type!=='letter'&&ep.type!=='combine'))return;
  var ch=ep.ch;var lo=(typeof ALL_LETTER_OBJS!=='undefined')?ALL_LETTER_OBJS[ch]:null;var isFin=!!ep.final;
  var words=isFin?(((typeof FINAL_WORDS!=='undefined')&&FINAL_WORDS[ch])||[]):(((typeof LETTER_WORDS!=='undefined')&&LETTER_WORDS[ch])||[]);
  if(!words.length&&ep.type==='combine'&&ep.word)words=[[ep.word,ep.emoji||'']];
  var learned=(typeof masteredLetters==='function'?masteredLetters():[]).filter(function(c){return c!==ch;});
  var review=learned.length?learned[Math.floor(Math.random()*learned.length)]:'';
  var el=document.getElementById('recapPop');if(!el)return;
  var html='<div class="recap-card"><div class="recap-title">오늘은 <b>'+ch+'</b> '+(isFin?'받침 ':'')+'완성! ⭐</div>'
    +'<div class="recap-big">'+ch+'</div>'
    +'<div class="recap-words">'+words.map(function(w){return '<span class="recap-w"><i>'+w[1]+'</i><em>'+w[0]+'</em></span>';}).join('')+'</div>';
  if(review)html+='<div class="recap-review">지난 글자도 기억나요? <b>'+review+'</b></div>';
  html+='<button class="recap-next" id="recapNext">다음 글자로 ➡️</button></div>';
  el.innerHTML=html;el.style.display='flex';if(typeof twemojify==='function')twemojify(el);
  try{var seq=[isFin?('끝소리 '+((lo&&lo.name)||ch)):(lo?(lo.sound||lo.name||ch):ch)];words.forEach(function(w){seq.push(w[0]);});seq.push('잘했어요');
    if(review){var ro=ALL_LETTER_OBJS[review];seq.push((ro&&(ro.sound||ro.name))||review);}
    if(typeof speakSeq==='function')setTimeout(function(){speakSeq(seq);},350);}catch(e){}
  var nb=document.getElementById('recapNext');if(nb)nb.addEventListener('click',function(){el.style.display='none';goNextLetter();});
}
// 졸업 축하: 마지막 막(문장 읽기)을 끝낸 순간 — 큰 축하 + 하니 칭찬("스스로 읽었어요!").
// album/showRecap은 글자 전용(ch 키)이라 문장은 건드리지 않고 별도 졸업 화면을 띄운다.
function showGraduation(){
  var ep=curEpisode();var sent=(ep&&ep.sent)||'';
  var el=document.getElementById('recapPop');if(!el)return;
  var html='<div class="recap-card grad-card"><div class="recap-title">스스로 읽었어요! 🎓</div>'
    +'<div class="grad-emoji">✨ 💌 ✨</div>'
    +'<div class="grad-sent">'+sent+'</div>'
    +'<div class="recap-review">글자들이 다시 반짝— 별빛 편지가 살아났어요! 이제 하니가 이 편지를 배달하러 가요. ✉️🐥</div>'
    +'<button class="recap-next" id="recapNext">다음 이야기로 ➡️</button></div>';
  el.innerHTML=html;el.style.display='flex';if(typeof twemojify==='function')twemojify(el);
  try{if(typeof confetti==='function')confetti();}catch(e){}
  try{if(typeof speakSeq==='function')setTimeout(function(){speakSeq([sent,'스스로 읽었어요','별빛 편지가 살아났어요','하니가 편지를 배달할게요']);},400);
    else if(typeof speak==='function')speak('스스로 읽었어요');}catch(e){}
  var nb=document.getElementById('recapNext');if(nb)nb.addEventListener('click',function(){el.style.display='none';goNextLetter();});
}
// 막 클리어 보물 획득 연출: ○막 클리어! + 큰 보물 이모지 + 보물 이름 + 하니 칭찬.
// recap/graduation과 같은 #relicPop(=recap-pop 오버레이) 구조·쇼/디스미스 패턴을 그대로 따른다.
function showRelic(act){
  var info=(typeof relicForAct==='function')?relicForAct(act):null;
  var el=document.getElementById('relicPop');if(!el)return;
  var emoji=info?info.emoji:'⭐';var name=info?info.relic:'보물';
  var atEnd=(progress.idx>=EPISODE_PATH.length-1);
  var html='<div class="recap-card relic-card">'
    +'<div class="recap-title">'+act+'막 클리어! 🎉</div>'
    +'<div class="relic-emoji">'+emoji+'</div>'
    +'<div class="relic-name">'+name+'</div>'
    +'<div class="recap-review">편지 조각 <b>'+name+'</b>을(를) 되찾았어요! 별빛 우체국 편지가 조금씩 살아나요. ✉️</div>'
    +'<button class="recap-next" id="relicNext">'+(atEnd?'여정 마치기 🎓':'다음 막으로 ➡️')+'</button></div>';
  el.innerHTML=html;el.style.display='flex';if(typeof twemojify==='function')twemojify(el);
  try{if(typeof confetti==='function')confetti();}catch(e){}
  try{if(typeof speakSeq==='function')setTimeout(function(){speakSeq([act+'막 클리어','편지 조각 '+name+'을 되찾았어요','정말 잘했어요']);},400);
    else if(typeof speak==='function')speak('보물을 얻었어요');}catch(e){}
  var nb=document.getElementById('relicNext');if(nb)nb.addEventListener('click',function(){el.style.display='none';goNextLetter();});
}
function onEpisodeComplete(){
  var ep=curEpisode();
  // 방금 깬 에피소드가 그 막의 마지막이면 막 번호(아니면 0). 막 클리어면 보물 적립.
  var actDone=(typeof actCompletedAt==='function')?actCompletedAt(progress.idx):0;
  if(actDone&&typeof awardRelic==='function')awardRelic(actDone);
  // 8막(문장)은 졸업 연출이 곧 막 클리어 축하 — 보물(별빛 편지)은 적립만 하고 졸업 화면 유지.
  if(ep&&ep.type==='sentence'){renderStarAlbum();setTimeout(showGraduation,900);return;}
  addAlbumStar();
  renderStarAlbum();
  var m=checkMilestone();
  if(m){markMilestoneShown(m.word);setTimeout(function(){showMilestone(m);},1000);}
  // 막의 마지막 글자/음절이면 recap 대신 보물 연출 하나로(이중 스택 방지). 그 외엔 평소 recap.
  if(actDone)setTimeout(function(){showRelic(actDone);}, m?3400:1300);
  else setTimeout(showRecap, m?3400:1300);
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
// ----- 영상처럼 자동 넘김 -----
// 내레이션이 끝나면 1.2초 여운 뒤 다음 쪽으로. 마지막 쪽은 자동으로 나가지 않고
// 시작 버튼만 반짝여서 아이가 직접 출발하게 한다. ⏸/▶ 버튼으로 자동 넘김을 끄고 켤 수 있다.
var introAutoOn=true,introAutoTimer=null,introSafetyTimer=null,narrToken=0;
function cancelIntroAuto(){
  if(introAutoTimer){clearTimeout(introAutoTimer);introAutoTimer=null;}
  if(introSafetyTimer){clearTimeout(introSafetyTimer);introSafetyTimer=null;}
}
function introPageCount(){return actIntroActive?actIntroPages().length:INTRO_PAGES.length;}
function introPageIdx(){return actIntroActive?actIntroPage:introIdx;}
// 내레이션 한 쪽이 끝난 순간(onended/onend 또는 안전 타이머). token으로 옛 내레이션의 뒤늦은 콜백을 무시.
function narrationDone(tk){
  if(tk!==narrToken)return;
  if(!introAutoOn)return;
  cancelIntroAuto();
  if(introPageIdx()>=introPageCount()-1){pulseIntroNext();return;}
  introAutoTimer=setTimeout(function(){introAutoTimer=null;if(introAutoOn)introNext();},1200);
}
// onended가 안 오는 환경(재생 차단·TTS 취소 꼬임) 대비 — 글자 수 기반 넉넉한 안전 타이머.
function armNarrationSafety(text){
  var tk=narrToken;
  if(introSafetyTimer)clearTimeout(introSafetyTimer);
  var ms=Math.max(3000,(text?String(text).length:20)*150+2000);
  introSafetyTimer=setTimeout(function(){introSafetyTimer=null;narrationDone(tk);},ms);
}
function pulseIntroNext(){var n=document.getElementById('introNext');if(n)n.classList.add('pulse');}
function clearIntroPulse(){var n=document.getElementById('introNext');if(n)n.classList.remove('pulse');}
// 영상 진행바: (현재 쪽+1)/전체 쪽 비율만큼 채운다.
function renderIntroProgress(){
  var bar=document.getElementById('introProgress');if(!bar)return;
  var f=bar.firstElementChild;if(!f)return;
  f.style.width=Math.round(((introPageIdx()+1)/Math.max(1,introPageCount()))*100)+'%';
}
function setIntroAutoUI(on){ // 상태·버튼 표시만 갱신(내레이션은 건드리지 않음)
  introAutoOn=on;
  var b=document.getElementById('introAuto');
  if(b){b.textContent=on?'⏸':'▶';b.classList.toggle('off',!on);b.setAttribute('aria-label',on?'자동 넘김 멈추기':'자동 넘김 이어가기');if(typeof twemojify==='function')twemojify(b);}
  if(!on)cancelIntroAuto();
}
function setIntroAuto(on){setIntroAutoUI(on);if(on)speakIntro();} // 다시 켜면 지금 쪽부터 읽고 이어서 진행
// 시안 스토리 카드 자막: 막 배지(📖 제N막 · 장소) + 본문(hl 키워드는 주황 강조).
function capCardHTML(badge,text,hl){
  var body=String(text||'');
  if(hl){var i=body.indexOf(hl);if(i>=0)body=body.slice(0,i)+'<b>'+hl+'</b>'+body.slice(i+hl.length);}
  return (badge?'<span class="cap-badge">📖 '+badge+'</span>':'')+'<span class="cap-body">'+body+'</span>';
}
function renderIntroPage(){
  var p=INTRO_PAGES[introIdx];if(!p)return;
  var art=document.getElementById('introArt');
  if(art){
    if(p.svg){art.innerHTML=p.svg;art.classList.add('has-scene');}
    else{art.innerHTML=p.art.map(function(e,i){return '<span class="ia ia'+i+'">'+e+'</span>';}).join('');art.classList.remove('has-scene');if(typeof twemojify==='function')twemojify(art);}
    // 영상 연출: 컷 전환(enter) + 켄번즈 방향 교대(kb-b)
    art.classList.toggle('kb-b',introIdx%2===1);
    art.classList.remove('enter');void art.offsetWidth;art.classList.add('enter');
  }
  var cap=document.getElementById('introCap');
  if(cap){cap.innerHTML=capCardHTML('서장 · 별빛 우체국',p.say||p.cap,p.hl);if(typeof twemojify==='function')twemojify(cap);cap.classList.remove('enter');void cap.offsetWidth;cap.classList.add('enter');}
  var dots=document.getElementById('introDots');
  if(dots)dots.innerHTML=INTRO_PAGES.map(function(_,i){return '<i class="idot'+(i===introIdx?' on':'')+'"></i>';}).join('');
  var prev=document.getElementById('introPrev');if(prev)prev.style.visibility=(introIdx===0)?'hidden':'visible';
  var next=document.getElementById('introNext');if(next){next.textContent=(introIdx===INTRO_PAGES.length-1)?'모험 떠나기 🗺️':'다음 ▶';if(typeof twemojify==='function')twemojify(next);}
  clearIntroPulse();renderIntroProgress();
}
// 따뜻한 신경망 음성(edge-tts) MP3로 내레이션. 없거나 막히면 기기 TTS로 폴백.
function stopIntroAudio(){try{if(introAudio){introAudio.pause();introAudio=null;}}catch(e){}try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}}
function speakIntro(){
  if(actIntroActive){speakActIntro();return;}
  var p=INTRO_PAGES[introIdx];if(!p)return;
  stopIntroAudio();
  cancelIntroAuto();
  var tk=++narrToken;
  var a=new Audio();var fell=false;
  function fallback(){if(fell)return;fell=true;
    try{if(typeof speakOne==='function')speakOne(p.say,function(){narrationDone(tk);});
    else if(typeof speak==='function')speak(p.say);}catch(e){}}
  a.onerror=fallback;
  a.onended=function(){narrationDone(tk);};
  try{a.volume=Math.max(0,Math.min(1,(typeof volVoice!=='undefined'?volVoice:1)));}catch(e){}
  a.src='audio/narr/intro'+(introIdx+1)+'.mp3';
  var pr=a.play();if(pr&&pr.catch)pr.catch(fallback);
  introAudio=a;
  armNarrationSafety(p.say);
}
function showIntro(){
  introIdx=0;
  setIntroAutoUI(true);
  if(typeof go==='function')go('intro');
  try{var hb=document.getElementById('homeBtn');if(hb)hb.style.display='none';}catch(e){}
  renderIntroPage();
  setTimeout(speakIntro,300);
}
function introNext(){if(actIntroActive){actIntroNext();return;}if(introIdx<INTRO_PAGES.length-1){introIdx++;renderIntroPage();speakIntro();}else{finishIntro();}}
function introPrev(){if(actIntroActive){actIntroPrev();return;}if(introIdx>0){introIdx--;renderIntroPage();speakIntro();}}
function finishIntro(){if(actIntroActive){finishActIntro();return;}stopIntroAudio();cancelIntroAuto();try{lsSet('hp_intro_seen','1');}catch(e){}
  // 오프닝 그림책을 다 보면 1막 시작 그림책은 겹치지 않게 본 것으로 표시(첫 실행 중복 방지).
  try{if(typeof markActIntroSeen==='function')markActIntroSeen(1);}catch(e){}
  if(typeof go==='function')go('home');}
// ===== 막 시작 그림책 (막마다 3쪽 이야기, 하니 기기 음성) — #intro 화면·페이징 재사용 =====
// 오프닝 그림책(INTRO_PAGES)과 같은 dots/prev/next 페이징을 이 막의 3쪽에 대해 돌린다.
// 두 흐름이 섞이지 않게 renderIntroPage/introNext/introPrev/speakIntro는 actIntroActive로 분기.
var actIntroActive=false;var actIntroAct=0;var actIntroPage=0;
function actIntroPages(){var p=(typeof ACT_INTROS!=='undefined')?ACT_INTROS[actIntroAct]:null;return (p&&p.pages)?p.pages:[];}
function openActIntro(act){
  var p=(typeof ACT_INTROS!=='undefined')?ACT_INTROS[act]:null;if(!p||!p.pages||!p.pages.length)return;
  actIntroActive=true;actIntroAct=act;actIntroPage=0;
  setIntroAutoUI(true);
  stopIntroAudio();
  if(typeof go==='function')go('intro');
  try{var hb=document.getElementById('homeBtn');if(hb)hb.style.display='none';}catch(e){}
  renderActIntroPage();
  setTimeout(speakActIntro,300);
}
// 현재 막의 현재 쪽을 그린다. dots는 3쪽, 마지막 쪽 next는 '시작하기 ▶'.
function renderActIntroPage(){
  var pages=actIntroPages();var p=pages[actIntroPage];if(!p)return;
  var art=document.getElementById('introArt');
  if(art){art.innerHTML=p.svg;art.classList.add('has-scene');
    art.classList.toggle('kb-b',actIntroPage%2===1);
    art.classList.remove('enter');void art.offsetWidth;art.classList.add('enter');}
  var cap=document.getElementById('introCap');
  if(cap){var a=(typeof actCurriculum==='function')?actCurriculum(actIntroAct):null;
    var badge='제 '+actIntroAct+' 막'+(a&&a.place?' · '+a.place:'');
    cap.innerHTML=capCardHTML(badge,p.say||p.cap,p.hl);if(typeof twemojify==='function')twemojify(cap);cap.classList.remove('enter');void cap.offsetWidth;cap.classList.add('enter');}
  var dots=document.getElementById('introDots');
  if(dots)dots.innerHTML=pages.map(function(_,i){return '<i class="idot'+(i===actIntroPage?' on':'')+'"></i>';}).join('');
  var prev=document.getElementById('introPrev');if(prev)prev.style.visibility=(actIntroPage===0)?'hidden':'visible';
  var next=document.getElementById('introNext');if(next){next.textContent=(actIntroPage===pages.length-1)?'시작하기 ▶':'다음 ▶';if(typeof twemojify==='function')twemojify(next);}
  clearIntroPulse();renderIntroProgress();
}
// 이 막들은 MP3 내레이션이 없으니 기기 음성(deviceSpeak)으로 현재 쪽 say를 읽는다. 🔊 다시 듣기도 이걸 재생.
function speakActIntro(){var pages=actIntroPages();var p=pages[actIntroPage];if(!p)return;stopIntroAudio();
  cancelIntroAuto();
  var tk=++narrToken;
  try{if(typeof deviceSpeak==='function')deviceSpeak(p.say,function(){narrationDone(tk);});
  else if(typeof speak==='function')speak(p.say);}catch(e){}
  armNarrationSafety(p.say);}
function actIntroNext(){var pages=actIntroPages();if(actIntroPage<pages.length-1){actIntroPage++;renderActIntroPage();speakActIntro();}else{finishActIntro();}}
function actIntroPrev(){if(actIntroPage>0){actIntroPage--;renderActIntroPage();speakActIntro();}}
// 마지막 쪽 '시작하기' 또는 건너뛰기 → 이 막 홈/미션으로.
function finishActIntro(){actIntroActive=false;stopIntroAudio();cancelIntroAuto();
  try{if(typeof markActIntroSeen==='function')markActIntroSeen(actIntroAct);}catch(e){}
  if(typeof go==='function')go('home');}
// 트리거: 새 막에 처음 들어선 순간 1회만 자동 노출. 오프닝 그림책이 우선(첫 실행 중복 방지).
function maybeShowActIntro(){
  try{
    if(actIntroActive)return;
    if(typeof ACT_INTROS==='undefined')return;
    var seenOpening='';try{seenOpening=lsGet('hp_intro_seen','');}catch(e){}
    if(!seenOpening)return;                          // 오프닝 인트로가 먼저
    var introScr=document.getElementById('intro');
    if(introScr&&introScr.classList.contains('active'))return; // 인트로 화면이면 대기
    var ep=(typeof curEpisode==='function')?curEpisode():null;if(!ep)return;
    var act=ep.act;if(!act||!ACT_INTROS[act])return;
    if(typeof actIntroSeen==='function'&&actIntroSeen(act))return;
    if(typeof markActIntroSeen==='function')markActIntroSeen(act); // 즉시 표시 → 정확히 1회
    setTimeout(function(){openActIntro(act);},90);
  }catch(e){}
}
function initIntro(){
  var n=document.getElementById('introNext');if(n)n.addEventListener('click',introNext);
  var p=document.getElementById('introPrev');if(p)p.addEventListener('click',introPrev);
  var au=document.getElementById('introAuto');if(au)au.addEventListener('click',function(){setIntroAuto(!introAutoOn);});
  var h=document.getElementById('introHear');if(h)h.addEventListener('click',speakIntro);
  var art=document.getElementById('introArt');if(art)art.addEventListener('click',speakIntro);
  var s=document.getElementById('introSkip');if(s)s.addEventListener('click',finishIntro);
  var r=document.getElementById('replayIntro');if(r)r.addEventListener('click',showIntro);
  var ra=document.getElementById('replayActIntro');if(ra)ra.addEventListener('click',function(){var ep=(typeof curEpisode==='function')?curEpisode():null;var act=ep?ep.act:0;if(act)openActIntro(act);});
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
