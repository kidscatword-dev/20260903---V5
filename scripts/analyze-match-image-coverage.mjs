import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const terms = JSON.parse(readFileSync(resolve(projectRoot, "client/src/data/termsV2.json"), "utf8"));
const gameSource = readFileSync(resolve(projectRoot, "client/src/components/WordGames.tsx"), "utf8");
const mappedTerms = [...gameSource.matchAll(/^\s+"([^"]+)":\s+"\/manus-storage\//gm)].map((match) => match[1]);
const mappedTermSet = new Set(mappedTerms);
const uniqueTerms = [...new Map(terms.map((term) => [term.term, term])).values()];
const topicSummary = new Map();

for (const term of uniqueTerms) {
  const summary = topicSummary.get(term.topic) ?? { topic: term.topic, total: 0, mapped: 0 };
  summary.total += 1;
  if (mappedTermSet.has(term.term)) summary.mapped += 1;
  topicSummary.set(term.topic, summary);
}

const covered = uniqueTerms.filter((term) => mappedTermSet.has(term.term));
const suggestedFirstBatch = [...topicSummary.values()]
  .sort((left, right) => right.total - left.total || left.topic.localeCompare(right.topic, "zh-Hant"))
  .reduce((selected, topic) => selected + Math.min(15, topic.total), 0);

console.log(JSON.stringify({
  uniqueTerms: uniqueTerms.length,
  existingImageMappings: mappedTerms.length,
  coveredTerms: covered.length,
  coveredTermList: covered.map((term) => term.term),
  uncoveredTerms: uniqueTerms.length - covered.length,
  suggestedFirstBatch,
  topicSummary: [...topicSummary.values()].sort((left, right) => left.topic.localeCompare(right.topic, "zh-Hant")),
}, null, 2));
