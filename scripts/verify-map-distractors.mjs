import { readFileSync } from "node:fs";

const terms = JSON.parse(readFileSync(new URL("../client/src/data/terms.json", import.meta.url), "utf8"));
const wordsPerStage = 6;
const failures = [];
const manualSameLengthDecoys = { 圖書管理員: ["圖書館職員", "圖書館館員", "圖書部職員"] };
const stripJyutpingTone = (syllable) => syllable.toLowerCase().replace(/[1-6]/g, "");
const stripPinyinTone = (syllable) => syllable.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[0-5]/g, "").replace(/ü/g, "v");
const splitSyllables = (value, normalize) => (value ?? "").trim().split(/\s+/).map(normalize).filter(Boolean);
const getOnset = (syllable) => syllable.match(/^(gw|kw|ng|zh|ch|sh|[bcdfghjklmnpqrstvwxyz])/i)?.[0] ?? "";
const getRime = (syllable) => syllable.slice(getOnset(syllable).length);
const pronunciationScore = (target, candidate) => target.reduce((score, targetSyllable, index) => {
  const candidateSyllable = candidate[index];
  if (!candidateSyllable) return score;
  if (targetSyllable === candidateSyllable) return score + 12;
  const sameOnset = getOnset(targetSyllable) !== "" && getOnset(targetSyllable) === getOnset(candidateSyllable);
  const sameRime = getRime(targetSyllable) !== "" && getRime(targetSyllable) === getRime(candidateSyllable);
  return score + (sameOnset && sameRime ? 8 : sameOnset || sameRime ? 3 : 0);
}, 0);
const phoneticSimilarityScore = (target, candidate) => Math.max(
  pronunciationScore(splitSyllables(target.jyutping, stripJyutpingTone), splitSyllables(candidate.jyutping, stripJyutpingTone)),
  pronunciationScore(splitSyllables(target.pinyin, stripPinyinTone), splitSyllables(candidate.pinyin, stripPinyinTone)),
);
let totalQuestions = 0;
let questionsWithPhoneticCandidate = 0;

for (const level of ["preschool", "junior", "senior"]) {
  const levelTerms = terms.filter((term) => term.level === level);
  const topicIds = [...new Set(levelTerms.map((term) => term.topic))];
  for (const topicId of topicIds) {
    const topicTerms = levelTerms.filter((term) => term.topic === topicId);
    for (let stage = 0; stage < topicTerms.length / wordsPerStage; stage += 1) {
      const stageTerms = topicTerms.slice(stage * wordsPerStage, (stage + 1) * wordsPerStage);
      const stageAnswers = new Set(stageTerms.map((term) => term.term));
      for (const target of stageTerms) {
        const candidates = [...terms.filter((term) => term.term !== target.term && Array.from(term.term).length === Array.from(target.term).length && !stageAnswers.has(term.term)), ...(manualSameLengthDecoys[target.term] ?? []).map((term) => ({ term }))];
        totalQuestions += 1;
        if (candidates.some((candidate) => phoneticSimilarityScore(target, candidate) >= 6)) questionsWithPhoneticCandidate += 1;
        if (candidates.length < 3) failures.push(`${level}/${topicId}/第${stage + 1}關/${target.term}：只有 ${candidates.length} 個同字數干擾詞`);
      }
    }
  }
}

if (failures.length) {
  console.error("地圖干擾詞候選不足：\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`地圖干擾詞驗證通過：所有題目均至少有三個同字數、且不在同關答案中的候選詞。近音／同音候選覆蓋：${questionsWithPhoneticCandidate}/${totalQuestions} 題。`);
