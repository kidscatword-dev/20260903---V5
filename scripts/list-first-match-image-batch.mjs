import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const terms = JSON.parse(readFileSync(resolve(projectRoot, "client/src/data/termsV2.json"), "utf8"));
const topics = ["水果與飲品", "主食與小食", "常見動物", "交通與出行"];
const selected = topics.flatMap((topic) => terms.filter((term) => term.topic === topic));

console.log(JSON.stringify({
  topics,
  count: selected.length,
  terms: selected.map(({ term, mapId, topic, stage, stageOrder }) => ({ term, mapId, topic, stage, stageOrder })),
}, null, 2));
