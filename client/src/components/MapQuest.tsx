/**
 * 繁體認字樂地圖闖關設計提醒：以繪本探險地圖、粉彩陸地、五片拼圖字卡與小貓獎勵呈現；
 * 互動保持正向、可重玩、可清晰返回，並以輕柔按鍵聲效照顧手機直向單手操作。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Clock3, Ear, LockKeyhole, MapPinned, Music2, Play, RotateCcw, Sparkles, Star, Trophy, Volume2, VolumeX } from "lucide-react";
import { FragmentStrip } from "@/components/FragmentStrip";
import { TopicCardSlice } from "@/components/TopicCardSlice";
import { isPremiumLevel } from "@/lib/familyUnlock";
import { getQuestFragmentCount, isQuestLandComplete, QUEST_FRAGMENT_MIN_STARS, QUEST_PROGRESS_STORAGE_KEY, QUEST_STAGES_PER_LAND, questStageKey, readQuestProgress, type QuestProgress } from "@/lib/mapQuestProgress";
import { playCardCompleteFanfare, playCorrectChime, playMapLandCompleteJingle, playStageClearChime } from "@/lib/rewardAudio";
import { getTopicCardArt } from "@/lib/topicCardArt";
import { phoneticSimilarityScore } from "@/lib/phoneticDistractors";

type Level = "preschool" | "junior" | "senior";
type AudioLanguage = "cantonese" | "mandarin";
export type QuestTerm = { term: string; jyutping: string; pinyin: string; level: Level; category: string; topic: string };
export type QuestTopic = { id: string; label: string; emoji: string; description: string };
type QuestView = "levels" | "map" | "land" | "challenge" | "summary" | "perfectReward" | "assembly" | "reward";
const QUESTION_SECONDS = 15;
const WORDS_PER_STAGE = 6;
export const automaticQuestionAudioKey = (level: Level, topicId: string, stage: number, questionIndex: number, language: AudioLanguage, term: string) => `${level}:${topicId}:${stage}:${questionIndex}:${language}:${term}`;
const levelTone: Record<Level, string> = { preschool: "beginner", junior: "intermediate", senior: "advanced" };
const levelTitle: Record<Level, string> = { preschool: "初級地圖", junior: "中級地圖", senior: "高級地圖" };
const levelDescription: Record<Level, string> = {
  preschool: "9 個生活主題陸地，從熟悉事物開始探險。",
  junior: "10 個生活與校園陸地，慢慢建立閱讀自信。",
  senior: "10 個進階表達陸地，挑戰自然、情緒與社會字詞。",
};

const getStars = (correctCount: number) => correctCount === 6 ? 3 : correctCount >= 4 ? 2 : 1;
const starsText = (stars: number) => "★".repeat(stars) + "☆".repeat(Math.max(0, 3 - stars));
const characterCount = (term: string) => Array.from(term).length;
const hashSeed = (value: string) => Array.from(value).reduce((hash, character) => (((hash << 5) - hash) + character.charCodeAt(0)) | 0, 2166136261) >>> 0;
const seededShuffle = <T,>(items: T[], seedText: string) => {
  const result = [...items];
  let state = hashSeed(seedText) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const nextIndex = state % (index + 1);
    [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  }
  return result;
};
const manualSameLengthDecoys: Record<string, string[]> = {
  圖書管理員: ["圖書館職員", "圖書館館員", "圖書部職員"],
};
const ASSEMBLY_PIECES = ["top-left", "top-right", "middle-left", "middle-right", "bottom"] as const;
const assemblyPieceOrigins = [{ x: "0.28rem", y: "0rem" }, { x: "7.42rem", y: "0.36rem" }, { x: "0rem", y: "6.6rem" }, { x: "6.58rem", y: "6.4rem" }, { x: "2.8rem", y: "13rem" }];

function QuestShell({ title, step, onBack, musicEnabled, onToggleMusic, showMusicToggle, children }: { title: string; step: string; onBack: () => void; musicEnabled: boolean; onToggleMusic: () => void; showMusicToggle: boolean; children: React.ReactNode }) {
  return <div className="map-quest-shell"><header className="map-quest-header"><button onClick={onBack} className="map-quest-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>{title}</p><small>{step}</small></div>{showMusicToggle ? <button onClick={onToggleMusic} className={`map-sound-toggle ${musicEnabled ? "on" : ""}`} aria-label={musicEnabled ? "背景音樂：開啟，按此關閉" : "背景音樂：關閉，按此開啟"}>{musicEnabled ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</button> : <div className="h-11 w-11" aria-hidden="true" />}</header>{children}</div>;
}

export function MapQuest({ terms, getTopics, familyUnlocked, onRequestUnlock, onBack, onPlay, onEncourage, onMapMusicChange, musicEnabled, onToggleMusic }: { terms: QuestTerm[]; getTopics: (level: Level) => QuestTopic[]; familyUnlocked: boolean; onRequestUnlock: () => void; onBack: () => void; onPlay: (term: string, language: AudioLanguage) => void; onEncourage: (correctCount: number, language: AudioLanguage, delay?: number) => void; onMapMusicChange: (active: boolean) => void; musicEnabled: boolean; onToggleMusic: () => void }) {
  const [view, setView] = useState<QuestView>("levels");
  const [level, setLevel] = useState<Level>("preschool");
  const [topicIndex, setTopicIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState<QuestProgress>(() => readQuestProgress());
  const [language, setLanguage] = useState<AudioLanguage>("cantonese");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const [started, setStarted] = useState(false);
  const [relistenRemaining, setRelistenRemaining] = useState(2);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "revealed">("idle");
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [perfectCompletesLand, setPerfectCompletesLand] = useState(false);
  const [optionShuffleNonce, setOptionShuffleNonce] = useState(0);
  const [isPerfectRewardFading, setIsPerfectRewardFading] = useState(false);
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);
  const [resetNotice, setResetNotice] = useState("");
  const perfectVideoRef = useRef<HTMLVideoElement>(null);
  const correctCountRef = useRef(0);
  const perfectRewardFinishingRef = useRef(false);
  const automaticReadKeyRef = useRef<string | null>(null);

  const topics = getTopics(level);
  const topic = topics[topicIndex] ?? topics[0];
  const levelTerms = useMemo(() => terms.filter((item) => item.level === level), [level, terms]);
  const landTerms = useMemo(() => topic ? terms.filter((item) => item.level === level && item.topic === topic.id) : [], [level, terms, topic]);
  const stageTerms = useMemo(() => landTerms.slice(stage * WORDS_PER_STAGE, stage * WORDS_PER_STAGE + WORDS_PER_STAGE), [landTerms, stage]);
  const target = stageTerms[questionIndex];
  const isLandUnlocked = (index: number) => index === 0 || isQuestLandComplete(progress, level, getTopics(level)[index - 1].id);
  const isStageUnlocked = (number: number) => number === 0 || (progress[questStageKey(level, topic?.id ?? "", number - 1)] ?? 0) > 0;
  const stageStars = (number: number) => progress[questStageKey(level, topic?.id ?? "", number)] ?? 0;
  const stageEarnedFragment = (number: number) => stageStars(number) >= QUEST_FRAGMENT_MIN_STARS;
  const isLandComplete = (index: number) => isQuestLandComplete(progress, level, topics[index].id);
  const completedLandCount = topics.filter((_, index) => isLandComplete(index)).length;
  const topicFragments = topic ? getQuestFragmentCount(progress, level, topic.id) : 0;
  const topicArt = topic ? getTopicCardArt(level, topic.id) : null;
  const assemblyArtStyle = topicArt ? { backgroundImage: `url(${topicArt.src})`, "--card-width": "14rem", "--card-height": "20rem", "--image-width": `${topicArt.isStandalone ? 14 : 42}rem`, "--slice-offset": topicArt.isStandalone ? "0rem" : `-${topicArt.sliceIndex * 14}rem` } as React.CSSProperties : undefined;
  const stageOptions = useMemo(() => {
    const stageAnswers = new Set(stageTerms.map((word) => word.term));
    const usedDistractors = new Set<string>();
    return stageTerms.map((stageTarget, stageQuestionIndex) => {
      const neededLength = characterCount(stageTarget.term);
      const uniqueSameLength = (source: QuestTerm[], allowStageAnswers = false) => Array.from(new Map(source.filter((word) => word.term !== stageTarget.term && characterCount(word.term) === neededLength && (allowStageAnswers || !stageAnswers.has(word.term))).map((word) => [word.term, word])).values());
      const sameTopic = uniqueSameLength(landTerms);
      const sameLevel = uniqueSameLength(levelTerms);
      const fallback = uniqueSameLength(terms, true);
      const manual = (manualSameLengthDecoys[stageTarget.term] ?? []).filter((term) => characterCount(term) === neededLength).map((term) => ({ ...stageTarget, term }));
      const selected: QuestTerm[] = [];
      const takeFrom = (source: QuestTerm[], sourceName: string) => {
        seededShuffle(source, `${level}:${topic?.id ?? ""}:${stage}:${stageQuestionIndex}:${sourceName}`).forEach((candidate) => {
          if (selected.length < 3 && !usedDistractors.has(candidate.term) && !selected.some((word) => word.term === candidate.term)) selected.push(candidate);
        });
      };

      const allCandidates = Array.from(new Map([...sameTopic, ...sameLevel, ...fallback].map((word) => [word.term, word])).values());
      const phoneticCandidates = seededShuffle(allCandidates, `${level}:${topic?.id ?? ""}:${stage}:${stageQuestionIndex}:phonetic`)
        .map((candidate) => ({
          candidate,
          score: phoneticSimilarityScore(stageTarget, candidate),
          sourcePriority: candidate.topic === stageTarget.topic ? 2 : candidate.level === stageTarget.level ? 1 : 0,
        }))
        .filter(({ score }) => score >= 6)
        .sort((left, right) => right.score - left.score || right.sourcePriority - left.sourcePriority)
        .map(({ candidate }) => candidate);

      // 先加入不計聲調的同音詞及近似聲母／韻母詞；不足時才回退至既有同主題、同級與全詞庫候選。
      takeFrom(phoneticCandidates, "phonetic");
      takeFrom(sameTopic, "topic");
      takeFrom(sameLevel, "level");
      takeFrom(fallback, "fallback");
      takeFrom(manual, "manual");
      if (selected.length < 3) {
        seededShuffle([...sameTopic, ...sameLevel, ...fallback, ...manual], `${level}:${topic?.id ?? ""}:${stage}:${stageQuestionIndex}:repeat`).forEach((candidate) => {
          if (selected.length < 3 && !selected.some((word) => word.term === candidate.term)) selected.push(candidate);
        });
      }
      selected.forEach((word) => usedDistractors.add(word.term));
      const shuffledChoices = seededShuffle([stageTarget, ...selected], `${level}:${topic?.id ?? ""}:${stage}:${stageQuestionIndex}:${stageTarget.term}:choices:${optionShuffleNonce}`);
      const correctChoice = shuffledChoices.find((word) => word.term === stageTarget.term) ?? stageTarget;
      const distractors = shuffledChoices.filter((word) => word.term !== stageTarget.term);
      const targetPosition = (stageQuestionIndex + optionShuffleNonce) % 4;
      return [...distractors.slice(0, targetPosition), correctChoice, ...distractors.slice(targetPosition)];
    });
  }, [landTerms, level, levelTerms, optionShuffleNonce, stage, stageTerms, topic?.id]);
  const options = stageOptions[questionIndex] ?? (target ? [target] : []);
  const currentStars = getStars(correctCount);

  useEffect(() => { localStorage.setItem(QUEST_PROGRESS_STORAGE_KEY, JSON.stringify(progress)); }, [progress]);
  useEffect(() => {
    onMapMusicChange(view === "levels" || view === "map" || view === "land" || (view === "challenge" && !started));
  }, [onMapMusicChange, started, view]);
  useEffect(() => () => onMapMusicChange(false), [onMapMusicChange]);
  useEffect(() => {
    if (!started || isPaused || answerState !== "idle" || remaining <= 0) return;
    const timer = window.setTimeout(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [answerState, isPaused, remaining, started]);
  useEffect(() => {
    if (started && remaining === 0 && answerState === "idle") setAnswerState("revealed");
  }, [answerState, remaining, started]);
  useEffect(() => {
    if (view !== "challenge" || !started || answerState !== "idle" || questionIndex === 0 || !target) return;
    const audioKey = automaticQuestionAudioKey(level, topic?.id ?? "", stage, questionIndex, language, target.term);
    if (automaticReadKeyRef.current === audioKey) return;
    automaticReadKeyRef.current = audioKey;
    onPlay(target.term, language);
  }, [answerState, language, level, onPlay, questionIndex, stage, started, target, topic?.id, view]);
  useEffect(() => {
    if (view !== "challenge" || answerState === "idle") return;
    const isLastQuestion = questionIndex + 1 >= stageTerms.length;
    const timer = window.setTimeout(() => {
      if (isLastQuestion) nextQuestion();
      else setShowNextPrompt(true);
    }, answerState === "correct" ? 850 : 1150);
    return () => window.clearTimeout(timer);
  }, [answerState, questionIndex, stageTerms.length, view]);
  useEffect(() => {
    if (view !== "challenge" || !showNextPrompt) return;
    const timer = window.setTimeout(() => {
      setShowNextPrompt(false);
      nextQuestion();
    }, 800);
    return () => window.clearTimeout(timer);
  }, [questionIndex, showNextPrompt, view]);
  useEffect(() => {
    if (view !== "reward") return;
    const timer = window.setTimeout(() => { setIsCelebrating(false); resetStageRun(); setView("map"); }, 2000);
    return () => window.clearTimeout(timer);
  }, [view]);
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
  const finishPerfectReward = () => {
    if (view !== "perfectReward" || perfectRewardFinishingRef.current) return;
    perfectRewardFinishingRef.current = true;
    setIsPerfectRewardFading(true);
    window.setTimeout(() => {
      if (perfectCompletesLand) {
        setView("assembly");
      } else setView("summary");
    }, 420);
  };
  useEffect(() => {
    if (view !== "perfectReward") return;
    setIsPerfectRewardFading(false);
    perfectRewardFinishingRef.current = false;
    const video = perfectVideoRef.current;
    const startVideo = async () => {
      if (!video) return;
      try {
        video.muted = false;
        await video.play();
      } catch {
        video.muted = true;
        await video.play().catch(() => { /* 視覺獎勵仍會在下次瀏覽器允許播放時顯示。 */ });
        playStageClearChime();
      }
    };
    void startVideo();
    const fallback = window.setTimeout(finishPerfectReward, 6200);
    return () => window.clearTimeout(fallback);
  }, [perfectCompletesLand, view]);
  useEffect(() => () => { setStarted(false); }, []);

  const resetStageRun = () => {
    correctCountRef.current = 0;
    automaticReadKeyRef.current = null;
    setOptionShuffleNonce((value) => value + 1);
    setQuestionIndex(0); setRemaining(QUESTION_SECONDS); setStarted(false); setRelistenRemaining(2); setCorrectCount(0); setAnswerState("idle"); setShowNextPrompt(false); setIsPaused(false); setIsCelebrating(false); setPerfectCompletesLand(false);
  };
  const openLevel = (nextLevel: Level) => { if (isPremiumLevel(nextLevel) && !familyUnlocked) { onRequestUnlock(); return; } setLevel(nextLevel); setTopicIndex(0); setStage(0); resetStageRun(); setView("map"); };
  const openLand = (index: number) => { if (!isLandUnlocked(index)) return; setTopicIndex(index); setStage(0); setResetNotice(""); resetStageRun(); setView("land"); };
  const openStage = (nextStage: number) => { if (!isStageUnlocked(nextStage)) return; setStage(nextStage); resetStageRun(); setView("challenge"); };
  const beginQuestion = () => { if (!target) return; automaticReadKeyRef.current = null; setStarted(true); setRemaining(QUESTION_SECONDS); setRelistenRemaining(2); setAnswerState("idle"); setShowNextPrompt(false); setIsPaused(false); onPlay(target.term, language); };
  const replay = () => { if (isPaused || !target || relistenRemaining <= 0) return; setRelistenRemaining((value) => value - 1); onPlay(target.term, language); };
  const choose = (word: QuestTerm) => {
    if (isPaused || !started || answerState !== "idle" || !target) return;
    if (word.term === target.term) {
      const nextScore = correctCountRef.current + 1;
      correctCountRef.current = nextScore;
      playCorrectChime();
      setCorrectCount(nextScore);
      setAnswerState("correct");
    } else setAnswerState("revealed");
  };
  function nextQuestion() {
    if (questionIndex + 1 >= stageTerms.length) {
      const finalCorrectCount = correctCountRef.current;
      const earned = getStars(finalCorrectCount);
      const isPerfect = finalCorrectCount === stageTerms.length;
      const stageKey = questStageKey(level, topic.id, stage);
      const willCompleteLand = stage === QUEST_STAGES_PER_LAND - 1 && earned >= QUEST_FRAGMENT_MIN_STARS && Array.from({ length: QUEST_STAGES_PER_LAND - 1 }, (_, index) => (progress[questStageKey(level, topic.id, index)] ?? 0) >= QUEST_FRAGMENT_MIN_STARS).every(Boolean);
      setProgress((previous) => ({ ...previous, [stageKey]: Math.max(previous[stageKey] ?? 0, earned) }));
      if (isPerfect) {
        setPerfectCompletesLand(willCompleteLand);
        setView("perfectReward");
        return;
      }
      if (willCompleteLand) {
        setIsCelebrating(true);
        playMapLandCompleteJingle();
        window.setTimeout(() => playCardCompleteFanfare(), 620);
        onEncourage(finalCorrectCount, language, 1700);
        setView("reward");
      } else {
        onEncourage(finalCorrectCount, language);
        setView("summary");
      }
      return;
    }
    setQuestionIndex((value) => value + 1); setRemaining(QUESTION_SECONDS); setStarted(true); setRelistenRemaining(2); setAnswerState("idle"); setShowNextPrompt(false); setIsPaused(false);
  }
  const leaveChallenge = () => { resetStageRun(); setView("land"); };
  const resetLandProgress = () => {
    if (!topic) return;
    setProgress((previous) => {
      const next = { ...previous };
      Array.from({ length: QUEST_STAGES_PER_LAND }, (_, stageIndex) => questStageKey(level, topic.id, stageIndex)).forEach((key) => delete next[key]);
      return next;
    });
    setStage(0);
    setResetConfirmVisible(false);
    setResetNotice(`已清除「${topic.label}」全部五關紀錄，現可由第一關重新開始。`);
    resetStageRun();
  };

  const shellProps = { musicEnabled, onToggleMusic, showMusicToggle: view === "levels" || view === "map" || view === "land" || (view === "challenge" && !started) };

  if (view === "levels") return <QuestShell title="地圖闖關" step="先揀一張探險地圖" onBack={onBack} {...shellProps}><section className="map-quest-intro"><MapPinned /><div><strong>三張地圖，慢慢通關</strong><p>每個主題有 5 關；每關有 6 個字詞。</p></div></section><div className="map-level-list">{(Object.keys(levelTitle) as Level[]).map((item) => { const locked = isPremiumLevel(item) && !familyUnlocked; return <button key={item} onClick={() => openLevel(item)} className={`map-level-card ${levelTone[item]} ${locked ? "locked" : ""}`}><span className="map-level-icon">{locked ? <LockKeyhole className="h-6 w-6" /> : item === "preschool" ? "🧸" : item === "junior" ? "📖" : "🏆"}</span><span><strong>{levelTitle[item]}</strong><small>{locked ? "家庭解鎖後開放完整地圖" : levelDescription[item]}</small><em>{locked ? "查看家庭方案" : `${getTopics(item).length} 個主題陸地`}</em></span><ChevronRight className="ml-auto h-5 w-5" /></button>; })}</div></QuestShell>;

  if (view === "map") return <QuestShell title={levelTitle[level]} step={`已合成 ${completedLandCount}/${topics.length} 張字卡`} onBack={() => setView("levels")} {...shellProps}><section className="map-quest-stat"><span><Trophy className="h-4 w-4" />合成 {completedLandCount}/{topics.length}</span><span>⭐ {Object.values(progress).reduce((sum, value) => sum + value, 0)}</span></section><section className={`map-campaign ${levelTone[level]}`}><div className="map-campaign-caption"><span>由下而上，逐個主題探險</span><Ear className="h-4 w-4" /></div><div className="map-land-route">{topics.map((item, index) => { const unlocked = isLandUnlocked(index); const complete = isLandComplete(index); const fragments = getQuestFragmentCount(progress, level, item.id); const art = getTopicCardArt(level, item.id); return <button key={item.id} onClick={() => openLand(index)} disabled={!unlocked} className={`map-land-node ${index % 2 === 0 ? "left" : "right"} ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""}`}><span className="map-land-marker">{unlocked ? complete && art ? <TopicCardSlice art={art} className="map-card-thumb" alt={`${art.title}縮圖`} /> : item.emoji : <LockKeyhole className="h-5 w-5" />}</span><span className="map-land-label"><b>{index + 1}. {item.label}</b><small>{complete ? "完整字卡已合成" : unlocked ? `字卡碎片 ${fragments}/5` : "完成前一個陸地後解鎖"}</small></span>{complete && <Check className="map-land-check" />}</button>; })}</div></section><p className="map-quest-tip">每關要 6/6 全對才收下一塊字卡拼圖；集齊五塊便會自動合成完整字卡。</p></QuestShell>;

  if (view === "land" && topic) return <QuestShell title={`${topic.emoji} ${topic.label}陸地`} step={`${levelTitle[level]}・30 個詞語・5 關`} onBack={() => setView("map")} {...shellProps}><section className="land-hero"><span>{isLandComplete(topicIndex) && topicArt ? <TopicCardSlice art={topicArt} className="land-card-thumb" alt={`${topicArt.title}縮圖`} /> : topic.emoji}</span><div><p>探索 {topic.label}</p><strong>每關答對全部 6 題，收集一塊字卡拼圖</strong><FragmentStrip count={topicFragments} emoji={topic.emoji} art={topicArt} /></div></section><div className="stage-list">{Array.from({ length: QUEST_STAGES_PER_LAND }, (_, index) => { const unlocked = isStageUnlocked(index); const stars = stageStars(index); const earnedFragment = stageEarnedFragment(index); return <button key={index} onClick={() => openStage(index)} disabled={!unlocked} className={`stage-card ${earnedFragment ? "done" : ""} ${!unlocked ? "locked" : ""}`}><span className="stage-index">{unlocked ? index + 1 : <LockKeyhole className="h-4 w-4" />}</span><span><b>第 {index + 1} 關</b><small>6 個字詞・全對 6 題才可收集拼圖</small></span><span className="stage-stars">{earnedFragment ? starsText(stars) : stars > 0 ? "再試一次" : unlocked ? "開始" : "鎖定"}</span>{stars > 0 && <RotateCcw className="h-4 w-4" />}</button>; })}</div><button onClick={() => setResetConfirmVisible(true)} className="land-reset-all">↺ 重設所有關卡</button>{resetNotice && <p className="mt-3 rounded-2xl bg-[#EEF8F1] px-4 py-3 text-center text-sm font-black leading-6 text-[#4E7960]">{resetNotice}</p>}<p className="map-quest-tip">重設會清除這個陸地全部五關的紀錄、拼圖與完整字卡；其他陸地不受影響。</p>{resetConfirmVisible && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172842]/55 px-6"><section className="w-full max-w-sm rounded-[2rem] bg-[#FFFDF7] p-6 text-center shadow-2xl"><p className="text-3xl">↺</p><h1 className="mt-2 font-serif text-2xl font-black text-[#40526D]">重設所有關卡？</h1><p className="mt-3 text-sm font-bold leading-6 text-[#66768A]">會清除「{topic.label}」陸地全部五關的紀錄、拼圖碎片與完整字卡，並由第一關重新開始。</p><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => setResetConfirmVisible(false)} className="rounded-2xl border-2 border-[#DADFE6] bg-white px-3 py-3 text-sm font-black text-[#65758A]">取消</button><button onClick={resetLandProgress} className="rounded-2xl bg-[#E9767B] px-3 py-3 text-sm font-black text-white shadow-[0_4px_0_#C95E65] active:translate-y-1 active:shadow-none">確認重設</button></div></section></div>}</QuestShell>;

  if (view === "challenge" && topic && target && started && showNextPrompt) return <QuestShell title={`第 ${stage + 1} 關・${topic.label}`} step={`第 ${questionIndex + 2}/${stageTerms.length} 題・準備中`} onBack={leaveChallenge} {...shellProps}><section className="challenge-ready challenge-next-prompt" aria-live="polite"><span className="text-5xl">➡️</span><h1>下一題</h1><p>準備好，下一題的{language === "cantonese" ? "粵語" : "普通話"}讀音即將播放。</p><span className="mt-3 inline-block rounded-full bg-[#FFF0A7] px-4 py-2 text-sm font-black text-[#7C6224]">即將繼續</span></section></QuestShell>;

  if (view === "challenge" && topic && target) return <QuestShell title={`第 ${stage + 1} 關・${topic.label}`} step={`第 ${questionIndex + 1}/${stageTerms.length} 題・答對 ${correctCount} 題`} onBack={leaveChallenge} {...shellProps}>{!started ? <section className="challenge-ready"><span className="text-5xl">{language === "cantonese" ? "🗣️" : "🎧"}</span><h1>準備聽字詞</h1><p>先選擇本關使用的讀音；按開始後，每題有 15 秒找出正確的繁體字，會自動連續出題。</p><div className="language-switch"><button onClick={() => setLanguage("cantonese")} className={language === "cantonese" ? "selected canto" : ""}>粵語</button><button onClick={() => setLanguage("mandarin")} className={language === "mandarin" ? "selected mandarin" : ""}>普通話</button></div><button onClick={beginQuestion} className="challenge-start"><Play className="h-5 w-5 fill-current" />播放讀音，開始作答</button></section> : <><section className="challenge-status"><span className={remaining <= 4 ? "urgent" : ""}><Clock3 className="h-5 w-5" />{remaining} 秒</span><span>本關星星 {starsText(currentStars)}</span><button onClick={() => setIsPaused((value) => !value)} disabled={answerState !== "idle"} className="rounded-full border-2 border-[#C8D7E5] bg-white px-3 py-1.5 text-xs font-black text-[#49657C] disabled:opacity-50">{isPaused ? <Play className="mr-1 inline h-3.5 w-3.5 fill-current" /> : "⏸"}{isPaused ? "繼續" : "暫停"}</button></section><section className="challenge-listen"><p aria-live="polite">{answerState === "idle" ? `聽${language === "cantonese" ? "粵語" : "普通話"}讀音，找出正確字詞。` : answerState === "correct" ? "答得好！即將進入下一題。" : remaining === 0 ? "時間到，下一題繼續努力。" : "記住這個字，下一題繼續努力。"}</p><button onClick={replay} disabled={isPaused || relistenRemaining === 0 || answerState !== "idle"}><Volume2 className="h-5 w-5" />再聽一次（{relistenRemaining}）</button></section><div className="relative"><div className="challenge-options">{options.map((word) => <button key={word.term} onClick={() => choose(word)} disabled={isPaused || answerState !== "idle"} className={`${word.term === target.term && answerState !== "idle" ? "show-answer" : ""} ${word.term === target.term && answerState === "correct" ? "celebrate" : ""}`}>{word.term}</button>)}</div>{isPaused && <section className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-[#FFFDF7]/95 px-6 text-center shadow-inner" aria-live="polite"><span className="text-5xl">⏸</span><h2 className="mt-3 font-serif text-2xl font-black text-[#40526D]">已暫停</h2><p className="mt-2 text-sm font-bold leading-6 text-[#66768A]">計時和作答已暫停，準備好再繼續。</p><button onClick={() => setIsPaused(false)} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#F4B73B] px-5 py-3 text-sm font-black text-white shadow-[0_4px_0_#D89B25] active:translate-y-1 active:shadow-none"><Play className="h-4 w-4 fill-current" />繼續作答</button></section>}</div></>}</QuestShell>;

  if (view === "perfectReward") return <section className={`perfect-video-reward ${isPerfectRewardFading ? "is-fading" : ""}`} aria-live="polite"><p>6 / 6 全對！</p><video ref={perfectVideoRef} className="perfect-celebration-video" playsInline preload="auto" onEnded={finishPerfectReward} onError={finishPerfectReward}><source src="/manus-storage/perfect-score-cat-celebration_4e2b2189.mp4" type="video/mp4" /></video><small>你真厲害！正在為你收下獎勵⋯</small></section>;

  if (view === "assembly" && topic) return <section className="card-assembly-screen" aria-live="polite"><div className="assembly-sparkles" aria-hidden="true">✦　✧　★　✦　✧</div><p>五塊拼圖，正在合成！</p><div className={`puzzle-card-preview card-assembly-puzzle ${topicArt ? "has-card-art" : ""}`} role="img" aria-label={`${topic.label}五塊字卡拼圖正在合成`}>{ASSEMBLY_PIECES.map((piece, index) => <span key={piece} className={`puzzle-piece ${piece} earned ${topicArt ? "has-card-art" : ""}`} style={topicArt ? { ...assemblyArtStyle, "--piece-x": assemblyPieceOrigins[index].x, "--piece-y": assemblyPieceOrigins[index].y, "--piece-delay": `${index * 110}ms` } as React.CSSProperties : { "--piece-delay": `${index * 110}ms` } as React.CSSProperties} />)}</div><small>拼圖集合，完整字卡即將閃亮登場！</small></section>;

  if (view === "summary" && topic) return <QuestShell title="關卡完成！" step={`${topic.label}・第 ${stage + 1} 關`} onBack={() => setView("land")} {...shellProps}><section className="stage-summary"><p className="summary-stars">{starsText(currentStars)}</p><img src="/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png" alt="小貓豎起拇指鼓勵" />{correctCount === stageTerms.length ? <><h1>你真厲害！</h1><p>今關答對 <strong>6</strong> / 6 題，已收下這關真實字卡拼圖。</p><FragmentStrip count={topicFragments} emoji={topic.emoji} art={topicArt} label={`已收集 ${topicFragments}/5 塊 ${topic.label}字卡拼圖`} /><button onClick={() => { resetStageRun(); setView("land"); }} className="challenge-next">收下第 {stage + 1} 塊拼圖 <MapPinned className="h-5 w-5" /></button></> : <><h1>繼續努力！</h1><p>今關答對 <strong>{correctCount}</strong> / 6 題；全對 6 題就可以收下這關真實字卡拼圖。</p><FragmentStrip count={topicFragments} emoji={topic.emoji} art={topicArt} label={`已收集 ${topicFragments}/5 塊 ${topic.label}字卡拼圖`} /><button onClick={() => { resetStageRun(); setView("challenge"); }} className="challenge-next">再挑戰一次，目標全對 <RotateCcw className="h-5 w-5" /></button></>}</section></QuestShell>;

  return <section className={`card-reward-fullscreen ${isCelebrating ? "is-celebrating" : ""}`} aria-live="polite"><div className="reward-confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--piece": index } as React.CSSProperties}>✦</i>)}</div><p>完整字卡・閃亮登場</p>{topicArt ? <TopicCardSlice art={topicArt} className="reward-fullscreen-card" alt={`${topicArt.title}完整字卡`} /> : <span className="reward-fullscreen-emoji">{topic?.emoji}</span>}<h1>{topic?.label}字卡合成成功！</h1><small>2 秒後繼續下一個陸地</small></section>;
}
