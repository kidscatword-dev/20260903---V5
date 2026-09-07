import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("圖片文字配對公開排行榜", () => {
  it("訪客可帶本機匿名編號讀取排行榜，且不再要求登入", () => {
    const source = readFileSync(new URL("./PictureMatchLeaderboard.tsx", import.meta.url), "utf8");

    expect(source).toContain("useQuery({ guestId, installId })");
    expect(source).toContain("updatePictureMatchDisplayName");
    expect(source).toContain("key={entry.entryId}");
    expect(source).toContain("未付款玩家上榜時會顯示「訪客XXXX」");
    expect(source).not.toContain("startLogin");
  });
});
