import { describe, expect, it } from "vitest";
import { billingInstallIdSchema, FAMILY_FULL_UNLOCK_PRODUCT_ID, hashPurchaseToken, isCompletedFamilyUnlockPurchase, isPurchaseBoundToBillingIdentity, obfuscateBillingIdentity } from "./billing";

describe("Google Play 家庭完整解鎖核實", () => {
  it("只接受 Google 回覆中已完成且含正確單次產品的購買", () => {
    expect(isCompletedFamilyUnlockPurchase({ purchaseStateContext: { purchaseState: "PURCHASED" }, productLineItem: [{ productId: FAMILY_FULL_UNLOCK_PRODUCT_ID }] })).toBe(true);
    expect(isCompletedFamilyUnlockPurchase({ purchaseStateContext: { purchaseState: "PENDING" }, productLineItem: [{ productId: FAMILY_FULL_UNLOCK_PRODUCT_ID }] })).toBe(false);
    expect(isCompletedFamilyUnlockPurchase({ purchaseStateContext: { purchaseState: "PURCHASED" }, productLineItem: [{ productId: "wrong_product" }] })).toBe(false);
  });

  it("以固定 SHA-256 雜湊識別購買 token，而不將 token 用作資料庫索引", () => {
    expect(hashPurchaseToken("purchase-token-example")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashPurchaseToken("purchase-token-example")).toBe(hashPurchaseToken("purchase-token-example"));
  });

  it("保留 Google Play 購買的匿名 obfuscation 格式檢查", () => {
    const identity = "family-1e349ca0-4ed1-40c6-b3ae-03543ac7633e";
    const accountId = obfuscateBillingIdentity(identity);
    expect(accountId).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-8[a-f0-9]{3}-[a-f0-9]{12}$/);
    expect(isPurchaseBoundToBillingIdentity({ obfuscatedExternalAccountId: accountId }, identity)).toBe(true);
    expect(isPurchaseBoundToBillingIdentity({ obfuscatedExternalAccountId: accountId }, "family-other")).toBe(false);
    expect(isPurchaseBoundToBillingIdentity({}, identity)).toBe(false);
  });
});

  it("只接受本機匿名 installId，不接受帳戶資料或任意文字", () => {
    expect(billingInstallIdSchema.safeParse("1e349ca0-4ed1-40c6-b3ae-03543ac7633e").success).toBe(true);
    expect(billingInstallIdSchema.safeParse("short").success).toBe(false);
    expect(billingInstallIdSchema.safeParse("family@example.com").success).toBe(false);
    expect(billingInstallIdSchema.safeParse("1e349ca0_4ed1_40c6_b3ae_03543ac7633e").success).toBe(false);
  });
