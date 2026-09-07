import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile("/home/ubuntu/webdev-static-assets/signal-audio-repairs/manifest.json", "utf8"));
const uploadLog = await readFile("/tmp/signal-audio-repair-upload-urls.txt", "utf8");
const topicAudioPath = resolve(projectRoot, "client/src/data/topicAudioV2.ts");

const uploaded = new Map(
  [...uploadLog.matchAll(/^\[SUCCESS\].*\/(repair-\d+-(?:cantonese|mandarin)\.mp3) -> (\/manus-storage\/\S+)$/gm)]
    .map(([, filename, url]) => [filename, url]),
);

if (uploaded.size !== manifest.length) throw new Error(`預期 ${manifest.length} 段上傳音檔，實際取得 ${uploaded.size} 段。`);

const replacements = new Map(manifest.map((item) => [`${item.term}:${item.language}`, uploaded.get(item.filename)]));
const source = await readFile(topicAudioPath, "utf8");
const updated = source.replace(
  /^  "([^"]+)": \{ cantonese: "([^"]+)", mandarin: "([^"]+)" \},$/gm,
  (line, term, cantonese, mandarin) => {
    const nextCantonese = replacements.get(`${term}:cantonese`) ?? cantonese;
    const nextMandarin = replacements.get(`${term}:mandarin`) ?? mandarin;
    return `  "${term}": { cantonese: "${nextCantonese}", mandarin: "${nextMandarin}" },`;
  },
);

for (const item of manifest) {
  const url = replacements.get(`${item.term}:${item.language}`);
  if (!updated.includes(`"${url}"`)) throw new Error(`未能更新「${item.term}」${item.language}的音檔映射。`);
}

await writeFile(topicAudioPath, updated, "utf8");
await writeFile(resolve(projectRoot, "docs/signal-audio-repair-manifest.json"), `${JSON.stringify({
  replacedAt: new Date().toISOString(),
  repaired: manifest.map((item) => ({ ...item, replacement: replacements.get(`${item.term}:${item.language}`) })),
  reason: "低速 WAV 訊號稽核確認近乎靜音或音量不足，逐段改用相容 MP3。",
}, null, 2)}\n`, "utf8");

console.log(`已更新 ${manifest.length} 段低訊號固定讀音。`);
