import { describe, expect, it } from "vitest";
import topicAudioV2 from "@/data/topicAudioV2";
import { getCantoneseJyutping, getLanguageWord, getLanguageWordCounterpart, getLanguageWordLabel, getLanguageWordSummary } from "./wordLanguageVariants";

describe("粵語與普通話分詞顯示", () => {
  it("冰淇淋在粵語使用雪糕，在普通話保留冰淇淋", () => {
    expect(getLanguageWord("冰淇淋", "cantonese")).toBe("雪糕");
    expect(getLanguageWordCounterpart("冰淇淋", "cantonese")).toBe("冰淇淋");
    expect(getLanguageWordCounterpart("冰淇淋", "mandarin")).toBe("雪糕");
    expect(getCantoneseJyutping("冰淇淋", "bing1 kei4 lam4")).toBe("syut3 gou1");
    expect(getLanguageWordLabel("冰淇淋", "cantonese")).toBe("雪糕（冰淇淋）");
    expect(getLanguageWord("冰淇淋", "mandarin")).toBe("冰淇淋");
    expect(topicAudioV2["冰淇淋"].cantonese).toBe("/manus-storage/cantonese-syut3-gou1-corrected_621f6824.wav");
    expect(topicAudioV2["冰淇淋"].mandarin).toBe("/manus-storage/mandarin-ice-cream_22c0a218.wav");
  });

  it("巧克力在粵語使用朱古力，在普通話保留巧克力", () => {
    expect(getLanguageWord("巧克力", "cantonese")).toBe("朱古力");
    expect(getLanguageWordCounterpart("巧克力", "cantonese")).toBe("巧克力");
    expect(getCantoneseJyutping("巧克力", "haau2 hak1 lik6")).toBe("zyu1 gu1 lik1");
    expect(getLanguageWordLabel("巧克力", "cantonese")).toBe("朱古力（巧克力）");
    expect(getLanguageWord("巧克力", "mandarin")).toBe("巧克力");
    expect(topicAudioV2["巧克力"].cantonese).toBe("/manus-storage/word-030_60bcf4a2.mp3");
    expect(topicAudioV2["巧克力"].mandarin).toBe("/manus-storage/mandarin-chocolate_c3e7ddb5.wav");
  });

  it("草莓在粵語使用士多啤梨，在普通話保留草莓", () => {
    expect(getLanguageWord("草莓", "cantonese")).toBe("士多啤梨");
    expect(getLanguageWordCounterpart("草莓", "cantonese")).toBe("草莓");
    expect(getLanguageWordLabel("草莓", "mandarin")).toBe("草莓（士多啤梨）");
    expect(getCantoneseJyutping("草莓", "cou2 mui2")).toBe("si6 do1 be1 lei4");
    expect(topicAudioV2["草莓"].cantonese).toBe("/manus-storage/cantonese-65d35dd76c38_4d832214.mp3");
  });

  it("巴士在普通話使用公交車，在粵語保留巴士", () => {
    expect(getLanguageWord("巴士", "cantonese")).toBe("巴士");
    expect(getLanguageWord("巴士", "mandarin")).toBe("公交車");
    expect(getLanguageWordCounterpart("巴士", "mandarin")).toBe("巴士");
    expect(getLanguageWordLabel("巴士", "cantonese")).toBe("巴士（公交車）");
    expect(topicAudioV2["巴士"].mandarin).toBe("/manus-storage/mandarin-gong1-jiao1-che1_ba6f55d3.wav");
  });

  it("的士在普通話使用出租車，在粵語保留的士", () => {
    expect(getLanguageWord("的士", "mandarin")).toBe("出租車");
    expect(getLanguageWordLabel("的士", "cantonese")).toBe("的士（出租車）");
    expect(getCantoneseJyutping("的士", "dik1 si2")).toBe("dik1 si2");
    expect(topicAudioV2["的士"].mandarin).toBe("/manus-storage/mandarin-chu1-zu1-che1_69e83860.wav");
  });

  it("單車在普通話使用自行車，在粵語保留單車", () => {
    expect(getLanguageWord("單車", "mandarin")).toBe("自行車");
    expect(getLanguageWordCounterpart("單車", "mandarin")).toBe("單車");
    expect(getLanguageWordLabel("單車", "cantonese")).toBe("單車（自行車）");
    expect(topicAudioV2["單車"].mandarin).toBe("/manus-storage/mandarin-zi4-xing2-che1_0c9542b3.wav");
  });

  it("櫻桃在粵語使用車厘子，在普通話保留櫻桃", () => {
    expect(getLanguageWord("櫻桃", "cantonese")).toBe("車厘子");
    expect(getLanguageWordCounterpart("櫻桃", "cantonese")).toBe("櫻桃");
    expect(getCantoneseJyutping("櫻桃", "jing1 tou4")).toBe("ce1 lei4 zi2");
    expect(topicAudioV2["櫻桃"].cantonese).toBe("/manus-storage/cantonese-ce1-lei4-zi2_32f4825b.wav");
  });

  it("沒有地區差異的詞語維持原本顯示", () => {
    expect(getLanguageWord("太陽", "cantonese")).toBe("太陽");
    expect(getLanguageWordSummary("太陽")).toBeNull();
  });
});
