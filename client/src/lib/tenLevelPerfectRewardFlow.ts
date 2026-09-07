export type PerfectRewardNextView = "challenge" | "land" | "assembly";

export const getPerfectRewardNextView = (stage: number, completesMap: boolean): PerfectRewardNextView => {
  if (completesMap) return "assembly";
  return stage < 5 ? "challenge" : "land";
};
