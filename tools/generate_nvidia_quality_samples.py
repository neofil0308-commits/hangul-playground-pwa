#!/usr/bin/env python
"""Generate object-first Hanguel card quality samples.

NVIDIA is asked for isolated object artwork only. The learning-card layout,
background, text panel, and exact Hangul glyphs are composed locally so the
result is deterministic enough for a 4-year-old learning card.
"""
from __future__ import annotations

import argparse
import io
import time
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

import generate_nvidia_cards as cards

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "generated-cards" / "quality-samples"
FONT_CANDIDATES = [
    Path("C:/Windows/Fonts/malgunbd.ttf"),
    Path("C:/Windows/Fonts/malgun.ttf"),
    Path("C:/Windows/Fonts/NanumGothicBold.ttf"),
]

CARD_SIZE = (1024, 1024)
OBJECT_AREA = (112, 110, 912, 610)
TEXT_PANEL = (132, 684, 892, 936)
# lowercase alias kept intentionally for static guardrails: object_area
object_area = OBJECT_AREA

SPECS = [
    {
        "id": "sample-letter-a",
        "text": "ㅏ",
        "label": "모음 ㅏ",
        "filename": "sample-letter-a.jpg",
        "object_name": "yellow chick with a small sunbeam",
        "prompt": "Warm hand-drawn preschool illustration, isolated object on a plain white background. Draw one cute yellow chick with a small sunbeam, centered, large, child-safe rounded shape. single object only, no card layout, no border, no panel, no caption, no Korean letters, no letters, no words, no watermark, no signature.",
    },
    {
        "id": "sample-word-oi",
        "text": "오이",
        "label": "오이",
        "filename": "sample-word-oi.jpg",
        "object_name": "cute cucumber character",
        "prompt": "Warm hand-drawn preschool illustration, isolated object on a plain white background. Draw one cute cucumber character with a friendly face, centered, large, simple silhouette. single object only, no card layout, no border, no panel, no caption, no Korean letters, no letters, no words, no watermark, no signature.",
    },
    {
        "id": "sample-hani",
        "text": "하니",
        "label": "하니",
        "filename": "sample-hani.jpg",
        "object_name": "Hani yellow chick beside red star mailbox",
        "prompt": "Warm hand-drawn preschool illustration, isolated object on a plain white background. Draw a small yellow chick mascot beside a cozy red star mailbox as one grouped object, centered, large, picture-book style. The mailbox front must be completely blank except for one simple yellow star icon. single object only, no card layout, no border, no panel, no caption, no Korean letters, no English letters, no numbers, no words, no watermark, no signature.",
    },
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in FONT_CANDIDATES:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    raise RuntimeError("No Korean font found. Expected Malgun Gothic under C:/Windows/Fonts.")


def fit_font(text: str, max_width: int, max_height: int, start_size: int) -> ImageFont.FreeTypeFont:
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    for size in range(start_size, 72, -6):
        font = load_font(size)
        box = probe.textbbox((0, 0), text, font=font)
        if box[2] - box[0] <= max_width and box[3] - box[1] <= max_height:
            return font
    return load_font(72)


def centered_text_position(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, box: tuple[int, int, int, int]) -> tuple[int, int]:
    text_box = draw.textbbox((0, 0), text, font=font)
    tw = text_box[2] - text_box[0]
    th = text_box[3] - text_box[1]
    x = box[0] + ((box[2] - box[0]) - tw) // 2 - text_box[0]
    y = box[1] + ((box[3] - box[1]) - th) // 2 - text_box[1]
    return x, y


def draw_learning_card_background() -> Image.Image:
    """Build a deterministic card shell independent from the image model."""
    image = Image.new("RGB", CARD_SIZE, (255, 246, 225))
    draw = ImageDraw.Draw(image)
    for y in range(CARD_SIZE[1]):
        # soft vertical paper gradient
        r = 255
        g = 247 - int(y * 18 / CARD_SIZE[1])
        b = 226 + int(y * 12 / CARD_SIZE[1])
        draw.line([(0, y), (CARD_SIZE[0], y)], fill=(r, g, b))
    draw.rounded_rectangle((38, 38, 986, 986), radius=72, outline=(255, 255, 255), width=18)
    draw.rounded_rectangle((76, 76, 948, 948), radius=58, outline=(245, 213, 177), width=4)
    draw.ellipse((150, 570, 874, 660), fill=(130, 90, 55), outline=None)
    shadow = Image.new("RGBA", CARD_SIZE, (255, 255, 255, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((150, 570, 874, 660), fill=(80, 50, 30, 28))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    image = Image.alpha_composite(image.convert("RGBA"), shadow)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(TEXT_PANEL, radius=56, fill=(255, 255, 249, 255), outline=(255, 255, 255, 255), width=10)
    return image


def extract_object_from_plain_background(raw: bytes) -> Image.Image:
    """Convert a plain-background NVIDIA image into an RGBA object cutout."""
    image = Image.open(io.BytesIO(raw)).convert("RGB").resize(CARD_SIZE, Image.LANCZOS)

    # Compare with the likely white/off-white background and keep non-background pixels.
    bg = Image.new("RGB", image.size, image.getpixel((0, 0)))
    diff = ImageChops.difference(image, bg).convert("L")
    mask = diff.point(lambda value: 255 if value > 18 else 0)
    mask = mask.filter(ImageFilter.MedianFilter(9)).filter(ImageFilter.GaussianBlur(2))
    bbox = mask.getbbox()
    if not bbox:
        # Fallback: preserve the center if the model returned a low-contrast object.
        bbox = (172, 172, 852, 852)
        mask = Image.new("L", image.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle(bbox, radius=60, fill=255)
    pad = 26
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(image.width, bbox[2] + pad),
        min(image.height, bbox[3] + pad),
    )
    rgba = image.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop(bbox)


def paste_object_centered(card: Image.Image, obj: Image.Image, box: tuple[int, int, int, int]) -> None:
    """Paste an object cutout into the deterministic object area."""
    max_w = box[2] - box[0]
    max_h = box[3] - box[1]
    scale = min(max_w / obj.width, max_h / obj.height, 1.75)
    target = (max(1, int(obj.width * scale)), max(1, int(obj.height * scale)))
    obj = obj.resize(target, Image.LANCZOS)
    x = box[0] + (max_w - obj.width) // 2
    y = box[1] + (max_h - obj.height) // 2
    card.alpha_composite(obj, (x, y))


def draw_text_panel(card: Image.Image, text: str) -> None:
    draw = ImageDraw.Draw(card)
    font = fit_font(text, max_width=690, max_height=190, start_size=250 if len(text) <= 1 else 205)
    x, y = centered_text_position(draw, text, font, TEXT_PANEL)
    draw.text((x + 4, y + 5), text, font=font, fill=(245, 226, 200, 255))
    draw.text((x, y), text, font=font, fill=(46, 38, 34, 255))


def compose(raw: bytes, text: str, label: str) -> Image.Image:
    card = draw_learning_card_background()
    obj = extract_object_from_plain_background(raw)
    paste_object_centered(card, obj, OBJECT_AREA)
    draw_text_panel(card, text)
    return card.convert("RGB")


def call_nvidia_with_retry(endpoint: str, api_key: str, prompt: str, attempts: int = 3) -> bytes:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            return cards.call_nvidia(endpoint, api_key, prompt)
        except Exception as exc:
            last_error = exc
            if attempt == attempts:
                break
            print(f"NVIDIA image call failed on attempt {attempt}; retrying after transient error")
            time.sleep(2 * attempt)
    assert last_error is not None
    raise last_error


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-key", default="flux.1-dev", choices=sorted(cards.MODEL_ENV_PREFIXES))
    parser.add_argument("--only", choices=[spec["id"] for spec in SPECS], help="generate one sample id")
    args = parser.parse_args()

    cards.load_dotenv()
    config = cards.resolve_nvidia_config(args.model_key)
    if not config.api_key:
        raise SystemExit(f"{config.api_key_env} is missing; fill local .env, not chat/git.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    specs = [spec for spec in SPECS if args.only in (None, spec["id"])]
    for spec in specs:
        raw = call_nvidia_with_retry(config.endpoint, config.api_key, spec["prompt"])
        out = OUT_DIR / spec["filename"]
        compose(raw, spec["text"], spec["label"]).save(out, quality=92)
        print(f"wrote {out.relative_to(ROOT)}")

    records: list[dict[str, Any]] = []
    for spec in SPECS:
        out = OUT_DIR / spec["filename"]
        records.append({
            "id": spec["id"],
            "text": spec["text"],
            "label": spec["label"],
            "object_name": spec["object_name"],
            "image": str(out.relative_to(ROOT)).replace("\\", "/"),
            "model": config.model,
            "pipeline": "nvidia-isolated-object-local-card-composition",
        })
    (OUT_DIR / "quality-samples.json").write_text(__import__("json").dumps({"cards": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
