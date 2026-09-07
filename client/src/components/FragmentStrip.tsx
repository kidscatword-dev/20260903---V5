/**
 * 繁體認字樂拼圖字卡設計提醒：五種不同輪廓的拼圖碎片對應同一陸地的五關；
 * 有提供主題卡原圖時，已取得碎片會直接顯示該卡的對應圖像區塊；未提供素材時才使用繪本紋理備援。
 */
import type { TopicCardArt } from "@/lib/topicCardArt";

const PUZZLE_PIECES = ["top-left", "top-right", "middle-left", "middle-right", "bottom"] as const;
const pieceOrigins = [{ x: "0.14rem", y: "0rem" }, { x: "3.71rem", y: "0.18rem" }, { x: "0rem", y: "3.3rem" }, { x: "3.29rem", y: "3.2rem" }, { x: "1.4rem", y: "6.5rem" }];

export function FragmentStrip({ count, label, compact = false, emoji = "🧩", art }: { count: number; label?: string; compact?: boolean; emoji?: string; art?: TopicCardArt | null }) {
  const safeCount = Math.max(0, Math.min(5, count));
  const accessibleLabel = label ?? `已收集 ${safeCount} / 5 塊字卡拼圖`;
  const canUseArt = Boolean(art) && !compact;
  const cardWidth = compact ? 4 : 7;
  const cardHeight = compact ? 5.7 : 10;
  const artStyle = canUseArt && art ? { backgroundImage: `url(${art.src})`, "--card-width": `${cardWidth}rem`, "--card-height": `${cardHeight}rem`, "--image-width": `${art.isStandalone ? cardWidth : cardWidth * 3}rem`, "--slice-offset": art.isStandalone ? "0rem" : `-${art.sliceIndex * cardWidth}rem` } as React.CSSProperties : undefined;
  return <div className={`fragment-strip ${compact ? "compact" : ""} ${canUseArt ? "has-card-art" : ""}`} aria-label={accessibleLabel}><span className="fragment-strip-label">{label ?? `拼圖 ${safeCount}/5`}</span><div className={`puzzle-card-preview ${safeCount === 5 ? "complete" : ""}`} role="img" aria-label={accessibleLabel}>{PUZZLE_PIECES.map((piece, index) => <span key={piece} className={`puzzle-piece ${piece} ${index < safeCount ? "earned" : "missing"} ${canUseArt && index < safeCount ? "has-card-art" : ""}`} style={canUseArt && index < safeCount ? { ...artStyle, "--piece-x": pieceOrigins[index].x, "--piece-y": pieceOrigins[index].y } as React.CSSProperties : undefined} aria-hidden="true" />)}{safeCount === 5 && <span className="puzzle-card-complete-mark" aria-hidden="true">{emoji}</span>}</div></div>;
}
