export interface UserProfile {
  id: string;
  display_name: string;
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  discipline: number;
  wisdom: number;
  streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  attribute_id: string;
  xp_multiplier: number;
  gold_multiplier: number;
}

export type QuestDifficulty = "easy" | "medium" | "hard" | "epic";
export type QuestStatus = "pending" | "active" | "completed" | "failed";

export interface QuestCategory {
  id: string;
  name: string;
  attribute: "strength" | "intellect" | "discipline" | "wisdom" | "charisma";
  xp_multiplier: number;
  gold_multiplier: number;
  created_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string;
  difficulty: QuestDifficulty;
  xp_reward: number;
  gold_reward: number;
  status: QuestStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestWithCategory extends Quest {
  quest_categories: QuestCategory | null;
}

export interface CreateQuestInput {
  title: string;
  description: string | null;
  category_id: string;
  difficulty: QuestDifficulty;
}

export interface UpdateQuestInput {
  title: string;
  description: string | null;
}

export interface CompleteQuestResult {
  success: boolean;
  xp_awarded: number;
  gold_awarded: number;
  attribute_gained: string;
  attribute_amount: number;
  previous_level: number;
  new_level: number;
  previous_xp: number;
  new_xp: number;
  new_gold: number;
  streak_at_completion: number;
  error_message: string | null;
}

export interface QuestCompletion {
  id: string;
  user_id: string;
  quest_id: string;
  xp_awarded: number;
  gold_awarded: number;
  attribute_gained: string;
  attribute_amount: number;
  previous_level: number;
  new_level: number;
  previous_xp: number;
  new_xp: number;
  streak_at_completion: number;
  completed_at: string;
  quests?: { title: string } | null;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_type: "consumable" | "equipment" | "cosmetic" | "currency";
  item_key: string;
  quantity: number;
  metadata: Record<string, unknown>;
  acquired_at: string;
}

export interface PlayerState {
  user_id: string;
  level: number;
  total_xp: number;
  current_xp: number;
  xp_to_next_level: number;
  gold: number;
  attributes: Record<string, number>;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: "item" | "gold" | "xp" | "title";
  cost: number;
  currency: "gold" | "gems";
  item_key?: string;
  metadata?: Record<string, unknown>;
}