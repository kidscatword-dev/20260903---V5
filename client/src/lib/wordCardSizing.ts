export function getWordCardSizeClass(word: string) {
  const length = Array.from(word).length;
  if (length >= 5) return "is-extra-long";
  if (length >= 3) return "is-long";
  return "";
}
