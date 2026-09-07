/**
 * 繁體認字樂遊戲設計提醒：字詞探索站以紙張米白、墨藍文字、柚子黃行動與小貓鼓勵為核心；
 * 所有錯誤回饋須溫和、可再聽讀音，不使用扣分或紅色大叉。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Ear, Gamepad2, Grid2X2, LockKeyhole, Map, Puzzle, Sparkles, Star, Volume2 } from "lucide-react";
import { useChineseScript } from "@/contexts/ChineseScriptContext";

export type GameWord = { term: string; jyutping: string; pinyin: string; level: string | number; category?: string; topic?: string; mapId?: string };
export type GameId = "map" | "listen" | "match" | "build" | "reviewQuest" | "findWord" | "fillBlank";
export const GAME_HUB_ORDER: GameId[] = ["map", "match", "listen", "build", "reviewQuest", "findWord", "fillBlank"];
export const TEMPORARILY_LOCKED_GAME_IDS: Exclude<GameId, "map">[] = ["listen", "build", "findWord", "fillBlank"];
export const GAME_HUB_EXPLORER_CAT_ASSET = "/manus-storage/explorer-cat-alpha_c47fe82f.png";
export const MATCH_GAME_HUB_CAT_HEAD_ASSET = "/manus-storage/match-game-cat-head_63b51e1a.webp";
export const GAME_HUB_TITLE_CLASS = "game-world-title";

const GUIDE_AUDIO = "/manus-storage/game-start-guide_4139c28e.mp3";
const iconByCategory: Record<string, string> = { food: "🍎", emotion: "😊", animal: "🐶", color: "🎨", body: "👋", nature: "🌳", school: "🏫", family: "🏠", action: "🏃", object: "🎒", other: "✨" };
const wordIcon = (word: GameWord) => ({ "太陽": "☀️", "月亮": "🌙", "花朵": "🌸", "森林": "🌲", "小狗": "🐶", "小貓": "🐱", "蘋果": "🍎", "香蕉": "🍌", "西瓜": "🍉", "橙": "🍊", "書本": "📘", "老師": "👩‍🏫", "學校": "🏫", "媽媽": "👩", "爸爸": "👨" }[word.term] ?? iconByCategory[word.category ?? "other"] ?? "✨");
export const BEGINNER_FOOD_MATCH_TERMS = ["蘋果", "香蕉", "橙", "西瓜", "葡萄", "草莓", "菠蘿", "梨", "桃", "牛奶", "水", "飯", "粥", "湯", "麵包", "雞蛋", "魚", "菜", "肉", "糖", "餅乾", "冰淇淋", "巧克力", "果汁", "豆漿", "芝士", "薯條", "番茄", "玉米", "蛋糕"] as const;
export const MATCH_IMAGE_BY_TERM: Record<string, string> = {
  "蘋果": "/manus-storage/apple_2a653baf.png",
  "香蕉": "/manus-storage/banana_e9af5c85.png",
  "橙": "/manus-storage/orange_46db9060.png",
  "西瓜": "/manus-storage/watermelon_c09d922b.png",
  "葡萄": "/manus-storage/grape_f3d6c224.png",
  "草莓": "/manus-storage/strawberry_69c5033d.png",
  "菠蘿": "/manus-storage/pineapple_a3a4b43f.png",
  "梨": "/manus-storage/pear_ae6f8fff.png",
  "桃": "/manus-storage/peach_625ad0c6.png",
  "牛奶": "/manus-storage/milk_d78807e3.png",
  "水": "/manus-storage/water_ce582c20.png",
  "飯": "/manus-storage/rice_2001d6f6.png",
  "粥": "/manus-storage/congee_f60d287e.png",
  "湯": "/manus-storage/soup_cfbfd663.png",
  "麵包": "/manus-storage/bread_6aa9bd7f.png",
  "雞蛋": "/manus-storage/egg_7318e82b.png",
  "魚": "/manus-storage/fish_305036d0.png",
  "菜": "/manus-storage/vegetable_3f664290.png",
  "肉": "/manus-storage/meat_38bd6efe.png",
  "糖": "/manus-storage/candy_cb4c1301.png",
  "餅乾": "/manus-storage/biscuit_f6792e62.png",
  "冰淇淋": "/manus-storage/ice-cream_ff666fc3.png",
  "巧克力": "/manus-storage/chocolate_5a205863.png",
  "果汁": "/manus-storage/juice_4806e9f2.png",
  "豆漿": "/manus-storage/soy-milk_dc8db3f1.png",
  "芝士": "/manus-storage/cheese_1e0ed29e.png",
  "薯條": "/manus-storage/fries_2166efb2.png",
  "番茄": "/manus-storage/tomato_089ba50c.png",
  "玉米": "/manus-storage/corn_2b27a002.png",
  "蛋糕": "/manus-storage/cake_05b10349.png",
  "小貓": "/manus-storage/cat_403de597.svg",
  "巴士": "/manus-storage/transport-05_9e29246f.png",
  "企鵝": "/manus-storage/animal-01-penguin_a1e25ea9.png",
  "兔子": "/manus-storage/animal-02-rabbit_eb68c422.png",
  "八爪魚": "/manus-storage/animal-03-octopus-purple_e965bcd7.png",
  "大象": "/manus-storage/animal-04-elephant_973a6f46.png",
  "小狗": "/manus-storage/animal-05-dog_264faef3.png",
  "幼貓": "/manus-storage/animal-06-kitten_711f180f.png",
  "小魚": "/manus-storage/animal-07-small-fish_2ef04076.png",
  "小鳥": "/manus-storage/animal-08-bird_a91fc014.png",
  "斑馬": "/manus-storage/animal-09-zebra_0dbd4d7a.png",
  "鵝": "/manus-storage/animal-10-goose_9e2bcac2.png",
  "松鼠": "/manus-storage/animal-11-squirrel_701d3eb9.png",
  "河馬": "/manus-storage/animal-12-hippo_e76b93fb.png",
  "海星": "/manus-storage/animal-13-starfish_582d30df.png",
  "海豚": "/manus-storage/animal-14-dolphin_5282a33c.png",
  "牛": "/manus-storage/animal-15-cow_063ab0c7.png",
  "狐狸": "/manus-storage/animal-16-fox_0c48607c.png",
  "狼": "/manus-storage/animal-17-wolf_99df6de7.png",
  "猴子": "/manus-storage/animal-18-monkey_c8ebc8fa.png",
  "獅子": "/manus-storage/animal-19-lion_15bb0655.png",
  "章魚": "/manus-storage/animal-20-octopus-orange_800a6133.png",
  "羊": "/manus-storage/animal-21-sheep_44d08653.png",
  "老虎": "/manus-storage/animal-22-tiger_429e9e8e.png",
  "蛇": "/manus-storage/animal-23-snake_98e582da.png",
  "袋鼠": "/manus-storage/animal-24-kangaroo_7a3e347d.png",
  "金魚": "/manus-storage/animal-25-goldfish_680e0fb0.png",
  "八達通": "/manus-storage/transport-01_ac0997d9.png",
  "單車": "/manus-storage/transport-02_f7cb64c7.png",
  "地鐵": "/manus-storage/transport-03_5cf80059.png",
  "安全帶": "/manus-storage/transport-04_348e01c5.png",
  "方向盤": "/manus-storage/transport-06_160f8876.png",
  "校巴": "/manus-storage/transport-07_bb3836d8.png",
  "機場": "/manus-storage/transport-08_caec4a37.png",
  "汽車": "/manus-storage/transport-09_c4490e79.png",
  "消防車": "/manus-storage/transport-10_8a254e67.png",
  "渡輪": "/manus-storage/transport-11_ae650d63.png",
  "火車": "/manus-storage/transport-12_6b6ec51c.png",
  "的士": "/manus-storage/transport-13_251f3ad4.png",
  "船": "/manus-storage/transport-15_cbb155fc.png",
  "貨車": "/manus-storage/transport-16_b8200ae7.png",
  "路軌": "/manus-storage/transport-17_959522ec.png",
  "車票": "/manus-storage/transport-18_c9f7e4ba.png",
  "車窗": "/manus-storage/transport-19_6b60a29d.png",
  "車站": "/manus-storage/transport-20_187b5698.png",
  "車輪": "/manus-storage/transport-21_0bf4bb64.png",
  "車門": "/manus-storage/transport-22_7495e4e2.png",
  "隧道": "/manus-storage/transport-23_129ce41d.png",
  "電車": "/manus-storage/transport-24_6fab32e2.png",
  "飛機": "/manus-storage/transport-25_bc03964c.png",
  "冰箱": "/manus-storage/m19-home-01_e8b30d7c.png",
  "剪刀": "/manus-storage/m19-home-02_337e684b.png",
  "尺子": "/manus-storage/m19-home-03_c6ac1185.png",
  "床": "/manus-storage/m19-home-04_1d4bef4d.png",
  "書": "/manus-storage/m19-home-05_9e2773e5.png",
  "書本": "/manus-storage/m19-home-06_f4b0615a.png",
  "杯子": "/manus-storage/m19-home-07_e8c39d13.png",
  "枕頭": "/manus-storage/m19-home-08_ddcfb7da.png",
  "桌子": "/manus-storage/m19-home-09_b9fa66b7.png",
  "椅子": "/manus-storage/m19-home-10_7c545014.png",
  "橡皮": "/manus-storage/m19-home-11_873f6e1b.png",
  "毛巾": "/manus-storage/m19-home-12_e2fba3e0.png",
  "湯匙": "/manus-storage/m19-home-13_f5d49cc2.png",
  "燈": "/manus-storage/m19-home-14_2f4d3dfa.png",
  "牙刷": "/manus-storage/m19-home-15_8ea03ea5.png",
  "碗": "/manus-storage/m19-home-16_ab4d17dd.png",
  "碟子": "/manus-storage/m19-home-17_b883eed2.png",
  "窗戶": "/manus-storage/m19-home-18_e765090d.png",
  "筆袋": "/manus-storage/m19-home-19_591d2361.png",
  "筷子": "/manus-storage/m19-home-20_ff3be8f1.png",
  "背包": "/manus-storage/m19-home-21_7d3b9098.png",
  "膠水": "/manus-storage/m19-home-22_a8b5e96c.png",
  "衣服": "/manus-storage/m19-home-23_64653f45.png",
  "被子": "/manus-storage/m19-home-24_ddf53e4b.png",
  "門": "/manus-storage/m19-home-25_d82bf74f.png",
  "恤衫": "/manus-storage/m40-clothing-01_e6563cba.png",
  "便服": "/manus-storage/m40-clothing-02_af54cd8e.png",
  "制服": "/manus-storage/m40-clothing-03_5f15b3b9.png",
  "圍巾": "/manus-storage/m40-clothing-04_79121590.png",
  "外套": "/manus-storage/m40-clothing-05_adf9f00a.png",
  "大衣": "/manus-storage/m40-clothing-06_8ddfa084.png",
  "布鞋": "/manus-storage/m40-clothing-07_7f733c5d.png",
  "帽子": "/manus-storage/m40-clothing-08_028aedeb.png",
  "手套": "/manus-storage/m40-clothing-09_0e803418.png",
  "打扮": "/manus-storage/m40-clothing-10_e2e9f557.png",
  "毛衣": "/manus-storage/m40-clothing-11_2f7839f9.png",
  "泳衣": "/manus-storage/m40-clothing-12_d581c8c8.png",
  "背心": "/manus-storage/m40-clothing-13_44c40c20.png",
  "浴袍": "/manus-storage/m40-clothing-14_943adc91.png",
  "燙": "/manus-storage/m40-clothing-15_a8860bc1.png",
  "皮帶": "/manus-storage/m40-clothing-16_67fd38ba.png",
  "皮鞋": "/manus-storage/m40-clothing-17_6ee212f1.png",
  "睡衣": "/manus-storage/m40-clothing-18_4c978ad9.png",
  "穿著": "/manus-storage/m40-clothing-19_4e6ea0f1.png",
  "衣衫": "/manus-storage/m40-clothing-20_4646d6c5.png",
  "裙子": "/manus-storage/m40-clothing-21_074e4bc6.png",
  "褲子": "/manus-storage/m40-clothing-22_8dd81163.png",
  "襪子": "/manus-storage/m40-clothing-23_738169c5.png",
  "雨衣": "/manus-storage/m40-clothing-24_53dc7ba6.png",
  "鞋": "/manus-storage/m40-clothing-25_d8b58d90.png",
  "吹泡泡": "/manus-storage/m22-toy-01_bcb0d5d1.png",
  "呼拉圈": "/manus-storage/m22-toy-02_7b51d4de.png",
  "拼圖": "/manus-storage/m22-toy-03_fe10fa4f.png",
  "木馬": "/manus-storage/m22-toy-04_1149baba.png",
  "棋子": "/manus-storage/m22-toy-05_a238045d.png",
  "樂高": "/manus-storage/m22-toy-06_0d5237e0.png",
  "氣球": "/manus-storage/m22-toy-07_216bcc7a.png",
  "沙包": "/manus-storage/m22-toy-08_8406d859.png",
  "洋娃娃": "/manus-storage/m22-toy-09_29edc7c2.png",
  "滑板": "/manus-storage/m22-toy-skateboard_c61e458f.png",
  "玩偶": "/manus-storage/m22-toy-11_c7833bf1.png",
  "玩具屋": "/manus-storage/m22-toy-12_7eea03bf.png",
  "玩具熊": "/manus-storage/m22-toy-13_831cbe3c.png",
  "玩具車": "/manus-storage/m22-toy-14_78e6f20a.png",
  "畫筆": "/manus-storage/m22-toy-15_e95ee9ea.png",
  "皮球": "/manus-storage/m22-toy-16_769d8ccd.png",
  "積木": "/manus-storage/m22-toy-17_463f8e33.png",
  "紙牌": "/manus-storage/m22-toy-18_37fa694d.png",
  "貼紙": "/manus-storage/m22-toy-19_1b8455eb.png",
  "跳繩": "/manus-storage/m22-toy-20_e0138f19.png",
  "陀螺": "/manus-storage/m22-toy-21_c1b190d0.png",
  "風箏": "/manus-storage/m22-toy-22_2a3b1fa8.png",
  "飛盤": "/manus-storage/m22-toy-23_fec8f06a.png",
  "骰子": "/manus-storage/m22-toy-24_bf7ffdef.png",
  "黏土": "/manus-storage/m22-toy-25_2a37e0f2.png",
  "機師": "/manus-storage/m26-profession-01_a6893621.png",
  "廚師": "/manus-storage/m26-profession-02_84dc2168.png",
  "演員": "/manus-storage/m26-profession-03_0975c528.png",
  "護士": "/manus-storage/m26-profession-04_1316d859.png",
  "園丁": "/manus-storage/m26-profession-05_5201cf77.png",
  "建築師": "/manus-storage/m26-profession-06_ad2d23c3.png",
  "歌手": "/manus-storage/m26-profession-07_005b7257.png",
  "牙醫": "/manus-storage/m26-profession-08_60884c3b.png",
  "農夫": "/manus-storage/m26-profession-09_0236879a.png",
  "導遊": "/manus-storage/m26-profession-10_b1950f6c.png",
  "律師": "/manus-storage/m26-profession-11_5200aeb3.png",
  "消防員": "/manus-storage/m26-profession-12_04327099.png",
  "畫家": "/manus-storage/m26-profession-13_fba52fa1.png",
  "運動員": "/manus-storage/m26-profession-14_9ba468ec.png",
  "工程師": "/manus-storage/m26-profession-15_7ba054c1.png",
  "郵差": "/manus-storage/m26-profession-16_951b4926.png",
  "警察": "/manus-storage/m26-profession-17_ba54eefe.png",
  "醫生": "/manus-storage/m26-profession-18_710539ea.png",
  "乒乓球": "/manus-storage/m27-activity-01_30005276.png",
  "冠軍": "/manus-storage/m27-activity-02_ee6144fc.png",
  "排球": "/manus-storage/m27-activity-03_9a25abb6.png",
  "教練": "/manus-storage/m27-activity-04_cc44a6e3.png",
  "游泳": "/manus-storage/m27-activity-05_d2445812.png",
  "滑雪": "/manus-storage/m27-activity-06_b2d16870.png",
  "獎牌": "/manus-storage/m27-activity-07_10f1b203.png",
  "瑜伽": "/manus-storage/m27-activity-08_aff9e697.png",
  "羽毛球": "/manus-storage/m27-activity-09_3803e0e4.png",
  "行山": "/manus-storage/m27-activity-10_eeafd01d.png",
  "足球": "/manus-storage/m27-activity-11_4c850f2d.png",
  "跑步": "/manus-storage/m27-activity-12_9c5095ed.png",
  "回收箱": "/manus-storage/m21-equipment-01_88f77fb6.png",
  "垃圾桶": "/manus-storage/m21-equipment-02_60560107.png",
  "急救箱": "/manus-storage/m21-equipment-03_89f7ffbb.png",
  "手電筒": "/manus-storage/m21-equipment-04_6b3b6a50.png",
  "抽屜": "/manus-storage/m21-equipment-05_f4e011cb.png",
  "指南針": "/manus-storage/m21-equipment-06_feeec9a0.png",
  "收音機": "/manus-storage/m21-equipment-07_e4c57086.png",
  "放大鏡": "/manus-storage/m21-equipment-08_858857e7.png",
  "文件夾": "/manus-storage/m21-equipment-09_5a3b216c.png",
  "書架": "/manus-storage/m21-equipment-10_d64c2279.png",
  "滅火筒": "/manus-storage/m21-equipment-11_a2b90599.png",
  "滑鼠": "/manus-storage/m21-equipment-12_542cca79.png",
  "訂書機": "/manus-storage/m21-equipment-13_5e0c12c5.png",
  "路由器": "/manus-storage/m21-equipment-14_5accd1d3.png",
  "遙控車": "/manus-storage/m21-equipment-15_fce5c4bd.png",
  "量角器": "/manus-storage/m21-equipment-16_6d922456.png",
  "鍵盤": "/manus-storage/m21-equipment-17_8c8ac48f.png",
  "電池": "/manus-storage/m21-equipment-18_05a7e565.png",
};
export type MatchMode = "easy" | "challenge";
export const MATCH_EASY_PAIR_COUNT = 4;
export const MATCH_CHALLENGE_PAIR_COUNT = 8;
export const MATCH_PAIR_COUNT = MATCH_CHALLENGE_PAIR_COUNT;
export const MATCH_TIME_SECONDS = 180;
export const MATCH_MISMATCH_RESET_DELAY_MS = 700;
export const MATCH_MODE_CONFIG: Record<MatchMode, { pairCount: number; timeLimitSeconds: number | null; title: string; eyebrow: string; guide: string }> = {
  easy: {
    pairCount: MATCH_EASY_PAIR_COUNT,
    timeLimitSeconds: null,
    title: "簡易試玩",
    eyebrow: "8 張翻翻卡・4 對朋友",
    guide: "先從八張翻翻卡中，找出四對文字和圖畫朋友。慢慢玩，不設限時。",
  },
  challenge: {
    pairCount: MATCH_CHALLENGE_PAIR_COUNT,
    timeLimitSeconds: MATCH_TIME_SECONDS,
    title: "正式挑戰",
    eyebrow: "16 張翻翻卡・8 對朋友",
    guide: "隨機配對八對字詞；三分鐘內完成即可加入時間排行榜。",
  },
};
export const shouldRunMatchStopwatch = (status: MatchStatus, timeLimitSeconds: number | null, elapsedSeconds: number) => status === "playing" && (timeLimitSeconds === null || elapsedSeconds < timeLimitSeconds);
export const MATCH_CARD_BACK_ASSET = "/manus-storage/match-card-back-cat-optimized_faee46f8.webp";
export const MATCH_CARD_BACK_ASSETS = [MATCH_CARD_BACK_ASSET, "/manus-storage/match-card-back-cat2-optimized_9e7d4d39.webp"] as const;
const uniqueByTerm = (items: GameWord[]) => items.filter((item, index, collection) => collection.findIndex((candidate) => candidate.term === item.term) === index);
const rotate = <T,>(items: T[], offset: number) => [...items.slice(offset), ...items.slice(0, offset)];
const shuffle = <T,>(items: T[], random: () => number) => {
  const shuffled = [...items];
  for (let current = shuffled.length - 1; current > 0; current -= 1) {
    const selected = Math.floor(random() * (current + 1));
    [shuffled[current], shuffled[selected]] = [shuffled[selected], shuffled[current]];
  }
  return shuffled;
};
const createSeededRandom = (seed: number) => {
  let state = (seed + 1) * 1103515245 + 12345;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};
export const selectMatchPairs = (items: GameWord[], roundIndex: number, pairCount = MATCH_PAIR_COUNT) => {
  const usable = uniqueByTerm(items).filter((word) => Boolean(MATCH_IMAGE_BY_TERM[word.term]));
  if (!usable.length) return [];
  return shuffle(usable, createSeededRandom(roundIndex)).slice(0, Math.min(pairCount, usable.length));
};
export const createShuffledMatchCards = (pairs: GameWord[], random: () => number = Math.random): PairSelection[] => {
  const words = shuffle(pairs.map((_, index) => ({ kind: "word" as const, index })), random);
  const images = shuffle(pairs.map((_, index) => ({ kind: "image" as const, index })), random);
  const cards: PairSelection[] = [];
  for (let rowStart = 0; rowStart < pairs.length; rowStart += 2) {
    const rowKinds = shuffle(["word", "word", "image", "image"] as const, random);
    rowKinds.forEach((kind) => cards.push(kind === "word" ? words.shift()! : images.shift()!));
  }
  return cards;
};

export const createReviewOptions = (target: GameWord, allTerms: GameWord[], random: () => number = Math.random) => {
  const sameLength = uniqueByTerm(allTerms).filter((word) => word.term !== target.term && word.term.length === target.term.length);
  return shuffle([target, ...shuffle(sameLength, random).slice(0, 3)], random);
};

function GameShell({ title, eyebrow, onBack, children, titleClassName }: { title: string; eyebrow: string; onBack: () => void; children: React.ReactNode; titleClassName?: string }) {
  const resolvedTitleClassName = titleClassName ?? "font-serif text-2xl font-black text-[#263C71]";
  return <div className="flex min-h-screen w-full flex-col px-4 pb-7 pt-4"><header className="mb-5 flex items-center justify-between"><button onClick={onBack} className="game-back-button" aria-label="返回遊戲選單"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className={resolvedTitleClassName}>{title}</p><p className="mt-0.5 text-xs font-bold text-[#76839A]">{eyebrow}</p></div><div className="w-11" /></header>{children}</div>;
}

function GuideCard({ text, onGuide }: { text: string; onGuide: () => void }) {
  return <section className="game-guide-card"><div><p className="font-black text-[#263C71]">先聽玩法</p><p>{text}</p></div><button onClick={onGuide} aria-label="播放粵語玩法提示"><Volume2 className="h-5 w-5" />聽粵語指引</button></section>;
}

function GameComplete({ title, detail, timeText, onAgain, onBack, rewardMark = "⭐　⭐　⭐", celebrate = false }: { title: string; detail: string; timeText?: string; onAgain: () => void; onBack: () => void; rewardMark?: string; celebrate?: boolean }) {
  return <section className={`game-complete-card ${celebrate ? "match-victory" : ""}`}>{celebrate && <div className="match-confetti" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ "--piece": index } as React.CSSProperties}>✦</i>)}</div>}<p className="text-3xl">{rewardMark}</p><img src="/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png" alt="小貓豎起拇指鼓勵" /><h1>{title}</h1>{timeText && <p className="game-complete-time">{timeText}</p>}<p className="game-complete-detail">{detail}</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={onBack} className="game-quiet-button">返回選單</button><button onClick={onAgain} className="game-primary-button">再玩一次</button></div></section>;
}

export function GameHub({ onBack, onChoose, onOpenMatchLeaderboard }: { onBack: () => void; onChoose: (game: GameId) => void; onOpenMatchLeaderboard: () => void }) {
  const mainGames: { id: GameId; icon: React.ReactNode; title: string; description: string; eyebrow: string; tone: string }[] = [
    { id: "map", icon: <img src="/manus-storage/map_340594bb.svg" alt="山脈、河流與道路的遊戲地圖" />, title: "地圖闖關", description: "聽讀音・過關收集字卡", eyebrow: "主角遊戲", tone: "map" },
    { id: "match", icon: <img src={MATCH_GAME_HUB_CAT_HEAD_ASSET} alt="小貓頭圖畫" />, title: "圖片文字配對", description: "翻翻卡，找出文字和圖畫的朋友", eyebrow: "配對遊戲", tone: "match" },
    { id: "reviewQuest", icon: <Star className="fill-current" />, title: "闖關小測驗", description: "溫習庫聽字揀字，看看記得多少", eyebrow: "溫習挑戰", tone: "review" },
  ];
  return (
    <GameShell title="遊戲天地" eyebrow="一起來玩遊戲吧！" onBack={onBack} titleClassName={GAME_HUB_TITLE_CLASS}>
      <section className="game-world-greeting">
        <div className="game-world-cat"><img src={GAME_HUB_EXPLORER_CAT_ASSET} alt="拿著地圖的探險小貓吉祥物" /></div>
        <div className="game-world-speech"><strong>一起來玩遊戲吧！</strong><span>請選擇你想挑戰的遊戲。</span></div>
      </section>
      <section className="game-world-main-list">{mainGames.map((game) => game.id === "match" ? <section key={game.id} className="game-world-main-card game-world-match-card match"><span className="game-world-main-visual">{game.icon}</span><div className="game-world-main-copy"><em>{game.eyebrow}</em><strong>{game.title}</strong><small>{game.description}</small><div className="game-world-match-actions"><button onClick={() => onChoose(game.id)} className="game-world-match-play" aria-label={`開始${game.title}`}>立即開始 <ChevronRight className="h-5 w-5" /></button><button onClick={onOpenMatchLeaderboard} className="game-world-match-leaderboard" aria-label="查看圖片文字配對時間排行榜">🏆 排行榜</button></div></div></section> : <button key={game.id} onClick={() => onChoose(game.id)} className={`game-world-main-card ${game.tone}`} aria-label={`開始${game.title}`}><span className="game-world-main-visual">{game.icon}</span><span className="game-world-main-copy"><em>{game.eyebrow}</em><strong>{game.title}</strong><small>{game.description}</small><b>立即開始 <ChevronRight className="h-5 w-5" /></b></span></button>)}</section>
    </GameShell>
  );
}

export function ListenChooseGame({ pool, onBack, onPlayCantonese, onGuide }: { pool: GameWord[]; onBack: () => void; onPlayCantonese: (word: GameWord) => void; onGuide: () => void }) {
  const { displayText } = useChineseScript();
  const safePool = uniqueByTerm(pool).slice(0, 12);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const target = safePool[round % Math.max(safePool.length, 1)];
  const options = useMemo(() => target ? rotate([target, ...safePool.filter((word) => word.term !== target.term).slice(0, 3)], round % 4) : [], [round, safePool, target]);
  if (!target) return <GameShell title="聽音揀字" eyebrow="需要更多字詞資料" onBack={onBack}><p className="game-empty-message">暫未可建立這個遊戲，請返回再試。</p></GameShell>;
  const next = () => { setFeedback("idle"); setRound((value) => value + 1); };
  return <GameShell title="聽音揀字" eyebrow={`第 ${round + 1} / 5 題・初級入門`} onBack={onBack}>{round >= 5 ? <GameComplete title="你聽得好仔細！" detail="五題都完成了，繼續發現更多字詞吧。" onAgain={() => { setRound(0); setFeedback("idle"); }} onBack={onBack} /> : <><GuideCard text="聽清楚讀音，再揀出正確的字詞。" onGuide={onGuide} /><section className="game-question-card"><p className="game-question-label">先聽一聽</p><button onClick={() => onPlayCantonese(target)} className="game-listen-button"><Volume2 />播放粵語讀音</button><p className="mt-4 text-sm font-bold text-[#62748A]">聽完後揀一個答案。</p></section><div className="game-option-grid">{options.map((word) => <button key={word.term} onClick={() => { if (word.term === target.term) { setFeedback("good"); onPlayCantonese(target); } else setFeedback("try"); }} className={feedback === "good" && word.term === target.term ? "is-correct" : ""}>{displayText(word.term)}</button>)}</div><section className={`game-feedback ${feedback}`}>{feedback === "good" ? <><Sparkles />答得好！小貓為你鼓掌。</> : feedback === "try" ? <><Volume2 />再試一次，聽聽讀音。</> : <>準備好就開始聽讀音。</>}</section>{feedback === "good" && <button onClick={next} className="game-primary-button mt-4 w-full">下一題 <ChevronRight className="h-5 w-5" /></button>}</>}</GameShell>;
}

type PairSelection = { kind: "word" | "image"; index: number };
type MatchStatus = "playing" | "complete" | "timeUp";
const formatMatchTime = (seconds: number) => {
  const safeSeconds = Math.max(seconds, 0);
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
};
export function MatchModeSelect({ onBack, onChoose, onOpenLeaderboard }: { onBack: () => void; onChoose: (mode: MatchMode) => void; onOpenLeaderboard: () => void }) {
  return <GameShell title="圖片文字配對" eyebrow="先選擇合適的玩法" onBack={onBack}>
    <section className="match-mode-intro"><Sparkles /><div><strong>由簡單開始，慢慢挑戰！</strong><p>兩種玩法都會隨機使用已確認的圖畫。</p></div></section>
    <section className="match-mode-grid">
      <button onClick={() => onChoose("easy")} className="match-mode-card easy"><span>🌱</span><div><em>適合先試玩</em><strong>8 張翻翻卡</strong><p>找出 4 對文字和圖畫朋友，不設限時。</p><b>開始簡易試玩 <ChevronRight className="h-5 w-5" /></b></div></button>
      <button onClick={() => onChoose("challenge")} className="match-mode-card challenge"><span>🏁</span><div><em>完成可上榜</em><strong>16 張正式挑戰</strong><p>找出 8 對朋友，三分鐘內完成便會記錄成績。</p><b>開始正式挑戰 <ChevronRight className="h-5 w-5" /></b></div></button>
    </section>
    <button onClick={onOpenLeaderboard} className="game-quiet-button mt-4 w-full">🏆 查看正式挑戰排行榜</button>
  </GameShell>;
}
export function MatchGame({ pool, mode = "challenge", onBack, onMatchCorrect, onGuide, onMatchComplete, onOpenLeaderboard, canJoinLeaderboard = false }: { pool: GameWord[]; mode?: MatchMode; onBack: () => void; onMatchCorrect: (word: GameWord) => void; onGuide: () => void; onMatchComplete?: (result: { durationSeconds: number; moves: number }) => void; onOpenLeaderboard?: () => void; canJoinLeaderboard?: boolean }) {
  const { displayText } = useChineseScript();
  const modeConfig = MATCH_MODE_CONFIG[mode];
  const isRankedMode = mode === "challenge";
  const [roundIndex, setRoundIndex] = useState(() => Math.floor(Math.random() * Math.max(pool.length, 1)));
  const [cardBackIndex, setCardBackIndex] = useState(0);
  const pairs = useMemo(() => selectMatchPairs(pool, roundIndex, modeConfig.pairCount), [modeConfig.pairCount, pool, roundIndex]);
  const cards = useMemo(() => createShuffledMatchCards(pairs), [pairs]);
  const [opened, setOpened] = useState<PairSelection[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<MatchStatus>("playing");
  const [message, setMessage] = useState(`翻開一張文字卡，再翻開一張圖畫卡。這局共有 ${modeConfig.pairCount} 對朋友。`);
  const completedRoundRef = useRef(false);
  const cardBackAsset = MATCH_CARD_BACK_ASSETS[cardBackIndex];
  const startNewRound = () => { completedRoundRef.current = false; setRoundIndex((value) => value + 1); setCardBackIndex((value) => (value + 1) % MATCH_CARD_BACK_ASSETS.length); setOpened([]); setMatched([]); setMoves(0); setElapsedSeconds(0); setStatus("playing"); setMessage(`翻開兩張卡，找出文字和圖畫的朋友。這局共有 ${modeConfig.pairCount} 對朋友。`); };
  useEffect(() => {
    if (!shouldRunMatchStopwatch(status, modeConfig.timeLimitSeconds, elapsedSeconds)) return;
    const timer = window.setTimeout(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearTimeout(timer);
  }, [elapsedSeconds, modeConfig.timeLimitSeconds, status]);
  useEffect(() => {
    if (status === "playing" && modeConfig.timeLimitSeconds !== null && elapsedSeconds >= modeConfig.timeLimitSeconds) { setOpened([]); setStatus("timeUp"); setMessage("時間到了！下一局再挑戰三分鐘完成吧。"); }
  }, [elapsedSeconds, modeConfig.timeLimitSeconds, status]);
  const choose = (pick: PairSelection) => {
    if (status !== "playing" || matched.includes(pick.index) || opened.some((item) => item.kind === pick.kind && item.index === pick.index) || opened.length >= 2) return;
    const next = [...opened, pick];
    setOpened(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      const [first, second] = next;
      if (first.index === second.index && first.kind !== second.kind) {
        setMatched((value) => [...value, first.index]);
        setMessage("配對成功！聽一聽這個字詞。 ");
        onMatchCorrect(pairs[first.index]);
        if (matched.length + 1 === pairs.length && !completedRoundRef.current) {
          completedRoundRef.current = true;
          const durationSeconds = Math.max(1, elapsedSeconds);
          setStatus("complete");
          setMessage(isRankedMode ? "三分鐘配對挑戰成功！" : "簡易配對完成！");
          if (isRankedMode) onMatchComplete?.({ durationSeconds, moves: moves + 1 });
        }
        window.setTimeout(() => setOpened([]), 900);
      } else {
        setMessage("未配對到，慢慢再試。 ");
        window.setTimeout(() => setOpened([]), MATCH_MISMATCH_RESET_DELAY_MS);
      }
    }
  };
  if (!pairs.length) return <GameShell title="圖片文字配對" eyebrow="初級圖畫配對" onBack={onBack}><p className="game-empty-message">暫未可建立這個遊戲，請返回再試。</p></GameShell>;
  if (status === "complete") return <GameShell title="圖片文字配對" eyebrow={isRankedMode ? canJoinLeaderboard ? "挑戰成功・已更新最佳時間" : "挑戰成功・登入後可加入排行榜" : "簡易試玩完成"} onBack={onBack}><GameComplete title={isRankedMode ? "三分鐘配對成功！" : "簡易配對完成！"} timeText={`⏱ ${formatMatchTime(Math.max(1, elapsedSeconds))}`} detail={isRankedMode ? canJoinLeaderboard ? "完成八對，最佳時間已同步。" : "完成八對。家長登入後，再完成一局便可加入排行榜。" : "完成四對，做得好！"} rewardMark={isRankedMode ? "🏁" : "🌱"} celebrate onAgain={startNewRound} onBack={onBack} />{isRankedMode && onOpenLeaderboard && <button onClick={onOpenLeaderboard} className="game-quiet-button mt-4 w-full">🏆 查看全體時間排行榜</button>}</GameShell>;
  if (status === "timeUp") return <GameShell title="圖片文字配對" eyebrow="時間到" onBack={onBack}><GameComplete title="再挑戰一次！" detail={`已配對 ${matched.length}/${pairs.length} 對；下局在三分鐘內完成八對即可上榜。`} rewardMark="⏰" onAgain={startNewRound} onBack={onBack} /></GameShell>;
  return <GameShell title="圖片文字配對" eyebrow={`${isRankedMode ? "正式挑戰" : "簡易試玩"}・已配對 ${matched.length}/${pairs.length}`} onBack={onBack}><>{isRankedMode && onOpenLeaderboard && <button onClick={onOpenLeaderboard} className="mb-3 w-full rounded-2xl bg-[#EDF4FF] px-4 py-3 text-sm font-black text-[#496A9B] shadow-sm active:scale-[0.98]">🏆 查看時間排行榜</button>}<GuideCard text={modeConfig.guide} onGuide={onGuide} /><div className="match-action-row"><p className="game-match-message">{message}</p><button onClick={startNewRound} className="match-replay-button">↻ 再玩一次</button></div><section className="memory-board"><div className="memory-board-status"><span>已配對 {matched.length}/{pairs.length} 對</span>{isRankedMode && <strong aria-live="polite">⏱ 剩餘 {formatMatchTime(Math.max(0, (modeConfig.timeLimitSeconds ?? 0) - elapsedSeconds))}</strong>}</div><div className="memory-grid">{cards.map((card) => { const word = pairs[card.index]; const isOpen = opened.some((item) => item.kind === card.kind && item.index === card.index) || matched.includes(card.index); return <button key={`${card.kind}-${word.term}`} onClick={() => choose(card)} className={`memory-card ${card.kind === "image" ? "picture-card" : ""} ${isOpen ? "is-open" : ""} ${matched.includes(card.index) ? "is-matched" : ""}`}><span className="memory-card-inner"><span className="memory-card-face memory-card-cover"><img src={cardBackAsset} alt="" aria-hidden="true" className="memory-card-back" /></span><span className="memory-card-face memory-card-reveal">{card.kind === "word" ? <strong>{displayText(word.term)}</strong> : <img src={MATCH_IMAGE_BY_TERM[word.term]} alt={`${displayText(word.term)} 圖畫`} className="memory-picture" />}</span></span></button>; })}</div></section><p className="mt-4 text-center text-[10px] font-bold text-[#718095]">配圖：使用者提供的動物、家居、交通、服裝、玩具、職業、運動及工具圖庫</p></></GameShell>;
}

const buildSpecs = [
  { term: "太陽", parts: ["太", "阝", "日", "昜"], extra: ["木", "口"] },
  { term: "花朵", parts: ["艹", "化", "朵"], extra: ["月", "雨"] },
  { term: "森林", parts: ["森", "林"], extra: ["日", "花"] },
];
export function BuildGame({ pool, onBack, onPlayCantonese, onPlayMandarin, onGuide }: { pool: GameWord[]; onBack: () => void; onPlayCantonese: (word: GameWord) => void; onPlayMandarin: (word: GameWord) => void; onGuide: () => void }) {
  const rounds = buildSpecs.map((spec) => ({ ...spec, word: pool.find((item) => item.term === spec.term) })).filter((item): item is typeof buildSpecs[number] & { word: GameWord } => Boolean(item.word));
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const current = rounds[round % Math.max(rounds.length, 1)];
  if (!current) return <GameShell title="拆字拼拼樂" eyebrow="中級字形挑戰" onBack={onBack}><p className="game-empty-message">暫未可建立這個遊戲，請返回再試。</p></GameShell>;
  const parts = rotate([...current.parts, ...current.extra], round % (current.parts.length + current.extra.length));
  const addPart = (part: string) => { if (solved || chosen.includes(part)) return; const next = [...chosen, part]; setChosen(next); if (next.join("") === current.parts.join("")) { setSolved(true); onPlayCantonese(current.word); window.setTimeout(() => onPlayMandarin(current.word), 900); } };
  const reset = () => { setChosen([]); setSolved(false); };
  const nextRound = () => { reset(); setRound((value) => value + 1); };
  return <GameShell title="拆字拼拼樂" eyebrow={`第 ${(round % rounds.length) + 1}/${rounds.length} 題・中級字形挑戰`} onBack={onBack}>{solved ? <GameComplete title="拼得好！" detail={`「${current.word.term}」的粵拼是 ${current.word.jyutping}。`} onAgain={nextRound} onBack={onBack} /> : <><GuideCard text="長按拖拉或逐下點按部件，拼出完整字詞。" onGuide={onGuide} /><section className="build-target-card"><p>目標字詞</p><strong>{current.term}</strong><small>把下方部件按正確次序放進拼字軌。</small></section><section className="build-slot" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addPart(event.dataTransfer.getData("text/plain")); }}>{chosen.length ? chosen.map((part, index) => <span key={`${part}-${index}`}>{part}</span>) : <p>拼字軌</p>}</section><div className="build-parts">{parts.map((part, index) => <button key={`${part}-${index}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", part)} onClick={() => addPart(part)} disabled={chosen.includes(part)}>{part}</button>)}</div><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={reset} className="game-quiet-button">重新拼</button><button onClick={() => onPlayCantonese(current.word)} className="game-audio-button"><Volume2 className="h-5 w-5" />聽讀音</button></div><p className="mt-4 text-center text-sm font-bold text-[#6B7890]">先揀「{current.parts[0]}」開始；拼好會自動播放粵語和普通話。</p></>}</GameShell>;
}

export function ReviewQuestGame({ reviewTerms, allTerms, onBack, onPlayCantonese, onPlayMandarin, onPreload, onGuide }: { reviewTerms: GameWord[]; allTerms: GameWord[]; onBack: () => void; onPlayCantonese: (word: GameWord) => void; onPlayMandarin: (word: GameWord) => void; onPreload?: (term: string, language: "cantonese" | "mandarin") => void; onGuide: () => void }) {
  const { displayText } = useChineseScript();
  const [questions] = useState(() => {
    const saved = shuffle(uniqueByTerm(reviewTerms), Math.random);
    return saved.slice(0, Math.min(5, saved.length));
  });
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [language, setLanguage] = useState<"cantonese" | "mandarin">("cantonese");
  const target = questions[index];
  const wordOptions = useMemo(() => target ? createReviewOptions(target, allTerms) : [], [allTerms, index, target]);
  useEffect(() => {
    if (!onPreload) return;
    [questions[index], questions[index + 1]].filter((word): word is GameWord => Boolean(word)).forEach((word) => {
      onPreload(word.term, "cantonese");
      onPreload(word.term, "mandarin");
    });
  }, [index, onPreload, questions]);
  useEffect(() => {
    if (!target || feedback !== "idle") return;
    language === "cantonese" ? onPlayCantonese(target) : onPlayMandarin(target);
  // 只在新題目進入時自動讀一次；切換語言與父層播放狀態更新都必須由玩家主動再聽。
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, target?.term]);
  if (!questions.length) return <GameShell title="闖關小測驗" eyebrow="溫習庫專屬挑戰" onBack={onBack}><section className="game-empty-message"><Star className="mx-auto h-12 w-12 text-[#F5B83D]" /><h1>先儲幾個字詞</h1><p>在認字頁撳星星加入溫習庫，之後就可以開始五題闖關。</p><button onClick={onBack} className="game-primary-button mt-6">返回遊戲選單</button></section></GameShell>;
  if (!target) return null;
  const choose = (selected: GameWord) => { if (selected.term === target.term) { setFeedback("good"); setCorrectCount((value) => value + 1); language === "cantonese" ? onPlayCantonese(target) : onPlayMandarin(target); } else setFeedback("try"); };
  const next = () => { setFeedback("idle"); setIndex((value) => value + 1); };
  return <GameShell title="闖關小測驗" eyebrow={`第 ${Math.min(index + 1, questions.length)}/${questions.length} 題・答對 ${correctCount} 題`} onBack={onBack}>{index >= questions.length ? <GameComplete title="小測驗完成！" detail={`你答對 ${correctCount}/${questions.length} 題；字詞會保留在溫習庫，隨時可以再挑戰。`} onAgain={() => { setIndex(0); setCorrectCount(0); setFeedback("idle"); }} onBack={onBack} rewardMark="🎯" /> : <><GuideCard text="先聽讀音，再揀出正確的溫習庫字詞。" onGuide={onGuide} /><section className="game-question-card"><p className="game-question-label">聽字揀字</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => { setLanguage("cantonese"); onPlayCantonese(target); }} className={`game-listen-button ${language === "cantonese" ? "ring-2 ring-[#67A886]" : ""}`}><Volume2 />粵語</button><button onClick={() => { setLanguage("mandarin"); onPlayMandarin(target); }} className={`game-listen-button ${language === "mandarin" ? "ring-2 ring-[#67A886]" : ""}`}><Volume2 />普通話</button></div><p className="mt-3 text-xs font-bold text-[#67768B]">可隨時再聽一次。</p></section><div className="game-option-grid">{wordOptions.map((word) => <button key={word.term} onClick={() => choose(word)} className={feedback === "good" && word.term === target.term ? "is-correct" : ""}>{displayText(word.term)}</button>)}</div><section className={`game-feedback ${feedback}`}>{feedback === "good" ? <><Sparkles />答得好！下一題繼續。</> : feedback === "try" ? <><Volume2 />再聽一次，再選一個答案。</> : <>聽清楚讀音，再選擇字詞。</>}</section>{feedback === "good" && <button onClick={next} className="game-primary-button mt-4 w-full">下一題 <ChevronRight className="h-5 w-5" /></button>}</>}</GameShell>;
}

export function FindWordGame({ pool, onBack, onGuide }: { pool: GameWord[]; onBack: () => void; onGuide: () => void }) {
  const words = uniqueByTerm(pool).slice(0, 9);
  const [round, setRound] = useState(0);
  const [found, setFound] = useState(false);
  const target = words[round % Math.max(words.length, 1)];
  const board = useMemo(() => target ? rotate([target, ...words.filter((word) => word.term !== target.term).slice(0, 8)], round % 6) : [], [round, target, words]);
  if (!target) return null;
  return <GameShell title="找錯字" eyebrow="輕量小遊戲" onBack={onBack}>{found ? <GameComplete title="找到了！" detail={`你成功找出「${target.term}」。`} onAgain={() => { setFound(false); setRound((value) => value + 1); }} onBack={onBack} /> : <><GuideCard text="睇清楚，找出指定的字。" onGuide={onGuide} /><section className="find-target">請找出：<strong>{target.term}</strong></section><div className="find-word-grid">{board.map((word, index) => <button key={`${word.term}-${index}`} onClick={() => word.term === target.term && setFound(true)}>{word.term}</button>)}</div><p className="game-match-message">慢慢找，找到後小貓會為你送上星星。</p></>}</GameShell>;
}

const blankRounds = [{ prompt: "我喜歡吃＿＿。", answer: "蘋果" }, { prompt: "晚上會看見＿＿。", answer: "月亮" }, { prompt: "老師在＿＿教書。", answer: "學校" }];
export function FillBlankGame({ pool, onBack, onGuide }: { pool: GameWord[]; onBack: () => void; onGuide: () => void }) {
  const usable = blankRounds.map((round) => ({ ...round, word: pool.find((word) => word.term === round.answer) ?? null })).filter((round): round is (typeof blankRounds[number] & { word: GameWord }) => Boolean(round.word));
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const current = usable[round % Math.max(usable.length, 1)];
  if (!current) return <GameShell title="填字小空格" eyebrow="輕量小遊戲" onBack={onBack}><p className="game-empty-message">暫未可建立這個遊戲，請返回再試。</p></GameShell>;
  const options = rotate([current.word, ...uniqueByTerm(pool).filter((word) => word.term !== current.answer).slice(0, 2)], round % 3);
  const [beforeBlank, afterBlank] = current.prompt.split("＿＿");
  return <GameShell title="填字小空格" eyebrow={`第 ${round + 1}/${usable.length} 題・輕量小遊戲`} onBack={onBack}>{feedback === "good" ? <GameComplete title="填得好！" detail={`「${current.answer}」放得很合適。`} onAgain={() => { setFeedback("idle"); setRound((value) => value + 1); }} onBack={onBack} /> : <><GuideCard text="揀出合適的字，放進空格。" onGuide={onGuide} /><section className="blank-sentence">{beforeBlank}<span>＿＿</span>{afterBlank}</section><div className="blank-options">{options.map((word) => <button key={word.term} onClick={() => setFeedback(word.term === current.answer ? "good" : "try")}>{word.term}</button>)}</div><section className={`game-feedback ${feedback}`}>{feedback === "try" ? <><Volume2 />再想一想，哪個字最適合？</> : <>讀一讀句子，再揀答案。</>}</section></>}</GameShell>;
}

export const gameGuideSource = GUIDE_AUDIO;
