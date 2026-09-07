import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const terms = JSON.parse(await readFile(resolve(projectRoot, "client/src/data/terms.json"), "utf8"));
const mapTopics = {
  preschool: ["food", "animal", "body", "family", "emotion", "color", "object", "toy", "transport"],
  junior: ["food", "animal", "body", "family", "emotion", "color", "object", "school", "career", "sport"],
  senior: ["food", "animal", "body", "family", "emotion", "color", "object", "nature", "advanced-emotion", "society"],
};
const diagnostics = [];
for (const [level, topics] of Object.entries(mapTopics)) {
  for (const topic of topics) {
    const words = terms.filter((entry) => entry.level === level && entry.topic === topic);
    const chunks = Array.from({ length: 5 }, (_, index) => words.slice(index * 6, index * 6 + 6));
    diagnostics.push({ level, topic, words: words.length, stages: chunks.map((chunk) => chunk.length), unique: new Set(words.map((word) => word.term)).size });
  }
}
const invalid = diagnostics.filter((item) => item.words !== 30 || item.unique !== 30 || item.stages.some((size) => size !== 6));
console.log(JSON.stringify({ maps: Object.fromEntries(Object.entries(mapTopics).map(([level, topics]) => [level, topics.length])), lands: diagnostics.length, invalid, diagnostics }, null, 2));
if (invalid.length) process.exit(1);
