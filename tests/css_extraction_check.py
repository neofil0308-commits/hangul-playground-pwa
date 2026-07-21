from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SW = (ROOT / "sw.js").read_text(encoding="utf-8")


def test_index_uses_external_stylesheet_instead_of_inline_style_block():
    assert '<link rel="stylesheet" href="styles.css">' in HTML
    assert "<style>" not in HTML
    assert "</style>" not in HTML


def test_stylesheet_file_contains_existing_app_styles():
    css_path = ROOT / "styles.css"
    assert css_path.exists()
    css = css_path.read_text(encoding="utf-8")
    assert ":root" in css
    assert ".story-world" in css
    assert ".hani-reaction" in css
    assert "@media (display-mode:standalone)" in css


def test_service_worker_precaches_external_stylesheet_with_new_cache_version():
    assert "./styles.css" in SW
    assert "hangul-playground-v81" in SW
