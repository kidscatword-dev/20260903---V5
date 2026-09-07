const BILLING_INSTALL_ID_KEY = "chinese-word-library-billing-install-id";

function createInstallId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  throw new Error("瀏覽器不支援安全的本機付款身份產生器。");
}

/** Anonymous install identity used only for Google Play entitlement binding. */
export function readOrCreateBillingInstallId() {
  if (typeof window === "undefined") return "server-render-install";

  const existing = window.localStorage.getItem(BILLING_INSTALL_ID_KEY);
  if (existing && /^[a-f0-9-]{16,64}$/i.test(existing)) return existing;

  const created = createInstallId();
  window.localStorage.setItem(BILLING_INSTALL_ID_KEY, created);
  return created;
}

export { BILLING_INSTALL_ID_KEY };

export function isBillingInstallId(value: string) {
  return /^[a-f0-9-]{16,64}$/i.test(value);
}

export function resetBillingInstallIdForTesting() {
  if (typeof window !== "undefined") window.localStorage.removeItem(BILLING_INSTALL_ID_KEY);
}
