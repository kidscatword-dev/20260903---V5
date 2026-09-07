import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("全站導覽、文字與聲音控制", () => {
  it("移除右上累積星星，讓聲音固定右上並只在選定級別後顯示繁簡字控制", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(source).toContain("global-top-controls");
    expect(source).toContain("ChineseScriptProvider");
    expect(source).toContain("toggleChineseScript");
    expect(source).toContain("scriptControlVisible");
    expect(source).toContain("onLevelSelectionChange={setScriptControlVisible}");
    expect(source).toContain("目前顯示繁體字，按此切換為簡體字");
    expect(source).toContain("聲音：開啟，按此關閉");
    expect(source).not.toContain('displayText("遊戲天地")');
    expect(source).not.toContain('displayText("練習模式")');
    expect(source).not.toContain("global-star-total");
    expect(source).not.toContain("onStarsChange={setMapStars}");
    expect(source).not.toContain("onMatchStarEarned={addMatchStar}");
    expect(styles).toContain(".global-top-controls");
    expect(styles).toContain("fixed right-4");
    expect(styles).toContain(".global-top-controls .script-toggle");
    expect(styles).not.toContain(".global-star-total");
    expect(styles).toContain(".global-home-button");
  });

  it("首頁使用原有閱讀小貓主視覺，不再使用雙貓全寬封面", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    expect(source).toContain("reading-cat-mascot_e03e748c.png");
    expect(source).toContain("拿著藍色書本的閱讀小貓吉祥物");
    expect(source).not.toContain("home-two-cats-hero");
    expect(source).not.toContain("全內容試玩已開放：第 1 至第 10 級都可以直接玩！");
  });

  it("闖關小測驗讀取十級溫習庫的已收藏字詞，而非舊三級溫習庫", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    expect(source).toContain('import { readTenLevelReview } from "@/lib/tenLevelReview";');
    expect(source).toContain("const [tenLevelReviewKeys, setTenLevelReviewKeys]");
    expect(source).toContain("reviewTerms={quizReviewTerms}");
    expect(source).toContain("allTerms={tenLevelTerms}");
    expect(source).toContain("setTenLevelReviewKeys(readTenLevelReview());");
  });

  it("主要學習與遊戲元件以顯示轉換工具處理可見字詞", () => {
    const files = ["../components/TenLevelPractice.tsx", "../components/TenLevelMapQuest.tsx", "../components/WordGames.tsx", "../components/TenLevelReview.tsx", "../components/TenLevelSearch.tsx", "../components/TenLevelCardAlbum.tsx"];
    files.forEach((file) => {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).toContain("useChineseScript");
      expect(source).toContain("displayText");
    });
    const games = readFileSync(new URL("../components/WordGames.tsx", import.meta.url), "utf8");
    expect(games).toContain("displayText(word.term)");
    expect(games).not.toContain("displayText(game.description)");
  });
});

  it("付款不再依賴 Manus 登入，並已移除好友樂園入口", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    const unlock = readFileSync(new URL("../components/FamilyUnlockScreen.tsx", import.meta.url), "utf8");
    const main = readFileSync(new URL("../main.tsx", import.meta.url), "utf8");
    expect(source).toContain("readOrCreateBillingInstallId");
    expect(source).toContain('trpc.billing.status.useQuery({ installId: billingInstallId }');
    expect(source).toContain('verifyGooglePlayPurchase.mutateAsync({ installId: billingInstallId, purchaseToken });');
    expect(source).not.toContain("startLogin");
    expect(source).not.toContain("FriendsHub");
    expect(unlock).toContain("在 Google Play 購買");
    expect(unlock).toContain("我是家長");
    expect(unlock).not.toContain("家長登入後繼續");
    expect(main).not.toContain("redirectToLoginIfUnauthorized");
    expect(main).not.toContain("startLogin");
  });
