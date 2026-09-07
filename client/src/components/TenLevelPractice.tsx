import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, LockKeyhole, RotateCcw, Star, Volume2 } from "lucide-react";
import { getTenLevelDescription, getTenLevelLabel, getTenLevelTopics, tenLevels, tenLevelTerms, type TenLevel, type TenLevelTopic } from "@/data/tenLevelCatalog";
import { getWordCardSizeClass } from "@/lib/wordCardSizing";
import { isTenLevelLocked } from "@/lib/familyUnlock";
import { clearTenLevelLearningProgress, completedLearningBatches, readTenLevelLearningProgress, recordCompletedLearningBatch, writeTenLevelLearningProgress } from "@/lib/tenLevelLearningProgress";
import { readTenLevelReview, writeTenLevelReview } from "@/lib/tenLevelReview";
import { getLanguageWord, getLanguageWordCounterpart } from "@/lib/wordLanguageVariants";
import { useChineseScript } from "@/contexts/ChineseScriptContext";

type View = "levels" | "maps" | "learn" | "complete";
const TERMS_PER_SESSION = 10;
const LEARNING_BATCHES = 3;

export function TenLevelPractice({ familyUnlocked, onRequestUnlock, onBack, onPlay, onPreload, onMusicActiveChange, onLevelSelectionChange }: { familyUnlocked: boolean; onRequestUnlock: () => void; onBack: () => void; onPlay: (term: string, language: "cantonese" | "mandarin") => void; onPreload?: (term: string, language: "cantonese" | "mandarin") => void; onMusicActiveChange: (active: boolean) => void; onLevelSelectionChange?: (selected: boolean) => void }) {
  const { displayText } = useChineseScript();
  const [view, setView] = useState<View>("levels");
  const [level, setLevel] = useState<TenLevel>(1);
  const [topic, setTopic] = useState<TenLevelTopic | null>(null);
  const [batch, setBatch] = useState(0);
  const [index, setIndex] = useState(0);
  const [displayLanguage, setDisplayLanguage] = useState<"cantonese" | "mandarin">("cantonese");
  const [saved, setSaved] = useState<string[]>(() => readTenLevelReview());
  const [learningProgress, setLearningProgress] = useState(() => readTenLevelLearningProgress());
  const maps = getTenLevelTopics(level);
  const terms = useMemo(() => topic ? tenLevelTerms.filter(item => item.mapId === topic.id) : [], [topic]);
  const session = terms.slice(batch * TERMS_PER_SESSION, batch * TERMS_PER_SESSION + TERMS_PER_SESSION);
  const current = session[index];
  const batchCount = Math.max(1, Math.ceil(terms.length / TERMS_PER_SESSION));
  const returnToMaps = () => { setTopic(null); setIndex(0); setView("maps"); };
  const changeBatch = (direction: -1 | 1) => {
    setBatch(currentBatch => {
      const nextBatch = Math.min(Math.max(currentBatch + direction, 0), batchCount - 1);
      if (nextBatch !== currentBatch) setIndex(0);
      return nextBatch;
    });
  };

  useEffect(() => {
    onMusicActiveChange(view === "levels" || view === "maps");
  }, [onMusicActiveChange, view]);
  useEffect(() => { onLevelSelectionChange?.(view !== "levels"); }, [onLevelSelectionChange, view]);
  useEffect(() => () => onLevelSelectionChange?.(false), [onLevelSelectionChange]);
  useEffect(() => {
    if (!onPreload || !current) return;
    [current, session[index + 1]].filter((item): item is typeof current => Boolean(item)).forEach((item) => {
      onPreload(item.term, "cantonese");
      onPreload(item.term, "mandarin");
    });
  }, [current, index, onPreload, session]);

  if (view === "levels") return <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-7 pt-4">
    <header className="mb-5 flex items-center justify-between"><button onClick={onBack} className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#47745D] shadow-sm" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-serif text-2xl font-black">選擇級別</p><p className="mt-0.5 text-xs font-bold text-[#76839A]">第 1 至第 10 級・逐步累積</p></div><div className="w-11" /></header>
    <div className="grid gap-3">{tenLevels.map(item => { const locked = isTenLevelLocked(item, familyUnlocked); return <button key={item} onClick={() => { if (locked) { onRequestUnlock(); return; } setLevel(item); setView("maps"); }} className={`rounded-[1.6rem] border-2 border-white bg-white px-5 py-4 text-left shadow-sm transition active:scale-[0.98] ${locked ? "opacity-80" : ""}`}><div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF8F1] text-2xl">{locked ? <LockKeyhole className="h-5 w-5 text-[#8A7040]" /> : item <= 3 ? "🌱" : item <= 6 ? "🗺️" : "🚀"}</span><span><strong className="block text-lg text-[#38544D]">{getTenLevelLabel(item)}{locked ? "・家庭解鎖" : ""}</strong><small className="block pt-1 font-bold text-[#718095]">{locked ? "第 1 級免費；家長可解鎖第 2 至第 10 級" : getTenLevelDescription(item)}</small><em className="mt-1 block text-xs not-italic font-black text-[#E27A72]">{getTenLevelTopics(item).length} 張主題地圖</em></span></div></button>; })}</div>
  </div>;

  if (view === "maps") return <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-7 pt-4">
    <header className="mb-5 flex items-center justify-between"><button onClick={() => setView("levels")} className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#47745D] shadow-sm" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-serif text-2xl font-black">{getTenLevelLabel(level)}</p><p className="mt-0.5 text-xs font-bold text-[#76839A]">選擇主題地圖</p></div><div className="w-11" /></header>
    <div className="grid grid-cols-2 gap-3">{maps.map(map => {
      const completed = completedLearningBatches(learningProgress, map.id);
      return <article key={map.id} className={`rounded-[1.6rem] bg-white px-3 py-5 text-center shadow-sm ${completed === LEARNING_BATCHES ? "ring-2 ring-[#8FC59A]" : ""}`}><button onClick={() => { setTopic(map); setBatch(completed === LEARNING_BATCHES ? 0 : completed); setIndex(0); setView("learn"); }} className="w-full transition active:scale-[0.98]" aria-label={`開始${displayText(map.label)}學習`}><span className="text-4xl">{map.emoji}</span><strong className="mt-3 block text-base text-[#40526D]">{displayText(map.label)}</strong><small className="mt-1 block min-h-9 text-xs font-bold leading-4 text-[#718095]">由生活主題開始認字</small><em className="mt-2 block text-xs not-italic font-black text-[#E27A72]">25 個詞・3 組學習</em><span className="mt-3 grid grid-cols-3 gap-1" aria-label={`完成 ${completed}/3 組`}>{[0, 1, 2].map(group => <i key={group} className={`h-3 rounded-full ${group < completed ? "bg-[#8FC59A]" : "bg-[#E5EFE7]"}`} />)}</span><span className="mt-2 block text-xs font-black text-[#4D8060]">{completed === LEARNING_BATCHES ? "已完成 3 組" : `已完成 ${completed}/3 組`}</span></button><button onClick={() => setLearningProgress(previous => { const next = clearTenLevelLearningProgress(previous, map.id); writeTenLevelLearningProgress(next); return next; })} disabled={completed === 0} className="mt-3 inline-flex items-center gap-1 rounded-lg border border-[#8FC59A] bg-white px-2 py-1 text-[10px] font-black text-[#4D8060] disabled:border-[#CBD6CE] disabled:text-[#9BAAA1]" aria-label={`清除${displayText(map.label)}學習紀錄`}><RotateCcw className="h-3 w-3" />清除紀錄</button></article>;
    })}</div>
  </div>;

  if (view === "complete") return <div className="mx-auto flex min-h-screen max-w-md items-center bg-[#FFFDF7] px-5"><section className="w-full rounded-[2.7rem] border-4 border-[#E9DFE8] bg-[#F6FFF8] px-8 py-12 text-center shadow-[0_14px_32px_rgba(116,93,107,0.13)]"><p className="text-3xl">⭐　⭐　⭐</p><h1 className="mt-5 font-serif text-4xl font-black text-[#E56C72]">你好叻！</h1><p className="mt-3 text-lg font-bold leading-8 text-[#56706D]">你完成了「{topic?.label}」這組 {session.length} 個詞語！</p><button onClick={() => { if (batch < batchCount - 1) { setBatch(value => value + 1); setIndex(0); setView("learn"); } else returnToMaps(); }} className="mt-7 rounded-2xl bg-[#F8BE46] px-6 py-3 text-lg font-black text-white shadow-[0_5px_0_#D99B23]">{batch < batchCount - 1 ? "學習下一組" : "返回主題"}</button></section></div>;
  if (!topic || !current) return null;

  const isSaved = saved.includes(current.term);
  const primaryWord = getLanguageWord(current.term, displayLanguage);
  const counterpartWord = getLanguageWordCounterpart(current.term, displayLanguage);
  const displayPrimaryWord = displayText(primaryWord);
  const displayCounterpartWord = counterpartWord ? displayText(counterpartWord) : null;
  const wordSizeClass = getWordCardSizeClass(displayPrimaryWord);
  return <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-7 pt-4"><header className="mb-5 flex items-center justify-between"><button onClick={returnToMaps} className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#47745D] shadow-sm" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-serif text-xl font-black">{displayText(getTenLevelLabel(level))} · {displayText(topic.label)}</p><p className="mt-0.5 text-xs font-bold text-[#76839A]">第 {batch + 1} 組・{index + 1}/{session.length}</p></div><div className="w-11" /></header><div className="flex items-center gap-3 rounded-full bg-white p-2 shadow-sm"><div className="h-3 flex-1 overflow-hidden rounded-full bg-[#E6EDF4]"><div className="h-full rounded-full bg-[#5BA5E8]" style={{ width: `${((index + 1) / session.length) * 100}%` }} /></div><span className="text-xs font-black text-[#47745D]">{index + 1}/{session.length}</span></div><section className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-[#F3F8FF] p-2 text-center"><button onClick={() => changeBatch(-1)} disabled={batch === 0} className="rounded-xl bg-white px-2 py-2 text-sm font-black text-[#47745D] shadow-sm disabled:opacity-35"><ChevronLeft className="mr-0.5 inline h-4 w-4" />上一組</button><p className="text-xs font-black text-[#5C7190]">第 {batch + 1}/{batchCount} 組</p><button onClick={() => changeBatch(1)} disabled={batch >= batchCount - 1} className="rounded-xl bg-white px-2 py-2 text-sm font-black text-[#47745D] shadow-sm disabled:opacity-35">下一組<ChevronRight className="ml-0.5 inline h-4 w-4" /></button></section><section className="learn-focus relative mt-5"><button onClick={() => setSaved(values => { const next = isSaved ? values.filter(term => term !== current.term) : [...values, current.term]; writeTenLevelReview(next); return next; })} className={`term-star-button ${isSaved ? "is-saved" : ""}`} aria-label="收藏詞語"><Star className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} /></button><p className="text-sm font-bold text-[#6E7B91]">{topic.emoji} 認字時間</p><h1 className={`learn-word${wordSizeClass ? ` ${wordSizeClass}` : ""}`}>{displayPrimaryWord}</h1>{displayCounterpartWord && <p className="mt-2 font-serif text-2xl font-black text-[#7B899D]">（{displayCounterpartWord}）</p>}<div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => { setDisplayLanguage("cantonese"); onPlay(current.term, "cantonese"); }} className={`voice-button voice-canto ${displayLanguage === "cantonese" ? "ring-2 ring-[#F6A9B1] ring-offset-2" : ""}`}><Volume2 className="h-5 w-5" />粵語</button><button onClick={() => { setDisplayLanguage("mandarin"); onPlay(current.term, "mandarin"); }} className={`voice-button voice-mandarin ${displayLanguage === "mandarin" ? "ring-2 ring-[#9ECBF0] ring-offset-2" : ""}`}><Volume2 className="h-5 w-5" />普通話</button></div></section><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0} className="learn-nav"><ChevronLeft className="h-5 w-5" />上一個</button><button onClick={() => { if (index + 1 < session.length) setIndex(value => value + 1); else { setLearningProgress(previous => { const next = recordCompletedLearningBatch(previous, topic.id, batch); writeTenLevelLearningProgress(next); return next; }); setView("complete"); } }} className="learn-nav">{index + 1 === session.length ? `完成 ${session.length} 個詞` : "下一個"}<ChevronRight className="h-5 w-5" /></button></div></div>;
}
