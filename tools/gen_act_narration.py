# -*- coding: utf-8 -*-
"""막 인트로(시나리오) 내레이션 MP3 생성 — SunHi 뉴럴, 오프닝(intro1~6)과 동일 톤.
사용: python tools/gen_act_narration.py [--dry]
audio/narr/act{N}_{page}.mp3 (N=1~8, page=1~3) 생성. 이미 있으면 건너뜀.
"""
import os, re, sys, asyncio

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(HERE, 'app-data.js')
OUT  = os.path.join(HERE, 'audio', 'narr')
VOICE = 'ko-KR-SunHiNeural'
PITCH = '+0Hz'
RATE  = '-8%'   # 만4세 이야기 낭독 톤: 살짝 느리게

def extract():
    txt = open(DATA, encoding='utf-8').read()
    i = txt.index('const ACT_INTROS={')
    # ACT_INTROS 뒤 첫 다른 const 선언 전까지 자른다 (있으면)
    m = re.search(r'\n(const|function|var|let)\s', txt[i+10:])
    block = txt[i: i+10+m.start()] if m else txt[i:]
    # 각 막 구분: "  N:{act:N,pages:["
    marks = [(int(g.group(1)), g.start()) for g in re.finditer(r'\n\s*(\d):\{act:\1,pages:\[', block)]
    items = []
    for idx,(act,pos) in enumerate(marks):
        end = marks[idx+1][1] if idx+1 < len(marks) else len(block)
        says = re.findall(r"say:'([^']*)'", block[pos:end])
        for p, say in enumerate(says, start=1):
            items.append((act, p, say))
    return items

async def synth(items):
    import edge_tts
    made = 0
    for act, page, text in items:
        path = os.path.join(OUT, f'act{act}_{page}.mp3')
        if os.path.exists(path):
            continue
        c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await c.save(path)
        made += 1
        print(f'  saved act{act}_{page}.mp3 ({len(text)}자)')
    print(f'생성 {made}개 / 전체 {len(items)}개')

def main():
    items = extract()
    print(f'추출된 내레이션: {len(items)}개 (막 {len(set(a for a,_,_ in items))}개)')
    for act, page, say in items:
        print(f'  act{act}_{page}: {say[:32]}...')
    if '--dry' in sys.argv:
        return
    os.makedirs(OUT, exist_ok=True)
    asyncio.run(synth(items))

if __name__ == '__main__':
    main()
