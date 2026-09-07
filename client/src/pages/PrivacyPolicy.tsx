import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";

const SUPPORT_EMAIL = "kidscatword@gmail.com";

export default function PrivacyPolicy() {
  return <main className="min-h-screen bg-[#FFFDF7] px-4 py-6 text-[#394755]">
    <article className="mx-auto max-w-2xl rounded-[2rem] border-2 border-[#E9DFE8] bg-white px-5 py-6 shadow-[0_12px_28px_rgba(116,93,107,0.10)] sm:px-8">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#EDF4FF] px-4 text-sm font-black text-[#496A9B] active:scale-[0.98]"><ArrowLeft className="h-4 w-4" />返回首頁</Link>
      <header className="mt-5 border-b border-[#E9DFE8] pb-5">
        <p className="text-sm font-black text-[#E27B72]">中文認字樂</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[#37445D]">隱私權政策</h1>
        <p className="mt-2 text-sm font-bold text-[#718095]">生效日期：2026 年 8 月 27 日</p>
      </header>

      <div className="space-y-6 pt-6 text-[0.95rem] leading-7 text-[#526274]">
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">我們的原則</h2><p className="mt-2">「中文認字樂」是供香港兒童學習繁體中文的教育遊戲。孩子可在不建立帳戶的情況下使用主要認字、闖關和圖片文字配對功能。我們不放送廣告，亦不要求提供孩子的姓名、電郵、電話、位置、相機、麥克風或聯絡人資料。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">本機儲存的學習資料</h2><p className="mt-2">為保留學習進度，本應用程式會在目前裝置儲存已學字詞、溫習庫、地圖進度、音樂開關及匿名排行榜編號。這些資料主要保留在裝置內；清除瀏覽器或 App 資料後可能會被移除。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">圖片文字配對排行榜</h2><p className="mt-2">訪客完成有效配對後，可選擇以系統隨機產生的「訪客 #」編號提交最佳時間、步數及完成時間。此訪客編號不包含姓名、電郵或其他直接識別身分的資料。若家長自行登入並選擇使用帳戶排行榜，排行榜可能顯示家長設定的顯示名稱、頭像符號、最佳時間及步數。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">家長帳戶與意見聯絡</h2><p className="mt-2">登入及好友功能只供家長主動使用。家長登入時，帳戶服務可能提供帳戶識別碼、姓名及電郵，以建立及保護家長帳戶；這些資料不會顯示在公開排行榜。家長可管理顯示名稱、頭像、好友代碼、學習星星及預設鼓勵訊息。孩子不需要登入即可學習。使用「意見信箱」時，系統只會開啟使用者的電郵 App；電郵內容由家長自行決定是否寄出。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">資料分享與保護</h2><p className="mt-2">我們不出售個人資料，也不在應用程式內使用廣告追蹤。為提供網站、帳戶及排行榜服務，資料會透過加密連線傳送至受管理的服務基礎設施。公開排行榜只會顯示上述的暱稱或匿名編號及遊戲成績。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">家長的選擇與刪除要求</h2><p className="mt-2">家長可不登入，並可在裝置設定中清除本機 App 資料。如需刪除帳戶資料、排行榜、好友或其他伺服器儲存資料，請由家長以登入帳戶的聯絡電郵寄信給我們；我們會核實要求後處理。</p></section>
        <section><h2 className="font-serif text-xl font-black text-[#37445D]">政策更新與聯絡方式</h2><p className="mt-2">功能或資料做法有重大變更時，我們會更新本頁的生效日期。對本政策、資料或刪除要求有疑問，請聯絡：</p><a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("中文認字樂：隱私權查詢")}`} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-[#FFF1ED] px-4 py-3 font-black text-[#C4625D] active:scale-[0.98]"><Mail className="h-4 w-4" />{SUPPORT_EMAIL}</a></section>
      </div>
    </article>
  </main>;
}
