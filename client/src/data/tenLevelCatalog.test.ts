import { describe, expect, it } from "vitest";
import { getTenLevelTermStage, getTenLevelTopics, tenLevels, tenLevelTopics } from "./tenLevelCatalog";

describe("十級地圖資料目錄", () => {
  it("將 42 張地圖分配到十個連續級別，每級四至五張", () => {
    expect(tenLevelTopics).toHaveLength(42);
    tenLevels.forEach(level => {
      expect(getTenLevelTopics(level).length).toBeGreaterThanOrEqual(4);
      expect(getTenLevelTopics(level).length).toBeLessThanOrEqual(5);
    });
  });

  it("每張地圖都按五關、每關五詞輸出", () => {
    tenLevelTopics.forEach(topic => {
      expect(topic.terms).toHaveLength(25);
      [1, 2, 3, 4, 5].forEach(stage => expect(getTenLevelTermStage(topic, stage)).toHaveLength(5));
    });
  });
});
