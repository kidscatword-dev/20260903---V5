import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Clock3, LockKeyhole, MapPinned, Play, Trophy, Volume2 } from "lucide-react";
import { FragmentStrip } from "@/components/FragmentStrip";
import { TopicCardSlice } from "@/components/TopicCardSlice";
import { getTenLevelDescription, getTenLevelIcon, getTenLevelLabel, getTenLevelTermStage, getTenLevelTopics, tenLevelTerms, tenLevels, type TenLevel, type TenLevelTerm } from "@/data/tenLevelCatalog";
import { getTenLevelFragmentCount, isTenLevelMapComplete, readTenLevelQuestProgress, TEN_LEVEL_FRAGMENT_MIN_STARS, TEN_LEVEL_QUEST_STAGES_PER_MAP, tenLevelQuestStageKey, writeTenLevelQuestProgress, type TenLevelQuestProgress } from "@/lib/tenLevelQuestProgress";
import { getTenLevelCardArt } from "@/lib/tenLevelCardArt";
import { phoneticSimilarityScore } from "@/lib/phoneticDistractors";
import { playCardCompleteFanfare, playCorrectChime, playMapLandCompleteJingle } from "@/lib/rewardAudio";
import { completesTenLevelCard, isPerfectTenLevelStage } from "@/lib/tenLevelRewardRules";
import { getPerfectRewardNextView } from "@/lib/tenLevelPerfectRewardFlow";
import { getLanguageWord } from "@/lib/wordLanguageVariants";
import { useChineseScript } from "@/contexts/ChineseScriptContext";
import { isTenLevelLocked } from "@/lib/familyUnlock";

type Language = "cantonese" | "mandarin";
type View = "levels" | "map" | "land" | "challenge" | "summary" | "perfectReward" | "perfectNext" | "assembly" | "reward";
type Feedback = "idle" | "correct" | "revealed";

const QUESTION_SECONDS = 15;
const ASSEMBLY_PIECES = ["top-left", "top-right", "middle-left", "middle-right", "bottom"] as const;
const assemblyPieceOrigins = [{ x: "0.28rem", y: "0rem" }, { x: "7.42rem", y: "0.36rem" }, { x: "0rem", y: "6.6rem" }, { x: "6.58rem", y: "6.4rem" }, { x: "2.8rem", y: "13rem" }];
const PERFECT_ENCOURAGEMENT_CLIPS = [
  "/manus-storage/cat-perfect-encourage-a-clean_e2b2c7c2.mp4",
  "/manus-storage/cat-perfect-encourage-b-clean_1427670d.mp4",
] as const;
export const PREPARE_LISTEN_CAT_ASSET = "/manus-storage/match-card-back-cat-optimized_faee46f8.webp";

const characterCount = (term: string) => Array.from(term).length;

const shuffle = <T,>(values: T[]) => {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

export const buildTenLevelQuestionChoices = (target: TenLevelTerm, stageTerms: TenLevelTerm[], allTerms: TenLevelTerm[], variation = 0) => {
  const stageTermSet = new Set(stageTerms.map(word => word.term));
  const candidates = allTerms
    .filter(candidate => candidate.term !== target.term && characterCount(candidate.term) === characterCount(target.term))
    .map(candidate => ({ candidate, score: phoneticSimilarityScore(target, candidate) }))
    .sort((left, right) => right.score - left.score)
    .map(({ candidate }) => candidate)
    .filter(candidate => !stageTermSet.has(candidate.term));
  const pool = candidates.slice(0, Math.min(candidates.length, 8));
  const offset = pool.length ? variation % pool.length : 0;
  const rotatedCandidates = [...pool.slice(offset), ...pool.slice(0, offset)];
  return [target, ...rotatedCandidates.slice(0, 3)];
};

export function TenLevelMapQuest({ familyUnlocked, onRequestUnlock, onBack, onPlay, onPreload, onMusicActiveChange, onStarsChange, onLevelSelectionChange }: { familyUnlocked: boolean; onRequestUnlock: () => void; onBack: () => void; onPlay: (term: string, language: Language) => void; onPreload?: (term: string, language: Language) => void; onMusicActiveChange: (active: boolean) => void; onStarsChange?: (stars: number) => void; onLevelSelectionChange?: (selected: boolean) => void }) {
  const { displayText } = useChineseScript();
  const [view, setView] = useState<View>("levels");
  const [level, setLevel] = useState<TenLevel>(1);
  const [mapIndex, setMapIndex] = useState(0);
  const [stage, setStage] = useState(1);
  const [language, setLanguage] = useState<Language>("cantonese");
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [runTerms, setRunTerms] = useState<TenLevelTerm[]>([]);
  const [runNonce, setRunNonce] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const [relistenRemaining, setRelistenRemaining] = useState(2);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [progress, setProgress] = useState<TenLevelQuestProgress>(() => readTenLevelQuestProgress());
  const [perfectCompletesMap, setPerfectCompletesMap] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isPerfectRewardFading, setIsPerfectRewardFading] = useState(false);
  const [perfectVideoFinished, setPerfectVideoFinished] = useState(false);
  const [perfectClipIndex, setPerfectClipIndex] = useState(-1);
  const perfectVideoRef = useRef<HTMLVideoElement>(null);
  const perfectRewardCompletionRef = useRef(false);
  useEffect(() => { onLevelSelectionChange?.(view !== "levels"); }, [onLevelSelectionChange, view]);
  useEffect(() => () => onLevelSelectionChange?.(false), [onLevelSelectionChange]);

  const topics = useMemo(() => getTenLevelTopics(level), [level]);
  const topic = topics[mapIndex] ?? topics[0];
  const stageTerms = useMemo(() => topic ? getTenLevelTermStage(topic, stage) : [], [stage, topic]);
  const activeRunTerms = runTerms.length === stageTerms.length ? runTerms : stageTerms;
  const target = activeRunTerms[questionIndex];
  const topicFragments = topic ? getTenLevelFragmentCount(progress, level, topic.id) : 0;
  const topicArt = topic ? getTenLevelCardArt(topic) : null;
  const assemblyArtStyle = topicArt ? {
    backgroundImage: `url(${topicArt.src})`,
    "--card-width": "14rem",
    "--card-height": "20rem",
    "--image-width": `${topicArt.isStandalone ? 14 : 42}rem`,
    "--slice-offset": topicArt.isStandalone ? "0rem" : `-${topicArt.sliceIndex * 14}rem`,
  } as CSSProperties : undefined;
  const isMapUnlocked = (index: number) => index === 0 || isTenLevelMapComplete(progress, level, topics[index - 1].id);
  const isStageUnlocked = (number: number) => number === 1 || (progress[tenLevelQuestStageKey(level, topic.id, number - 1)] ?? 0) > 0;
  const choices = useMemo(() => {
    if (!target) return [];
    const choiceSet = buildTenLevelQuestionChoices(target, stageTerms, tenLevelTerms, runNonce * 3 + questionIndex);
    const [correctChoice, ...distractors] = choiceSet;
    const targetPosition = (runNonce + questionIndex) % choiceSet.length;
    return [...distractors.slice(0, targetPosition), correctChoice, ...distractors.slice(targetPosition)];
  }, [questionIndex, runNonce, stageTerms, target]);

  const resetRun = () => {
    setQuestionIndex(0);
    setCorrect(0);
    setRemaining(QUESTION_SECONDS);
    setRelistenRemaining(2);
    setFeedback("idle");
    setStarted(false);
    setPerfectCompletesMap(false);
  };

  const finishPerfectReward = () => {
    if (perfectRewardCompletionRef.current) return;
    perfectRewardCompletionRef.current = true;
    setIsPerfectRewardFading(true);
    window.setTimeout(() => {
      setPerfectVideoFinished(true);
      setIsPerfectRewardFading(false);
      setView("perfectNext");
    }, 380);
  };

  const continueAfterPerfectReward = () => {
    const nextView = getPerfectRewardNextView(stage, perfectCompletesMap);
    if (nextView === "challenge") {
      setStage(current => current + 1);
      resetRun();
    } else if (nextView === "land") {
      resetRun();
    }
    setView(nextView);
  };

  useEffect(() => {
    onMusicActiveChange(view === "levels" || view === "map" || view === "land" || (view === "challenge" && !started));
  }, [onMusicActiveChange, started, view]);
  useEffect(() => () => onMusicActiveChange(false), [onMusicActiveChange]);
  useEffect(() => writeTenLevelQuestProgress(progress), [progress]);
  useEffect(() => onStarsChange?.(Object.values(progress).reduce((sum, stars) => sum + stars, 0)), [onStarsChange, progress]);
  useEffect(() => {
    if (!started || feedback !== "idle" || remaining === 0) return;
    const timer = window.setTimeout(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [feedback, remaining, started]);
  useEffect(() => {
    if (started && remaining === 0 && feedback === "idle") setFeedback("revealed");
  }, [feedback, remaining, started]);
  useEffect(() => {
    if (view !== "challenge" || !onPreload) return;
    stageTerms.forEach((word) => {
      onPreload(word.term, "cantonese");
      onPreload(word.term, "mandarin");
    });
  }, [onPreload, stageTerms, view]);
  useEffect(() => {
    if (feedback === "idle") return;
    const clickedChoice = document.activeElement;
    if (!(clickedChoice instanceof HTMLButtonElement) || !clickedChoice.closest(".challenge-options")) return;
    const timer = window.setTimeout(() => clickedChoice.blur(), 420);
    return () => window.clearTimeout(timer);
  }, [feedback]);
  useEffect(() => {
    if (feedback === "idle") return;
    const timer = window.setTimeout(() => {
      if (questionIndex + 1 < activeRunTerms.length) {
        setQuestionIndex(value => value + 1);
        setRemaining(QUESTION_SECONDS);
        setRelistenRemaining(2);
        setFeedback("idle");
        onPlay(activeRunTerms[questionIndex + 1].term, language);
        return;
      }
      const stars = correct === activeRunTerms.length ? 3 : correct >= Math.ceil(activeRunTerms.length * 0.6) ? 2 : 1;
      const isPerfect = isPerfectTenLevelStage(correct, activeRunTerms.length);
      const stageKey = tenLevelQuestStageKey(level, topic.id, stage);
      const willCompleteMap = completesTenLevelCard(progress, level, topic.id, stage);
      setProgress(previous => ({ ...previous, [stageKey]: Math.max(previous[stageKey] ?? 0, stars) }));
      if (isPerfect) {
        setPerfectCompletesMap(willCompleteMap);
        setPerfectClipIndex(value => (value + 1) % PERFECT_ENCOURAGEMENT_CLIPS.length);
        setPerfectVideoFinished(false);
        setIsPerfectRewardFading(false);
        setView("perfectReward");
      } else {
        setView("summary");
      }
    }, feedback === "correct" ? 350 : 450);
    return () => window.clearTimeout(timer);
  }, [activeRunTerms, correct, feedback, language, level, onPlay, questionIndex, progress, stage, topic]);
  useEffect(() => {
    if (view !== "assembly") return;
    playMapLandCompleteJingle();
    const timer = window.setTimeout(() => {
      setIsCelebrating(true);
      playCardCompleteFanfare();
      setView("reward");
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [view]);
  useEffect(() => {
    if (view !== "reward") return;
    const timer = window.setTimeout(() => {
      setIsCelebrating(false);
      resetRun();
      setView("map");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [view]);
  useLayoutEffect(() => {
    if (view !== "perfectReward") return;
    perfectRewardCompletionRef.current = false;
    setIsPerfectRewardFading(false);
    setPerfectVideoFinished(false);
    const video = perfectVideoRef.current;
    const playVideo = async () => {
      if (!video) return;
      video.loop = false;
      video.currentTime = 0;
      video.muted = false;
      video.volume = 0.84;
      try {
        await video.play();
      } catch {
        finishPerfectReward();
      }
    };
    void playVideo();
    const fallbackTimer = window.setTimeout(finishPerfectReward, 7500);
    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [view]);

  const start = () => {
    if (!stageTerms.length) return;
    const shuffledTerms = shuffle(stageTerms);
    const previousRunMatches = runTerms.length === shuffledTerms.length && shuffledTerms.every((word, index) => word.term === runTerms[index]?.term);
    const nextRunTerms = previousRunMatches ? [...shuffledTerms.slice(1), shuffledTerms[0]] : shuffledTerms;
    resetRun();
    setRunTerms(nextRunTerms);
    setRunNonce(value => value + 1);
    setStarted(true);
    onPlay(nextRunTerms[0].term, language);
  };

  const choose = (word: TenLevelTerm) => {
    if (!started || feedback !== "idle" || !target) return;
    if (word.term === target.term) {
      playCorrectChime();
      const completesPerfectStage = questionIndex + 1 === activeRunTerms.length && correct + 1 === activeRunTerms.length;
      setCorrect(value => value + 1);
      if (completesPerfectStage) {
        const stageKey = tenLevelQuestStageKey(level, topic.id, stage);
        const willCompleteMap = completesTenLevelCard(progress, level, topic.id, stage);
        setProgress(previous => ({ ...previous, [stageKey]: Math.max(previous[stageKey] ?? 0, 3) }));
        setPerfectCompletesMap(willCompleteMap);
        setPerfectClipIndex(value => (value + 1) % PERFECT_ENCOURAGEMENT_CLIPS.length);
        setPerfectVideoFinished(false);
        setIsPerfectRewardFading(false);
        setView("perfectReward");
        return;
      }
      setFeedback("correct");
    } else {
      setFeedback("revealed");
    }
  };

  if (view === "levels") return <section className="map-quest-shell">
    <header className="map-quest-header"><button onClick={onBack} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>地圖闖關</p><small>第 1 至第 10 級・42 張地圖</small></div><div className="h-11 w-11" /></header>
    <section className="map-quest-intro"><MapPinned /><div><strong>逐級完成，快樂集卡</strong><p>每張地圖有 5 關；每關有 5 個詞語。</p></div></section>
    <div className="map-level-list">{tenLevels.map(item => { const locked = isTenLevelLocked(item, familyUnlocked); return <button key={item} onClick={() => { if (locked) { onRequestUnlock(); return; } setLevel(item); setMapIndex(0); setView("map"); }} className={`map-level-card beginner ${locked ? "locked" : ""}`}><span className="map-level-icon">{locked ? <LockKeyhole className="h-5 w-5" /> : getTenLevelIcon(item)}</span><span><strong>{getTenLevelLabel(item)}{locked ? "・家庭解鎖" : ""}</strong><small>{locked ? "第 1 級免費；家長解鎖後開放" : getTenLevelDescription(item)}</small><em>{getTenLevelTopics(item).length} 張主題地圖</em></span></button>; })}</div>
  </section>;

  if (view === "map") return <section className="map-quest-shell">
    <header className="map-quest-header"><button onClick={() => setView("levels")} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>{getTenLevelLabel(level)}</p><small>完成地圖，收集字卡</small></div><div className="h-11 w-11" /></header>
    <section className="map-quest-stat"><span><Trophy className="h-4 w-4" />合成 {topics.filter(item => isTenLevelMapComplete(progress, level, item.id)).length}/{topics.length}</span><span>⭐ {Object.values(progress).reduce((sum, value) => sum + value, 0)}</span></section>
    <div className="map-land-route">{topics.map((item, index) => {
      const unlocked = isMapUnlocked(index);
      const complete = isTenLevelMapComplete(progress, level, item.id);
      const fragments = getTenLevelFragmentCount(progress, level, item.id);
      const art = getTenLevelCardArt(item);
      return <button key={item.id} disabled={!unlocked} onClick={() => { setMapIndex(index); setStage(1); setView("land"); }} className={`map-land-node ${index % 2 ? "right" : "left"} ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""}`}><span className="map-land-marker">{unlocked ? complete && art ? <TopicCardSlice art={art} className="map-card-thumb" alt={`${displayText(art.title)}縮圖`} /> : item.emoji : <LockKeyhole className="h-5 w-5" />}</span><span className="map-land-label"><b>{index + 1}. {displayText(item.label)}</b><small>{complete ? "完整字卡已合成" : unlocked ? `字卡碎片 ${fragments}/5` : "完成前一張地圖後解鎖"}</small></span>{complete && <Check className="map-land-check" />}</button>;
    })}</div>
  </section>;

  if (view === "land" && topic) return <section className="map-quest-shell">
    <header className="map-quest-header"><button onClick={() => setView("map")} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>{topic.emoji} {displayText(topic.label)}</p><small>{displayText(getTenLevelLabel(level))}・25 個詞語・5 關</small></div><div className="h-11 w-11" /></header>
    <section className="land-hero"><span>{isTenLevelMapComplete(progress, level, topic.id) && topicArt ? <TopicCardSlice art={topicArt} className="land-card-thumb" alt={`${displayText(topicArt.title)}縮圖`} /> : topic.emoji}</span><div><p>探索 {displayText(topic.label)}</p><strong>每關全對 5 題，收集一塊字卡拼圖</strong><FragmentStrip count={topicFragments} emoji={topic.emoji} art={topicArt} /></div></section>
    <div className="stage-list">{Array.from({ length: TEN_LEVEL_QUEST_STAGES_PER_MAP }, (_, index) => index + 1).map(number => {
      const stars = progress[tenLevelQuestStageKey(level, topic.id, number)] ?? 0;
      const unlocked = isStageUnlocked(number);
      return <button key={number} disabled={!unlocked} onClick={() => { setStage(number); resetRun(); setView("challenge"); }} className={`stage-card ${stars >= TEN_LEVEL_FRAGMENT_MIN_STARS ? "done" : ""} ${!unlocked ? "locked" : ""}`}><span className="stage-index">{unlocked ? number : <LockKeyhole className="h-4 w-4" />}</span><span><b>第 {number} 關</b><small>5 個詞語・5/5 全對收拼圖</small></span><span className="stage-stars">{stars >= TEN_LEVEL_FRAGMENT_MIN_STARS ? "★★★" : stars > 0 ? "再試一次" : unlocked ? "開始" : "鎖定"}</span></button>;
    })}</div>
  </section>;

  if (view === "perfectNext" && topic) {
    const nextView = getPerfectRewardNextView(stage, perfectCompletesMap);
    const actionLabel = nextView === "challenge" ? "去下一關" : nextView === "assembly" ? "合成字卡" : "返回地圖";
    return <section className="map-quest-shell"><header className="map-quest-header"><div className="h-11 w-11" /><div><p>全對獎勵</p><small>{topic.label}・第 {stage} 關</small></div><div className="h-11 w-11" /></header><section className="perfect-next-choice" aria-live="polite"><p>你真厲害！</p><small>{nextView === "challenge" ? "已收下這關拼圖，要挑戰下一關嗎？" : nextView === "assembly" ? "五塊拼圖已集齊，準備合成字卡！" : "已收下這關拼圖，返回地圖繼續收集吧！"}</small><button onClick={continueAfterPerfectReward} className="challenge-next">{actionLabel}</button></section></section>;
  }

  if (view === "perfectReward" && topic) {
    const nextView = getPerfectRewardNextView(stage, perfectCompletesMap);
    const actionLabel = nextView === "challenge" ? "去下一關" : nextView === "assembly" ? "合成字卡" : "返回地圖";
    const perfectClip = PERFECT_ENCOURAGEMENT_CLIPS[Math.max(0, perfectClipIndex)];
    return <section className="map-quest-shell"><header className="map-quest-header"><div className="h-11 w-11" /><div><p>全對獎勵</p><small>{topic.label}・第 {stage} 關</small></div><div className="h-11 w-11" /></header><section className={`perfect-video-reward ${isPerfectRewardFading ? "is-fading" : ""}`} aria-live="polite"><p>5 / 5 全對！</p><div className="perfect-celebration-media"><video key={perfectClip} ref={perfectVideoRef} className="perfect-celebration-video" playsInline loop={false} preload="auto" poster="/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png" onEnded={finishPerfectReward} onError={finishPerfectReward}><source src={perfectClip} type="video/mp4" /></video></div><small>你真厲害！</small></section></section>;
  }

  if (view === "assembly" && topic) return <section className="card-assembly-screen" aria-live="polite"><div className="assembly-sparkles" aria-hidden="true">✦　✧　★　✦　✧</div><p>五塊拼圖，正在合成！</p><div className={`puzzle-card-preview card-assembly-puzzle ${topicArt ? "has-card-art" : ""}`} role="img" aria-label={`${topic.label}五塊字卡拼圖正在合成`}>{ASSEMBLY_PIECES.map((piece, index) => <span key={piece} className={`puzzle-piece ${piece} earned ${topicArt ? "has-card-art" : ""}`} style={topicArt ? { ...assemblyArtStyle, "--piece-x": assemblyPieceOrigins[index].x, "--piece-y": assemblyPieceOrigins[index].y, "--piece-delay": `${index * 110}ms` } as CSSProperties : { "--piece-delay": `${index * 110}ms` } as CSSProperties} />)}</div><small>拼圖集合，完整字卡即將閃亮登場！</small></section>;
  if (view === "reward" && topic) return <section className={`card-reward-fullscreen ${isCelebrating ? "is-celebrating" : ""}`} aria-live="polite"><div className="reward-confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--piece": index } as CSSProperties}>✦</i>)}</div><p>完整字卡・閃亮登場</p>{topicArt ? <TopicCardSlice art={topicArt} className="reward-fullscreen-card" alt={`${topicArt.title}完整字卡`} /> : <span className="reward-fullscreen-emoji">{topic.emoji}</span>}<h1>{topic.label}字卡合成成功！</h1><small>2 秒後繼續下一個地圖</small></section>;
  if (view === "summary" && topic) return <section className="map-quest-shell"><header className="map-quest-header"><button onClick={() => setView("land")} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>本關完成</p><small>第 {stage} 關・{topic.label}</small></div><div className="h-11 w-11" /></header><section className="stage-summary stage-summary-celebration"><div className="stage-summary-sparkles" aria-hidden="true">✦　★　✦　★　✦</div><p className="summary-stars">{correct === activeRunTerms.length ? "★　★　★" : "★　★"}</p><img src="/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png" alt="小貓豎起拇指鼓勵" /><h1>{correct === activeRunTerms.length ? "你真厲害！" : "繼續努力！"}</h1><p>{correct === activeRunTerms.length ? "五題全對，成功收下這關真實字卡拼圖！" : `今關答對 ${correct}/${activeRunTerms.length} 題；再試一次，全對就可以收下拼圖！`}</p><FragmentStrip count={topicFragments} emoji={topic.emoji} art={topicArt} label={`已收集 ${topicFragments}/5 塊 ${topic.label}字卡拼圖`} /><button onClick={() => { resetRun(); setView(correct === activeRunTerms.length ? "land" : "challenge"); }} className="challenge-next">{correct === activeRunTerms.length ? `收下第 ${stage} 塊拼圖` : "返回關卡，再挑戰一次"}</button></section></section>;

  return <section className="map-quest-shell"><header className="map-quest-header"><button onClick={() => { resetRun(); setView("land"); }} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>{topic ? displayText(topic.label) : ""}・第 {stage} 關</p><small>{started ? `第 ${questionIndex + 1}/${activeRunTerms.length} 題` : "先選擇讀音"}</small></div><span className="inline-flex items-center gap-1 text-sm font-black text-[#C67938]"><Clock3 className="h-4 w-4" />{remaining}</span></header>{!started ? <section className="challenge-ready"><img src={PREPARE_LISTEN_CAT_ASSET} alt="舉起小手、準備聽字詞的小貓" className="challenge-ready-cat" /><h1>準備聽字詞</h1><p className="mt-2 text-sm font-bold text-[#718095]">先選擇語言</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setLanguage("cantonese")} className={language === "cantonese" ? "voice-button voice-canto" : "learn-nav"}>粵語</button><button onClick={() => setLanguage("mandarin")} className={language === "mandarin" ? "voice-button voice-mandarin" : "learn-nav"}>普通話</button></div><button onClick={start} className="next-button"><Play className="h-5 w-5" />播放讀音，開始作答</button></section> : <section className="mt-4"><div className="challenge-listen"><p>聽清楚讀音，再選擇正確詞語。</p><button disabled={relistenRemaining <= 0 || feedback !== "idle"} onClick={() => { if (!target || relistenRemaining <= 0 || feedback !== "idle") return; setRelistenRemaining(value => value - 1); onPlay(target.term, language); }}><Volume2 className="h-4 w-4" />再聽（{relistenRemaining}/2）</button></div><p className={`game-feedback ${feedback === "correct" ? "good" : feedback === "revealed" ? "try" : ""}`}>{feedback === "correct" ? "答對了！" : feedback === "revealed" ? `答案是「${target ? displayText(getLanguageWord(target.term, language)) : ""}」` : "請選擇正確詞語"}</p><div className="challenge-options">{choices.map(word => { const displayTerm = displayText(getLanguageWord(word.term, language)); const lengthClass = Array.from(displayTerm).length >= 6 ? "is-long" : Array.from(displayTerm).length >= 4 ? "is-medium" : ""; const answerClass = feedback !== "idle" && word.term === target?.term ? "show-answer" : ""; return <button key={word.term} disabled={feedback !== "idle"} onClick={() => choose(word)} className={`${answerClass} ${lengthClass}`.trim()}>{displayTerm}</button>; })}</div></section>}</section>;
}
