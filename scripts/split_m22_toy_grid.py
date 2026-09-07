from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


X_BOUNDARIES = [50, 436, 832, 1217, 1606, 1995]
Y_BOUNDARIES = [48, 435, 826, 1216, 1608, 1995]
PADDING = 5


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: split_m22_toy_grid.py INPUT_IMAGE TERMS_JSON OUTPUT_DIRECTORY")
    source = Path(sys.argv[1])
    terms = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    output_dir = Path(sys.argv[3])
    if len(terms) != 25:
        raise RuntimeError(f"Expected 25 terms, found {len(terms)}")

    image = Image.open(source).convert("RGBA")
    if image.size != (2048, 2048):
        raise RuntimeError(f"Expected a 2048×2048 M22 grid, found {image.size}")

    output_dir.mkdir(parents=True, exist_ok=True)
    items = []
    for index, term in enumerate(terms):
        row, column = divmod(index, 5)
        crop = (
            X_BOUNDARIES[column] + PADDING,
            Y_BOUNDARIES[row] + PADDING,
            X_BOUNDARIES[column + 1] - PADDING,
            Y_BOUNDARIES[row + 1] - PADDING,
        )
        filename = f"m22-toy-{index + 1:02d}.png"
        destination = output_dir / filename
        cropped = image.crop(crop)
        cropped.save(destination, "PNG", optimize=True)
        items.append({"index": index + 1, "term": term, "filename": filename, "crop": crop, "size": list(cropped.size)})

    manifest = {
        "source": source.name,
        "sourceSize": list(image.size),
        "gridLines": {"x": X_BOUNDARIES, "y": Y_BOUNDARIES},
        "items": items,
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"items": len(items), "sourceSize": image.size, "xLines": X_BOUNDARIES, "yLines": Y_BOUNDARIES, "minCropSize": min(min(item["size"]) for item in items)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
