import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const terms = JSON.parse(readFileSync(resolve(projectRoot, "client/src/data/termsV2.json"), "utf8"));
const maps = new Map();
for (const term of terms) {
  const current = maps.get(term.mapId) ?? { mapId: term.mapId, topic: term.topic, terms: [] };
  current.terms.push(term.term);
  maps.set(term.mapId, current);
}
console.log(JSON.stringify([...maps.values()].sort((a, b) => a.mapId.localeCompare(b.mapId)), null, 2));
