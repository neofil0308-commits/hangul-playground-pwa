# -*- coding: utf-8 -*-
"""
풀어듣기(가르치는 설명) 문장을 단어별로 통째 신경망 음성 MP3로 생성.
- 조각을 이어붙이지 않고 문장 전체를 한 번에 녹음 -> 끊김 없이 자연스러움.
- 데이터(아래 WORDS_*)에서 자동 도출, 이미 만든 파일은 건너뜀(확장 시 다시 실행만).
사용법:  pip install edge-tts ;  python generate_explain.py
-> audio/explain/f|kid|m/<keyOf(word)>.mp3
"""
import os, sys, asyncio
import edge_tts

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio", "explain")
SPEAKERS = {
    "f":   {"voice": "ko-KR-SunHiNeural",  "pitch": "+0Hz"},
    "kid": {"voice": "ko-KR-SunHiNeural",  "pitch": "+35Hz"},
    "m":   {"voice": "ko-KR-InJoonNeural", "pitch": "+0Hz"},
}

CHO = list("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
JUNG = list("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")
JONG = ['']+list("ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ")
CONS_NAME = {'ㄱ':'기역','ㄴ':'니은','ㄷ':'디귿','ㄹ':'리을','ㅁ':'미음','ㅂ':'비읍','ㅅ':'시옷','ㅇ':'이응','ㅈ':'지읒','ㅊ':'치읓','ㅋ':'키읔','ㅌ':'티읕','ㅍ':'피읖','ㅎ':'히읗','ㄲ':'쌍기역','ㄸ':'쌍디귿','ㅃ':'쌍비읍','ㅆ':'쌍시옷','ㅉ':'쌍지읒'}
VOW_SOUND = {'ㅏ':'아','ㅑ':'야','ㅓ':'어','ㅕ':'여','ㅗ':'오','ㅛ':'요','ㅜ':'우','ㅠ':'유','ㅡ':'으','ㅣ':'이','ㅐ':'애','ㅒ':'얘','ㅔ':'에','ㅖ':'예','ㅘ':'와','ㅙ':'왜','ㅚ':'외','ㅝ':'워','ㅞ':'웨','ㅟ':'위','ㅢ':'의'}

def say(j):
    return CONS_NAME.get(j) or VOW_SOUND.get(j) or j

def explain_text(word):
    parts = []
    for ch in word:
        code = ord(ch) - 0xAC00
        if code < 0 or code > 11171:
            parts.append(ch); continue
        i, m, f = code // 588, (code % 588) // 28, code % 28
        cho, jung, jong = CHO[i], JUNG[m], JONG[f]
        if f > 0:
            inter = chr(0xAC00 + i*588 + m*28)
            parts.append(f"{say(cho)}에 {say(jung)}를 더하면 {inter}, {say(jong)} 받침을 더하면 {ch}")
        else:
            parts.append(f"{say(cho)}에 {say(jung)}를 더하면 {ch}")
    return ", ".join(parts) + ", " + word

# 단어는 app-data.js의 LETTER_WORDS + WORDS에서 자동 추출 (단어 추가 = 데이터만 고치고 재실행)
import re
def words_from_appdata():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app-data.js")
    txt = open(path, encoding="utf-8").read()
    out = set()
    for marker in ["LETTER_WORDS", "WORDS"]:
        m = re.search(r"const " + marker + r"\s*=\s*\{(.*?)\n\};", txt, re.S)
        if m:
            for w in re.findall(r"\['([가-힣]+)'", m.group(1)):
                out.add(w)
    return sorted(out)

def key_of(t):
    return '-'.join(format(ord(c), 'x') for c in t)

async def synth(text, voice, pitch, out_path):
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, voice, pitch=pitch).save(out_path)
            if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
                return True
        except Exception as e:
            if attempt == 2: print("fail", text[:20], str(e)[:50])
            await asyncio.sleep(1+attempt)
    return False

async def main():
    words = words_from_appdata()
    print("words:", len(words), "x voices:", list(SPEAKERS))
    for vkey, cfg in SPEAKERS.items():
        d = os.path.join(ROOT, vkey); os.makedirs(d, exist_ok=True)
        made = skipped = 0
        for w in words:
            out = os.path.join(d, key_of(w) + ".mp3")
            if os.path.exists(out) and os.path.getsize(out) > 0:
                skipped += 1; continue
            if await synth(explain_text(w), cfg["voice"], cfg["pitch"], out):
                made += 1
            if (made+skipped) % 30 == 0: print(f"  [{vkey}] {made+skipped}/{len(words)}")
        print(f"[{vkey}] made {made}, skipped {skipped}")
    print("done")

if __name__ == "__main__":
    if sys.platform.startswith("win"):
        try: asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except Exception: pass
    asyncio.run(main())
