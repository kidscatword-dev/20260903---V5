/** 將繁體認字樂的 870 筆詞庫匯出為可供檢閱的完整 Markdown 清單。 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const termsPath = path.join(root, "client/src/data/terms.json");
const outputPath = path.join(root, "docs/詞庫完整清單.md");
const levels = [
  ["preschool", "初級（生活高頻詞）", ["food", "emotion", "animal", "color", "body", "family", "object", "toy", "transport"]],
  ["junior", "中級（生活與校園詞）", ["food", "emotion", "animal", "color", "body", "family", "object", "school", "career", "sport"]],
  ["senior", "高級（進階表達詞）", ["food", "emotion", "animal", "color", "body", "family", "object", "nature", "advanced-emotion", "society"]],
];
const topicLabels = { food: "食物", emotion: "心情", animal: "動物", color: "顏色", body: "身體", family: "家庭", object: "日常用品", toy: "玩具", transport: "交通工具", school: "學校／學習", career: "職業", sport: "運動", nature: "自然", "advanced-emotion": "情緒進階", society: "社會" };

const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|");
const terms = JSON.parse(await readFile(termsPath, "utf8"));
if (!Array.isArray(terms) || terms.length !== 870) throw new Error(`預期 870 筆字詞，實際為 ${Array.isArray(terms) ? terms.length : "非陣列"}。`);

const lines = [
  "# 繁體認字樂：870 筆完整詞庫清單",
  "",
  "> 本文件由 `client/src/data/terms.json` 自動匯出，匯出時共核對 **870 筆**資料。每個年級的每個主題均列出 30 個詞語，並分為 3 組、每組 10 詞。",
  "",
  "| 年級 | 主題數 | 每主題詞數 | 總詞數 |",
  "| --- | ---: | ---: | ---: |",
  "| 初級 | 9 | 30 | 270 |",
  "| 中級 | 10 | 30 | 300 |",
  "| 高級 | 10 | 30 | 300 |",
  "| **合計** | **29** | **—** | **870** |",
  "",
];

for (const [levelId, levelLabel, topicIds] of levels) {
  const levelTerms = terms.filter((term) => term.level === levelId);
  const expectedLevelTerms = topicIds.length * 30;
  if (levelTerms.length !== expectedLevelTerms) throw new Error(`${levelLabel} 應有 ${expectedLevelTerms} 筆，實際為 ${levelTerms.length}。`);
  lines.push(`## ${levelLabel}`, "");
  for (const topicId of topicIds) {
    const topicLabel = topicLabels[topicId];
    const topicTerms = levelTerms.filter((term) => term.topic === topicId);
    if (topicTerms.length !== 30) throw new Error(`${levelLabel}・${topicLabel} 應有 30 筆，實際為 ${topicTerms.length}。`);
    lines.push(`### ${topicLabel}（30 詞）`, "");
    for (let batch = 0; batch < 3; batch += 1) {
      const words = topicTerms.slice(batch * 10, (batch + 1) * 10);
      lines.push(`#### 第 ${batch + 1} 組（${batch * 10 + 1}–${batch * 10 + 10}）`, "", "| # | 字詞 | 粵拼 | 普通話拼音 |", "| ---: | --- | --- | --- |");
      words.forEach((word, index) => lines.push(`| ${batch * 10 + index + 1} | ${escapeCell(word.term)} | ${escapeCell(word.jyutping)} | ${escapeCell(word.pinyin)} |`));
      lines.push("");
    }
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outputPath, terms: terms.length, sections: levels.reduce((sum, [, , topicIds]) => sum + topicIds.length, 0) }, null, 2));
