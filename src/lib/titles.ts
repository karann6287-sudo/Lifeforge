/**
 * Titles progression — pure presentation layer.
 *
 * Titles are derived entirely from existing profile stats on the frontend.
 * Nothing here touches the database, RPCs, XP, gold, or quest logic.
 * The backend remains the single source of truth for all numbers.
 */

export type TitleStat = "strength" | "intellect" | "discipline" | "wisdom";

export interface TitleTier {
  threshold: number;
  name: string;
  /** Ultimate endgame titles (500) get prestigious styling. */
  ultimate: boolean;
}

export interface EarnedTitle {
  stat: TitleStat;
  tier: TitleTier;
}

export const TITLE_LADDERS: Record<TitleStat, TitleTier[]> = {
  strength: [
    { threshold: 10, name: "Fighter", ultimate: false },
    { threshold: 25, name: "Iron Fist", ultimate: false },
    { threshold: 50, name: "Battleforged", ultimate: false },
    { threshold: 100, name: "Juggernaut", ultimate: false },
    { threshold: 250, name: "Titan", ultimate: false },
    { threshold: 500, name: "GOKU", ultimate: true },
  ],
  intellect: [
    { threshold: 10, name: "Learner", ultimate: false },
    { threshold: 25, name: "Scholar", ultimate: false },
    { threshold: 50, name: "Strategist", ultimate: false },
    { threshold: 100, name: "Mastermind", ultimate: false },
    { threshold: 250, name: "Genius", ultimate: false },
    { threshold: 500, name: "ZORO", ultimate: true },
  ],
  discipline: [
    { threshold: 10, name: "Initiate", ultimate: false },
    { threshold: 25, name: "Consistent", ultimate: false },
    { threshold: 50, name: "Iron Will", ultimate: false },
    { threshold: 100, name: "Unbreakable", ultimate: false },
    { threshold: 250, name: "Relentless", ultimate: false },
    { threshold: 500, name: "SAITAMA", ultimate: true },
  ],
  wisdom: [
    { threshold: 10, name: "Seeker", ultimate: false },
    { threshold: 25, name: "Observer", ultimate: false },
    { threshold: 50, name: "Sage", ultimate: false },
    { threshold: 100, name: "Wise One", ultimate: false },
    { threshold: 250, name: "Enlightened", ultimate: false },
    { threshold: 500, name: "L LAWLIET", ultimate: true },
  ],
};

export const TITLE_STATS: TitleStat[] = ["strength", "intellect", "discipline", "wisdom"];

export const STAT_LABELS: Record<TitleStat, { short: string; full: string }> = {
  strength: { short: "STR", full: "Strength" },
  intellect: { short: "INT", full: "Intellect" },
  discipline: { short: "DISC", full: "Discipline" },
  wisdom: { short: "WIS", full: "Wisdom" },
};

/** Highest title reached for one stat, or null below the first threshold. */
export function getTitleForStat(stat: TitleStat, value: number): EarnedTitle | null {
  let earned: TitleTier | null = null;
  for (const tier of TITLE_LADDERS[stat]) {
    if (value >= tier.threshold) earned = tier;
    else break;
  }
  return earned ? { stat, tier: earned } : null;
}

/** Highest earned title per stat (null where locked). */
export function getHighestTitles(stats: Record<TitleStat, number>): Record<TitleStat, EarnedTitle | null> {
  return {
    strength: getTitleForStat("strength", stats.strength),
    intellect: getTitleForStat("intellect", stats.intellect),
    discipline: getTitleForStat("discipline", stats.discipline),
    wisdom: getTitleForStat("wisdom", stats.wisdom),
  };
}

/** Next unearned tier for a stat, or null when the ladder is complete. */
export function getNextTitleForStat(stat: TitleStat, value: number): TitleTier | null {
  for (const tier of TITLE_LADDERS[stat]) {
    if (value < tier.threshold) return tier;
  }
  return null;
}

/**
 * Overall display title: the earned title with the highest threshold.
 * Ties resolve in stat order (strength → intellect → discipline → wisdom).
 * Null when nothing is unlocked yet.
 */
export function getOverallTitle(stats: Record<TitleStat, number>): EarnedTitle | null {
  let best: EarnedTitle | null = null;
  for (const stat of TITLE_STATS) {
    const earned = getTitleForStat(stat, stats[stat]);
    if (earned && (!best || earned.tier.threshold > best.tier.threshold)) {
      best = earned;
    }
  }
  return best;
}
