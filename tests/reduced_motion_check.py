from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


def test_reduced_motion_media_query_exists():
    assert "@media (prefers-reduced-motion: reduce)" in CSS


def test_reduced_motion_disables_key_loops():
    mi = CSS.index("prefers-reduced-motion")
    block = CSS[mi:mi + 1400]
    for sel in ["mob-hammer", "mob-float", ".scene .tw", "review-card", "has-scene"]:
        assert sel in block, sel
    assert "animation:none" in block.replace(" ", "")
