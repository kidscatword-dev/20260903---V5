import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = "/home/ubuntu/webdev-static-assets/signal-audio-repairs";
const audit = JSON.parse(await readFile(resolve(projectRoot, "docs/wav-signal-audit-report.json"), "utf8"));
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
for (const [index, item] of audit.suspicious.entries()) {
  const filename = `repair-${String(index + 1).padStart(2, "0")}-${item.language}.mp3`;
  await generate(item.term, voices[item.language], resolve(outputRoot, filename));
  manifest.push({ ...item, filename });
  console.log(`${item.language}: ${item.term}`);
}

await writeFile(resolve(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`完成 ${manifest.length} 段低訊號固定讀音重製。`);
