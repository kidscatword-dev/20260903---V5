import { useEffect, useState } from "react";
import { ArrowLeft, LockKeyhole, Trophy } from "lucide-react";
import { TopicCardSlice } from "@/components/TopicCardSlice";
import { getTenLevelLabel, getTenLevelTopics, tenLevels, type TenLevel } from "@/data/tenLevelCatalog";
import { getTenLevelCardArt } from "@/lib/tenLevelCardArt";
import { getTenLevelFragmentCount, isTenLevelMapComplete, readTenLevelQuestProgress } from "@/lib/tenLevelQuestProgress";
import { isTenLevelLocked } from "@/lib/familyUnlock";
import { useChineseScript } from "@/contexts/ChineseScriptContext";

export function TenLevelCardAlbum({ familyUnlocked, onRequestUnlock, onBack, onOpenMap, onOpenLegacy }: {
  familyUnlocked: boolean;
  onRequestUnlock: () => void;
  onBack: () => void;
  onOpenMap: () => void;
  onOpenLegacy: () => void;
}) {
  const { displayText } = useChineseScript();
  const [level, setLevel] = useState<TenLevel>(1);
  const [progress] = useState(() => readTenLevelQuestProgress());
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [previewCardKey, setPreviewCardKey] = useState<string | null>(null);
  const maps = getTenLevelTopics(level);
  const completed = maps.filter((map) => isTenLevelMapComplete(progress, level, map.id)).length;
  const previewMap = previewCardKey ? maps.find((map) => `${level}:${map.id}` === previewCardKey) : undefined;
  const previewArt = previewMap ? getTenLevelCardArt(previewMap) : undefined;
  const openCardPreview = (cardKey: string) => { setFlippedCard(null); setPreviewCardKey(cardKey); };

  useEffect(() => {
    if (!previewCardKey) return;
    const timer = window.setTimeout(() => {
      setPreviewCardKey(null);
      setFlippedCard(previewCardKey);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [previewCardKey]);

  return <div className="album-shell">
    <header className="album-header">
      <button onClick={onBack} className="album-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button>
      <div><p>字卡收藏冊</p><small>完成五關，合成一張主題字卡</small></div><div className="w-11" />
    </header>
    <section className="album-hero beginner"><div className="album-hero-icon"><Trophy className="h-7 w-7" /></div><div><p>{displayText(getTenLevelLabel(level))}地圖收藏</p><strong>完整字卡 {completed} / {maps.length} 張</strong><small>點按已合成的卡片，會先放大全屏展示，再翻轉查看主題資料。</small></div></section>
    <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="選擇級別">
      {tenLevels.map((item) => {
        const locked = isTenLevelLocked(item, familyUnlocked);
        return <button key={item} onClick={() => { if (locked) return onRequestUnlock(); setLevel(item); setFlippedCard(null); setPreviewCardKey(null); }} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${item === level ? "bg-[#5BA5E8] text-white shadow-sm" : "bg-white text-[#64728B]"}`}>
          {locked && <LockKeyhole className="mr-1 inline h-3.5 w-3.5" />}第 {item} 級
        </button>;
      })}
    </nav>
    <section className="album-book"><div className="album-book-label"><Trophy className="h-4 w-4" />我的主題字卡</div><div className="album-card-grid">
      {maps.map((map, index) => {
        const complete = isTenLevelMapComplete(progress, level, map.id);
        const fragments = getTenLevelFragmentCount(progress, level, map.id);
        const art = getTenLevelCardArt(map);
        const cardKey = `${level}:${map.id}`;
        const flipped = flippedCard === cardKey;
        const representative = map.terms[0]?.term;
        return <article key={map.id} className={`album-topic-card ${complete ? "collected" : fragments ? "assembling" : "locked"} ${complete && art ? "has-supplied-art" : ""}`}>
          <div className="album-card-corner">#{String(index + 1).padStart(2, "0")}</div>
          {complete ? <button onClick={() => flipped ? setFlippedCard(null) : openCardPreview(cardKey)} className={`album-card-flipper ${flipped ? "is-flipped" : ""}`} aria-label={flipped ? `翻回${displayText(map.label)}字卡卡面` : `放大展示${displayText(map.label)}字卡`}>
            <span className="album-card-face album-card-front"><span className={`grid aspect-[0.704/1] w-full place-items-center overflow-hidden ${art ? "bg-white" : "bg-[radial-gradient(circle_at_45%_25%,#FFFDEB,#F9EAC8)]"}`}>{art ? <TopicCardSlice art={art} className="h-full w-full" alt={`${displayText(art.title)}完整字卡`} /> : <span className="text-6xl">{map.emoji}</span>}</span></span>
            <span className="album-card-face album-card-back"><span className="album-back-icon">{map.emoji}</span><strong>{displayText(map.label)}</strong><small>{displayText(getTenLevelLabel(level))}・{map.id}</small><em>{representative ? `代表詞：${displayText(representative)}` : "完整主題字卡"}</em><b>已完成 5/5 塊拼圖</b><i>點一下翻回卡面</i></span>
          </button> : <div className="grid min-h-52 place-items-center text-center"><span className="text-5xl opacity-70 grayscale">{map.emoji}</span><p className="mt-3 text-[11px] font-black">{fragments ? `已收集 ${fragments}/5 塊拼圖` : "尚未收集"}</p></div>}
        </article>;
      })}
    </div></section>
    <button onClick={onOpenMap} className="album-map-cta">前往地圖闖關收集字卡</button>
    <button onClick={onOpenLegacy} className="mt-3 w-full rounded-2xl border-2 border-dashed border-[#C9B8E3] bg-[#FBF9FF] px-5 py-3 text-sm font-black text-[#765A9F]">查看舊三級字卡備份</button>
    {previewMap && previewArt && <section className="album-card-preview-overlay" role="dialog" aria-modal="true" aria-label={`${displayText(previewMap.label)}字卡全屏展示`}><p>完整字卡・放大展示</p><button onClick={() => { setPreviewCardKey(null); setFlippedCard(`${level}:${previewMap.id}`); }} className="album-card-preview-button" aria-label="提早查看字卡資料"><TopicCardSlice art={previewArt} className="album-card-preview-image" alt={`${displayText(previewArt.title)}完整字卡`} /></button><h1>{displayText(previewMap.label)}字卡</h1><small>3 秒後會翻到資料面；也可點卡片立即查看。</small></section>}
  </div>;
}
