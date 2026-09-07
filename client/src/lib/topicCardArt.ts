/**
 * 繁體認字樂字卡素材提醒：每個主題的使用者原圖皆由左、中、右三張卡組成，依序對應初級 LV.1、中級 LV.2、高級 LV.3；網站只分區呈現，不修改原始插畫內容。
 */
type CardLevel = "preschool" | "junior" | "senior";

export type TopicCardArt = {
  src: string;
  offset: string;
  sliceIndex: 0 | 1 | 2;
  levelLabel: string;
  title: string;
  isStandalone?: boolean;
};

const levelArt: Record<CardLevel, { offset: string; sliceIndex: 0 | 1 | 2; label: string }> = {
  preschool: { offset: "0%", sliceIndex: 0, label: "初級・LV.1" },
  junior: { offset: "-33.333%", sliceIndex: 1, label: "中級・LV.2" },
  senior: { offset: "-66.666%", sliceIndex: 2, label: "高級・LV.3" },
};

const topicSheets: Record<string, { src: string; label: string }> = {
  food: { src: "/manus-storage/food-three-level-card_e5714c68.png", label: "食物" },
  emotion: { src: "/manus-storage/emotion-three-level-card_7789a6da.png", label: "心情" },
  animal: { src: "/manus-storage/animal-three-level-card_6f0cd97e.png", label: "動物" },
  color: { src: "/manus-storage/color-three-level-card_3fa28502.jpg", label: "顏色" },
  body: { src: "/manus-storage/body-three-level-card_04a5a23e.jpg", label: "身體" },
  family: { src: "/manus-storage/family-three-level-card_858f8cff.png", label: "家庭" },
  object: { src: "/manus-storage/object-three-level-card_e90fc0e1.png", label: "日常用品" },
};

const standaloneTopicCards: Partial<Record<CardLevel, Record<string, { src: string; label: string }>>> = {
  preschool: {
    toy: { src: "/manus-storage/toy-junior_f7fa5d20.png", label: "玩具" },
    transport: { src: "/manus-storage/transport-junior_c2c8f32a.png", label: "交通工具" },
  },
  junior: {
    school: { src: "/manus-storage/school-middle_62ccaa9a.png", label: "學校" },
    career: { src: "/manus-storage/career-middle_924cf7d1.png", label: "職業" },
    sport: { src: "/manus-storage/sports-middle_a5579f3d.png", label: "運動" },
  },
  senior: {
    nature: { src: "/manus-storage/nature-senior_db001a00.png", label: "自然" },
    "advanced-emotion": { src: "/manus-storage/advanced-emotion-senior_e284dbd1.png", label: "情緒進階" },
    society: { src: "/manus-storage/society-senior_b43abf28.png", label: "社會" },
  },
};

export function getTopicCardArt(level: CardLevel, topicId: string): TopicCardArt | null {
  const standalone = standaloneTopicCards[level]?.[topicId];
  if (standalone) {
    const levelInfo = levelArt[level];
    return { src: standalone.src, offset: "0%", sliceIndex: 0, levelLabel: levelInfo.label, title: `${levelInfo.label}${standalone.label}字卡`, isStandalone: true };
  }
  const sheet = topicSheets[topicId];
  if (!sheet) return null;
  const levelInfo = levelArt[level];
  return { src: sheet.src, ...levelInfo, levelLabel: levelInfo.label, title: `${levelInfo.label}${sheet.label}字卡` };
}
