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

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string;
  difficulty: "trivial" | "easy" | "medium" | "hard" | "epic";
  xp_reward: number;
  gold_reward: number;
  status: "pending" | "active" | "completed" | "failed";
  streak: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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