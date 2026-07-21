# -*- coding: utf-8 -*-
"""
한글 놀이터 - edge-tts 음성파일 자동 생성  (완전 무료 / 가입·카드·API키 불필요)

사용법:
  1) 명령창에서:  pip install edge-tts
  2) 이 파일이 있는 폴더에서:  python generate_voices.py
  -> audio/f(여성), audio/kid(아이), audio/m(남성) 폴더에 mp3가 만들어집니다.
     (중간에 멈춰도 다시 실행하면 이어서 만들어요. 이미 만든 파일은 건너뜀)

다른 한국어 목소리를 보고 싶으면 아래 LIST_VOICES = True 로 두고 한 번 실행하세요.
한국어 보이스 목록이 출력됩니다. 마음에 드는 ShortName 을 SPEAKERS 의 "voice" 에 넣고
다시 False 로 바꿔 실행하면 됩니다.
"""
import os, sys, asyncio
import edge_tts

LIST_VOICES = False

# f=여성, kid=아이(여성 목소리를 높은 톤으로), m=남성  (전부 한국어 네이티브)
SPEAKERS = {
    "f":   {"voice": "ko-KR-SunHiNeural",  "pitch": "+0Hz"},
    "kid": {"voice": "ko-KR-SunHiNeural",  "pitch": "+35Hz"},
    "m":   {"voice": "ko-KR-InJoonNeural", "pitch": "+0Hz"},
}

# ---------- 만들 텍스트 목록 (앱과 동일) ----------
CONS_NAMES = ['기역','니은','디귿','리을','미음','비읍','시옷','이응','지읒','치읓','키읔','티읕','피읖','히읗']
VOW_SOUNDS = ['아','야','어','여','오','요','우','유','으','이']
EX_WORDS = ['기린','나비','다람쥐','로봇','모자','바나나','사과','오리','자동차','치즈','코끼리','토끼','포도','호랑이',
            '아기','야구','어항','여우','오이','요요','우산','유니콘','음악','이빨']
WORDS = ['강아지','고양이','토끼','호랑이','코끼리','기린','사자','곰','여우','오리',
         '사과','바나나','포도','딸기','수박','우유','빵','치즈','김밥','사탕',
         '자동차','기차','비행기','배','자전거','우산','모자','신발','책','시계']
SENT = ['고양이가','강아지가','아기가','토끼가','곰이','오리가',
        '나비가','새가','엄마가','아빠가','아이가','물고기가',
        '우유를','사과를','공을','책을','밥을','물을',
        '꽃을','노래를','뼈를','바나나를','별을',
        '먹어요','좋아해요','봐요','마셔요','던져요','찾아요',
        '불러요','물어요','심어요','그려요']
# 3막 글자 공방 예시 단어(sylWords) — 배너/복습에서 쓰일 수 있어 함께 생성
SYL_WORDS = ['가방','나비','다리','마차','고래','모자',
             '바다','사자','하마','기차','도토리','토끼','구름','무지개']
BATCHIM = ['강','산','곰','문','손','발','눈','별','빵','컵']
EXTRA = ['안녕','가나다라마바사']

INIT = [0,2,3,5,6,7,9,11,12,14,15,16,17,18]
MED  = [0,2,4,6,8,12,13,17,18,20]
FIN  = [0,1,4,7,8,16,17,19,21]

# ---------- 앱이 실제로 읽는 텍스트 ----------
# 목록을 여기 따로 들고 있으면 app-data.js가 바뀔 때마다 어긋난다(실제로 5·6막 낱자와
# 막 클리어·졸업 문구가 통째로 빠져 있었다). 검사기와 **같은 수집 함수**를 쓴다.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "tools"))


# 낱말 성격의 출처만 한 글자씩 쪼갠다(단어를 짚어 읽는 활동이 있어서).
# UI 문구('읽었어요')나 자음 이름('지읒')까지 쪼개면 쓰이지도 않는 음절이 잔뜩 생긴다.
WORDLIKE_SOURCES = {"자음 예시", "쌍자음 예시", "모음 예시", "복모음 예시",
                    "글자별 낱말", "받침 낱말", "단어뱅크", "음절 예시단어",
                    "따라쓰기 낱말", "받침 음절", "음절"}


def texts_from_appdata():
    """검사기와 같은 수집 함수를 써서 {텍스트: 출처}를 얻는다."""
    try:
        from check_content import load_data, collect_spoken_texts
        return collect_spoken_texts(load_data())
    except Exception as e:
        print("! app-data.js에서 텍스트를 못 읽었습니다(node 필요):", str(e)[:120])
        print("  아래 하드코딩 목록만으로 진행합니다.")
        return {}


def build_text_set():
    from_app = texts_from_appdata()
    s = set(from_app)
    # 폴백용 하드코딩 목록(위가 실패해도 기본 코퍼스는 만들어지도록).
    for grp in (CONS_NAMES, VOW_SOUNDS, EX_WORDS, WORDS, SENT, SYL_WORDS, BATCHIM, EXTRA):
        s.update(grp)
    # 받아쓰기·합치기에 쓰이는 음절 조합(초성×중성×종성) — 데이터에 없지만 화면에서 만들어진다.
    for i in INIT:
        for m in MED:
            for f in FIN:
                s.add(chr(0xAC00 + i * 588 + m * 28 + f))
    # 낱말만 한 글자씩.
    wordlike = [w for w, src in from_app.items() if src in WORDLIKE_SOURCES]
    for w in wordlike + EX_WORDS + WORDS + SYL_WORDS:
        if all('가' <= c <= '힣' for c in w):
            s.update(w)
    return sorted(s)

def key_of(t):
    return '-'.join(format(ord(c), 'x') for c in t)

async def list_korean_voices():
    voices = await edge_tts.list_voices()
    ko = [v for v in voices if v.get("Locale","").startswith("ko")]
    print("== 사용 가능한 한국어 보이스 ==")
    for v in ko:
        print("  ", v.get("ShortName"), "/", v.get("Gender"), "/", v.get("FriendlyName"))
    print("\n원하는 ShortName 을 SPEAKERS 의 \"voice\" 에 넣고 LIST_VOICES=False 로 다시 실행하세요.")

async def synth(text, voice, pitch, out_path):
    for attempt in range(3):
        try:
            c = edge_tts.Communicate(text, voice, pitch=pitch)
            await c.save(out_path)
            if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
                return True
        except Exception as e:
            if attempt == 2:
                print("  ! 실패:", text, "-", str(e)[:80])
            await asyncio.sleep(2 + attempt*2)
    return False

async def main_async():
    if LIST_VOICES:
        await list_korean_voices()
        return
    texts = build_text_set()
    print("만들 텍스트:", len(texts), " /  성우:", list(SPEAKERS.keys()))
    print("총", len(texts)*len(SPEAKERS), "개 파일 예정\n")
    for vkey, cfg in SPEAKERS.items():
        d = os.path.join("audio", vkey)
        os.makedirs(d, exist_ok=True)
        made = skipped = 0
        for idx, t in enumerate(texts, 1):
            out = os.path.join(d, key_of(t) + ".mp3")
            if os.path.exists(out) and os.path.getsize(out) > 0:
                skipped += 1
                continue
            if await synth(t, cfg["voice"], cfg["pitch"], out):
                made += 1
            if idx % 100 == 0:
                print(f"  [{vkey}] {idx}/{len(texts)} ...")
        print(f"[{vkey}] 완료 - 새로 {made}, 건너뜀 {skipped}\n")
    print("끝! audio 폴더를 깃허브 저장소에 올리세요.")

def main():
    if sys.platform.startswith("win"):
        try:
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except Exception:
            pass
    asyncio.run(main_async())

if __name__ == "__main__":
    main()
