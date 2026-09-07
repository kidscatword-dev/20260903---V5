from __future__ import annotations

import json
import re
from pathlib import Path


MANIFEST_PATH = Path("/home/ubuntu/direct_replacement_word_audio_manifest.json")
UPLOADS_PATH = Path("/home/ubuntu/direct_replacement_word_audio_uploads.txt")
AUDIO_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/client/src/data/topicAudioV2.ts")
AUDIT_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/exports/書面語替換_逐詞音檔修正紀錄.json")


def uploaded_urls() -> dict[str, str]:
    upload_text = UPLOADS_PATH.read_text(encoding="utf-8")
    pairs = re.findall(
        r"Uploading file \(webdev private\): .*/([^/\n]+) \(size: \d+ bytes\)\n"
        r"File uploaded successfully!\nStorage Path: ([^\n]+)",
        upload_text,
    )
    return {filename: url for filename, url in pairs}


def parse_entries(audio_text: str) -> dict[str, dict[str, str]]:
    matches = re.findall(
        r'^\s*"(.+)": \{ cantonese: "([^"]+)", mandarin: "([^"]+)" \},$',
        audio_text,
        re.MULTILINE,
    )
    return {term: {"cantonese": cantonese, "mandarin": mandarin} for term, cantonese, mandarin in matches}


def render_entries(entries: dict[str, dict[str, str]]) -> str:
    lines = [
        "/** 1,260 詞的固定粵語與普通話讀音映射。 */",
        "export type TopicAudio = { cantonese: string; mandarin: string };",
        "",
        "const topicAudioV2: Record<string, TopicAudio> = {",
    ]
    lines.extend(
        f'  "{term}": {{ cantonese: "{audio["cantonese"]}", mandarin: "{audio["mandarin"]}" }},'
        for term, audio in sorted(entries.items())
    )
    lines.extend(["};", "", "export default topicAudioV2;", ""])
    return "\n".join(lines)


def main() -> None:
    local_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    urls = uploaded_urls()
    if len(urls) != 214:
        raise RuntimeError(f"預期 214 個上傳音檔，實際為 {len(urls)} 個。")
    direct_audio = {
        term: {language: urls[Path(path).name] for language, path in audio.items()}
        for term, audio in local_manifest.items()
    }
    entries = parse_entries(AUDIO_PATH.read_text(encoding="utf-8"))
    affected_new_terms = sorted(term for term in direct_audio if term != "士多啤梨")
    missing_terms = sorted(set(affected_new_terms) - set(entries))
    if missing_terms:
        raise RuntimeError(f"詞庫音檔映射缺少新詞：{missing_terms}")
    for term in affected_new_terms:
        entries[term] = direct_audio[term]

    if "草莓" not in entries:
        raise RuntimeError("找不到「草莓」音檔映射。")
    entries["草莓"]["cantonese"] = direct_audio["士多啤梨"]["cantonese"]
    AUDIO_PATH.write_text(render_entries(entries), encoding="utf-8")
    AUDIT_PATH.write_text(json.dumps({
        "replacedNewTerms": affected_new_terms,
        "replacedNewTermCount": len(affected_new_terms),
        "strawberryCantonese": direct_audio["士多啤梨"]["cantonese"],
        "reason": "撤回批次切分 WAV；所有本輪新詞改用逐詞直接生成的 MP3，並改正士多啤梨的粵語讀音。",
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "replacedNewTermCount": len(affected_new_terms),
        "strawberryCantonese": entries["草莓"]["cantonese"],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
