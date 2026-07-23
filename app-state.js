// Persistent app state and daily mission lifecycle for 하니의 한글 모험.
// Keep DOM rendering in index.html; this file owns storage, daily picks, and mission mutation.

// ===== 다자녀 프로필: 저장 키를 프로필별(p<id>:)로 분리. 프로필 레지스트리 2개만 전역. =====
function _rawGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function _rawSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
var _GLOBAL_KEYS={hp_profiles:1,hp_active_profile:1};
function activeProfile(){return _rawGet('hp_active_profile')||'1';}
function _pk(k){return _GLOBAL_KEYS[k]?k:('p'+activeProfile()+':'+k);}
// 기존 단일 사용자 데이터를 첫 프로필(p1:)로 1회 이전(진도 보존). 프로필 도입 전 사용자 구제.
(function _migrateProfiles(){try{
  if(_rawGet('hp_profiles'))return; // 이미 이전됨
  var keys=['hp_progress','hp_mission','hp_stickers','hp_streak','hp_lastdone','hp_seen_letters','hp_seen_words','hp_listen_try','hp_listen_correct','hp_active_days','hp_today','hp_daily_goal','hp_voice','hp_rate','hp_vol_voice','hp_vol_sfx','hp_vol_bgm','hp_sfx','hp_bgm','hp_intro_seen'];
  keys.forEach(function(k){var v=_rawGet(k);if(v!==null&&_rawGet('p1:'+k)===null)_rawSet('p1:'+k,v);});
  _rawSet('hp_active_profile','1');
  _rawSet('hp_profiles',JSON.stringify([{id:'1',name:'첫째',emoji:'🐣'}]));
}catch(e){}})();
function getProfiles(){var a=lsJSON('hp_profiles',null);if(!a||!a.length){a=[{id:'1',name:'첫째',emoji:'🐣'}];lsSetJSON('hp_profiles',a);}return a;}
// ===== 프리미엄 훅(비활성) — 무료 배포로 전환. 함수/상수는 남겨두되 게이트는 항상 개방. =====
// (스토어 IAP 재도입 시 accessAllowed·canAddProfile 두 함수만 되돌리면 됨.)
function isUnlocked(){return _rawGet('hp_unlocked')==='1';}
function unlockPremium(){_rawSet('hp_unlocked','1');}   // ← 스토어 인앱결제 성공 시 호출(현재 무료라 무의미).
function relockPremium(){_rawSet('hp_unlocked','0');}   // 테스트용 되돌리기.
function tryUnlockCode(code){if(typeof UNLOCK_CODE!=='undefined'&&code&&String(code).trim().toUpperCase()===UNLOCK_CODE){unlockPremium();return true;}return false;}
// 콘텐츠 게이트: 무료 배포 — 전 구간(1~8막) 개방.
function accessAllowed(){return true;}
// 프로필 게이트: 무료 배포 — 아이 프로필 무제한 추가 허용.
function canAddProfile(){return true;}
function currentProfile(){var id=activeProfile();return getProfiles().filter(function(p){return p.id===id;})[0]||getProfiles()[0];}
function addProfile(name,emoji){var a=getProfiles();var id=''+(Date.now?Date.now():(a.length+1))+a.length;a.push({id:id,name:(name||('아이 '+(a.length+1))).slice(0,8),emoji:emoji||'🐥'});lsSetJSON('hp_profiles',a);return id;}
function switchProfile(id){_rawSet('hp_active_profile',id);try{location.reload();}catch(e){}}

function lsGet(k,d){try{const v=localStorage.getItem(_pk(k));return v===null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(_pk(k),v);}catch(e){}}
function lsJSON(k,d){try{var v=localStorage.getItem(_pk(k));return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSetJSON(k,v){try{localStorage.setItem(_pk(k),JSON.stringify(v));}catch(e){}}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function yKey(){var y=new Date();y.setDate(y.getDate()-1);return y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();}

var MD=todayKey();
var seenLetters=lsJSON('hp_seen_letters',[]);
var seenWords=lsJSON('hp_seen_words',[]);
var listenTry=parseInt(lsGet('hp_listen_try','0'))||0;
var listenCorrect=parseInt(lsGet('hp_listen_correct','0'))||0;
var streak=parseInt(lsGet('hp_streak','0'))||0;
var lastDone=lsGet('hp_lastdone','');
// 부모 대시보드용 일별 활동 기록(주간 출석 캘린더). 최근 60일만 유지.
var activeDays=lsJSON('hp_active_days',[]);
function markActiveDay(){if(activeDays.indexOf(MD)<0){activeDays.push(MD);if(activeDays.length>60)activeDays=activeDays.slice(-60);lsSetJSON('hp_active_days',activeDays);}}
// 하루 학습량(스크린타임 넛지용). 하루 목표에 도달하면 '오늘은 여기까지' 부드럽게 권함(강제 X, 부모가 목표 설정).
var _today=lsJSON('hp_today',{d:MD,n:0});if(!_today||_today.d!==MD)_today={d:MD,n:0};
function todayEpisodeCount(){return (_today&&_today.d===MD)?(_today.n||0):0;}
function bumpTodayCount(){if(!_today||_today.d!==MD)_today={d:MD,n:0};_today.n=(_today.n||0)+1;lsSetJSON('hp_today',_today);}
var dailyGoal=parseInt(lsGet('hp_daily_goal','2'));if(isNaN(dailyGoal))dailyGoal=2; // 0=제한 없음
function setDailyGoal(n){dailyGoal=n;lsSet('hp_daily_goal',String(n));}
function dailyGoalReached(){return dailyGoal>0&&todayEpisodeCount()>=dailyGoal;}

function markLetterSeen(ch){if(seenLetters.indexOf(ch)<0){seenLetters.push(ch);lsSetJSON('hp_seen_letters',seenLetters);}}
function markWordSeen(w){if(seenWords.indexOf(w)<0){seenWords.push(w);lsSetJSON('hp_seen_words',seenWords);}}

// 여정에 나오는 글자 전부(쌍자음 5막·복모음 6막 포함). 게임 보기 풀의 원천.
var ALL_LETTERS=CONS.concat(VOWS).concat(CONS_DOUBLE).concat(VOWS_COMPLEX);
// 기본 24자 — 날짜 해시 폴백처럼 '아무 글자나' 골라도 되는 자리에만 쓴다.
var BASIC_LETTERS=CONS.concat(VOWS);
// 글자 → 커리큘럼에서 처음 등장하는 막.
var LETTER_FIRST_ACT=(function(){var m={};EPISODE_PATH.forEach(function(e){
  if(e.type==='letter'&&e.ch&&!(e.ch in m))m[e.ch]=e.act;});return m;})();
function isVowelCh(ch){
  return (typeof VOWS!=='undefined'&&VOWS.some(function(v){return v.ch===ch;}))
      ||(typeof VOWS_COMPLEX!=='undefined'&&VOWS_COMPLEX.some(function(v){return v.ch===ch;}));
}
// 지금까지 여정에서 배운 낱자 — 조립판(단어 동산·글자 공방)의 방해 카드 풀.
// 이전에는 CHO/JUNG 배열을 인덱스로 잘라 써서 4막 조립판에 ㄲ(5막)·ㅐ(6막)처럼
// 아직 배우지 않은 자모가 카드로 나왔다.
function taughtJamo(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  var act=ep?ep.act:8;
  var out=[];
  for(var ch in LETTER_FIRST_ACT){if(LETTER_FIRST_ACT[ch]<=act)out.push(ch);}
  return out.length?out:CONS.map(function(c){return c.ch;}).concat(VOWS.map(function(v){return v.ch;}));
}

// 게임 오답 후보 규칙(듣고찾기·복습 공용) — 2026-07-22 정합성 수정.
//  ① 정답과 같은 계열(자음/모음)만. 계열이 다르면 색·모양으로 티가 나 소리를 안 듣고도 맞힌다.
//  ② 여정에서 이미 지나온 글자만. 아직 안 배운 글자가 오답이면 혼란스럽다.
// 이전에는 풀이 기본 24자뿐이라 5막 쌍자음·6막 복모음이 정답일 때 정답만 모양이 달랐다.
function letterPool(ch){
  var isV=isVowelCh(ch);
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  var act=ep?ep.act:8;
  var same=ALL_LETTERS.filter(function(o){return o.ch!==ch&&isVowelCh(o.ch)===isV;});
  var seen=same.filter(function(o){var a=LETTER_FIRST_ACT[o.ch];return a!==undefined&&a<=act;});
  return seen.length>=3?seen:same; // 여정 초반엔 후보가 모자라니 같은 계열 전체로 넓힌다
}
var ALL_WORDS=[];Object.values(WORDS).forEach(function(a){a.forEach(function(w){ALL_WORDS.push(w);});});
function hashStr(s){var h=5381;for(var i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h;}

// ===== 커리큘럼 진행도 + 별빛 앨범 =====
// idx: 현재 에피소드(글자) 위치, mastery: 글자별 익힘 기록, album: 켠 별 글자, milestones: 띄운 맛보기.
var progress=lsJSON('hp_progress',{idx:0,mastery:{},album:[],milestones:[],relics:[]});
// 옛 저장본 관대 처리: relics 없던 진행도 깨지지 않게 기본 빈 배열.
if(!progress.relics)progress.relics=[];
// 간격 반복 복습(SRS) 저장소. 옛 저장본 관대 처리.
if(!progress.review||typeof progress.review!=='object')progress.review={};
// 막 시작 그림책을 이미 본 막 번호 목록(막마다 1회만 자동 노출). 옛 저장본 관대 처리.
if(!Array.isArray(progress.actIntrosSeen))progress.actIntrosSeen=[];
function saveProgress(){lsSetJSON('hp_progress',progress);}
function actIntroSeen(n){return (progress.actIntrosSeen||[]).indexOf(n)>=0;}
function markActIntroSeen(n){if(!progress.actIntrosSeen)progress.actIntrosSeen=[];if(progress.actIntrosSeen.indexOf(n)<0){progress.actIntrosSeen.push(n);saveProgress();}}
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
  if(!ep||(ep.type!=='sentence'&&ep.type!=='finale')||!ep.sent)return null;
  var words=(ep.words&&ep.words.length)?ep.words.slice():ep.sent.split(' ');
  var cues=(ep.cues&&ep.cues.length)?ep.cues.slice():((typeof sentCues==='function')?sentCues(words):[]);
  return {ch:'📖',sound:ep.sent,sentence:true,sent:ep.sent,words:words,cues:cues,word:words[0]||'',emoji:cues[0]||''};
}
// 4막 받침(끝소리) 에피소드 → 같은 자음을 '끝소리'로 가르치는 변형 객체.
// ch는 맨 자음 그대로(큰 글자·소리·받아쓰기 재사용), final 플래그 + 받침 예시단어(FINAL_WORDS)를 얹는다.
function finalLetterObj(ep){var base=ALL_LETTER_OBJS[ep.ch]||null;if(!base)return null;
  var fw=(typeof FINAL_WORDS!=='undefined'&&FINAL_WORDS[ep.ch])||[];
  var o={};for(var k in base)o[k]=base[k];o.final=true;o.words=fw;
  if(fw[0]){o.word=fw[0][0];o.emoji=fw[0][1];}
  return o;}
function curLetterObj(){var ep=curEpisode();if(!ep)return null;
  if(ep.type==='letter')return ep.final?finalLetterObj(ep):(ALL_LETTER_OBJS[ep.ch]||null);
  if(ep.type==='combine')return combineTarget(ep);
  if(ep.type==='sentence'||ep.type==='finale')return sentenceTarget(ep);
  return null;}
// 진행/앨범 키: 보통은 글자, 4막 받침은 'F:'+글자, 7막은 'W:'+단어(첫 낱자가 겹쳐도 화가 구분되게).
function progKey(ep){if(!ep)return '';
  if(ep.type==='finale')return 'FIN';
  if(ep.type==='word'&&ep.word)return 'W:'+ep.word;
  return (ep.final?'F:':'')+(ep.ch||'');}
// 마스터 목록은 낱자만 — 받침 키('F:')와 7막 단어 키('W:')는 게임/복습 풀을 더럽히지 않게 제외.
// (오답노트 #1: 풀에 넣는 지점과 꺼내는 지점 양쪽에 필터를 둔다)
function masteredLetters(){return Object.keys(progress.mastery).filter(function(ch){
  return ch.indexOf('F:')!==0&&ch.indexOf('W:')!==0&&isMasteredRec(progress.mastery[ch]);});}

// ===== 간격 반복 복습(SRS, Leitner) — 뗀 글자를 점점 긴 간격으로 재확인해 파지를 강화 =====
// box(1~5)가 오를수록 다음 복습까지 간격이 길어진다. 맞히면 승급, 틀리면 box1로 리셋.
var REVIEW_INTERVALS={1:1,2:2,3:4,4:7,5:14}; // box → 다음 복습까지 일수
function _ymd(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function dayKeyAdd(key,n){var p=String(key).split('-');var d=new Date(+p[0],(+p[1])-1,+p[2]);d.setDate(d.getDate()+(n||0));return _ymd(d);}
function dayKeyLE(a,b){var pa=String(a).split('-'),pb=String(b).split('-');return new Date(+pa[0],pa[1]-1,+pa[2]).getTime()<=new Date(+pb[0],pb[1]-1,+pb[2]).getTime();}
// 복습·게임 풀에 넣을 수 있는 '낱자'인지 — 3막 음절('바')·8막 문장('📖')이 낱자 찾기 복습을 더럽히지 않게.
function isJamoCh(ch){return !!ch&&((typeof CHO!=='undefined'&&CHO.indexOf(ch)>=0)||(typeof JUNG!=='undefined'&&JUNG.indexOf(ch)>=0));}
// 뗀 글자를 복습 일정에 등록(이미 있으면 유지). 첫 복습은 내일부터. 낱자만(음절·받침키 제외).
function scheduleReview(ch){if(!ch||ch.indexOf('F:')===0||!isJamoCh(ch))return;if(!progress.review)progress.review={};
  if(!progress.review[ch]){progress.review[ch]={box:1,due:dayKeyAdd(MD,1)};saveProgress();}}
// 오늘(MD) 기준 복습 예정(due<=오늘)인 글자들. 낱자만(옛 저장본에 섞인 음절 방어적으로 제외).
function dueReviewChs(){var r=progress.review||{},out=[];
  Object.keys(r).forEach(function(ch){if(ch.indexOf('F:')===0||!isJamoCh(ch))return;var rec=r[ch];if(rec&&rec.due&&dayKeyLE(rec.due,MD))out.push(ch);});
  return out;}
// ===== 적응 난이도 + 지연 마스터리 =====
// 글자별 정답/오답 통계. 옛 저장본 관대 처리.
if(!progress.stats||typeof progress.stats!=='object')progress.stats={};
function recordAttempt(ch,correct){if(!ch)return;var s=progress.stats[ch]||(progress.stats[ch]={r:0,w:0});if(correct)s.r++;else s.w++;}
// 글자 강도: 복습 box + 정답률로 weak/ok/strong 판정 → 적응 난이도에 사용.
function letterStrength(ch){var rec=(progress.review||{})[ch];var box=rec?(rec.box||0):0;
  var s=progress.stats[ch]||{r:0,w:0};var tot=s.r+s.w;var acc=tot?s.r/tot:1;
  if(box<=1||acc<0.5)return 'weak';if(box>=4&&acc>=0.85)return 'strong';return 'ok';}
// 적응: 약한 글자는 보기 적게(쉽게), 강한 글자는 많게(어렵게).
function reviewOptionCount(ch){var st=letterStrength(ch);return st==='weak'?2:(st==='strong'?4:3);}
// 지연 마스터리: 3게이트만으론 '익히는 중', SRS 복습을 1번이라도 통과(box>=2)하면 '완전히 뗌' 확정.
function confirmedLetters(){var r=progress.review||{};return Object.keys(r).filter(function(c){return c.indexOf('F:')!==0&&r[c]&&(r[c].box||0)>=2;});}
function isConfirmed(ch){var rec=(progress.review||{})[ch];return !!(rec&&(rec.box||0)>=2);}

// 복습 채점: 맞으면 box↑·간격↑, 틀리면 box1·내일 다시. 통계도 기록(적응 난이도).
function gradeReview(ch,correct){if(!ch)return;if(!progress.review)progress.review={};
  var rec=progress.review[ch]||{box:1,due:MD};
  rec.box=correct?Math.min((rec.box||1)+1,5):1;
  rec.due=dayKeyAdd(MD,REVIEW_INTERVALS[rec.box]||1);
  progress.review[ch]=rec;recordAttempt(ch,correct);saveProgress();}
// 복습 큐 정렬: 약한 글자 먼저(약→보통→강) 보여줘 헤매는 글자에 집중.
function orderByWeakness(chs){var rank={weak:0,ok:1,strong:2};
  function r(ch){var v=rank[letterStrength(ch)];return v==null?1:v;} // 0(weak)이 falsy로 덮이지 않게
  return chs.slice().sort(function(a,b){return r(a)-r(b);});}
// 기존 사용자 시딩: 이미 뗀 글자인데 복습 일정 없으면 오늘부터 복습 대상으로.
(function seedReview(){try{var chs=masteredLetters(),changed=false;
  chs.forEach(function(ch){if(!isJamoCh(ch))return;if(!progress.review[ch]){progress.review[ch]={box:1,due:MD};changed=true;}});
  if(changed)saveProgress();}catch(e){}})();

function markLetterProgress(part){if(part==='find')return;/* 글자 찾기는 추가 활동 플래그 — 마스터 키(met/matched/quizzed)에 영향 없음 */
  var ep=curEpisode();if(!ep||(ep.type!=='letter'&&ep.type!=='combine'))return;
  var key=progKey(ep);
  var rec=progress.mastery[key]||(progress.mastery[key]={met:false,matched:false,quizzed:false});
  if(part==='letter')rec.met=true;else if(part==='word')rec.matched=true;else if(part==='play')rec.quizzed=true;
  saveProgress();
  if(ep.ch&&!ep.final&&isMasteredRec(rec))scheduleReview(ep.ch); // 뗀 즉시 복습 일정 등록
}
function letterDone(){var ep=curEpisode();if(!ep||ep.type!=='letter')return false;return isMasteredRec(progress.mastery[progKey(ep)]);}
function addAlbumStar(){var ep=curEpisode();if(!ep||(ep.type!=='letter'&&ep.type!=='combine')||!ep.ch)return;var key=progKey(ep);if(progress.album.indexOf(key)<0){progress.album.push(key);saveProgress();}}
// 여정의 마지막 화인가 — 졸업 연출과 '다음' 버튼 처리를 여기 하나로 판정한다.
function isLastEpisode(){return progress.idx>=EPISODE_PATH.length-1;}
function advanceEpisode(){if(progress.idx<EPISODE_PATH.length-1){progress.idx++;saveProgress();}}
function checkMilestone(){return pendingMilestone(masteredLetters(),progress.milestones);}
function markMilestoneShown(word){if(progress.milestones.indexOf(word)<0){progress.milestones.push(word);saveProgress();}}
// ===== 막 클리어 보물(relic) =====
// 막 번호 → CURRICULUM 막 객체(보물 이름/이모지 조회). act는 1부터, 배열 인덱스와 어긋날 수 있어 탐색.
function actCurriculum(n){for(var i=0;i<CURRICULUM.length;i++){if(CURRICULUM[i].act===n)return CURRICULUM[i];}return null;}
// 막 번호 → {act,relic,emoji}. 보물 연출/선반에서 같이 씀.
function relicForAct(n){var a=actCurriculum(n);return a?{act:n,relic:a.relic,emoji:a.relicEmoji||'⭐'}:null;}
function hasRelic(n){return (progress.relics||[]).indexOf(n)>=0;}
// 막 클리어 시 보물 적립(중복 방지). 한 막당 한 번만 쌓인다.
function awardRelic(n){if(!progress.relics)progress.relics=[];if(progress.relics.indexOf(n)<0){progress.relics.push(n);saveProgress();}}
// idx 에피소드가 그 막의 '마지막' 에피소드면 그 막 번호를, 아니면 0을 돌려줌.
// 다음 노드가 다른 막이거나(막 경계) idx가 경로의 끝이면 막이 끝난 것.
function actCompletedAt(idx){
  if(idx<0||idx>=EPISODE_PATH.length)return 0;
  var cur=EPISODE_PATH[idx];if(!cur)return 0;
  var nxt=EPISODE_PATH[idx+1];
  if(!nxt||nxt.act!==cur.act)return cur.act;
  return 0;
}

// ===== 주제 풀: 게임이 랜덤 대신 '오늘의 글자(+이미 익힌 글자)'를 앞세워 쓰도록 =====
// 오늘의 글자를 맨 앞에, 그 뒤로 이미 익힌 글자들. 게임은 여기서부터 채우고 모자라면 전체로 보충.
function themeLetterChs(){var a=[];if(typeof todayLetter!=='undefined'&&todayLetter)a.push(todayLetter.ch);
  (typeof masteredLetters==='function'?masteredLetters():[]).forEach(function(ch){if(a.indexOf(ch)<0)a.push(ch);});return a;}
function themeWordList(){var ws=[],seen={};themeLetterChs().forEach(function(ch){(LETTER_WORDS[ch]||[]).forEach(function(w){if(!seen[w[0]]){seen[w[0]]=1;ws.push(w);}});});return ws;}

var todayLetter=null,todayWord=null;
// 오늘의 대표 단어: 글자별 예시 뱅크에서 날짜 기반 로테이션(같은 날 고정·날마다 다름) → 같은 글자를 여러 날 봐도 예시가 신선.
function featuredWord(lo){
  if(!lo)return ['',''];
  if(lo.combine||lo.sentence)return [lo.word||'',lo.emoji||''];
  var bank=(lo.ch&&typeof LETTER_WORDS!=='undefined'&&LETTER_WORDS[lo.ch])||null;
  if(bank&&bank.length){
    var p=String(MD).split('-');var dnum=Math.floor(new Date(+p[0],(+p[1])-1,+p[2]).getTime()/86400000);
    var w=bank[((dnum+hashStr(lo.ch))%bank.length+bank.length)%bank.length]; // 날짜 순번+글자 오프셋 → 순차 로테이션
    return [w[0],w[1]];
  }
  return [lo.word||'',lo.emoji||''];
}
// 7막 단어 마을: 그날의 대표 단어를 전체 단어에서 날짜 로테이션으로 고른다(같은 날 고정·날마다 다름).
function wordActWord(){
  var pool=(typeof ALL_WORDS!=='undefined'&&ALL_WORDS.length)?ALL_WORDS:[['사과','🍎']];
  var p=String(MD).split('-');var dnum=Math.floor(new Date(+p[0],(+p[1])-1,+p[2]).getTime()/86400000);
  return pool[((dnum%pool.length)+pool.length)%pool.length];
}
// 오늘의 글자/단어는 날짜 랜덤이 아니라 커리큘럼 진행 포인터에서 뽑는다.
function pickToday(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  // 7막(단어 마을): 오늘의 단어를 정하고, 그 첫 낱자를 오늘의 글자로 삼아 낱자 게임과 단어가 맞물리게 한다.
  if(ep&&ep.type==='word'){
    // 7막은 화마다 단어가 정해져 있다(난이도순). 옛 저장본처럼 단어가 없는 노드면 날짜 로테이션으로 폴백.
    var w=(ep.word)?[ep.word,ep.emoji||'']:wordActWord();
    var init=(typeof decompose==='function')?((decompose(w[0])[0]||[])[0]):'';
    todayLetter=(typeof ALL_LETTER_OBJS!=='undefined'&&ALL_LETTER_OBJS[init])||BASIC_LETTERS[hashStr(MD)%BASIC_LETTERS.length];
    todayWord=w;
    return;
  }
  var lo=curLetterObj();
  if(lo){todayLetter=lo;todayWord=featuredWord(lo);}
  else{var h=hashStr(MD);todayLetter=BASIC_LETTERS[h%BASIC_LETTERS.length];todayWord=featuredWord(todayLetter);}
}

// 오늘의 모험 구성 — 한 곳에서 정한다.
// 글자 막은 4단계(글자 숲·단어 동산·소리 동굴·글자 찾기), 합치기(3막)·문장(8막) 막은
// 활동 하나로 끝나므로 3단계. 이전에는 홈은 4단계로 세고 지도·빛 조각은 3단계로 세어
// "다 했는데 불이 안 켜지는" 상태였다.
function missionParts(){
  var ep=(typeof curEpisode==='function')?curEpisode():null;
  var single=!!(ep&&(ep.type==='combine'||ep.type==='sentence'||ep.type==='finale'));
  return single?['letter','word','play']:['letter','word','play','find'];
}
function missionDoneCount(){var m=(typeof mission!=='undefined'&&mission)||{};
  return missionParts().filter(function(k){return m[k];}).length;}
function missionTotal(){return missionParts().length;}
function missionCurrentPart(){var m=(typeof mission!=='undefined'&&mission)||{};
  var parts=missionParts();
  for(var i=0;i<parts.length;i++){if(!m[parts[i]])return parts[i];}
  return '';}

var mission=lsJSON('hp_mission',{});
// 미션은 날짜가 아니라 현재 에피소드(글자)에 묶인다. 글자가 바뀌면 새 미션, 같은 글자는 여러 날 이어감.
function loadMission(){pickToday();if(mission.ep!==progress.idx){mission={ep:progress.idx,date:MD,letter:false,word:false,play:false,find:false,rewarded:false};lsSetJSON('hp_mission',mission);}}
function saveMission(){lsSetJSON('hp_mission',mission);}
function updateStreak(){if(lastDone===MD)return;streak=(lastDone===yKey())?streak+1:1;lastDone=MD;lsSet('hp_streak',streak);lsSet('hp_lastdone',lastDone);}
function completeMission(part){if(!mission||mission[part])return;mission[part]=true;mission.lastReaction=part;markLetterProgress(part);markActiveDay();saveMission();showHaniReaction(part);renderMission();}
// 글자 공방(3막): 음절 하나를 합쳐 완성하면 그 막의 단일 미션이 한 번에 끝난다(글자형 3단계 대신 1단계).
function completeCombine(){var ep=curEpisode();if(!ep||ep.type!=='combine'||!mission||mission.letter)return;
  if(ep.ch){progress.mastery[ep.ch]={met:true,matched:true,quizzed:true};saveProgress();scheduleReview(ep.ch);}
  mission.letter=true;mission.word=true;mission.play=true;mission.lastReaction='all';saveMission();
  if(typeof showHaniReaction==='function')showHaniReaction('all');
  if(typeof renderMission==='function')renderMission();}
// 이야기 책(8막·졸업): 문장을 스스로 읽으면 단일 미션이 한 번에 끝난다.
// 문장은 단일 글자(ch)가 아니므로 mastery/album을 더럽히지 않고, 미션 플래그만 채워 n===3 보상 게이트를 연다.
function completeStory(){var ep=curEpisode();if(!ep||(ep.type!=='sentence'&&ep.type!=='finale')||!mission||mission.letter)return;
  mission.letter=true;mission.word=true;mission.play=true;mission.lastReaction='all';saveMission();
  if(typeof showHaniReaction==='function')showHaniReaction('all');
  if(typeof renderMission==='function')renderMission();}
