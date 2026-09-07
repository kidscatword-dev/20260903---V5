from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


PLAN_PATH = Path("/home/ubuntu/written_replacement_audio_plan.json")
AUDIO_ROOT = Path("/home/ubuntu/webdev-static-assets")
SILENCE_ROOT = AUDIO_ROOT / "written-replacements-silence"
OUTPUT_ROOT = AUDIO_ROOT / "written-replacement-word-audio"
MANIFEST_PATH = Path("/home/ubuntu/written_replacement_audio_manifest.json")
CANONICAL_TERM = {"涂改帶": "塗改帶"}
SPECIAL_BATCHES = [
    ("06a", ["責任心", "轉播", "進貢", "針葉林", "鉛筆盒"]),
    ("06b", ["錄音機", "降水", "隔離", "電子書", "頭骨"]),
    ("06c", ["飛魚", "魟魚", "魷魚", "鵝", "鸚鵡魚"]),
]


def duration_seconds(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def pause_bounds(log_path: Path, source_duration: float) -> list[tuple[float, float]]:
    log_text = log_path.read_text(encoding="utf-8", errors="replace")
    starts = [float(value) for value in re.findall(r"silence_start: ([0-9.]+)", log_text)]
    ends = [float(value) for value in re.findall(r"silence_end: ([0-9.]+)", log_text)]
    if len(starts) != len(ends):
        raise RuntimeError(f"無法配對停頓：{log_path.name}")
    return [
        (start, end)
        for start, end in zip(starts, ends)
        if start > 0.1 and end < source_duration - 0.1
    ]


def export_clip(source: Path, destination: Path, start: float, end: float) -> None:
    duration = max(end - start, 0.1)
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-ss", f"{start:.3f}", "-i", str(source), "-t", f"{duration:.3f}",
            "-af", "afade=t=in:st=0:d=0.02,afade=t=out:st=0.02:d=0.03",
            "-ar", "24000", "-ac", "1", str(destination),
        ],
        check=True,
    )


def main() -> None:
    plan = json.loads(PLAN_PATH.read_text(encoding="utf-8"))
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, str]] = {}

    for language, batch_key in (("cantonese", "cantoneseBatches"), ("mandarin", "mandarinBatches")):
        standard_batches = [(f"{batch_index:02d}", terms) for batch_index, terms in enumerate(plan[batch_key][:5], start=1)]
        for batch_label, raw_terms in standard_batches + SPECIAL_BATCHES:
            source = AUDIO_ROOT / f"written-replacements-{language}-batch-{batch_label}.wav"
            log_path = SILENCE_ROOT / f"written-replacements-{language}-batch-{batch_label}.log"
            pauses = pause_bounds(log_path, duration_seconds(source))
            if len(pauses) != len(raw_terms) - 1:
                raise RuntimeError(
                    f"{source.name} 偵測到 {len(pauses)} 個停頓，但需要 {len(raw_terms) - 1} 個。"
                )
            boundaries = [(0.0, pauses[0][0])]
            boundaries.extend((pauses[index - 1][1], pauses[index][0]) for index in range(1, len(pauses)))
            boundaries.append((pauses[-1][1], duration_seconds(source)))
            for term_index, (raw_term, (start, end)) in enumerate(zip(raw_terms, boundaries), start=1):
                term = CANONICAL_TERM.get(raw_term, raw_term)
                clip_name = f"{language}-b{batch_label}-w{term_index:02d}.wav"
                destination = OUTPUT_ROOT / clip_name
                export_clip(source, destination, start, end)
                manifest.setdefault(term, {})[language] = str(destination)

    incomplete = {term: languages for term, languages in manifest.items() if set(languages) != {"cantonese", "mandarin"}}
    if incomplete:
        raise RuntimeError(f"讀音清單不完整：{incomplete}")
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"wordCount": len(manifest), "outputDir": str(OUTPUT_ROOT)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
