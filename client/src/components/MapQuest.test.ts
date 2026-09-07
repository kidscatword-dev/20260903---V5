import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { automaticQuestionAudioKey } from "./MapQuest";

describe("地圖闖關單次自動讀音", () => {
  it("為每題建立穩定且唯一的自動讀音鍵", () => {
    const first = automaticQuestionAudioKey("preschool", "food", 0, 1, "cantonese", "香蕉");
    expect(first).toBe(automaticQuestionAudioKey("preschool", "food", 0, 1, "cantonese", "香蕉"));
    expect(first).not.toBe(automaticQuestionAudioKey("preschool", "food", 0, 2, "cantonese", "橙"));
    expect(first).not.toBe(automaticQuestionAudioKey("preschool", "food", 0, 1, "mandarin", "香蕉"));
  });

  it("在相同題目重新渲染時跳過重複讀音，重聽仍由按鈕觸發", () => {
    const source = readFileSync(new URL("./MapQuest.tsx", import.meta.url), "utf8");
    expect(source).toContain("if (automaticReadKeyRef.current === audioKey) return;");
    expect(source).toContain("automaticReadKeyRef.current = audioKey;");
    expect(source).toContain("const replay = () => { if (isPaused || !target || relistenRemaining <= 0) return;");
  });
});
