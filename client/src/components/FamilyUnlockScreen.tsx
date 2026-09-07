/**
 * 家庭完整解鎖：不要求 Manus 登入；付款資料只交由 Google Play 處理。
 */
import { ArrowLeft, Check, LockKeyhole, RefreshCw, ShieldCheck, Sparkles, Store } from "lucide-react";
import { useState } from "react";

export type UnlockSource = "home" | "practice" | "map" | "album";

const sourceCopy: Record<UnlockSource, string> = {
  home: "第 1 級免費；家長可在此解鎖第 2 至第 10 級。",
  practice: "中級及高級的系統練習會在家庭解鎖後開放。",
  map: "中級及高級探險地圖會在家庭解鎖後開放。",
  album: "中級及高級字卡收藏冊會在家庭解鎖後開放。",
};

type FamilyUnlockScreenProps = {
  unlocked: boolean;
  source: UnlockSource;
  onBack: () => void;
  billingReady: boolean;
  nativeBillingAvailable: boolean;
  price?: string;
  busy: boolean;
  message?: string;
  onPurchase: () => void;
  onRestore: () => void;
};

export function FamilyUnlockScreen({
  unlocked,
  source,
  onBack,
  billingReady,
  nativeBillingAvailable,
  price,
  busy,
  message,
  onPurchase,
  onRestore,
}: FamilyUnlockScreenProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  return <main className="mx-auto flex min-h-screen max-w-md flex-col bg-[#FFF9ED] px-5 pb-8 pt-5 text-[#26324B] sm:max-w-xl">
    <header className="flex items-center justify-between">
      <button onClick={onBack} className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#47745D] shadow-sm transition hover:bg-[#FFF7DF] active:scale-95" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button>
      <div className="text-center"><p className="font-serif text-2xl font-black">家長專區</p><small className="font-bold text-[#76839A]">一次性家庭解鎖預覽</small></div>
      <div className="w-11" />
    </header>

    <section className={`mt-6 overflow-hidden rounded-[2.35rem] border-4 p-6 text-center shadow-[0_12px_28px_rgba(43,61,79,.10)] ${unlocked ? "border-[#A8D9AF] bg-[#EAF8EC]" : "border-[#F2DEAB] bg-[radial-gradient(circle_at_50%_0%,#FFFCEF_0%,#FFF8E7_60%,#FCEFD1_100%)]"}`}>
      <div className={`mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] shadow-sm ${unlocked ? "bg-[#74B982] text-white" : "bg-[#263C71] text-[#F8D269]"}`}>{unlocked ? <ShieldCheck className="h-9 w-9" /> : <LockKeyhole className="h-9 w-9" />}</div>
      <p className="mt-4 text-sm font-black tracking-[0.12em] text-[#8A7040]">{unlocked ? "此裝置已解鎖" : "家長專用一次性解鎖"}</p>
      <h1 className="mt-2 font-serif text-3xl font-black text-[#263C71]">{unlocked ? "全級別學習已開放" : "家庭解鎖"}</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm font-bold leading-6 text-[#66768B]">{unlocked ? "第 2 至第 10 級的練習、地圖闖關及字卡收藏冊，現已開放。" : sourceCopy[source]}</p>
    </section>

    <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-[0_7px_20px_rgba(43,61,79,.08)]">
      <div className="flex items-center justify-between border-b border-[#EDE5D4] pb-4"><div><p className="text-sm font-black text-[#78879A]">一口價・永久解鎖</p><h2 className="mt-1 font-serif text-2xl font-black text-[#263C71]">家庭完整解鎖</h2></div><div className="text-right"><strong className="font-serif text-3xl font-black text-[#E06F5F]">{price ?? "HK$48"}</strong><small className="mt-1 block text-xs font-bold text-[#8290A1]">非訂閱制</small></div></div>
      <ul className="mt-4 space-y-3 text-sm font-bold leading-5 text-[#53657E]">
        <li className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E7F5EA] text-[#4D9B5F]"><Check className="h-4 w-4" /></span><span><b className="text-[#263C71]">第 1 級所有內容</b>持續免費開放。</span></li>
        <li className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E7F5EA] text-[#4D9B5F]"><Check className="h-4 w-4" /></span><span><b className="text-[#263C71]">第 2 至第 10 級</b>練習、地圖闖關及字卡收藏冊全開放。</span></li>
      </ul>
    </section>

    {unlocked ? <section className="mt-5 rounded-[1.7rem] border-2 border-dashed border-[#B8DABF] bg-white/75 p-5 text-center"><Sparkles className="mx-auto h-6 w-6 text-[#E2AA2D]" /><p className="mt-2 text-sm font-bold leading-6 text-[#60748B]">這部裝置已保存 Google Play 核實的家庭完整解鎖。若重新安裝或清除 App 資料，請用同一 Google Play 帳戶恢復購買。</p><button onClick={onRestore} disabled={busy || !nativeBillingAvailable} className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#E2C678] bg-[#FFF9E7] px-4 py-3 text-sm font-black text-[#9A762B] transition hover:bg-[#FFF1C4] active:scale-95 disabled:opacity-45"><RefreshCw className="h-4 w-4" />恢復購買</button></section> : <>
      <label className="mt-5 flex items-start gap-3 rounded-[1.5rem] border-2 border-[#DDE7ED] bg-white/80 p-4 text-left text-sm font-bold leading-6 text-[#61748A]"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="mt-1 h-5 w-5 accent-[#F5B83D]" /><span>我是家長。我明白按下購買會開啟 Google Play 的一次性付款流程，以解鎖第 2 至第 10 級；付款前仍可在 Google Play 確認。此 App 不會在這裡收集付款資料。</span></label>
      {!nativeBillingAvailable ? <p className="mt-4 rounded-2xl bg-[#F3F6FB] px-4 py-3 text-center text-sm font-bold leading-6 text-[#60748B]"><Store className="mr-1 inline h-4 w-4" />請在 Android 的 Google Play App 版本購買；網頁版不會提供其他付款連結。</p> : !billingReady ? <p className="mt-4 rounded-2xl bg-[#FFF6DF] px-4 py-3 text-center text-sm font-bold leading-6 text-[#8A7040]">付款核實服務仍在設定中，暫時未能購買。</p> : <>
        <button onClick={onPurchase} disabled={!acknowledged || busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5B83D] px-5 py-4 text-lg font-black text-[#26324B] shadow-[0_5px_0_#D79526] transition hover:bg-[#FFD269] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"><ShieldCheck className="h-5 w-5" />{busy ? "正在連接 Google Play…" : "在 Google Play 購買"}</button>
        <button onClick={onRestore} disabled={busy} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#DDE7ED] bg-white px-5 py-3 text-sm font-black text-[#53657E] transition active:scale-95"><RefreshCw className="h-4 w-4" />恢復已購買內容</button>
      </>}
    </>}
    {message && <p className="mt-4 rounded-2xl bg-[#F3F6FB] px-4 py-3 text-center text-sm font-bold leading-6 text-[#60748B]">{message}</p>}
    <p className="mt-5 text-center text-xs font-bold leading-5 text-[#8692A1]">Android 數碼內容付款只經 Google Play 處理；我們不會在這個畫面收集付款資料。</p>
  </main>;
}
