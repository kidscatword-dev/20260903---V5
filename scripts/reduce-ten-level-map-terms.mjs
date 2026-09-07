import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const termsPath = resolve(projectRoot, "client/src/data/termsV2.json");
const audioPath = resolve(projectRoot, "client/src/data/topicAudioV2.ts");
const unihanPath = process.env.UNIHAN_IRG_SOURCES ?? "/tmp/unihan-strokes/Unihan_IRGSources.txt";
const apply = process.argv.includes("--apply");
const displayVariantAudioTerms = ["冰淇淋", "櫻桃"];

const parseStrokeMap = (source) => {
  const strokes = new Map();
  source.split("\n").forEach((line) => {
    const [codePoint, property, value] = line.split("\t");
    if (property !== "kTotalStrokes" || !value) return;
    const values = [...value.matchAll(/\d+/g)].map((match) => Number(match[0]));
    if (!values.length) return;
    strokes.set(String.fromCodePoint(Number.parseInt(codePoint.slice(2), 16)), Math.max(...values));
  });
  return strokes;
};

const parseTopicAudio = (source) => {
  const match = source.match(/const topicAudioV2: Record<string, TopicAudio> = (\{[\s\S]*\});\s*export default topicAudioV2;/);
  if (!match) throw new Error("無法讀取 topicAudioV2 映射。");
  return Function(`"use strict"; return (${match[1]});`)();
};

const formatAudio = (audio) => [
  "export type TopicAudio = { cantonese: string; mandarin: string };",
  "",
  "const topicAudioV2: Record<string, TopicAudio> = {",
  ...Object.entries(audio).sort(([left], [right]) => left.localeCompare(right, "zh-Hant")).map(([term, clips]) => `  ${JSON.stringify(term)}: { cantonese: ${JSON.stringify(clips.cantonese)}, mandarin: ${JSON.stringify(clips.mandarin)} },`),
  "};",
  "",
  "export default topicAudioV2;",
  "",
].join("\n");

const [terms, audioSource, unihanSource] = await Promise.all([
  readFile(termsPath, "utf8").then(JSON.parse),
  readFile(audioPath, "utf8"),
  readFile(unihanPath, "utf8"),
]);
const strokeMap = parseStrokeMap(unihanSource);
const sourceAudio = parseTopicAudio(audioSource);
const maps = new Map();
terms.forEach((term) => maps.set(term.mapId, [...(maps.get(term.mapId) ?? []), term]));

if (maps.size !== 42) {
  throw new Error("輸入詞庫必須包含 42 張地圖。");
}

if ([...maps.values()].every((items) => items.length === 25)) {
  const preservedAudio = Object.fromEntries([...terms.map((term) => term.term), ...displayVariantAudioTerms].map((term) => {
    const clips = sourceAudio[term];
    if (!clips?.cantonese || !clips?.mandarin) throw new Error(`缺少「${term}」的固定雙語音檔。`);
    return [term, clips];
  }));
  if (apply) await writeFile(audioPath, formatAudio(preservedAudio), "utf8");
  console.log(JSON.stringify({ mode: "verify-five-word-curriculum", retainedTerms: terms.length, maps: maps.size, audioMappings: Object.keys(preservedAudio).length }, null, 2));
  process.exit(0);
}

if ([...maps.values()].some((items) => items.length !== 30)) {
  throw new Error("輸入詞庫必須是 42 張地圖、每張 30 個詞語。");
}

const retainedTerms = [];
const reportRows = [];
for (const [mapId, mapTerms] of [...maps.entries()].sort(([left], [right]) => left.localeCompare(right))) {
  const scored = mapTerms.map((term) => ({
    ...term,
    strokeTotal: [...term.term].reduce((sum, character) => sum + (strokeMap.get(character) ?? 0), 0),
    missingStrokeCharacters: [...term.term].filter((character) => !strokeMap.has(character)),
  }));
  const removed = [...scored]
    .sort((left, right) => right.strokeTotal - left.strokeTotal || right.stage - left.stage || right.stageOrder - left.stageOrder || right.term.localeCompare(left.term, "zh-Hant"))
    .slice(0, 5);
  const removedTerms = new Set(removed.map((term) => term.term));
  const kept = scored
    .filter((term) => !removedTerms.has(term.term))
    .sort((left, right) => left.stage - right.stage || left.stageOrder - right.stageOrder)
    .map((term, index) => ({
      ...term,
      stage: Math.floor(index / 5) + 1,
      stageOrder: (index % 5) + 1,
    }));
  if (kept.length !== 25 || new Set(kept.map((term) => term.term)).size !== 25) throw new Error(`${mapId} 重新分關後的詞語數不正確。`);
  retainedTerms.push(...kept.map(({ strokeTotal, missingStrokeCharacters, ...term }) => term));
  reportRows.push({ mapId, topic: mapTerms[0].topic, removed, missing: scored.flatMap((term) => term.missingStrokeCharacters) });
}

if (retainedTerms.length !== 1050 || new Set(retainedTerms.map((term) => term.term)).size !== 1050) {
  throw new Error("重新分關後必須保留 1,050 個不重複詞語。");
}
const retainedAudio = Object.fromEntries([...retainedTerms.map((term) => term.term), ...displayVariantAudioTerms].map((term) => {
  const clips = sourceAudio[term];
  if (!clips?.cantonese || !clips?.mandarin) throw new Error(`缺少「${term}」的固定雙語音檔。`);
  return [term, clips];
}));

const report = [
  "# 每關五詞詞庫縮減稽核",
  "",
  "此紀錄以 Unicode Unihan `kTotalStrokes` 總筆畫資料計算各詞所有漢字筆畫總和；每張地圖移除筆畫總和最高的五詞。若總筆畫相同，優先移除原本較後的關卡與位置，以保留較早、較基礎的詞語。保留的二十五詞依原有次序重新編排為五關、每關五詞。",
  "",
  "| 地圖 | 主題 | 移除的五詞（總筆畫） |",
  "| --- | --- | --- |",
  ...reportRows.map(({ mapId, topic, removed }) => `| ${mapId} | ${topic} | ${removed.map((term) => `${term.term}（${term.strokeTotal}）`).join("、")} |`),
  "",
  `保留詞語：${retainedTerms.length} 個；地圖：${reportRows.length} 張；每圖：5 關 × 5 詞。`,
  "",
].join("\n");

if (apply) {
  await Promise.all([
    writeFile(termsPath, `${JSON.stringify(retainedTerms, null, 2)}\n`, "utf8"),
    writeFile(audioPath, formatAudio(retainedAudio), "utf8"),
    writeFile(resolve(projectRoot, "docs/每關五詞詞庫縮減稽核.md"), report, "utf8"),
  ]);
}

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  retainedTerms: retainedTerms.length,
  maps: reportRows.length,
  removed: reportRows.flatMap((row) => row.removed.map((term) => ({ mapId: row.mapId, term: term.term, strokes: term.strokeTotal }))),
  missingStrokeCharacters: [...new Set(reportRows.flatMap((row) => row.missing))],
}, null, 2));
