import OpenCC from "opencc-js";
import { tenLevelTerms } from "@/data/tenLevelCatalog";
import { wordLanguageVariants } from "@/lib/wordLanguageVariants";
import termsJson from "@/data/terms.json";

export type ChineseScript = "traditional" | "simplified";

export const CHINESE_SCRIPT_STORAGE_KEY = "traditional-character-script-display-v1";

const traditionalHongKongToSimplified = OpenCC.Converter({ from: "hk", to: "cn" });
const vocabularyForms = new Set([
  ...tenLevelTerms.map(({ term }) => term),
  ...(termsJson as { term: string }[]).map(({ term }) => term),
  ...Object.values(wordLanguageVariants).flatMap(({ cantoneseTerm, mandarinTerm }) => [cantoneseTerm, mandarinTerm]),
]);

export function readChineseScript(): ChineseScript {
  try {
    return localStorage.getItem(CHINESE_SCRIPT_STORAGE_KEY) === "simplified" ? "simplified" : "traditional";
  } catch {
    return "traditional";
  }
}

export function writeChineseScript(script: ChineseScript) {
  try {
    localStorage.setItem(CHINESE_SCRIPT_STORAGE_KEY, script);
  } catch {
    // 顯示模式只屬於本機偏好；不可用時安全地維持目前畫面即可。
  }
}

export function displayChineseText(text: string, script: ChineseScript) {
  return script === "simplified" ? traditionalHongKongToSimplified(text) : text;
}

/** 只轉換用作認字、題目或選項的實際詞語；所有介面文案維持香港繁體。 */
export function displayVocabularyTerm(text: string, script: ChineseScript) {
  return vocabularyForms.has(text) ? displayChineseText(text, script) : text;
}
