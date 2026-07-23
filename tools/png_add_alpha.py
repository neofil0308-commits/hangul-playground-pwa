"""8-bit RGB PNG를 알파 채널이 있는 RGBA PNG로 변환한다.

왜 필요한가: Play 스토어 등록정보의 앱 아이콘은 **32-bit PNG(알파 포함)** 규격인데,
이 저장소의 아이콘들은 colorType=2(RGB, 알파 없음)로 만들어져 있다. 그대로 올리면
업로드 단계에서 거절될 수 있다.

왜 직접 짰나: 이 맥에는 Pillow도 ImageMagick도 없고, `sips`는 colorType을 2에서 6으로
바꿔 주지 않는다(실측). 아이콘 하나 때문에 의존성을 새로 들이는 것보다 stdlib(zlib)만으로
디코드·인코드하는 편이 가볍다.

한계: 8bit/colorType=2/non-interlaced 입력만 다룬다. 이 저장소의 아이콘이 전부 그 형식이다.

사용: python tools/png_add_alpha.py <입력.png> <출력.png>
"""

import pathlib
import struct
import sys
import zlib

PNG_SIG = b"\x89PNG\r\n\x1a\n"


def read_chunks(data):
    """PNG 청크를 (타입, 내용) 순서대로 흘려보낸다."""
    if data[:8] != PNG_SIG:
        raise ValueError("PNG 시그니처가 아니다")
    pos = 8
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        ctype = data[pos + 4:pos + 8]
        content = data[pos + 8:pos + 8 + length]
        yield ctype, content
        pos += 12 + length  # length(4) + type(4) + data + crc(4)


def write_chunk(ctype, content):
    body = ctype + content
    return struct.pack(">I", len(content)) + body + struct.pack(">I", zlib.crc32(body))


def unfilter(raw, width, height, bpp):
    """스캔라인별 필터를 되돌려 순수 픽셀 바이트로 만든다(PNG 명세 9.2)."""
    stride = width * bpp
    out = bytearray()
    prev = bytearray(stride)
    pos = 0
    for _ in range(height):
        ftype = raw[pos]
        pos += 1
        line = bytearray(raw[pos:pos + stride])
        pos += stride
        for i in range(stride):
            a = line[i - bpp] if i >= bpp else 0   # 왼쪽 픽셀
            b = prev[i]                            # 위 픽셀
            c = prev[i - bpp] if i >= bpp else 0   # 왼쪽 위 픽셀
            if ftype == 0:
                pass
            elif ftype == 1:
                line[i] = (line[i] + a) & 0xFF
            elif ftype == 2:
                line[i] = (line[i] + b) & 0xFF
            elif ftype == 3:
                line[i] = (line[i] + (a + b) // 2) & 0xFF
            elif ftype == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pred) & 0xFF
            else:
                raise ValueError(f"알 수 없는 필터 타입 {ftype}")
        out += line
        prev = line
    return out


def convert(src, dst):
    data = pathlib.Path(src).read_bytes()

    ihdr = None
    idat = b""
    for ctype, content in read_chunks(data):
        if ctype == b"IHDR":
            ihdr = content
        elif ctype == b"IDAT":
            idat += content
        elif ctype == b"IEND":
            break

    width, height, depth, color, comp, filt, interlace = struct.unpack(">IIBBBBB", ihdr)
    if (depth, color, interlace) != (8, 2, 0):
        raise ValueError(
            f"8bit/RGB/non-interlaced만 지원한다 (입력: depth={depth} colorType={color} interlace={interlace})")

    pixels = unfilter(zlib.decompress(idat), width, height, bpp=3)

    # RGB → RGBA. 원본에 투명 정보가 없으므로 전 픽셀 불투명(255)으로 채운다.
    # 그림은 그대로 두고 채널만 늘리는 것이라 눈에 보이는 변화는 없다.
    stride_in, stride_out = width * 3, width * 4
    body = bytearray()
    for y in range(height):
        body.append(0)  # 필터 타입 0(None) — 압축률보다 단순함을 택한다
        row = pixels[y * stride_in:(y + 1) * stride_in]
        for x in range(width):
            body += row[x * 3:x * 3 + 3] + b"\xff"
    assert len(body) == height * (stride_out + 1)

    out = bytearray(PNG_SIG)
    out += write_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    out += write_chunk(b"IDAT", zlib.compress(bytes(body), 9))
    out += write_chunk(b"IEND", b"")
    pathlib.Path(dst).write_bytes(bytes(out))
    return width, height


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    w, h = convert(sys.argv[1], sys.argv[2])
    print(f"✅ {sys.argv[2]} — {w}x{h} RGBA(colorType=6)로 변환 완료")
    return 0


if __name__ == "__main__":
    sys.exit(main())
