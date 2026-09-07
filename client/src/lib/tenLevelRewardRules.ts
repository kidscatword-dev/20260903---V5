import type { TenLevel } from "@/data/tenLevelCatalog";
import { TEN_LEVEL_FRAGMENT_MIN_STARS, TEN_LEVEL_QUEST_STAGES_PER_MAP, tenLevelQuestStageKey, type TenLevelQuestProgress } from "@/lib/tenLevelQuestProgress";

export const isPerfectTenLevelStage = (correct: number, questionCount: number) => correct === questionCount;

export const completesTenLevelCard = (progress: TenLevelQuestProgress, level: TenLevel, mapId: string, stage: number) =>
  stage === TEN_LEVEL_QUEST_STAGES_PER_MAP
  && Array.from({ length: TEN_LEVEL_QUEST_STAGES_PER_MAP - 1 }, (_, index) => (progress[tenLevelQuestStageKey(level, mapId, index + 1)] ?? 0) >= TEN_LEVEL_FRAGMENT_MIN_STARS).every(Boolean);
