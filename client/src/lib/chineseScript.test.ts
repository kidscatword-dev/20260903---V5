import { describe, expect, it } from "vitest";
import { displayChineseText, displayVocabularyTerm, readChineseScript } from "./chineseScript";
import { getLanguageWord } from "./wordLanguageVariants";
import { tenLevelTerms } from "@/data/tenLevelCatalog";

describe("繁簡字顯示", () => {
  it("預設保持香港繁體字，並能轉換詞語為簡體字", () => {
    expect(displayChineseText("中文認字樂", "traditional")).toBe("中文認字樂");
    expect(displayChineseText("圖書館、車站、學習", "simplified")).toBe("图书馆、车站、学习");
  });

  it("會在粵語或普通話詞形決定後才轉換可見文字", () => {
    expect(displayChineseText(getLanguageWord("冰淇淋", "cantonese"), "simplified")).toBe("雪糕");
    expect(displayChineseText(getLanguageWord("冰淇淋", "mandarin"), "simplified")).toBe("冰淇淋");
    expect(displayChineseText(getLanguageWord("單車", "mandarin"), "simplified")).toBe("自行车");
  });

  it("沒有瀏覽器本機儲存時安全回退至繁體字", () => {
    expect(readChineseScript()).toBe("traditional");
  });

  it("簡體模式只轉換實際詞語，介面文案和品牌仍保持香港繁體", () => {
    expect(displayVocabularyTerm("遊戲天地", "simplified")).toBe("遊戲天地");
    expect(displayVocabularyTerm("中文認字樂", "simplified")).toBe("中文認字樂");
    expect(displayVocabularyTerm("圖書館", "simplified")).toBe("图书馆");
    expect(displayVocabularyTerm("舒服", "simplified")).toBe("舒服");
  });

  it("十級詞庫的繁轉簡顯示不會令不同原始答案相撞", () => {
    const originalsBySimplified = new Map<string, Set<string>>();
    tenLevelTerms.forEach(({ term }) => {
      const simplified = displayChineseText(term, "simplified");
      const originals = originalsBySimplified.get(simplified) ?? new Set<string>();
      originals.add(term);
      originalsBySimplified.set(simplified, originals);
    });
    expect([...originalsBySimplified.values()].every((originals) => originals.size === 1)).toBe(true);
  });
});
