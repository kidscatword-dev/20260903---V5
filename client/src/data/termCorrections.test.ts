import { describe, expect, it } from "vitest";
import termsV2 from "./termsV2.json";
import topicAudioV2 from "./topicAudioV2";

describe("近期詞庫修正", () => {
  it("以舒服取代不舒服，並保留該地圖關卡位置", () => {
    const comfortable = termsV2.find(term => term.term === "舒服");
    expect(comfortable).toMatchObject({ level: 1, mapId: "M04", stage: 1, stageOrder: 1, jyutping: "syu1 fuk6", pinyin: "shū fu" });
    expect(termsV2.some(term => term.term === "不舒服")).toBe(false);
    expect(topicAudioV2["舒服"]).toEqual({ cantonese: "/manus-storage/cantonese-syu1-fuk6-comfortable_3bec60f8.wav", mandarin: "/manus-storage/mandarin-shu1fu-comfortable_ee070c5d.wav" });
  });

  it("雪糕粵語顯示詞仍接入已核對的新固定音檔", () => {
    expect(topicAudioV2["冰淇淋"].cantonese).toBe("/manus-storage/cantonese-syut3-gou1-corrected_621f6824.wav");
  });
});
