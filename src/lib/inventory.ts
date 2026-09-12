import type { SupabaseClient } from "@supabase/supabase-js";
import type { InventoryItem } from "@/types";

const INVENTORY_SELECT =
  "id,user_id,item_id,quantity,acquired_at,items(id,name,description,rarity,item_type,icon,price,created_at)";

/** Read the authenticated user's inventory (RLS restricts to own rows). */
export async function fetchUserInventory(
  supabase: SupabaseClient
): Promise<{ items: InventoryItem[]; error: string | null }> {
  const { data, error } = await supabase
    .from("inventory_items")
    .select(INVENTORY_SELECT)
    .order("acquired_at", { ascending: false });

  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as unknown as InventoryItem[], error: null };
}
