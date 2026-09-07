import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const reportPath = resolve(projectRoot, "docs/家長回傳_讀音問題清單.json");
const outputRoot = "/home/ubuntu/webdev-static-assets/parent-reported-audio-repairs";
const manifestPath = resolve(outputRoot, "manifest.json");
const voices = { cantonese: "zh-HK-HiuMaanNeural", mandarin: "zh-CN-XiaoxiaoNeural" };

const report = JSON.parse(await readFile(reportPath, "utf8"));
const repairs = report.issues
  .filter((item) => item.status === "無聲" && (item.language === "cantonese" || item.language === "mandarin"))
  .map((item, index) => ({ ...item, id: String(index + 1).padStart(3, "0") }));

if (!repairs.length) throw new Error("核對表中沒有標示為無聲的讀音。");
await mkdir(outputRoot, { recursive: true });

function render(term, voice, outputPath) {
  return new Promise((resolveTask, rejectTask) => {
    const child = spawn("edge-tts", ["--voice", voice, "--rate=-8%", "--text", term, "--write-media", outputPath]);
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", rejectTask);
    child.once("close", (code) => code === 0 ? resolveTask() : rejectTask(new Error(stderr || `${term} 產生失敗`)));
  });
}

async function renderWithRetry(repair) {
  const filename = `parent-repair-${repair.id}-${repair.language}.mp3`;
  const outputPath = resolve(outputRoot, filename);
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await render(repair.term, voices[repair.language], outputPath);
      console.log(`${repair.id}/${repairs.length} ${repair.language}: ${repair.term}`);
      return { ...repair, filename, outputPath };
    } catch (error) {
      if (attempt === 3) throw new Error(`${repair.language}:${repair.term} 失敗：${error.message}`);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 800));
    }
  }
}

const generated = [];
const failures = [];
const concurrency = 4;
let cursor = 0;
async function worker() {
  while (cursor < repairs.length) {
    const repair = repairs[cursor++];
    try { generated.push(await renderWithRetry(repair)); }
    catch (error) { failures.push(error.message); console.error(error.message); }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
generated.sort((left, right) => left.id.localeCompare(right.id));
await writeFile(manifestPath, `${JSON.stringify({ generated, failures }, null, 2)}\n`, "utf8");
if (failures.length) throw new Error(`共有 ${failures.length} 段讀音未完成。`);
console.log(`完成 ${generated.length} 段家長回報的無聲讀音：${manifestPath}`);
