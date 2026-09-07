from __future__ import annotations

import json
import sys
from pathlib import Path
from statistics import median

from PIL import Image


def find_grid_lines(image: Image.Image, axis: str) -> list[int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    scan_length = height if axis == "x" else width
    positions: list[int] = []
    for coordinate in range(width if axis == "x" else height):
        matching = 0
        for other in range(scan_length):
            r, g, b = rgb.getpixel((coordinate, other) if axis == "x" else (other, coordinate))
            if max(r, g, b) - min(r, g, b) <= 12 and 145 <= r <= 240:
                matching += 1
        if matching >= scan_length * 0.62:
            positions.append(coordinate)
    clusters: list[list[int]] = []
    for position in positions:
        if not clusters or position > clusters[-1][-1] + 1:
            clusters.append([position])
        else:
            clusters[-1].append(position)
    return [round(sum(cluster) / len(cluster)) for cluster in clusters]


def main() -> None:
    if len(sys.argv) != 5:
        raise SystemExit("Usage: split_grid_with_terms.py INPUT_IMAGE TERMS_JSON OUTPUT_DIRECTORY PREFIX")
    source = Path(sys.argv[1])
    term_file = Path(sys.argv[2])
    output_dir = Path(sys.argv[3])
    prefix = sys.argv[4]

    terms = json.loads(term_file.read_text(encoding="utf-8"))
    if len(terms) != 25:
        raise RuntimeError(f"Expected exactly 25 terms, found {len(terms)}")
    image = Image.open(source).convert("RGBA")
    x_lines = find_grid_lines(image, "x")
    y_lines = find_grid_lines(image, "y")
    def extend_grid_edges(lines: list[int]) -> list[int]:
        spacing = round(median([b - a for a, b in zip(lines, lines[1:])]))
        if len(lines) == 4:
            return [lines[0] - spacing, *lines, lines[-1] + spacing]
        if len(lines) == 5:
            return [*lines, lines[-1] + spacing]
        return lines

    x_boundaries = extend_grid_edges(x_lines)
    if len(y_lines) == 10:
        row_edges = list(zip(y_lines[::2], y_lines[1::2]))
    else:
        y_boundaries = extend_grid_edges(y_lines)
        row_edges = list(zip(y_boundaries, y_boundaries[1:]))
    row_heights = [bottom - top for top, bottom in row_edges]
    if (
        len(row_edges) == 5
        and len(x_boundaries) == 6
        and max(row_heights) > min(row_heights) * 1.35
        and abs(image.size[0] - image.size[1]) <= 2
    ):
        row_edges = list(zip(x_boundaries, x_boundaries[1:]))
    if len(x_boundaries) != 6 or len(row_edges) != 5:
        raise RuntimeError(f"Expected 6 column boundaries and 5 row boxes, found x={x_lines}, y={y_lines}")
    output_dir.mkdir(parents=True, exist_ok=True)
    items = []
    for index, term in enumerate(terms):
        row, column = divmod(index, 5)
        top, bottom = row_edges[row]
        padding = 5
        crop = (x_boundaries[column] + padding, top + padding, x_boundaries[column + 1] - padding, bottom - padding)
        filename = f"{prefix}-{index + 1:02d}.png"
        destination = output_dir / filename
        image.crop(crop).save(destination, "PNG", optimize=True)
        items.append({"index": index + 1, "term": term, "filename": filename, "crop": crop, "size": list(image.crop(crop).size)})
    (output_dir / "manifest.json").write_text(json.dumps({"source": source.name, "sourceSize": list(image.size), "gridLines": {"x": x_boundaries, "rowEdges": row_edges}, "items": items}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"items": len(items), "sourceSize": image.size, "xLines": x_boundaries, "yLines": y_lines}, ensure_ascii=False))


if __name__ == "__main__":
    main()
