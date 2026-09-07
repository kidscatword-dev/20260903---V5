import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const repairManifest = JSON.parse(await readFile("/home/ubuntu/webdev-static-assets/parent-reported-audio-repairs/manifest.json", "utf8"));
const uploadOutput = await readFile("/tmp/parent-reported-audio-upload.txt", "utf8");
const issues = JSON.parse(await readFile(resolve(projectRoot, "docs/家長回傳_讀音問題清單.json"), "utf8"));
const audioMapPath = resolve(projectRoot, "client/src/data/topicAudioV2.ts");

const storagePaths = [...uploadOutput.matchAll(/^Storage Path:\s+(\/manus-storage\/[^\s]+)$/gm)].map((match) => match[1]);
const repairs = repairManifest.generated.filter((item) => item.status === "無聲");
if (repairManifest.failures.length) throw new Error(`重製清單含有失敗項：${repairManifest.failures.join("；")}`);
if (repairs.length !== 490 || storagePaths.length !== repairs.length) throw new Error(`預期 490 段重製與上傳結果，實際為 ${repairs.length} / ${storagePaths.length}。`);
if (issues.issues.filter((item) => item.status === "無聲").length !== repairs.length) throw new Error("核對表與重製清單的無聲項數量不一致。");

const replacementByTermLanguage = new Map();
repairs.forEach((repair, index) => {
  const path = storagePaths[index];
  const expectedPrefix = `parent-repair-${repair.id}-${repair.language}_`;
  if (!path.includes(expectedPrefix) || !path.endsWith(".mp3")) throw new Error(`上傳路徑與重製項目不符：${repair.filename} → ${path}`);
  replacementByTermLanguage.set(`${repair.term}\u0000${repair.language}`, path);
});

let source = await readFile(audioMapPath, "utf8");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let replacements = 0;
for (const repair of repairs) {
  const key = `${repair.term}\u0000${repair.language}`;
  const replacement = replacementByTermLanguage.get(key);
  const pattern = new RegExp(`^(\\s*"${escapeRegExp(repair.term)}": \\{ cantonese: ")([^"]+)(", mandarin: ")([^"]+)(" \\},)$`, "m");
  if (!pattern.test(source)) throw new Error(`找不到詞語映射：${repair.term}`);
  source = source.replace(pattern, (_match, leading, oldCantonese, middle, oldMandarin, trailing) => {
    const nextCantonese = repair.language === "cantonese" ? replacement : oldCantonese;
    const nextMandarin = repair.language === "mandarin" ? replacement : oldMandarin;
    replacements += 1;
    return `${leading}${nextCantonese}${middle}${nextMandarin}${trailing}`;
  });
}
if (replacements !== repairs.length) throw new Error(`預期更新 ${repairs.length} 段，實際更新 ${replacements} 段。`);
await writeFile(audioMapPath, source, "utf8");

const outputPath = resolve(projectRoot, "docs/家長回傳_讀音修正映射.json");
await writeFile(outputPath, `${JSON.stringify(repairs.map((repair) => ({ term: repair.term, language: repair.language, storagePath: replacementByTermLanguage.get(`${repair.term}\u0000${repair.language}`) })), null, 2)}\n`, "utf8");
console.log(`已更新 ${replacements} 段讀音映射，清單：${outputPath}`);
