export type WordLanguage = "cantonese" | "mandarin";

type WordLanguageVariant = {
  cantoneseTerm: string;
  mandarinTerm: string;
  cantoneseJyutping: string;
  cantoneseAudio?: string;
  mandarinAudio?: string;
};

/**
 * 香港兒童熟悉的粵語說法與普通話書面詞並列。
 * canonical term 仍保留在詞庫中，方便搜尋、關卡分組與讀寫學習；只在
 * 選擇語言時改變顯示文字和固定音檔，避免讓同一份資料被錯誤讀音覆蓋。
 */
export const wordLanguageVariants: Record<string, WordLanguageVariant> = {
  "冰淇淋": {
    cantoneseTerm: "雪糕",
    mandarinTerm: "冰淇淋",
    cantoneseJyutping: "syut3 gou1",
    cantoneseAudio: "/manus-storage/cantonese-syut3-gou1-corrected_621f6824.wav",
  },
  "巧克力": {
    cantoneseTerm: "朱古力",
    mandarinTerm: "巧克力",
    cantoneseJyutping: "zyu1 gu1 lik1",
    cantoneseAudio: "/manus-storage/word-030_60bcf4a2.mp3",
  },
  "草莓": {
    cantoneseTerm: "士多啤梨",
    mandarinTerm: "草莓",
    cantoneseJyutping: "si6 do1 be1 lei4",
    cantoneseAudio: "/manus-storage/cantonese-si6-do1-be1-lei4_138b8489.wav",
  },
  "巴士": {
    cantoneseTerm: "巴士",
    mandarinTerm: "公交車",
    cantoneseJyutping: "baa1 si2",
    mandarinAudio: "/manus-storage/mandarin-gong1-jiao1-che1_ba6f55d3.wav",
  },
  "的士": {
    cantoneseTerm: "的士",
    mandarinTerm: "出租車",
    cantoneseJyutping: "dik1 si2",
    mandarinAudio: "/manus-storage/mandarin-chu1-zu1-che1_69e83860.wav",
  },
  "單車": {
    cantoneseTerm: "單車",
    mandarinTerm: "自行車",
    cantoneseJyutping: "daan1 ce1",
    mandarinAudio: "/manus-storage/mandarin-zi4-xing2-che1_0c9542b3.wav",
  },
  "櫻桃": {
    cantoneseTerm: "車厘子",
    mandarinTerm: "櫻桃",
    cantoneseJyutping: "ce1 lei4 zi2",
    cantoneseAudio: "/manus-storage/cantonese-ce1-lei4-zi2_32f4825b.wav",
  },
};

export function getLanguageWord(term: string, language: WordLanguage) {
  const variant = wordLanguageVariants[term];
  if (!variant) return term;
  return language === "cantonese" ? variant.cantoneseTerm : variant.mandarinTerm;
}

export function getLanguageWordLabel(term: string, language: WordLanguage) {
  const variant = wordLanguageVariants[term];
  if (!variant) return term;
  return language === "cantonese" ? `${variant.cantoneseTerm}（${variant.mandarinTerm}）` : `${variant.mandarinTerm}（${variant.cantoneseTerm}）`;
}

export function getLanguageWordCounterpart(term: string, language: WordLanguage) {
  const variant = wordLanguageVariants[term];
  if (!variant) return null;
  return language === "cantonese" ? variant.mandarinTerm : variant.cantoneseTerm;
}

export function getCantoneseJyutping(term: string, fallback: string) {
  return wordLanguageVariants[term]?.cantoneseJyutping ?? fallback;
}

export function getLanguageWordSummary(term: string) {
  const variant = wordLanguageVariants[term];
  if (!variant) return null;
  return `粵語：${variant.cantoneseTerm}　・　普通話：${variant.mandarinTerm}`;
}
