import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import terms from "@/data/terms.json";
import topicAudio from "@/data/topicAudio";
import { BEGINNER_FOOD_MATCH_TERMS, createReviewOptions, createShuffledMatchCards, GAME_HUB_EXPLORER_CAT_ASSET, GAME_HUB_ORDER, GAME_HUB_TITLE_CLASS, MATCH_CARD_BACK_ASSET, MATCH_CARD_BACK_ASSETS, MATCH_CHALLENGE_PAIR_COUNT, MATCH_EASY_PAIR_COUNT, MATCH_GAME_HUB_CAT_HEAD_ASSET, MATCH_IMAGE_BY_TERM, MATCH_MISMATCH_RESET_DELAY_MS, MATCH_MODE_CONFIG, MATCH_PAIR_COUNT, MATCH_TIME_SECONDS, selectMatchPairs, shouldRunMatchStopwatch, TEMPORARILY_LOCKED_GAME_IDS, type GameWord } from "./WordGames";

describe("遊戲樂園與圖片文字配對", () => {
  it("開放地圖闖關、圖片文字配對及溫習庫闖關小測驗", () => {
    expect(GAME_HUB_ORDER[0]).toBe("map");
    expect(TEMPORARILY_LOCKED_GAME_IDS).toEqual(["listen", "build", "findWord", "fillBlank"]);
    expect(TEMPORARILY_LOCKED_GAME_IDS).not.toContain("map");
    expect(TEMPORARILY_LOCKED_GAME_IDS).not.toContain("match");
    expect(TEMPORARILY_LOCKED_GAME_IDS).not.toContain("reviewQuest");
  });

  it("遊戲天地使用真正透明背景的小貓 PNG，而非棋盤格版本", () => {
    expect(GAME_HUB_EXPLORER_CAT_ASSET).toBe("/manus-storage/explorer-cat-alpha_c47fe82f.png");
    expect(GAME_HUB_EXPLORER_CAT_ASSET).not.toContain("transparent_97a48972");
  });

  it("遊戲天地以放大冒險小貓、無白底地圖及圓潤標題呈現", () => {
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(GAME_HUB_TITLE_CLASS).toBe("game-world-title");
    expect(styles).toContain(".game-world-cat { @apply relative h-44 w-44");
    expect(styles).toContain(".game-world-main-card");
    expect(styles).toContain(".game-world-title");
  });

  it("遊戲天地只展示三張同尺寸的主遊戲卡，並移除其他小遊戲入口", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(component).toContain("game-world-main-list");
    expect(component).toContain("地圖闖關");
    expect(component).toContain("圖片文字配對");
    expect(component).toContain("闖關小測驗");
    expect(component).toContain("溫習庫聽字揀字");
    expect(component).not.toContain("其他小遊戲");
    expect(component).not.toContain("game-world-mini");
    expect(styles).toContain(".game-world-main-card.map");
    expect(styles).toContain(".game-world-main-card.match");
    expect(styles).toContain(".game-world-main-card.review");
  });

  it("初級食物 30 張使用者配對圖都有唯一字詞及固定雙語讀音", () => {
    const termsByName = new Set(terms.map((item) => item.term));
    const matchTerms = Object.keys(MATCH_IMAGE_BY_TERM);

    expect(BEGINNER_FOOD_MATCH_TERMS).toHaveLength(30);
    expect(matchTerms).toHaveLength(203);
    BEGINNER_FOOD_MATCH_TERMS.forEach((term) => {
      expect(termsByName.has(term)).toBe(true);
      expect(MATCH_IMAGE_BY_TERM[term]).toMatch(/^\/manus-storage\/.+\.png$/);
      expect(topicAudio[term]?.cantonese).toBeTruthy();
      expect(topicAudio[term]?.mandarin).toBeTruthy();
    });
  });

  it("正式挑戰每局隨機抽取八組、共十六張卡，重玩時會產生不同的一組", () => {
    const foodPool = BEGINNER_FOOD_MATCH_TERMS.map((term) => ({ term, jyutping: "", pinyin: "", level: "preschool", category: "food", topic: "food" })) as GameWord[];
    expect(MATCH_PAIR_COUNT).toBe(8);
    const firstRound = selectMatchPairs(foodPool, 0);
    const nextRound = selectMatchPairs(foodPool, 1);
    expect(firstRound).toHaveLength(8);
    expect(new Set(firstRound.map((item) => item.term))).toHaveLength(8);
    expect(nextRound.map((item) => item.term)).not.toEqual(firstRound.map((item) => item.term));
  });

  it("簡易試玩固定使用四對、共八張翻翻卡，沒有倒數限制亦不會送出排行榜成績", () => {
    const foodPool = BEGINNER_FOOD_MATCH_TERMS.map((term) => ({ term, jyutping: "", pinyin: "", level: "preschool", category: "food", topic: "food" })) as GameWord[];
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    const easyPairs = selectMatchPairs(foodPool, 0, MATCH_EASY_PAIR_COUNT);

    expect(MATCH_EASY_PAIR_COUNT).toBe(4);
    expect(MATCH_CHALLENGE_PAIR_COUNT).toBe(8);
    expect(MATCH_MODE_CONFIG.easy.timeLimitSeconds).toBeNull();
    expect(MATCH_MODE_CONFIG.challenge.timeLimitSeconds).toBe(MATCH_TIME_SECONDS);
    expect(createShuffledMatchCards(easyPairs, () => 0)).toHaveLength(8);
    expect(shouldRunMatchStopwatch("playing", MATCH_MODE_CONFIG.easy.timeLimitSeconds, 120)).toBe(true);
    expect(shouldRunMatchStopwatch("playing", MATCH_MODE_CONFIG.challenge.timeLimitSeconds, MATCH_TIME_SECONDS - 1)).toBe(true);
    expect(shouldRunMatchStopwatch("playing", MATCH_MODE_CONFIG.challenge.timeLimitSeconds, MATCH_TIME_SECONDS)).toBe(false);
    expect(shouldRunMatchStopwatch("complete", MATCH_MODE_CONFIG.easy.timeLimitSeconds, 120)).toBe(false);
    expect(component).toContain("shouldRunMatchStopwatch(status, modeConfig.timeLimitSeconds, elapsedSeconds)");
    expect(component).toContain('if (isRankedMode) onMatchComplete?.({ durationSeconds, moves: moves + 1 });');
    expect(component).toContain("8 張翻翻卡");
    expect(component).toContain("16 張正式挑戰");
  });

  it("圖片卡在翻開後以滿格圖像呈現", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(component).toContain('className="memory-picture"');
    expect(styles).toContain(".memory-picture { @apply h-full w-full object-cover; }");
  });

  it("十六張配對卡會輪流使用兩張使用者小貓圖作卡背，並隨機混排文字與圖畫卡", () => {
    const pool = BEGINNER_FOOD_MATCH_TERMS.map((term) => ({ term, jyutping: "", pinyin: "", level: "preschool" })) as GameWord[];
    const cards = createShuffledMatchCards(selectMatchPairs(pool, 0), () => 0);
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(MATCH_CARD_BACK_ASSET).toBe("/manus-storage/match-card-back-cat-optimized_faee46f8.webp");
    expect(MATCH_CARD_BACK_ASSETS).toEqual(["/manus-storage/match-card-back-cat-optimized_faee46f8.webp", "/manus-storage/match-card-back-cat2-optimized_9e7d4d39.webp"]);
    expect(cards).toHaveLength(16);
    expect(new Set(cards.slice(0, 8).map((card) => card.kind))).toEqual(new Set(["word", "image"]));
    for (let row = 0; row < 4; row += 1) expect(new Set(cards.slice(row * 4, row * 4 + 4).map((card) => card.kind))).toEqual(new Set(["word", "image"]));
    expect(styles).toContain(".memory-card-back { @apply h-full w-full object-cover; }");
  });

  it("圖片文字配對入口使用壓縮後的貓頭圖，而不是舊蘋果圖", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    expect(MATCH_GAME_HUB_CAT_HEAD_ASSET).toBe("/manus-storage/match-game-cat-head_63b51e1a.webp");
    expect(component).toContain('icon: <img src={MATCH_GAME_HUB_CAT_HEAD_ASSET} alt="小貓頭圖畫" />');
  });

  it("成功配對會立即呼叫鼓勵聲效橋接，翻錯卡則只短暫停留 0.7 秒", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    expect(component).toContain("onMatchCorrect(pairs[first.index]);");
    expect(MATCH_MISMATCH_RESET_DELAY_MS).toBe(700);
    expect(component).toContain("window.setTimeout(() => setOpened([]), MATCH_MISMATCH_RESET_DELAY_MS);");
  });

  it("正式挑戰會跨主題隨機抽詞、完成後以實際已用時間提交最佳成績並播放慶祝效果，失配不會寫入溫習庫", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(MATCH_TIME_SECONDS).toBe(180);
    expect(component).toContain("setStatus(\"timeUp\")");
    expect(component).toContain("const [elapsedSeconds, setElapsedSeconds] = useState(0)");
    expect(component).toContain('className="memory-board-status"');
    expect(component).toContain("⏱ 剩餘 {formatMatchTime(Math.max(0, (modeConfig.timeLimitSeconds ?? 0) - elapsedSeconds))}");
    expect(component).toContain("已配對 {matched.length}/{pairs.length} 對");
    expect(component).toContain('className="game-complete-time"');
    expect(component).toContain("timeText={`⏱ ${formatMatchTime(Math.max(1, elapsedSeconds))}`}");
    expect(styles).toContain(".game-complete-time");
    expect(component).toContain("match-victory");
    expect(component).toContain("↻ 再玩一次");
    expect(component).toContain("三分鐘內完成即可加入時間排行榜");
    expect(component).toContain("查看全體時間排行榜");
    expect(component).not.toContain("onAddReview(pairs[wordPick.index])");
    expect(styles).toContain("@keyframes match-confetti-pop");
  });

  it("闖關小測驗只用溫習庫字詞出題，採聽字揀字、同字數選項及隨機排序", () => {
    const target: GameWord = { term: "蘋果", jyutping: "", pinyin: "", level: 1 };
    const choices = createReviewOptions(target, [target, { term: "香蕉", jyutping: "", pinyin: "", level: 1 }, { term: "西瓜", jyutping: "", pinyin: "", level: 1 }, { term: "草莓", jyutping: "", pinyin: "", level: 1 }, { term: "樹木", jyutping: "", pinyin: "", level: 1 }], () => 0.3);
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    expect(choices).toHaveLength(4);
    expect(new Set(choices.map((word) => word.term))).toHaveLength(4);
    expect(choices).toContainEqual(target);
    expect(choices.every((word) => word.term.length === target.term.length)).toBe(true);
    expect(component).toContain("聽字揀字");
    expect(component).toContain("字詞會保留在溫習庫");
    expect(component).not.toContain("看字揀圖");
    expect(component).not.toContain("onRemoveReview(target)");
  });

  it("溫習庫小測驗會先預載目前及下一題雙語讀音，並在切換題目後立即播放", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");

    expect(component).toContain("[questions[index], questions[index + 1]]");
    expect(component).toContain('onPreload(word.term, "cantonese")');
    expect(component).toContain('onPreload(word.term, "mandarin")');
    expect(component).not.toContain("setTimeout(() => (language === \"cantonese\"");
  });

  it("翻開卡片維持 3D 翻轉方式展示字詞或圖畫，並以短暫發光震動作非音效回饋", () => {
    const component = readFileSync(new URL("./WordGames.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    expect(component).toContain("memory-card");
    expect(component).toContain("memory-card-inner");
    expect(styles).toContain(".memory-card.is-open .memory-card-inner");
    expect(styles).toContain("rotate-y-180");
    expect(styles).toContain(".memory-card.is-open { box-shadow");
    expect(styles).toContain("memory-card-flip-feedback 260ms");
    expect(styles).toContain("prefers-reduced-motion: no-preference");
    expect(component).not.toContain("playCardFlip");
  });

  it("資料工具可接受第 1 至第 10 級的數字級別欄位，而且圖片配對已開放", () => {
    const tenLevelWord: GameWord = { term: "蘋果", jyutping: "ping4 gwo2", pinyin: "píng guǒ", level: 1, topic: "水果與飲品", mapId: "M01" };
    expect(selectMatchPairs([tenLevelWord], 0)).toEqual([tenLevelWord]);
    expect(TEMPORARILY_LOCKED_GAME_IDS).not.toContain("match");
  });

  it("使用者提供的 M07 動物圖已按 5×5 順序映射至全部 25 個動物詞", () => {
    const animalTerms = ["企鵝", "兔子", "八爪魚", "大象", "小狗", "幼貓", "小魚", "小鳥", "斑馬", "鵝", "松鼠", "河馬", "海星", "海豚", "牛", "狐狸", "狼", "猴子", "獅子", "章魚", "羊", "老虎", "蛇", "袋鼠", "金魚"];
    animalTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(/^\/manus-storage\/.*\.(?:png|svg)$/));
  });

  it("使用者提供的 M23 交通圖已映射 24 個正確詞語，站牌格暫不使用", () => {
    const transportTerms = ["八達通", "單車", "地鐵", "安全帶", "巴士", "方向盤", "校巴", "機場", "汽車", "消防車", "渡輪", "火車", "的士", "船", "貨車", "路軌", "車票", "車窗", "車站", "車輪", "車門", "隧道", "電車", "飛機"];
    transportTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(/^\/manus-storage\/transport-.*\.png$/));
    expect(MATCH_IMAGE_BY_TERM["站牌"]).toBeUndefined();
  });

  it("使用者提供的 M19 家居用品及 M40 服裝穿戴圖均按 5×5 順序映射全部 25 詞", () => {
    const householdTerms = ["冰箱", "剪刀", "尺子", "床", "書", "書本", "杯子", "枕頭", "桌子", "椅子", "橡皮", "毛巾", "湯匙", "燈", "牙刷", "碗", "碟子", "窗戶", "筆袋", "筷子", "背包", "膠水", "衣服", "被子", "門"];
    const clothingTerms = ["恤衫", "便服", "制服", "圍巾", "外套", "大衣", "布鞋", "帽子", "手套", "打扮", "毛衣", "泳衣", "背心", "浴袍", "燙", "皮帶", "皮鞋", "睡衣", "穿著", "衣衫", "裙子", "褲子", "襪子", "雨衣", "鞋"];
    householdTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(/^\/manus-storage\/m19-home-.*\.png$/));
    clothingTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(/^\/manus-storage\/m40-clothing-.*\.png$/));
  });

  it("使用者提供的 M22 玩具與遊戲圖已按 5×5 順序映射全部 25 個詞", () => {
    const toyTerms = ["吹泡泡", "呼拉圈", "拼圖", "木馬", "棋子", "樂高", "氣球", "沙包", "洋娃娃", "滑板", "玩偶", "玩具屋", "玩具熊", "玩具車", "畫筆", "皮球", "積木", "紙牌", "貼紙", "跳繩", "陀螺", "風箏", "飛盤", "骰子", "黏土"];
    const toyAssetNames = ["m22-toy-01", "m22-toy-02", "m22-toy-03", "m22-toy-04", "m22-toy-05", "m22-toy-06", "m22-toy-07", "m22-toy-08", "m22-toy-09", "m22-toy-skateboard", "m22-toy-11", "m22-toy-12", "m22-toy-13", "m22-toy-14", "m22-toy-15", "m22-toy-16", "m22-toy-17", "m22-toy-18", "m22-toy-19", "m22-toy-20", "m22-toy-21", "m22-toy-22", "m22-toy-23", "m22-toy-24", "m22-toy-25"];
    toyTerms.forEach((term, index) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(new RegExp(`^/manus-storage/${toyAssetNames[index]}_.*\\.png$`)));
  });

  it("使用者提供的 M26 職業人物圖只映射附表中的 18 個非空白格", () => {
    const professionTerms = ["機師", "廚師", "演員", "護士", "園丁", "建築師", "歌手", "牙醫", "農夫", "導遊", "律師", "消防員", "畫家", "運動員", "工程師", "郵差", "警察", "醫生"];
    const missingTerms = ["司機", "店員", "會計師", "服務員", "清潔工", "漁民", "記者"];
    professionTerms.forEach((term, index) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(new RegExp(`^/manus-storage/m26-profession-${String(index + 1).padStart(2, "0")}_.*\\.png$`)));
    missingTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toBeUndefined());
  });

  it("使用者提供的 M27 運動與活動圖只映射原始格位中有圖的 12 個詞", () => {
    const activityTerms = ["乒乓球", "冠軍", "排球", "教練", "游泳", "滑雪", "獎牌", "瑜伽", "羽毛球", "行山", "足球", "跑步"];
    const missingTerms = ["投球", "接力", "比賽", "泳池", "滑冰", "熱身", "球拍", "網球", "跳遠", "跳高", "踢球", "隊友", "馬拉松"];
    activityTerms.forEach((term, index) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(new RegExp(`^/manus-storage/m27-activity-${String(index + 1).padStart(2, "0")}_.*\\.png$`)));
    missingTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toBeUndefined());
  });

  it("使用者提供的 M21 工具與實用設備圖只映射實際有圖的 18 個詞", () => {
    const equipmentTerms = ["回收箱", "垃圾桶", "急救箱", "手電筒", "抽屜", "指南針", "收音機", "放大鏡", "文件夾", "書架", "滅火筒", "滑鼠", "訂書機", "路由器", "遙控車", "量角器", "鍵盤", "電池"];
    const missingTerms = ["三角板", "打孔機", "檔案袋", "硬碟", "血壓計", "記憶卡", "鞋櫃"];
    equipmentTerms.forEach((term, index) => expect(MATCH_IMAGE_BY_TERM[term]).toMatch(new RegExp(`^/manus-storage/m21-equipment-${String(index + 1).padStart(2, "0")}_.*\\.png$`)));
    missingTerms.forEach((term) => expect(MATCH_IMAGE_BY_TERM[term]).toBeUndefined());
  });

  it("圖片文字配對只從使用者提供的 M07、M19、M21、M22、M23、M26、M27、M40 切圖跨主題抽詞，不使用昨日食物圖", () => {
    const home = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
    expect(home).toContain('item.mapId === "M07"');
    expect(home).toContain('item.mapId === "M19"');
    expect(home).toContain('item.mapId === "M22"');
    expect(home).toContain('item.mapId === "M23"');
    expect(home).toContain('item.mapId === "M26"');
    expect(home).toContain('item.mapId === "M27"');
    expect(home).toContain('item.mapId === "M21"');
    expect(home).toContain('item.mapId === "M40"');
    expect(home).toContain("return [...animals, ...transport, ...household, ...clothing, ...toys, ...professions, ...activities, ...equipment];");
    expect(home).not.toContain("BEGINNER_FOOD_MATCH_TERMS");
  });
});
