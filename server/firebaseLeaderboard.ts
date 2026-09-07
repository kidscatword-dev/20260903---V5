import { createHash } from "node:crypto";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { TRPCError } from "@trpc/server";
import { billingInstallIdSchema, hasFamilyUnlockForInstall } from "./billing";
import { z } from "zod";

export const pictureMatchGuestIdSchema = z.string().regex(/^G-[A-F0-9]{12}$/);

export const FIREBASE_LEADERBOARD_COLLECTION = "pictureMatchLeaderboard";
export const FIREBASE_NAME_CLAIM_COLLECTION = "pictureMatchNameClaims";

const DEFAULT_DISPLAY_NAME = "小小學習家";
const MAX_DISPLAY_NAME_LENGTH = 24;

type FirebaseServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

type FirebaseAdminCredential = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export type PictureMatchScore = {
  durationSeconds: number;
  moves: number;
};

export type FirestoreLeaderboardEntry = PictureMatchScore & {
  entryId: string;
  ownerKey: string;
  displayName: string;
  avatarEmoji: string;
  completedAt: Date;
  isMe: boolean;
};

let firebaseApp: App | null = null;
let firestore: Firestore | null = null;

function firebaseProjectId() {
  return process.env.FIREBASE_PROJECT_ID?.trim() ?? "";
}

function readServiceAccountRaw() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (encoded) {
    try {
      return Buffer.from(encoded, "base64").toString("utf8").trim();
    } catch {
      return "";
    }
  }
  return process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ?? "";
}

export function decodeServiceAccountJson(raw: string, expectedProjectId = firebaseProjectId()) {
  try {
    const parsed = JSON.parse(raw) as FirebaseServiceAccountJson;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
    if (expectedProjectId && parsed.project_id !== expectedProjectId) return null;
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    } satisfies FirebaseAdminCredential;
  } catch {
    return null;
  }
}

function parseServiceAccount(): FirebaseAdminCredential | null {
  const raw = readServiceAccountRaw();
  return raw ? decodeServiceAccountJson(raw) : null;
}

function getFirestoreDb() {
  if (firestore) return firestore;
  const credentials = parseServiceAccount();
  const projectId = firebaseProjectId() || credentials?.projectId || "";
  if (!credentials || projectId !== "kids-cat-word") return null;

  try {
    firebaseApp = getApps()[0] ?? initializeApp({
      credential: cert(credentials),
      projectId,
    });
    firestore = getFirestore(firebaseApp);
    return firestore;
  } catch {
    firebaseApp = null;
    firestore = null;
    return null;
  }
}

export function isFirebaseLeaderboardConfigured() {
  return Boolean(getFirestoreDb());
}

export async function checkFirebaseConnection() {
  const configured = Boolean(readServiceAccountRaw());
  const credentials = parseServiceAccount();
  const projectId = firebaseProjectId() || credentials?.projectId || "";
  const db = getFirestoreDb();
  if (!configured || !db) {
    return { configured: false, projectId, firestoreReachable: false } as const;
  }

  try {
    await db.listCollections();
    return { configured: true, projectId, firestoreReachable: true } as const;
  } catch (error) {
    const code = error instanceof Error ? error.name : "FirebaseConnectionError";
    return { configured: true, projectId, firestoreReachable: false, errorCode: code } as const;
  }
}

export function normalizeLeaderboardName(value: string | undefined) {
  const normalized = (value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").slice(0, MAX_DISPLAY_NAME_LENGTH);
  return normalized || DEFAULT_DISPLAY_NAME;
}

export function leaderboardNameKey(value: string) {
  return createHash("sha256").update(value.normalize("NFKC").toLocaleLowerCase("zh-HK")).digest("hex");
}

export function paidLeaderboardOwnerKey(installId: string) {
  return `paid-${createHash("sha256").update(installId).digest("hex").slice(0, 40)}`;
}

export function guestLeaderboardOwnerKey(guestId: string) {
  return `guest-${createHash("sha256").update(guestId).digest("hex").slice(0, 40)}`;
}

export function guestLeaderboardDisplayName(guestId: string) {
  return `訪客${guestId.slice(-4)}`;
}

function requireFirestore() {
  const db = getFirestoreDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Firebase 排行榜尚未完成設定，暫時沿用現有排行榜。" });
  return db;
}

function validateScore(score: PictureMatchScore) {
  if (!Number.isInteger(score.durationSeconds) || score.durationSeconds < 8 || score.durationSeconds > 180) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "完成時間不符合圖片文字配對規則。" });
  }
  if (!Number.isInteger(score.moves) || score.moves < 8 || score.moves > 80) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "翻卡步數不符合圖片文字配對規則。" });
  }
}

function isBetterScore(candidate: PictureMatchScore, current?: PictureMatchScore) {
  return !current || candidate.durationSeconds < current.durationSeconds
    || (candidate.durationSeconds === current.durationSeconds && candidate.moves < current.moves);
}

function timestampToDate(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate() as Date;
  if (value instanceof Date) return value;
  return new Date(0);
}

export async function submitFirestorePictureMatchScore(input: {
  installId: string;
  guestId: string;
  displayName?: string;
  durationSeconds: number;
  moves: number;
}) {
  validateScore(input);
  const installId = billingInstallIdSchema.parse(input.installId);
  const guestId = pictureMatchGuestIdSchema.parse(input.guestId);
  const db = requireFirestore();
  const isPaid = await hasFamilyUnlockForInstall(installId);
  const ownerKey = isPaid ? paidLeaderboardOwnerKey(installId) : guestLeaderboardOwnerKey(guestId);
  const displayName = isPaid ? normalizeLeaderboardName(input.displayName) : guestLeaderboardDisplayName(guestId);
  const ownerRef = db.collection(FIREBASE_LEADERBOARD_COLLECTION).doc(ownerKey);
  const nameRef = db.collection(FIREBASE_NAME_CLAIM_COLLECTION).doc(leaderboardNameKey(displayName));

  let improved = false;
  await db.runTransaction(async (transaction) => {
    const ownerSnapshot = await transaction.get(ownerRef);
    const current = ownerSnapshot.exists ? ownerSnapshot.data() : undefined;
    const currentScore = current && typeof current.durationSeconds === "number" && typeof current.moves === "number"
      ? { durationSeconds: current.durationSeconds, moves: current.moves }
      : undefined;
    improved = isBetterScore(input, currentScore);

    if (isPaid) {
      const nameSnapshot = await transaction.get(nameRef);
      const claimedBy = nameSnapshot.exists ? nameSnapshot.data()?.ownerKey : undefined;
      if (claimedBy && claimedBy !== ownerKey) {
        throw new TRPCError({ code: "CONFLICT", message: "這個名字已有人使用，請換另一個名字。" });
      }

      const oldName = typeof current?.displayName === "string" ? current.displayName : undefined;
      if (oldName && oldName !== displayName) {
        transaction.delete(db.collection(FIREBASE_NAME_CLAIM_COLLECTION).doc(leaderboardNameKey(oldName)));
      }
      transaction.set(nameRef, { ownerKey, displayName, updatedAt: new Date() });
    }

    const nextScore = improved ? input : currentScore ?? input;
    transaction.set(ownerRef, {
      ownerKey,
      displayName,
      avatarEmoji: isPaid ? "🐱" : "🎮",
      durationSeconds: nextScore.durationSeconds,
      moves: nextScore.moves,
      completedAt: improved ? new Date() : current?.completedAt ?? new Date(),
      updatedAt: new Date(),
      isPaid,
    }, { merge: true });
  });

  return {
    improved,
    best: improved ? input : undefined,
    anonymous: !isPaid,
    displayName,
  };
}

export async function updateFirestorePictureMatchDisplayName(input: {
  installId: string;
  guestId: string;
  displayName?: string;
}) {
  const installId = billingInstallIdSchema.parse(input.installId);
  const guestId = pictureMatchGuestIdSchema.parse(input.guestId);
  const db = requireFirestore();
  const isPaid = await hasFamilyUnlockForInstall(installId);
  const ownerKey = isPaid ? paidLeaderboardOwnerKey(installId) : guestLeaderboardOwnerKey(guestId);
  const displayName = isPaid ? normalizeLeaderboardName(input.displayName) : guestLeaderboardDisplayName(guestId);

  if (!isPaid) return { success: true, anonymous: true, displayName } as const;

  const ownerRef = db.collection(FIREBASE_LEADERBOARD_COLLECTION).doc(ownerKey);
  const nameRef = db.collection(FIREBASE_NAME_CLAIM_COLLECTION).doc(leaderboardNameKey(displayName));
  await db.runTransaction(async (transaction) => {
    const ownerSnapshot = await transaction.get(ownerRef);
    const current = ownerSnapshot.exists ? ownerSnapshot.data() : undefined;
    const nameSnapshot = await transaction.get(nameRef);
    const claimedBy = nameSnapshot.exists ? nameSnapshot.data()?.ownerKey : undefined;
    if (claimedBy && claimedBy !== ownerKey) {
      throw new TRPCError({ code: "CONFLICT", message: "這個名字已有人使用，請換另一個名字。" });
    }

    const oldName = typeof current?.displayName === "string" ? current.displayName : undefined;
    if (oldName && oldName !== displayName) {
      transaction.delete(db.collection(FIREBASE_NAME_CLAIM_COLLECTION).doc(leaderboardNameKey(oldName)));
    }
    transaction.set(nameRef, { ownerKey, displayName, updatedAt: new Date() });
    if (ownerSnapshot.exists) transaction.set(ownerRef, { displayName, avatarEmoji: "🐱", isPaid: true, updatedAt: new Date() }, { merge: true });
  });

  return { success: true, anonymous: false, displayName } as const;
}

export async function readFirestorePictureMatchLeaderboard(input: { installId: string; guestId: string }) {
  const installId = billingInstallIdSchema.parse(input.installId);
  const guestId = pictureMatchGuestIdSchema.parse(input.guestId);
  const db = requireFirestore();
  const isPaid = await hasFamilyUnlockForInstall(installId);
  const myOwnerKey = isPaid ? paidLeaderboardOwnerKey(installId) : guestLeaderboardOwnerKey(guestId);
  const snapshot = await db.collection(FIREBASE_LEADERBOARD_COLLECTION).get();
  const entries = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      entryId: `firebase-${document.id}`,
      ownerKey: document.id,
      displayName: typeof data.displayName === "string" ? data.displayName : "訪客XXXX",
      avatarEmoji: typeof data.avatarEmoji === "string" ? data.avatarEmoji : "🎮",
      durationSeconds: Number(data.durationSeconds),
      moves: Number(data.moves),
      completedAt: timestampToDate(data.completedAt),
      isMe: document.id === myOwnerKey,
    } satisfies FirestoreLeaderboardEntry;
  }).filter((entry) => Number.isFinite(entry.durationSeconds) && Number.isFinite(entry.moves))
    .sort((left, right) => left.durationSeconds - right.durationSeconds || left.moves - right.moves || left.completedAt.getTime() - right.completedAt.getTime());
  const myIndex = entries.findIndex((entry) => entry.isMe);
  return {
    entries: entries.slice(0, 50).map((entry, index) => ({ ...entry, rank: index + 1 })),
    myRank: myIndex === -1 ? null : myIndex + 1,
    totalPlayers: entries.length,
  };
}
