import { afterEach, describe, expect, it } from "vitest";
import { clearTenLevelReview, readTenLevelReview, TEN_LEVEL_REVIEW_STORAGE_KEY, writeTenLevelReview } from "./tenLevelReview";

const values = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  },
});

afterEach(() => values.clear());

describe("十級溫習庫", () => {
  it("保存時去除重複詞語，讀取時維持既有順序", () => {
    writeTenLevelReview(["太陽", "月亮", "太陽"]);
    expect(values.get(TEN_LEVEL_REVIEW_STORAGE_KEY)).toBe('["太陽","月亮"]');
    expect(readTenLevelReview()).toEqual(["太陽", "月亮"]);
  });

  it("遇到損壞儲存資料時安全回傳空清單", () => {
    values.set(TEN_LEVEL_REVIEW_STORAGE_KEY, "not-json");
    expect(readTenLevelReview()).toEqual([]);
  });

  it("可一鍵清空所有已收藏字詞", () => {
    writeTenLevelReview(["太陽", "月亮"]);
    clearTenLevelReview();
    expect(readTenLevelReview()).toEqual([]);
    expect(values.get(TEN_LEVEL_REVIEW_STORAGE_KEY)).toBe("[]");
  });
});
