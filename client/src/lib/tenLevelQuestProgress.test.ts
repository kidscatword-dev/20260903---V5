import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTenLevelFragmentCount, isTenLevelMapComplete, LEGACY_QUEST_PROGRESS_BACKUP_KEY, LEGACY_QUEST_PROGRESS_STORAGE_KEY, prepareTenLevelQuestProgress, readTenLevelQuestProgress, TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY, tenLevelQuestStageKey, writeTenLevelQuestProgress } from "./tenLevelQuestProgress";

describe("十級地圖進度版本化", () => {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => { memory.set(key, value); },
    clear: () => memory.clear(),
  };

  beforeEach(() => {
    memory.clear();
    vi.stubGlobal("localStorage", storage);
  });

  it("備份舊三級進度並初始化獨立十級進度", () => {
    localStorage.setItem(LEGACY_QUEST_PROGRESS_STORAGE_KEY, '{"preschool:food:stage-0":3}');
    prepareTenLevelQuestProgress();
    expect(localStorage.getItem(LEGACY_QUEST_PROGRESS_BACKUP_KEY)).toContain("preschool:food");
    expect(readTenLevelQuestProgress()).toEqual({});
  });

  it("以第 1 至第 5 關的十級地圖鍵獨立累積五塊拼圖", () => {
    const progress = Object.fromEntries(Array.from({ length: 5 }, (_, index) => [tenLevelQuestStageKey(1, "M01", index + 1), 3]));
    writeTenLevelQuestProgress(progress);
    expect(getTenLevelFragmentCount(readTenLevelQuestProgress(), 1, "M01")).toBe(5);
    expect(isTenLevelMapComplete(readTenLevelQuestProgress(), 1, "M01")).toBe(true);
  });

  it("不把舊的第 0 關鍵計入十級五塊拼圖", () => {
    const progress = Object.fromEntries(Array.from({ length: 5 }, (_, index) => [tenLevelQuestStageKey(1, "M01", index), 3]));
    expect(getTenLevelFragmentCount(progress, 1, "M01")).toBe(4);
    expect(isTenLevelMapComplete(progress, 1, "M01")).toBe(false);
  });
});
