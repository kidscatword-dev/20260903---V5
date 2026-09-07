export const PICTURE_MATCH_GUEST_ID_STORAGE_KEY = "traditional-character-picture-match-guest-id-v1";
export const PICTURE_MATCH_GUEST_ID_PATTERN = /^G-[A-F0-9]{12}$/;

export const isPictureMatchGuestId = (value: string | null) => Boolean(value && PICTURE_MATCH_GUEST_ID_PATTERN.test(value));

export const createPictureMatchGuestId = (bytes: Uint8Array) => `G-${Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join("").slice(0, 12)}`;

const makePictureMatchGuestId = () => {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return createPictureMatchGuestId(bytes);
};

export function readOrCreatePictureMatchGuestId() {
  try {
    const saved = localStorage.getItem(PICTURE_MATCH_GUEST_ID_STORAGE_KEY);
    if (saved && isPictureMatchGuestId(saved)) return saved;
    const guestId = makePictureMatchGuestId();
    localStorage.setItem(PICTURE_MATCH_GUEST_ID_STORAGE_KEY, guestId);
    return guestId;
  } catch {
    return makePictureMatchGuestId();
  }
}
