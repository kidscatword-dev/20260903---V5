import { describe, expect, it } from "vitest";
import { tenLevelTopics } from "@/data/tenLevelCatalog";
import { getTenLevelCardArt } from "./tenLevelCardArt";

describe("十級真實主題字卡映射", () => {
  it("為 42 張地圖全數接入家長提供的獨立原卡", () => {
    expect(tenLevelTopics).toHaveLength(42);
    tenLevelTopics.forEach(topic => {
      const art = getTenLevelCardArt(topic);
      expect(art?.src).toMatch(new RegExp(`^/manus-storage/${topic.id}_`));
      expect(art?.isStandalone).toBe(true);
      expect(art?.offset).toBe("0%");
    });
  });

  it("維持僅按地圖識別碼查詢卡面的相容性", () => {
    expect(getTenLevelCardArt({ id: "M01" })?.src).toMatch(/^\/manus-storage\/M01_/);
    expect(getTenLevelCardArt({ id: "M42" })?.src).toMatch(/^\/manus-storage\/M42_/);
  });
});
