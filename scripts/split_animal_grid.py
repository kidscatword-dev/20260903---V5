from __future__ import annotations

import json
from statistics import median
import sys
from pathlib import Path

from PIL import Image


TERMS = [
    "企鵝", "兔子", "八爪魚", "大象", "小狗",
    "幼貓", "小魚", "小鳥", "斑馬", "鵝",
    "松鼠", "河馬", "海星", "海豚", "牛",
    "狐狸", "狼", "猴子", "獅子", "章魚",
    "羊", "老虎", "蛇", "袋鼠", "金魚",
]
SLUGS = [
    "penguin", "rabbit", "octopus-purple", "elephant", "dog",
    "kitten", "small-fish", "bird", "zebra", "goose",
    "squirrel", "hippo", "starfish", "dolphin", "cow",
    "fox", "wolf", "monkey", "lion", "octopus-orange",
    "sheep", "tiger", "snake", "kangaroo", "goldfish",
]


def find_grid_lines(image: Image.Image, axis: str) -> list[int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    scan_length = height if axis == "x" else width
    positions: list[int] = []
    for coordinate in range(width if axis == "x" else height):
        matching = 0
        for other in range(scan_length):
            r, g, b = rgb.getpixel((coordinate, other) if axis == "x" else (other, coordinate))
            if max(r, g, b) - min(r, g, b) <= 10 and 150 <= r <= 235:
                matching += 1
        if matching >= scan_length * 0.68:
            positions.append(coordinate)

    clusters: list[list[int]] = []
    for position in positions:
        if not clusters or position > clusters[-1][-1] + 1:
            clusters.append([position])
        else:
            clusters[-1].append(position)
    return [round(sum(cluster) / len(cluster)) for cluster in clusters]


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: split_animal_grid.py INPUT_IMAGE OUTPUT_DIRECTORY")

    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    output.mkdir(parents=True, exist_ok=True)
    image = Image.open(source).convert("RGBA")
    x_lines = find_grid_lines(image, "x")
    y_lines = find_grid_lines(image, "y")
    if len(x_lines) == 5:
        x_lines.append(round(x_lines[-1] + median([b - a for a, b in zip(x_lines, x_lines[1:])])) )
    if len(x_lines) != 6 or len(y_lines) != 10:
        raise RuntimeError(f"Expected 6 vertical and 10 horizontal panel edges, found x={x_lines}, y={y_lines}")
    row_edges = list(zip(y_lines[::2], y_lines[1::2]))

    manifest = []
    padding = 5
    for index, (term, slug) in enumerate(zip(TERMS, SLUGS)):
        row, column = divmod(index, 5)
        row_top, row_bottom = row_edges[row]
        box = (
            x_lines[column] + padding,
            row_top + padding,
            x_lines[column + 1] - padding,
            row_bottom - padding,
        )
        filename = f"animal-{index + 1:02d}-{slug}.png"
        destination = output / filename
        image.crop(box).save(destination, "PNG", optimize=True)
        manifest.append({
            "index": index + 1,
            "term": term,
            "slug": slug,
            "filename": filename,
            "crop": box,
            "size": list(image.crop(box).size),
        })

    (output / "manifest.json").write_text(json.dumps({
        "source": source.name,
        "sourceSize": list(image.size),
        "gridLines": {"x": x_lines, "rowEdges": row_edges},
        "items": manifest,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"sourceSize": image.size, "xLines": x_lines, "yLines": y_lines, "items": len(manifest)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
