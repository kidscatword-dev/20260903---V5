export const TEN_LEVEL_LEARNING_PROGRESS_KEY = "traditional-character-ten-level-learning-progress-v1";
export type TenLevelLearningProgress = Record<string, number>;

export function readTenLevelLearningProgress(storage: Pick<Storage, "getItem"> = localStorage): TenLevelLearningProgress {
  try {
    const value = JSON.parse(storage.getItem(TEN_LEVEL_LEARNING_PROGRESS_KEY) ?? "{}") as Record<string, unknown>;
    return Object.fromEntries(Object.entries(value).map(([mapId, completed]) => [mapId, Math.min(3, Math.max(0, Number(completed) || 0))]));
  } catch {
    return {};
  }
}

export function writeTenLevelLearningProgress(progress: TenLevelLearningProgress, storage: Pick<Storage, "setItem"> = localStorage) {
  storage.setItem(TEN_LEVEL_LEARNING_PROGRESS_KEY, JSON.stringify(progress));
}

export function completedLearningBatches(progress: TenLevelLearningProgress, mapId: string) {
  return Math.min(3, Math.max(0, progress[mapId] ?? 0));
}

export function recordCompletedLearningBatch(progress: TenLevelLearningProgress, mapId: string, batch: number): TenLevelLearningProgress {
  return { ...progress, [mapId]: Math.min(3, Math.max(progress[mapId] ?? 0, batch + 1)) };
}

export function clearTenLevelLearningProgress(progress: TenLevelLearningProgress, mapId: string): TenLevelLearningProgress {
  const next = { ...progress };
  delete next[mapId];
  return next;
}
