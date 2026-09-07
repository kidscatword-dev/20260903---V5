import { describe, expect, it } from "vitest";
import terms from "./terms.json";
import topicAudio from "./topicAudio";

const findTerm = (term: string) => terms.find((entry) => entry.term === term);

describe("規範書面語詞庫修訂", () => {
  it("以已確認的書面語詞替換口語或非目標詞，並保留 870 個不重複詞語", () => {
    expect(terms).toHaveLength(870);
    expect(new Set(terms.map((entry) => entry.term)).size).toBe(870);

    [
      "家中",
      "鑰匙",
      "踢球",
      "冰淇淋",
      "巧克力",
      "害羞",
      "飢餓",
      "兔子",
      "小魚",
      "湯匙",
      "冰箱",
      "皮球",
      "玩偶",
      "櫻桃",
      "餛飩",
      "氣球",
    ].forEach((term) => {
      expect(findTerm(term)).toBeDefined();
      expect(topicAudio[term]?.cantonese).toBeTruthy();
      expect(topicAudio[term]?.mandarin).toBeTruthy();
    });

    [
      "屋企",
      "鎖匙",
      "踢波",
      "雪糕",
      "朱古力",
      "怕醜",
      "肚餓",
      "兔仔",
      "魚仔",
      "匙羹",
      "雪櫃",
      "波波",
      "毛公仔",
      "車厘子",
      "雲吞",
    ].forEach((term) => expect(findTerm(term)).toBeUndefined());
  });

  it("保留校巴詞彙並修正完整粵拼", () => {
    expect(findTerm("校巴")?.jyutping).toBe("haau6 baa1");
  });
});
