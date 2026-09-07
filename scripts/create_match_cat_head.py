from pathlib import Path

from PIL import Image


SOURCE = Path("/home/ubuntu/webdev-static-assets/match-card-backs/match-card-back-cat-optimized.webp")
OUTPUT = Path("/home/ubuntu/webdev-static-assets/match-card-backs/match-game-cat-head.webp")


def main() -> None:
    with Image.open(SOURCE) as original:
        image = original.convert("RGB")
        # Source is the user's 512×523 cat card-back. This square preserves the face and ears
        # without reinterpreting, extending, or changing any illustrated content.
        head = image.crop((86, 8, 426, 348)).resize((256, 256), Image.Resampling.LANCZOS)
        head.save(OUTPUT, "WEBP", quality=84, method=6)
        print(f"{OUTPUT.name}: {head.width}x{head.height}")


if __name__ == "__main__":
    main()
