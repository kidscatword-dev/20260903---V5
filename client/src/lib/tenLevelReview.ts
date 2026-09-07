export const TEN_LEVEL_REVIEW_STORAGE_KEY = "traditional-character-review-library-v3";

export const readTenLevelReview = (): string[] => {
  try {
    const values = JSON.parse(localStorage.getItem(TEN_LEVEL_REVIEW_STORAGE_KEY) ?? "[]") as unknown;
    return Array.isArray(values) ? values.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

export const writeTenLevelReview = (terms: string[]) => {
  try { localStorage.setItem(TEN_LEVEL_REVIEW_STORAGE_KEY, JSON.stringify(Array.from(new Set(terms)))); } catch { /* storage may be unavailable */ }
};

export const clearTenLevelReview = () => writeTenLevelReview([]);
