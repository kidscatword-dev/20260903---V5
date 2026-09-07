from pathlib import Path

from PIL import Image, ImageDraw


PROJECT = Path(__file__).resolve().parents[1]
SOURCE = Path("/home/ubuntu/webdev-static-assets/reading-cat-mascot.png")
RES = PROJECT / "android/app/src/main/res"
DELIVERABLES = Path("/home/ubuntu/word-library-deliverables/google-play")

ICON_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FOREGROUND_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def scaled_fit(image: Image.Image, limit: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((limit, limit), Image.Resampling.LANCZOS)
    return result


def centered(canvas: Image.Image, image: Image.Image) -> None:
    x = (canvas.width - image.width) // 2
    y = (canvas.height - image.height) // 2
    canvas.alpha_composite(image, (x, y))


def make_icon(cat: Image.Image, size: int) -> Image.Image:
    icon = Image.new("RGBA", (size, size), "#FFFDF8")
    draw = ImageDraw.Draw(icon)
    inset = max(1, size // 24)
    draw.rounded_rectangle((inset, inset, size - inset, size - inset), radius=round(size * 0.18), outline="#F2C66E", width=max(1, size // 42))
    centered(icon, scaled_fit(cat, round(size * 0.72)))
    return icon


def make_foreground(cat: Image.Image, size: int) -> Image.Image:
    foreground = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    centered(foreground, scaled_fit(cat, round(size * 0.62)))
    return foreground


def main() -> None:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"Missing source mascot: {SOURCE}")

    cat = Image.open(SOURCE).convert("RGBA")
    for folder, size in ICON_SIZES.items():
        target_dir = RES / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        icon = make_icon(cat, size)
        icon.save(target_dir / "ic_launcher.png", optimize=True)
        icon.save(target_dir / "ic_launcher_round.png", optimize=True)

    for folder, size in FOREGROUND_SIZES.items():
        target_dir = RES / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        make_foreground(cat, size).save(target_dir / "ic_launcher_foreground.png", optimize=True)

    DELIVERABLES.mkdir(parents=True, exist_ok=True)
    make_icon(cat, 512).convert("RGB").save(DELIVERABLES / "繁體認字樂_GooglePlay圖示_512.png", optimize=True)


if __name__ == "__main__":
    main()
