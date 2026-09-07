/**
 * 繁體認字樂地圖闖關資料提醒：所有獎勵與收藏冊均從每個主題五關的最高星數進度推導，
 * 不另建重複的收藏紀錄，確保通關後字卡立即同步。
 */
export type QuestLevel = "preschool" | "junior" | "senior";
export type QuestProgress = Record<string, number>;

export const QUEST_PROGRESS_STORAGE_KEY = "traditional-character-map-quest-progress-v1";
export const QUEST_STAGES_PER_LAND = 5;
// 每關必須 6/6 全對（3 星）才可取得一塊主題字卡拼圖。
export const QUEST_FRAGMENT_MIN_STARS = 3;

export const questStageKey = (level: QuestLevel, topicId: string, stage: number) => `${level}:${topicId}:stage-${stage}`;

export const isQuestLandComplete = (progress: QuestProgress, level: QuestLevel, topicId: string) =>
  Array.from({ length: QUEST_STAGES_PER_LAND }, (_, stage) => progress[questStageKey(level, topicId, stage)] ?? 0).every((stars) => stars >= QUEST_FRAGMENT_MIN_STARS);

export const getQuestFragmentCount = (progress: QuestProgress, level: QuestLevel, topicId: string) =>
  Array.from({ length: QUEST_STAGES_PER_LAND }, (_, stage) => progress[questStageKey(level, topicId, stage)] ?? 0).filter((stars) => stars >= QUEST_FRAGMENT_MIN_STARS).length;

export const readQuestProgress = (): QuestProgress => {
  try { return JSON.parse(localStorage.getItem(QUEST_PROGRESS_STORAGE_KEY) ?? "{}") as QuestProgress; } catch { return {}; }
};
