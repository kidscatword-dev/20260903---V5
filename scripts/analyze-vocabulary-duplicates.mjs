/** 分析目前字詞庫於主題與難度之間的重複情況。 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const terms = JSON.parse(await readFile(resolve(root, "client/src/data/terms.json"), "utf8"));
const byTerm = new Map();
for (const entry of terms) {
  const values = byTerm.get(entry.term) ?? [];
  values.push(`${entry.level}:${entry.topic}`);
  byTerm.set(entry.term, values);
}
const repeated = [...byTerm.entries()].filter(([, locations]) => locations.length > 1);
const byTopic = new Map();
for (const [term, locations] of repeated) {
  for (const location of locations) {
    const [, topic] = location.split(":");
    const termsForTopic = byTopic.get(topic) ?? [];
    termsForTopic.push(term);
    byTopic.set(topic, termsForTopic);
  }
}
console.log(JSON.stringify({
  entries: terms.length,
  uniqueTerms: byTerm.size,
  repeatedTerms: repeated.length,
  duplicateEntries: terms.length - byTerm.size,
  repeatedByTopic: Object.fromEntries([...byTopic.entries()].map(([topic, values]) => [topic, values.length])),
  examples: repeated.slice(0, 20),
}, null, 2));
