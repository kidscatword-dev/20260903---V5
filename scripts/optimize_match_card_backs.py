from pathlib import Path

from PIL import Image


SOURCE_DIR = Path("/home/ubuntu/webdev-static-assets/match-card-backs")
TARGET_WIDTH = 512


def optimize(source_name: str, output_name: str) -> None:
    source = SOURCE_DIR / source_name
    output = SOURCE_DIR / output_name
    with Image.open(source) as original:
        image = original.convert("RGB")
        if image.width > TARGET_WIDTH:
            height = round(image.height * TARGET_WIDTH / image.width)
            image = image.resize((TARGET_WIDTH, height), Image.Resampling.LANCZOS)
        image.save(output, "WEBP", quality=82, method=6)
        print(f"{output.name}: {image.width}x{image.height}")


def main() -> None:
    optimize("match-card-back-cat.png", "match-card-back-cat-optimized.webp")
    optimize("match-card-back-cat2.png", "match-card-back-cat2-optimized.webp")


if __name__ == "__main__":
    main()
