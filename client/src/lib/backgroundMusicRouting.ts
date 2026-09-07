import type { BackgroundMusicTrack } from "./rewardAudio";

export function getBackgroundTrackFor(screen: string, mapMusicActive: boolean, practiceMusicActive: boolean, activeWordGame?: string): BackgroundMusicTrack | null {
  if (screen === "home" || screen === "category" || (screen === "level" && practiceMusicActive)) return "whole";
  if (screen === "gameHub" || (screen === "gameMode" && mapMusicActive) || (screen === "wordGame" && activeWordGame === "match")) return "game";
  return null;
}
