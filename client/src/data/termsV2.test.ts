import { describe, expect, it } from "vitest";
import terms from "./termsV2.json";
import topicAudioV2 from "./topicAudioV2";

describe("十級詞庫資料", () => {
  it("包含 1,050 個不重複詞語，並保留已完成與待補讀音的正確狀態", () => {
    expect(terms).toHaveLength(1050);
    expect(new Set(terms.map(item => item.term)).size).toBe(1050);
    expect(terms.filter(item => item.audioStatus === "ready")).toHaveLength(760);
    expect(terms.filter(item => item.audioStatus === "pending")).toHaveLength(290);
  });

  it("將 1,050 個詞分配為 42 張各 25 詞地圖，且每張固定有五關五題", () => {
    const maps = new Map<string, typeof terms>();
    terms.forEach(item => maps.set(item.mapId, [...(maps.get(item.mapId) ?? []), item]));
    expect(maps).toHaveLength(42);
    maps.forEach(items => {
      expect(items).toHaveLength(25);
      expect(new Set(items.map(item => item.term)).size).toBe(25);
      expect(new Set(items.map(item => item.stage))).toEqual(new Set([1, 2, 3, 4, 5]));
      [1, 2, 3, 4, 5].forEach(stage => expect(items.filter(item => item.stage === stage)).toHaveLength(5));
    });
  });

  it("只使用第 1 至第 10 級，且每級含四至五張地圖", () => {
    const mapsByLevel = new Map<number, Set<string>>();
    terms.forEach(item => mapsByLevel.set(item.level, new Set([...(mapsByLevel.get(item.level) ?? []), item.mapId])));
    expect([...mapsByLevel.keys()].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    mapsByLevel.forEach(mapIds => expect(mapIds.size).toBeGreaterThanOrEqual(4));
    mapsByLevel.forEach(mapIds => expect(mapIds.size).toBeLessThanOrEqual(5));
  });

  it("為每個詞提供固定粵語及普通話音檔", () => {
    expect(Object.keys(topicAudioV2)).toHaveLength(1052);
    expect(new Set(Object.keys(topicAudioV2))).toEqual(new Set([...terms.map(item => item.term), "冰淇淋", "櫻桃"]));
    terms.forEach(item => {
      expect(topicAudioV2[item.term]?.cantonese).toMatch(/^\/manus-storage\//);
      expect(topicAudioV2[item.term]?.mandarin).toMatch(/^\/manus-storage\//);
    });
  });

  it("套用家長確認的書面語替換，並在 M35 使用不重複的節日詞「團拜」", () => {
    const findAt = (mapId: string, stage: number, stageOrder: number) =>
      terms.find(item => item.mapId === mapId && item.stage === stage && item.stageOrder === stageOrder);

    expect(findAt("M35", 1, 4)?.term).toBe("團拜");
    expect(findAt("M35", 1, 4)?.jyutping).toBe("tyun4 baai3");
    expect(findAt("M35", 1, 4)?.pinyin).toBe("tuán bài");
    expect(topicAudioV2["團拜"]?.cantonese).toMatch(/^\/manus-storage\//);
    expect(topicAudioV2["團拜"]?.mandarin).toMatch(/^\/manus-storage\//);
  });

  it("為「妒忌」使用已驗證可播放的逐詞直接雙語音檔", () => {
    expect(topicAudioV2["妒忌"]).toEqual({
      cantonese: "/manus-storage/cantonese-6d008121b3c1_d1329d69.mp3",
      mandarin: "/manus-storage/mandarin-6d008121b3c1_6d6927a6.mp3",
    });
  });
});
