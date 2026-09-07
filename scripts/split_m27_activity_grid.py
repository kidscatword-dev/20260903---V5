from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


X_BOUNDARIES = [0, 194, 387, 581, 775, 969]
Y_BOUNDARIES = [0, 187, 379, 572, 756, 937]
PADDING = 3


def count_non_white_pixels(image: Image.Image) -> int:
    return sum(1 for red, green, blue, _ in image.getdata() if min(red, green, blue) < 235)


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: split_m27_activity_grid.py INPUT_IMAGE CELLS_JSON OUTPUT_DIRECTORY")
    source = Path(sys.argv[1])
    cells = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    output_dir = Path(sys.argv[3])
    if len(cells) != 12 or len({item["term"] for item in cells}) != 12:
        raise RuntimeError("Expected 12 unique non-empty M27 activity cells")

    image = Image.open(source).convert("RGBA")
    if image.size != (969, 937):
        raise RuntimeError(f"Expected a 969×937 M27 grid, found {image.size}")

    output_dir.mkdir(parents=True, exist_ok=True)
    items = []
    for index, cell in enumerate(cells, start=1):
        row, column = cell["row"], cell["column"]
        crop = (
            X_BOUNDARIES[column] + PADDING,
            Y_BOUNDARIES[row] + PADDING,
            X_BOUNDARIES[column + 1] - PADDING,
            Y_BOUNDARIES[row + 1] - PADDING,
        )
        filename = f"m27-activity-{index:02d}.png"
        destination = output_dir / filename
        cropped = image.crop(crop)
        non_white_pixels = count_non_white_pixels(cropped)
        if non_white_pixels < 1_000:
            raise RuntimeError(f"Cell ({row + 1}, {column + 1}) for {cell['term']} is unexpectedly blank")
        cropped.save(destination, "PNG", optimize=True)
        items.append({
            "index": index,
            "term": cell["term"],
            "gridPosition": [row + 1, column + 1],
            "filename": filename,
            "crop": crop,
            "size": list(cropped.size),
            "nonWhitePixels": non_white_pixels,
        })

    manifest = {
        "source": source.name,
        "sourceSize": list(image.size),
        "gridLines": {"x": X_BOUNDARIES, "y": Y_BOUNDARIES},
        "items": items,
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"items": len(items), "minNonWhitePixels": min(item["nonWhitePixels"] for item in items), "minCropSize": min(min(item["size"]) for item in items)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
