from __future__ import annotations

import json
import shutil
from pathlib import Path


PROJECT = Path("/home/ubuntu/hong-kong-chinese-word-library")
UPLOAD_DIR = Path("/home/ubuntu/upload")
AUDIT_PATH = PROJECT / "exports/42張家長字卡_地圖對應稽核.json"
OUTPUT_DIR = Path("/home/ubuntu/webdev-static-assets/parent-topic-cards-ascii")
MANIFEST_PATH = Path("/home/ubuntu/parent_topic_card_ascii_manifest.json")


def main() -> None:
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, str]] = {}
    for item in audit["maps"]:
        source = UPLOAD_DIR / item["cardFile"]
        destination = OUTPUT_DIR / f"{item['mapId']}.png"
        shutil.copyfile(source, destination)
        manifest[item["mapId"]] = {
            "sourceFile": item["cardFile"],
            "stagedFile": str(destination),
            "topic": item["topic"],
            "level": item["level"],
        }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"stagedCount": len(manifest), "outputDir": str(OUTPUT_DIR)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
