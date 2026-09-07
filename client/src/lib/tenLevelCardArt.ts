import type { TenLevelTopic } from "@/data/tenLevelCatalog";

export type TopicCardArt = {
  src: string;
  offset: string;
  sliceIndex: 0 | 1 | 2;
  levelLabel: string;
  title: string;
  isStandalone?: boolean;
};

/**
 * 42 張十級地圖均使用家長提供、已按 M01–M42 稽核的獨立直向原卡。
 * 卡片正面與真實拼圖均從同一張正確原圖顯示，不再回退至舊三級主題素材。
 */
const parentCardSources: Record<string, { src: string; title: string }> = {
  M01: { src: "/manus-storage/M01_967c9cd1.png", title: "水果與飲品" },
  M02: { src: "/manus-storage/M02_93de5f7d.png", title: "主食與小食" },
  M03: { src: "/manus-storage/M03_e7e861c1.png", title: "蔬菜與食材" },
  M04: { src: "/manus-storage/M04_f2eaf017.png", title: "基本心情" },
  M05: { src: "/manus-storage/M05_56c20454.png", title: "人際感受與態度" },
  M06: { src: "/manus-storage/M06_cb1484fd.png", title: "進階情緒與自我認識" },
  M07: { src: "/manus-storage/M07_1097f93f.png", title: "常見動物" },
  M08: { src: "/manus-storage/M08_63366973.png", title: "水中與海洋動物" },
  M09: { src: "/manus-storage/M09_84db11f8.png", title: "鳥類、昆蟲與野生動物" },
  M10: { src: "/manus-storage/M10_1184dbf3.png", title: "基本顏色" },
  M11: { src: "/manus-storage/M11_834b59db.png", title: "色彩深淺與質感" },
  M12: { src: "/manus-storage/M12_09c7c51e.png", title: "形容與視覺描述" },
  M13: { src: "/manus-storage/M13_248c502d.png", title: "五官與外觀" },
  M14: { src: "/manus-storage/M14_298cdcc5.png", title: "肢體與身體部位" },
  M15: { src: "/manus-storage/M15_cfd5819e.png", title: "人體系統與感官" },
  M16: { src: "/manus-storage/M16_2f0ea445.png", title: "核心家人" },
  M17: { src: "/manus-storage/M17_4e843d1c.png", title: "親戚與家庭生活" },
  M18: { src: "/manus-storage/M18_eec1e214.png", title: "家族與關係" },
  M19: { src: "/manus-storage/M19_9ade961f.png", title: "家居用品" },
  M20: { src: "/manus-storage/M20_d73a7234.png", title: "學習與個人物品" },
  M21: { src: "/manus-storage/M21_e9dc93eb.png", title: "家電與實用工具" },
  M22: { src: "/manus-storage/M22_a314705f.png", title: "玩具與遊戲" },
  M23: { src: "/manus-storage/M23_098bd4a9.png", title: "交通與出行" },
  M24: { src: "/manus-storage/M24_ec774f6b.png", title: "校園日常" },
  M25: { src: "/manus-storage/M25_e50fe264.png", title: "課堂學習與活動" },
  M26: { src: "/manus-storage/M26_d2b3d51a.png", title: "職業與工作" },
  M27: { src: "/manus-storage/M27_4e382dd7.png", title: "運動與活動" },
  M28: { src: "/manus-storage/M28_2bea3df8.png", title: "天氣、季節與自然現象" },
  M29: { src: "/manus-storage/M29_d3cdf5e5.png", title: "自然景觀與環境保護" },
  M30: { src: "/manus-storage/M30_83d213c8.png", title: "品格與自我管理" },
  M31: { src: "/manus-storage/M31_0914efdc.png", title: "社區規則與公民生活" },
  M32: { src: "/manus-storage/M32_7c92b445.png", title: "社區場所與城市生活" },
  M33: { src: "/manus-storage/M33_68f25f62.png", title: "數碼工具與操作" },
  M34: { src: "/manus-storage/M34_495bfbe8.png", title: "媒體與通訊" },
  M35: { src: "/manus-storage/M35_3f4c373d.png", title: "傳統節日" },
  M36: { src: "/manus-storage/M36_34c63aba.png", title: "中國文化與藝術" },
  M37: { src: "/manus-storage/M37_006d6db5.png", title: "歷史與古蹟" },
  M38: { src: "/manus-storage/M38_61a4f029.png", title: "日常衛生與健康" },
  M39: { src: "/manus-storage/M39_3e771463.png", title: "就醫與疾病預防" },
  M40: { src: "/manus-storage/M40_0217115a.png", title: "服裝與穿戴" },
  M41: { src: "/manus-storage/M41_3a01d1f5.png", title: "社區、服務與生活延伸" },
  M42: { src: "/manus-storage/M42_4d0f6324.png", title: "服裝、穿戴與衣物製作" },
};

export const getTenLevelCardArt = (topic: Pick<TenLevelTopic, "id"> & Partial<Pick<TenLevelTopic, "level" | "label">>): TopicCardArt | null => {
  const source = parentCardSources[topic.id];
  if (!source) return null;
  const levelLabel = topic.level ? `第 ${topic.level} 級` : "十級地圖";
  return {
    src: source.src,
    offset: "0%",
    sliceIndex: 0,
    levelLabel,
    title: `${levelLabel}・${source.title}字卡`,
    isStandalone: true,
  };
};
