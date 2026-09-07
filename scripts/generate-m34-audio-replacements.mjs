import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = "/home/ubuntu/webdev-static-assets/m34-audio-replacements";
const terms = JSON.parse(await readFile(resolve(projectRoot, "client/src/data/termsV2.json"), "utf8"))
  .filter((item) => item.mapId === "M34");

const voices = {
  cantonese: "zh-HK-HiuMaanNeural",
  mandarin: "zh-CN-XiaoxiaoNeural",
};

await mkdir(outputRoot, { recursive: true });

function generate(term, voice, outputPath) {
  return new Promise((resolveTask, rejectTask) => {
    const child = spawn("edge-tts", [
      "--voice", voice,
      "--rate=-8%",
      "--text", term,
      "--write-media", outputPath,
    ]);
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", rejectTask);
    child.on("close", (code) => {
      if (code === 0) resolveTask();
      else rejectTask(new Error(`無法產生「${term}」：${stderr}`));
    });
  });
}

const manifest = [];
for (const [index, item] of terms.entries()) {
  const audio = {};
  for (const [language, voice] of Object.entries(voices)) {
    const filename = `m34-${String(index + 1).padStart(2, "0")}-${language}.mp3`;
    await generate(item.term, voice, resolve(outputRoot, filename));
    audio[language] = filename;
    console.log(`${language}: ${item.term}`);
  }
  manifest.push({ term: item.term, ...audio });
}

await writeFile(resolve(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`完成 ${terms.length} 個媒體與通訊詞語、${terms.length * 2} 段固定 MP3。`);
