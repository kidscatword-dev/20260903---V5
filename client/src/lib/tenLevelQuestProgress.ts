import type { TenLevel } from "@/data/tenLevelCatalog";

export type TenLevelQuestProgress = Record<string, number>;

export const TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY = "traditional-character-map-quest-progress-v3";
export const LEGACY_QUEST_PROGRESS_STORAGE_KEY = "traditional-character-map-quest-progress-v1";
export const LEGACY_QUEST_PROGRESS_BACKUP_KEY = "traditional-character-map-quest-progress-v1-backup-before-v3";
export const TEN_LEVEL_QUEST_STAGES_PER_MAP = 5;
export const TEN_LEVEL_FRAGMENT_MIN_STARS = 3;

export const tenLevelQuestStageKey = (level: TenLevel, mapId: string, stage: number) => `v3:${level}:${mapId}:stage-${stage}`;

export const prepareTenLevelQuestProgress = () => {
  try {
    const legacy = localStorage.getItem(LEGACY_QUEST_PROGRESS_STORAGE_KEY);
    if (legacy && !localStorage.getItem(LEGACY_QUEST_PROGRESS_BACKUP_KEY)) localStorage.setItem(LEGACY_QUEST_PROGRESS_BACKUP_KEY, legacy);
    if (!localStorage.getItem(TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY)) localStorage.setItem(TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY, "{}");
  } catch { /* local storage may be unavailable in a restricted browser context */ }
};

export const readTenLevelQuestProgress = (): TenLevelQuestProgress => {
  prepareTenLevelQuestProgress();
  try { return JSON.parse(localStorage.getItem(TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY) ?? "{}") as TenLevelQuestProgress; } catch { return {}; }
};

export const writeTenLevelQuestProgress = (progress: TenLevelQuestProgress) => {
  try { localStorage.setItem(TEN_LEVEL_QUEST_PROGRESS_STORAGE_KEY, JSON.stringify(progress)); } catch { /* retain in-memory play state if storage is unavailable */ }
};

export const getTenLevelFragmentCount = (progress: TenLevelQuestProgress, level: TenLevel, mapId: string) =>
  Array.from({ length: TEN_LEVEL_QUEST_STAGES_PER_MAP }, (_, index) => progress[tenLevelQuestStageKey(level, mapId, index + 1)] ?? 0).filter(stars => stars >= TEN_LEVEL_FRAGMENT_MIN_STARS).length;

export const isTenLevelMapComplete = (progress: TenLevelQuestProgress, level: TenLevel, mapId: string) =>
  getTenLevelFragmentCount(progress, level, mapId) === TEN_LEVEL_QUEST_STAGES_PER_MAP;
