import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("十級練習分組切換", () => {
  it("可在同一主題自由切換上一組與下一組，並於切換時回到該組第一個詞", () => {
    const source = readFileSync(new URL("./TenLevelPractice.tsx", import.meta.url), "utf8");

    expect(source).toContain("const batchCount = Math.max(1, Math.ceil(terms.length / TERMS_PER_SESSION));");
    expect(source).toContain("const changeBatch = (direction: -1 | 1)");
    expect(source).toContain("if (nextBatch !== currentBatch) setIndex(0);");
    expect(source).toContain("上一組");
    expect(source).toContain("下一組");
    expect(source).toContain("第 {batch + 1}/{batchCount} 組");
  });
});
