import type {
  CreateQuestInput,
  QuestDifficulty,
  QuestCategory,
} from "@/types";

export const QUEST_DIFFICULTIES: Array<{
  value: QuestDifficulty;
  label: string;
  hint: string;
}> = [
  { value: "easy", label: "Easy", hint: "Small step" },
  { value: "medium", label: "Medium", hint: "Solid effort" },
  { value: "hard", label: "Hard", hint: "Push yourself" },
  { value: "epic", label: "Epic", hint: "Legendary deed" },
];

export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 500;

export function validateQuestInput(
  input: CreateQuestInput,
  categories: QuestCategory[]
): string | null {
  const title = input.title.trim();
  if (!title) return "Give your quest a title.";
  if (title.length > MAX_TITLE_LENGTH)
    return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  if (input.description && input.description.trim().length > MAX_DESCRIPTION_LENGTH)
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  if (!categories.some((c) => c.id === input.category_id))
    return "Choose a valid quest category.";
  if (!QUEST_DIFFICULTIES.some((d) => d.value === input.difficulty))
    return "Choose a valid difficulty.";
  return null;
}

export function normalizeCreateInput(raw: {
  title: string;
  description: string;
  category_id: string;
  difficulty: QuestDifficulty;
}): CreateQuestInput {
  return {
    title: raw.title.trim(),
    description: raw.description.trim() ? raw.description.trim() : null,
    category_id: raw.category_id,
    difficulty: raw.difficulty,
  };
}

export const CATEGORY_ICONS: Record<string, string> = {
  Fitness: "⚔️",
  Learning: "📚",
  Productivity: "🛡️",
  Mindfulness: "🌙",
  Social: "🤝",
};

export function categoryIcon(name: string): string {
  return CATEGORY_ICONS[name] ?? "✨";
}

/**
 * Display shorthand for category attribute names.
 * Database/API values stay untouched — this is presentation only.
 */
export function attributeShort(name: string): string {
  switch (name.toLowerCase()) {
    case "strength":
      return "STR";
    case "intellect":
      return "INT";
    case "discipline":
      return "DISC";
    case "wisdom":
      return "WIS";
    default:
      return name.toUpperCase();
  }
}

export function difficultyRank(d: QuestDifficulty): number {
  switch (d) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    case "epic":
      return 4;
  }
}

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Deterministic UTC date formatter for completion timestamps.
 * Avoids `toLocaleDateString()` (locale-dependent SSR/client mismatch).
 * Uses UTC parts so the displayed calendar date never shifts with the
 * viewer's timezone. Output: "Sep 13, 2026".
 */
export function formatCompletionDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const month = SHORT_MONTHS[d.getUTCMonth()] ?? "";
  return `${month} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Non-linear leveling, mirrors SQL: threshold to advance from L to L+1.
export function xpThresholdForLevelUp(level: number): number {
  return Math.floor(100 * Math.pow(Math.max(1, level), 1.5));
}

export function xpBaseForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

export function xpProgressInLevel(xp: number, level: number): {
  base: number;
  next: number;
  into: number;
  span: number;
  pct: number;
} {
  const base = xpBaseForLevel(level);
  const next = xpThresholdForLevelUp(level);
  const into = Math.max(0, xp - base);
  const span = Math.max(1, next - base);
  return { base, next, into, span, pct: Math.min(100, Math.round((into / span) * 100)) };
}
