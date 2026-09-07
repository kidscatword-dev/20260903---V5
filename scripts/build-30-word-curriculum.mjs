/** 建立初級、中級、高級的 870 筆全庫不重複詞語，並從開源粵拼資料補足讀音。 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pinyin } from "pinyin-pro";
import { gradedGroups } from "./graded-curriculum-data.mjs";

const projectRoot = resolve(import.meta.dirname, "..");
const cifuUrl = "https://raw.githubusercontent.com/gwinterstein/Cifu/master/Lexicon/Cifu-v1.txt";
const rawCifu = await fetch(cifuUrl).then((response) => {
  if (!response.ok) throw new Error(`未能讀取 Cifu 詞庫：${response.status}`);
  return response.text();
});
const cifuMap = new Map(rawCifu.split("\n").slice(1).map((row) => {
  const [term, jyutping] = row.split("\t");
  return [term?.trim(), jyutping?.trim()];
}).filter(([term, jyutping]) => term && jyutping));
const characterMap = JSON.parse(await readFile(resolve(projectRoot, "client/src/data/jyutpingCharMap.json"), "utf8"));
const fallbackJyutping = (term) => Array.from(term).map((character) => characterMap[character] ?? "—").join(" ");
const jyutpingOverrides = { "朱古力": "zyu1 gu2 lik6" };
const normalizeJyutping = (term, value) => jyutpingOverrides[term] ?? value.replace(/^\*/, "").split("|")[0];

if (gradedGroups.some((group) => group.terms.length !== 30)) {
  throw new Error("每個主題必須剛好有 30 個詞語。");
}
const sourceTerms = gradedGroups.flatMap((group) => group.terms);
const duplicatedTerms = [...new Set(sourceTerms.filter((term, index) => sourceTerms.indexOf(term) !== index))];
if (duplicatedTerms.length) throw new Error(`詞庫不可重複：${duplicatedTerms.join("、")}`);
if (sourceTerms.length !== 870) throw new Error(`預期 870 個詞語，實際為 ${sourceTerms.length}。`);

const output = gradedGroups.flatMap((group) => group.terms.map((term) => ({
  term,
  jyutping: normalizeJyutping(term, cifuMap.get(term) ?? fallbackJyutping(term)),
  pinyin: pinyin(term, { toneType: "symbol" }),
  level: group.level,
  category: group.category,
  topic: group.topic,
})));
const unresolved = output.filter((item) => item.jyutping.includes("—"));
if (unresolved.length) console.warn(`以下 ${unresolved.length} 個詞語缺少完整粵拼字元資料：${unresolved.map((item) => item.term).join("、")}`);
await writeFile(resolve(projectRoot, "client/src/data/terms.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ entries: output.length, uniqueTerms: new Set(output.map((item) => item.term)).size, groups: gradedGroups.length, unresolvedJyutping: unresolved.length }, null, 2));
