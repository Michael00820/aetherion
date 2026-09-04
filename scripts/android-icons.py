#!/usr/bin/env python3
"""Paint Aetherion launcher, splash, and Play Console graphics."""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace")
RES = ROOT / "android" / "app" / "src" / "main" / "res"
PLAY = ROOT / "play"
BG = (20, 17, 12, 255)
GOLD = (201, 162, 39, 255)
GOLD_SOFT = (228, 197, 106, 255)
INK = (243, 234, 215, 255)


def disc(size: int, pad_ratio: float = 0.18) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = size * pad_ratio
    cx = cy = size / 2
    r_out = size / 2 - pad
    width = max(2, int(size * 0.055))
    for r, col, w in (
        (r_out, GOLD, width),
        (r_out * 0.62, GOLD_SOFT, max(2, int(width * 0.85))),
    ):
        box = [cx - r, cy - r, cx + r, cy + r]
        d.ellipse(box, outline=col, width=w)
    core = r_out * 0.22
    d.ellipse([cx - core, cy - core, cx + core, cy + core], fill=GOLD)
    # crescent
    d.arc(
        [cx + r_out * 0.08, cy - r_out * 0.78, cx + r_out * 0.92, cy + r_out * 0.08],
        start=200,
        end=50,
        fill=GOLD_SOFT,
        width=max(2, int(width * 0.7)),
    )
    return img


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG")


def launcher_set() -> None:
    densities = {
        "mdpi": 48,
        "hdpi": 72,
        "xhdpi": 96,
        "xxhdpi": 144,
        "xxxhdpi": 192,
    }
    fg_densities = {
        "mdpi": 108,
        "hdpi": 162,
        "xhdpi": 216,
        "xxhdpi": 324,
        "xxxhdpi": 432,
    }
    for name, px in densities.items():
        icon = Image.new("RGBA", (px, px), BG)
        sig = disc(px, pad_ratio=0.16)
        icon.alpha_composite(sig)
        folder = RES / f"mipmap-{name}"
        save_png(icon, folder / "ic_launcher.png")
        save_png(icon, folder / "ic_launcher_round.png")
    for name, px in fg_densities.items():
        fg = disc(px, pad_ratio=0.22)
        save_png(fg, RES / f"mipmap-{name}" / "ic_launcher_foreground.png")

    bg_xml = RES / "drawable" / "ic_launcher_background.xml"
    bg_xml.write_text(
        """<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="#14110C" />
</shape>
"""
    )
    (RES / "values" / "ic_launcher_background.xml").write_text(
        """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#14110C</color>
</resources>
"""
    )
    adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""
    (RES / "mipmap-anydpi-v26" / "ic_launcher.xml").write_text(adaptive)
    (RES / "mipmap-anydpi-v26" / "ic_launcher_round.xml").write_text(adaptive)


def splash_set() -> None:
    specs = {
        "drawable-port-mdpi": (320, 480),
        "drawable-port-hdpi": (480, 800),
        "drawable-port-xhdpi": (720, 1280),
        "drawable-port-xxhdpi": (1080, 1920),
        "drawable-port-xxxhdpi": (1440, 2560),
        "drawable-land-mdpi": (480, 320),
        "drawable-land-hdpi": (800, 480),
        "drawable-land-xhdpi": (1280, 720),
        "drawable-land-xxhdpi": (1920, 1080),
        "drawable-land-xxxhdpi": (2560, 1440),
        "drawable": (1080, 1920),
    }
    for folder, (w, h) in specs.items():
        img = Image.new("RGBA", (w, h), BG)
        s = int(min(w, h) * 0.38)
        sig = disc(s, pad_ratio=0.14)
        x = (w - s) // 2
        y = (h - s) // 2
        img.alpha_composite(sig, (x, y))
        save_png(img, RES / folder / "splash.png")


def play_set() -> None:
    PLAY.mkdir(parents=True, exist_ok=True)
    icon = Image.new("RGBA", (512, 512), BG)
    icon.alpha_composite(disc(512, pad_ratio=0.14))
    save_png(icon, PLAY / "icon-512.png")

    feat = Image.new("RGBA", (1024, 500), BG)
    d = ImageDraw.Draw(feat)
    # wash
    for i in range(220):
        a = int(28 * (1 - i / 220))
        d.ellipse([420 - i, -80 - i / 2, 980 + i, 420 + i], outline=(201, 162, 39, a))
    sig = disc(280, pad_ratio=0.16)
    feat.alpha_composite(sig, (70, 110))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 72)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    except OSError:
        font = ImageFont.load_default()
        small = font
    d.text((390, 168), "AETHERION", fill=INK, font=font)
    d.text((390, 268), "Observatory of Ethiopian time", fill=GOLD_SOFT, font=small)
    save_png(feat, PLAY / "feature-graphic.png")


def main() -> None:
    launcher_set()
    splash_set()
    play_set()
    print("android icons + play graphics written")


if __name__ == "__main__":
    main()
