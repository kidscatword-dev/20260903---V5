/**
 * 中文認字樂設計提醒：練習模式維持簡潔認字流程；開始遊戲採繪本探險地圖、粉彩陸地、拼圖字卡與小貓獎勵，並為每次有效按鍵提供輕柔聲效。
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, House, LockKeyhole, Mail, Music2, Play, Search, Star, Volume2, VolumeX } from "lucide-react";
import { CardAlbum } from "@/components/CardAlbum";
import { FamilyUnlockScreen, type UnlockSource } from "@/components/FamilyUnlockScreen";
import { PictureMatchLeaderboard } from "@/components/PictureMatchLeaderboard";
import { readOrCreatePictureMatchGuestId } from "@/lib/pictureMatchGuest";
import { MapQuest } from "@/components/MapQuest";
import { TenLevelMapQuest } from "@/components/TenLevelMapQuest";
import { TenLevelPractice } from "@/components/TenLevelPractice";
import { TenLevelCardAlbum } from "@/components/TenLevelCardAlbum";
import { TenLevelReview } from "@/components/TenLevelReview";
import { TenLevelSearch } from "@/components/TenLevelSearch";
import { BuildGame, FillBlankGame, FindWordGame, GameHub, gameGuideSource, type GameId, type GameWord, type MatchMode, ListenChooseGame, MATCH_IMAGE_BY_TERM, MatchGame, MatchModeSelect, ReviewQuestGame } from "@/components/WordGames";
import { tenLevelTerms } from "@/data/tenLevelCatalog";
import { readTenLevelQuestProgress } from "@/lib/tenLevelQuestProgress";
import { trpc } from "@/lib/trpc";
import termsJson from "@/data/terms.json";
import topicAudio from "@/data/topicAudio";
import topicAudioV2 from "@/data/topicAudioV2";
import { getBackgroundTrackFor } from "@/lib/backgroundMusicRouting";
import { isPremiumLevel, readLocalFamilyUnlock, writeLocalFamilyUnlock } from "@/lib/familyUnlock";
import { readOrCreateBillingInstallId } from "@/lib/billingInstallIdentity";
import { readLocalPlayerName } from "@/lib/localPlayerProfile";
import { isGooglePlayBillingAvailable, prepareGooglePlayBilling, purchaseFamilyFullUnlock, restoreGooglePlayPurchases } from "@/lib/googlePlayBilling";
import { duckBackgroundMusic, pauseBackgroundMusic, playCorrectChime, readBackgroundMusicEnabled, restoreBackgroundMusic, startBackgroundMusic, writeBackgroundMusicEnabled, type BackgroundMusicTrack } from "@/lib/rewardAudio";
import { readTenLevelReview } from "@/lib/tenLevelReview";
import { ChineseScriptProvider, useChineseScript } from "@/contexts/ChineseScriptContext";
import { readChineseScript, writeChineseScript } from "@/lib/chineseScript";

type Level = "preschool" | "junior" | "senior";
type Category = "food" | "emotion" | "animal" | "color" | "body" | "nature" | "school" | "family" | "action" | "object" | "other";
type AudioLanguage = "cantonese" | "mandarin";
type Screen = "home" | "level" | "category" | "learn" | "complete" | "gameHub" | "gameMode" | "matchMode" | "wordGame" | "matchLeaderboard" | "album" | "legacyAlbum" | "search" | "review" | "more" | "unlock";
type Journey = "practice" | "game";
type Term = { term: string; jyutping: string; pinyin: string; level: Level; category: Category; topic: string };
type Topic = { id: string; label: string; emoji: string; description: string; sources: Category[]; badge?: string };

const terms = termsJson as Term[];
const levelMeta: Record<Level, { label: string; age: string; description: string; emoji: string; tone: string }> = {
  preschool: { label: "初級", age: "生活高頻詞", description: "由最熟悉的生活名詞和基本感受開始，輕鬆建立認字興趣。", emoji: "🧸", tone: "peach" },
  junior: { label: "中級", age: "生活與校園詞", description: "認識描述性、校園及日常字詞，逐步擴闊閱讀範圍。", emoji: "📖", tone: "mint" },
  senior: { label: "高級", age: "進階表達詞", description: "挑戰精確、抽象與社會生活字詞，提升閱讀及表達能力。", emoji: "🏆", tone: "sky" },
};
const commonTopics: Topic[] = [
  { id: "food", label: "食物", emoji: "🍚", description: "水果、主食和小食", sources: ["food"] },
  { id: "animal", label: "動物", emoji: "🐼", description: "可愛動物朋友", sources: ["animal"] },
  { id: "body", label: "身體", emoji: "👦", description: "認識身體部位", sources: ["body"] },
  { id: "family", label: "家庭", emoji: "🏠", description: "家人和家庭生活", sources: ["family"] },
  { id: "emotion", label: "心情", emoji: "😊", description: "說出內心感受", sources: ["emotion"] },
  { id: "color", label: "顏色", emoji: "🎨", description: "發現生活色彩", sources: ["color"] },
  { id: "object", label: "日常用品", emoji: "🥤", description: "每天看見的物件", sources: ["object"] },
];
const exclusiveTopics: Record<Level, Topic[]> = {
  preschool: [
    { id: "toy", label: "玩具", emoji: "🧸", description: "陪伴成長的玩具", sources: ["object"], badge: "初級" },
    { id: "transport", label: "交通工具", emoji: "🚌", description: "街上看見的車輛", sources: ["object"], badge: "初級" },
  ],
  junior: [
    { id: "school", label: "學校", emoji: "🏫", description: "校園常用字詞", sources: ["school"], badge: "中級" },
    { id: "career", label: "職業", emoji: "💼", description: "認識不同工作", sources: ["other"], badge: "中級" },
    { id: "sport", label: "運動", emoji: "⚽", description: "動起來學字詞", sources: ["action"], badge: "中級" },
  ],
  senior: [
    { id: "nature", label: "自然", emoji: "🌳", description: "自然與環境字詞", sources: ["nature"], badge: "高級" },
    { id: "advanced-emotion", label: "情緒進階", emoji: "💭", description: "認識複雜感受", sources: ["emotion"], badge: "進階" },
    { id: "society", label: "社會", emoji: "🏙️", description: "角色與社會生活", sources: ["other"], badge: "高級" },
  ],
};
function getTopics(level: Level) { return [...commonTopics, ...exclusiveTopics[level]]; }
const BATCH_SIZE = 10;
const REVIEW_STORAGE_KEY = "traditional-character-review-library-v2";
const BATCH_STORAGE_KEY = "traditional-character-next-batches-v2";
const TOPIC_PROGRESS_STORAGE_KEY = "traditional-character-topic-progress-v2";
function topicBatchKey(level: Level, topic: Topic) { return `${level}:${topic.id}`; }
function getTopicTerms(level: Level, topic: Topic) { return terms.filter((item) => item.level === level && item.topic === topic.id); }
function reviewKey(item: Term) { return `${item.level}:${item.topic}:${item.term}`; }
export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [journey, setJourney] = useState<Journey>("practice");
  const [level, setLevel] = useState<Level>("junior");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [termIndex, setTermIndex] = useState(0);
  const [notice, setNotice] = useState("歡迎來到中文認字樂！");
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [completedTerms, setCompletedTerms] = useState<string[]>([]);
  const [batchStart, setBatchStart] = useState(0);
  const [reviewKeys, setReviewKeys] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) ?? "[]") as string[]; } catch { return []; }
  });
  const [tenLevelReviewKeys, setTenLevelReviewKeys] = useState<string[]>(() => readTenLevelReview());
  const [nextBatchStarts, setNextBatchStarts] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(BATCH_STORAGE_KEY) ?? "{}") as Record<string, number>; } catch { return {}; }
  });
  const [completedBatches, setCompletedBatches] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(TOPIC_PROGRESS_STORAGE_KEY) ?? "{}") as Record<string, number>; } catch { return {}; }
  });
  const [billingInstallId] = useState(() => readOrCreateBillingInstallId());
  const [familyUnlocked, setFamilyUnlocked] = useState(() => readLocalFamilyUnlock());
  const [unlockSource, setUnlockSource] = useState<UnlockSource>("home");
  const [nativeBillingAvailable, setNativeBillingAvailable] = useState(() => isGooglePlayBillingAvailable());
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | undefined>();
  const [familyUnlockPrice, setFamilyUnlockPrice] = useState<string | undefined>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRequestRef = useRef(0);
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [musicEnabled, setMusicEnabled] = useState(() => readBackgroundMusicEnabled());
  const [musicActivated, setMusicActivated] = useState(false);
  const [mapMusicActive, setMapMusicActive] = useState(true);
  const [practiceMusicActive, setPracticeMusicActive] = useState(true);
  const [chineseScript, setChineseScript] = useState(() => readChineseScript());
  const [scriptControlVisible, setScriptControlVisible] = useState(false);
  const [activeWordGame, setActiveWordGame] = useState<Exclude<GameId, "map">>("match");
  const [matchMode, setMatchMode] = useState<MatchMode>("challenge");
  const [matchLeaderboardBackScreen, setMatchLeaderboardBackScreen] = useState<"gameHub" | "matchMode" | "wordGame">("gameHub");
  const submitPictureMatchTime = trpc.social.submitPictureMatchTime.useMutation();
  const billingStatus = trpc.billing.status.useQuery({ installId: billingInstallId }, { retry: false });
  const verifyGooglePlayPurchase = trpc.billing.verifyGooglePlayPurchase.useMutation();
  const trpcUtils = trpc.useUtils();
  const activeBackgroundTrackRef = useRef<BackgroundMusicTrack | null>(null);

  const topicTerms = useMemo(() => {
    if (!topic) return [];
    return getTopicTerms(level, topic);
  }, [level, topic]);
  const sessionTerms = useMemo(() => topicTerms.slice(batchStart, batchStart + BATCH_SIZE), [batchStart, topicTerms]);
  const currentTerm = sessionTerms[termIndex] ?? sessionTerms[0];
  const reviewTerms = useMemo(() => reviewKeys.map((key) => terms.find((item) => reviewKey(item) === key) ?? null).filter((item): item is Term => item !== null), [reviewKeys]);
  const quizReviewTerms = useMemo(() => tenLevelReviewKeys.map((term) => tenLevelTerms.find((item) => item.term === term) ?? null).filter((item): item is typeof tenLevelTerms[number] => item !== null), [tenLevelReviewKeys]);
  const searchResults = useMemo(() => search.trim() ? terms.filter((item) => item.term.includes(search.trim())).slice(0, 20) : [], [search]);
  const pictureMatchTerms = useMemo<GameWord[]>(() => {
    const animals = tenLevelTerms.filter((item) => item.mapId === "M07" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const transport = tenLevelTerms.filter((item) => item.mapId === "M23" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const household = tenLevelTerms.filter((item) => item.mapId === "M19" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const clothing = tenLevelTerms.filter((item) => item.mapId === "M40" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const toys = tenLevelTerms.filter((item) => item.mapId === "M22" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const professions = tenLevelTerms.filter((item) => item.mapId === "M26" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const activities = tenLevelTerms.filter((item) => item.mapId === "M27" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    const equipment = tenLevelTerms.filter((item) => item.mapId === "M21" && Boolean(MATCH_IMAGE_BY_TERM[item.term]));
    return [...animals, ...transport, ...household, ...clothing, ...toys, ...professions, ...activities, ...equipment];
  }, []);
  const activeBackgroundTrack = getBackgroundTrackFor(screen, mapMusicActive, practiceMusicActive, activeWordGame);
  const pictureMatchGuestId = useMemo(() => readOrCreatePictureMatchGuestId(), []);
  const recordPictureMatchTime = (result: { durationSeconds: number; moves: number }) => {
    submitPictureMatchTime.mutate({ ...result, guestId: pictureMatchGuestId, installId: billingInstallId, displayName: readLocalPlayerName() }, { onSuccess: (saved) => setNotice(saved.improved ? saved.anonymous ? "訪客最佳時間已加入排行榜！" : `${saved.displayName ?? "你的名字"} 的最佳時間已加入排行榜！` : "這局已完成；排行榜保留你最快的時間。"), onError: (error) => setNotice(error.message.includes("已有人使用") ? "這個名字已有人使用，請到排行榜換一個名字。" : "完成時間暫未能儲存，可稍後再試。") });
  };

  useEffect(() => () => {
    audioRequestRef.current += 1;
    audioRef.current?.pause();
    audioCacheRef.current.forEach((audio) => { audio.pause(); audio.removeAttribute("src"); audio.load(); });
    audioCacheRef.current.clear();
    pauseBackgroundMusic();
  }, []);
  useEffect(() => {
    const playForButton = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const button = target.closest("button");
      if (!button || button.disabled || !button.closest(".literacy-app")) return;
      setMusicActivated(true);
      const track = getBackgroundTrackFor(screen, mapMusicActive, practiceMusicActive, activeWordGame);
      if (musicEnabled && track) startBackgroundMusic(track);
    };
    const onPointerDown = (event: PointerEvent) => { if (event.button === 0) playForButton(event.target); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") playForButton(event.target); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [activeWordGame, mapMusicActive, musicEnabled, practiceMusicActive, screen]);
  useEffect(() => {
    activeBackgroundTrackRef.current = activeBackgroundTrack;
    writeBackgroundMusicEnabled(musicEnabled);
    if (!musicEnabled || !activeBackgroundTrack) { pauseBackgroundMusic(); return; }
    startBackgroundMusic(activeBackgroundTrack);
  }, [activeBackgroundTrack, musicActivated, musicEnabled]);
  useEffect(() => { localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewKeys)); }, [reviewKeys]);
  useEffect(() => { localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(nextBatchStarts)); }, [nextBatchStarts]);
  useEffect(() => { localStorage.setItem(TOPIC_PROGRESS_STORAGE_KEY, JSON.stringify(completedBatches)); }, [completedBatches]);
  useEffect(() => {
    const syncReviewLibrary = (event: StorageEvent) => {
      if (event.key === "traditional-character-review-library-v3") setTenLevelReviewKeys(readTenLevelReview());
    };
    window.addEventListener("storage", syncReviewLibrary);
    return () => window.removeEventListener("storage", syncReviewLibrary);
  }, []);
  useEffect(() => { setNativeBillingAvailable(isGooglePlayBillingAvailable()); }, [screen]);
  useEffect(() => { setFamilyUnlocked(Boolean(billingStatus.data?.hasFamilyUnlock)); }, [billingStatus.data?.hasFamilyUnlock]);
  const go = (next: Screen, nextWordGame: Exclude<GameId, "map"> = activeWordGame) => {
    setTenLevelReviewKeys(readTenLevelReview());
    audioRequestRef.current += 1;
    audioRef.current?.pause();
    restoreBackgroundMusic();
    if (next === "level") setPracticeMusicActive(true);
    const track = getBackgroundTrackFor(next, next === "gameMode", next === "level" ? true : practiceMusicActive, nextWordGame);
    if (musicEnabled && track) startBackgroundMusic(track);
    else pauseBackgroundMusic();
    if (next === "gameMode") setMapMusicActive(true);
    setIsPlaying(false);
    setScreen(next);
  };
  const preloadTrack = useCallback((term: string, language: AudioLanguage) => {
    const source = topicAudioV2[term]?.[language] ?? topicAudio[term]?.[language];
    if (!source || audioCacheRef.current.has(source)) return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = source;
    audioCacheRef.current.set(source, audio);
    if (audioCacheRef.current.size > 32) {
      const oldestSource = audioCacheRef.current.keys().next().value;
      if (oldestSource) {
        const oldestAudio = audioCacheRef.current.get(oldestSource);
        oldestAudio?.pause();
        oldestAudio?.removeAttribute("src");
        oldestAudio?.load();
        audioCacheRef.current.delete(oldestSource);
      }
    }
    audio.load();
  }, []);
  const playTrack = useCallback((term: string, language: AudioLanguage, onEnded?: () => void) => {
    const source = topicAudioV2[term]?.[language] ?? topicAudio[term]?.[language];
    if (!source) { setNotice(`「${term}」暫未有固定讀音。`); return; }
    const requestId = audioRequestRef.current + 1;
    audioRequestRef.current = requestId;
    audioRef.current?.pause();
    restoreBackgroundMusic();
    const startAttempt = (hasRetried = false) => {
      if (audioRequestRef.current !== requestId) return;
      const audio = audioCacheRef.current.get(source) ?? new Audio(source);
      audio.preload = "auto";
      audio.currentTime = 0;
      audioRef.current = audio;
      let handledFailure = false;
      const finishFailure = (message: string) => {
        if (handledFailure || audioRequestRef.current !== requestId) return;
        handledFailure = true;
        if (!hasRetried) {
          window.setTimeout(() => startAttempt(true), 280);
          return;
        }
        if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic();
        setIsPlaying(false);
        setNotice(message);
      };
      audio.onplay = () => {
        if (audioRequestRef.current !== requestId) return;
        duckBackgroundMusic();
        setIsPlaying(true);
      };
      audio.onended = () => {
        if (audioRequestRef.current !== requestId) return;
        if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic();
        setIsPlaying(false);
        onEnded?.();
      };
      audio.onerror = () => finishFailure("讀音未能載入，請檢查網絡後再試。 ");
      void audio.play().catch(() => finishFailure("請允許此網站播放聲音後再試。 "));
    };
    startAttempt();
  }, []);
  const playGameGuide = () => {
    audioRef.current?.pause();
    const audio = new Audio(gameGuideSource);
    audioRef.current = audio;
    audio.onplay = () => { duckBackgroundMusic(); setIsPlaying(true); };
    audio.onended = () => { if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic(); setIsPlaying(false); };
    audio.onerror = () => { if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic(); setIsPlaying(false); setNotice("玩法指引暫時未能載入，請先按卡片開始遊戲。"); };
    void audio.play().catch(() => { setIsPlaying(false); setNotice("請允許此網站播放聲音後再試。"); });
  };
  const playQuestEncouragement = (correctCount: number, language: AudioLanguage, delay = 0) => {
    const text = correctCount === 6 ? "六題都答對，真係好叻！" : "完成這一關，繼續努力！下次全對就可以收下拼圖！";
    window.setTimeout(() => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "cantonese" ? "zh-HK" : "zh-CN";
      utterance.rate = 0.9;
      utterance.pitch = 1.08;
      utterance.onstart = () => duckBackgroundMusic();
      utterance.onend = () => { if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic(); };
      utterance.onerror = () => { if (activeBackgroundTrackRef.current) restoreBackgroundMusic(); else pauseBackgroundMusic(); };
      window.speechSynthesis.speak(utterance);
    }, delay);
  };
  const chooseLevel = (nextLevel: Level) => { setLevel(nextLevel); setTopic(null); setTermIndex(0); };
  const requestUnlock = (source: UnlockSource) => { setUnlockSource(source); go("unlock"); };
  const completeGooglePlayPurchase = async (purchaseToken: string) => {
    await verifyGooglePlayPurchase.mutateAsync({ installId: billingInstallId, purchaseToken });
    writeLocalFamilyUnlock();
    await trpcUtils.billing.status.invalidate({ installId: billingInstallId });
    setFamilyUnlocked(true);
    setPurchaseMessage("Google Play 已核實購買，第 2 至第 10 級現已開放。");
    setPurchaseBusy(false);
  };
  const prepareBilling = async () => {
    if (!billingStatus.data) throw new Error("付款服務尚未準備好，請稍後再試。");
    const result = await prepareGooglePlayBilling({
      billingIdentity: billingStatus.data.billingIdentity,
      onApproved: async (transaction) => completeGooglePlayPurchase(transaction.purchaseId ?? ""),
      onError: (message) => { setPurchaseBusy(false); setPurchaseMessage(message); },
    });
    setNativeBillingAvailable(result.available);
    if (result.available && result.price) setFamilyUnlockPrice(result.price);
    return result;
  };
  const beginFamilyUnlockPurchase = async () => {
    if (!billingStatus.data?.isVerificationConfigured) { setPurchaseMessage("付款測試仍在設定中，暫時未能購買。"); return; }
    setPurchaseBusy(true); setPurchaseMessage(undefined);
    try { await prepareBilling(); await purchaseFamilyFullUnlock(); }
    catch (error) { setPurchaseBusy(false); setPurchaseMessage(error instanceof Error ? error.message : "未能開啟 Google Play 付款，請稍後再試。"); }
  };
  const restoreFamilyUnlock = async () => {
    if (!billingStatus.data?.isVerificationConfigured) { setPurchaseMessage("付款測試仍在設定中，暫時未能恢復購買。"); return; }
    setPurchaseBusy(true); setPurchaseMessage(undefined);
    try { await prepareBilling(); await restoreGooglePlayPurchases(); setPurchaseMessage("已向 Google Play 查詢已購買內容。"); }
    catch (error) { setPurchaseMessage(error instanceof Error ? error.message : "未能恢復購買，請稍後再試。"); }
    finally { setPurchaseBusy(false); }
  };
  const chooseTopic = (nextTopic: Topic, nextLevel: Level = level) => {
    if (isPremiumLevel(nextLevel) && !familyUnlocked) { requestUnlock("practice"); return; }
    const nextTopicTerms = getTopicTerms(nextLevel, nextTopic);
    const storedStart = nextBatchStarts[topicBatchKey(nextLevel, nextTopic)] ?? 0;
    setLevel(nextLevel);
    setTopic(nextTopic);
    setBatchStart(storedStart >= nextTopicTerms.length ? 0 : storedStart);
    setTermIndex(0);
    setCompletedTerms([]);
    setNotice(`已選擇「${nextTopic.label}」，每次學習 10 個字詞。`);
    go("learn");
  };
  const moveTerm = (direction: -1 | 1) => { if (!sessionTerms.length) return; setTermIndex((index) => (index + direction + sessionTerms.length) % sessionTerms.length); setNotice("撳粵語或普通話，聽一聽這個字詞。 "); };
  const toggleReview = (item: Term) => {
    const key = reviewKey(item);
    const isSaved = reviewKeys.includes(key);
    setReviewKeys(isSaved ? reviewKeys.filter((savedKey) => savedKey !== key) : [...reviewKeys, key]);
    setNotice(isSaved ? `已從溫習庫移除「${item.term}」。` : `已把「${item.term}」加入溫習庫！`);
  };
  const addToReview = (item: Term) => {
    const key = reviewKey(item);
    setReviewKeys((previous) => previous.includes(key) ? previous : [...previous, key]);
    setNotice(`已把「${item.term}」加入溫習庫，稍後可以再練習。`);
  };
  const removeFromReview = (item: Term) => {
    setReviewKeys((previous) => previous.filter((key) => key !== reviewKey(item)));
    setNotice(`你已掌握「${item.term}」！已從溫習庫移出。`);
  };
  const resetTopicProgress = (targetLevel: Level, targetTopic: Topic) => {
    const key = topicBatchKey(targetLevel, targetTopic);
    setCompletedBatches((previous) => {
      const updated = { ...previous };
      delete updated[key];
      return updated;
    });
    setNextBatchStarts((previous) => {
      const updated = { ...previous };
      delete updated[key];
      return updated;
    });
    setNotice(`已重設「${targetTopic.label}」，可由第一組 10 個字詞重新開始。`);
  };
  const completeCurrentTerm = () => {
    if (!currentTerm) return;
    const updated = completedTerms.includes(currentTerm.term) ? completedTerms : [...completedTerms, currentTerm.term];
    setCompletedTerms(updated);
    const targetCount = sessionTerms.length;
    if (updated.length >= targetCount) {
      if (topic && topicTerms.length) {
        const key = topicBatchKey(level, topic);
        setNextBatchStarts((previous) => ({ ...previous, [key]: (batchStart + BATCH_SIZE) % topicTerms.length }));
        setCompletedBatches((previous) => ({ ...previous, [key]: Math.min(3, (previous[key] ?? 0) + 1) }));
      }
      setNotice(`你完成了 ${targetCount} 個字詞！`);
      go("complete");
      return;
    }
    setTermIndex((index) => Math.min(index + 1, targetCount - 1));
    setNotice("做得好！繼續下一個字詞。 ");
  };

  const toggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    setMusicActivated(true);
    if (next && activeBackgroundTrack) startBackgroundMusic(activeBackgroundTrack);
    else pauseBackgroundMusic();
  };
  const toggleChineseScript = () => {
    setChineseScript((current) => {
      const next = current === "traditional" ? "simplified" : "traditional";
      writeChineseScript(next);
      return next;
    });
  };
  const chooseWordGame = (game: GameId) => {
    if (game === "map") { go("gameMode"); return; }
    if (game === "match") { go("matchMode"); return; }
    setTenLevelReviewKeys(readTenLevelReview());
    setActiveWordGame(game);
    go("wordGame", game);
  };
  const chooseMatchMode = (mode: MatchMode) => {
    setMatchMode(mode);
    setActiveWordGame("match");
    go("wordGame", "match");
  };
  const openMatchLeaderboard = (from: "gameHub" | "matchMode" | "wordGame") => {
    setMatchLeaderboardBackScreen(from);
    go("matchLeaderboard");
  };
  const openFeedbackEmail = () => {
    const subject = "中文認字樂｜意見與問題回報";
    const body = "你好，\n\n我想就「中文認字樂」提供意見或回報問題：\n\n類型：讀音／詞語／學習／遊戲／其他\n相關詞語或關卡：\n內容：\n\n謝謝。";
    window.location.href = `mailto:kidscatword@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <ChineseScriptProvider script={chineseScript}><div className="literacy-app min-h-screen bg-[#FFF9ED] text-[#26324B]" lang="zh-HK">
    {screen === "home" && <HomeScreen onStart={() => { setJourney("game"); go("gameHub"); }} onPractice={() => { setJourney("practice"); go("level"); }} onMore={() => go("more")} />}
    {screen === "level" && <TenLevelPractice familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("practice")} onBack={() => go(journey === "game" ? "gameHub" : "home")} onPlay={playTrack} onPreload={preloadTrack} onMusicActiveChange={setPracticeMusicActive} onLevelSelectionChange={setScriptControlVisible} />}
    {screen === "category" && <CategoryScreen level={level} completedBatches={completedBatches} familyUnlocked={familyUnlocked} onChoose={chooseTopic} onRequestUnlock={() => requestUnlock("practice")} onReset={resetTopicProgress} onBack={() => go("level")} />}
    {screen === "learn" && currentTerm && topic && <LearnScreen level={level} topic={topic} current={currentTerm} index={termIndex} total={sessionTerms.length} isPlaying={isPlaying} isSaved={reviewKeys.includes(reviewKey(currentTerm))} notice={notice} onBack={() => go("category")} onPrev={() => moveTerm(-1)} onNext={completeCurrentTerm} onToggleReview={() => toggleReview(currentTerm)} onCantonese={() => playTrack(currentTerm.term, "cantonese")} onMandarin={() => playTrack(currentTerm.term, "mandarin")} />}
    {screen === "complete" && topic && <CompleteScreen topic={topic} count={sessionTerms.length} onReturn={() => { setCompletedTerms([]); setTermIndex(0); go("category"); }} />}
    {screen === "gameHub" && <GameHub onBack={() => go("home")} onChoose={chooseWordGame} onOpenMatchLeaderboard={() => openMatchLeaderboard("gameHub")} />}
    {screen === "gameMode" && <TenLevelMapQuest familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("map")} onBack={() => go("gameHub")} onPlay={playTrack} onPreload={preloadTrack} onMusicActiveChange={setMapMusicActive} onLevelSelectionChange={setScriptControlVisible} />}
    {screen === "matchMode" && <MatchModeSelect onBack={() => go("gameHub")} onChoose={chooseMatchMode} onOpenLeaderboard={() => openMatchLeaderboard("matchMode")} />}
    {screen === "wordGame" && <WordGameScreen game={activeWordGame} matchMode={matchMode} allTerms={tenLevelTerms} pictureMatchTerms={pictureMatchTerms} reviewTerms={quizReviewTerms} onBack={() => go(activeWordGame === "match" ? "matchMode" : "gameHub")} onGuide={playGameGuide} onPlayCantonese={(item) => playTrack(item.term, "cantonese")} onPlayMandarin={(item) => playTrack(item.term, "mandarin")} onPreload={preloadTrack} onMatchCorrect={(item) => { playCorrectChime(); playTrack(item.term, "cantonese"); }} onMatchComplete={recordPictureMatchTime} onOpenMatchLeaderboard={() => openMatchLeaderboard("wordGame")} canJoinLeaderboard />}
    {screen === "matchLeaderboard" && <PictureMatchLeaderboard installId={billingInstallId} guestId={pictureMatchGuestId} onBack={() => go(matchLeaderboardBackScreen)} />}
    {screen === "album" && <TenLevelCardAlbum familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("album")} onBack={() => go("home")} onOpenMap={() => go("gameMode")} onOpenLegacy={() => go("legacyAlbum")} />}
    {screen === "legacyAlbum" && <CardAlbum terms={terms} getTopics={getTopics} familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("album")} onBack={() => go("album")} onOpenMap={() => go("gameMode")} />}
    {screen === "search" && <TenLevelSearch familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("home")} onBack={() => go("home")} onPlay={playTrack} />}
    {screen === "review" && <TenLevelReview familyUnlocked={familyUnlocked} onRequestUnlock={() => requestUnlock("home")} onBack={() => go("home")} onPlay={playTrack} />}
    {screen === "more" && <MoreLearningScreen reviewCount={quizReviewTerms.length} onBack={() => go("home")} onAlbum={() => go("album")} onReview={() => go("review")} onFeedback={openFeedbackEmail} />}
    {screen === "unlock" && <FamilyUnlockScreen unlocked={familyUnlocked} source={unlockSource} billingReady={Boolean(billingStatus.data?.isVerificationConfigured)} nativeBillingAvailable={nativeBillingAvailable} price={familyUnlockPrice} busy={purchaseBusy} message={purchaseMessage} onPurchase={() => void beginFamilyUnlockPurchase()} onRestore={() => void restoreFamilyUnlock()} onBack={() => go(unlockSource === "practice" ? "level" : unlockSource === "map" ? "gameMode" : unlockSource === "album" ? "album" : "home")} />}
    <aside className="global-top-controls" aria-label="顯示與聲音控制">{scriptControlVisible && <button onClick={toggleChineseScript} className={`map-sound-toggle script-toggle ${chineseScript === "simplified" ? "on" : ""}`} aria-label={chineseScript === "traditional" ? "目前顯示繁體字，按此切換為簡體字" : "目前顯示簡體字，按此切換為繁體字"} aria-pressed={chineseScript === "simplified"}><span aria-hidden="true">{chineseScript === "traditional" ? "繁" : "简"}</span></button>}<button onClick={toggleMusic} className={`map-sound-toggle ${musicEnabled ? "on" : ""}`} aria-label={musicEnabled ? "聲音：開啟，按此關閉" : "聲音：關閉，按此開啟"}>{musicEnabled ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</button></aside>
    {screen !== "home" && <button onClick={() => go("home")} className="global-home-button" aria-label="回首頁"><House className="h-4 w-4 fill-current" />回首頁</button>}
  </div></ChineseScriptProvider>;
}

function WordGameScreen({ game, matchMode, allTerms, pictureMatchTerms, reviewTerms, onBack, onGuide, onPlayCantonese, onPlayMandarin, onPreload, onMatchCorrect, onMatchComplete, onOpenMatchLeaderboard, canJoinLeaderboard }: {
  game: Exclude<GameId, "map">;
  matchMode: MatchMode;
  allTerms: GameWord[];
  pictureMatchTerms: GameWord[];
  reviewTerms: GameWord[];
  onBack: () => void;
  onGuide: () => void;
  onPlayCantonese: (item: GameWord) => void;
  onPlayMandarin: (item: GameWord) => void;
  onPreload: (term: string, language: AudioLanguage) => void;
  onMatchCorrect: (item: GameWord) => void;
  onMatchComplete: (result: { durationSeconds: number; moves: number }) => void;
  onOpenMatchLeaderboard: () => void;
  canJoinLeaderboard: boolean;
}) {
  if (game === "match") return <MatchGame pool={pictureMatchTerms} mode={matchMode} onBack={onBack} onGuide={onGuide} onMatchCorrect={onMatchCorrect} onMatchComplete={onMatchComplete} onOpenLeaderboard={onOpenMatchLeaderboard} canJoinLeaderboard={canJoinLeaderboard} />;
  if (game === "listen") return <ListenChooseGame pool={allTerms} onBack={onBack} onGuide={onGuide} onPlayCantonese={(word) => onPlayCantonese(word as Term)} />;
  if (game === "build") return <BuildGame pool={allTerms} onBack={onBack} onGuide={onGuide} onPlayCantonese={(word) => onPlayCantonese(word as Term)} onPlayMandarin={(word) => onPlayMandarin(word as Term)} />;
  if (game === "reviewQuest") return <ReviewQuestGame reviewTerms={reviewTerms} allTerms={allTerms} onBack={onBack} onGuide={onGuide} onPlayCantonese={onPlayCantonese} onPlayMandarin={onPlayMandarin} onPreload={onPreload} />;
  if (game === "findWord") return <FindWordGame pool={allTerms} onBack={onBack} onGuide={onGuide} />;
  return <FillBlankGame pool={allTerms} onBack={onBack} onGuide={onGuide} />;
}

function Shell({ children, onBack, title, step }: { children: React.ReactNode; onBack?: () => void; title: string; step?: string }) {
  return <div className="flex min-h-screen w-full flex-col px-4 pb-7 pt-4"><header className="mb-5 flex items-center justify-between"><button onClick={onBack} className={`grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#47745D] shadow-sm ${!onBack ? "invisible" : ""}`} aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-serif text-2xl font-black">{title}</p>{step && <p className="mt-0.5 text-xs font-bold text-[#76839A]">{step}</p>}</div><div className="w-11" /></header>{children}</div>;
}

function HomeScreen({ onStart, onPractice, onMore }: { onStart: () => void; onPractice: () => void; onMore: () => void }) {
  return <div className="flex min-h-screen w-full flex-col bg-[#FFFDF7] px-5 pb-6 pt-6"><p className="text-center font-serif text-xl font-black tracking-wide text-[#3E3A3A]">歡迎頁面，進入學習</p><div className="relative mt-5 flex-1 overflow-hidden bg-[radial-gradient(circle_at_45%_20%,#FFFEE9_0%,#FFFDF5_46%,#FFF7DF_100%)] px-7 pb-7 pt-8 text-center"><div className="absolute left-8 top-7 text-4xl drop-shadow-sm">☁️</div><div className="absolute right-7 top-9 text-4xl drop-shadow-sm">☁️</div><div className="absolute left-9 top-[32%] text-3xl">⭐</div><div className="absolute right-10 top-[31%] text-3xl">⭐</div><div className="absolute left-12 top-[52%] text-3xl">💗</div><div className="absolute right-12 top-[51%] text-xl">✨</div><div className="relative z-10"><h1 className="font-serif text-[3.1rem] font-black leading-[1.02] tracking-tight drop-shadow-[0_4px_0_rgba(255,255,255,0.92)]"><span className="text-[#F3767D]">中</span><span className="text-[#F3767D]">文</span><span className="text-[#79B7E4]">認</span><span className="text-[#79B7E4]">字</span><span className="text-[#F6C857]">樂</span></h1><p className="mt-3 text-sm font-bold text-[#57706C]">看一看・聽一聽・說一說</p><div className="mx-auto mt-3 h-56 w-56"><img src="/manus-storage/reading-cat-mascot_e03e748c.png" alt="拿著藍色書本的閱讀小貓吉祥物" className="h-56 w-56 object-contain mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_78%)]" /></div><div className="mt-2 grid gap-3"><button onClick={onPractice} className="flex h-[4.5rem] items-center justify-center gap-3 rounded-[1.5rem] border-2 border-[#E8A92A] bg-[#F8BE46] text-2xl font-black text-white shadow-[0_6px_0_#D99B23] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#D99B23]"><span className="text-3xl">✏️</span>練習模式</button><button onClick={onStart} className="flex h-[4.5rem] items-center justify-center gap-3 rounded-[1.5rem] border-2 border-[#E55D67] bg-[#F87578] text-2xl font-black text-white shadow-[0_6px_0_#D85A62] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#D85A62]"><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#F87578]"><Play className="h-5 w-5 fill-current" /></span>遊戲天地</button><button onClick={onMore} className="more-learning-link">✨ 更多學習<span>收藏、溫習與意見</span></button><a href="/privacy" className="mt-1 text-center text-[11px] font-bold text-[#8190A0] underline decoration-[#C9D1D9] underline-offset-2">隱私權政策</a></div></div></div></div>;
}

function MoreLearningScreen({ onBack, onReview, onAlbum, onFeedback, reviewCount }: { onBack: () => void; onReview: () => void; onAlbum: () => void; onFeedback: () => void; reviewCount: number }) {
  return <Shell title="更多學習" step="收藏、溫習與意見"><section className="grid gap-4"><button onClick={onReview} className="more-learning-card review"><span>⭐</span><div><strong>溫習庫 <em>{reviewCount}</em></strong><small>把想再讀的字詞收起來重溫</small></div><ChevronRight className="h-6 w-6" /></button><button onClick={onAlbum} className="more-learning-card album"><span>🏅</span><div><strong>字卡收藏冊</strong><small>查看已完成主題的完整字卡</small></div><ChevronRight className="h-6 w-6" /></button><button onClick={onFeedback} className="more-learning-card feedback"><span><Mail className="h-7 w-7" /></span><div><strong>意見信箱</strong><small>打開電郵範本，告訴我們讀音或遊戲問題</small></div><ChevronRight className="h-6 w-6" /></button></section></Shell>;
}

function LevelScreen({ level, familyUnlocked, onChoose, onBack, onNext }: { level: Level; familyUnlocked: boolean; onChoose: (level: Level) => void; onBack: () => void; onNext: () => void }) {
  const selected = levelMeta[level];
  const selectedLocked = isPremiumLevel(level) && !familyUnlocked;
  return <Shell title="選擇難度" step="步驟 1・選擇學習內容" onBack={onBack}><div className="segmented-tabs">{(Object.keys(levelMeta) as Level[]).map((item) => { const locked = isPremiumLevel(item) && !familyUnlocked; return <button key={item} onClick={() => onChoose(item)} className={level === item ? "is-active" : ""}>{locked && <LockKeyhole className="mr-1 inline h-3.5 w-3.5" />}{levelMeta[item].label}</button>; })}</div><section className={`grade-detail grade-${selected.tone}`}><span className="text-6xl">{selected.emoji}</span><div><h1 className="font-serif text-4xl font-black">{selected.label}</h1><p className="mt-1 text-lg font-bold">{selected.age}</p><p className="mt-4 leading-7 text-[#50627B]">{selected.description}</p>{selectedLocked && <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-black text-[#7B5D91]"><LockKeyhole className="h-4 w-4" />家庭解鎖後開放</p>}</div></section><button onClick={onNext} className="next-button">{selectedLocked ? "查看家庭解鎖" : "下一步"} <ChevronRight className="h-5 w-5" /></button></Shell>;
}

function CategoryScreen({ level, completedBatches, familyUnlocked, onChoose, onRequestUnlock, onReset, onBack }: { level: Level; completedBatches: Record<string, number>; familyUnlocked: boolean; onChoose: (topic: Topic) => void; onRequestUnlock: () => void; onReset: (level: Level, topic: Topic) => void; onBack: () => void }) {
  const levelLocked = isPremiumLevel(level) && !familyUnlocked;
  return <Shell title="選擇類別" step={`步驟 2・${levelMeta[level].label}學習內容`} onBack={onBack}><div className="selected-level-chip">{levelMeta[level].emoji} 已選擇：{levelMeta[level].label}</div>{levelLocked ? <button onClick={onRequestUnlock} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F3ECFA] px-4 py-3 text-sm font-black text-[#765A9F] shadow-sm transition hover:bg-[#EDE1F8] active:scale-95"><LockKeyhole className="h-4 w-4" />此級別需要家庭解鎖・查看方案</button> : <p className="mt-4 text-center text-sm font-bold text-[#6B7890]">每完成 10 個字詞，就填滿一格學習進度。</p>}<div className="category-app-grid">{getTopics(level).map((item) => { const completed = Math.min(3, completedBatches[topicBatchKey(level, item)] ?? 0); return <article key={item.id} className={`category-app-card ${completed === 3 ? "is-complete" : ""} ${levelLocked ? "opacity-75" : ""}`}><div className="category-progress-fill" style={{ width: `${(completed / 3) * 100}%` }} aria-hidden="true" />{levelLocked ? <button onClick={onRequestUnlock} className="relative z-10 flex min-h-28 w-full flex-col items-center justify-center rounded-xl px-2 text-center active:scale-95" aria-label={`解鎖${levelMeta[level].label}${item.label}`}><LockKeyhole className="h-6 w-6 text-[#81659A]" /><strong>{item.label}</strong><small>家庭解鎖後開放</small></button> : <><button onClick={() => onChoose(item)} className="category-card-content" aria-label={`開始${item.label}學習`}><span className="text-4xl">{item.emoji}</span>{item.badge && <span className="category-badge">{item.badge}</span>}<strong>{item.label}</strong><small>{item.description}</small><span className="category-progress-label">{completed === 3 ? "已完成" : `完成 ${completed}/3 組`}</span></button><button onClick={() => onReset(level, item)} disabled={completed === 0} className="category-reset-button" aria-label={`重設${item.label}分類進度`}>↺ 重設進度</button></>}</article>; })}</div></Shell>;
}

function LearnScreen({ level, topic, current, index, total, isPlaying, isSaved, notice, onBack, onPrev, onNext, onToggleReview, onCantonese, onMandarin }: { level: Level; topic: Topic; current: Term; index: number; total: number; isPlaying: boolean; isSaved: boolean; notice: string; onBack: () => void; onPrev: () => void; onNext: () => void; onToggleReview: () => void; onCantonese: () => void; onMandarin: () => void }) {
  const { displayText } = useChineseScript();
  const progress = total ? ((index + 1) / total) * 100 : 0;
  return <Shell title={`${levelMeta[level].label} · ${topic.label}`} step={`第 ${index + 1} / ${total} 個字詞`} onBack={onBack}><div className="flex items-center gap-3 rounded-full bg-white p-2 shadow-sm"><div className="h-3 flex-1 overflow-hidden rounded-full bg-[#E6EDF4]"><div className="h-full rounded-full bg-[#5BA5E8] transition-all" style={{ width: `${progress}%` }} /></div><span className="text-xs font-black text-[#47745D]">{index + 1}/{total}</span></div><section className="learn-focus relative"><button onClick={onToggleReview} className={`term-star-button ${isSaved ? "is-saved" : ""}`} aria-label={isSaved ? `從溫習庫移除「${displayText(current.term)}」` : `把「${displayText(current.term)}」加入溫習庫`}><Star className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} /></button><p className="text-sm font-bold text-[#6E7B91]">認字時間</p><h1 className="learn-word">{displayText(current.term)}</h1><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={onCantonese} className="voice-button voice-canto"><Volume2 className="h-5 w-5" />粵語</button><button onClick={onMandarin} className="voice-button voice-mandarin"><Volume2 className="h-5 w-5" />普通話</button></div><p className="mt-4 text-center text-xs font-bold text-[#67768B]">{isPlaying ? "正在播放讀音…" : "撳按鈕聽示範讀音"}</p></section><p className="mt-4 rounded-2xl bg-[#EEF8F1] px-4 py-3 text-center text-sm font-bold leading-6 text-[#4E7960]">{notice}</p><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={onPrev} className="learn-nav"><ChevronLeft className="h-5 w-5" />上一個</button><button onClick={onNext} className="learn-nav">{index + 1 === total ? `完成 ${total} 個字詞` : "下一個"}<ChevronRight className="h-5 w-5" /></button></div></Shell>;
}

function CompleteScreen({ topic, count, onReturn }: { topic: Topic; count: number; onReturn: () => void }) {
  useEffect(() => { const timer = window.setTimeout(onReturn, 3500); return () => window.clearTimeout(timer); }, [onReturn]);
  return <div className="flex min-h-screen w-full items-center bg-[#FFFDF7] px-5"><section className="w-full bg-[radial-gradient(circle_at_45%_20%,#FFFEE9_0%,#FFFDF5_52%,#EAF7F1_100%)] px-8 py-12 text-center"><p className="text-3xl">⭐　⭐　⭐</p><img src="/manus-storage/cat-thumbs-up-celebration_80ef4ef4.png" alt="豎起拇指的小貓吉祥物" className="mx-auto mt-4 h-64 w-64 object-contain" /><h1 className="mt-2 font-serif text-4xl font-black text-[#E56C72]">你好叻！</h1><p className="mt-3 text-lg font-bold leading-8 text-[#56706D]">你完成咗「{topic.label}」{count} 個字詞！</p><p className="mt-3 text-sm font-bold text-[#798799]">3 秒後會返回分類頁面。</p><button onClick={onReturn} className="mt-6 rounded-2xl bg-[#F8BE46] px-6 py-3 text-lg font-black text-white shadow-[0_5px_0_#D99B23] active:translate-y-1 active:shadow-none">返回分類</button></section></div>;
}

function SearchScreen({ value, onChange, results, onBack, onSelect }: { value: string; onChange: (value: string) => void; results: Term[]; onBack: () => void; onSelect: (term: Term) => void }) {
  const { displayText } = useChineseScript();
  const generated = value.trim() && results.length === 0 ? { term: value.trim() } : null;
  return <Shell title="自由查詞" step="輸入任何繁體字詞" onBack={onBack}><label className="search-box"><Search className="h-5 w-5" /><input autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder="例如：飯、閱讀、香港" /></label><div className="mt-5 space-y-3">{results.map((item) => <button key={item.term} onClick={() => onSelect(item)} className="search-result"><span className="text-3xl">🔎</span><span><strong>{displayText(item.term)}</strong></span><ChevronRight /></button>)}{generated && <article className="example-card"><p className="text-4xl font-black">{displayText(generated.term)}</p><p className="mt-3 text-xs text-[#6B7890]">此字詞目前未有固定錄音。</p></article>}</div></Shell>;
}

function ReviewScreen({ terms, isPlaying, onBack, onRemove, onCantonese, onMandarin }: { terms: Term[]; isPlaying: boolean; onBack: () => void; onRemove: (item: Term) => void; onCantonese: (item: Term) => void; onMandarin: (item: Term) => void }) {
  const { displayText } = useChineseScript();
  return <Shell title="溫習庫" step={`已儲存 ${terms.length} 個字詞`} onBack={onBack}>{terms.length === 0 ? <section className="review-empty"><Star className="h-13 w-13 text-[#F2B741]" /><h1>溫習庫等待你</h1><p>學習時撳右上角的星星，就可以把想重溫的字詞儲存在這裡。</p></section> : <div className="review-term-list">{terms.map((item) => <article key={reviewKey(item)} className="review-term-card"><button onClick={() => onRemove(item)} className="review-remove" aria-label={`從溫習庫移除「${displayText(item.term)}」`}><Star className="h-5 w-5 fill-current" /></button><div><p className="font-serif text-4xl font-black text-[#263C71]">{displayText(item.term)}</p></div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => onCantonese(item)} className="review-audio review-canto"><Volume2 className="h-4 w-4" />粵語</button><button onClick={() => onMandarin(item)} className="review-audio review-mandarin"><Volume2 className="h-4 w-4" />普通話</button></div></article>)}</div>}<p className="mt-5 text-center text-xs font-bold text-[#77869A]">{isPlaying ? "正在播放讀音…" : "可隨時撳語音按鈕重溫讀音。"}</p></Shell>;
}
