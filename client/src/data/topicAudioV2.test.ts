import { describe, expect, it } from "vitest";
import termsV2 from "./termsV2.json";
import topicAudioV2 from "./topicAudioV2";
import signalAudit from "../../../docs/wav-signal-audit-report.json";
import parentReportedIssues from "../../../docs/家長回傳_讀音問題清單.json";

describe("十級固定雙語讀音映射", () => {
  it("為 1,050 個正式詞語提供粵語及普通話固定音檔", () => {
    expect(termsV2).toHaveLength(1050);
    for (const item of termsV2) {
      expect(topicAudioV2[item.term]?.cantonese, `缺少「${item.term}」粵語音檔`).toMatch(/^\/manus-storage\/.+\.(mp3|wav)$/);
      expect(topicAudioV2[item.term]?.mandarin, `缺少「${item.term}」普通話音檔`).toMatch(/^\/manus-storage\/.+\.(mp3|wav)$/);
    }
  });

  it("為 M34 媒體與通訊的 25 個詞使用逐詞製作的相容 MP3", () => {
    const mediaTerms = termsV2.filter((item) => item.mapId === "M34");
    expect(mediaTerms).toHaveLength(25);
    for (const item of mediaTerms) {
      expect(topicAudioV2[item.term]?.cantonese).toMatch(/^\/manus-storage\/m34-\d{2}-cantonese_.+\.mp3$/);
      expect(topicAudioV2[item.term]?.mandarin).toMatch(/^\/manus-storage\/m34-\d{2}-mandarin_.+\.mp3$/);
    }
    expect(topicAudioV2["雜誌"].cantonese).toMatch(/^\/manus-storage\/m34-23-cantonese_.+\.mp3$/);
    expect(topicAudioV2["讀者"].cantonese).toMatch(/^\/manus-storage\/m34-16-cantonese_.+\.mp3$/);
    expect(topicAudioV2["數碼"].mandarin).toMatch(/^\/manus-storage\/m34-01-mandarin_.+\.mp3$/);
  });

  it("替換低速訊號稽核確認的近乎靜音 WAV", () => {
    expect(signalAudit.suspicious).toHaveLength(50);
    for (const item of signalAudit.suspicious) {
      expect(topicAudioV2[item.term]?.[item.language as "cantonese" | "mandarin"])
        .toMatch(/^\/manus-storage\/(?:repair-\d{2}|parent-repair-\d{3})-(?:cantonese|mandarin)_.+\.mp3$/);
    }
  });

  it("為後加的 325 個詞保留完整雙語映射，並固定數碼的相容讀音", () => {
    const addedSources = new Set(["漏字.xlsx 推薦加入", "本輪補充詞（家長確認採用）"]);
    const addedTerms = termsV2.filter((item) => addedSources.has(item.source));
    expect(addedTerms).toHaveLength(325);
    for (const item of addedTerms) {
      expect(topicAudioV2[item.term]?.cantonese, `缺少新增詞「${item.term}」粵語音檔`).toMatch(/^\/manus-storage\/.+\.(mp3|wav)$/);
      expect(topicAudioV2[item.term]?.mandarin, `缺少新增詞「${item.term}」普通話音檔`).toMatch(/^\/manus-storage\/.+\.(mp3|wav)$/);
    }
    expect(topicAudioV2["數碼"]).toEqual({
      cantonese: expect.stringMatching(/^\/manus-storage\/m34-01-cantonese_.+\.mp3$/),
      mandarin: expect.stringMatching(/^\/manus-storage\/m34-01-mandarin_.+\.mp3$/),
    });
  });

  it("以新 MP3 覆蓋家長回報無聲的 490 段讀音", () => {
    const silentEntries = parentReportedIssues.issues.filter((item) => item.status === "無聲");
    expect(silentEntries).toHaveLength(490);
    for (const item of silentEntries) {
      expect(topicAudioV2[item.term]?.[item.language as "cantonese" | "mandarin"], `${item.term} ${item.language} 未修正`)
        .toMatch(/^\/manus-storage\/parent-repair-\d{3}-(?:cantonese|mandarin)_.+\.mp3$/);
    }
  });
});
