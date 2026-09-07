import { describe, expect, it } from "vitest";
import { tenLevelQuestStageKey } from "./tenLevelQuestProgress";
import { completesTenLevelCard, isPerfectTenLevelStage } from "./tenLevelRewardRules";

describe("十級全對與卡片合成規則", () => {
  it("只有五題全對才觸發全對小貓獎勵", () => {
    expect(isPerfectTenLevelStage(5, 5)).toBe(true);
    expect(isPerfectTenLevelStage(4, 5)).toBe(false);
  });

  it("第五關全對且前四關已有碎片才觸發五片合成", () => {
    const progress = Object.fromEntries([1, 2, 3, 4].map(stage => [tenLevelQuestStageKey(1, "M01", stage), 3]));
    expect(completesTenLevelCard(progress, 1, "M01", 5)).toBe(true);
    expect(completesTenLevelCard({ ...progress, [tenLevelQuestStageKey(1, "M01", 4)]: 2 }, 1, "M01", 5)).toBe(false);
  });
});
