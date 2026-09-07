import OpenCC from "opencc-js";
import { tenLevelTerms } from "../client/src/data/tenLevelCatalog.ts";

const convert = OpenCC.Converter({ from: "hk", to: "cn" });
const termsByDisplay = new Map();

for (const entry of tenLevelTerms) {
  const displayed = convert(entry.term);
  const originals = termsByDisplay.get(displayed) ?? new Set();
  originals.add(entry.term);
  termsByDisplay.set(displayed, originals);
}

const collisions = [...termsByDisplay.entries()]
  .filter(([, originals]) => originals.size > 1)
  .map(([displayed, originals]) => ({ displayed, originals: [...originals].sort() }));

console.log(JSON.stringify({ termCount: tenLevelTerms.length, collisionCount: collisions.length, collisions }, null, 2));
if (collisions.length > 0) process.exitCode = 1;
