import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("公開隱私權政策", () => {
  it("提供 Google Play 所需的公開資料做法與家長聯絡方式", () => {
    const source = readFileSync(new URL("./PrivacyPolicy.tsx", import.meta.url), "utf8");

    expect(source).toContain("隱私權政策");
    expect(source).toContain("訪客 #");
    expect(source).toContain("不放送廣告");
    expect(source).toContain("帳戶識別碼、姓名及電郵");
    expect(source).toContain("kidscatword@gmail.com");
    expect(source).toContain('Link href="/"');
  });
});
