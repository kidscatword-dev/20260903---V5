from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def scan(image: Image.Image, axis: str) -> list[tuple[int, int]]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    limit = width if axis == "x" else height
    scan_length = height if axis == "x" else width
    scores: list[tuple[int, int]] = []
    for coordinate in range(limit):
        matches = 0
        for other in range(scan_length):
            r, g, b = rgb.getpixel((coordinate, other) if axis == "x" else (other, coordinate))
            if max(r, g, b) - min(r, g, b) <= 12 and 145 <= r <= 240:
                matches += 1
        scores.append((coordinate, matches))
    return scores


def clusters(scores: list[tuple[int, int]], threshold: int) -> list[tuple[int, int, int, int]]:
    selected = [item for item in scores if item[1] >= threshold]
    groups: list[list[tuple[int, int]]] = []
    for item in selected:
        if not groups or item[0] > groups[-1][-1][0] + 1:
            groups.append([item])
        else:
            groups[-1].append(item)
    return [(group[0][0], group[-1][0], max(group, key=lambda item: item[1])[0], max(item[1] for item in group)) for group in groups]


def main() -> None:
    image = Image.open(Path(sys.argv[1])).convert("RGBA")
    print({"size": image.size})
    for axis in ("x", "y"):
        scores = scan(image, axis)
        print(axis, {"top": sorted(scores, key=lambda item: item[1], reverse=True)[:20]})
        for threshold in (40, 80, 120, 160, 240, 360, 480):
            print(axis, threshold, clusters(scores, threshold))


if __name__ == "__main__":
    main()
