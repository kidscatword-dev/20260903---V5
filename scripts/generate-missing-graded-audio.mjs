/** 補製初級、中級、高級詞庫新增字詞的固定粵語與普通話音檔。 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputRoot = "/home/ubuntu/webdev-static-assets/unique-graded-audio";
const terms = JSON.parse(await readFile(resolve(root, "scripts/missing-audio-terms.json"), "utf8"));
const voices = { cantonese: "zh-HK-HiuMaanNeural", mandarin: "zh-CN-XiaoxiaoNeural" };
await Promise.all(Object.keys(voices).map((locale) => mkdir(resolve(outputRoot, locale), { recursive: true })));

function makeAudio(term, voice, outputPath) {
  return new Promise((resolveTask, rejectTask) => {
    const child = spawn("edge-tts", ["--voice", voice, "--rate=-8%", "--text", term, "--write-media", outputPath]);
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", rejectTask);
    child.on("close", (code) => code === 0 ? resolveTask() : rejectTask(new Error(`${term}: ${stderr}`)));
  });
}

const tasks = terms.flatMap((term, index) => Object.entries(voices).map(([locale, voice]) => ({ term, locale, voice, filename: `graded-${String(index + 1).padStart(3, "0")}.mp3` })));
let cursor = 0;
const failures = [];
async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++];
    try {
      await makeAudio(task.term, task.voice, resolve(outputRoot, task.locale, task.filename));
      console.log(`${task.locale}: ${task.term}`);
    } catch (error) {
      failures.push(`${task.locale}:${task.term}`);
      console.error(error.message);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
const manifest = Object.fromEntries(terms.map((term, index) => [term, `graded-${String(index + 1).padStart(3, "0")}.mp3`]));
await writeFile(resolve(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
if (failures.length) throw new Error(`共有 ${failures.length} 個音檔失敗：${failures.join("、")}`);
console.log(`完成 ${terms.length} 個新字詞、${tasks.length} 個固定雙語音檔。`);
