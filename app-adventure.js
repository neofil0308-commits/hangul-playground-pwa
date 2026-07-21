// Adventure map, story world, and copy helpers for 하니의 한글 모험.
// Depends on app-data.js/app-state.js and UI helpers from the main app script.

const mapGrid=document.getElementById('mapGrid');
// 별자리 지도(시안 원본): 밤하늘에 점선 별자리 경로 + 장소 노드.
// 완료=금빛 별, 현재=장소 일러스트 코인, 미래=반투명 원. 경로·좌표·스타일 모두 design reference 이식.
function buildAdventureMap(){
  if(!mapGrid)return;
  mapGrid.innerHTML='';
  var deco=document.createElement('div');
  deco.className='map-sky';
  deco.innerHTML=
    '<svg class="map-const" viewBox="0 0 620 660" preserveAspectRatio="none"><path d="M95,600 L215,545 L150,430 L315,370 L255,255 L420,235 L355,125 L505,75" fill="none" stroke="#F5D488" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 16" opacity="0.85"/></svg>'
    +'<i class="map-tw" style="left:10%;top:9%">✦</i><i class="map-tw t2" style="right:13%;top:20%">✦</i><i class="map-tw t3" style="left:19%;top:33%">✦</i><i class="map-tw t2" style="right:20%;bottom:19%">✦</i>'
    +'<span class="map-dot" style="left:24.2%;top:65.2%;width:34px;height:34px"></span>'
    +'<span class="map-dot" style="left:41.1%;top:38.6%;width:30px;height:30px"></span>'
    +'<span class="map-startstar" style="left:15.3%;top:90.9%"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.1 19.7l1.3-6.3L2.6 9.1l6.4-.7z"/></svg></span>'
    +'<span class="map-post" style="left:81.5%;top:11.4%"><i class="map-post-circle"><svg width="30" height="26" viewBox="0 0 28 24" fill="none" stroke="#F5D488" stroke-width="1.8"><rect x="2" y="4" width="24" height="16" rx="2.5"/><path d="M2.5 6l11.5 8L25.5 6"/></svg></i><i class="map-post-name">별빛 우체국</i></span>';
  mapGrid.appendChild(deco);
  MAP_PLACES.forEach(function(p){
    var b=document.createElement('button');
    b.className='map-node';
    b.dataset.target=p.target;
    b.dataset.quest=p.quest||'';
    if(!p.quest)b.classList.add('map-free'); // 퀘스트 없는 장소(스티커 집)는 늘 일러스트 코인
    b.style.left=p.mx+'%';b.style.top=p.my+'%';
    b.innerHTML='<span class="map-coin"><span class="map-art">'+((typeof MAP_ART!=='undefined'&&MAP_ART[p.id])||'')+'</span>'
      +'<span class="map-star"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.5l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.1 19.7l1.3-6.3L2.6 9.1l6.4-.7z"/></svg></span></span>'
      +'<span class="map-name">'+p.place+'</span>';
    b.addEventListener('click',function(){
      if(p.action==='letter')openTodayLetter();
      else if(p.action==='word')openWordBuild(todayWord[0],todayWord[1]);
      // 글자 찾기는 오늘의 글자로 판을 새로 깔아야 한다(홈 미션 행과 같은 진입점).
      else if(p.action==='find'&&typeof openFind==='function')openFind();
      else go(p.target);
    });
    mapGrid.appendChild(b);
  });
  twemojify(mapGrid);
}
function updateAdventureMap(){
  if(!mapGrid||!mission)return;
  var done=missionDoneCount(),current=missionCurrentPart();
  document.querySelectorAll('#mapGrid .map-node').forEach(function(node){
    var q=node.dataset.quest;
    var lit=!q||!!mission[q];
    node.classList.toggle('map-lit',!!lit);
    node.classList.toggle('map-current',!!q&&q===current);
    node.classList.toggle('map-locked',!!q&&!lit&&q!==current);
  });
  var light=document.getElementById('mapLight');
  if(light)light.textContent='한글 마을 불빛 '+done+' / '+missionTotal();
}
function updateQuestRoute(){
  if(!mission)return;
  var current=missionCurrentPart();
  [['routeLetter','letter'],['routeWord','word'],['routePlay','play']].forEach(function(pair){
    var el=document.getElementById(pair[0]);if(!el)return;
    var key=pair[1],lit=!!mission[key];
    el.classList.toggle('route-lit',lit);
    el.classList.toggle('route-current',key===current);
  });
}
function renderHaniReaction(){
  var key=(mission&&mission.lastReaction)||'';
  var done=mission?missionDoneCount():0;
  if(done>=missionTotal())key='all'; // 전부 끝났을 때만 마무리 반응으로 덮는다
  var rx=HANI_REACTIONS[key]||{badge:'하니의 반응',text:'하니가 오늘의 첫 빛 조각을 기다리고 있어요.',log:'모험을 하나 완료하면 보물이 반짝이며 하니가 대답해요.'};
  var panel=document.getElementById('haniReaction');
  var badge=document.getElementById('haniReactionBadge');if(badge)badge.textContent=rx.badge;
  var text=document.getElementById('haniReactionText');if(text)text.textContent=rx.text;
  var log=document.getElementById('haniReactionLog');if(log)log.textContent=rx.log;
  if(panel){panel.classList.toggle('reaction-lit',!!key);panel.classList.toggle('reaction-complete',key==='all');}
}
function showHaniReaction(part){mission.lastReaction=part;saveMission();renderHaniReaction();}
function renderStoryArc(){
  var list=document.getElementById('storyArcList');if(!list)return;
  list.innerHTML='';
  STORY_ARC.forEach(function(item){
    var li=document.createElement('li');
    li.innerHTML='<b>'+item.label+'</b>'+item.text;
    list.appendChild(li);
  });
}
function renderStoryChapterList(current){
  STORY_CHAPTERS.forEach(function(ch){
    var el=document.getElementById(ch.id);if(!el)return;
    var lit=!!(mission&&mission[ch.key]);
    el.innerHTML=ch.title+'<span class="chapter-note">'+ch.place+' · 보상: '+ch.reward+'</span>';
    el.classList.toggle('chapter-done',lit);
    el.classList.toggle('chapter-current',ch.key===current);
  });
}
function updateStoryBible(active){
  var emotion=document.getElementById('storyEmotionText');if(emotion)emotion.textContent=active.emotion;
  var secret=document.getElementById('storySecretText');if(secret)secret.textContent=active.secret;
  var next=document.getElementById('storyNextText');if(next)next.textContent=active.next;
  var relic=document.getElementById('storyRelicText');if(relic)relic.textContent=active.relic;
}
function updateStoryWorld(){
  if(!mission)return;
  var done=missionDoneCount(),current=missionCurrentPart();
  var copy=document.getElementById('storyChapterText');
  if(copy){
    if(done===0)copy.textContent='하니와 함께 첫 빛 조각을 찾으러 글자 숲으로 떠나요.';
    else if(!mission.word)copy.textContent='글자 숲에 첫 불빛이 켜졌어요. 이제 단어 동산의 꽃을 피워요.';
    else if(!mission.play)copy.textContent='단어 꽃이 피었어요. 다음 빛 조각은 소리 동굴 문 뒤에 있어요.';
    else if(missionParts().indexOf('find')>=0&&!mission.find)copy.textContent='소리 종이 울렸어요. 마지막 빛 조각은 숨은 글자 속에 있어요.';
    else copy.textContent='빛 조각이 모두 모였어요. 한글 마을의 오늘 이야기가 완성됐어요!';
  }
  var pieces=document.getElementById('storyLightPieces');if(pieces)pieces.textContent='빛 조각 '+done+' / '+missionTotal();
  var active=STORY_CHAPTERS.find(function(ch){return ch.key===current;})||STORY_CHAPTERS[STORY_CHAPTERS.length-1];
  var scene=document.getElementById('storySceneText');if(scene)scene.textContent='장면: '+active.scene;
  var clue=document.getElementById('storyClueText');if(clue)clue.textContent='단서: '+active.clue+' 보상: '+active.reward;
  updateStoryBible(active);
  renderStoryChapterList(current);
}
function getStoryCopyText(){
  var prologue=document.getElementById('storyPrologue');
  var story=document.getElementById('storyChapterText');
  var scene=document.getElementById('storySceneText');
  var clue=document.getElementById('storyClueText');
  var emotion=document.getElementById('storyEmotionText');
  var secret=document.getElementById('storySecretText');
  var next=document.getElementById('storyNextText');
  var relic=document.getElementById('storyRelicText');
  var pieces=document.getElementById('storyLightPieces');
  var rows=[];
  rows.push('한글 마을 이야기');
  rows.push(prologue?prologue.textContent.trim():'');
  rows.push('이야기 줄기');
  STORY_ARC.forEach(function(item){rows.push(item.label+': '+item.text);});
  rows.push(story?story.textContent.trim():'');
  rows.push(scene?scene.textContent.trim():'');
  rows.push(clue?clue.textContent.trim():'');
  rows.push(emotion?'하니의 마음: '+emotion.textContent.trim():'');
  rows.push(secret?'마을의 비밀: '+secret.textContent.trim():'');
  rows.push(next?'다음 예고: '+next.textContent.trim():'');
  rows.push(relic?'오늘의 보물: '+relic.textContent.trim():'');
  rows.push(pieces?pieces.textContent.trim():'빛 조각 0 / 3');
  rows.push('오늘의 모험');
  STORY_CHAPTERS.forEach(function(ch){
    rows.push((mission&&mission[ch.key]?'✓ ':'○ ')+ch.title+' - '+ch.place+' / 보상: '+ch.reward);
  });
  return rows.filter(Boolean).join('\n');
}
function copyTextToClipboard(text){
  if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(text);}
  var area=document.createElement('textarea');
  area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.left='-9999px';
  document.body.appendChild(area);area.select();
  var ok=document.execCommand('copy');
  document.body.removeChild(area);
  return ok?Promise.resolve():Promise.reject(new Error('copy failed'));
}
function handleStoryCopy(){
  var status=document.getElementById('copyStoryStatus');
  copyTextToClipboard(getStoryCopyText()).then(function(){
    if(status)status.textContent='복사됐어요';
    setTimeout(function(){if(status)status.textContent='';},1600);
  }).catch(function(){if(status)status.textContent='길게 눌러 직접 복사해 주세요';});
}
function initAdventureHome(){
  renderStoryArc();
  buildAdventureMap();
  document.getElementById('routeLetter').addEventListener('click',openTodayLetter);
  document.getElementById('routeWord').addEventListener('click',function(){openWordBuild(todayWord[0],todayWord[1]);});
  document.getElementById('routePlay').addEventListener('click',function(){go('listen');});
  document.getElementById('copyStoryText').addEventListener('click',handleStoryCopy);
}
