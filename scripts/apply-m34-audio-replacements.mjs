import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile("/home/ubuntu/webdev-static-assets/m34-audio-replacements/manifest.json", "utf8"));
const uploadLog = await readFile("/tmp/m34-audio-upload-urls.txt", "utf8");
const topicAudioPath = resolve(projectRoot, "client/src/data/topicAudioV2.ts");

const uploaded = new Map(
  [...uploadLog.matchAll(/^\[SUCCESS\].*\/(m34-\d+-(?:cantonese|mandarin)\.mp3) -> (\/manus-storage\/\S+)$/gm)]
    .map(([, filename, url]) => [filename, url]),
);

if (uploaded.size !== 50) throw new Error(`預期 50 段上傳音檔，實際取得 ${uploaded.size} 段。`);

const replacements = new Map(manifest.map((item) => [item.term, {
  cantonese: uploaded.get(item.cantonese),
  mandarin: uploaded.get(item.mandarin),
}]));

if ([...replacements.values()].some((audio) => !audio.cantonese || !audio.mandarin)) {
  throw new Error("媒體與通訊音檔清單不完整。");
}

const source = await readFile(topicAudioPath, "utf8");
const updated = source.replace(
  /^(  "([^"]+)": \{ cantonese: ")[^"]+("\, mandarin: ")[^"]+(" \},)$/gm,
  (line, prefix, term, divider, suffix) => {
    const audio = replacements.get(term);
    return audio ? `${prefix}${audio.cantonese}${divider}${audio.mandarin}${suffix}` : line;
  },
);

for (const term of replacements.keys()) {
  if (!updated.includes(`  "${term}": { cantonese: "${replacements.get(term).cantonese}"`)) {
    throw new Error(`未能更新「${term}」的音檔映射。`);
  }
}

await writeFile(topicAudioPath, updated, "utf8");
await writeFile(resolve(projectRoot, "docs/m34-audio-replacement-manifest.json"), `${JSON.stringify({
  replacedAt: new Date().toISOString(),
  terms: manifest.map((item) => ({ term: item.term, ...replacements.get(item.term) })),
  reason: "以逐詞產生並驗證時長的 MP3，取代媒體與通訊地圖原有 WAV；修正近乎靜音與異常長檔案風險。",
}, null, 2)}\n`, "utf8");

console.log(`已更新 ${replacements.size} 個媒體與通訊詞語的粵語及普通話固定讀音。`);
