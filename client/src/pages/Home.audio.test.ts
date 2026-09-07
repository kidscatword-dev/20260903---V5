import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("固定讀音預載", () => {
  it("保留小型音檔快取並優先播放已預載的音檔", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

    expect(source).toContain("audioCacheRef");
    expect(source).toContain("const preloadTrack = useCallback");
    expect(source).toContain("audioCacheRef.current.size > 32");
    expect(source).toContain("audioCacheRef.current.get(source) ?? new Audio(source)");
  });

  it("全站按鍵處理只維持背景音樂啟動，不播放 Pop", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

    expect(source).toContain("if (musicEnabled && track) startBackgroundMusic(track);");
    expect(source).not.toContain("playButtonTap");
  });

  it("圖片文字配對遊戲會使用既有 Game 背景音樂，而其他小遊戲維持既有規則", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

    expect(source).toContain("getBackgroundTrackFor(screen, mapMusicActive, practiceMusicActive, activeWordGame)");
    expect(source).toContain('go("wordGame", game);');
  });
});
