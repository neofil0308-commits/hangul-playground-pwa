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

var todayLetter=null,todayWord=null;
function pickToday(){var h=hashStr(MD);todayLetter=ALL_LETTERS[h%ALL_LETTERS.length];todayWord=ALL_WORDS[Math.floor(h/11)%ALL_WORDS.length];}

var mission=lsJSON('hp_mission',{});
function loadMission(){pickToday();if(mission.date!==MD){mission={date:MD,letter:false,word:false,play:false,rewarded:false};lsSetJSON('hp_mission',mission);}}
function saveMission(){lsSetJSON('hp_mission',mission);}
function updateStreak(){if(lastDone===MD)return;streak=(lastDone===yKey())?streak+1:1;lastDone=MD;lsSet('hp_streak',streak);lsSet('hp_lastdone',lastDone);}
function completeMission(part){if(!mission||mission[part])return;mission[part]=true;mission.lastReaction=part;saveMission();showHaniReaction(part);renderMission();}
