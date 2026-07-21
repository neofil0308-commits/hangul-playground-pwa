// Static learning, story, and UI data for 하니의 한글 모험.
// Keep behavior in index.html; this file should stay side-effect free.

// ===== 수익모델: 1회 구매(비소모성) 프리미엄 (구조) =====
// 무료 체험 = FREE_MAX_ACT 막까지(1막 모음 + 2막 자음). 3막부터 + 둘째 아이 프로필부터 = 프리미엄.
// ₩5,000 1회 구매(스토어 인앱결제)로 전부 해제. 실제 배포 시엔 결제 성공 콜백이 unlockPremium() 직접 호출.
// UNLOCK_CODE: 소프트런칭/소유자 기기 해제용 임시 코드(스토어 IAP가 정식 수단).
const FREE_MAX_ACT=2;
const PREMIUM_PRICE='₩5,000';
const UNLOCK_CODE='HANI-2026';

const CONS=[
  {ch:'ㄱ',name:'기역',word:'기린',emoji:'🦒',init:0},{ch:'ㄴ',name:'니은',word:'나비',emoji:'🦋',init:2},
  {ch:'ㄷ',name:'디귿',word:'다람쥐',emoji:'🐿️',init:3},{ch:'ㄹ',name:'리을',word:'로봇',emoji:'🤖',init:5},
  {ch:'ㅁ',name:'미음',word:'모자',emoji:'🧢',init:6},{ch:'ㅂ',name:'비읍',word:'바나나',emoji:'🍌',init:7},
  {ch:'ㅅ',name:'시옷',word:'사과',emoji:'🍎',init:9},{ch:'ㅇ',name:'이응',word:'오리',emoji:'🦆',init:11},
  {ch:'ㅈ',name:'지읒',word:'자동차',emoji:'🚗',init:12},{ch:'ㅊ',name:'치읓',word:'치즈',emoji:'🧀',init:14},
  {ch:'ㅋ',name:'키읔',word:'코끼리',emoji:'🐘',init:15},{ch:'ㅌ',name:'티읕',word:'토끼',emoji:'🐰',init:16},
  {ch:'ㅍ',name:'피읖',word:'포도',emoji:'🍇',init:17},{ch:'ㅎ',name:'히읗',word:'호랑이',emoji:'🐯',init:18},
];
const VOWS=[
  {ch:'ㅏ',sound:'아',word:'아기',emoji:'👶',med:0},{ch:'ㅑ',sound:'야',word:'야구',emoji:'⚾',med:2},
  {ch:'ㅓ',sound:'어',word:'어항',emoji:'🐠',med:4},{ch:'ㅕ',sound:'여',word:'여우',emoji:'🦊',med:6},
  {ch:'ㅗ',sound:'오',word:'오이',emoji:'🥒',med:8},{ch:'ㅛ',sound:'요',word:'요요',emoji:'🪀',med:12},
  {ch:'ㅜ',sound:'우',word:'우산',emoji:'☂️',med:13},{ch:'ㅠ',sound:'유',word:'유니콘',emoji:'🦄',med:17},
  {ch:'ㅡ',sound:'으',word:'음악',emoji:'🎵',med:18},{ch:'ㅣ',sound:'이',word:'이빨',emoji:'🦷',med:20},
];
// 복합·이중 모음(6막 숨은 모음). med=JUNG 인덱스. sound=ㅇ 받친 소릿값(애·에…). 기본 VOWS와 같은 모양.
// 드문 모음(ㅒㅙㅞ)은 4세에 맞는 깔끔한 단어가 없어 소리 위주(억지 단어 금지).
const VOWS_COMPLEX=[
  {ch:'ㅐ',sound:'애',word:'개미',emoji:'🐜',med:1},{ch:'ㅔ',sound:'에',word:'게',emoji:'🦀',med:5},
  {ch:'ㅒ',sound:'얘',word:'얘기',emoji:'💬',med:3},{ch:'ㅖ',sound:'예',word:'시계',emoji:'🕐',med:7},
  {ch:'ㅘ',sound:'와',word:'사과',emoji:'🍎',med:9},{ch:'ㅙ',sound:'왜',word:'돼지',emoji:'🐷',med:10},
  {ch:'ㅚ',sound:'외',word:'참외',emoji:'🍈',med:11},{ch:'ㅝ',sound:'워',word:'원숭이',emoji:'🐵',med:14},
  {ch:'ㅞ',sound:'웨',word:'스웨터',emoji:'🧥',med:15},{ch:'ㅟ',sound:'위',word:'귀',emoji:'👂',med:16},
  {ch:'ㅢ',sound:'의',word:'의자',emoji:'🪑',med:19},
];
// 쌍자음(5막 쌍둥이 소리). init=CHO 인덱스. 기본 자음과 같은 모양(된소리).
const CONS_DOUBLE=[
  {ch:'ㄲ',name:'쌍기역',word:'꿀',emoji:'🍯',init:1},{ch:'ㄸ',name:'쌍디귿',word:'딸기',emoji:'🍓',init:4},
  {ch:'ㅃ',name:'쌍비읍',word:'아빠',emoji:'👨',init:8},{ch:'ㅆ',name:'쌍시옷',word:'쌀',emoji:'🍚',init:10},
  {ch:'ㅉ',name:'쌍지읒',word:'짜장면',emoji:'🍜',init:13},
];
const FINALS=[{ch:'·',jong:0},{ch:'ㄱ',jong:1},{ch:'ㄴ',jong:4},{ch:'ㄷ',jong:7},{ch:'ㄹ',jong:8},{ch:'ㅁ',jong:16},{ch:'ㅂ',jong:17},{ch:'ㅅ',jong:19},{ch:'ㅇ',jong:21}];
const WORDS={
  '동물':[['강아지','🐶'],['고양이','🐱'],['토끼','🐰'],['호랑이','🐯'],['코끼리','🐘'],['기린','🦒'],['사자','🦁'],['곰','🐻'],['여우','🦊'],['오리','🦆'],['돼지','🐷'],['거북이','🐢'],['낙타','🐪'],['펭귄','🐧'],['말','🐴'],['양','🐑'],['새','🐦'],['악어','🐊'],['하마','🦛'],['다람쥐','🐿️']],
  '먹거리':[['사과','🍎'],['바나나','🍌'],['포도','🍇'],['딸기','🍓'],['수박','🍉'],['우유','🥛'],['빵','🍞'],['치즈','🧀'],['김밥','🍙'],['사탕','🍬'],['레몬','🍋'],['멜론','🍈'],['도넛','🍩'],['케이크','🍰'],['오렌지','🍊'],['옥수수','🌽'],['체리','🍒'],['햄버거','🍔'],['토마토','🍅'],['라면','🍜']],
  '탈것·생활':[['자동차','🚗'],['기차','🚆'],['비행기','✈️'],['배','🚢'],['자전거','🚲'],['우산','☂️'],['모자','🧢'],['신발','👟'],['책','📖'],['시계','⏰'],['로켓','🚀'],['가방','🎒'],['컵','☕'],['풍선','🎈'],['양말','🧦'],['카메라','📷'],['북','🥁'],['종','🔔'],['피아노','🎹'],['안경','👓']],
};
const SUBJ=[['고양이가','🐱'],['강아지가','🐶'],['아기가','👶'],['토끼가','🐰'],['곰이','🐻'],['오리가','🦆'],['나비가','🦋'],['새가','🐦'],['엄마가','👩'],['아빠가','👨'],['아이가','🧒'],['물고기가','🐟']];
const OBJ=[['우유를','🥛'],['사과를','🍎'],['공을','⚽'],['책을','📖'],['밥을','🍚'],['물을','💧'],['꽃을','🌸'],['노래를','🎵'],['뼈를','🦴'],['바나나를','🍌'],['별을','⭐']];
const VERB=[['먹어요','🍴'],['좋아해요','💕'],['봐요','👀'],['마셔요','🥤'],['던져요','🤾'],['찾아요','🔍'],['불러요','🎤'],['물어요','😬'],['심어요','🌱'],['그려요','🖍️']];
const BATCHIM_SYLL=['강','산','곰','문','손','발','눈','별','빵','컵'];
const TRACE_WORDS=['나비','사과','토끼','포도','우유','모자','우산','신발','사탕','강아지','바나나','코끼리'];
const STICKERS=['⭐','🌈','🦋','🐥','🌸','🍭','🎈','🦄','🐻','🚀','🍓','👑','🐬','🌟','🎁','🦉'];
const MENU=[
  {id:'listen',ic:'🔊',label:'듣고 찾기',cls:'m-listen'},{id:'sticker',ic:'🏅',label:'내 스티커',cls:'m-sticker'},{id:'set',ic:'⚙️',label:'설정',cls:'m-set'},
];
// 한글 마을 지도: 오늘의 모험 장소만 노출. 글자 숲/단어 동산은 자유찾기 화면 대신 오늘의 모험으로 바로 진입(action).
// mx/my = 시안 별자리 지도의 노드 위치(%). 경로 좌표와 함께 design reference에서 이식.
const MAP_PLACES=[
  {id:'letters',target:'letters',ic:'🌳',place:'글자 숲',hint:'오늘의 글자 친구를 만나요',quest:'letter',action:'letter',mx:34.7,my:82.6},
  {id:'word',target:'word',ic:'🌼',place:'단어 동산',hint:'오늘의 단어 꽃을 찾아요',quest:'word',action:'word',mx:50.8,my:56.1},
  {id:'listen',target:'listen',ic:'🔊',place:'소리 동굴',hint:'하니 목소리를 따라 찾아요',quest:'play',mx:67.7,my:35.6},
  {id:'find',target:'find',ic:'🔎',place:'글자 찾기',hint:'숨은 글자를 찾아요',quest:'find',action:'find',mx:62.5,my:27.3},
  {id:'sticker',target:'sticker',ic:'🏅',place:'스티커 집',hint:'모험 보상을 모아봐요',mx:57.3,my:18.9},
];
// 별자리 지도 코인 일러스트(시안 '글자 숲' 원본 + 같은 결의 장소 3종).
const MAP_ART={
  letters:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#EAF0DC"/><circle cx="74" cy="26" r="12" fill="#F4D488" opacity="0.85"/><ellipse cx="50" cy="90" rx="62" ry="22" fill="#BBD39B"/><rect x="29" y="52" width="7" height="27" rx="3" fill="#9A7048"/><circle cx="32" cy="46" r="16" fill="#8FB87A"/><circle cx="45" cy="53" r="11" fill="#7FAE6C"/><rect x="62" y="58" width="6" height="21" rx="3" fill="#9A7048"/><circle cx="65" cy="52" r="12" fill="#9DBE86"/></svg>',
  word:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#F3EDD9"/><circle cx="26" cy="24" r="11" fill="#F4D488" opacity="0.85"/><ellipse cx="50" cy="88" rx="62" ry="26" fill="#C6DCA0"/><path d="M35 74 Q37 60 34 52" stroke="#7F9E5A" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="33" cy="47" r="9" fill="#EF9AA0"/><circle cx="33" cy="47" r="3.4" fill="#F4D488"/><path d="M63 78 Q65 66 68 60" stroke="#7F9E5A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="69" cy="55" r="7.5" fill="#B79BC4"/><circle cx="69" cy="55" r="2.8" fill="#FFF4D8"/></svg>',
  listen:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#E6E1F0"/><ellipse cx="50" cy="92" rx="62" ry="20" fill="#B0A6C6"/><ellipse cx="50" cy="60" rx="36" ry="32" fill="#7A6C99"/><ellipse cx="50" cy="58" rx="29" ry="26" fill="#6E5F8E"/><ellipse cx="50" cy="72" rx="17" ry="22" fill="#352E52"/><text x="67" y="34" font-family="Jua, sans-serif" font-size="15" fill="#F4D488">♪</text></svg>',
  find:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#E8EFE2"/><ellipse cx="50" cy="90" rx="62" ry="22" fill="#BBD39B"/><circle cx="44" cy="44" r="22" fill="#FFFAEE" stroke="#7F9E5A" stroke-width="5"/><path d="M60 60 L78 78" stroke="#9A7048" stroke-width="9" stroke-linecap="round"/><text x="36" y="54" font-family="Jua, sans-serif" font-size="24" fill="#456F98">ㄱ</text><path d="M74 20 l2 4.4 4.8.5 -3.6 3.3 1 4.8 -4.2 -2.3 -4.2 2.3 1 -4.8 -3.6 -3.3 4.8 -.5 Z" fill="#F4C879"/></svg>',
  sticker:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#F7EAD3"/><ellipse cx="50" cy="92" rx="62" ry="20" fill="#E3CBA0"/><rect x="28" y="46" width="44" height="34" rx="5" fill="#F2D9A6"/><path d="M22 48 L50 26 L78 48 Z" fill="#D9906A"/><rect x="44" y="60" width="12" height="20" rx="3" fill="#B07848"/><path d="M50 34 l2.4 5.2 5.7.6 -4.2 3.9 1.1 5.6 -5 -2.7 -5 2.7 1.1 -5.6 -4.2 -3.9 5.7 -.6 Z" fill="#F4C879"/></svg>',
};
const CHO=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const STROKES={
'ㄱ':[[[20,28],[78,28],[78,82]]],'ㄴ':[[[28,20],[28,80],[80,80]]],
'ㄷ':[[[24,24],[78,24]],[[24,26],[24,80],[78,80]]],
'ㄹ':[[[24,20],[72,20],[72,42]],[[24,42],[72,42]],[[24,42],[24,80],[72,80]]],
'ㅁ':[[[28,22],[28,80]],[[28,22],[76,22],[76,80]],[[28,80],[76,80]]],
'ㅂ':[[[28,20],[28,82]],[[74,20],[74,82]],[[28,50],[74,50]],[[28,82],[74,82]]],
'ㅅ':[[[50,22],[26,82]],[[50,40],[78,82]]],'ㅇ':[{circle:[50,52,30]}],
'ㅈ':[[[24,26],[76,26]],[[48,26],[26,80]],[[52,40],[78,80]]],
'ㅊ':[[[44,14],[58,14]],[[24,32],[76,32]],[[48,32],[26,82]],[[52,46],[78,82]]],
'ㅋ':[[[20,26],[76,26],[76,82]],[[24,52],[74,52]]],
'ㅌ':[[[24,22],[76,22]],[[24,24],[24,80],[76,80]],[[24,51],[76,51]]],
'ㅍ':[[[22,24],[78,24]],[[34,24],[34,78]],[[66,24],[66,78]],[[22,78],[78,78]]],
'ㅎ':[[[40,12],[60,12]],[[22,32],[78,32]],{circle:[50,62,20]}],
'ㅏ':[[[46,16],[46,84]],[[46,50],[80,50]]],'ㅑ':[[[48,16],[48,84]],[[48,38],[80,38]],[[48,62],[80,62]]],
'ㅓ':[[[18,50],[52,50]],[[52,16],[52,84]]],'ㅕ':[[[18,38],[50,38]],[[18,62],[50,62]],[[50,16],[50,84]]],
'ㅗ':[[[50,18],[50,56]],[[18,72],[82,72]]],'ㅛ':[[[38,20],[38,56]],[[62,20],[62,56]],[[18,72],[82,72]]],
'ㅜ':[[[18,44],[82,44]],[[50,44],[50,84]]],'ㅠ':[[[18,42],[82,42]],[[38,42],[38,82]],[[62,42],[62,82]]],
'ㅡ':[[[18,50],[82,50]]],'ㅣ':[[[50,14],[50,86]]],
// 복합·이중 모음 11개 — 기본 자모(ㅏㅓㅑㅕㅗㅜㅡㅣ) 모양을 좌우/상하로 합성. 획 수·순서가 핵심.
'ㅐ':[[[40,16],[40,84]],[[40,50],[64,50]],[[64,16],[64,84]]],
'ㅔ':[[[20,50],[44,50]],[[44,16],[44,84]],[[68,16],[68,84]]],
'ㅒ':[[[36,16],[36,84]],[[36,38],[58,38]],[[36,62],[58,62]],[[66,16],[66,84]]],
'ㅖ':[[[18,38],[44,38]],[[18,62],[44,62]],[[44,16],[44,84]],[[66,16],[66,84]]],
'ㅘ':[[[28,28],[28,58]],[[12,64],[52,64]],[[68,16],[68,84]],[[68,50],[92,50]]],
'ㅙ':[[[24,28],[24,56]],[[10,62],[44,62]],[[56,16],[56,84]],[[56,50],[74,50]],[[80,16],[80,84]]],
'ㅚ':[[[30,28],[30,58]],[[14,64],[54,64]],[[72,16],[72,84]]],
'ㅝ':[[[12,40],[52,40]],[[30,40],[30,80]],[[58,50],[72,50]],[[72,16],[72,84]]],
'ㅞ':[[[10,40],[48,40]],[[28,40],[28,80]],[[54,50],[68,50]],[[68,16],[68,84]],[[84,16],[84,84]]],
'ㅟ':[[[12,40],[54,40]],[[32,40],[32,80]],[[72,16],[72,84]]],
'ㅢ':[[[16,52],[60,52]],[[74,16],[74,84]]],
};

/* 완성 음절(예: 어,항,오)은 STROKES에 없으므로 자모로 분해해 블록 안 올바른 위치에 획순을 배치·합성한다 */
function _xfStroke(st,box){
  var x0=box[0],y0=box[1],x1=box[2],y1=box[3];
  var tx=function(p){return Math.round((x0+(p/100)*(x1-x0))*10)/10;};
  var ty=function(p){return Math.round((y0+(p/100)*(y1-y0))*10)/10;};
  if(st.circle){var c=st.circle,sx=(x1-x0)/100,sy=(y1-y0)/100;return {circle:[tx(c[0]),ty(c[1]),Math.round(c[2]*Math.min(sx,sy)*10)/10]};}
  return st.map(function(p){return [tx(p[0]),ty(p[1])];});
}
// 혼합모음(가로부+세로부): ㅘ=ㅗ+ㅏ 처럼 분해해 가로부는 왼쪽아래, 세로부(ㅏㅐㅓㅔㅣ)는 오른쪽 세로로 배치.
// (ㅘ를 한 덩어리로 납작한 아래칸에 넣으면 세로가 꽉 찬 ㅏ가 압축돼 찌그러진다.)
var _MIXED_V={'ㅘ':['ㅗ','ㅏ'],'ㅙ':['ㅗ','ㅐ'],'ㅚ':['ㅗ','ㅣ'],'ㅝ':['ㅜ','ㅓ'],'ㅞ':['ㅜ','ㅔ'],'ㅟ':['ㅜ','ㅣ'],'ㅢ':['ㅡ','ㅣ']};
function composedStrokes(ch){
  if(typeof ch!=='string'||ch.length!==1)return null;
  var code=ch.codePointAt(0);
  if(code<0xAC00||code>0xD7A3)return null;
  var s=code-0xAC00;
  var cho=CHO[Math.floor(s/588)], jung=JUNG[Math.floor((s%588)/28)], jong=JONG[s%28];
  var out=[];
  function add(jamo,box){var arr=STROKES[jamo];if(!arr)return;arr.forEach(function(st){out.push(_xfStroke(st,box));});}
  // 혼합모음: 가로부(ㅗ/ㅜ/ㅡ) + 세로부(ㅏ/ㅐ/ㅓ/ㅔ/ㅣ)를 개별 자모 칸에 배치.
  // 박스는 자모 STROKES가 자체 여백을 갖기에 목표 영역보다 약간 크게(살짝 겹치게) 잡아 글자꼴처럼 꽉 차게 한다.
  var mv=_MIXED_V[jung];
  if(mv){
    if(!STROKES[cho]||!STROKES[mv[0]]||!STROKES[mv[1]]||(jong&&!STROKES[jong]))return null;
    // 초성 좌상 · 가로부(ㅗ/ㅜ/ㅡ) 좌하 · 세로부(ㅏ/ㅐ/ㅓ/ㅔ/ㅣ) 우측 세로.
    if(jong){ add(cho,[14,2,58,34]); add(mv[0],[10,34,58,63]); add(mv[1],[40,2,84,64]); add(jong,[8,66,92,99]); }
    else    { add(cho,[16,10,64,54]); add(mv[0],[12,44,64,86]); add(mv[1],[40,10,86,90]); }
    return out.length?out:null;
  }
  // 구성 자모 중 하나라도 STROKES가 없으면 부분(자음만) 오버레이 대신 null 반환.
  if(!STROKES[cho]||!STROKES[jung]||(jong&&!STROKES[jong]))return null;
  // 순수 가로형(ㅗㅛㅜㅠㅡ)은 위/아래 칸 분할, 세로형은 좌/우 분할.
  var horiz='ㅗㅛㅜㅠㅡ'.indexOf(jung)>=0;
  var boxes=horiz
    ? (jong?{cho:[13,0,87,38],jung:[3,39,97,65],jong:[11,66,89,99]}
           :{cho:[11,2,89,52],jung:[3,53,97,95]})
    : (jong?{cho:[3,3,53,47],jung:[42,2,88,62],jong:[9,64,91,99]}
           :{cho:[3,5,55,95],jung:[42,3,89,97]});
  add(cho,boxes.cho); add(jung,boxes.jung); if(jong)add(jong,boxes.jong);
  return out.length?out:null;
}
// 쌍자음(ㄲㄸㅃㅆㅉ): 기본 자음을 좌우로 나란히 두 번 — 바른 글자/받침/초성 모두 획순이 나오게
[['ㄲ','ㄱ'],['ㄸ','ㄷ'],['ㅃ','ㅂ'],['ㅆ','ㅅ'],['ㅉ','ㅈ']].forEach(function(p){
  var base=STROKES[p[1]]; if(!base||STROKES[p[0]])return;
  STROKES[p[0]]=base.map(function(st){return _xfStroke(st,[3,8,48,92]);})
                    .concat(base.map(function(st){return _xfStroke(st,[52,8,97,92]);}));
});
// 겹받침(ㄳㄵㄶㄺ…): 두 자음을 받침 칸 안에서 좌우로
var _CLUSTER={'ㄳ':['ㄱ','ㅅ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅅ']};
Object.keys(_CLUSTER).forEach(function(k){
  var a=STROKES[_CLUSTER[k][0]],b=STROKES[_CLUSTER[k][1]]; if(!a||!b||STROKES[k])return;
  STROKES[k]=a.map(function(st){return _xfStroke(st,[3,8,48,92]);})
             .concat(b.map(function(st){return _xfStroke(st,[52,8,97,92]);}));
});
function strokesFor(ch){return STROKES[ch]||composedStrokes(ch);}

const PRAISE=['하니가 스티커를 준비했어요!','한글 마을에 빛이 켜졌어요!','모험 성공! 정말 멋져요!','글자 친구가 돌아왔어요!','와! 모험 보상이에요!'];

const HANI_REACTIONS={
  letter:{badge:'반짝 이름표가 빛나요',text:'좋아! 이름표가 반짝였어. 이제 편지가 자기 이름을 조금 기억해 냈어.',log:'글자 숲에서 첫 빛 조각을 찾았어요.'},
  word:{badge:'노란 꽃씨 주머니가 흔들려요',text:'단어 꽃이 활짝 피었어. 하얀 편지에 따뜻한 색이 돌아오고 있어.',log:'단어 동산에서 두 번째 빛 조각을 모았어요.'},
  play:{badge:'맑은 소리 종이 울려요',text:'소리 종이 맑게 울렸어. 소리 동굴 문이 열리고 마을 주문이 깨어났어!',log:'소리 동굴에서 세 번째 빛 조각을 찾았어요.'},
  find:{badge:'돋보기가 반짝반짝',text:'여러 글자 속에서 오늘 글자를 눈으로 콕 찾았어! 하니 눈이 반짝반짝, 정말 대단해!',log:'글자 찾기에서 오늘 글자를 눈으로 찾아냈어요.'},
  all:{badge:'별빛 우체국이 환해졌어요',text:'오늘의 편지가 다시 읽히기 시작했어. 하니와 아이가 함께 만든 이야기야!',log:'오늘의 모험을 모두 완료했어요. 새 편지가 내일을 기다려요.'}
};

const STORY_ARC=[
  {key:'premise',premise:true,label:'시작',text:'별빛 우체국의 편지가 하얗게 비어 버렸다.'},
  {key:'inciting',inciting:true,label:'사건',text:'이름 없는 편지는 길을 잃고 한글 마을 곳곳에 흩어졌다.'},
  {key:'conflict',conflict:true,label:'위기',text:'글자와 단어와 소리를 차례로 되찾아야 편지가 다시 읽힌다.'},
  {key:'choice',choice:true,label:'선택',text:'아이가 하니의 탐험대장이 되어 오늘의 글자부터 불러준다.'},
  {key:'climax',climax:true,label:'해결',text:'세 빛 조각이 모이면 하얀 편지에 오늘 배운 말이 떠오른다.'},
  {key:'resolution',resolution:true,label:'약속',text:'한글 마을은 내일도 새 편지와 새 글자 친구를 보내기로 한다.'},
  {key:'promise',promise:true,label:'다음 모험',text:'오늘 찾은 말은 별빛 우체국 앨범에 남아 다음 이야기를 열어 준다.'},
];

const STORY_CHAPTERS=[
  {key:'letter',id:'chapterLetter',title:'1장 글자 숲의 첫 불빛',place:'글자 숲',scene:'낮잠 자던 글자들이 숲잎 뒤에 숨어 있어요.',clue:'오늘의 글자 소리를 따라가면 숨은 이름표가 반짝여요.',reward:'반짝 이름표',emotion:'편지 봉투가 바스락거리자 하니가 숨을 작게 들이마셔요.',secret:'글자 숲의 잎맥은 자음과 모음이 지나간 길을 기억해요.',next:'이름표가 깨어나면 단어 동산의 꽃봉오리가 열릴 거예요.',relic:'별빛 봉투',bond:'하니는 아이가 읽어주는 소리를 믿고 앞으로 걸어요.'},
  {key:'word',id:'chapterWord',title:'2장 단어 동산의 꽃',place:'단어 동산',scene:'단어 꽃은 글자 친구의 이름을 불러주면 피어나요.',clue:'오늘의 단어를 찾으면 꽃잎에 다음 길이 적혀요.',reward:'단어 꽃씨',emotion:'하니는 꽃봉오리 앞에서 두 날개를 꼭 모으고 기다려요.',secret:'단어 동산의 꽃은 맞는 이름을 들으면 색깔을 되찾아요.',next:'꽃씨가 자라면 소리 동굴 입구에 작은 종소리가 울릴 거예요.',relic:'노란 꽃씨 주머니',bond:'아이가 단어를 말할 때마다 하니의 발자국이 더 환해져요.'},
  {key:'play',id:'chapterPlay',title:'3장 소리 동굴의 문',place:'소리 동굴',scene:'문은 하니의 목소리와 같은 소리를 찾을 때 열려요.',clue:'소리를 듣고 같은 친구를 고르면 마을 주문이 깨어나요.',reward:'소리 종',emotion:'하니는 어두운 동굴 앞에서도 아이 손을 잡은 듯 씩씩해져요.',secret:'소리 동굴의 메아리는 오늘 배운 글자와 단어를 오래 기억해요.',next:'세 빛 조각이 모이면 별빛 우체국에 새 편지가 도착해요.',relic:'맑은 소리 종',bond:'하니와 아이가 함께 들은 소리가 마을의 문을 열어요.'},
];

const LETTER_WORDS={
 'ㄱ':[['기린','🦒'],['고양이','🐱'],['김밥','🍙'],['가방','🎒'],['곰','🐻'],['거북이','🐢']],
 'ㄴ':[['나비','🦋'],['나무','🌳'],['눈사람','⛄'],['낙타','🐪'],['냄비','🍲'],['누나','👧']],
 'ㄷ':[['다람쥐','🐿️'],['도넛','🍩'],['닭','🐔'],['달','🌙'],['돼지','🐷'],['도토리','🌰']],
 'ㄹ':[['로봇','🤖'],['라면','🍜'],['레몬','🍋'],['로켓','🚀'],['라디오','📻']],
 'ㅁ':[['모자','🧢'],['말','🐴'],['멜론','🍈'],['문','🚪'],['물','💧'],['무지개','🌈']],
 'ㅂ':[['바나나','🍌'],['비행기','✈️'],['별','⭐'],['배','🚢'],['바지','👖'],['북','🥁']],
 'ㅅ':[['사과','🍎'],['수박','🍉'],['사자','🦁'],['신발','👟'],['시계','⏰'],['새','🐦']],
 'ㅇ':[['오리','🦆'],['우산','☂️'],['아기','👶'],['양','🐑'],['우유','🥛'],['악어','🐊']],
 'ㅈ':[['자동차','🚗'],['지렁이','🪱'],['자전거','🚲'],['종','🔔'],['주사위','🎲'],['장미','🌹']],
 'ㅊ':[['치즈','🧀'],['책','📕'],['칫솔','🪥'],['청소기','🧹'],['체리','🍒']],
 'ㅋ':[['코끼리','🐘'],['콩','🫛'],['케이크','🍰'],['컵','☕'],['카메라','📷']],
 'ㅌ':[['토끼','🐰'],['토마토','🍅'],['튤립','🌷'],['태양','☀️'],['탑','🗼']],
 'ㅍ':[['포도','🍇'],['피아노','🎹'],['펭귄','🐧'],['풍선','🎈'],['파','🧅']],
 'ㅎ':[['호랑이','🐯'],['해','🌞'],['하마','🦛'],['학','🦢'],['햄버거','🍔']],
 'ㄲ':[['꿀','🍯'],['꽃','🌸'],['꿈','💭'],['까치','🐦']],
 'ㄸ':[['딸기','🍓'],['땅콩','🥜'],['떡','🍡'],['똥','💩']],
 'ㅃ':[['아빠','👨'],['빨대','🥤'],['뿔','🦏'],['뽀뽀','💋']],
 'ㅆ':[['쌀','🍚'],['씨앗','🌱'],['썰매','🛷'],['쌍둥이','👯']],
 'ㅉ':[['짜장면','🍜'],['찌개','🍲'],['짹짹','🐤'],['쪽지','📝'],['짝꿍','👫']],
 'ㅏ':[['아기','👶'],['아빠','👨'],['아이스크림','🍦'],['안경','👓'],['악어','🐊']],
 'ㅑ':[['야구','⚾'],['야자수','🌴'],['양','🐑'],['약','💊']],
 'ㅓ':[['어항','🐠'],['엄마','👩'],['어린이','🧒'],['어묵','🍢'],['얼음','🧊']],
 'ㅕ':[['여우','🦊'],['여름','🌞'],['연필','✏️'],['연','🪁']],
 'ㅗ':[['오리','🦆'],['오이','🥒'],['오렌지','🍊'],['옥수수','🌽'],['오징어','🦑']],
 'ㅛ':[['요요','🪀'],['요리','🍳'],['욕조','🛁']],
 'ㅜ':[['우산','☂️'],['우유','🥛'],['우주','🚀'],['운동화','👟']],
 'ㅠ':[['유니콘','🦄'],['유령','👻'],['유모차','🚼']],
 'ㅡ':[['음악','🎵'],['음식','🍲']],
 'ㅣ':[['이빨','🦷'],['이불','🛏️'],['이모','👩'],['인형','🧸']],
 'ㅐ':[['개미','🐜'],['개','🐶']],
 'ㅔ':[['게','🦀']],
 'ㅒ':[['얘기','💬']],
 'ㅖ':[['시계','🕐']],
 'ㅘ':[['사과','🍎']],
 'ㅙ':[['왜','❓']],
 'ㅚ':[['참외','🍈']],
 'ㅝ':[['원숭이','🐵']],
 'ㅞ':[['웨','🔊']],
 'ㅟ':[['귀','👂']],
 'ㅢ':[['의자','🪑']],
};

// 4막 받침(끝소리) 예시 단어 — 글자가 음절의 '끝소리(받침)'로 들어간 단어들.
// 2막 초성(LETTER_WORDS)과 분리: 4막 글자 숲은 이 목록으로 받침을 가르친다(끝소리 ㄱ → 책·약).
const FINAL_WORDS={
 'ㄱ':[['책','📖'],['약','💊']],
 'ㄴ':[['산','⛰️'],['손','✋']],
 'ㄷ':[['숟가락','🥄']],
 'ㄹ':[['발','🦶'],['별','⭐']],
 'ㅁ':[['곰','🐻'],['밤','🌰']],
 'ㅂ':[['컵','☕'],['밥','🍚']],
 'ㅇ':[['강','🏞️'],['빵','🍞']],
};

const PRESET_SENTS=['고양이가 우유를 마셔요','아기가 사과를 먹어요','강아지가 공을 던져요','토끼가 책을 봐요','곰이 밥을 먹어요','오리가 물을 마셔요','나비가 꽃을 봐요','새가 노래를 불러요','강아지가 뼈를 물어요','아기가 바나나를 먹어요','엄마가 꽃을 심어요','아빠가 별을 그려요','아이가 공을 던져요','물고기가 물을 좋아해요'];
// 문장 단어 → 그림(이모지) 단서. 주어/목적어/서술어 짝에서 정확히 일치하는 토큰을 먼저 쓰고,
// 없으면 받침/조사를 떼어 LETTER_WORDS/WORDS에서 보충(글 못 읽는 아이용 그림 힌트).
const SENT_EMOJI=(function(){var m={};[].concat(SUBJ,OBJ,VERB).forEach(function(p){m[p[0]]=p[1];});return m;})();
function sentCue(word){
  if(!word)return '';
  if(SENT_EMOJI[word])return SENT_EMOJI[word];
  var stem=word.replace(/(가|이|를|을|은|는|에|와|과|도|요)$/,'');
  if(SENT_EMOJI[word.slice(0,-1)])return SENT_EMOJI[word.slice(0,-1)];
  for(var k in WORDS){for(var i=0;i<WORDS[k].length;i++){if(WORDS[k][i][0]===stem)return WORDS[k][i][1];}}
  return '';
}
function sentCues(words){return (words||[]).map(sentCue);}

const CRAYONS=[['검정','#222'],['분홍','#ff6fa5'],['파랑','#4aa3ff'],['노랑','#ffb02e'],['초록','#3fb964']];

const VOICES=[['여성','f'],['아이','kid'],['남성','m']];

const SPEEDS=[['느리게',0.6],['보통',0.8],['빠르게',1.0]];

// ===== 한글 떼기 커리큘럼 — 별빛 우체국 8막 여정 =====
// 스토리 진행 = 실제 한글 학습 순서. 마지막 막을 깨면 아이가 편지를 스스로 읽음(= 한글 뗌).
// 만4세·백지 기준: 한 화(에피소드) = 글자 1개, 쉬운 순서부터, 관대한 익힘 판정.
const CURRICULUM=[
  {act:1,key:'vowel-basic',type:'letter',title:'1막 모음의 빛',place:'글자 숲',
   letters:['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ','ㅑ','ㅕ','ㅛ','ㅠ'],
   intro:'별빛 우체국의 첫 빛은 모음이에요. 입을 크게 벌리는 소리부터 만나요.',relic:'모음 별빛',relicEmoji:'✨'},
  {act:2,key:'cons-basic',type:'letter',title:'2막 자음 친구들',place:'글자 숲',
   letters:['ㅁ','ㄴ','ㅇ','ㄱ','ㄷ','ㅂ','ㅅ','ㄹ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
   intro:'이제 자음 친구가 모음 옆에 서면 진짜 글자가 태어나요.',relic:'자음 열쇠',relicEmoji:'🔑'},
  {act:3,key:'syllable',type:'combine',title:'3막 글자 공방',place:'글자 공방',
   syllables:['가','나','다','마','고','모','바','사','하','기','도','토','구','무'],
   sylWords:{'가':['가방','🎒'],'나':['나비','🦋'],'다':['다리','🌉'],'마':['마차','🐴'],'고':['고래','🐳'],'모':['모자','🧢'],'바':['바다','🌊'],'사':['사자','🦁'],'하':['하마','🦛'],'기':['기차','🚂'],'도':['도토리','🌰'],'토':['토끼','🐰'],'구':['구름','☁️'],'무':['무지개','🌈']},
   intro:'자음과 모음을 합치면 글자가 돼요. 가·나·다를 만들어요.',relic:'글자 망치',relicEmoji:'🔨'},
  {act:4,key:'final',type:'letter',title:'4막 받침의 문',place:'글자 공방',
   letters:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅇ'],
   intro:'글자 아래 받침이 들어오면 끝소리가 생겨요.',relic:'받침 돌',relicEmoji:'🪨'},
  {act:5,key:'tense',type:'letter',title:'5막 쌍둥이 소리',place:'소리 동굴',
   letters:['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ'],
   intro:'힘껏 내는 된소리예요. 쌍둥이 자음을 만나요.',relic:'쌍둥이 종',relicEmoji:'🔔'},
  {act:6,key:'vowel-complex',type:'letter',title:'6막 숨은 모음',place:'글자 숲',
   letters:['ㅐ','ㅔ','ㅒ','ㅖ','ㅚ','ㅟ','ㅢ','ㅘ','ㅝ','ㅙ','ㅞ'],
   intro:'숨어 있던 모음들이 빛을 찾으러 나와요.',relic:'숨은 별빛',relicEmoji:'🌟'},
  {act:7,key:'word',type:'word',title:'7막 단어 마을',place:'단어 동산',
   intro:'글자들이 모여 단어가 됐어요. 이제 단어를 읽어요.',relic:'단어 꽃다발',relicEmoji:'💐'},
  {act:8,key:'sentence',type:'sentence',title:'8막 이야기 책',place:'별빛 우체국',
   sentences:PRESET_SENTS.slice(),
   intro:'드디어 문장을 읽어요. 하얀 편지에 글이 떠올라요.',relic:'별빛 편지',relicEmoji:'💌'},
];
// 빠른 성취형(B): 정해진 글자를 익히면 곧장 진짜 말 맛보기를 띄워 동기부여.
const STORY_MILESTONES=[
  {after:['ㅏ','ㅣ'],word:'아이',say:'아이',note:'ㅏ와 ㅣ가 만나 "아이"를 읽었어요! (ㅇ은 살짝 숨은 소리예요)'},
  {after:['ㅗ','ㅣ'],word:'오이',say:'오이',note:'"오이"를 읽을 수 있게 됐어요! 🥒'},
  {after:['ㅜ','ㅠ'],word:'우유',say:'우유',note:'"우유"도 읽었어요! 🥛'},
  {after:['ㅁ','ㅏ'],word:'엄마',say:'엄마',note:'세상에서 제일 따뜻한 말 "엄마"를 만들었어요! 💕'},
  {after:['ㅂ','ㅏ'],word:'바다',say:'바다',note:'ㅂ와 ㅏ로 "바다"를 읽었어요! 🌊'},
  {after:['ㅃ','ㅏ'],word:'아빠',say:'아빠',note:'된소리 ㅃ를 익혀서 "아빠"도 읽을 수 있어요! 👨'},
  {after:['ㄴ','ㅏ'],word:'나',say:'나',note:'ㄴ과 ㅏ로 "나"를 만들었어요!'},
];
// 진행 경로: 글자형 막은 글자 하나하나가 에피소드, 그 외 막은 막 자체가 한 단계.
const EPISODE_PATH=(function(){var p=[];CURRICULUM.forEach(function(a){
  if(a.type==='letter'){var isFin=(a.key==='final');a.letters.forEach(function(ch){var node={act:a.act,actKey:a.key,actTitle:a.title,place:a.place,type:'letter',ch:ch};if(isFin)node.final=true;p.push(node);});}
  else if(a.type==='combine'){a.syllables.forEach(function(ch){var ex=(a.sylWords&&a.sylWords[ch])||[];p.push({act:a.act,actKey:a.key,actTitle:a.title,place:a.place,type:'combine',ch:ch,word:ex[0]||'',emoji:ex[1]||''});});}
  else if(a.type==='sentence'){(a.sentences||[]).forEach(function(s){var words=s.split(' ');p.push({act:a.act,actKey:a.key,actTitle:a.title,place:a.place,type:'sentence',sent:s,words:words,cues:sentCues(words)});});}
  else{p.push({act:a.act,actKey:a.key,actTitle:a.title,place:a.place,type:a.type});}
});return p;})();
// 익힘 판정(관대): 글자를 만나고(met) + 카드 짝맞추기(matched) + 소리퀴즈 정답(quizzed) 셋이면 마스터.
function isMasteredRec(rec){return !!(rec&&rec.met&&rec.matched&&rec.quizzed);}
// 마스터한 글자 목록과 이미 본 맛보기 목록을 받아, 아직 안 띄운 첫 맛보기를 돌려줌.
function pendingMilestone(mastered,shown){for(var i=0;i<STORY_MILESTONES.length;i++){var m=STORY_MILESTONES[i];
  if(shown.indexOf(m.word)>=0)continue;
  var ok=m.after.every(function(ch){return mastered.indexOf(ch)>=0;});
  if(ok)return m;}return null;}
// 글자 ch → 글자 객체(소리/예시단어) 빠른 조회. 자음·기본모음·복합모음(6막) 포함.
const ALL_LETTER_OBJS=(function(){var m={};CONS.concat(VOWS).concat(VOWS_COMPLEX).concat(CONS_DOUBLE).forEach(function(o){m[o.ch]=o;});return m;})();

// ===== 인트로 그림책 — 모험을 시작하는 이야기 (하니가 음성으로 읽어줌) =====
// 글 못 읽는 아이용: 큰 그림 + 하니 목소리가 핵심, 글(cap)은 부모가 같이 읽을 수 있게.
const INTRO_PAGES=[
  {art:['🏤','✉️','⭐'],cap:'한글 마을 별빛 우체국',hl:'별빛 우체국',say:'한글 마을에는 별빛 우체국이 있어요. 모두에게 반짝이는 편지를 보내주는 곳이에요.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="별빛 우체국"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3470"/><stop offset="0.55" stop-color="#7a68a8"/><stop offset="1" stop-color="#d79bae"/></linearGradient><radialGradient id="moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff7e0"/><stop offset="1" stop-color="#ffe4a6"/></radialGradient><linearGradient id="pbox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec5446"/><stop offset="1" stop-color="#c8392c"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="332" cy="50" r="28" fill="url(#moon)"/><g fill="#fff"><circle class="tw" cx="58" cy="46" r="2.3"/><circle class="tw t2" cx="116" cy="26" r="1.7"/><circle class="tw t3" cx="250" cy="34" r="2.1"/><circle class="tw t2" cx="38" cy="118" r="1.7"/><circle class="tw" cx="372" cy="116" r="2"/></g><path d="M0,228 Q120,202 230,222 Q330,242 400,218 L400,280 L0,280 Z" fill="#5a9a78"/><path d="M0,250 Q160,228 400,248 L400,280 L0,280 Z" fill="#48865f"/><g transform="translate(126,110)"><rect x="-58" y="44" width="116" height="84" rx="6" fill="#fbf3e4" stroke="#d9b384" stroke-width="2"/><rect x="-62" y="36" width="124" height="11" rx="4" fill="#e7d6bd"/><rect x="-56" y="50" width="112" height="24" rx="5" fill="#e4392c"/><circle cx="-45" cy="62" r="7" fill="#fff"/><path d="M-50,63 Q-47,58 -45,61 Q-43,58 -40,63 Q-43,60 -45,65 Q-47,60 -50,63 z" fill="#e4392c"/><text x="8" y="67" font-family="Jua, sans-serif" font-size="13" fill="#fff" text-anchor="middle">별빛우체국</text><rect x="-48" y="84" width="24" height="18" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><rect x="24" y="84" width="24" height="18" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><rect x="-17" y="98" width="34" height="30" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><line x1="0" y1="98" x2="0" y2="128" stroke="#d9b384" stroke-width="1.5"/></g><g transform="translate(212,202)"><ellipse cx="0" cy="34" rx="15" ry="4.5" fill="#000" fill-opacity="0.14"/><rect x="-13" y="-14" width="26" height="48" rx="7" fill="url(#pbox)"/><path d="M-13,-8 Q-13,-23 0,-23 Q13,-23 13,-8 Z" fill="#d23b2d"/><rect x="-8" y="-3" width="16" height="4" rx="2" fill="#4a1813"/><circle cx="0" cy="13" r="6.5" fill="#fff"/><path d="M-4,14 Q-2,10 0,12.5 Q2,10 4,14 Q2,12 0,16 Q-2,12 -4,14 z" fill="#e4392c"/><rect x="-8" y="34" width="5" height="6" rx="2" fill="#a83228"/><rect x="3" y="34" width="5" height="6" rx="2" fill="#a83228"/></g><path d="M218,186 Q276,122 334,106" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round" opacity="0.45"/><g class="send"><g transform="translate(214,182) rotate(-16)"><rect x="-14" y="-9" width="28" height="18" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-14,-8 L0,3 L14,-8" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g><g class="send sd2"><g transform="translate(216,184) rotate(-21)"><rect x="-13" y="-8" width="26" height="16" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-13,-7 L0,3 L13,-7" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g><g class="send sd3"><g transform="translate(212,180) rotate(-11)"><rect x="-14" y="-9" width="28" height="18" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-14,-8 L0,3 L14,-8" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g>'+aiHani(342,234,0.9)+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['📨','⬜','❓'],cap:'편지가 하얗게 변했어요',hl:'하얗게',say:'그런데 어느 날, 편지 속 글자들이 모두 사라졌어요. 편지가 하얗게 텅 비어 버렸죠.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="편지가 하얗게 변했어요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#443a6e"/><stop offset="0.6" stop-color="#6f6196"/><stop offset="1" stop-color="#caa9bb"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g fill="#fff"><circle class="tw" cx="60" cy="40" r="2"/><circle class="tw t2" cx="320" cy="34" r="1.8"/><circle class="tw t3" cx="205" cy="26" r="2"/></g><path d="M0,238 Q200,216 400,236 L400,280 L0,280 Z" fill="#7a6f9a"/><g opacity="0.45"><g transform="translate(64,92) rotate(-12)"><rect x="-15" y="-10" width="30" height="20" rx="3" fill="#fdfbf5" stroke="#d9c8a8" stroke-width="1.6"/><path d="M-15,-9 L0,2 L15,-9" fill="none" stroke="#d9c8a8" stroke-width="1.6"/></g></g><g opacity="0.4"><g transform="translate(118,66) rotate(8)"><rect x="-13" y="-9" width="26" height="18" rx="3" fill="#fdfbf5" stroke="#d9c8a8" stroke-width="1.6"/><path d="M-13,-8 L0,2 L13,-8" fill="none" stroke="#d9c8a8" stroke-width="1.6"/></g></g><g transform="translate(146,160) rotate(-5)"><ellipse cx="0" cy="64" rx="54" ry="9" fill="#000" fill-opacity="0.12"/><rect x="-50" y="-60" width="100" height="120" rx="6" fill="#fffdf8" stroke="#e6d8bf" stroke-width="2"/><line x1="-36" y1="-30" x2="36" y2="-30" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="-8" x2="36" y2="-8" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="14" x2="36" y2="14" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="36" x2="24" y2="36" stroke="#ece2cf" stroke-width="2"/><g font-family="Jua, sans-serif" font-size="13" fill="#9a8a68"><text class="fade" style="animation-delay:0s" x="-35" y="-32">안</text><text class="fade" style="animation-delay:.1s" x="-21" y="-32">녕</text><text class="fade" style="animation-delay:.2s" x="-6" y="-32">하</text><text class="fade" style="animation-delay:.3s" x="8" y="-32">니</text><text class="fade" style="animation-delay:.45s" x="-35" y="-10">사</text><text class="fade" style="animation-delay:.55s" x="-21" y="-10">랑</text><text class="fade" style="animation-delay:.65s" x="-6" y="-10">해</text><text class="fade" style="animation-delay:.8s" x="-35" y="12">또</text><text class="fade" style="animation-delay:.9s" x="-21" y="12">보</text><text class="fade" style="animation-delay:1s" x="-6" y="12">자</text></g></g><g transform="translate(344,190)"><g class="pop"><g stroke="#ffe27a" stroke-width="2.4" stroke-linecap="round"><line x1="-9" y1="-16" x2="-12" y2="-22"/><line x1="0" y1="-18" x2="0" y2="-25"/><line x1="9" y1="-16" x2="12" y2="-22"/></g><text x="0" y="8" font-family="Jua, sans-serif" font-size="28" fill="#ffd54a" text-anchor="middle">!</text></g></g>'+aiHani(344,240,0.85)+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🌳','🌼','🔤'],cap:'글자 친구들이 숨었어요',hl:'숨어',say:'깜짝 놀란 글자 친구들이 마을 곳곳에 숨어 버렸어요. 숲에도, 동산에도, 동굴에도요.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="글자 친구들이 숨었어요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3470"/><stop offset="0.55" stop-color="#7a68a8"/><stop offset="1" stop-color="#d79bae"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g fill="#fff"><circle class="tw" cx="64" cy="40" r="2"/><circle class="tw t2" cx="300" cy="32" r="1.8"/><circle class="tw t3" cx="200" cy="52" r="2"/></g><path d="M0,200 Q200,176 400,202 L400,280 L0,280 Z" fill="#5a9a78"/><path d="M0,236 Q200,216 400,238 L400,280 L0,280 Z" fill="#48865f"/><g transform="translate(58,190)"><g class="peekR"><circle cx="0" cy="0" r="14" fill="#7ec4e8"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="15" fill="#fff" text-anchor="middle">ㄱ</text><circle cx="-5" cy="-4" r="1.7" fill="#27414e"/><circle cx="5" cy="-4" r="1.7" fill="#27414e"/></g></g><g transform="translate(50,150)"><rect x="-7" y="20" width="14" height="60" rx="3" fill="#94653f"/><ellipse cx="0" cy="0" rx="33" ry="31" fill="#4f9268"/><ellipse cx="-16" cy="11" rx="18" ry="16" fill="#56a070"/><ellipse cx="16" cy="9" rx="16" ry="14" fill="#59a074"/></g><g transform="translate(198,208)"><g class="peekUp"><circle cx="0" cy="0" r="14" fill="#f3899f"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="15" fill="#fff" text-anchor="middle">ㅏ</text><circle cx="-5" cy="-4" r="1.7" fill="#5a2436"/><circle cx="5" cy="-4" r="1.7" fill="#5a2436"/></g></g><g transform="translate(198,228)"><ellipse cx="0" cy="2" rx="44" ry="18" fill="#4f9268"/><ellipse cx="0" cy="7" rx="44" ry="13" fill="#47855c"/><g stroke="#3f8a5d" stroke-width="2.4"><line x1="-26" y1="-2" x2="-26" y2="-16"/><line x1="-2" y1="-4" x2="-2" y2="-22"/><line x1="24" y1="-2" x2="24" y2="-15"/></g><circle cx="-26" cy="-18" r="5" fill="#ffd54a"/><circle cx="-2" cy="-24" r="6" fill="#f3899f"/><circle cx="-2" cy="-24" r="2.2" fill="#fff"/><circle cx="24" cy="-17" r="5" fill="#9b8cff"/></g><g transform="translate(340,200)"><ellipse cx="0" cy="2" rx="37" ry="31" fill="#736487"/><ellipse cx="-1" cy="-1" rx="30" ry="25" fill="#675879"/><ellipse cx="-1" cy="15" rx="18" ry="21" fill="#2c2640"/></g><g transform="translate(340,214)"><g class="peekL"><circle cx="0" cy="0" r="13" fill="#f4b13c"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅁ</text><circle cx="-5" cy="-4" r="1.6" fill="#6a4810"/><circle cx="5" cy="-4" r="1.6" fill="#6a4810"/></g></g>'+'<g class="search">'+aiHani(200,248,0.95)+'</g>'+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🐥','💛'],cap:'하니가 함께 가요',hl:'하니',say:'걱정 마! 내가 하니야. 너랑 같이 숨은 글자 친구들을 찾으러 갈 거야. 준비됐니?',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="하니가 함께 가요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6bb0"/><stop offset="0.55" stop-color="#f0a98c"/><stop offset="1" stop-color="#ffd79a"/></linearGradient><radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.9"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></radialGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="200" cy="150" r="150" fill="url(#sun)"/><path d="M0,236 Q200,214 400,236 L400,280 L0,280 Z" fill="#6cab84"/><g fill="#ffe27a"><path class="tw" d="M86,90 l2.5,6 l6,2.5 l-6,2.5 l-2.5,6 l-2.5,-6 l-6,-2.5 l6,-2.5 z"/><path class="tw t2" d="M312,80 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z"/><path class="tw t3" d="M330,170 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z"/></g>'+aiHani(200,158,1.75,'determined')+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['✨','⭐','💌'],cap:'글자를 모아 편지를 살려요',hl:'반짝반짝',say:'숨은 글자 친구들을 하나씩 모으면, 하얀 편지에 다시 반짝반짝 글자가 살아난대!',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="빛 조각을 모아요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2752"/><stop offset="0.6" stop-color="#473c78"/><stop offset="1" stop-color="#6a5a9a"/></linearGradient><radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0.85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="200" cy="120" r="150" fill="url(#glow)"/><g fill="#fff"><circle class="tw" cx="64" cy="44" r="1.8"/><circle class="tw t2" cx="330" cy="40" r="1.8"/><circle class="tw t3" cx="120" cy="150" r="1.6"/><circle class="tw" cx="300" cy="150" r="1.6"/></g><path d="M0,240 Q200,222 400,240 L400,280 L0,280 Z" fill="#534781"/><g transform="translate(200,122)"><circle cx="0" cy="2" r="46" fill="url(#glow)"/><g class="glowpulse"><rect x="-30" y="-38" width="60" height="76" rx="6" fill="#fffef8" stroke="#ffe6a0" stroke-width="2"/><line x1="-20" y1="-22" x2="20" y2="-22" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="-11" x2="20" y2="-11" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="0" x2="20" y2="0" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="11" x2="12" y2="11" stroke="#ffdf9c" stroke-width="2.5"/></g></g><g transform="translate(96,68)"><g class="gather" style="--dx:104px;--dy:54px"><circle r="12" fill="#7ec4e8"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㄱ</text><circle cx="-4" cy="-3" r="1.5" fill="#27414e"/><circle cx="4" cy="-3" r="1.5" fill="#27414e"/></g></g><g transform="translate(308,74)"><g class="gather gg2" style="--dx:-108px;--dy:48px"><circle r="12" fill="#f3899f"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅏ</text><circle cx="-4" cy="-3" r="1.5" fill="#5a2436"/><circle cx="4" cy="-3" r="1.5" fill="#5a2436"/></g></g><g transform="translate(104,192)"><g class="gather gg3" style="--dx:96px;--dy:-70px"><circle r="12" fill="#f4b13c"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅁ</text><circle cx="-4" cy="-3" r="1.5" fill="#6a4810"/><circle cx="4" cy="-3" r="1.5" fill="#6a4810"/></g></g><g transform="translate(298,190)"><g class="gather gg4" style="--dx:-98px;--dy:-68px"><circle r="12" fill="#5fae7a"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅇ</text><circle cx="-4" cy="-3" r="1.5" fill="#2e5a3e"/><circle cx="4" cy="-3" r="1.5" fill="#2e5a3e"/></g></g>'+aiHani(200,236,0.85)+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🗺️','🐥','➡️'],cap:'지도를 펼쳐 모험 출발!',hl:'지도',say:'자, 한글 마을 지도를 펼쳐서 모험을 떠나자! 어디부터 가 볼까?',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="지도를 펼쳐 모험 출발"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc2dd"/><stop offset="1" stop-color="#dceede"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g transform="translate(200,144) rotate(-2)"><rect x="-156" y="-100" width="312" height="200" rx="14" fill="#f1e1bd" stroke="#cdb284" stroke-width="3"/><rect x="-148" y="-92" width="296" height="184" rx="10" fill="none" stroke="#e0ca9a" stroke-width="1.5" stroke-dasharray="3 6"/><path class="pathflow" d="M-120,72 Q-80,32 -40,52 Q12,78 32,20 Q46,-22 102,-46" fill="none" stroke="#c79a5a" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/><g transform="translate(-100,50)"><rect x="-2" y="0" width="4" height="9" fill="#9a6a44"/><path d="M0,-20 l-11,20 l22,0 z" fill="#5a9a6e"/></g><g transform="translate(-20,44)"><rect x="-1.5" y="0" width="3" height="9" fill="#5a9a6e"/><circle cx="0" cy="-3" r="7" fill="#f3899f"/><circle cx="0" cy="-3" r="2.6" fill="#ffe27a"/></g><path d="M28,28 a13,13 0 0 1 26,0 z" fill="#6a5a86"/><circle cx="41" cy="24" r="3.5" fill="#2e2750"/><path class="tw" d="M102,-58 l3.2,7.4 l8,1 l-6,5.8 l2,8 l-7.2,-4.2 l-7.2,4.2 l2,-8 l-6,-5.8 l8,-1 z" fill="#ffb02e" stroke="#e8902a" stroke-width="1"/><g transform="translate(116,-74)"><circle r="12" fill="#fff7e6" stroke="#cdb284" stroke-width="2"/><path d="M0,-9 L3,0 L0,9 L-3,0 z" fill="#e4392c"/><path d="M-9,0 L0,-3 L9,0 L0,3 z" fill="#6a5a86"/></g></g><g class="dust"><ellipse cx="62" cy="237" rx="5" ry="3" fill="#fffdf4" opacity="0.5"/></g><g class="dust du2"><ellipse cx="70" cy="239" rx="4" ry="2.4" fill="#fffdf4" opacity="0.45"/></g>'+aiHani(86,214,0.9,'dash')+'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
];

// ===== 막 시작 그림책 — 막마다 그 막의 개념을 한 장으로 소개 (하니가 기기 음성으로 읽어줌) =====
// 인트로 그림책과 같은 화면/흐름을 재사용. 자모 버블 + 결합 애니메이션으로 "글자가 만들어져요"를 보여준다.
// 공용 빌더: 자모 버블(원+큰 글자+눈 2개), 하니 병아리, 연산자(+/→), 장면 프레임.
function aiBub(x,y,r,ch,fill,eye,cls){cls=cls||'';
  // 별빛 그림책: 둥근 사각 타일 캐릭터(jamoCharSVG 톤) — 아래 그림자 + 윗 광택 + 흰 글리프 + 눈 + 발그레 볼.
  var s=(r*2).toFixed(1),h=r.toFixed(1),rx=(r*0.62).toFixed(1);
  var f=Math.round(r*1.12),ty=(r*0.34).toFixed(1);
  var ex=(r*0.34).toFixed(1),ey=(-r*0.30).toFixed(1),er=(r*0.115).toFixed(1);
  var bx=(r*0.52).toFixed(1),by=(r*0.16).toFixed(1),brx=(r*0.20).toFixed(1),bry=(r*0.13).toFixed(1);
  var body='<rect x="-'+h+'" y="-'+(r*0.86).toFixed(1)+'" width="'+s+'" height="'+s+'" rx="'+rx+'" fill="#000" fill-opacity="0.14"/>'
    +'<rect x="-'+h+'" y="-'+h+'" width="'+s+'" height="'+s+'" rx="'+rx+'" fill="'+fill+'"/>'
    +'<rect x="-'+(r*0.66).toFixed(1)+'" y="-'+(r*0.78).toFixed(1)+'" width="'+(r*1.32).toFixed(1)+'" height="'+(r*0.44).toFixed(1)+'" rx="'+(r*0.22).toFixed(1)+'" fill="#fff" opacity="0.18"/>'
    +'<text y="'+ty+'" font-family="Jua, sans-serif" font-size="'+f+'" fill="#fff" text-anchor="middle">'+ch+'</text>'
    +'<circle cx="-'+ex+'" cy="'+ey+'" r="'+er+'" fill="'+eye+'"/><circle cx="'+ex+'" cy="'+ey+'" r="'+er+'" fill="'+eye+'"/>'
    +'<ellipse cx="-'+bx+'" cy="'+by+'" rx="'+brx+'" ry="'+bry+'" fill="#ff9ec2" opacity="0.5"/><ellipse cx="'+bx+'" cy="'+by+'" rx="'+brx+'" ry="'+bry+'" fill="#ff9ec2" opacity="0.5"/>';
  return '<g transform="translate('+x+','+y+')">'+(cls?'<g class="'+cls+'">'+body+'</g>':body)+'</g>';
}
function aiOp(x,ch){return '<text x="'+x+'" y="122" font-family="Jua, sans-serif" font-size="30" fill="#fff" text-anchor="middle" opacity="0.9">'+ch+'</text>';}
// 시안 원본 하니(design reference 'Hani' 컴포넌트, viewBox 0 0 100 100)를 그대로 이식.
// 표정 토글: 날개(기본↓/응원↑) · 눈(뜸/웃음/감음) · 부리(닫힘/열림) · 반짝 · zzz.
function aiHaniCore(opts){opts=opts||{};
  var wingsUp=!!opts.wingsUp,eyes=opts.eyes||'open',beakOpen=!!opts.beakOpen;
  var b='';
  // 발 (세 발가락)
  b+='<path d="M43 86 l-4 9 M43 86 l0 9 M43 86 l4 9" stroke="#EE8B2C" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    +'<path d="M57 86 l-4 9 M57 86 l0 9 M57 86 l4 9" stroke="#EE8B2C" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
  // 머리 깃털 3가닥
    +'<path d="M50 25 C48 15 49 11 50 9 C52 12 52 18 53 24 Z" fill="#F0A833"/>'
    +'<path d="M44 26 C41 18 40 14 40 12 C44 15 46 21 48 25 Z" fill="#F0A833"/>'
    +'<path d="M56 26 C59 18 60 14 60 12 C56 15 54 21 52 25 Z" fill="#F0A833"/>';
  // 날개
  b+=wingsUp
    ?'<ellipse cx="17" cy="42" rx="7" ry="12" fill="#F3B63E" transform="rotate(-38 17 42)"/><ellipse cx="83" cy="42" rx="7" ry="12" fill="#F3B63E" transform="rotate(38 83 42)"/>'
    :'<ellipse cx="22" cy="57" rx="8.5" ry="13" fill="#F3B63E"/><ellipse cx="78" cy="57" rx="7" ry="11" fill="#F0AE39" opacity="0.9"/>';
  // 몸통 + 배 음영 + 하이라이트 + 외곽선
  b+='<ellipse cx="50" cy="55" rx="33" ry="34" fill="#F7C24C"/>'
    +'<ellipse cx="53" cy="66" rx="26" ry="21" fill="#E89A34" opacity="0.30"/>'
    +'<ellipse cx="40" cy="42" rx="18" ry="16" fill="#FFE9A8" opacity="0.75"/>'
    +'<ellipse cx="50" cy="55" rx="33" ry="34" fill="none" stroke="#E7A238" stroke-width="1.4" opacity="0.6"/>'
  // 발그레 볼
    +'<ellipse cx="34" cy="61" rx="5" ry="3.3" fill="#F49E9A" opacity="0.65"/>'
    +'<ellipse cx="66" cy="61" rx="5" ry="3.3" fill="#F49E9A" opacity="0.65"/>';
  // 눈
  if(eyes==='happy')b+='<path d="M36 54 Q42 46 48 54" stroke="#3B2A1E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 54 Q58 46 64 54" stroke="#3B2A1E" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(eyes==='sleep')b+='<path d="M36 52 Q42 57 48 52" stroke="#3B2A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M52 52 Q58 57 64 52" stroke="#3B2A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  else b+='<ellipse cx="42" cy="52" rx="6" ry="7" fill="#3B2A1E"/><ellipse cx="58" cy="52" rx="6" ry="7" fill="#3B2A1E"/>'
    +'<circle cx="40" cy="49" r="2" fill="#ffffff"/><circle cx="56" cy="49" r="2" fill="#ffffff"/>'
    +'<circle cx="43.5" cy="54.5" r="1" fill="#ffffff" opacity="0.6"/><circle cx="59.5" cy="54.5" r="1" fill="#ffffff" opacity="0.6"/>';
  // 부리
  b+=beakOpen
    ?'<ellipse cx="50" cy="64" rx="6" ry="5.5" fill="#EF8B2A"/><path d="M44.5 62 L55.5 62 L50 58 Z" fill="#F6A23C"/><ellipse cx="50" cy="66" rx="2.6" ry="2.2" fill="#C96A1E"/>'
    :'<path d="M45.5 60 L54.5 60 L50 57 Z" fill="#F6A23C"/><path d="M45.5 60 L54.5 60 L50 66 Z" fill="#EF8B2A"/>';
  if(opts.sparkles)b+='<path d="M14 30 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6 Z" fill="#F5C24A"/><path d="M86 34 l1.2 2.7 2.7 1.2 -2.7 1.2 -1.2 2.7 -1.2 -2.7 -2.7 -1.2 2.7 -1.2 Z" fill="#F5C24A"/>';
  if(opts.zzz)b+='<text x="76" y="30" font-family="Jua, sans-serif" font-size="13" fill="#9DB2C4">z</text><text x="84" y="22" font-family="Jua, sans-serif" font-size="9" fill="#B7C7D5">z</text>';
  return b;
}
// 장면용 하니: cls에 determined(응원)/joy(기쁨)/sleep(졸림)/dash·search(이동 애니), sing=부리 열림.
function aiHani(x,y,s,cls,sing){s=(s==null?1:s);cls=cls||'';
  var cheer=cls.indexOf('determined')>=0;
  var core=aiHaniCore({wingsUp:cheer,eyes:cls.indexOf('joy')>=0?'happy':(cls.indexOf('sleep')>=0?'sleep':'open'),
    beakOpen:!!sing||cheer||cls.indexOf('joy')>=0,sparkles:cheer,zzz:cls.indexOf('sleep')>=0});
  return '<g transform="translate('+x+','+y+') scale('+s+')"><g class="hani '+cls+'">'
    +'<g transform="translate(-31,-32.2) scale(0.62)">'
    +'<ellipse cx="50" cy="97" rx="27" ry="5.5" fill="#000" fill-opacity="0.12"/>'
    +core+'</g></g></g>';
}
// 헤더/이야기 얼굴용 코인 아바타(시안 원본): 크림 코인 배경 + 하니.
function aiHaniSVG(cls){
  return '<svg class="hani-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="병아리 하니">'
    +'<circle cx="50" cy="50" r="50" fill="#FBEAC0"/><circle cx="43" cy="41" r="40" fill="#FFF4D8" opacity="0.55"/>'
    +'<g class="hani '+(cls||'')+'">'+aiHaniCore({beakOpen:cls==='sing'})+'</g></svg>';
}
// 시안 원본 자모 캐릭터(design reference 'Jamo' 컴포넌트, viewBox 0 0 100 100)를 그대로 이식.
// 밝은 앞머리 블롭 + 그 위 큰 눈 + 옆 볼 + 아래 안쪽 그림자 + 흰 글리프(하단 2/3 중앙).
function jamoCharSVG(ch,isVowel){
  var c=isVowel
    ?{base:'#E39FAD',dark:'#BD7686',hi:'#F6CBD3',blush:'#EF9AA0',eye:'#6E3B47'}   // 모음 로즈
    :{base:'#6E9AC2',dark:'#456F98',hi:'#B6D0E6',blush:'#F2A8A2',eye:'#26405C'};  // 자음 블루
  var g=String(ch==null?'':ch).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return '<svg class="jamo-char" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="자모 '+g+'">'
    +'<rect x="9" y="9" width="82" height="82" rx="30" ry="30" fill="'+c.base+'"/>'
    +'<path d="M50 91 h29 a12 12 0 0 0 12 -12 v-22 a44 44 0 0 1 -82 22 v0 a12 12 0 0 0 12 12 Z" fill="'+c.dark+'" opacity="0.30"/>'
    +'<ellipse cx="36" cy="29" rx="19" ry="12" fill="'+c.hi+'" opacity="0.5"/>'
    +'<rect x="9" y="9" width="82" height="82" rx="30" ry="30" fill="none" stroke="'+c.dark+'" stroke-width="1.6" opacity="0.55"/>'
    +'<ellipse cx="26" cy="38" rx="5.2" ry="3.4" fill="'+c.blush+'" opacity="0.7"/>'
    +'<ellipse cx="74" cy="38" rx="5.2" ry="3.4" fill="'+c.blush+'" opacity="0.7"/>'
    +'<ellipse cx="39" cy="28" rx="4.6" ry="5.6" fill="'+c.eye+'"/>'
    +'<ellipse cx="61" cy="28" rx="4.6" ry="5.6" fill="'+c.eye+'"/>'
    +'<circle cx="37.6" cy="25.8" r="1.6" fill="#ffffff"/><circle cx="59.6" cy="25.8" r="1.6" fill="#ffffff"/>'
    +'<text x="50" y="64" text-anchor="middle" dominant-baseline="central" font-family="Jua, sans-serif" font-size="44" fill="rgba(0,0,0,0.18)" transform="translate(0,2)">'+g+'</text>'
    +'<text x="50" y="64" text-anchor="middle" dominant-baseline="central" font-family="Jua, sans-serif" font-size="44" fill="#ffffff">'+g+'</text>'
    +'</svg>';
}
// ===== 막 배경(환경) — 장소에 맞는 배경. 라벨→환경 매핑으로 24개 장면에 자동 적용 =====
// night(기본): 밤하늘+달+별 / forest: 숲 / forge: 대장간 / gate: 돌문·성벽 / cave: 소리 동굴 / garden: 낮 동산 / post: 밤 마을+우체국
var SCENE_ENV={
  '텅 빈 편지':'forest','반딧불이 깜빡이':'forest','모음을 불러요':'forest',
  '조용한 숲':'forest','숲지기 도토리':'forest','손을 잡으니 가!':'forest',
  '대장장이 곰':'forge','땅! 새 글자':'forge','직접 만들어요':'forge',
  '무거운 문':'gate','받침돌을 얹어요':'gate','문이 열렸다':'gate',
  '메아리 동굴':'cave','힘을 꾹!':'cave','센 소리 되찾기':'cave',
  '별빛 뒤':'forest','겹치면 나와요':'forest','숨은 모음 찾기':'forest',
  '시든 마을':'garden','글자가 모여 단어':'garden','단어를 지어요':'garden',
  '우체국으로':'post','편지가 살아나요':'post','스스로 읽어요':'post'
};
function _pine(x,base,h,c){var t=function(m){return (h*m).toFixed(0);};
  return '<g transform="translate('+x+','+base+')"><rect x="-4" y="-6" width="8" height="12" fill="#3A2A20"/>'
    +'<g fill="'+c+'"><path d="M0,-'+t(1)+' L'+t(0.42)+',-'+t(0.52)+' L-'+t(0.42)+',-'+t(0.52)+' Z"/>'
    +'<path d="M0,-'+t(0.74)+' L'+t(0.5)+',-'+t(0.3)+' L-'+t(0.5)+',-'+t(0.3)+' Z"/>'
    +'<path d="M0,-'+t(0.46)+' L'+t(0.56)+',-2 L-'+t(0.56)+',-2 Z"/></g></g>';}
function _stalac(x,y,len){return '<path d="M'+(x-9)+','+y+' L'+(x+9)+','+y+' L'+x+','+(y+len)+' Z" fill="#2C2740"/>';}
function _stalag(x,base,h){return '<path d="M'+(x-11)+','+base+' L'+(x+11)+','+base+' L'+x+','+(base-h)+' Z" fill="#332C46"/>';}
function _crystal(x,y,c){return '<g class="tw" transform="translate('+x+','+y+')"><path d="M0,-12 L5,-2 L3,8 L-3,8 L-5,-2 Z" fill="'+c+'" opacity="0.85"/><path d="M0,-12 L5,-2 L0,-2 Z" fill="#fff" opacity="0.45"/></g>';}
function _torch(x,y){return '<ellipse cx="'+x+'" cy="'+y+'" rx="34" ry="42" fill="url(#etorch)"/><g transform="translate('+x+','+y+')"><rect x="-3" y="0" width="6" height="30" rx="2" fill="#4A3A2C"/><path class="tw" d="M-7,2 Q-10,-14 -2,-22 Q0,-12 3,-20 Q9,-10 7,2 Z" fill="#FFB23E"/><path class="tw t2" d="M-3,0 Q-4,-12 2,-18 Q6,-10 4,0 Z" fill="#FFE07A"/></g>';}
function _flower(x,y,c){return '<g transform="translate('+x+','+y+')"><line x1="0" y1="0" x2="0" y2="-16" stroke="#5F9A44" stroke-width="2.4"/><g fill="'+c+'"><circle cx="0" cy="-20" r="4"/><circle cx="-5" cy="-18" r="4"/><circle cx="5" cy="-18" r="4"/><circle cx="-3" cy="-24" r="4"/><circle cx="3" cy="-24" r="4"/></g><circle cx="0" cy="-21" r="2.4" fill="#FFE27A"/></g>';}
function _grid(rows,rh,cw,stroke){var s='<g stroke="'+stroke+'" stroke-width="1.6" opacity="0.5">';for(var r=0;r<rows;r++){var y=r*rh;s+='<line x1="0" y1="'+y+'" x2="400" y2="'+y+'"/>';var off=(r%2)*(cw/2);for(var x=off;x<400;x+=cw){s+='<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y+rh)+'"/>';}}return s+'</g>';}
function aiEnvBg(env){
  if(env==='forest')return ''
    +'<circle cx="336" cy="52" r="40" fill="url(#ahalo)"/><circle cx="336" cy="52" r="20" fill="url(#amoon)"/>'
    +'<g fill="#fff" opacity="0.85"><circle class="tw" cx="70" cy="34" r="1.8"/><circle class="tw t2" cx="200" cy="24" r="1.5"/><circle class="tw t3" cx="270" cy="44" r="1.6"/></g>'
    +'<path d="M0,208 Q200,194 400,208 L400,280 L0,280 Z" fill="#2F4A38"/>'
    +'<path d="M0,236 Q200,224 400,238 L400,280 L0,280 Z" fill="#26402F"/>'
    +_pine(32,208,54,'#20402E')+_pine(74,214,40,'#274A36')+_pine(368,208,54,'#20402E')+_pine(330,216,38,'#274A36')
    +'<g fill="#F5CD82"><circle class="tw" cx="120" cy="150" r="2"/><circle class="tw t3" cx="286" cy="140" r="1.8"/><circle class="tw t2" cx="250" cy="182" r="1.6"/></g>';
  if(env==='cave')return ''
    +'<defs><radialGradient id="ecglow" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stop-color="#5FA9A0" stop-opacity="0.4"/><stop offset="1" stop-color="#5FA9A0" stop-opacity="0"/></radialGradient></defs>'
    +'<rect x="0" y="0" width="400" height="280" fill="#1E1A2E"/>'
    +'<path d="M0,0 L400,0 L400,54 Q300,92 200,60 Q100,34 0,70 Z" fill="#2A2440"/>'
    +_stalac(70,58,42)+_stalac(120,64,26)+_stalac(250,58,24)+_stalac(300,62,46)+_stalac(342,64,22)
    +'<path d="M0,0 L46,0 Q28,140 58,280 L0,280 Z" fill="#241F36" opacity="0.9"/>'
    +'<path d="M400,0 L354,0 Q372,150 342,280 L400,280 Z" fill="#241F36" opacity="0.9"/>'
    +'<ellipse cx="200" cy="205" rx="155" ry="72" fill="url(#ecglow)"/>'
    +'<path d="M0,214 Q120,196 210,210 Q320,224 400,206 L400,280 L0,280 Z" fill="#2A2438"/>'
    +'<path d="M0,242 Q200,228 400,244 L400,280 L0,280 Z" fill="#201B2E"/>'
    +_stalag(92,214,26)+_stalag(320,210,30)
    +_crystal(58,196,'#6FD0C8')+_crystal(348,190,'#8FB0E8')+_crystal(150,214,'#C9A0E8');
  if(env==='forge')return ''
    +'<defs><radialGradient id="efire" cx="0.5" cy="0.62" r="0.6"><stop offset="0" stop-color="#FFC24A" stop-opacity="0.9"/><stop offset="0.6" stop-color="#F5893C" stop-opacity="0.45"/><stop offset="1" stop-color="#F5893C" stop-opacity="0"/></radialGradient></defs>'
    +'<rect x="0" y="0" width="400" height="214" fill="#7A5A44"/>'
    +_grid(5,38,80,'#6A4A38')
    +'<rect x="290" y="32" width="72" height="56" rx="4" fill="#2E3A52"/><line x1="326" y1="32" x2="326" y2="88" stroke="#5A4636" stroke-width="3"/><line x1="290" y1="60" x2="362" y2="60" stroke="#5A4636" stroke-width="3"/><rect x="290" y="32" width="72" height="56" rx="4" fill="none" stroke="#5A4636" stroke-width="4"/><circle cx="345" cy="47" r="5" fill="#F5E6B0" opacity="0.7"/>'
    +'<ellipse cx="60" cy="150" rx="72" ry="62" fill="url(#efire)"/>'
    +'<g transform="translate(60,150)"><path d="M-34,44 L34,44 L28,-6 Q28,-20 0,-20 Q-28,-20 -28,-6 Z" fill="#5A4038"/><path d="M-22,44 L22,44 L18,2 Q18,-8 0,-8 Q-18,-8 -18,2 Z" fill="#2A1E1A"/><path class="tw" d="M-8,40 Q-14,20 -6,10 Q-2,20 2,8 Q8,22 6,40 Z" fill="#FFB23E"/><path class="tw t2" d="M2,40 Q-2,24 4,14 Q8,24 10,14 Q12,28 10,40 Z" fill="#FFD65A"/></g>'
    +'<rect x="0" y="212" width="400" height="68" fill="#6A4A32"/>'
    +'<g stroke="#553A26" stroke-width="2"><line x1="0" y1="230" x2="400" y2="230"/><line x1="0" y1="254" x2="400" y2="254"/><line x1="120" y1="212" x2="120" y2="280"/><line x1="270" y1="212" x2="270" y2="280"/></g>'
    +'<g stroke="#4A3A2C" stroke-width="3"><line x1="250" y1="0" x2="250" y2="26"/><line x1="278" y1="0" x2="278" y2="30"/></g><rect x="242" y="24" width="16" height="8" rx="2" fill="#8a8f98"/><path d="M272,30 l12,10" stroke="#8a8f98" stroke-width="5" stroke-linecap="round"/>';
  if(env==='gate')return ''
    +'<defs><radialGradient id="etorch" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFC24A" stop-opacity="0.7"/><stop offset="1" stop-color="#FFC24A" stop-opacity="0"/></radialGradient></defs>'
    +'<rect x="0" y="0" width="400" height="220" fill="#3A3550"/>'
    +_grid(5,44,90,'#332E48')
    +_torch(40,120)+_torch(360,120)
    +'<rect x="0" y="216" width="400" height="64" fill="#2C2840"/>'
    +'<g stroke="#242038" stroke-width="2"><line x1="70" y1="216" x2="70" y2="280"/><line x1="200" y1="216" x2="200" y2="280"/><line x1="330" y1="216" x2="330" y2="280"/><line x1="0" y1="250" x2="400" y2="250"/></g>';
  if(env==='garden')return ''
    +'<defs><radialGradient id="esun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF3C0" stop-opacity="0.95"/><stop offset="1" stop-color="#FFF3C0" stop-opacity="0"/></radialGradient></defs>'
    +'<circle cx="336" cy="54" r="46" fill="url(#esun)"/><circle cx="336" cy="54" r="22" fill="#FFE9A0"/>'
    +'<g fill="#fff" opacity="0.85"><ellipse cx="90" cy="58" rx="26" ry="12"/><ellipse cx="114" cy="54" rx="18" ry="14"/><ellipse cx="205" cy="40" rx="20" ry="10"/></g>'
    +'<path d="M0,178 Q120,150 260,176 Q340,190 400,170 L400,280 L0,280 Z" fill="#8FC66E"/>'
    +'<path d="M0,212 Q160,188 400,212 L400,280 L0,280 Z" fill="#77B559"/>'
    +'<path d="M0,244 Q200,228 400,246 L400,280 L0,280 Z" fill="#6AA84E"/>'
    +_flower(60,206,'#F3899F')+_flower(120,226,'#F4D06A')+_flower(300,214,'#B49BE8')+_flower(352,234,'#F58BB0')
    +'<g stroke="#5F9A44" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M90,240 q-3,-10 0,-16 M96,240 q3,-9 6,-14"/><path d="M248,232 q-3,-10 0,-16 M254,232 q3,-9 6,-14"/></g>';
  if(env==='post')return ''
    +'<circle cx="336" cy="52" r="44" fill="url(#ahalo)"/><circle cx="336" cy="52" r="22" fill="url(#amoon)"/>'
    +'<g fill="#fff" opacity="0.85"><circle class="tw" cx="60" cy="36" r="1.8"/><circle class="tw t2" cx="150" cy="26" r="1.5"/><circle class="tw t3" cx="252" cy="40" r="1.6"/></g>'
    +'<g fill="#2E2748" opacity="0.85"><path d="M18,202 L18,150 L48,132 L78,150 L78,202 Z"/><path d="M322,202 L322,156 L348,140 L374,156 L374,202 Z"/></g>'
    +'<path d="M0,200 Q200,190 400,200 L400,280 L0,280 Z" fill="#3A3355"/>'
    +'<path d="M0,232 Q200,222 400,234 L400,280 L0,280 Z" fill="#302A48"/>'
    +'<g transform="translate(66,202)"><rect x="-2" y="-54" width="4" height="54" fill="#2A2440"/><ellipse cx="0" cy="-58" rx="26" ry="20" fill="#FFE9A0" opacity="0.28"/><circle cx="0" cy="-56" r="6" fill="#FFE9A0"/></g>';
  // night(기본): 밤하늘+달+별+잔별+어두운 지평선
  return ''
    +'<circle cx="331" cy="60" r="52" fill="url(#ahalo)"/><circle cx="331" cy="60" r="26" fill="url(#amoon)"/>'
    +'<g fill="#fff" opacity="0.9"><circle class="tw" cx="60" cy="40" r="2"/><circle class="tw t2" cx="150" cy="26" r="1.6"/><circle class="tw t3" cx="232" cy="52" r="1.8"/></g>'
    +'<g fill="#F5CD82"><path class="tw t2" d="M96,86 l2.6,6 l6,2.6 l-6,2.6 l-2.6,6 l-2.6,-6 l-6,-2.6 l6,-2.6 z"/><path class="tw t3" d="M283,116 l2.2,5 l5,2.2 l-5,2.2 l-2.2,5 l-2.2,-5 l-5,-2.2 l5,-2.2 z"/></g>'
    +'<path d="M0,212 Q200,198 400,212 L400,280 L0,280 Z" fill="#241D3A" fill-opacity="0.30"/>'
    +'<path d="M0,236 Q200,224 400,236 L400,280 L0,280 Z" fill="#241D3A" fill-opacity="0.22"/>';
}
function aiScene(label,sky0,sky1,inner,env){
  return '<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+label+'">'
    +'<defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath>'
    +'<linearGradient id="asky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sky0+'"/><stop offset="1" stop-color="'+sky1+'"/></linearGradient>'
    +'<radialGradient id="amoon" cx="0.42" cy="0.38" r="0.62"><stop offset="0" stop-color="#FFF6D8"/><stop offset="0.75" stop-color="#F8E1A4"/><stop offset="1" stop-color="#F2CF88"/></radialGradient>'
    +'<radialGradient id="ahalo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF0C4" stop-opacity="0.5"/><stop offset="1" stop-color="#FFF0C4" stop-opacity="0"/></radialGradient>'
    +'<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs>'
    +'<g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#asky)"/>'
    +aiEnvBg(env||SCENE_ENV[label]||'night')
    +inner
    +'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>';
}
function aiNote(x,y,cls){return '<text class="notefloat '+(cls||'')+'" x="'+x+'" y="'+y+'" font-family="Jua, sans-serif" font-size="20" fill="#fffbe6" text-anchor="middle">♪</text>';}
function aiSpark(x,y,cls){return '<g class="spark '+(cls||'')+'" transform="translate('+x+','+y+')"><path d="M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2 Z" fill="#ffe27a"/></g>';}
// 도우미 캐릭터: 포근한 방석(크림 원+골드 링) 위 큰 이모지 + 크림 이름표(잉크 글씨). 별빛 그림책 톤.
function aiHelper(x,y,emoji,name,sz){sz=sz||46;name=name||'';var half=Math.max(32,name.length*7);
  var py=(sz*0.54).toFixed(0);
  var g='<g transform="translate('+x+','+y+')">'
    +'<ellipse cx="0" cy="'+(sz*0.5).toFixed(0)+'" rx="'+(sz*0.62).toFixed(0)+'" ry="'+(sz*0.16).toFixed(0)+'" fill="#000" fill-opacity="0.10"/>'
    +'<circle cx="0" cy="0" r="'+(sz*0.72).toFixed(0)+'" fill="#FFF7E4" fill-opacity="0.9"/>'
    +'<circle cx="0" cy="0" r="'+(sz*0.72).toFixed(0)+'" fill="none" stroke="#F5CD82" stroke-width="3" opacity="0.7"/>'
    +'<text x="0" y="'+(sz*0.34).toFixed(0)+'" font-size="'+sz+'" text-anchor="middle">'+emoji+'</text>';
  if(name){g+='<rect x="-'+half+'" y="'+py+'" width="'+(half*2)+'" height="21" rx="10.5" fill="#FFFAEE" stroke="#E9C899" stroke-width="2"/>'
    +'<text x="0" y="'+(sz*0.54+15).toFixed(0)+'" font-family="Jua, sans-serif" font-size="12" fill="#4A3524" text-anchor="middle">'+name+'</text>';}
  return g+'</g>';}

// ===== 서브캐릭터(막 도우미) 손그림 빌더 — 하니(aiHaniCore) 톤: 따뜻한 팔레트·큰 반짝 눈·발그레 볼·바닥 그림자 =====
// 각 함수 (x,y,name,sz) → 장면에 배치되는 <g>. art는 원점 중심으로 그리고 sz에 맞춰 스케일, 이름표는 aiName.
function aiName(name,sz){name=name||'';if(!name)return '';var half=Math.max(32,name.length*7);var py=(sz*0.62).toFixed(0);
  return '<rect x="-'+half+'" y="'+py+'" width="'+(half*2)+'" height="21" rx="10.5" fill="#FFFAEE" stroke="#E9C899" stroke-width="2"/>'
    +'<text x="0" y="'+(sz*0.62+15).toFixed(0)+'" font-family="Jua, sans-serif" font-size="12" fill="#4A3524" text-anchor="middle">'+name+'</text>';}
function _mob(x,y,sz,name,art,fscale,cls){var k=(sz*0.0165*(fscale||1));
  var inner=cls?'<g class="'+cls+'">'+art+'</g>':art;   // 애니 클래스는 스케일 그룹 '안'에(둘 다 transform이라 충돌 방지)
  return '<g transform="translate('+x+','+y+')">'
    +'<ellipse cx="0" cy="'+(sz*0.72).toFixed(0)+'" rx="'+(sz*0.6).toFixed(0)+'" ry="'+(sz*0.15).toFixed(0)+'" fill="#000" fill-opacity="0.12"/>'
    +'<g transform="scale('+k.toFixed(3)+')">'+inner+'</g>'+aiName(name,sz)+'</g>';}
// 대장장이 곰 뚝딱 — 전신(머리+몸통+팔다리) + 모루 + 망치. 오른팔+망치는 mob-hammer로 '뚝딱' 스윙, 타격 순간 mob-clang 불꽃.
function aiBear(x,y,name,sz){sz=sz||54;
  var arm=''  // 스윙하는 오른팔+망치 (어깨 피벗). 이 그룹엔 transform 속성 없음 → CSS 회전 적용.
    +'<g class="mob-hammer">'
    +'<path d="M15 -10 Q34 -24 40 -46" stroke="#B07A46" stroke-width="10" fill="none" stroke-linecap="round"/>'
    +'<circle cx="40" cy="-48" r="7.5" fill="#A9713F"/>'
    +'<g transform="translate(40,-50) rotate(-16)">'
      +'<rect x="-3.4" y="-2" width="6.8" height="30" rx="3" fill="#8E5F36"/>'
      +'<rect x="-16" y="-19" width="32" height="15" rx="4" fill="#9AA3AD"/>'
      +'<rect x="-16" y="-19" width="32" height="5.5" rx="3" fill="#C3CCD4"/>'
    +'</g>'
    +'</g>';
  var a=''
    +'<ellipse cx="-15" cy="41" rx="10" ry="7" fill="#9C6A3B"/><ellipse cx="15" cy="41" rx="10" ry="7" fill="#9C6A3B"/>'  // 발
    +'<ellipse cx="0" cy="10" rx="27" ry="30" fill="#B07A46"/>'  // 몸통
    +'<ellipse cx="0" cy="10" rx="27" ry="30" fill="none" stroke="#8F5E33" stroke-width="1.6" opacity="0.5"/>'
    +'<path d="M-30 24 Q-36 10 -21 -4" stroke="#B07A46" stroke-width="10" fill="none" stroke-linecap="round"/>'  // 왼팔(모루에)
    +'<circle cx="-30" cy="26" r="7.5" fill="#A9713F"/>'
    +'<path d="M-16 -10 Q0 -16 16 -10 L21 30 Q0 40 -21 30 Z" fill="#E4574B"/>'  // 대장장이 앞치마
    +'<path d="M-16 -10 Q0 -16 16 -10 L17 0 Q0 4 -17 0 Z" fill="#D5473C"/>'
    +'<circle cx="0" cy="22" r="3" fill="#fff" opacity="0.8"/>'
    // 머리
    +'<circle cx="-17" cy="-50" r="10" fill="#A9713F"/><circle cx="17" cy="-50" r="10" fill="#A9713F"/>'
    +'<circle cx="-17" cy="-50" r="5" fill="#CDA074"/><circle cx="17" cy="-50" r="5" fill="#CDA074"/>'
    +'<circle cx="0" cy="-33" r="25" fill="#B07A46"/>'
    +'<circle cx="0" cy="-33" r="25" fill="none" stroke="#8F5E33" stroke-width="1.4" opacity="0.5"/>'
    +'<ellipse cx="-9" cy="-43" rx="12" ry="9" fill="#E7C79E" opacity="0.4"/>'
    +'<ellipse cx="0" cy="-25" rx="14" ry="11" fill="#EAD8B6"/>'
    +'<ellipse cx="-17" cy="-29" rx="4.2" ry="2.8" fill="#F49E9A" opacity="0.6"/><ellipse cx="17" cy="-29" rx="4.2" ry="2.8" fill="#F49E9A" opacity="0.6"/>'
    +'<ellipse cx="-8" cy="-37" rx="4.2" ry="5" fill="#3B2A1E"/><ellipse cx="8" cy="-37" rx="4.2" ry="5" fill="#3B2A1E"/>'
    +'<circle cx="-9.4" cy="-39" r="1.4" fill="#fff"/><circle cx="6.6" cy="-39" r="1.4" fill="#fff"/>'
    +'<ellipse cx="0" cy="-28" rx="3.6" ry="2.8" fill="#4A3524"/>'
    +'<path d="M0 -25 Q0 -21 -4 -20 M0 -25 Q0 -21 4 -20" stroke="#6E4A2C" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    // 모루(오른쪽 앞)
    +'<g transform="translate(30,30)"><rect x="-13" y="7" width="26" height="9" rx="2" fill="#3f3b47"/><path d="M-15 -1 L15 -1 L11 7 L-11 7 Z" fill="#524d5b"/><rect x="-17" y="-6" width="24" height="6" rx="2" fill="#625d6c"/><path d="M-17 -6 l-5 3 l5 3 z" fill="#524d5b"/></g>'
    +'<g class="mob-clang" transform="translate(30,20)"><path d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z" fill="#FFE27A"/></g>'
    + arm;
  return _mob(x,y,sz,name,a);}
function aiToad(x,y,name,sz){sz=sz||46;var a=''
  +'<ellipse cx="0" cy="0" rx="42" ry="32" fill="#74B45A"/>'
  +'<ellipse cx="0" cy="0" rx="42" ry="32" fill="none" stroke="#4E823B" stroke-width="1.6" opacity="0.5"/>'
  +'<ellipse cx="0" cy="10" rx="27" ry="18" fill="#CDE9B0" opacity="0.9"/>'
  +'<circle cx="-30" cy="-10" r="4" fill="#5E9A46"/><circle cx="32" cy="-8" r="3.4" fill="#5E9A46"/><circle cx="20" cy="-22" r="2.8" fill="#5E9A46"/>'
  +'<circle cx="-18" cy="-28" r="15" fill="#86C169"/><circle cx="18" cy="-28" r="15" fill="#86C169"/>'
  +'<circle cx="-18" cy="-28" r="15" fill="none" stroke="#4E823B" stroke-width="1.2" opacity="0.5"/><circle cx="18" cy="-28" r="15" fill="none" stroke="#4E823B" stroke-width="1.2" opacity="0.5"/>'
  +'<circle cx="-18" cy="-25" r="8.5" fill="#fff"/><circle cx="18" cy="-25" r="8.5" fill="#fff"/>'
  +'<circle cx="-18" cy="-23" r="5" fill="#3B2A1E"/><circle cx="18" cy="-23" r="5" fill="#3B2A1E"/>'
  +'<circle cx="-19.5" cy="-25" r="1.7" fill="#fff"/><circle cx="16.5" cy="-25" r="1.7" fill="#fff"/>'
  +'<path d="M-27 -29 A9 9 0 0 1 -9 -29 L-9 -27 L-27 -27 Z" fill="#6AA34F"/><path d="M9 -29 A9 9 0 0 1 27 -29 L27 -27 L9 -27 Z" fill="#6AA34F"/>'
  +'<ellipse cx="-30" cy="6" rx="6" ry="4" fill="#F49E9A" opacity="0.55"/><ellipse cx="30" cy="6" rx="6" ry="4" fill="#F49E9A" opacity="0.55"/>'
  +'<path d="M-20 10 Q0 20 20 10" stroke="#3E6B2E" stroke-width="3" fill="none" stroke-linecap="round"/>'
  +'<ellipse cx="-18" cy="29" rx="9" ry="5" fill="#6AA34F"/><ellipse cx="18" cy="29" rx="9" ry="5" fill="#6AA34F"/>'
  +'<path d="M-24 29 l0 4 M-18 30 l0 4 M-12 29 l0 4" stroke="#4E823B" stroke-width="1.8" stroke-linecap="round"/>'
  +'<path d="M12 29 l0 4 M18 30 l0 4 M24 29 l0 4" stroke="#4E823B" stroke-width="1.8" stroke-linecap="round"/>';
  return _mob(x,y,sz,name,a,1,'mob-nod');}
function aiFirefly(x,y,name,sz){sz=sz||46;var a=''
  +'<circle cx="0" cy="6" r="40" fill="#FFF3B0" opacity="0.22"/>'
  +'<ellipse cx="-22" cy="-4" rx="16" ry="20" fill="#fff" opacity="0.5" transform="rotate(-20 -22 -4)"/>'
  +'<ellipse cx="22" cy="-4" rx="16" ry="20" fill="#fff" opacity="0.5" transform="rotate(20 22 -4)"/>'
  +'<ellipse cx="0" cy="6" rx="22" ry="26" fill="#C7E06A"/>'
  +'<ellipse cx="0" cy="6" rx="22" ry="26" fill="none" stroke="#9CBE4E" stroke-width="1.4" opacity="0.6"/>'
  +'<path d="M-22 6 Q0 12 22 6" stroke="#9CBE4E" stroke-width="1.4" fill="none" opacity="0.5"/>'
  +'<circle cx="0" cy="-20" r="15" fill="#7FA83E"/>'
  +'<path d="M-6 -32 Q-10 -42 -14 -44 M6 -32 Q10 -42 14 -44" stroke="#7FA83E" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
  +'<g class="tw"><circle cx="-14" cy="-44" r="2.6" fill="#FFE27A"/></g><g class="tw t2"><circle cx="14" cy="-44" r="2.6" fill="#FFE27A"/></g>'
  +'<ellipse cx="-5" cy="-20" rx="4.4" ry="5.2" fill="#3B2A1E"/><ellipse cx="5" cy="-20" rx="4.4" ry="5.2" fill="#3B2A1E"/>'
  +'<circle cx="-6.3" cy="-22" r="1.5" fill="#fff"/><circle cx="3.7" cy="-22" r="1.5" fill="#fff"/>'
  +'<ellipse cx="-11" cy="-13" rx="3.5" ry="2.4" fill="#F49E9A" opacity="0.6"/><ellipse cx="11" cy="-13" rx="3.5" ry="2.4" fill="#F49E9A" opacity="0.6"/>'
  +'<g class="mob-blink"><circle cx="0" cy="30" r="16" fill="#FFE27A" opacity="0.35"/><circle cx="0" cy="30" r="10" fill="#FFE27A"/><circle cx="0" cy="30" r="5" fill="#FFF6C8"/></g>';
  return _mob(x,y,sz,name,a,1,'mob-float');}
function aiSquirrel(x,y,name,sz){sz=sz||46;var a=''
  +'<g class="mob-tail"><path d="M28 20 Q60 6 52 -30 Q48 -54 22 -50 Q40 -40 40 -18 Q40 6 20 18 Z" fill="#B07A46"/>'
  +'<path d="M30 16 Q52 4 46 -26 Q43 -44 26 -44 Q38 -34 36 -16 Q34 4 22 14 Z" fill="#C99A63" opacity="0.8"/></g>'
  +'<ellipse cx="0" cy="14" rx="24" ry="26" fill="#A9713F"/>'
  +'<ellipse cx="0" cy="20" rx="15" ry="16" fill="#EAD8B6" opacity="0.85"/>'
  +'<circle cx="0" cy="-16" r="22" fill="#B07A46"/>'
  +'<circle cx="-15" cy="-34" r="8" fill="#A9713F"/><circle cx="15" cy="-34" r="8" fill="#A9713F"/>'
  +'<circle cx="-15" cy="-34" r="4" fill="#CDA074"/><circle cx="15" cy="-34" r="4" fill="#CDA074"/>'
  +'<ellipse cx="-24" cy="-10" rx="6" ry="4.5" fill="#F49E9A" opacity="0.55"/><ellipse cx="24" cy="-10" rx="6" ry="4.5" fill="#F49E9A" opacity="0.55"/>'
  +'<ellipse cx="-9" cy="-16" rx="5.4" ry="6.4" fill="#3B2A1E"/><ellipse cx="9" cy="-16" rx="5.4" ry="6.4" fill="#3B2A1E"/>'
  +'<circle cx="-10.5" cy="-18.5" r="1.8" fill="#fff"/><circle cx="7.5" cy="-18.5" r="1.8" fill="#fff"/>'
  +'<ellipse cx="0" cy="-7" rx="3.4" ry="2.6" fill="#5A3A22"/>'
  +'<path d="M0 -5 Q0 0 -4 1 M0 -5 Q0 0 4 1" stroke="#6E4A2C" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  +'<g transform="translate(0,30)"><ellipse cx="0" cy="3" rx="8" ry="9" fill="#E0B978"/><path d="M-8 -2 Q0 -10 8 -2 Q8 2 0 2 Q-8 2 -8 -2 Z" fill="#8A5A34"/><rect x="-1.4" y="-11" width="2.8" height="4" rx="1.2" fill="#6E4423"/></g>'
  +'<ellipse cx="-9" cy="26" rx="5" ry="4" fill="#A9713F"/><ellipse cx="9" cy="26" rx="5" ry="4" fill="#A9713F"/>';
  return _mob(x,y,sz,name,a);}
function aiBats(x,y,name,sz){sz=sz||46;
  function bat(cx){return '<g transform="translate('+cx+',0)">'
    +'<g class="mob-flapL"><path d="M-10 -4 Q-30 -18 -34 -2 Q-26 -6 -20 2 Q-16 -2 -10 2 Z" fill="#6E5E9E"/></g>'
    +'<g class="mob-flapR"><path d="M10 -4 Q30 -18 34 -2 Q26 -6 20 2 Q16 -2 10 2 Z" fill="#6E5E9E"/></g>'
    +'<circle cx="0" cy="0" r="15" fill="#7C6BA8"/>'
    +'<path d="M-9 -12 L-5 -20 L-1 -12 Z" fill="#7C6BA8"/><path d="M9 -12 L5 -20 L1 -12 Z" fill="#7C6BA8"/>'
    +'<ellipse cx="-5" cy="-1" rx="4" ry="4.6" fill="#2E2440"/><ellipse cx="5" cy="-1" rx="4" ry="4.6" fill="#2E2440"/>'
    +'<circle cx="-6" cy="-2.5" r="1.3" fill="#fff"/><circle cx="4" cy="-2.5" r="1.3" fill="#fff"/>'
    +'<ellipse cx="-9" cy="5" rx="3" ry="2" fill="#F49E9A" opacity="0.5"/><ellipse cx="9" cy="5" rx="3" ry="2" fill="#F49E9A" opacity="0.5"/>'
    +'<path d="M-3 6 L-2 9 L0 6 L2 9 L3 6" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
    +'</g>';}
  var a='<circle cx="0" cy="0" r="40" fill="#6a5db0" opacity="0.14"/>'+bat(-19)+bat(19);
  return _mob(x,y,sz,name,a,0.9,'mob-float');}
function aiFairy(x,y,name,sz){sz=sz||46;var a=''
  +'<circle cx="0" cy="0" r="40" fill="#E8D9FF" opacity="0.22"/>'
  +'<ellipse cx="-20" cy="0" rx="16" ry="22" fill="#CBB8F0" opacity="0.55" transform="rotate(-16 -20 0)"/>'
  +'<ellipse cx="20" cy="0" rx="16" ry="22" fill="#CBB8F0" opacity="0.55" transform="rotate(16 20 0)"/>'
  +'<path d="M-14 6 Q0 -2 14 6 L20 34 Q0 42 -20 34 Z" fill="#B49BE8"/>'
  +'<path d="M-14 6 Q0 -2 14 6 L16 18 Q0 22 -16 18 Z" fill="#C9B4F2"/>'
  +'<circle cx="0" cy="-12" r="15" fill="#FCE7CE"/>'
  +'<path d="M-15 -14 Q-16 -30 0 -30 Q16 -30 15 -14 Q8 -22 0 -22 Q-8 -22 -15 -14 Z" fill="#F4D06A"/>'
  +'<ellipse cx="-5" cy="-11" rx="3.4" ry="4.2" fill="#3B2A1E"/><ellipse cx="5" cy="-11" rx="3.4" ry="4.2" fill="#3B2A1E"/>'
  +'<circle cx="-6" cy="-12.5" r="1.2" fill="#fff"/><circle cx="4" cy="-12.5" r="1.2" fill="#fff"/>'
  +'<ellipse cx="-9" cy="-6" rx="3" ry="2" fill="#F49E9A" opacity="0.6"/><ellipse cx="9" cy="-6" rx="3" ry="2" fill="#F49E9A" opacity="0.6"/>'
  +'<path d="M-3 -5 Q0 -2 3 -5" stroke="#B5766A" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
  +'<line x1="16" y1="10" x2="30" y2="-8" stroke="#E7C77A" stroke-width="2.4" stroke-linecap="round"/>'
  +'<g class="tw"><path d="M32 -14 l2.2 5 l5.4 0.6 l-4 3.6 l1.2 5.3 l-4.8 -2.8 l-4.8 2.8 l1.2 -5.3 l-4 -3.6 l5.4 -0.6 z" fill="#FFE27A" stroke="#E8B84A" stroke-width="0.8"/></g>';
  return _mob(x,y,sz,name,a,1,'mob-float');}
function aiButterfly(x,y,name,sz){sz=sz||46;var a=''
  +'<circle cx="0" cy="0" r="40" fill="#FFE3EC" opacity="0.16"/>'
  +'<g class="mob-flapL"><path d="M-4 -2 Q-40 -34 -40 -8 Q-40 6 -8 4 Z" fill="#F58BB0"/>'
  +'<path d="M-4 4 Q-34 20 -30 34 Q-24 42 -6 30 Z" fill="#F8A96B"/>'
  +'<circle cx="-24" cy="-12" r="5" fill="#fff" opacity="0.8"/><circle cx="-18" cy="26" r="3.4" fill="#fff" opacity="0.7"/></g>'
  +'<g class="mob-flapR"><path d="M4 -2 Q40 -34 40 -8 Q40 6 8 4 Z" fill="#F58BB0"/>'
  +'<path d="M4 4 Q34 20 30 34 Q24 42 6 30 Z" fill="#F8A96B"/>'
  +'<circle cx="24" cy="-12" r="5" fill="#fff" opacity="0.8"/><circle cx="18" cy="26" r="3.4" fill="#fff" opacity="0.7"/></g>'
  +'<ellipse cx="0" cy="6" rx="6.5" ry="20" fill="#7A5A9E"/>'
  +'<ellipse cx="0" cy="-10" rx="7.5" ry="8" fill="#8A6AAE"/>'
  +'<path d="M-3 -16 Q-8 -28 -12 -30 M3 -16 Q8 -28 12 -30" stroke="#7A5A9E" stroke-width="2" fill="none" stroke-linecap="round"/>'
  +'<circle cx="-12" cy="-30" r="2.4" fill="#F58BB0"/><circle cx="12" cy="-30" r="2.4" fill="#F58BB0"/>'
  +'<circle cx="-3" cy="-10" r="2.4" fill="#3B2A1E"/><circle cx="3" cy="-10" r="2.4" fill="#3B2A1E"/>'
  +'<circle cx="-3.7" cy="-11" r="0.9" fill="#fff"/><circle cx="2.3" cy="-11" r="0.9" fill="#fff"/>'
  +'<ellipse cx="-6" cy="-5" rx="2.4" ry="1.6" fill="#F49E9A" opacity="0.6"/><ellipse cx="6" cy="-5" rx="2.4" ry="1.6" fill="#F49E9A" opacity="0.6"/>';
  return _mob(x,y,sz,name,a,1,'mob-flit');}
function aiHammer(x,y,sz){sz=sz||34;var k=(sz*0.0165);
  var a='<g transform="rotate(18)"><rect x="-3" y="-6" width="6" height="34" rx="3" fill="#9A6A3C"/><rect x="-16" y="-20" width="32" height="16" rx="4" fill="#9AA3AD"/><rect x="-16" y="-20" width="32" height="6" rx="3" fill="#C3CCD4"/></g>';
  return '<g transform="translate('+x+','+y+')"><g transform="scale('+k.toFixed(3)+')">'+a+'</g></g>';}
// 별빛 편지 모티프: 따뜻한 크림 편지지 + 우체국 봉랍(seal). 빈 줄=도망친 글자, filled면 글자가 반짝 되살아난 편지.
function aiLetter(x,y,s,filled,cls){s=(s==null?1:s);cls=cls||'';
  var b='<rect x="-33" y="-36" width="60" height="76" rx="8" fill="#F0E4C8"/>'
    +'<rect x="-30" y="-38" width="60" height="76" rx="8" fill="#FFFAEE" stroke="#E6D8BF" stroke-width="2"/>'
    +'<rect x="-24" y="-32" width="48" height="64" rx="5" fill="none" stroke="#EFE2C6" stroke-width="1.4"/>';
  if(filled){b+='<g font-family="Jua, sans-serif" font-size="12" fill="#C6772E" text-anchor="middle">'
      +'<text x="-14" y="-20">별</text><text x="0" y="-20">빛</text><text x="14" y="-20">편</text>'
      +'<text x="-14" y="-2">지</text><text x="0" y="-2">가</text><text x="14" y="-2">살</text>'
      +'<text x="-7" y="16">아</text><text x="7" y="16">나</text></g>'
      +'<path d="M17,-30 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z" fill="#F5CD82"/>';}
  else{b+='<line x1="-20" y1="-22" x2="20" y2="-22" stroke="#E7DAC0" stroke-width="2.5"/>'
      +'<line x1="-20" y1="-8" x2="20" y2="-8" stroke="#E7DAC0" stroke-width="2.5"/>'
      +'<line x1="-20" y1="6" x2="20" y2="6" stroke="#E7DAC0" stroke-width="2.5"/>'
      +'<line x1="-20" y1="20" x2="6" y2="20" stroke="#E7DAC0" stroke-width="2.5"/>';}
  b+='<g transform="translate(15,29)"><circle r="9" fill="#E89A4E" stroke="#C6772E" stroke-width="1.5"/>'
    +'<path d="M0,-4.2 l1.2,2.8 l3,0.3 l-2.3,2 l0.7,3 l-2.6,-1.6 l-2.6,1.6 l0.7,-3 l-2.3,-2 l3,-0.3 z" fill="#F5CD82"/></g>';
  return '<g transform="translate('+x+','+y+') scale('+s+')">'+(cls?'<g class="'+cls+'">'+b+'</g>':b)+'</g>';}

// 별빛 우체국 실루엣(시안 인트로 장면): 어두운 보라 집 + 따뜻한 창문 불빛 + 지붕 위 별.
function aiPost(x,y,s){s=(s==null?1:s);
  return '<g transform="translate('+x+','+y+') scale('+s+')" opacity="0.92">'
    +'<ellipse cx="0" cy="34" rx="52" ry="7" fill="#000" fill-opacity="0.12"/>'
    +'<rect x="-44" y="-24" width="88" height="58" rx="6" fill="#4A3D68"/>'
    +'<path d="M-52,-22 L0,-56 L52,-22 Z" fill="#3A3054"/>'
    +'<rect x="-30" y="-10" width="18" height="16" rx="3" fill="#FFE4A6"/>'
    +'<rect x="12" y="-10" width="18" height="16" rx="3" fill="#FFE4A6"/>'
    +'<rect x="-8" y="6" width="16" height="28" rx="3" fill="#5A4A7E"/>'
    +'<path class="tw" d="M0,-70 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z" fill="#F5CD82"/>'
    +'</g>';}

// 별빛 그림책 팔레트(자모 캐릭터 톤): 자음 블루 / 모음 로즈 / 합쳐진 음절 보라 / 된소리 코랄.
var _cB='#6E9AC2',_eB='#33404a';   // 자음 블루
var _cP='#D98BA6',_eP='#33404a';   // 모음 로즈
var _cY='#E3B45C',_eY='#5a4416';   // 보조 골드(강조)
var _cG='#7FB88C',_eG='#2e5a3e';   // 보조 그린(네 차례 타일)
var _cT='#7FB5D8',_eT='#33404a';   // 보조 하늘
var _cR='#E8895A',_eR='#7a3a1a';   // 된소리 코랄
var _cM='#9A86E8',_eM='#4b3a86';   // 합쳐진 음절 보라

// 각 막 = 3쪽 이야기 장(도착 → 도우미+개념 → 전환). 오프닝 그림책과 같은 페이징(dots/prev/next)으로 넘긴다.
// 이야기: 별빛 우체국 편지에서 도망친 글자들을 각 막(장소)에서 되찾아 편지를 살리는 모험. 막마다 도우미가 등장.
const ACT_INTROS={
  1:{act:1,pages:[
    {cap:'텅 빈 편지',hl:'하얗게',say:'별빛 우체국 편지가 하얗게 텅 비었어요. 깜짝 놀란 모음 글자들이 깜깜한 숲으로 숨어 버렸대요. 우리가 사라진 글자를 찾아 편지로 되돌려 줄까요?',
      svg:aiScene('텅 빈 편지','#3C3358','#5A4468',aiPost(84,196,0.9)+aiLetter(178,120,1.25,false)+aiSpark(250,80,'s2')+aiHani(310,246,0.85))},
    {cap:'반딧불이 깜빡이',say:'숲이 너무 어두워요. 그때 반딧불이 깜빡이가 반짝반짝! "모음은 소리를 내면 빛이 나!" 입을 크게 벌리고 아— 하면 숨은 글자가 깨어난대요.',
      svg:aiScene('반딧불이 깜빡이','#3C3358','#5A4468',aiSpark(90,72)+aiSpark(160,58,'s2')+aiSpark(240,66,'s3')+aiFirefly(130,128,'반딧불이 깜빡이')+aiHani(310,246,0.85,'',true))},
    {cap:'모음을 불러요',say:'입 모양이 바뀌면 소리도 바뀌어요. 아! 어! 오! 소리를 내면 숨은 모음이 반짝 나와요. 자, 사라진 모음 친구를 소리로 불러 편지로 데려올까요?',
      svg:aiScene('모음을 불러요','#3C3358','#5A4468',aiNote(95,58)+aiNote(200,52,'n2')+aiNote(305,58,'n3')+aiBub(95,120,26,'ㅏ',_cP,_eP)+aiBub(200,120,26,'ㅓ',_cP,_eP)+aiBub(305,120,26,'ㅗ',_cP,_eP)+aiHani(200,248,0.9,'',true))},
  ]},
  2:{act:2,pages:[
    {cap:'조용한 숲',hl:'쿨쿨',say:'숲속 자음 친구들이 쿨쿨 잠들어 아무 소리도 안 나요. 편지도 조용— 글자가 하나도 안 보여요.',
      svg:aiScene('조용한 숲','#3C3358','#5A7A68',aiPost(72,198,0.8)+'<text class="notefloat" x="170" y="80" font-family="Jua, sans-serif" font-size="17" fill="#cfe6f3" text-anchor="middle">z  z  z</text>'+aiBub(170,132,30,'ㄱ',_cB,_eB)+aiHani(300,246,0.85))},
    {cap:'숲지기 도토리',say:'그때 다람쥐 도토리가 폴짝! "자음은 혼자선 조용해. 모음 친구 손을 잡아야 깨어나!" 도토리가 앞장서서 길을 알려줘요.',
      svg:aiScene('숲지기 도토리','#3C3358','#5A7A68',aiSquirrel(105,126,'다람쥐 도토리')+aiBub(232,120,24,'ㄱ',_cB,_eB)+aiOp(280,'+')+aiBub(322,120,24,'ㅏ',_cP,_eP)+aiHani(210,250,0.72))},
    {cap:'손을 잡으니 가!',say:'ㄱ이 ㅏ 손을 잡으니— 가! 소리가 톡 났어요. 우리도 자음을 깨워서 편지에서 사라진 글자를 되찾아요!',
      svg:aiScene('손을 잡으니 가!','#3C3358','#5A7A68',aiBub(72,120,26,'ㄱ',_cB,_eB,'slideR')+aiOp(121,'+')+aiBub(170,120,26,'ㅏ',_cP,_eP,'slideL')+aiOp(230,'→')+aiNote(300,64)+aiBub(302,120,32,'가',_cM,_eM,'merge')+aiHani(200,250,0.82))},
  ]},
  3:{act:3,pages:[
    {cap:'대장장이 곰',hl:'뚝딱',say:'글자 공방에 도착했어요! 대장장이 곰 뚝딱이 커다란 망치를 번쩍 들었어요. "어서 와, 여기선 자음과 모음으로 글자를 뚝딱 만든단다!"',
      svg:aiScene('대장장이 곰','#8FB8DC','#F3E6C8',aiBear(168,120,'대장장이 뚝딱')+aiHani(322,248,0.72))},
    {cap:'땅! 새 글자',say:'자음과 모음을 모루에 올리고— 땅! 땅! 뚝딱이 두드리자 새 글자가 반짝 태어났어요. 정말 신기하죠?',
      svg:aiScene('땅! 새 글자','#8FB8DC','#F3E6C8',aiBub(74,116,28,'ㄱ',_cB,_eB,'slideR')+aiOp(128,'+')+aiBub(182,116,28,'ㅏ',_cP,_eP,'slideL')+aiOp(240,'→')+aiSpark(276,82)+aiSpark(340,88,'s2')+aiSpark(310,150,'s3')+aiBub(310,116,34,'가',_cM,_eM,'merge')+aiHani(200,250,0.8))},
    {cap:'직접 만들어요',say:'ㄱ 더하기 ㅏ는 가! 이번엔 네가 망치를 들고 글자를 만들어, 편지에서 사라진 글자를 되찾아 줄래?',
      svg:aiScene('직접 만들어요','#8FB8DC','#F3E6C8',aiBub(74,116,28,'ㄱ',_cB,_eB)+aiOp(128,'+')+aiBub(182,116,28,'ㅏ',_cP,_eP)+aiOp(240,'→')+aiBub(310,116,34,'가',_cM,_eM,'merge')+aiHani(200,250,0.82))},
  ]},
  4:{act:4,pages:[
    {cap:'무거운 문',hl:'받침',say:'쿵! 길을 커다란 받침의 문이 막았어요. 문 앞엔 두꺼비 문지기 끄떡이 꿈쩍도 안 하고 앉아 있어요.',
      svg:aiScene('무거운 문','#3C3358','#5A4468','<g transform="translate(128,146)"><rect x="-42" y="-64" width="84" height="128" rx="8" fill="#4a3d68"/><rect x="-32" y="-50" width="64" height="114" rx="6" fill="#2c2544"/><rect x="-3" y="-50" width="6" height="114" fill="#5a4d7a"/></g>'+aiToad(118,120,'두꺼비 끄떡')+aiHani(320,248,0.75))},
    {cap:'받침돌을 얹어요',say:'"글자 아래 받침돌을 살포시 얹어야 문이 열려." 끄떡이 알려줬어요. 가 아래 이응을 얹으니— 강! 끝소리가 생겼어요.',
      svg:aiScene('받침돌을 얹어요','#3C3358','#5A4468',aiBub(70,116,28,'가',_cM,_eM)+aiOp(122,'+')+aiBub(172,104,24,'ㅇ',_cB,_eB,'drop')+'<text x="172" y="150" font-family="Jua, sans-serif" font-size="13" fill="#ffe9c2" text-anchor="middle">받침돌</text>'+aiOp(232,'→')+aiBub(305,116,33,'강',_cM,_eM,'merge')+aiHani(200,250,0.8))},
    {cap:'문이 열렸다',say:'끄떡이 끄덕— 무거운 문이 스르륵 열렸어요! 자, 받침 끝소리 글자를 되찾아 편지를 채워요.',
      svg:aiScene('문이 열렸다','#3C3358','#5A4468',aiSpark(140,80)+aiSpark(250,78,'s2')+aiBub(190,120,36,'강',_cM,_eM,'merge')+aiToad(320,120,'끄떡')+aiHani(90,250,0.72))},
  ]},
  5:{act:5,pages:[
    {cap:'메아리 동굴',hl:'메아리',say:'소리 동굴에 들어서자 힘센 메아리가 쩌렁쩌렁 울려요. 천장엔 쌍둥이 박쥐 둘이 나란히 대롱대롱 매달려 있어요.',
      svg:aiScene('메아리 동굴','#3C3358','#6A4A6A',aiBats(196,122,'쌍둥이 박쥐',48)+aiHani(320,248,0.75))},
    {cap:'힘을 꾹!',say:'"우린 똑 닮은 쌍둥이! 힘을 꾹 주면 더 센 소리가 나." 가— 보다 힘센— 까! 박쥐가 신나서 깔깔 웃어요.',
      svg:aiScene('힘을 꾹!','#3C3358','#6A4A6A',aiBub(70,116,25,'ㄱ',_cB,_eB)+aiOp(118,'+')+aiBub(166,116,25,'ㄱ',_cB,_eB)+aiOp(226,'→')+aiSpark(268,84,'s2')+aiSpark(340,150,'s3')+aiBub(302,116,33,'ㄲ',_cR,_eR,'merge')+'<text class="spark" x="302" y="176" font-family="Jua, sans-serif" font-size="20" fill="#ffe27a" text-anchor="middle">까!</text>'+aiHani(200,250,0.8,'determined'))},
    {cap:'센 소리 되찾기',say:'쌍둥이 자음은 힘을 꾹! 까! 우리도 센 소리 글자를 불러 편지에서 사라진 글자를 되찾을까요?',
      svg:aiScene('센 소리 되찾기','#3C3358','#6A4A6A',aiBub(110,116,30,'가',_cM,_eM)+aiOp(178,'→')+aiSpark(228,84)+aiSpark(300,150,'s3')+aiBub(278,116,34,'까',_cR,_eR,'merge')+aiHani(200,250,0.82,'determined'))},
  ]},
  6:{act:6,pages:[
    {cap:'별빛 뒤',hl:'별빛 뒤',say:'반짝이는 별빛 뒤에 모음들이 숨어서 살짝살짝 반짝여요. 작은 별빛 요정이 손을 흔들며 나타났어요.',
      svg:aiScene('별빛 뒤','#3C3358','#5A4468',aiPost(66,198,0.75)+aiSpark(120,70)+aiSpark(232,74,'s2')+aiSpark(186,52,'s3')+aiFairy(170,130,'별빛 요정')+aiHani(315,248,0.8))},
    {cap:'겹치면 나와요',say:'"모음 둘이 겹친 자리를 비춰 줄게!" 요정이 지팡이를 반짝. 아 더하기 이는— 애! 숨어 있던 모음이 나왔어요.',
      svg:aiScene('겹치면 나와요','#3C3358','#5A4468',aiBub(74,116,28,'ㅏ',_cP,_eP,'slideR')+aiOp(128,'+')+aiBub(182,116,28,'ㅣ',_cP,_eP,'slideL')+aiOp(240,'→')+aiSpark(276,84)+aiSpark(338,146,'s3')+aiBub(310,116,34,'ㅐ',_cM,_eM,'merge')+aiHani(200,250,0.82))},
    {cap:'숨은 모음 찾기',say:'겹치고 숨은 모음이 아직 많아요. 요정과 함께 숨은 모음을 찾아 편지로 되돌려 줄까요?',
      svg:aiScene('숨은 모음 찾기','#3C3358','#5A4468',aiFairy(88,122,'별빛 요정')+aiBub(208,116,28,'ㅏ',_cP,_eP)+aiOp(258,'+')+aiBub(300,116,28,'ㅣ',_cP,_eP)+aiHani(200,250,0.82))},
  ]},
  7:{act:7,pages:[
    {cap:'시든 마을',hl:'시들시들',say:'글자가 사라지자 마을 꽃들이 시들시들 고개를 숙였어요. 정원지기 나비 팔랑이가 울먹여요. "되찾은 글자를 모아 주면 꽃이 다시 필 텐데…"',
      svg:aiScene('시든 마을','#9CD0E4','#EFEBD2',aiPost(56,200,0.7)+'<g transform="translate(120,172)"><path d="M0,20 Q-4,2 -14,-2" fill="none" stroke="#7f9e5a" stroke-width="3"/><circle cx="-16" cy="-4" r="8" fill="#c9a0b0"/><circle cx="-16" cy="-4" r="3" fill="#e6c86a"/></g><g transform="translate(170,182)"><path d="M0,18 Q4,2 12,-1" fill="none" stroke="#7f9e5a" stroke-width="3"/><circle cx="14" cy="-3" r="7" fill="#b6a8d0"/></g>'+aiButterfly(305,118,'나비 팔랑이')+aiHani(80,250,0.75))},
    {cap:'글자가 모여 단어',say:'오 그리고 이— 오이! 글자가 도르르 모이니 단어가 됐어요. 팔랑이 곁에서 시들었던 꽃이 활짝 피어나요!',
      svg:aiScene('글자가 모여 단어','#9CD0E4','#EFEBD2',aiBub(70,116,28,'오',_cB,_eB,'slideR')+aiOp(122,'+')+aiBub(170,116,28,'이',_cP,_eP,'slideL')+aiOp(232,'→')+'<g transform="translate(305,112)"><g class="merge"><rect x="-42" y="-26" width="84" height="52" rx="16" fill="'+_cM+'"/><text y="9" font-family="Jua, sans-serif" font-size="27" fill="#fff" text-anchor="middle">오이</text></g></g>'+aiSpark(305,166,'s2')+aiHani(200,250,0.82))},
    {cap:'단어를 지어요',say:'이제 네가 글자를 모아 단어를 지어, 편지에서 사라진 말을 되찾고 시든 마을을 살려 줄래?',
      svg:aiScene('단어를 지어요','#9CD0E4','#EFEBD2',aiBub(90,116,28,'오',_cB,_eB)+aiOp(140,'+')+aiBub(190,116,28,'이',_cP,_eP)+aiOp(240,'→')+'<g transform="translate(310,112)"><g class="merge"><rect x="-40" y="-24" width="80" height="48" rx="14" fill="'+_cG+'"/><text y="8" font-family="Jua, sans-serif" font-size="24" fill="#fff" text-anchor="middle">?</text></g></g>'+aiHani(200,250,0.82))},
  ]},
  8:{act:8,pages:[
    {cap:'우체국으로',hl:'별빛 우체국',say:'모은 글자를 두 손 가득 안고 별빛 우체국으로 돌아왔어요. 하얀 편지가 두근두근 우리를 기다려요.',
      svg:aiScene('우체국으로','#3C3358','#7A5A6E',aiPost(248,180,1.05)+aiLetter(120,124,1.1,false)+aiHani(345,252,0.8))},
    {cap:'편지가 살아나요',say:'글자들이 편지 위로 사르르 내려앉아— 반짝! 사라졌던 글이 다시 떠올랐어요. 별빛 우체국 편지가 되살아났어요!',
      svg:aiScene('편지가 살아나요','#3C3358','#7A5A6E',aiLetter(200,118,1.3,true,'glowpulse')+aiSpark(110,80)+aiSpark(300,78,'s2')+aiSpark(150,164,'s3')+aiHani(320,248,0.78))},
    {cap:'스스로 읽어요',say:'이제 네가 스스로 이 편지를 읽어 줄래? 그러면 하니가 반짝이는 편지를 온 마을에 배달할 거야. 준비됐니?',
      svg:aiScene('스스로 읽어요','#3C3358','#7A5A6E',aiLetter(140,118,1.15,true)+'<g transform="translate(272,118) rotate(-8)"><rect x="-17" y="-12" width="34" height="24" rx="3" fill="#FFFDF6" stroke="#E0C8A0" stroke-width="2"/><path d="M-17,-11 L0,3 L17,-11" fill="none" stroke="#E0C8A0" stroke-width="2"/></g>'+aiSpark(300,80)+aiHani(300,248,0.82,'',true))},
  ]},
};
