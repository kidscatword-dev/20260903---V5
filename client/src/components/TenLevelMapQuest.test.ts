import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getTenLevelIcon, tenLevelTerms } from "@/data/tenLevelCatalog";
import { buildTenLevelQuestionChoices, PREPARE_LISTEN_CAT_ASSET } from "./TenLevelMapQuest";

describe("十級地圖闖關出題規則", () => {
  it("每題保留正確答案，並只選取不同關卡內的同字數近音干擾詞", () => {
    const target = tenLevelTerms.find(item => item.mapId === "M01" && item.stage === 1)!;
    const stageTerms = tenLevelTerms.filter(item => item.mapId === "M01" && item.stage === 1);
    const choices = buildTenLevelQuestionChoices(target, stageTerms, tenLevelTerms);

    expect(choices).toContainEqual(target);
    expect(new Set(choices.map(item => item.term)).size).toBe(choices.length);
    expect(choices.every(item => Array.from(item.term).length === Array.from(target.term).length)).toBe(true);
    expect(choices.filter(item => item.term !== target.term).every(item => !stageTerms.some(stageItem => stageItem.term === item.term))).toBe(true);
  });

  it("每次重玩的變化索引會換一組近音干擾詞，而正確答案仍保留", () => {
    const target = tenLevelTerms.find(item => item.mapId === "M01" && item.stage === 1)!;
    const stageTerms = tenLevelTerms.filter(item => item.mapId === "M01" && item.stage === 1);
    const firstRun = buildTenLevelQuestionChoices(target, stageTerms, tenLevelTerms, 0);
    const replayRun = buildTenLevelQuestionChoices(target, stageTerms, tenLevelTerms, 3);

    expect(firstRun[0]).toEqual(target);
    expect(replayRun[0]).toEqual(target);
    expect(firstRun.slice(1).map(item => item.term)).not.toEqual(replayRun.slice(1).map(item => item.term));
  });

  it("點選答案會顯示短暫焦點回饋，並在動畫後清除焦點", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");
    const styleSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");

    expect(componentSource).toContain("clickedChoice.blur()");
    expect(styleSource).toContain(".challenge-options button:focus");
    expect(styleSource).toContain("choice-tap-pop");
  });

  it("每次選對答案都會立即播放短促答對聲效，包括最後一題全對前的選擇", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");
    const rewardAudioSource = readFileSync(new URL("../lib/rewardAudio.ts", import.meta.url), "utf8");

    expect(componentSource).toContain('if (word.term === target.term) {\n      playCorrectChime();');
    expect(componentSource).not.toContain("} else playCorrectChime();");
    expect(rewardAudioSource).toContain("export const playCorrectChime");
  });

  it("五題全對會在小卡片內交替播放兩段有原聲的小貓鼓勵影片", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");
    const styleSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    const rewardAudioSource = readFileSync(new URL("../lib/rewardAudio.ts", import.meta.url), "utf8");

    expect(componentSource).toContain("PERFECT_ENCOURAGEMENT_CLIPS");
    expect(componentSource).toContain("cat-perfect-encourage-a-clean_e2b2c7c2.mp4");
    expect(componentSource).toContain("cat-perfect-encourage-b-clean_1427670d.mp4");
    expect(componentSource).toContain("setPerfectClipIndex(value => (value + 1) % PERFECT_ENCOURAGEMENT_CLIPS.length)");
    expect(componentSource).toContain("video.muted = false");
    expect(componentSource).toContain("useLayoutEffect(() => {");
    expect(componentSource).toContain('setView("perfectReward");');
    expect(componentSource).toContain("perfectRewardCompletionRef.current");
    expect(componentSource).toContain("key={perfectClip}");
    expect(componentSource).not.toContain("perfectVideoFailed");
    expect(componentSource).toContain("}, 380);");
    expect(componentSource).toContain('setView("perfectNext");');
    expect(componentSource).toContain('if (view === "perfectNext" && topic)');
    expect(componentSource).not.toContain("PERFECT_SCORE_YEAH_AUDIO");
    expect(rewardAudioSource).not.toContain("playPerfectScoreCelebration");
    expect(styleSource).toContain("aspect-square");
    expect(styleSource).toContain("perfect-reward-enter");
    expect(styleSource).toContain("perfect-video-enter");
  });

  it("集齊五塊碎片後會在合成字卡流程播放使用者提供的 card 音效", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");
    const rewardAudioSource = readFileSync(new URL("../lib/rewardAudio.ts", import.meta.url), "utf8");

    expect(componentSource).toContain("playMapLandCompleteJingle();");
    expect(componentSource).toContain("playCardCompleteFanfare();");
    expect(componentSource).toContain("}, 1500);");
    expect(rewardAudioSource).toContain('USER_CARD_AUDIO = "/manus-storage/card_5a49a3f0.mp3"');
    expect(rewardAudioSource).toContain('playUserEffect("card", 0.56)');
  });

  it("準備聽字詞頁會使用壓縮後的小貓圖，而不是耳仔圖示", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");

    expect(PREPARE_LISTEN_CAT_ASSET).toBe("/manus-storage/match-card-back-cat-optimized_faee46f8.webp");
    expect(componentSource).toContain('className="challenge-ready-cat"');
    expect(componentSource).not.toContain('<Ear className="mx-auto h-14 w-14');
  });

  it("準備與答題介面保留香港繁體，而答案詞語會按繁簡字模式轉換", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");

    expect(componentSource).toContain("<h1>準備聽字詞</h1>");
    expect(componentSource).toContain("先選擇語言");
    expect(componentSource).toContain("播放讀音，開始作答");
    expect(componentSource).toContain('displayText(getLanguageWord(target.term, language))');
    expect(componentSource).toContain('const displayTerm = displayText(getLanguageWord(word.term, language))');
  });

  it("進入關卡會預載五題的粵普讀音，答題回饋後以短過場直接播放下一題", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");

    expect(componentSource).toContain("stageTerms.forEach((word) => {");
    expect(componentSource).toContain('onPreload(word.term, "cantonese")');
    expect(componentSource).toContain('onPreload(word.term, "mandarin")');
    expect(componentSource).toContain("}, feedback === \"correct\" ? 350 : 450);");
  });

  it("十級地圖每級都有不同的前置小圖示", () => {
    const componentSource = readFileSync(new URL("./TenLevelMapQuest.tsx", import.meta.url), "utf8");
    const icons = Array.from({ length: 10 }, (_, index) => getTenLevelIcon((index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10));
    expect(new Set(icons)).toHaveLength(10);
    expect(componentSource).toContain("getTenLevelIcon(item)");
  });
});
