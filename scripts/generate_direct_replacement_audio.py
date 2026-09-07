from __future__ import annotations

import asyncio
import hashlib
import json
from pathlib import Path

import edge_tts


PLAN_PATH = Path("/home/ubuntu/written_replacement_audio_plan.json")
OUTPUT_DIR = Path("/home/ubuntu/webdev-static-assets/direct-replacement-word-audio")
MANIFEST_PATH = Path("/home/ubuntu/direct_replacement_word_audio_manifest.json")
CANONICAL_TERM = {"涂改帶": "塗改帶"}
VOICES = {
    "cantonese": "zh-HK-HiuMaanNeural",
    "mandarin": "zh-CN-XiaoxiaoNeural",
}
CONCURRENCY = 3
RETRIES = 3


def safe_stem(term: str) -> str:
    return hashlib.sha256(term.encode("utf-8")).hexdigest()[:12]


async def create_clip(term: str, language: str, semaphore: asyncio.Semaphore) -> tuple[str, str, str]:
    destination = OUTPUT_DIR / f"{language}-{safe_stem(term)}.mp3"
    if destination.exists() and destination.stat().st_size > 1000:
        return term, language, str(destination)
    voice = VOICES[language]
    async with semaphore:
        for attempt in range(1, RETRIES + 1):
            try:
                communicator = edge_tts.Communicate(text=term, voice=voice)
                await communicator.save(str(destination))
                if destination.stat().st_size <= 1000:
                    raise RuntimeError("音檔太小")
                return term, language, str(destination)
            except Exception:
                destination.unlink(missing_ok=True)
                if attempt == RETRIES:
                    raise
                await asyncio.sleep(attempt * 1.5)
    raise RuntimeError("無法生成音檔")


async def main() -> None:
    plan = json.loads(PLAN_PATH.read_text(encoding="utf-8"))
    terms = {CANONICAL_TERM.get(term, term) for term in plan["newAudioTerms"]}
    terms.add("士多啤梨")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(CONCURRENCY)
    tasks = [
        create_clip(term, language, semaphore)
        for term in sorted(terms)
        for language in VOICES
    ]
    results = await asyncio.gather(*tasks)
    manifest: dict[str, dict[str, str]] = {}
    for term, language, path in results:
        manifest.setdefault(term, {})[language] = path
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"termCount": len(manifest), "audioFileCount": len(results)}, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
