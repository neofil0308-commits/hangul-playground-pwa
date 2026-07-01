// Static learning, story, and UI data for 하니의 한글 모험.
// Keep behavior in index.html; this file should stay side-effect free.

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
  {ch:'ㅘ',sound:'와',word:'사과',emoji:'🍎',med:9},{ch:'ㅙ',sound:'왜',word:'왜',emoji:'❓',med:10},
  {ch:'ㅚ',sound:'외',word:'참외',emoji:'🍈',med:11},{ch:'ㅝ',sound:'워',word:'원숭이',emoji:'🐵',med:14},
  {ch:'ㅞ',sound:'웨',word:'웨',emoji:'🔊',med:15},{ch:'ㅟ',sound:'위',word:'귀',emoji:'👂',med:16},
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
  '탈것·생활':[['자동차','🚗'],['기차','🚆'],['비행기','✈️'],['배','🚢'],['자전거','🚲'],['우산','☂️'],['모자','🧢'],['신발','👟'],['책','📖'],['시계','⏰'],['로켓','🚀'],['가방','🎒'],['컵','☕'],['풍선','🎈'],['운동화','👟'],['카메라','📷'],['북','🥁'],['종','🔔'],['피아노','🎹'],['안경','👓']],
};
const SUBJ=[['고양이가','🐱'],['강아지가','🐶'],['아기가','👶'],['토끼가','🐰'],['곰이','🐻'],['오리가','🦆']];
const OBJ=[['우유를','🥛'],['사과를','🍎'],['공을','⚽'],['책을','📖'],['밥을','🍚'],['물을','💧']];
const VERB=[['먹어요','🍴'],['좋아해요','💕'],['봐요','👀'],['마셔요','🥤'],['던져요','🤾'],['찾아요','🔍']];
const BATCHIM_SYLL=['강','산','곰','문','손','발','눈','별','빵','컵'];
const TRACE_WORDS=['나비','사과','토끼','포도','우유','모자','우산','신발','사탕','강아지','바나나','코끼리'];
const STICKERS=['⭐','🌈','🦋','🐥','🌸','🍭','🎈','🦄','🐻','🚀','🍓','👑','🐬','🌟','🎁','🦉'];
const MENU=[
  {id:'listen',ic:'🔊',label:'듣고 찾기',cls:'m-listen'},{id:'sticker',ic:'🏅',label:'내 스티커',cls:'m-sticker'},{id:'set',ic:'⚙️',label:'설정',cls:'m-set'},
];
// 한글 마을 지도: 오늘의 모험 장소만 노출. 글자 숲/단어 동산은 자유찾기 화면 대신 오늘의 모험으로 바로 진입(action).
const MAP_PLACES=[
  {id:'letters',target:'letters',ic:'🌳',place:'글자 숲',hint:'오늘의 글자 친구를 만나요',quest:'letter',action:'letter'},
  {id:'word',target:'word',ic:'🌼',place:'단어 동산',hint:'오늘의 단어 꽃을 찾아요',quest:'word',action:'word'},
  {id:'listen',target:'listen',ic:'🔊',place:'소리 동굴',hint:'하니 목소리를 따라 찾아요',quest:'play'},
  {id:'sticker',target:'sticker',ic:'🏅',place:'스티커 집',hint:'모험 보상을 모아봐요'},
];
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
function composedStrokes(ch){
  if(typeof ch!=='string'||ch.length!==1)return null;
  var code=ch.codePointAt(0);
  if(code<0xAC00||code>0xD7A3)return null;
  var s=code-0xAC00;
  var cho=CHO[Math.floor(s/588)], jung=JUNG[Math.floor((s%588)/28)], jong=JONG[s%28];
  // 구성 자모 중 하나라도 STROKES가 없으면 부분(자음만) 오버레이 대신 null 반환.
  if(!STROKES[cho]||!STROKES[jung]||(jong&&!STROKES[jong]))return null;
  // 가로형(ㅗ/ㅜ/ㅡ 계열) + 아래에 깔리는 복합모음(ㅘㅙㅝㅞ)은 위/아래 칸 분할. ㅚㅟㅢ 등 혼합형은 좌/우 유지(허용).
  var horiz='ㅗㅛㅜㅠㅡㅘㅙㅝㅞ'.indexOf(jung)>=0;
  var boxes=horiz
    ? (jong?{cho:[18,3,82,40],jung:[8,40,92,67],jong:[15,67,90,97]}
           :{cho:[15,6,85,52],jung:[6,54,94,92]})
    : (jong?{cho:[5,5,52,60],jung:[54,3,95,62],jong:[10,63,90,97]}
           :{cho:[6,8,55,92],jung:[56,5,95,95]});
  var out=[];
  function add(jamo,box){var arr=STROKES[jamo];if(!arr)return;arr.forEach(function(st){out.push(_xfStroke(st,box));});}
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
 'ㄷ':[['다람쥐','🐿️'],['도넛','🍩'],['닭','🐔'],['달','🌙'],['돼지','🐷'],['딸기','🍓']],
 'ㄹ':[['로봇','🤖'],['라면','🍜'],['레몬','🍋'],['로켓','🚀'],['라디오','📻']],
 'ㅁ':[['모자','🧢'],['말','🐴'],['멜론','🍈'],['문','🚪'],['물','💧'],['무지개','🌈']],
 'ㅂ':[['바나나','🍌'],['비행기','✈️'],['별','⭐'],['배','🚢'],['빵','🍞'],['북','🥁']],
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
 'ㅉ':[['짜장면','🍜'],['찌개','🍲'],['짹짹','🐤']],
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

const PRESET_SENTS=['고양이가 우유를 마셔요','아기가 사과를 먹어요','강아지가 공을 던져요','토끼가 책을 봐요','곰이 밥을 먹어요','오리가 물을 마셔요'];
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
   syllables:['가','나','다','마','고','모'],
   sylWords:{'가':['가방','🎒'],'나':['나비','🦋'],'다':['다리','🌉'],'마':['마차','🐴'],'고':['고래','🐳'],'모':['모자','🧢']},
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
  {after:['ㅂ','ㅏ'],word:'아빠',say:'아빠',note:'"아빠"도 읽을 수 있어요! 👨'},
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
  {art:['🏤','✉️','⭐'],cap:'한글 마을 별빛 우체국',say:'한글 마을에는 별빛 우체국이 있어요. 모두에게 반짝이는 편지를 보내주는 곳이에요.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="별빛 우체국"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3470"/><stop offset="0.55" stop-color="#7a68a8"/><stop offset="1" stop-color="#d79bae"/></linearGradient><radialGradient id="moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff7e0"/><stop offset="1" stop-color="#ffe4a6"/></radialGradient><linearGradient id="pbox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec5446"/><stop offset="1" stop-color="#c8392c"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="332" cy="50" r="28" fill="url(#moon)"/><g fill="#fff"><circle class="tw" cx="58" cy="46" r="2.3"/><circle class="tw t2" cx="116" cy="26" r="1.7"/><circle class="tw t3" cx="250" cy="34" r="2.1"/><circle class="tw t2" cx="38" cy="118" r="1.7"/><circle class="tw" cx="372" cy="116" r="2"/></g><path d="M0,228 Q120,202 230,222 Q330,242 400,218 L400,280 L0,280 Z" fill="#5a9a78"/><path d="M0,250 Q160,228 400,248 L400,280 L0,280 Z" fill="#48865f"/><g transform="translate(126,110)"><rect x="-58" y="44" width="116" height="84" rx="6" fill="#fbf3e4" stroke="#d9b384" stroke-width="2"/><rect x="-62" y="36" width="124" height="11" rx="4" fill="#e7d6bd"/><rect x="-56" y="50" width="112" height="24" rx="5" fill="#e4392c"/><circle cx="-45" cy="62" r="7" fill="#fff"/><path d="M-50,63 Q-47,58 -45,61 Q-43,58 -40,63 Q-43,60 -45,65 Q-47,60 -50,63 z" fill="#e4392c"/><text x="8" y="67" font-family="Jua, sans-serif" font-size="13" fill="#fff" text-anchor="middle">별빛우체국</text><rect x="-48" y="84" width="24" height="18" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><rect x="24" y="84" width="24" height="18" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><rect x="-17" y="98" width="34" height="30" rx="3" fill="#bfe0ec" stroke="#d9b384" stroke-width="2"/><line x1="0" y1="98" x2="0" y2="128" stroke="#d9b384" stroke-width="1.5"/></g><g transform="translate(212,202)"><ellipse cx="0" cy="34" rx="15" ry="4.5" fill="#000" fill-opacity="0.14"/><rect x="-13" y="-14" width="26" height="48" rx="7" fill="url(#pbox)"/><path d="M-13,-8 Q-13,-23 0,-23 Q13,-23 13,-8 Z" fill="#d23b2d"/><rect x="-8" y="-3" width="16" height="4" rx="2" fill="#4a1813"/><circle cx="0" cy="13" r="6.5" fill="#fff"/><path d="M-4,14 Q-2,10 0,12.5 Q2,10 4,14 Q2,12 0,16 Q-2,12 -4,14 z" fill="#e4392c"/><rect x="-8" y="34" width="5" height="6" rx="2" fill="#a83228"/><rect x="3" y="34" width="5" height="6" rx="2" fill="#a83228"/></g><path d="M218,186 Q276,122 334,106" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round" opacity="0.45"/><g class="send"><g transform="translate(214,182) rotate(-16)"><rect x="-14" y="-9" width="28" height="18" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-14,-8 L0,3 L14,-8" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g><g class="send sd2"><g transform="translate(216,184) rotate(-21)"><rect x="-13" y="-8" width="26" height="16" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-13,-7 L0,3 L13,-7" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g><g class="send sd3"><g transform="translate(212,180) rotate(-11)"><rect x="-14" y="-9" width="28" height="18" rx="3" fill="#fffdf6" stroke="#e0c8a0" stroke-width="2"/><path d="M-14,-8 L0,3 L14,-8" fill="none" stroke="#e0c8a0" stroke-width="2"/></g></g><g transform="translate(342,234)"><g class="hani"><ellipse cx="0" cy="24" rx="18" ry="5" fill="#000" fill-opacity="0.13"/><ellipse cx="0" cy="6" rx="17" ry="18" fill="#ffd54a"/><ellipse cx="12" cy="8" rx="6.5" ry="10" fill="#ffc62e"/><circle cx="0" cy="-11" r="13" fill="#ffd54a"/><ellipse cx="-7" cy="-6" rx="3.2" ry="2.3" fill="#ff9eb0" opacity="0.75"/><path d="M-2,-12 L-14,-9 L-2,-6 Z" fill="#ff9a3c"/><circle cx="-4" cy="-13" r="2.1" fill="#3a2a1a"/><path d="M-2,-24 q3,-6 6,-1" fill="none" stroke="#ffb02e" stroke-width="2.4" stroke-linecap="round"/><path d="M-6,25 l-4,6 M5,25 l4,6" stroke="#ff9a3c" stroke-width="3" stroke-linecap="round"/></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['📨','⬜','❓'],cap:'편지가 하얗게 변했어요',say:'그런데 어느 날, 편지 속 글자들이 모두 사라졌어요. 편지가 하얗게 텅 비어 버렸죠.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="편지가 하얗게 변했어요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#443a6e"/><stop offset="0.6" stop-color="#6f6196"/><stop offset="1" stop-color="#caa9bb"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g fill="#fff"><circle class="tw" cx="60" cy="40" r="2"/><circle class="tw t2" cx="320" cy="34" r="1.8"/><circle class="tw t3" cx="205" cy="26" r="2"/></g><path d="M0,238 Q200,216 400,236 L400,280 L0,280 Z" fill="#7a6f9a"/><g opacity="0.45"><g transform="translate(64,92) rotate(-12)"><rect x="-15" y="-10" width="30" height="20" rx="3" fill="#fdfbf5" stroke="#d9c8a8" stroke-width="1.6"/><path d="M-15,-9 L0,2 L15,-9" fill="none" stroke="#d9c8a8" stroke-width="1.6"/></g></g><g opacity="0.4"><g transform="translate(118,66) rotate(8)"><rect x="-13" y="-9" width="26" height="18" rx="3" fill="#fdfbf5" stroke="#d9c8a8" stroke-width="1.6"/><path d="M-13,-8 L0,2 L13,-8" fill="none" stroke="#d9c8a8" stroke-width="1.6"/></g></g><g transform="translate(146,160) rotate(-5)"><ellipse cx="0" cy="64" rx="54" ry="9" fill="#000" fill-opacity="0.12"/><rect x="-50" y="-60" width="100" height="120" rx="6" fill="#fffdf8" stroke="#e6d8bf" stroke-width="2"/><line x1="-36" y1="-30" x2="36" y2="-30" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="-8" x2="36" y2="-8" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="14" x2="36" y2="14" stroke="#ece2cf" stroke-width="2"/><line x1="-36" y1="36" x2="24" y2="36" stroke="#ece2cf" stroke-width="2"/><g font-family="Jua, sans-serif" font-size="13" fill="#9a8a68"><text class="fade" style="animation-delay:0s" x="-35" y="-32">안</text><text class="fade" style="animation-delay:.1s" x="-21" y="-32">녕</text><text class="fade" style="animation-delay:.2s" x="-6" y="-32">하</text><text class="fade" style="animation-delay:.3s" x="8" y="-32">니</text><text class="fade" style="animation-delay:.45s" x="-35" y="-10">사</text><text class="fade" style="animation-delay:.55s" x="-21" y="-10">랑</text><text class="fade" style="animation-delay:.65s" x="-6" y="-10">해</text><text class="fade" style="animation-delay:.8s" x="-35" y="12">또</text><text class="fade" style="animation-delay:.9s" x="-21" y="12">보</text><text class="fade" style="animation-delay:1s" x="-6" y="12">자</text></g></g><g transform="translate(344,190)"><g class="pop"><g stroke="#ffe27a" stroke-width="2.4" stroke-linecap="round"><line x1="-9" y1="-16" x2="-12" y2="-22"/><line x1="0" y1="-18" x2="0" y2="-25"/><line x1="9" y1="-16" x2="12" y2="-22"/></g><text x="0" y="8" font-family="Jua, sans-serif" font-size="28" fill="#ffd54a" text-anchor="middle">!</text></g></g><g transform="translate(344,240)"><g class="hani"><ellipse cx="0" cy="22" rx="16" ry="4.5" fill="#000" fill-opacity="0.13"/><ellipse cx="0" cy="6" rx="15" ry="16" fill="#ffd54a"/><ellipse cx="11" cy="8" rx="6" ry="9" fill="#ffc62e"/><circle cx="0" cy="-10" r="12" fill="#ffd54a"/><ellipse cx="-6" cy="-4" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.7"/><path d="M-2,-11 L-13,-8 L-2,-5 Z" fill="#ff9a3c"/><circle cx="-4" cy="-12" r="2" fill="#3a2a1a"/><path d="M-9,-16 q3,-2 5,0.5" fill="none" stroke="#d49a52" stroke-width="1.4" stroke-linecap="round"/><path d="M-2,-22 q3,-5 5,-1" fill="none" stroke="#ffb02e" stroke-width="2.2" stroke-linecap="round"/><path d="M-6,23 l-3,5 M5,23 l3,5" stroke="#ff9a3c" stroke-width="2.8" stroke-linecap="round"/></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🌳','🌼','🔤'],cap:'글자 친구들이 숨었어요',say:'깜짝 놀란 글자 친구들이 마을 곳곳에 숨어 버렸어요. 숲에도, 동산에도, 동굴에도요.',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="글자 친구들이 숨었어요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3470"/><stop offset="0.55" stop-color="#7a68a8"/><stop offset="1" stop-color="#d79bae"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g fill="#fff"><circle class="tw" cx="64" cy="40" r="2"/><circle class="tw t2" cx="300" cy="32" r="1.8"/><circle class="tw t3" cx="200" cy="52" r="2"/></g><path d="M0,200 Q200,176 400,202 L400,280 L0,280 Z" fill="#5a9a78"/><path d="M0,236 Q200,216 400,238 L400,280 L0,280 Z" fill="#48865f"/><g transform="translate(58,190)"><g class="peekR"><circle cx="0" cy="0" r="14" fill="#7ec4e8"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="15" fill="#fff" text-anchor="middle">ㄱ</text><circle cx="-5" cy="-4" r="1.7" fill="#27414e"/><circle cx="5" cy="-4" r="1.7" fill="#27414e"/></g></g><g transform="translate(50,150)"><rect x="-7" y="20" width="14" height="60" rx="3" fill="#94653f"/><ellipse cx="0" cy="0" rx="33" ry="31" fill="#4f9268"/><ellipse cx="-16" cy="11" rx="18" ry="16" fill="#56a070"/><ellipse cx="16" cy="9" rx="16" ry="14" fill="#59a074"/></g><g transform="translate(198,208)"><g class="peekUp"><circle cx="0" cy="0" r="14" fill="#f3899f"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="15" fill="#fff" text-anchor="middle">ㅏ</text><circle cx="-5" cy="-4" r="1.7" fill="#5a2436"/><circle cx="5" cy="-4" r="1.7" fill="#5a2436"/></g></g><g transform="translate(198,228)"><ellipse cx="0" cy="2" rx="44" ry="18" fill="#4f9268"/><ellipse cx="0" cy="7" rx="44" ry="13" fill="#47855c"/><g stroke="#3f8a5d" stroke-width="2.4"><line x1="-26" y1="-2" x2="-26" y2="-16"/><line x1="-2" y1="-4" x2="-2" y2="-22"/><line x1="24" y1="-2" x2="24" y2="-15"/></g><circle cx="-26" cy="-18" r="5" fill="#ffd54a"/><circle cx="-2" cy="-24" r="6" fill="#f3899f"/><circle cx="-2" cy="-24" r="2.2" fill="#fff"/><circle cx="24" cy="-17" r="5" fill="#9b8cff"/></g><g transform="translate(340,200)"><ellipse cx="0" cy="2" rx="37" ry="31" fill="#736487"/><ellipse cx="-1" cy="-1" rx="30" ry="25" fill="#675879"/><ellipse cx="-1" cy="15" rx="18" ry="21" fill="#2c2640"/></g><g transform="translate(340,214)"><g class="peekL"><circle cx="0" cy="0" r="13" fill="#f4b13c"/><text x="0" y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅁ</text><circle cx="-5" cy="-4" r="1.6" fill="#6a4810"/><circle cx="5" cy="-4" r="1.6" fill="#6a4810"/></g></g><g transform="translate(200,248)"><g class="search"><g class="hani"><ellipse cx="0" cy="22" rx="17" ry="4.5" fill="#000" fill-opacity="0.13"/><ellipse cx="0" cy="7" rx="16" ry="17" fill="#ffd54a"/><ellipse cx="-15" cy="9" rx="5" ry="9" fill="#ffc62e"/><ellipse cx="15" cy="9" rx="5" ry="9" fill="#ffc62e"/><circle cx="0" cy="-10" r="13" fill="#ffd54a"/><circle cx="-5" cy="-11" r="2" fill="#3a2a1a"/><circle cx="5" cy="-11" r="2" fill="#3a2a1a"/><path d="M-3,-7 L3,-7 L0,-3 z" fill="#ff9a3c"/><ellipse cx="-9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.8"/><ellipse cx="9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.8"/><path d="M-3,-23 q3,-5 5,-1 M3,-23 q3,-4 4,0" fill="none" stroke="#ffb02e" stroke-width="2.2" stroke-linecap="round"/><path d="M-6,24 l-3,5 M6,24 l3,5" stroke="#ff9a3c" stroke-width="2.8" stroke-linecap="round"/></g></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🐥','💛'],cap:'하니가 함께 가요',say:'걱정 마! 내가 하니야. 너랑 같이 숨은 글자 친구들을 찾으러 갈 거야. 준비됐니?',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="하니가 함께 가요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6bb0"/><stop offset="0.55" stop-color="#f0a98c"/><stop offset="1" stop-color="#ffd79a"/></linearGradient><radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.9"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></radialGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="200" cy="150" r="150" fill="url(#sun)"/><path d="M0,236 Q200,214 400,236 L400,280 L0,280 Z" fill="#6cab84"/><g fill="#ffe27a"><path class="tw" d="M86,90 l2.5,6 l6,2.5 l-6,2.5 l-2.5,6 l-2.5,-6 l-6,-2.5 l6,-2.5 z"/><path class="tw t2" d="M312,80 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z"/><path class="tw t3" d="M330,170 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z"/></g><g transform="translate(200,158) scale(1.75)"><g class="hani determined"><ellipse cx="0" cy="24" rx="20" ry="5" fill="#000" fill-opacity="0.13"/><ellipse cx="0" cy="7" rx="19" ry="20" fill="#ffd54a"/><ellipse cx="-21" cy="-6" rx="6" ry="9" fill="#ffc62e" transform="rotate(-34 -21 -6)"/><ellipse cx="21" cy="-6" rx="6" ry="9" fill="#ffc62e" transform="rotate(34 21 -6)"/><circle cx="0" cy="-12" r="15" fill="#ffd54a"/><circle cx="-6" cy="-12" r="2.3" fill="#3a2a1a"/><circle cx="6" cy="-12" r="2.3" fill="#3a2a1a"/><path d="M-11,-18 L-3,-15 M11,-18 L3,-15" stroke="#d4a258" stroke-width="2" stroke-linecap="round"/><path d="M-3,-7 L3,-7 L0,-3 z" fill="#ff9a3c"/><ellipse cx="-10" cy="-7" rx="3.4" ry="2.5" fill="#ff9eb0" opacity="0.85"/><ellipse cx="10" cy="-7" rx="3.4" ry="2.5" fill="#ff9eb0" opacity="0.85"/><path d="M-3,-27 q3,-6 6,-1 M3,-27 q3,-5 5,0" fill="none" stroke="#ffb02e" stroke-width="2.4" stroke-linecap="round"/><path d="M-7,27 l-4,6 M7,27 l4,6" stroke="#ff9a3c" stroke-width="3" stroke-linecap="round"/></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['✨','⭐','💌'],cap:'글자를 모아 편지를 살려요',say:'숨은 글자 친구들을 하나씩 모으면, 하얀 편지에 다시 반짝반짝 글자가 살아난대!',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="빛 조각을 모아요"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2752"/><stop offset="0.6" stop-color="#473c78"/><stop offset="1" stop-color="#6a5a9a"/></linearGradient><radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0.85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><circle cx="200" cy="120" r="150" fill="url(#glow)"/><g fill="#fff"><circle class="tw" cx="64" cy="44" r="1.8"/><circle class="tw t2" cx="330" cy="40" r="1.8"/><circle class="tw t3" cx="120" cy="150" r="1.6"/><circle class="tw" cx="300" cy="150" r="1.6"/></g><path d="M0,240 Q200,222 400,240 L400,280 L0,280 Z" fill="#534781"/><g transform="translate(200,122)"><circle cx="0" cy="2" r="46" fill="url(#glow)"/><g class="glowpulse"><rect x="-30" y="-38" width="60" height="76" rx="6" fill="#fffef8" stroke="#ffe6a0" stroke-width="2"/><line x1="-20" y1="-22" x2="20" y2="-22" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="-11" x2="20" y2="-11" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="0" x2="20" y2="0" stroke="#ffdf9c" stroke-width="2.5"/><line x1="-20" y1="11" x2="12" y2="11" stroke="#ffdf9c" stroke-width="2.5"/></g></g><g transform="translate(96,68)"><g class="gather" style="--dx:104px;--dy:54px"><circle r="12" fill="#7ec4e8"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㄱ</text><circle cx="-4" cy="-3" r="1.5" fill="#27414e"/><circle cx="4" cy="-3" r="1.5" fill="#27414e"/></g></g><g transform="translate(308,74)"><g class="gather gg2" style="--dx:-108px;--dy:48px"><circle r="12" fill="#f3899f"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅏ</text><circle cx="-4" cy="-3" r="1.5" fill="#5a2436"/><circle cx="4" cy="-3" r="1.5" fill="#5a2436"/></g></g><g transform="translate(104,192)"><g class="gather gg3" style="--dx:96px;--dy:-70px"><circle r="12" fill="#f4b13c"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅁ</text><circle cx="-4" cy="-3" r="1.5" fill="#6a4810"/><circle cx="4" cy="-3" r="1.5" fill="#6a4810"/></g></g><g transform="translate(298,190)"><g class="gather gg4" style="--dx:-98px;--dy:-68px"><circle r="12" fill="#5fae7a"/><text y="5" font-family="Jua, sans-serif" font-size="14" fill="#fff" text-anchor="middle">ㅇ</text><circle cx="-4" cy="-3" r="1.5" fill="#2e5a3e"/><circle cx="4" cy="-3" r="1.5" fill="#2e5a3e"/></g></g><g transform="translate(200,236)"><g class="hani"><ellipse cx="0" cy="22" rx="17" ry="4.5" fill="#000" fill-opacity="0.18"/><ellipse cx="0" cy="6" rx="16" ry="17" fill="#ffd54a"/><ellipse cx="-17" cy="-2" rx="5" ry="10" fill="#ffc62e" transform="rotate(-34 -17 -2)"/><ellipse cx="17" cy="-2" rx="5" ry="10" fill="#ffc62e" transform="rotate(34 17 -2)"/><circle cx="0" cy="-10" r="13" fill="#ffd54a"/><circle cx="-5" cy="-12" r="2" fill="#3a2a1a"/><circle cx="5" cy="-12" r="2" fill="#3a2a1a"/><path d="M-3,-7 L3,-7 L0,-2 z" fill="#ff9a3c"/><ellipse cx="-9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.85"/><ellipse cx="9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.85"/><path d="M-6,23 l-3,5 M6,23 l3,5" stroke="#ff9a3c" stroke-width="2.8" stroke-linecap="round"/></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
  {art:['🗺️','🐥','➡️'],cap:'지도를 펼쳐 모험 출발!',say:'자, 한글 마을 지도를 펼쳐서 모험을 떠나자! 어디부터 가 볼까?',svg:'<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="지도를 펼쳐 모험 출발"><defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc2dd"/><stop offset="1" stop-color="#dceede"/></linearGradient><filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"/></filter></defs><g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#sky)"/><g transform="translate(200,144) rotate(-2)"><rect x="-156" y="-100" width="312" height="200" rx="14" fill="#f1e1bd" stroke="#cdb284" stroke-width="3"/><rect x="-148" y="-92" width="296" height="184" rx="10" fill="none" stroke="#e0ca9a" stroke-width="1.5" stroke-dasharray="3 6"/><path class="pathflow" d="M-120,72 Q-80,32 -40,52 Q12,78 32,20 Q46,-22 102,-46" fill="none" stroke="#c79a5a" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/><g transform="translate(-100,50)"><rect x="-2" y="0" width="4" height="9" fill="#9a6a44"/><path d="M0,-20 l-11,20 l22,0 z" fill="#5a9a6e"/></g><g transform="translate(-20,44)"><rect x="-1.5" y="0" width="3" height="9" fill="#5a9a6e"/><circle cx="0" cy="-3" r="7" fill="#f3899f"/><circle cx="0" cy="-3" r="2.6" fill="#ffe27a"/></g><path d="M28,28 a13,13 0 0 1 26,0 z" fill="#6a5a86"/><circle cx="41" cy="24" r="3.5" fill="#2e2750"/><path class="tw" d="M102,-58 l3.2,7.4 l8,1 l-6,5.8 l2,8 l-7.2,-4.2 l-7.2,4.2 l2,-8 l-6,-5.8 l8,-1 z" fill="#ffb02e" stroke="#e8902a" stroke-width="1"/><g transform="translate(116,-74)"><circle r="12" fill="#fff7e6" stroke="#cdb284" stroke-width="2"/><path d="M0,-9 L3,0 L0,9 L-3,0 z" fill="#e4392c"/><path d="M-9,0 L0,-3 L9,0 L0,3 z" fill="#6a5a86"/></g></g><g class="dust"><ellipse cx="62" cy="237" rx="5" ry="3" fill="#fffdf4" opacity="0.5"/></g><g class="dust du2"><ellipse cx="70" cy="239" rx="4" ry="2.4" fill="#fffdf4" opacity="0.45"/></g><g transform="translate(86,214)"><g class="hani dash"><ellipse cx="0" cy="22" rx="17" ry="4.5" fill="#000" fill-opacity="0.13"/><ellipse cx="0" cy="7" rx="16" ry="17" fill="#ffd54a"/><ellipse cx="-15" cy="9" rx="5" ry="9" fill="#ffc62e"/><ellipse cx="19" cy="-2" rx="5" ry="10" fill="#ffc62e" transform="rotate(56 19 -2)"/><circle cx="0" cy="-10" r="13" fill="#ffd54a"/><circle cx="-5" cy="-11" r="2" fill="#3a2a1a"/><circle cx="5" cy="-11" r="2" fill="#3a2a1a"/><path d="M-3,-7 L3,-7 L0,-3 z" fill="#ff9a3c"/><ellipse cx="-9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.85"/><ellipse cx="9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.85"/><path d="M-3,-23 q3,-5 5,-1 M3,-23 q3,-4 4,0" fill="none" stroke="#ffb02e" stroke-width="2.2" stroke-linecap="round"/><path d="M-6,24 l-3,5 M6,24 l3,5" stroke="#ff9a3c" stroke-width="2.8" stroke-linecap="round"/></g></g><rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>'},
];

// ===== 막 시작 그림책 — 막마다 그 막의 개념을 한 장으로 소개 (하니가 기기 음성으로 읽어줌) =====
// 인트로 그림책과 같은 화면/흐름을 재사용. 자모 버블 + 결합 애니메이션으로 "글자가 만들어져요"를 보여준다.
// 공용 빌더: 자모 버블(원+큰 글자+눈 2개), 하니 병아리, 연산자(+/→), 장면 프레임.
function aiBub(x,y,r,ch,fill,eye,cls){cls=cls||'';
  var f=Math.round(r*1.15),ty=(r*0.36).toFixed(1),ex=(r*0.33).toFixed(1),ey=(-r*0.28).toFixed(1),er=(r*0.13).toFixed(1);
  var body='<circle r="'+r+'" fill="'+fill+'"/>'
    +'<circle cx="-'+ex+'" cy="'+ey+'" r="'+er+'" fill="'+eye+'"/><circle cx="'+ex+'" cy="'+ey+'" r="'+er+'" fill="'+eye+'"/>'
    +'<text y="'+ty+'" font-family="Jua, sans-serif" font-size="'+f+'" fill="#fff" text-anchor="middle">'+ch+'</text>';
  return '<g transform="translate('+x+','+y+')">'+(cls?'<g class="'+cls+'">'+body+'</g>':body)+'</g>';
}
function aiOp(x,ch){return '<text x="'+x+'" y="122" font-family="Jua, sans-serif" font-size="30" fill="#fff" text-anchor="middle" opacity="0.9">'+ch+'</text>';}
function aiHani(x,y,s,cls,sing){s=(s==null?1:s);cls=cls||'';
  var mouth=sing?'<ellipse cx="0" cy="-4" rx="3.2" ry="4.2" fill="#e8663f"/>':'<path d="M-3,-7 L3,-7 L0,-3 z" fill="#ff9a3c"/>';
  return '<g transform="translate('+x+','+y+') scale('+s+')"><g class="hani '+cls+'">'
    +'<ellipse cx="0" cy="22" rx="16" ry="4.5" fill="#000" fill-opacity="0.13"/>'
    +'<ellipse cx="0" cy="6" rx="15" ry="16" fill="#ffd54a"/>'
    +'<ellipse cx="-15" cy="8" rx="5" ry="9" fill="#ffc62e"/><ellipse cx="15" cy="8" rx="5" ry="9" fill="#ffc62e"/>'
    +'<circle cx="0" cy="-10" r="12" fill="#ffd54a"/>'
    +'<circle cx="-5" cy="-11" r="2" fill="#3a2a1a"/><circle cx="5" cy="-11" r="2" fill="#3a2a1a"/>'
    +mouth
    +'<ellipse cx="-9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.8"/><ellipse cx="9" cy="-6" rx="3" ry="2.2" fill="#ff9eb0" opacity="0.8"/>'
    +'<path d="M-3,-23 q3,-5 5,-1 M3,-23 q3,-4 4,0" fill="none" stroke="#ffb02e" stroke-width="2.2" stroke-linecap="round"/>'
    +'<path d="M-6,23 l-3,5 M6,23 l3,5" stroke="#ff9a3c" stroke-width="2.8" stroke-linecap="round"/>'
    +'</g></g>';
}
function aiScene(label,sky0,sky1,inner){
  return '<svg class="scene" viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+label+'">'
    +'<defs><clipPath id="rc"><rect x="0" y="0" width="400" height="280" rx="26"/></clipPath>'
    +'<linearGradient id="asky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sky0+'"/><stop offset="1" stop-color="'+sky1+'"/></linearGradient>'
    +'<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/></filter></defs>'
    +'<g clip-path="url(#rc)"><rect x="0" y="0" width="400" height="280" fill="url(#asky)"/>'
    +'<g fill="#fff"><circle class="tw" cx="60" cy="40" r="2"/><circle class="tw t2" cx="330" cy="36" r="1.8"/><circle class="tw t3" cx="205" cy="26" r="2"/></g>'
    +'<path d="M0,240 Q200,220 400,240 L400,280 L0,280 Z" fill="#5fa07f" opacity="0.85"/>'
    +inner
    +'<rect x="0" y="0" width="400" height="280" filter="url(#paper)"/></g></svg>';
}
function aiNote(x,y,cls){return '<text class="notefloat '+(cls||'')+'" x="'+x+'" y="'+y+'" font-family="Jua, sans-serif" font-size="20" fill="#fffbe6" text-anchor="middle">♪</text>';}
function aiSpark(x,y,cls){return '<g class="spark '+(cls||'')+'" transform="translate('+x+','+y+')"><path d="M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2 Z" fill="#ffe27a"/></g>';}
// 도우미 캐릭터: 큰 이모지 + 이름표(pill). 동물 SVG는 위험해서 트웨모지풍 이모지로 통일.
function aiHelper(x,y,emoji,name,sz){sz=sz||46;var half=Math.max(30,name.length*7);
  return '<g transform="translate('+x+','+y+')">'
    +'<text x="0" y="'+(sz*0.34).toFixed(0)+'" font-size="'+sz+'" text-anchor="middle">'+emoji+'</text>'
    +'<rect x="-'+half+'" y="'+(sz*0.52).toFixed(0)+'" width="'+(half*2)+'" height="20" rx="10" fill="#2b2350" fill-opacity="0.55"/>'
    +'<text x="0" y="'+(sz*0.52+14).toFixed(0)+'" font-family="Jua, sans-serif" font-size="12" fill="#fff" text-anchor="middle">'+name+'</text></g>';}
// 별빛 편지 모티프: 빈 줄만 있는 하얀 편지(도망친 글자). filled면 글자가 반짝 되살아난 편지.
function aiLetter(x,y,s,filled,cls){s=(s==null?1:s);cls=cls||'';
  var b='<rect x="-30" y="-38" width="60" height="76" rx="6" fill="#fffef8" stroke="#e6d8bf" stroke-width="2"/>';
  if(filled){b+='<g font-family="Jua, sans-serif" font-size="12" fill="#8f7fe0" text-anchor="middle">'
      +'<text x="-14" y="-20">별</text><text x="0" y="-20">빛</text><text x="14" y="-20">편</text>'
      +'<text x="-14" y="-2">지</text><text x="0" y="-2">가</text><text x="14" y="-2">살</text>'
      +'<text x="-7" y="16">아</text><text x="7" y="16">나</text></g>'
      +'<path d="M18,-30 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 l5,-2 z" fill="#ffe27a"/>';}
  else{b+='<line x1="-20" y1="-22" x2="20" y2="-22" stroke="#ece2cf" stroke-width="2.5"/>'
      +'<line x1="-20" y1="-8" x2="20" y2="-8" stroke="#ece2cf" stroke-width="2.5"/>'
      +'<line x1="-20" y1="6" x2="20" y2="6" stroke="#ece2cf" stroke-width="2.5"/>'
      +'<line x1="-20" y1="20" x2="8" y2="20" stroke="#ece2cf" stroke-width="2.5"/>';}
  return '<g transform="translate('+x+','+y+') scale('+s+')">'+(cls?'<g class="'+cls+'">'+b+'</g>':b)+'</g>';}

// 색상 팔레트(자음/모음): 인트로 5페이지 버블과 통일.
var _cB='#7ec4e8',_eB='#27414e';   // ㄱ 파랑
var _cP='#f3899f',_eP='#5a2436';   // ㅏ 분홍
var _cY='#f4b13c',_eY='#6a4810';   // ㅁ 노랑
var _cG='#5fae7a',_eG='#2e5a3e';   // ㅇ 초록
var _cT='#67c4c0',_eT='#1f4f4d';   // ㅣ 청록
var _cR='#ef6b6b',_eR='#7a2222';   // 쌍자음 빨강
var _cM='#8f7fe0',_eM='#3a2f66';   // 완성 글자 보라

// 각 막 = 3쪽 이야기 장(도착 → 도우미+개념 → 전환). 오프닝 그림책과 같은 페이징(dots/prev/next)으로 넘긴다.
// 이야기: 별빛 우체국 편지에서 도망친 글자들을 각 막(장소)에서 되찾아 편지를 살리는 모험. 막마다 도우미가 등장.
const ACT_INTROS={
  1:{act:1,pages:[
    {cap:'텅 빈 편지',say:'별빛 우체국 편지가 텅 비었어요. 겁이 난 글자들이 숲으로 도망쳤대요.',
      svg:aiScene('텅 빈 편지','#2c2752','#6a5a9a',aiLetter(150,120,1.25,false)+aiSpark(250,80,'s2')+aiHani(310,246,0.85))},
    {cap:'반딧불이 깜빡이',say:'반딧불이 깜빡이가 반짝! 모음 친구는 소리를 내면 나와요. 입을 크게 벌리고, 아—!',
      svg:aiScene('반딧불이 깜빡이','#2c2752','#6a5a9a',aiSpark(90,72)+aiSpark(160,58,'s2')+aiSpark(240,66,'s3')+aiHelper(130,128,'✨','반딧불이 깜빡이')+aiHani(310,246,0.85,'',true))},
    {cap:'모음을 불러요',say:'입 모양이 다르면 소리도 달라요. 아·어·오! 자, 숨은 모음 친구를 소리로 불러볼까?',
      svg:aiScene('모음을 불러요','#2c2752','#7a68a8',aiNote(95,58)+aiNote(200,52,'n2')+aiNote(305,58,'n3')+aiBub(95,120,26,'ㅏ',_cP,_eP)+aiBub(200,120,26,'ㅓ',_cB,_eB)+aiBub(305,120,26,'ㅗ',_cY,_eY)+aiHani(200,248,0.9,'',true))},
  ]},
  2:{act:2,pages:[
    {cap:'조용한 숲',say:'숲속 자음 친구들이 쿨쿨 잠들었어요. 아무 소리도 안 나요.',
      svg:aiScene('조용한 숲','#2c2752','#5a7a68','<text class="notefloat" x="150" y="80" font-family="Jua, sans-serif" font-size="17" fill="#cfe6f3" text-anchor="middle">z  z  z</text>'+aiBub(150,132,30,'ㄱ',_cB,_eB)+aiHani(300,246,0.85))},
    {cap:'숲지기 도토리',say:'다람쥐 도토리가 폴짝! 자음은 혼자선 조용해. 모음 친구 손을 잡아야 깨어난단다!',
      svg:aiScene('숲지기 도토리','#3d3470','#5a9a78',aiHelper(105,126,'🐿️','다람쥐 도토리')+aiBub(232,120,24,'ㄱ',_cB,_eB)+aiOp(280,'+')+aiBub(322,120,24,'ㅏ',_cP,_eP)+aiHani(210,250,0.72))},
    {cap:'손을 잡으니 가!',say:'ㄱ이 ㅏ 손을 잡으니— 가! 소리가 났어요. 자음을 깨워볼까?',
      svg:aiScene('손을 잡으니 가!','#3d3470','#5a9a78',aiBub(72,120,26,'ㄱ',_cB,_eB,'slideR')+aiOp(121,'+')+aiBub(170,120,26,'ㅏ',_cP,_eP,'slideL')+aiOp(230,'→')+aiNote(300,64)+aiBub(302,120,32,'가',_cM,_eM,'merge')+aiHani(200,250,0.82))},
  ]},
  3:{act:3,pages:[
    {cap:'대장장이 곰',say:'글자 공방에 도착! 대장장이 곰 뚝딱이 망치를 들었어요.',
      svg:aiScene('대장장이 곰','#4a72a8','#dbe7c9',aiHelper(140,124,'🐻','대장장이 뚝딱')+'<text x="252" y="132" font-size="42" text-anchor="middle">🔨</text>'+aiHani(320,248,0.72))},
    {cap:'땅! 새 글자',say:'자음과 모음을 모루에 올리고— 땅! 땅! 뚝딱이 두드리자 새 글자가 태어났어요.',
      svg:aiScene('땅! 새 글자','#4a72a8','#dbe7c9',aiBub(74,116,28,'ㄱ',_cB,_eB,'slideR')+aiOp(128,'+')+aiBub(182,116,28,'ㅏ',_cP,_eP,'slideL')+aiOp(240,'→')+aiSpark(276,82)+aiSpark(340,88,'s2')+aiSpark(310,150,'s3')+aiBub(310,116,34,'가',_cM,_eM,'merge')+aiHani(200,250,0.8))},
    {cap:'직접 만들어요',say:'ㄱ 더하기 ㅏ는 가! 이번엔 네가 글자를 만들어볼래?',
      svg:aiScene('직접 만들어요','#4a72a8','#dbe7c9',aiBub(74,116,28,'ㄱ',_cB,_eB)+aiOp(128,'+')+aiBub(182,116,28,'ㅏ',_cP,_eP)+aiOp(240,'→')+aiBub(310,116,34,'가',_cM,_eM,'merge')+aiHani(200,250,0.82))},
  ]},
  4:{act:4,pages:[
    {cap:'무거운 문',say:'길을 막은 커다란 받침의 문. 두꺼비 문지기 끄떡이 앉아 있어요.',
      svg:aiScene('무거운 문','#3d3470','#9a86b8','<g transform="translate(118,146)"><rect x="-42" y="-64" width="84" height="128" rx="8" fill="#4a3d68"/><rect x="-32" y="-50" width="64" height="114" rx="6" fill="#2c2544"/><rect x="-3" y="-50" width="6" height="114" fill="#5a4d7a"/></g>'+aiHelper(118,120,'🐸','두꺼비 끄떡')+aiHani(320,248,0.75))},
    {cap:'받침돌을 얹어요',say:'글자 아래 받침돌을 살포시 얹어야 문이 열려. 가 아래 이응을 얹으니— 강!',
      svg:aiScene('받침돌을 얹어요','#3d3470','#9a86b8',aiBub(70,116,28,'가',_cB,_eB)+aiOp(122,'+')+aiBub(172,104,24,'ㅇ',_cG,_eG,'drop')+'<text x="172" y="150" font-family="Jua, sans-serif" font-size="13" fill="#ffe9c2" text-anchor="middle">받침돌</text>'+aiOp(232,'→')+aiBub(305,116,33,'강',_cM,_eM,'merge')+aiHani(200,250,0.8))},
    {cap:'문이 열렸다',say:'끄떡이 끄덕— 문이 스르륵! 끝소리 글자를 되찾아요.',
      svg:aiScene('문이 열렸다','#3d3470','#9a86b8',aiSpark(140,80)+aiSpark(250,78,'s2')+aiBub(190,120,36,'강',_cM,_eM,'merge')+aiHelper(320,120,'🐸','끄떡')+aiHani(90,250,0.72))},
  ]},
  5:{act:5,pages:[
    {cap:'메아리 동굴',say:'소리 동굴에서 힘센 메아리가 울려요. 쌍둥이 박쥐가 매달려 있어요.',
      svg:aiScene('메아리 동굴','#3a2f4a','#6a4a6a',aiHelper(190,122,'🦇🦇','쌍둥이 박쥐',48)+aiHani(320,248,0.75))},
    {cap:'힘을 꾹!',say:'우린 쌍둥이! 힘을 꾹 주면 더 센 소리가 나. 가— 보다 센— 까!',
      svg:aiScene('힘을 꾹!','#3a2f4a','#6a4a6a',aiBub(70,116,25,'ㄱ',_cB,_eB)+aiOp(118,'+')+aiBub(166,116,25,'ㄱ',_cB,_eB)+aiOp(226,'→')+aiSpark(268,84,'s2')+aiSpark(340,150,'s3')+aiBub(302,116,33,'ㄲ',_cR,_eR,'merge')+'<text class="spark" x="302" y="176" font-family="Jua, sans-serif" font-size="20" fill="#ffe27a" text-anchor="middle">까!</text>'+aiHani(200,250,0.8,'determined'))},
    {cap:'센 소리 되찾기',say:'쌍둥이 자음은 힘을 꾹! 까! 된소리 친구를 불러볼까?',
      svg:aiScene('센 소리 되찾기','#3a2f4a','#6a4a6a',aiBub(110,116,30,'가',_cB,_eB)+aiOp(178,'→')+aiSpark(228,84)+aiSpark(300,150,'s3')+aiBub(278,116,34,'까',_cR,_eR,'merge')+aiHani(200,250,0.82,'determined'))},
  ]},
  6:{act:6,pages:[
    {cap:'별빛 뒤',say:'별빛 뒤에 모음들이 숨어 반짝여요. 작은 별빛 요정이 나타났어요.',
      svg:aiScene('별빛 뒤','#2c2752','#8fa8d8',aiSpark(88,70)+aiSpark(300,66,'s2')+aiSpark(200,54,'s3')+aiHelper(150,130,'🧚','별빛 요정')+aiHani(315,248,0.8))},
    {cap:'겹치면 나와요',say:'모음 둘이 겹친 자리를 비춰줄게. 아 더하기 이는— 애!',
      svg:aiScene('겹치면 나와요','#2c2752','#8fa8d8',aiBub(74,116,28,'ㅏ',_cP,_eP,'slideR')+aiOp(128,'+')+aiBub(182,116,28,'ㅣ',_cT,_eT,'slideL')+aiOp(240,'→')+aiSpark(276,84)+aiSpark(338,146,'s3')+aiBub(310,116,34,'ㅐ',_cM,_eM,'merge')+aiHani(200,250,0.82))},
    {cap:'숨은 모음 찾기',say:'겹쳐진 숨은 모음! 요정과 함께 찾아볼까?',
      svg:aiScene('숨은 모음 찾기','#2c2752','#8fa8d8',aiHelper(88,122,'🧚','별빛 요정')+aiBub(208,116,28,'ㅏ',_cP,_eP)+aiOp(258,'+')+aiBub(300,116,28,'ㅣ',_cT,_eT)+aiHani(200,250,0.82))},
  ]},
  7:{act:7,pages:[
    {cap:'시든 마을',say:'글자가 사라져 마을 꽃이 시들었어요. 되찾은 글자를 모아볼까요?',
      svg:aiScene('시든 마을','#8cc2dd','#dceede','<g transform="translate(110,170)"><path d="M0,20 Q-4,2 -14,-2" fill="none" stroke="#7f9e5a" stroke-width="3"/><circle cx="-16" cy="-4" r="8" fill="#c9a0b0"/><circle cx="-16" cy="-4" r="3" fill="#e6c86a"/></g><g transform="translate(170,182)"><path d="M0,18 Q4,2 12,-1" fill="none" stroke="#7f9e5a" stroke-width="3"/><circle cx="14" cy="-3" r="7" fill="#b6a8d0"/></g>'+aiHani(300,246,0.85))},
    {cap:'글자가 모여 단어',say:'오 그리고 이— 오이! 글자가 모이니 단어가 됐어요. 꽃이 다시 피어나요!',
      svg:aiScene('글자가 모여 단어','#8cc2dd','#dceede',aiBub(70,116,28,'오',_cB,_eB,'slideR')+aiOp(122,'+')+aiBub(170,116,28,'이',_cP,_eP,'slideL')+aiOp(232,'→')+'<g transform="translate(305,112)"><g class="merge"><rect x="-42" y="-26" width="84" height="52" rx="16" fill="'+_cM+'"/><text y="9" font-family="Jua, sans-serif" font-size="27" fill="#fff" text-anchor="middle">오이</text></g></g>'+aiSpark(305,166,'s2')+aiHani(200,250,0.82))},
    {cap:'단어를 지어요',say:'이제 네가 단어를 지어 마을을 살려볼래?',
      svg:aiScene('단어를 지어요','#8cc2dd','#dceede',aiBub(90,116,28,'오',_cB,_eB)+aiOp(140,'+')+aiBub(190,116,28,'이',_cP,_eP)+aiOp(240,'→')+'<g transform="translate(310,112)"><g class="merge"><rect x="-40" y="-24" width="80" height="48" rx="14" fill="'+_cG+'"/><text y="8" font-family="Jua, sans-serif" font-size="24" fill="#fff" text-anchor="middle">?</text></g></g>'+aiHani(200,250,0.82))},
  ]},
  8:{act:8,pages:[
    {cap:'우체국으로',say:'모은 글자를 안고 별빛 우체국으로! 하얀 편지가 기다려요.',
      svg:aiScene('우체국으로','#3d3470','#d79bae','<text x="255" y="112" font-size="42" text-anchor="middle">🏤</text>'+aiLetter(120,124,1.1,false)+aiHani(310,248,0.82))},
    {cap:'편지가 살아나요',say:'글자들이 편지 위로 사르르— 반짝! 사라졌던 글이 다시 떠올랐어요.',
      svg:aiScene('편지가 살아나요','#3d3470','#d79bae',aiLetter(200,118,1.3,true,'glowpulse')+aiSpark(110,80)+aiSpark(300,78,'s2')+aiSpark(150,164,'s3')+aiHani(320,248,0.78))},
    {cap:'스스로 읽어요',say:'이제 네가 스스로 읽어줄래? 그리고 하니가 이 편지를 배달할 거야. 준비됐니?',
      svg:aiScene('스스로 읽어요','#3d3470','#d79bae',aiLetter(140,118,1.15,true)+'<text x="272" y="122" font-size="40" text-anchor="middle">✉️</text>'+aiSpark(300,80)+aiHani(300,248,0.82,'',true))},
  ]},
};
