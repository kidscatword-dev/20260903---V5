import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("使用者提供的互動音效", () => {
  it("僅為完整字卡合成固定使用已上傳的 card MP3", () => {
    const source = readFileSync(new URL("./rewardAudio.ts", import.meta.url), "utf8");

    expect(source).toContain('export const USER_CARD_AUDIO = "/manus-storage/card_5a49a3f0.mp3"');
    expect(source).toContain('playUserEffect("card", 0.56)');
    expect(source).not.toContain("Pop_698b65b5.mp3");
    expect(source).not.toContain("playButtonTap");
    expect(source).not.toContain("Flip_e62052f7.mp3");
    expect(source).not.toContain("playCardFlip");
  });

  it("預載 card，並避免完整字卡合成時的重複音效", () => {
    const source = readFileSync(new URL("./rewardAudio.ts", import.meta.url), "utf8");

    expect(source).toContain("const preloadUserEffects");
    expect(source).toContain("template.cloneNode(true)");
    expect(source).toContain("now - lastCardCompleteAt < 700");
  });
});
