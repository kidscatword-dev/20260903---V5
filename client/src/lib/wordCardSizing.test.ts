import { describe, expect, it } from "vitest";
import { getWordCardSizeClass } from "./wordCardSizing";

describe("getWordCardSizeClass", () => {
  it("保留兩字詞的原有大字比例", () => {
    expect(getWordCardSizeClass("雪糕")).toBe("");
  });

  it("縮小三字與更長詞語，保持單行展示空間", () => {
    expect(getWordCardSizeClass("冰淇淋")).toBe("is-long");
    expect(getWordCardSizeClass("鍥而不捨")).toBe("is-long");
    expect(getWordCardSizeClass("環境保護措施")).toBe("is-extra-long");
  });
});
