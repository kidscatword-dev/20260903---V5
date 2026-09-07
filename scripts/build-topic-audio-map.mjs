/** 合併既有及新增音檔網址，為 870 個不重複詞語建立固定雙語讀音映射。 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const terms = JSON.parse(await readFile(resolve(root, "client/src/data/terms.json"), "utf8"));
const uniqueTerms = [...new Set(terms.map((item) => item.term))];
const currentSource = await readFile(resolve(root, "client/src/data/topicAudio.ts"), "utf8");
const jsonStart = currentSource.indexOf("= ") + 2;
const jsonEnd = currentSource.lastIndexOf(";\n\nexport default");
const existingMap = JSON.parse(currentSource.slice(jsonStart, jsonEnd));
const manifest = JSON.parse(await readFile("/home/ubuntu/webdev-static-assets/unique-graded-audio/manifest.json", "utf8"));

async function readUploadMap(filePath) {
  const uploadLog = await readFile(filePath, "utf8");
  return new Map(
    [...uploadLog.matchAll(/^\[SUCCESS\]\s+.+\/(graded-\d+\.mp3)\s+->\s+(\/manus-storage\/\S+)$/gm)]
      .map((match) => [match[1], match[2]]),
  );
}

const cantoneseUploads = await readUploadMap("/home/ubuntu/unique-graded-cantonese-urls.txt");
const mandarinUploads = await readUploadMap("/home/ubuntu/unique-graded-mandarin-urls.txt");
const topicAudio = Object.fromEntries(uniqueTerms.map((term) => {
  const filename = manifest[term];
  if (filename) {
    const cantonese = cantoneseUploads.get(filename);
    const mandarin = mandarinUploads.get(filename);
    if (!cantonese || !mandarin) throw new Error(`缺少新增詞語「${term}」的雙語音檔：${filename}`);
    return [term, { cantonese, mandarin }];
  }
  const existing = existingMap[term];
  if (!existing?.cantonese || !existing?.mandarin) throw new Error(`缺少「${term}」的固定雙語音檔。`);
  return [term, existing];
}));

const source = `/** 固定音檔：每個字詞均有香港粵語與普通話兩種預先製作讀音。 */\nconst topicAudio: Record<string, { cantonese: string; mandarin: string }> = ${JSON.stringify(topicAudio, null, 2)};\n\nexport default topicAudio;\n`;
await writeFile(resolve(root, "client/src/data/topicAudio.ts"), source, "utf8");
console.log(JSON.stringify({ terms: uniqueTerms.length, reused: uniqueTerms.filter((term) => !manifest[term]).length, newAudio: uniqueTerms.filter((term) => Boolean(manifest[term])).length }, null, 2));
