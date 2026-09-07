from pathlib import Path

from PIL import Image


SOURCES = {
    "01_首頁.png": Path("/home/ubuntu/screenshots/3000-iomj0749j38uy3a_2026-08-27_08-36-58_6282.webp"),
    "02_遊戲天地.png": Path("/home/ubuntu/screenshots/3000-iomj0749j38uy3a_2026-08-27_08-37-22_2327.webp"),
    "03_圖片文字配對.png": Path("/home/ubuntu/screenshots/3000-iomj0749j38uy3a_2026-08-27_08-37-37_3369.webp"),
}
OUTPUT = Path("/home/ubuntu/word-library-deliverables/google-play/screenshots")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, source in SOURCES.items():
        if not source.is_file():
            raise FileNotFoundError(source)
        image = Image.open(source).convert("RGB")
        crop_width = min(405, image.width)
        crop_height = min(720, image.height)
        left = (image.width - crop_width) // 2
        screenshot = image.crop((left, 0, left + crop_width, crop_height))
        screenshot.save(OUTPUT / name, optimize=True)
        print(f"{name}: {screenshot.width}x{screenshot.height}")


if __name__ == "__main__":
    main()
