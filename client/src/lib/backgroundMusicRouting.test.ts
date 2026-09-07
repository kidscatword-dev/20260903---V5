import { describe, expect, it } from "vitest";
import { getBackgroundTrackFor } from "./backgroundMusicRouting";

describe("getBackgroundTrackFor", () => {
  it("只在練習的選級與主題選擇階段播放 Whole 音樂", () => {
    expect(getBackgroundTrackFor("home", true, true)).toBe("whole");
    expect(getBackgroundTrackFor("level", true, true)).toBe("whole");
    expect(getBackgroundTrackFor("level", true, false)).toBeNull();
    expect(getBackgroundTrackFor("category", true, false)).toBe("whole");
  });

  it("在地圖導覽與圖片文字配對期間播放 Game 音樂，其他作答及結算時停止", () => {
    expect(getBackgroundTrackFor("gameHub", true, true)).toBe("game");
    expect(getBackgroundTrackFor("gameMode", true, true)).toBe("game");
    expect(getBackgroundTrackFor("gameMode", false, true)).toBeNull();
    expect(getBackgroundTrackFor("wordGame", true, true, "match")).toBe("game");
    expect(getBackgroundTrackFor("wordGame", true, true, "reviewQuest")).toBeNull();
    expect(getBackgroundTrackFor("matchLeaderboard", true, true, "match")).toBeNull();
  });
});
