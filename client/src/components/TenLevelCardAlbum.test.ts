import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("十級字卡收藏冊互動", () => {
  it("已收集字卡會先全屏展示三秒，再翻至資料面，並可翻回卡面", () => {
    const componentSource = readFileSync(new URL("./TenLevelCardAlbum.tsx", import.meta.url), "utf8");
    const styleSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");

    expect(componentSource).toContain("const [previewCardKey, setPreviewCardKey]");
    expect(componentSource).toContain("openCardPreview(cardKey)");
    expect(componentSource).toContain("}, 3000);");
    expect(componentSource).toContain("setFlippedCard(previewCardKey)");
    expect(componentSource).toContain("album-card-preview-overlay");
    expect(componentSource).toContain("album-card-flipper");
    expect(styleSource).toContain(".album-card-preview-button");
    expect(styleSource).toContain(".album-card-flipper.is-flipped");
  });
});
