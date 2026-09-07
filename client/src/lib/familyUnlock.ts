/** 家庭完整解鎖一律由伺服器核實 Google Play 購買後授權。 */
export type LearningLevel = "preschool" | "junior" | "senior";

export const isPremiumLevel = (level: LearningLevel) => level === "junior" || level === "senior";

/** 第 1 級始終免費；第 2 至第 10 級須由伺服器核實的家庭權益開放。 */
export const isTenLevelLocked = (level: number, familyUnlocked: boolean) => level > 1 && !familyUnlocked;

export function restrictTenLevelTerms<T extends { level: number }>(terms: T[], familyUnlocked: boolean) {
  return familyUnlocked ? terms : terms.filter((term) => term.level === 1);
}

const LOCAL_FAMILY_UNLOCK_KEY = "chinese-word-library-family-full-unlock-v1";

export function readLocalFamilyUnlock() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(LOCAL_FAMILY_UNLOCK_KEY) === "verified-google-play";
}

/** 只應在伺服器成功核實 Google Play token 後呼叫。 */
export function writeLocalFamilyUnlock() {
  if (typeof window !== "undefined") window.localStorage.setItem(LOCAL_FAMILY_UNLOCK_KEY, "verified-google-play");
}

export { LOCAL_FAMILY_UNLOCK_KEY };
