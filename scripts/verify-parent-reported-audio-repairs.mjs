import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const mappings = JSON.parse(await readFile(resolve(projectRoot, "docs/家長回傳_讀音修正映射.json"), "utf8"));
const origin = process.env.AUDIO_AUDIT_ORIGIN ?? "https://3000-iomj0749j38uy3av6lgy4-8a910a54.us3.manus.computer";
const outputPath = resolve(projectRoot, "docs/家長回傳_讀音修正_HTTP稽核.json");

const wait = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
async function inspect(item) {
  const url = `${origin}${item.storagePath}`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
      clearTimeout(timeout);
      if (response.ok && (response.headers.get("content-type") || "").startsWith("audio/")) {
        return { ...item, ok: true, status: response.status, contentType: response.headers.get("content-type"), contentLength: Number(response.headers.get("content-length") || 0), attempts: attempt };
      }
      if (attempt === 3) return { ...item, ok: false, status: response.status, contentType: response.headers.get("content-type"), attempts: attempt };
    } catch (error) {
      clearTimeout(timeout);
      if (attempt === 3) return { ...item, ok: false, error: error.name === "AbortError" ? "timeout" : String(error), attempts: attempt };
    }
    await wait(attempt * 500);
  }
}

const results = [];
let cursor = 0;
const concurrency = 2;
async function worker() {
  while (cursor < mappings.length) {
    const item = mappings[cursor++];
    const result = await inspect(item);
    results.push(result);
    if (!result.ok) console.error(`失敗：${item.term} ${item.language}`);
    await wait(80);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
results.sort((left, right) => left.storagePath.localeCompare(right.storagePath));
const failed = results.filter((item) => !item.ok);
const payload = { origin, total: results.length, passed: results.length - failed.length, failed, results };
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ total: payload.total, passed: payload.passed, failed: failed.length, outputPath }, null, 2));
if (failed.length) process.exitCode = 1;
