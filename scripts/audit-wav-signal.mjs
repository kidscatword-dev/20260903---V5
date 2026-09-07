import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const siteOrigin = process.env.AUDIO_AUDIT_ORIGIN ?? "http://localhost:3000";
const extension = process.env.AUDIO_AUDIT_EXTENSION ?? "wav";
const sourceFilters = process.env.AUDIO_AUDIT_TERM_SOURCES?.split("||").filter(Boolean) ?? [];
const reportPrefix = process.env.AUDIO_AUDIT_REPORT_PREFIX ?? extension;
const terms = JSON.parse(await readFile(resolve(projectRoot, "client/src/data/termsV2.json"), "utf8"));
const mapSource = await readFile(resolve(projectRoot, "client/src/data/topicAudioV2.ts"), "utf8");
const audioByTerm = new Map([...mapSource.matchAll(/^\s*"([^"]+)": \{ cantonese: "([^"]+)", mandarin: "([^"]+)" \},$/gm)]
  .map(([, term, cantonese, mandarin]) => [term, { cantonese, mandarin }]));

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const analyzeBuffer = (buffer) => new Promise((resolveAnalysis, rejectAnalysis) => {
  const process = spawn("ffmpeg", ["-hide_banner", "-i", "pipe:0", "-af", "volumedetect", "-f", "null", "-"]);
  let stderr = "";
  process.stderr.on("data", (chunk) => { stderr += chunk; });
  process.on("error", rejectAnalysis);
  process.on("close", (code) => {
    if (code !== 0) return rejectAnalysis(new Error(stderr));
    const duration = Number(stderr.match(/Duration: (\d{2}):(\d{2}):(\d+(?:\.\d+)?)/)?.slice(1).reduce((seconds, value, index) => seconds + Number(value) * [3600, 60, 1][index], 0) ?? NaN);
    const mean = Number(stderr.match(/mean_volume: (-?[\d.]+) dB/)?.[1] ?? NaN);
    const max = Number(stderr.match(/max_volume: (-?[\d.]+) dB/)?.[1] ?? NaN);
    resolveAnalysis({ duration: Number(duration.toFixed(3)), meanDb: mean, maxDb: max });
  });
  process.stdin.end(Buffer.from(buffer));
});

async function fetchAudio(source) {
  let latestFailure = "unknown";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(new URL(source, siteOrigin), { signal: AbortSignal.timeout(20_000) });
      if (response.ok) return await response.arrayBuffer();
      latestFailure = `http-${response.status}`;
      if (response.status !== 429) break;
    } catch (error) {
      latestFailure = error instanceof Error ? error.name : String(error);
    }
    await sleep(1_200 * (attempt + 1));
  }
  throw new Error(latestFailure);
}

const jobs = terms.flatMap((term) => ["cantonese", "mandarin"].map((language) => ({
  term: term.term,
  mapId: term.mapId,
  topic: term.topic,
  termSource: term.source,
  language,
  source: audioByTerm.get(term.term)?.[language],
}))).filter((job) => job.source?.endsWith(`.${extension}`) && (sourceFilters.length === 0 || sourceFilters.includes(job.termSource)));

const report = { auditedAt: new Date().toISOString(), siteOrigin, total: jobs.length, passed: [], suspicious: [], failed: [] };
for (const [index, job] of jobs.entries()) {
  try {
    const signal = await analyzeBuffer(await fetchAudio(job.source));
    const item = { ...job, ...signal };
    if (signal.duration > 8 || signal.maxDb < -40 || signal.meanDb < -48) report.suspicious.push(item);
    else report.passed.push(item);
  } catch (error) {
    report.failed.push({ ...job, failure: error instanceof Error ? error.message : String(error) });
  }
  if ((index + 1) % 25 === 0 || index + 1 === jobs.length) console.log(`已分析 ${index + 1}/${jobs.length}`);
  await sleep(280);
}

await writeFile(resolve(projectRoot, `docs/${reportPrefix}-signal-audit-report.json`), `${JSON.stringify({
  ...report,
  passed: report.passed.length,
  suspicious: report.suspicious,
  failed: report.failed,
}, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ total: report.total, passed: report.passed.length, suspicious: report.suspicious.length, failed: report.failed.length }, null, 2));
