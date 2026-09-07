import { describe, expect, it } from "vitest";
import { getPictureMatchGuestDisplayName, isBetterPictureMatchTime, normalizeDisplayName, pictureMatchGuestIdSchema, SAFE_MESSAGE_OPTIONS } from "./social";

describe("兒童安全社交規則", () => {
  it("會移除暱稱首尾空白，並限制為 24 個字元", () => {
    expect(normalizeDisplayName("  小 明  ")).toBe("小 明");
    expect(normalizeDisplayName(" ")).toBe("小小學習家");
    expect(normalizeDisplayName("一二三四五六七八九十甲乙丙丁戊己庚辛壬癸子丑寅卯")).toHaveLength(24);
  });

  it("只提供已核准的固定鼓勵短句", () => {
    expect(Object.keys(SAFE_MESSAGE_OPTIONS)).toEqual(["cheer", "greatJob", "letsPlay", "star", "wave"]);
    expect(SAFE_MESSAGE_OPTIONS.greatJob.text).toBe("你做得很好！");
  });

  it("圖片文字配對只保留較快完成時間，同秒時才比較步數", () => {
    expect(isBetterPictureMatchTime({ durationSeconds: 92, moves: 11 }, null)).toBe(true);
    expect(isBetterPictureMatchTime({ durationSeconds: 91, moves: 18 }, { durationSeconds: 92, moves: 8 })).toBe(true);
    expect(isBetterPictureMatchTime({ durationSeconds: 92, moves: 10 }, { durationSeconds: 92, moves: 11 })).toBe(true);
    expect(isBetterPictureMatchTime({ durationSeconds: 92, moves: 12 }, { durationSeconds: 92, moves: 11 })).toBe(false);
    expect(isBetterPictureMatchTime({ durationSeconds: 93, moves: 8 }, { durationSeconds: 92, moves: 20 })).toBe(false);
  });

  it("訪客排行榜只接受隨機編號，且公開時只顯示末六位匿名代號", () => {
    expect(pictureMatchGuestIdSchema.safeParse("G-1A2B3C4D5E6F").success).toBe(true);
    expect(pictureMatchGuestIdSchema.safeParse("訪客小明").success).toBe(false);
    expect(getPictureMatchGuestDisplayName("G-1A2B3C4D5E6F")).toBe("訪客5E6F");
  });
});
