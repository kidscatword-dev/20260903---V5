/**
 * 繁體認字樂聲效提醒：完整字卡合成使用家長提供的 MP3；
 * 答對、過關與背景音樂保留原有流程，讀音時仍會自動降低背景音量。
 */
export const QUEST_SOUND_STORAGE_KEY = "traditional-character-map-quest-sound-v1";
export const BACKGROUND_MUSIC_STORAGE_KEY = "traditional-character-background-music-v1";

const backgroundTracks = {
  whole: "/manus-storage/whole-app-background-replacement_c63f27a0.mp3",
  game: "/manus-storage/game-map-background_c1d3c7ae.mp3",
} as const;

export const USER_CARD_AUDIO = "/manus-storage/card_5a49a3f0.mp3";

const userEffectTracks = {
  card: USER_CARD_AUDIO,
} as const;

type UserEffectTrack = keyof typeof userEffectTracks;

export type BackgroundMusicTrack = keyof typeof backgroundTracks;

let backgroundAudio: HTMLAudioElement | null = null;
let activeBackgroundTrack: BackgroundMusicTrack | null = null;
let backgroundIsDucked = false;
let backgroundRestoreTimer: number | null = null;
let backgroundFadeTimer: number | null = null;
let lastCardCompleteAt = 0;
const preloadedUserEffects: Partial<Record<UserEffectTrack, HTMLAudioElement>> = {};

const preloadUserEffects = () => {
  if (typeof window === "undefined") return;
  (Object.keys(userEffectTracks) as UserEffectTrack[]).forEach((effect) => {
    if (preloadedUserEffects[effect]) return;
    const audio = new Audio(userEffectTracks[effect]);
    audio.preload = "auto";
    audio.load();
    preloadedUserEffects[effect] = audio;
  });
};

const playUserEffect = (effect: UserEffectTrack, volume: number) => {
  if (typeof window === "undefined" || !readQuestSoundEnabled()) return;
  preloadUserEffects();
  const template = preloadedUserEffects[effect];
  const audio = template ? template.cloneNode(true) as HTMLAudioElement : new Audio(userEffectTracks[effect]);
  audio.preload = "auto";
  audio.volume = volume;
  audio.currentTime = 0;
  void audio.play().catch(() => { /* 使用者尚未有效點按時，瀏覽器會限制播放；下一次點按會自動重試。 */ });
};

if (typeof window !== "undefined") preloadUserEffects();

export const readQuestSoundEnabled = () => true;

export const readBackgroundMusicEnabled = () => {
  try { return localStorage.getItem(BACKGROUND_MUSIC_STORAGE_KEY) !== "muted"; } catch { return true; }
};

export const writeBackgroundMusicEnabled = (enabled: boolean) => {
  try { localStorage.setItem(BACKGROUND_MUSIC_STORAGE_KEY, enabled ? "on" : "muted"); } catch { /* 儲存空間不可用時只維持本次設定。 */ }
};

const backgroundVolume = () => 0.18 * (backgroundIsDucked ? 0.3 : 1);
const clearBackgroundFade = () => {
  if (backgroundFadeTimer !== null) window.clearInterval(backgroundFadeTimer);
  backgroundFadeTimer = null;
};
const fadeBackgroundTo = (target: number, duration: number, onComplete?: () => void) => {
  if (!backgroundAudio || typeof window === "undefined") return;
  clearBackgroundFade();
  const audio = backgroundAudio;
  const from = audio.volume;
  const startedAt = performance.now();
  const finish = () => { audio.volume = target; clearBackgroundFade(); onComplete?.(); };
  if (Math.abs(from - target) < 0.003 || duration <= 0) { finish(); return; }
  backgroundFadeTimer = window.setInterval(() => {
    const elapsed = Math.min(1, (performance.now() - startedAt) / duration);
    const eased = elapsed < 0.5 ? 2 * elapsed * elapsed : 1 - ((-2 * elapsed + 2) ** 2) / 2;
    audio.volume = from + (target - from) * eased;
    if (elapsed >= 1) finish();
  }, 16);
};
const setBackgroundVolume = (duration = 140) => fadeBackgroundTo(backgroundVolume(), duration);

export const startBackgroundMusic = (track: BackgroundMusicTrack) => {
  if (typeof window === "undefined") return;
  const playTrack = () => {
    if (!backgroundAudio) return;
    backgroundAudio.volume = 0;
    void backgroundAudio.play().then(() => setBackgroundVolume(420)).catch(() => { /* 瀏覽器會在下一次有效按鍵後允許播放。 */ });
  };
  if (!backgroundAudio) {
    backgroundAudio = new Audio(backgroundTracks[track]);
    backgroundAudio.loop = true;
    backgroundAudio.preload = "auto";
    activeBackgroundTrack = track;
    playTrack();
  } else if (activeBackgroundTrack !== track) {
    fadeBackgroundTo(0, 280, () => {
      if (!backgroundAudio) return;
      backgroundAudio.pause();
      backgroundAudio.src = backgroundTracks[track];
      backgroundAudio.load();
      activeBackgroundTrack = track;
      playTrack();
    });
  } else if (backgroundAudio.paused) playTrack();
  else setBackgroundVolume(180);
};

export const pauseBackgroundMusic = () => fadeBackgroundTo(0, 260, () => backgroundAudio?.pause());

export const duckBackgroundMusic = (restoreAfterMs?: number) => {
  if (!backgroundAudio) return;
  if (backgroundRestoreTimer !== null) window.clearTimeout(backgroundRestoreTimer);
  backgroundRestoreTimer = null;
  backgroundIsDucked = true;
  setBackgroundVolume(120);
  if (restoreAfterMs) backgroundRestoreTimer = window.setTimeout(() => restoreBackgroundMusic(), restoreAfterMs);
};

export const restoreBackgroundMusic = () => {
  if (backgroundRestoreTimer !== null) window.clearTimeout(backgroundRestoreTimer);
  backgroundRestoreTimer = null;
  backgroundIsDucked = false;
  setBackgroundVolume(180);
};

const playSynthNotes = (notes: Array<[number, number, number]>, peak: number, type: OscillatorType = "sine") => {
  if (typeof window === "undefined" || !readQuestSoundEnabled()) return;
  const AudioCtor = window.AudioContext;
  if (!AudioCtor) return;
  const context = new AudioCtor();
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(peak * 0.75, context.currentTime + 0.012);
  const totalDuration = Math.max(...notes.map(([, delay, duration]) => delay + duration), 0.12);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + totalDuration + 0.05);
  master.connect(context.destination);
  notes.forEach(([frequency, delay, duration]) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(1, context.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + duration + 0.03);
  });
  window.setTimeout(() => { void context.close(); }, (totalDuration + 0.22) * 1000);
};

export const playCorrectChime = () => playSynthNotes([[880, 0, 0.18], [1320, 0.11, 0.2]], 0.075);
export const playStageClearChime = () => playSynthNotes([[783.99, 0, 0.14], [987.77, 0.1, 0.16], [1174.66, 0.22, 0.22]], 0.08, "triangle");

export const playMapLandCompleteJingle = () => {
  duckBackgroundMusic(900);
  playSynthNotes([[523.25, 0, 0.16], [659.25, 0.12, 0.16], [783.99, 0.24, 0.2], [1046.5, 0.4, 0.28]], 0.08, "triangle");
};

export const playCardCompleteFanfare = () => {
  if (typeof window === "undefined" || !readQuestSoundEnabled()) return;
  const now = performance.now();
  if (now - lastCardCompleteAt < 700) return;
  lastCardCompleteAt = now;
  duckBackgroundMusic(1400);
  playUserEffect("card", 0.56);
};
