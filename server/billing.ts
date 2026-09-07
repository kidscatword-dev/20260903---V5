import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { GoogleAuth } from "google-auth-library";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { familyBillingProfiles, familyEntitlements, googlePlayPurchases, users } from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";
import { publicProcedure, router } from "./_core/trpc";

export const GOOGLE_PLAY_PACKAGE_NAME = "com.fantichinese.wordlibrary";
export const FAMILY_FULL_UNLOCK_PRODUCT_ID = "family_full_unlock";
export const FAMILY_FULL_UNLOCK_ENTITLEMENT = "family_full_unlock";

export const billingInstallIdSchema = z.string().trim().min(16).max(64).regex(/^[a-f0-9-]+$/i, "無效的安裝身份");

export type GooglePurchaseResponse = {
  orderId?: string;
  obfuscatedExternalAccountId?: string;
  acknowledgementState?: string;
  purchaseCompletionTime?: string;
  productLineItem?: Array<{ productId?: string }>;
  purchaseStateContext?: { purchaseState?: string };
};

export function hashPurchaseToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** 與 cordova-plugin-purchase 的 uuid obfuscator 格式保持一致。 */
export function obfuscateBillingIdentity(identity: string) {
  const hash = createHash("md5").update(identity).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-3${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export function isPurchaseBoundToBillingIdentity(purchase: GooglePurchaseResponse, identity: string) {
  return purchase.obfuscatedExternalAccountId === obfuscateBillingIdentity(identity);
}

export function isCompletedFamilyUnlockPurchase(purchase: GooglePurchaseResponse) {
  return purchase.purchaseStateContext?.purchaseState === "PURCHASED"
    && purchase.productLineItem?.some((item) => item.productId === FAMILY_FULL_UNLOCK_PRODUCT_ID) === true;
}

function encryptionKey() {
  if (!ENV.cookieSecret || ENV.cookieSecret.length < 16) {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "付款核實服務尚未完成設定，暫時不能購買。" });
  }
  return createHash("sha256").update(`${ENV.cookieSecret}:google-play-purchase-token`).digest();
}

export function encryptPurchaseToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64url");
}

export function decryptPurchaseToken(ciphertext: string) {
  const packed = Buffer.from(ciphertext, "base64url");
  const iv = packed.subarray(0, 12);
  const authTag = packed.subarray(12, 28);
  const encrypted = packed.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "家庭解鎖服務暫時未能使用，請稍後再試。" });
  return db;
}

function serviceAccountCredentials() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Google Play 付款核實仍在設定中，暫時未能開始購買。" });
  try {
    const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
    if (!parsed.client_email || !parsed.private_key) throw new Error("missing fields");
    return parsed;
  } catch {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Google Play 付款核實設定無效，請聯絡支援。" });
  }
}

async function googlePlayRequest<T>(path: string, init?: { method?: "POST"; body?: unknown }) {
  const auth = new GoogleAuth({ credentials: serviceAccountCredentials(), scopes: ["https://www.googleapis.com/auth/androidpublisher"] });
  const client = await auth.getClient();
  const response = await client.request<T>({
    url: `https://androidpublisher.googleapis.com/androidpublisher/v3/${path}`,
    method: init?.method ?? "GET",
    data: init?.body,
  });
  return response.data;
}

function anonymousBillingOpenId(installId: string) {
  return `billing-install-${createHash("sha256").update(installId).digest("hex").slice(0, 48)}`;
}

async function getOrCreateAnonymousBillingUser(installId: string) {
  const db = await requireDb();
  const openId = anonymousBillingOpenId(installId);
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.openId, openId)).limit(1);
  if (existing[0]) return existing[0].id;

  try {
    await db.insert(users).values({
      openId,
      name: "Anonymous Billing Install",
      loginMethod: "anonymous-billing",
      role: "user",
    });
  } catch {
    const createdElsewhere = await db.select({ id: users.id }).from(users).where(eq(users.openId, openId)).limit(1);
    if (createdElsewhere[0]) return createdElsewhere[0].id;
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "暫時未能準備家庭解鎖資料，請稍後再試。" });
  }

  const created = await db.select({ id: users.id }).from(users).where(eq(users.openId, openId)).limit(1);
  if (!created[0]) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "暫時未能準備家庭解鎖資料，請稍後再試。" });
  return created[0].id;
}

async function getOrCreateBillingIdentity(installId: string) {
  const db = await requireDb();
  const userId = await getOrCreateAnonymousBillingUser(installId);
  const existing = await db.select().from(familyBillingProfiles).where(eq(familyBillingProfiles.userId, userId)).limit(1);
  if (existing[0]) return { userId, billingIdentity: existing[0].billingIdentity };

  try {
    await db.insert(familyBillingProfiles).values({ userId, billingIdentity: installId });
  } catch {
    const createdElsewhere = await db.select().from(familyBillingProfiles).where(eq(familyBillingProfiles.userId, userId)).limit(1);
    if (createdElsewhere[0]) return { userId, billingIdentity: createdElsewhere[0].billingIdentity };
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "暫時未能準備家庭解鎖資料，請稍後再試。" });
  }
  return { userId, billingIdentity: installId };
}

export async function hasActiveFamilyUnlock(userId: number) {
  const db = await requireDb();
  const entitlement = await db.select().from(familyEntitlements).where(and(
    eq(familyEntitlements.userId, userId),
    eq(familyEntitlements.entitlementKey, FAMILY_FULL_UNLOCK_ENTITLEMENT),
    eq(familyEntitlements.active, 1),
  )).limit(1);
  return Boolean(entitlement[0]);
}

async function acknowledgeGooglePurchase(purchaseToken: string, identity: string) {
  await googlePlayRequest(`applications/${GOOGLE_PLAY_PACKAGE_NAME}/purchases/productsv2/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`, {
    method: "POST",
    body: { developerPayload: identity },
  });
}

export async function hasFamilyUnlockForInstall(installId: string) {
  const { userId } = await getOrCreateBillingIdentity(billingInstallIdSchema.parse(installId));
  return hasActiveFamilyUnlock(userId);
}

const billingInput = z.object({ installId: billingInstallIdSchema });

export const billingRouter = router({
  status: publicProcedure.input(billingInput).query(async ({ input }) => {
    const { userId, billingIdentity } = await getOrCreateBillingIdentity(input.installId);
    return {
      hasFamilyUnlock: await hasActiveFamilyUnlock(userId),
      billingIdentity,
      productId: FAMILY_FULL_UNLOCK_PRODUCT_ID,
      isVerificationConfigured: Boolean(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON),
    };
  }),

  verifyGooglePlayPurchase: publicProcedure.input(z.object({
    installId: billingInstallIdSchema,
    purchaseToken: z.string().trim().min(16).max(8192),
  })).mutation(async ({ input }) => {
    const db = await requireDb();
    const { userId, billingIdentity } = await getOrCreateBillingIdentity(input.installId);
    const tokenHash = hashPurchaseToken(input.purchaseToken);
    const existing = await db.select().from(googlePlayPurchases).where(eq(googlePlayPurchases.purchaseTokenHash, tokenHash)).limit(1);

    let purchase: GooglePurchaseResponse;
    try {
      purchase = await googlePlayRequest<GooglePurchaseResponse>(`applications/${GOOGLE_PLAY_PACKAGE_NAME}/purchases/productsv2/tokens/${encodeURIComponent(input.purchaseToken)}`);
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({ code: "BAD_REQUEST", message: "未能核實 Google Play 購買，請稍後再按「恢復購買」。" });
    }
    if (!isCompletedFamilyUnlockPurchase(purchase)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "這筆交易尚未完成，未能開放家庭解鎖。" });
    }

    // Google Play 已用 package/product/token 驗證真正購買者；不再要求 OAuth
    // 或把購買綁定到某個 Manus 帳戶，故同一 Google Play 帳戶可在重裝後恢復。
    const acknowledged = purchase.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED";
    if (!acknowledged) await acknowledgeGooglePurchase(input.purchaseToken, billingIdentity);
    const now = new Date();
    const purchaseValues = {
      userId,
      productId: FAMILY_FULL_UNLOCK_PRODUCT_ID,
      purchaseTokenHash: tokenHash,
      purchaseTokenCiphertext: encryptPurchaseToken(input.purchaseToken),
      orderId: purchase.orderId ?? null,
      purchaseState: "purchased" as const,
      acknowledgedAt: now,
      purchaseTime: purchase.purchaseCompletionTime ? new Date(purchase.purchaseCompletionTime) : null,
      verifiedAt: now,
      revokedAt: null,
    };
    if (existing[0]) await db.update(googlePlayPurchases).set(purchaseValues).where(eq(googlePlayPurchases.id, existing[0].id));
    else await db.insert(googlePlayPurchases).values(purchaseValues);

    const activeEntitlement = await db.select().from(familyEntitlements).where(and(
      eq(familyEntitlements.userId, userId),
      eq(familyEntitlements.entitlementKey, FAMILY_FULL_UNLOCK_ENTITLEMENT),
    )).limit(1);
    if (activeEntitlement[0]) {
      await db.update(familyEntitlements).set({ active: 1, grantedAt: now, revokedAt: null }).where(eq(familyEntitlements.id, activeEntitlement[0].id));
    } else {
      await db.insert(familyEntitlements).values({ userId, entitlementKey: FAMILY_FULL_UNLOCK_ENTITLEMENT, source: "google_play", active: 1, grantedAt: now });
    }
    return { hasFamilyUnlock: true };
  }),
});
