export const FAMILY_FULL_UNLOCK_PRODUCT_ID = "family_full_unlock";

type NativeTransaction = {
  purchaseId?: string;
  transactionId: string;
  products?: Array<{ id: string }>;
  finish: () => Promise<void>;
};

type NativeProduct = {
  id: string;
  pricing?: { price?: string };
  getOffer?: () => { order: (additionalData?: { applicationUsername?: string }) => Promise<unknown> } | undefined;
};

type NativeStore = {
  applicationUsername?: string;
  obfuscator?: "uuid" | "legacy";
  register: (product: unknown) => void;
  initialize: (platforms?: unknown[]) => Promise<unknown>;
  update: () => Promise<void>;
  restorePurchases: () => Promise<unknown>;
  get: (productId: string, platform?: unknown) => NativeProduct | undefined;
  when: () => { approved: (callback: (transaction: NativeTransaction) => void) => unknown };
  error: (callback: (error: { message?: string }) => void) => void;
  isReady?: boolean;
};

type NativePurchase = {
  store: NativeStore;
  Platform: { GOOGLE_PLAY: unknown };
  ProductType: { NON_CONSUMABLE: unknown };
};

declare global {
  interface Window { CdvPurchase?: NativePurchase }
}

let initialized = false;
let currentIdentity = "";
let transactionHandler: ((transaction: NativeTransaction) => Promise<void>) | null = null;
let errorHandler: ((message: string) => void) | null = null;

function nativePurchase() {
  if (typeof window === "undefined") return undefined;
  return window.CdvPurchase;
}

export function isGooglePlayBillingAvailable() {
  const native = nativePurchase();
  return Boolean(native?.store && native?.Platform?.GOOGLE_PLAY && native?.ProductType?.NON_CONSUMABLE);
}

async function handleApprovedTransaction(transaction: NativeTransaction) {
  if (!transaction.products?.some((product) => product.id === FAMILY_FULL_UNLOCK_PRODUCT_ID)) return;
  if (!transaction.purchaseId || !transactionHandler) {
    errorHandler?.("未能讀取 Google Play 購買資料，請按「恢復購買」後再試。");
    return;
  }
  try {
    await transactionHandler(transaction);
    await transaction.finish();
  } catch (error) {
    errorHandler?.(error instanceof Error ? error.message : "未能核實購買，請稍後按「恢復購買」。");
  }
}

export async function prepareGooglePlayBilling(options: {
  billingIdentity: string;
  onApproved: (transaction: NativeTransaction) => Promise<void>;
  onError: (message: string) => void;
}) {
  const native = nativePurchase();
  if (!native) return { available: false as const };
  currentIdentity = options.billingIdentity;
  transactionHandler = options.onApproved;
  errorHandler = options.onError;
  const { store, Platform, ProductType } = native;
  store.applicationUsername = currentIdentity;
  store.obfuscator = "uuid";

  if (!initialized) {
    store.register({ id: FAMILY_FULL_UNLOCK_PRODUCT_ID, type: ProductType.NON_CONSUMABLE, platform: Platform.GOOGLE_PLAY });
    store.when().approved((transaction) => { void handleApprovedTransaction(transaction); });
    store.error((error) => errorHandler?.(error.message ?? "Google Play 付款暫時未能完成。"));
    await store.initialize([Platform.GOOGLE_PLAY]);
    initialized = true;
  } else {
    await store.update();
  }
  const product = store.get(FAMILY_FULL_UNLOCK_PRODUCT_ID, Platform.GOOGLE_PLAY);
  return { available: true as const, price: product?.pricing?.price };
}

export async function purchaseFamilyFullUnlock() {
  const native = nativePurchase();
  const product = native?.store.get(FAMILY_FULL_UNLOCK_PRODUCT_ID, native.Platform.GOOGLE_PLAY);
  const offer = product?.getOffer?.();
  if (!offer) throw new Error("Google Play 尚未提供家庭完整解鎖商品。請確認你正在使用測試版，並稍後再試。");
  await offer.order({ applicationUsername: currentIdentity });
}

export async function restoreGooglePlayPurchases() {
  const native = nativePurchase();
  if (!native) throw new Error("請在 Android 的 Google Play App 版本按「恢復購買」。");
  await native.store.restorePurchases();
  await native.store.update();
}
