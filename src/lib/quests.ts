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
