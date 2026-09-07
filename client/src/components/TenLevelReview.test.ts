import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("十級溫習庫管理介面", () => {
  it("提供逐詞取消收藏及須確認的一鍵清空", () => {
    const source = readFileSync(new URL("./TenLevelReview.tsx", import.meta.url), "utf8");

    expect(source).toContain("取消收藏 ${displayText(item.term)}");
    expect(source).toContain("一鍵清空溫習庫");
    expect(source).toContain("確定清空");
    expect(source).toContain("保留字詞");
    expect(source).toContain("clearTenLevelReview()");
  });
});
