from __future__ import annotations

import json
import re
from pathlib import Path


MANIFEST_PATH = Path("/home/ubuntu/parent_topic_card_ascii_manifest.json")
UPLOADS_PATH = Path("/home/ubuntu/parent_topic_card_ascii_uploads.txt")
OUTPUT_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/client/src/lib/tenLevelCardArt.ts")


def read_upload_urls() -> dict[str, str]:
    content = UPLOADS_PATH.read_text(encoding="utf-8")
    pairs = re.findall(
        r"Uploading file \(webdev private\): .*/(M\d{2})\.png \(size: \d+ bytes\)\n"
        r"File uploaded successfully!\nStorage Path: ([^\n]+)",
        content,
    )
    urls = {map_id: url for map_id, url in pairs}
    if len(urls) != 42:
        raise RuntimeError(f"預期 42 張上傳卡片，實際讀取到 {len(urls)} 張。")
    return urls


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    urls = read_upload_urls()
    if set(manifest) != set(urls):
        raise RuntimeError("上傳資產與地圖清單不一致。")
    sources = "\n".join(
        f'  {map_id}: {{ src: "{urls[map_id]}", title: "{manifest[map_id]["topic"]}" }},'
        for map_id in sorted(manifest)
    )
    code = f'''import type {{ TenLevelTopic }} from "@/data/tenLevelCatalog";

export type TopicCardArt = {{
  src: string;
  offset: string;
  sliceIndex: 0 | 1 | 2;
  levelLabel: string;
  title: string;
  isStandalone?: boolean;
}};

/**
 * 42 張十級地圖均使用家長提供、已按 M01–M42 稽核的獨立直向原卡。
 * 卡片正面與真實拼圖均從同一張正確原圖顯示，不再回退至舊三級主題素材。
 */
const parentCardSources: Record<string, {{ src: string; title: string }}> = {{
{sources}
}};

export const getTenLevelCardArt = (topic: Pick<TenLevelTopic, "id"> & Partial<Pick<TenLevelTopic, "level" | "label">>): TopicCardArt | null => {{
  const source = parentCardSources[topic.id];
  if (!source) return null;
  const levelLabel = topic.level ? `第 ${{topic.level}} 級` : "十級地圖";
  return {{
    src: source.src,
    offset: "0%",
    sliceIndex: 0,
    levelLabel,
    title: `${{levelLabel}}・${{source.title}}字卡`,
    isStandalone: true,
  }};
}};
'''
    OUTPUT_PATH.write_text(code, encoding="utf-8")
    print(json.dumps({"mappedCardCount": len(manifest), "output": str(OUTPUT_PATH)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
