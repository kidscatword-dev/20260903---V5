import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { familyProfiles, friendConnections, pictureMatchBestTimes, pictureMatchGuestBestTimes, safeMessages } from "../drizzle/schema";
import { getDb } from "./db";
import { billingInstallIdSchema } from "./billing";
import {
  isFirebaseLeaderboardConfigured,
  readFirestorePictureMatchLeaderboard,
  submitFirestorePictureMatchScore,
  updateFirestorePictureMatchDisplayName,
} from "./firebaseLeaderboard";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const FRIEND_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const safeMessageKeySchema = z.enum(["cheer", "greatJob", "letsPlay", "star", "wave"]);
const pictureMatchScoreSchema = z.object({
  durationSeconds: z.number().int().min(8).max(180),
  moves: z.number().int().min(8).max(80),
});
export const pictureMatchGuestIdSchema = z.string().regex(/^G-[A-F0-9]{12}$/);

export const SAFE_MESSAGE_OPTIONS = {
  cheer: { emoji: "💪", text: "一起加油！" },
  greatJob: { emoji: "👏", text: "你做得很好！" },
  letsPlay: { emoji: "🎮", text: "一起努力闖關！" },
  star: { emoji: "⭐", text: "送你一顆星！" },
  wave: { emoji: "👋", text: "你好呀，學習朋友！" },
} as const;

export function normalizeDisplayName(value: string) {
  const compact = value.trim().replace(/\s+/g, " ").slice(0, 24);
  return compact || "小小學習家";
}

export function isBetterPictureMatchTime(
  candidate: { durationSeconds: number; moves: number },
  current?: { durationSeconds: number; moves: number } | null,
) {
  if (!current) return true;
  return candidate.durationSeconds < current.durationSeconds
    || (candidate.durationSeconds === current.durationSeconds && candidate.moves < current.moves);
}

export function getPictureMatchGuestDisplayName(guestId: string) {
  return `訪客${guestId.slice(-4)}`;
}

function createFriendCode() {
  return Array.from({ length: 8 }, () => FRIEND_CODE_ALPHABET[Math.floor(Math.random() * FRIEND_CODE_ALPHABET.length)]).join("");
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "學習朋友服務暫時未能使用，請稍後再試。" });
  return db;
}

async function getOrCreateProfile(userId: number, preferredName?: string) {
  const db = await requireDb();
  const existing = await db.select().from(familyProfiles).where(eq(familyProfiles.userId, userId)).limit(1);
  if (existing[0]) return existing[0];

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const friendCode = createFriendCode();
    try {
      await db.insert(familyProfiles).values({ userId, friendCode, displayName: normalizeDisplayName(preferredName ?? "") });
      const created = await db.select().from(familyProfiles).where(eq(familyProfiles.userId, userId)).limit(1);
      if (created[0]) return created[0];
    } catch {
      // 好友代碼碰巧重複時，重新產生一次即可。
    }
  }
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "暫時未能建立好友代碼，請稍後再試。" });
}

async function getAcceptedFriendIds(profileId: number) {
  const db = await requireDb();
  const connections = await db.select().from(friendConnections).where(and(
    eq(friendConnections.status, "accepted"),
    or(eq(friendConnections.requesterProfileId, profileId), eq(friendConnections.addresseeProfileId, profileId)),
  ));
  return connections.map((connection) => connection.requesterProfileId === profileId ? connection.addresseeProfileId : connection.requesterProfileId);
}

async function assertAcceptedFriend(profileId: number, friendProfileId: number) {
  const ids = await getAcceptedFriendIds(profileId);
  if (!ids.includes(friendProfileId)) throw new TRPCError({ code: "FORBIDDEN", message: "只可以與已確認的學習朋友互動。" });
}

function publicProfile(profile: typeof familyProfiles.$inferSelect) {
  return { id: profile.id, displayName: profile.displayName, friendCode: profile.friendCode, avatarEmoji: profile.avatarEmoji, learningStars: profile.learningStars };
}

export const socialRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => publicProfile(await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined))),

  updateProfile: protectedProcedure.input(z.object({ displayName: z.string().min(1).max(48), avatarEmoji: z.string().min(1).max(12) })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, input.displayName);
    await db.update(familyProfiles).set({ displayName: normalizeDisplayName(input.displayName), avatarEmoji: input.avatarEmoji }).where(eq(familyProfiles.id, profile.id));
    const updated = await db.select().from(familyProfiles).where(eq(familyProfiles.id, profile.id)).limit(1);
    return publicProfile(updated[0] ?? profile);
  }),

  syncStars: protectedProcedure.input(z.object({ stars: z.number().int().min(0).max(1_000_000) })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    const nextStars = Math.max(profile.learningStars, input.stars);
    if (nextStars !== profile.learningStars) await db.update(familyProfiles).set({ learningStars: nextStars }).where(eq(familyProfiles.id, profile.id));
    return { learningStars: nextStars };
  }),

  submitPictureMatchTime: publicProcedure.input(pictureMatchScoreSchema.extend({
    guestId: pictureMatchGuestIdSchema.optional(),
    installId: billingInstallIdSchema.optional(),
    displayName: z.string().trim().max(24).optional(),
  })).mutation(async ({ ctx, input }) => {
    if (isFirebaseLeaderboardConfigured()) {
      if (!input.installId || !input.guestId) throw new TRPCError({ code: "BAD_REQUEST", message: "請重新開始圖片文字配對，以建立排行榜身份。" });
      return submitFirestorePictureMatchScore({ ...input, installId: input.installId, guestId: input.guestId });
    }

    const db = await requireDb();
    const { guestId, installId: _installId, displayName: _displayName, ...score } = input;
    if (ctx.user) {
      const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
      const existing = await db.select().from(pictureMatchBestTimes).where(eq(pictureMatchBestTimes.profileId, profile.id)).limit(1);
      const current = existing[0];
      const improved = isBetterPictureMatchTime(score, current);
      if (!current) {
        await db.insert(pictureMatchBestTimes).values({ profileId: profile.id, ...score });
      } else if (improved) {
        await db.update(pictureMatchBestTimes).set({ ...score, completedAt: new Date() }).where(eq(pictureMatchBestTimes.id, current.id));
      }
      const best = improved ? score : { durationSeconds: current?.durationSeconds ?? score.durationSeconds, moves: current?.moves ?? score.moves };
      return { improved, best, anonymous: false, displayName: profile.displayName };
    }

    if (!guestId) throw new TRPCError({ code: "BAD_REQUEST", message: "請重新開始圖片文字配對，以建立匿名排行榜編號。" });
    const existing = await db.select().from(pictureMatchGuestBestTimes).where(eq(pictureMatchGuestBestTimes.guestId, guestId)).limit(1);
    const current = existing[0];
    const improved = isBetterPictureMatchTime(score, current);
    if (!current) {
      await db.insert(pictureMatchGuestBestTimes).values({ guestId, ...score });
    } else if (improved) {
      await db.update(pictureMatchGuestBestTimes).set({ ...score, completedAt: new Date() }).where(eq(pictureMatchGuestBestTimes.id, current.id));
    }
    const best = improved ? score : { durationSeconds: current?.durationSeconds ?? score.durationSeconds, moves: current?.moves ?? score.moves };
    return { improved, best, anonymous: true, displayName: getPictureMatchGuestDisplayName(guestId) };
  }),

  updatePictureMatchDisplayName: publicProcedure.input(z.object({
    installId: billingInstallIdSchema,
    guestId: pictureMatchGuestIdSchema,
    displayName: z.string().trim().max(24).optional(),
  })).mutation(async ({ input }) => {
    if (isFirebaseLeaderboardConfigured()) return updateFirestorePictureMatchDisplayName(input);
    return {
      success: true,
      anonymous: true,
      displayName: getPictureMatchGuestDisplayName(input.guestId),
    } as const;
  }),

  pictureMatchLeaderboard: publicProcedure.input(z.object({
    guestId: pictureMatchGuestIdSchema.optional(),
    installId: billingInstallIdSchema.optional(),
  })).query(async ({ ctx, input }) => {
    if (isFirebaseLeaderboardConfigured()) {
      if (!input.installId || !input.guestId) throw new TRPCError({ code: "BAD_REQUEST", message: "請重新開始圖片文字配對，以建立排行榜身份。" });
      return readFirestorePictureMatchLeaderboard({ installId: input.installId, guestId: input.guestId });
    }

    const db = await requireDb();
    const profile = ctx.user ? await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined) : null;
    const profileEntries = await db.select({
      profileId: familyProfiles.id,
      displayName: familyProfiles.displayName,
      avatarEmoji: familyProfiles.avatarEmoji,
      durationSeconds: pictureMatchBestTimes.durationSeconds,
      moves: pictureMatchBestTimes.moves,
      completedAt: pictureMatchBestTimes.completedAt,
    }).from(pictureMatchBestTimes).innerJoin(familyProfiles, eq(pictureMatchBestTimes.profileId, familyProfiles.id))
      .orderBy(asc(pictureMatchBestTimes.durationSeconds), asc(pictureMatchBestTimes.moves), asc(pictureMatchBestTimes.completedAt));
    const guestEntries = await db.select({
      id: pictureMatchGuestBestTimes.id,
      guestId: pictureMatchGuestBestTimes.guestId,
      durationSeconds: pictureMatchGuestBestTimes.durationSeconds,
      moves: pictureMatchGuestBestTimes.moves,
      completedAt: pictureMatchGuestBestTimes.completedAt,
    }).from(pictureMatchGuestBestTimes);
    const entries = [
      ...profileEntries.map((entry) => ({ entryId: `profile-${entry.profileId}`, displayName: entry.displayName, avatarEmoji: entry.avatarEmoji, durationSeconds: entry.durationSeconds, moves: entry.moves, completedAt: entry.completedAt, isMe: entry.profileId === profile?.id })),
      ...guestEntries.map((entry) => ({ entryId: `guest-${entry.id}`, displayName: getPictureMatchGuestDisplayName(entry.guestId), avatarEmoji: "🎮", durationSeconds: entry.durationSeconds, moves: entry.moves, completedAt: entry.completedAt, isMe: !profile && entry.guestId === input.guestId })),
    ].sort((left, right) => left.durationSeconds - right.durationSeconds || left.moves - right.moves || left.completedAt.getTime() - right.completedAt.getTime());
    const myIndex = entries.findIndex((entry) => entry.isMe);
    return {
      entries: entries.slice(0, 50).map((entry, index) => ({ ...entry, rank: index + 1 })),
      myRank: myIndex === -1 ? null : myIndex + 1,
      totalPlayers: entries.length,
    };
  }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    const friendIds = await getAcceptedFriendIds(profile.id);
    const friends = friendIds.length ? await db.select().from(familyProfiles).where(inArray(familyProfiles.id, friendIds)) : [];
    const receivedRequests = await db.select().from(friendConnections).where(and(eq(friendConnections.addresseeProfileId, profile.id), eq(friendConnections.status, "pending")));
    const requesters = receivedRequests.length ? await db.select().from(familyProfiles).where(inArray(familyProfiles.id, receivedRequests.map((request) => request.requesterProfileId))) : [];
    const recentMessages = friendIds.length ? await db.select().from(safeMessages).where(or(eq(safeMessages.senderProfileId, profile.id), eq(safeMessages.recipientProfileId, profile.id))).orderBy(desc(safeMessages.createdAt)).limit(20) : [];
    const leaderboard = [profile, ...friends].sort((left, right) => right.learningStars - left.learningStars || left.displayName.localeCompare(right.displayName)).map(publicProfile);
    return {
      profile: publicProfile(profile),
      friends: friends.map(publicProfile),
      requests: receivedRequests.map((request) => ({ id: request.id, profile: publicProfile(requesters.find((candidate) => candidate.id === request.requesterProfileId)!) })),
      leaderboard,
      messages: recentMessages.map((message) => ({ id: message.id, fromMe: message.senderProfileId === profile.id, friendProfileId: message.senderProfileId === profile.id ? message.recipientProfileId : message.senderProfileId, messageKey: message.messageKey, createdAt: message.createdAt })),
    };
  }),

  sendFriendRequest: protectedProcedure.input(z.object({ friendCode: z.string().trim().toUpperCase().length(8) })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    const target = await db.select().from(familyProfiles).where(eq(familyProfiles.friendCode, input.friendCode)).limit(1);
    const friend = target[0];
    if (!friend) throw new TRPCError({ code: "NOT_FOUND", message: "找不到這個好友代碼，請再核對一次。" });
    if (friend.id === profile.id) throw new TRPCError({ code: "BAD_REQUEST", message: "這是你自己的好友代碼。" });
    const existing = await db.select().from(friendConnections).where(or(
      and(eq(friendConnections.requesterProfileId, profile.id), eq(friendConnections.addresseeProfileId, friend.id)),
      and(eq(friendConnections.requesterProfileId, friend.id), eq(friendConnections.addresseeProfileId, profile.id)),
    )).limit(1);
    const connection = existing[0];
    if (connection?.status === "accepted") throw new TRPCError({ code: "CONFLICT", message: "你們已經是學習朋友。" });
    if (connection?.status === "blocked") throw new TRPCError({ code: "FORBIDDEN", message: "暫時不能加入這位學習朋友。" });
    if (connection?.status === "pending" && connection.requesterProfileId === friend.id) {
      await db.update(friendConnections).set({ status: "accepted", respondedAt: new Date() }).where(eq(friendConnections.id, connection.id));
      return { accepted: true, message: "已雙方確認，成為學習朋友！" };
    }
    if (connection?.status === "pending") throw new TRPCError({ code: "CONFLICT", message: "好友邀請已送出，等待對方家長確認。" });
    if (connection) await db.delete(friendConnections).where(eq(friendConnections.id, connection.id));
    await db.insert(friendConnections).values({ requesterProfileId: profile.id, addresseeProfileId: friend.id });
    return { accepted: false, message: "好友邀請已送出，等待對方家長確認。" };
  }),

  respondToRequest: protectedProcedure.input(z.object({ requestId: z.number().int().positive(), accept: z.boolean() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    const request = await db.select().from(friendConnections).where(eq(friendConnections.id, input.requestId)).limit(1);
    if (!request[0] || request[0].addresseeProfileId !== profile.id || request[0].status !== "pending") throw new TRPCError({ code: "NOT_FOUND", message: "這個好友邀請已經處理。" });
    await db.update(friendConnections).set({ status: input.accept ? "accepted" : "declined", respondedAt: new Date() }).where(eq(friendConnections.id, request[0].id));
    return { accepted: input.accept };
  }),

  removeFriend: protectedProcedure.input(z.object({ friendProfileId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    await assertAcceptedFriend(profile.id, input.friendProfileId);
    await db.delete(friendConnections).where(or(
      and(eq(friendConnections.requesterProfileId, profile.id), eq(friendConnections.addresseeProfileId, input.friendProfileId)),
      and(eq(friendConnections.requesterProfileId, input.friendProfileId), eq(friendConnections.addresseeProfileId, profile.id)),
    ));
    return { success: true };
  }),

  blockFriend: protectedProcedure.input(z.object({ friendProfileId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    const existing = await db.select().from(friendConnections).where(or(
      and(eq(friendConnections.requesterProfileId, profile.id), eq(friendConnections.addresseeProfileId, input.friendProfileId)),
      and(eq(friendConnections.requesterProfileId, input.friendProfileId), eq(friendConnections.addresseeProfileId, profile.id)),
    )).limit(1);
    if (!existing[0]) throw new TRPCError({ code: "NOT_FOUND", message: "找不到這位學習朋友。" });
    if (existing[0].requesterProfileId === profile.id) {
      await db.update(friendConnections).set({ status: "blocked", respondedAt: new Date() }).where(eq(friendConnections.id, existing[0].id));
    } else {
      await db.delete(friendConnections).where(eq(friendConnections.id, existing[0].id));
      await db.insert(friendConnections).values({ requesterProfileId: profile.id, addresseeProfileId: input.friendProfileId, status: "blocked", respondedAt: new Date() });
    }
    return { success: true };
  }),

  sendSafeMessage: protectedProcedure.input(z.object({ friendProfileId: z.number().int().positive(), messageKey: safeMessageKeySchema })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const profile = await getOrCreateProfile(ctx.user.id, ctx.user.name ?? undefined);
    await assertAcceptedFriend(profile.id, input.friendProfileId);
    await db.insert(safeMessages).values({ senderProfileId: profile.id, recipientProfileId: input.friendProfileId, messageKey: input.messageKey });
    return { success: true };
  }),
});
