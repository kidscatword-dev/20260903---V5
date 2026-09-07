import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteOrigin = process.env.AUDIO_AUDIT_ORIGIN || "https://3000-iomj0749j38uy3av6lgy4-8a910a54.us3.manus.computer";
const terms = JSON.parse(await readFile(path.join(root, "client/src/data/termsV2.json"), "utf8"));

const parseAudioMap = async (relativePath) => {
  const source = await readFile(path.join(root, relativePath), "utf8");
  const result = new Map();
  const pattern = /"([^"]+)"\s*:\s*\{\s*cantonese:\s*"([^"]+)"\s*,\s*mandarin:\s*"([^"]+)"\s*\}/g;
  for (const match of source.matchAll(pattern)) {
    result.set(match[1], { cantonese: match[2], mandarin: match[3] });
  }
  return result;
};

const [v2Audio, legacyAudio] = await Promise.all([
  parseAudioMap("client/src/data/topicAudioV2.ts"),
  parseAudioMap("client/src/data/topicAudio.ts"),
]);

const resolvedAudio = new Map(terms.map((term) => {
  const latest = v2Audio.get(term.term);
  const legacy = legacyAudio.get(term.term);
  return [term.term, {
    cantonese: latest?.cantonese ?? legacy?.cantonese ?? null,
    mandarin: latest?.mandarin ?? legacy?.mandarin ?? null,
  }];
}));

const uniqueSources = [...new Set([...resolvedAudio.values()].flatMap((audio) => [audio.cantonese, audio.mandarin]).filter(Boolean))];
const checkSource = async (source) => {
  try {
    const response = await fetch(new URL(source, siteOrigin), { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(25_000) });
    return { source, status: response.status, ok: response.ok, contentType: response.headers.get("content-type") };
  } catch (error) {
    return { source, status: 0, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};

const concurrentMap = async (items, concurrency, mapper) => {
  const results = new Array(items.length);
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  }));
  return results;
};

const sourceChecks = await concurrentMap(uniqueSources, 24, checkSource);
const sourceStatus = new Map(sourceChecks.map((check) => [check.source, check]));
const classify = (source) => !source ? "missing-mapping" : sourceStatus.get(source)?.ok ? "ok" : "unavailable";
const termChecks = terms.map((term) => {
  const audio = resolvedAudio.get(term.term);
  return {
    term: term.term,
    mapId: term.mapId,
    topic: term.topic,
    cantonese: { source: audio.cantonese, status: classify(audio.cantonese) },
    mandarin: { source: audio.mandarin, status: classify(audio.mandarin) },
  };
});

const summarize = (items) => ({
  terms: items.length,
  cantonese: Object.fromEntries(["ok", "missing-mapping", "unavailable"].map((status) => [status, items.filter((item) => item.cantonese.status === status).length])),
  mandarin: Object.fromEntries(["ok", "missing-mapping", "unavailable"].map((status) => [status, items.filter((item) => item.mandarin.status === status).length])),
});

const unavailable = termChecks.filter((item) => item.cantonese.status !== "ok" || item.mandarin.status !== "ok");
const report = {
  auditedAt: new Date().toISOString(),
  siteOrigin,
  audioMaps: { v2Entries: v2Audio.size, legacyEntries: legacyAudio.size, uniqueSources: uniqueSources.length },
  overall: summarize(termChecks),
  byMap: Object.fromEntries([...new Set(termChecks.map((item) => item.mapId))].sort().map((mapId) => [mapId, summarize(termChecks.filter((item) => item.mapId === mapId))])),
  mediaAndCommunication: termChecks.filter((item) => item.mapId === "M34"),
  unavailable,
  failedSources: sourceChecks.filter((check) => !check.ok),
};

const destination = path.join(root, "docs/audio-audit-report.json");
await writeFile(destination, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ destination, overall: report.overall, m34: report.byMap.M34, unavailableTerms: unavailable.length, failedSources: report.failedSources.length }, null, 2));
