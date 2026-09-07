/**
 * 繁體認字樂收藏冊設計提醒：完整字卡以可翻轉的繪本卡展示；正面保留原圖，背面用清晰資料協助回顧，並由固定粵語後普通話讀音強化記憶。
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpenCheck, ChevronRight, LockKeyhole, MapPinned, Maximize2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { FragmentStrip } from "@/components/FragmentStrip";
import { TopicCardSlice } from "@/components/TopicCardSlice";
import { isPremiumLevel } from "@/lib/familyUnlock";
import { getQuestFragmentCount, isQuestLandComplete, readQuestProgress, type QuestLevel, type QuestProgress } from "@/lib/mapQuestProgress";
import { getTopicCardArt, type TopicCardArt } from "@/lib/topicCardArt";

type AlbumTerm = { term: string; level: QuestLevel; topic: string };
type AlbumTopic = { id: string; label: string; emoji: string; description: string };
type CardPreview = { topic: AlbumTopic; art: TopicCardArt };

const levelMeta: Record<QuestLevel, { label: string; tone: string }> = {
  preschool: { label: "初級", tone: "beginner" },
  junior: { label: "中級", tone: "intermediate" },
  senior: { label: "高級", tone: "advanced" },
};

function PreviewOverlay({ preview }: { preview: CardPreview }) {
  return <div className="album-card-preview-overlay" role="dialog" aria-modal="true" aria-label={`${preview.topic.label}${preview.art.levelLabel}完整字卡預覽`}><p>完整字卡・欣賞 3 秒</p><TopicCardSlice art={preview.art} className="album-card-preview-image" alt={`${preview.art.title}完整字卡`} /><h1>{preview.topic.label}・{preview.art.levelLabel}</h1></div>;
}

export function CardAlbum({ terms, getTopics, familyUnlocked, onRequestUnlock, onBack, onOpenMap }: { terms: AlbumTerm[]; getTopics: (level: QuestLevel) => AlbumTopic[]; familyUnlocked: boolean; onRequestUnlock: () => void; onBack: () => void; onOpenMap: () => void }) {
  const [level, setLevel] = useState<QuestLevel>("preschool");
  const [progress, setProgress] = useState<QuestProgress>(() => readQuestProgress());
  const [preview, setPreview] = useState<CardPreview | null>(null);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const topics = getTopics(level);
  const collectedCount = topics.filter((topic) => isQuestLandComplete(progress, level, topic.id)).length;
  const fragmentTotal = topics.reduce((total, topic) => total + getQuestFragmentCount(progress, level, topic.id), 0);

  useEffect(() => {
    const refresh = () => setProgress(readQuestProgress());
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("focus", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  useEffect(() => {
    if (!preview) return;
    const timer = window.setTimeout(() => setPreview(null), 3000);
    return () => window.clearTimeout(timer);
  }, [preview]);

  const cards = useMemo(() => topics.map((topic) => ({
    topic,
    unlocked: isQuestLandComplete(progress, level, topic.id),
    fragments: getQuestFragmentCount(progress, level, topic.id),
    words: terms.filter((term) => term.level === level && term.topic === topic.id).slice(0, 6),
    art: getTopicCardArt(level, topic.id),
  })), [level, progress, terms, topics]);
  const flipCard = (key: string) => {
    setFlippedCard((current) => current === key ? null : key);
  };

  return <div className="album-shell"><header className="album-header"><button onClick={onBack} className="album-back" aria-label="返回"><ArrowLeft className="h-5 w-5" /></button><div><p>字卡收藏冊</p><small>答對 4 題以上，收下一塊真實拼圖</small></div><div className="w-11" /></header><section className={`album-hero ${levelMeta[level].tone}`}><div className="album-hero-icon"><BookOpenCheck className="h-8 w-8" /></div><div><p>{levelMeta[level].label}地圖收藏</p><strong>完整字卡 {collectedCount} / {topics.length} 張</strong><small>已收集 {fragmentTotal} / {topics.length * 5} 塊字卡拼圖。</small></div><Sparkles className="album-sparkle" /></section><div className="album-level-tabs" role="tablist" aria-label="選擇地圖難度">{(Object.keys(levelMeta) as QuestLevel[]).map((item) => { const locked = isPremiumLevel(item) && !familyUnlocked; return <button key={item} role="tab" aria-selected={item === level} onClick={() => locked ? onRequestUnlock() : setLevel(item)} className={`${levelMeta[item].tone} ${level === item ? "selected" : ""}`}>{locked && <LockKeyhole className="mr-1 inline h-3.5 w-3.5" />}{levelMeta[item].label}</button>; })}</div><section className="album-book"><div className="album-book-label"><Trophy className="h-4 w-4" />我的主題字卡</div><div className="album-card-grid">{cards.map(({ topic, unlocked, fragments, words, art }, index) => { const cardKey = `${level}:${topic.id}`; const flipped = flippedCard === cardKey; const representative = words[0]; return <article key={topic.id} className={`album-topic-card ${unlocked && art ? "has-supplied-art collected" : unlocked ? "collected" : fragments > 0 ? "assembling" : "locked"}`}><div className="album-card-corner">#{String(index + 1).padStart(2, "0")}</div>{unlocked && art ? <><button onClick={() => flipCard(cardKey)} className={`album-card-flipper ${flipped ? "is-flipped" : ""}`} aria-label={flipped ? `收回${topic.label}字卡詳情` : `翻轉${topic.label}字卡查看詳情`}><span className="album-card-face album-card-front"><TopicCardSlice art={art} className="album-collected-card-image" alt={`${art.title}完整字卡`} /></span><span className="album-card-face album-card-back"><span className="album-back-icon">{topic.emoji}</span><strong>{topic.label}・{art.levelLabel}</strong><small>{topic.description}</small><em>{representative ? `代表詞：${representative.term}` : "完整主題字卡"}</em><b>已完成 5/5 片拼圖</b><i>點一下翻回卡面</i></span></button><div className="album-card-actions"><button onClick={() => flipCard(cardKey)}><RotateCcw className="h-4 w-4" />{flipped ? "翻回卡面" : "翻轉詳情"}</button><button onClick={() => setPreview({ topic, art })}><Maximize2 className="h-4 w-4" />全屏欣賞</button></div></> : unlocked ? <button onClick={() => flipCard(cardKey)} className={`album-generic-flip ${flipped ? "is-flipped" : ""}`}><span>{flipped ? <><b>{topic.label}・{levelMeta[level].label}</b><small>{topic.description}</small><em>{representative ? `代表詞：${representative.term}` : "完整字卡"}</em></> : <><i>{topic.emoji}</i><b>合成完成・{topic.label}</b><small>點擊翻轉查看詳情</small></>}</span></button> : fragments > 0 ? <><span className="album-topic-emoji assembling">{topic.emoji}</span><div className="album-topic-title"><p>正在合成</p><h1>{topic.label}</h1></div><p className="album-topic-description">已收集 {fragments}/5 塊真實拼圖；再答對 {5 - fragments} 關即可合成。</p><FragmentStrip count={fragments} emoji={topic.emoji} art={art} compact /></> : <><span className="album-lock"><LockKeyhole className="h-7 w-7" /></span><div className="album-topic-title"><p>等待收集</p><h1>神秘字卡</h1></div><p className="album-topic-description">答對「{topic.label}」第 1 關至少 4 題，開始收集拼圖。</p><FragmentStrip count={0} emoji={topic.emoji} compact /></>}</article>; })}</div></section><button onClick={onOpenMap} className="album-map-cta"><MapPinned className="h-5 w-5" />去地圖繼續收集 <ChevronRight className="h-5 w-5" /></button>{preview && <PreviewOverlay preview={preview} />}</div>;
}
