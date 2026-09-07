import rawTerms from "./termsV2.json";

export type TenLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type AudioStatus = "ready" | "pending";

export type TenLevelTerm = {
  term: string;
  jyutping: string;
  pinyin: string;
  level: TenLevel;
  mapId: string;
  topic: string;
  topicId: string;
  stage: number;
  stageOrder: number;
  source: string;
  audioStatus: AudioStatus;
  imageStatus: string;
};

export type TenLevelTopic = {
  id: string;
  label: string;
  level: TenLevel;
  emoji: string;
  terms: TenLevelTerm[];
};

export const tenLevelTerms = rawTerms as TenLevelTerm[];
export const tenLevels: TenLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const topicEmoji = (title: string) => {
  if (/(食|飲|烹飪)/.test(title)) return "🍎";
  if (/(動物)/.test(title)) return "🐾";
  if (/(天氣|自然|環境|地貌|災害)/.test(title)) return "🌦️";
  if (/(學校|校園|學習)/.test(title)) return "🏫";
  if (/(歷史|文化|節慶|傳統)/.test(title)) return "🏮";
  if (/(科技|媒體|通訊)/.test(title)) return "💻";
  if (/(健康|身體|衛生)/.test(title)) return "🩺";
  if (/(衣|服裝|穿戴)/.test(title)) return "👕";
  if (/(社區|服務|規則|安全)/.test(title)) return "🏙️";
  return "🗺️";
};

const groupedTopics = new Map<string, TenLevelTerm[]>();
tenLevelTerms.forEach(term => groupedTopics.set(term.mapId, [...(groupedTopics.get(term.mapId) ?? []), term]));

export const tenLevelTopics: TenLevelTopic[] = Array.from(groupedTopics.entries())
  .map(([id, terms]) => ({
    id,
    label: terms[0].topic,
    level: terms[0].level,
    emoji: topicEmoji(terms[0].topic),
    terms: [...terms].sort((a, b) => a.stage - b.stage || a.stageOrder - b.stageOrder),
  }))
  .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));

export const getTenLevelTopics = (level: TenLevel) => tenLevelTopics.filter(topic => topic.level === level);
export const getTenLevelTermStage = (topic: TenLevelTopic, stage: number) => topic.terms.filter(term => term.stage === stage);
export const getTenLevelLabel = (level: TenLevel) => `第 ${level} 級`;
export const getTenLevelDescription = (level: TenLevel) => `完成 ${getTenLevelTopics(level).length} 張地圖，逐步收集完整字卡。`;
export const TEN_LEVEL_ICONS: Record<TenLevel, string> = { 1: "🌱", 2: "🧸", 3: "🎈", 4: "🧩", 5: "📚", 6: "🦉", 7: "🌈", 8: "🔭", 9: "🚀", 10: "🏆" };
export const getTenLevelIcon = (level: TenLevel) => TEN_LEVEL_ICONS[level];
