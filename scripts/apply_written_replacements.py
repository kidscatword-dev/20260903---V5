from __future__ import annotations

import json
import re
from pathlib import Path


PLAN_PATH = Path("/home/ubuntu/written_replacement_audio_plan.json")
LOCAL_MANIFEST_PATH = Path("/home/ubuntu/written_replacement_audio_manifest.json")
UPLOADS_PATH = Path("/home/ubuntu/written_replacement_audio_uploads.txt")
TERMS_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/client/src/data/termsV2.json")
AUDIO_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/client/src/data/topicAudioV2.ts")
AUDIT_PATH = Path("/home/ubuntu/hong-kong-chinese-word-library/exports/書面語建議替換_套用紀錄.json")
CANONICAL_TERM = {"涂改帶": "塗改帶"}
SPECIAL_GENERATED_AUDIO = {
    "團拜": {
        "cantonese": "/manus-storage/cantonese-tuanbai_bab5670d.wav",
        "mandarin": "/manus-storage/mandarin-tuanbai_2959d199.wav",
    }
}


def upload_urls_by_filename() -> dict[str, str]:
    upload_text = UPLOADS_PATH.read_text(encoding="utf-8")
    pairs = re.findall(
        r"Uploading file \(webdev private\): .*/([^/\n]+) \(size: \d+ bytes\)\n"
        r"File uploaded successfully!\nStorage Path: ([^\n]+)",
        upload_text,
    )
    return {filename: url for filename, url in pairs}


def parse_audio_entries(audio_text: str) -> dict[str, dict[str, str]]:
    matches = re.findall(
        r'^\s*"(.+)": \{ cantonese: "([^"]+)", mandarin: "([^"]+)" \},$',
        audio_text,
        re.MULTILINE,
    )
    if not matches:
        raise RuntimeError("找不到既有固定音檔映射。")
    return {
        term: {"cantonese": cantonese, "mandarin": mandarin}
        for term, cantonese, mandarin in matches
    }


def render_audio_entries(entries: dict[str, dict[str, str]]) -> str:
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
    plan = json.loads(PLAN_PATH.read_text(encoding="utf-8"))
    local_manifest = json.loads(LOCAL_MANIFEST_PATH.read_text(encoding="utf-8"))
    upload_urls = upload_urls_by_filename()
    if len(upload_urls) != 210:
        raise RuntimeError(f"預期 210 個上傳音檔，實際取得 {len(upload_urls)} 個。")

    generated_audio: dict[str, dict[str, str]] = {}
    for raw_term, local_audio in local_manifest.items():
        term = CANONICAL_TERM.get(raw_term, raw_term)
        generated_audio[term] = {
            language: upload_urls[Path(path).name] for language, path in local_audio.items()
        }
    generated_audio.update(SPECIAL_GENERATED_AUDIO)

    terms = json.loads(TERMS_PATH.read_text(encoding="utf-8"))
    by_position = {
        (entry["mapId"], entry["stage"], entry["stageOrder"]): entry
        for entry in terms
    }
    applied = []
    for replacement in plan["replacements"]:
        new_term = CANONICAL_TERM.get(replacement["new"], replacement["new"])
        key = (replacement["mapId"], replacement["stage"], replacement["stageOrder"])
        entry = by_position[key]
        original_term = entry["term"]
        entry["term"] = new_term
        entry["jyutping"] = replacement["jyutping"]
        entry["pinyin"] = replacement["pinyin"]
        entry["audioStatus"] = "ready"
        applied.append({
            "mapId": replacement["mapId"],
            "stage": replacement["stage"],
            "stageOrder": replacement["stageOrder"],
            "originalTerm": original_term,
            "spreadsheetTerm": replacement["old"],
            "replacementTerm": new_term,
            "audioSource": "generated" if new_term in generated_audio else "existing",
        })

    duplicate_terms = sorted(
        term for term, count in __import__("collections").Counter(entry["term"] for entry in terms).items() if count > 1
    )
    if duplicate_terms:
        raise RuntimeError(f"替換後存在重複詞語：{duplicate_terms}")
    TERMS_PATH.write_text(json.dumps(terms, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    audio_entries = parse_audio_entries(AUDIO_PATH.read_text(encoding="utf-8"))
    audio_entries.update(generated_audio)
    required_terms = {entry["term"] for entry in terms}
    missing_audio_terms = sorted(required_terms - set(audio_entries))
    if missing_audio_terms:
        raise RuntimeError(f"缺少固定音檔：{missing_audio_terms}")
    audio_entries = {term: audio_entries[term] for term in required_terms}
    AUDIO_PATH.write_text(render_audio_entries(audio_entries), encoding="utf-8")

    AUDIT_PATH.write_text(
        json.dumps(
            {
                "decision": "M35 的「互相」改為「團拜」，避免與 M18 的「團圓」及「團聚」重複。",
                "replacementCount": len(applied),
                "generatedAudioCount": len(generated_audio),
                "reusedAudioCount": len(applied) - len(generated_audio),
                "applied": applied,
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "replacementCount": len(applied),
        "generatedAudioCount": len(generated_audio),
        "duplicateTerms": duplicate_terms,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
