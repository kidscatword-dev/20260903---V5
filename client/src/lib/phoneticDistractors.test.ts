import { describe, expect, it } from "vitest";
import { isPhoneticDistractor, phoneticSimilarityScore } from "./phoneticDistractors";

describe("phoneticSimilarityScore", () => {
  it("視不計聲調的粵語同音為高優先干擾詞", () => {
    expect(phoneticSimilarityScore({ jyutping: "si1 gaan1" }, { jyutping: "si2 gaan3" })).toBeGreaterThanOrEqual(20);
  });

  it("辨識普通話近似音，並排除沒有相近音節的詞", () => {
    expect(isPhoneticDistractor({ pinyin: "xué xiào" }, { pinyin: "xué shēng" })).toBe(true);
    expect(isPhoneticDistractor({ pinyin: "xué xiào" }, { pinyin: "hǎi yáng" })).toBe(false);
  });
});
