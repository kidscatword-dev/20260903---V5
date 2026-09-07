export const LOCAL_PLAYER_NAME_KEY = "local_player_name";
export const DEFAULT_LOCAL_PLAYER_NAME = "小小學習家";
const MAX_LOCAL_PLAYER_NAME_LENGTH = 24;

export function normalizeLocalPlayerName(value: string) {
  const normalized = value.normalize("NFKC").trim().replace(/\s+/g, " ").slice(0, MAX_LOCAL_PLAYER_NAME_LENGTH);
  return normalized || DEFAULT_LOCAL_PLAYER_NAME;
}

export function readLocalPlayerName() {
  if (typeof window === "undefined") return DEFAULT_LOCAL_PLAYER_NAME;
  try {
    return normalizeLocalPlayerName(window.localStorage.getItem(LOCAL_PLAYER_NAME_KEY) ?? "");
  } catch {
    return DEFAULT_LOCAL_PLAYER_NAME;
  }
}

export function writeLocalPlayerName(value: string) {
  const normalized = normalizeLocalPlayerName(value);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCAL_PLAYER_NAME_KEY, normalized);
    } catch {
      // 私密瀏覽模式可能禁止 localStorage；仍回傳正規化後的顯示名稱。
    }
  }
  return normalized;
}
