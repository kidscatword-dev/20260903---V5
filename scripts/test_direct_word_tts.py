from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts


OUTPUT_DIR = Path("/home/ubuntu/webdev-static-assets/direct-word-tts-test")
TERMS = ("妒忌", "士多啤梨")
VOICES = {
    "cantonese": "zh-HK-HiuMaanNeural",
    "mandarin": "zh-CN-XiaoxiaoNeural",
}


async def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for term in TERMS:
        for language, voice in VOICES.items():
            destination = OUTPUT_DIR / f"{term}-{language}.mp3"
            communicate = edge_tts.Communicate(text=term, voice=voice)
            await communicate.save(str(destination))
            print(destination)


if __name__ == "__main__":
    asyncio.run(main())
