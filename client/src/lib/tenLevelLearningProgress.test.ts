import { describe, expect, it } from "vitest";
import { clearTenLevelLearningProgress, completedLearningBatches, recordCompletedLearningBatch } from "./tenLevelLearningProgress";

describe("ten-level learning progress", () => {
  it("將每張主題地圖的學習進度限制在三組", () => {
    const afterFirst = recordCompletedLearningBatch({}, "M01", 0);
    expect(completedLearningBatches(afterFirst, "M01")).toBe(1);
    expect(completedLearningBatches(recordCompletedLearningBatch(afterFirst, "M01", 8), "M01")).toBe(3);
  });

  it("只清除指定主題的學習紀錄", () => {
    expect(clearTenLevelLearningProgress({ M01: 3, M02: 1 }, "M01")).toEqual({ M02: 1 });
  });
});
