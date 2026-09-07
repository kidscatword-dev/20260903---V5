import { describe, expect, it } from "vitest";
import { getPerfectRewardNextView } from "./tenLevelPerfectRewardFlow";

describe("十級全對慶祝後的自動推進", () => {
  it("第 1 至第 4 關全對後自動前往下一關", () => {
    expect(getPerfectRewardNextView(1, false)).toBe("challenge");
    expect(getPerfectRewardNextView(4, false)).toBe("challenge");
  });

  it("第五關集齊五塊時進入合成，否則返回陸地", () => {
    expect(getPerfectRewardNextView(5, true)).toBe("assembly");
    expect(getPerfectRewardNextView(5, false)).toBe("land");
  });
});
