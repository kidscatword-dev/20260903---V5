/** 比較目前詞庫與舊有固定讀音映射，列出需補製字詞。 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const terms = JSON.parse(await readFile(resolve(root, "client/src/data/terms.json"), "utf8"));
const source = await readFile(resolve(root, "client/src/data/topicAudio.ts"), "utf8");
const existingTerms = new Set([...source.matchAll(/^  "(.+)": \{$/gm)].map((match) => match[1]));
const requiredTerms = [...new Set(terms.map((term) => term.term))];
const missingTerms = requiredTerms.filter((term) => !existingTerms.has(term));
await writeFile(resolve(root, "scripts/missing-audio-terms.json"), `${JSON.stringify(missingTerms, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ required: requiredTerms.length, reusable: requiredTerms.length - missingTerms.length, missing: missingTerms.length, output: "scripts/missing-audio-terms.json" }, null, 2));
