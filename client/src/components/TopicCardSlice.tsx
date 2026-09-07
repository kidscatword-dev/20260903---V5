/**
 * 繁體認字樂字卡切片提醒：以原始三級字卡圖的左、中、右區段直接呈現各難度主卡，不修改原圖內容。
 */
import type { TopicCardArt } from "@/lib/topicCardArt";

export function TopicCardSlice({ art, className = "", alt }: { art: TopicCardArt; className?: string; alt: string }) {
  return <span className={`topic-card-slice ${art.isStandalone ? "is-standalone" : ""} ${className}`}><img src={art.src} alt={alt} style={{ transform: art.isStandalone ? "none" : `translateX(${art.offset})` }} /></span>;
}
