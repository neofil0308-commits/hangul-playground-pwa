// Persistent app state and daily mission lifecycle for 하니의 한글 모험.
// Keep DOM rendering in index.html; this file owns storage, daily picks, and mission mutation.

function lsGet(k,d){try{const v=localStorage.getItem(k);return v===null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsJSON(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSetJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function yKey(){var y=new Date();y.setDate(y.getDate()-1);return y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();}

var MD=todayKey();
var seenLetters=lsJSON('hp_seen_letters',[]);
var seenWords=lsJSON('hp_seen_words',[]);
var listenTry=parseInt(lsGet('hp_listen_try','0'))||0;
var listenCorrect=parseInt(lsGet('hp_listen_correct','0'))||0;
var streak=parseInt(lsGet('hp_streak','0'))||0;
var lastDone=lsGet('hp_lastdone','');

function markLetterSeen(ch){if(seenLetters.indexOf(ch)<0){seenLetters.push(ch);lsSetJSON('hp_seen_letters',seenLetters);}}
function markWordSeen(w){if(seenWords.indexOf(w)<0){seenWords.push(w);lsSetJSON('hp_seen_words',seenWords);}}

var ALL_LETTERS=CONS.concat(VOWS);
var ALL_WORDS=[];Object.values(WORDS).forEach(function(a){a.forEach(function(w){ALL_WORDS.push(w);});});
function hashStr(s){var h=5381;for(var i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h;}

// ===== 커리큘럼 진행도 + 별빛 앨범 =====
// idx: 현재 에피소드(글자) 위치, mastery: 글자별 익힘 기록, album: 켠 별 글자, milestones: 띄운 맛보기.
var progress=lsJSON('hp_progress',{idx:0,mastery:{},album:[],milestones:[]});
function saveProgress(){lsSetJSON('hp_progress',progress);}
function curEpisode(){return EPISODE_PATH[Math.min(progress.idx,EPISODE_PATH.length-1)];}
// 글자형 막 → 자모 객체(소리/예시). 합치기형(combine) 막 → 목표 음절을 분해한 합성 객체(목표+필요한 자모 카드).
function combineTarget(ep){
  if(!ep||ep.type!=='combine'||!ep.ch)return null;
  var jamo=(typeof decompose==='function')?(decompose(ep.ch)[0]||[]):[];
  return {ch:ep.ch,sound:ep.ch,combine:true,jamo:jamo,word:ep.word||'',emoji:ep.emoji||''};
}
// 문장형 막(8막) → 문장 텍스트 + 토큰화한 단어 + 그림 단서를 담은 합성 객체.
// ch:'📖'를 둬서 todayLetter.ch를 참조하는 코드가 깨지지 않게 함(랜덤 글자 폴백 방지).
function sentenceTarget(ep){
  if(!ep||ep.type!=='sentence'||!ep.sent)return null;
  var words=(ep.words&&ep.words.length)?ep.words.slice():ep.sent.split(' ');
  var cues=(ep.cues&&ep.cues.length)?ep.cues.slice():((typeof sentCues==='function')?sentCues(words):[]);
  return {ch:'📖',sound:ep.sent,sentence:true,sent:ep.sent,words:words,cues:cues,word:words[0]||'',emoji:cues[0]||''};
}
function curLetterObj(){var ep=curEpisode();if(!ep)return null;
  if(ep.type==='letter')return ALL_LETTER_OBJS[ep.ch]||null;
  if(ep.type==='combine')return combineTarget(ep);
  if(ep.type==='sentence')return sentenceTarget(ep);
  return null;}
function masteredLetters(){return Object.keys(progress.mastery).filter(function(ch){return isMasteredRec(progress.mastery[ch]);});}
function markLetterProgress(part){var ep=curEpisode();if(!ep||(ep.type!=='letter'&&ep.type!=='combine'))return;
  var rec=progress.mastery[ep.ch]||(progress.mastery[ep.ch]={met:false,matched:false,quizzed:false});
  if(part==='letter')rec.met=true;else if(part==='word')rec.matched=true;else if(part==='play')rec.quizzed=true;
  saveProgress();}
function letterDone(){var ep=curEpisode();if(!ep||ep.type!=='letter')return false;return isMasteredRec(progress.mastery[ep.ch]);}
function addAlbumStar(){var ep=curEpisode();if(!ep||(ep.type!=='letter'&&ep.type!=='combine')||!ep.ch)return;if(progress.album.indexOf(ep.ch)<0){progress.album.push(ep.ch);saveProgress();}}
function advanceEpisode(){if(progress.idx<EPISODE_PATH.length-1){progress.idx++;saveProgress();}}
function checkMilestone(){return pendingMilestone(masteredLetters(),progress.milestones);}
function markMilestoneShown(word){if(progress.milestones.indexOf(word)<0){progress.milestones.push(word);saveProgress();}}

// ===== 주제 풀: 게임이 랜덤 대신 '오늘의 글자(+이미 익힌 글자)'를 앞세워 쓰도록 =====
// 오늘의 글자를 맨 앞에, 그 뒤로 이미 익힌 글자들. 게임은 여기서부터 채우고 모자라면 전체로 보충.
function themeLetterChs(){var a=[];if(typeof todayLetter!=='undefined'&&todayLetter)a.push(todayLetter.ch);
  (typeof masteredLetters==='function'?masteredLetters():[]).forEach(function(ch){if(a.indexOf(ch)<0)a.push(ch);});return a;}
function themeWordList(){var ws=[],seen={};themeLetterChs().forEach(function(ch){(LETTER_WORDS[ch]||[]).forEach(function(w){if(!seen[w[0]]){seen[w[0]]=1;ws.push(w);}});});return ws;}

var todayLetter=null,todayWord=null;
// 오늘의 글자/단어는 날짜 랜덤이 아니라 커리큘럼 진행 포인터에서 뽑는다.
function pickToday(){
  var lo=curLetterObj();
  if(lo){todayLetter=lo;todayWord=[lo.word||'',lo.emoji||''];}
  else{var h=hashStr(MD);todayLetter=ALL_LETTERS[h%ALL_LETTERS.length];todayWord=[todayLetter.word||'',todayLetter.emoji||''];}
}

var mission=lsJSON('hp_mission',{});
// 미션은 날짜가 아니라 현재 에피소드(글자)에 묶인다. 글자가 바뀌면 새 미션, 같은 글자는 여러 날 이어감.
function loadMission(){pickToday();if(mission.ep!==progress.idx){mission={ep:progress.idx,date:MD,letter:false,word:false,play:false,rewarded:false};lsSetJSON('hp_mission',mission);}}
function saveMission(){lsSetJSON('hp_mission',mission);}
function updateStreak(){if(lastDone===MD)return;streak=(lastDone===yKey())?streak+1:1;lastDone=MD;lsSet('hp_streak',streak);lsSet('hp_lastdone',lastDone);}
function completeMission(part){if(!mission||mission[part])return;mission[part]=true;mission.lastReaction=part;markLetterProgress(part);saveMission();showHaniReaction(part);renderMission();}
// 글자 공방(3막): 음절 하나를 합쳐 완성하면 그 막의 단일 미션이 한 번에 끝난다(글자형 3단계 대신 1단계).
function completeCombine(){var ep=curEpisode();if(!ep||ep.type!=='combine'||!mission||mission.letter)return;
  if(ep.ch){progress.mastery[ep.ch]={met:true,matched:true,quizzed:true};saveProgress();}
  mission.letter=true;mission.word=true;mission.play=true;mission.lastReaction='all';saveMission();
  if(typeof showHaniReaction==='function')showHaniReaction('all');
  if(typeof renderMission==='function')renderMission();}
// 이야기 책(8막·졸업): 문장을 스스로 읽으면 단일 미션이 한 번에 끝난다.
// 문장은 단일 글자(ch)가 아니므로 mastery/album을 더럽히지 않고, 미션 플래그만 채워 n===3 보상 게이트를 연다.
function completeStory(){var ep=curEpisode();if(!ep||ep.type!=='sentence'||!mission||mission.letter)return;
  mission.letter=true;mission.word=true;mission.play=true;mission.lastReaction='all';saveMission();
  if(typeof showHaniReaction==='function')showHaniReaction('all');
  if(typeof renderMission==='function')renderMission();}
