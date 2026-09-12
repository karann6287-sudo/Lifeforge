import type { SupabaseClient } from "@supabase/supabase-js";
import type { Item } from "@/types";

const CATALOG_SELECT =
  "id,name,description,rarity,item_type,icon,price,created_at";

/** Read-only shop catalog. Never performs purchases. */
export async function fetchShopCatalog(
  supabase: SupabaseClient
): Promise<{ items: Item[]; error: string | null }> {
  const { data, error } = await supabase
    .from("items")
    .select(CATALOG_SELECT)
    .order("price", { ascending: true });

  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as unknown as Item[], error: null };
}
