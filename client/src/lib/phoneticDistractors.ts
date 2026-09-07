export type PhoneticEntry = {
  jyutping?: string;
  pinyin?: string;
};

const stripJyutpingTone = (syllable: string) => syllable.toLowerCase().replace(/[1-6]/g, "");

const stripPinyinTone = (syllable: string) => syllable
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[0-5]/g, "")
  .replace(/ü/g, "v");

const splitSyllables = (value: string | undefined, normalize: (syllable: string) => string) => (value ?? "")
  .trim()
  .split(/\s+/)
  .map(normalize)
  .filter(Boolean);

const getOnset = (syllable: string) => syllable.match(/^(gw|kw|ng|zh|ch|sh|[bcdfghjklmnpqrstvwxyz])/i)?.[0] ?? "";

const getRime = (syllable: string) => {
  const onset = getOnset(syllable);
  return syllable.slice(onset.length);
};

const pronunciationScore = (target: string[], candidate: string[]) => target.reduce((score, targetSyllable, index) => {
  const candidateSyllable = candidate[index];
  if (!candidateSyllable) return score;
  if (targetSyllable === candidateSyllable) return score + 12;

  const sameOnset = getOnset(targetSyllable) !== "" && getOnset(targetSyllable) === getOnset(candidateSyllable);
  const sameRime = getRime(targetSyllable) !== "" && getRime(targetSyllable) === getRime(candidateSyllable);
  if (sameOnset && sameRime) return score + 8;
  if (sameOnset) return score + 3;
  if (sameRime) return score + 3;
  return score;
}, 0);

/**
 * 分數以不計聲調的同音詞為最高，近似聲母或韻母為次。
 * 分數達 6 即代表至少有兩個近似音節，或一個完整同音音節，適合作為優先干擾詞。
 */
export const phoneticSimilarityScore = (target: PhoneticEntry, candidate: PhoneticEntry) => {
  const cantoneseScore = pronunciationScore(
    splitSyllables(target.jyutping, stripJyutpingTone),
    splitSyllables(candidate.jyutping, stripJyutpingTone),
  );
  const mandarinScore = pronunciationScore(
    splitSyllables(target.pinyin, stripPinyinTone),
    splitSyllables(candidate.pinyin, stripPinyinTone),
  );

  return Math.max(cantoneseScore, mandarinScore);
};

export const isPhoneticDistractor = (target: PhoneticEntry, candidate: PhoneticEntry) => phoneticSimilarityScore(target, candidate) >= 6;
