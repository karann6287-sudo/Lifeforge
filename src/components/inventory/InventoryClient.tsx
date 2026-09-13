"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { fetchUserInventory } from "@/lib/inventory";
import type { InventoryItem, ItemType } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ItemType;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "equipment", label: "Equipment" },
  { value: "consumable", label: "Consumable" },
  { value: "cosmetic", label: "Cosmetic" },
];

function rarityEdge(rarity: string): string {
  switch (rarity) {
    case "uncommon":
      return "border-l-green-500/60";
    case "rare":
      return "border-l-blue-500/60";
    case "epic":
      return "border-l-purple-500/60";
    case "legendary":
      return "border-l-yellow-500/60";
    default:
      return "border-l-border";
  }
}

export function InventoryClient({ initialItems }: { initialItems: InventoryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/inventory");
        return;
      }
      const { items: rows, error: fetchError } = await fetchUserInventory(supabase);
      if (fetchError) throw new Error(fetchError);
      setItems(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the forge. Check your connection and retry.");
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  const visible = filter === "all" ? items : items.filter((i) => i.items?.item_type === filter);
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter by loot type">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "pb-1 text-sm font-semibold uppercase tracking-widest transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                filter === f.value
                  ? "text-primary underline decoration-primary underline-offset-8"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-baseline gap-4">
          <p className="tabular text-sm text-muted-foreground" aria-live="polite">
            {items.length} loot · {totalUnits} held
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className={cn(
              "text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            )}
          >
            {refreshing ? "Checking…" : "Recheck vault"}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p>{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="shrink-0 px-4 py-2 rounded-lg border border-destructive/40 font-medium hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
          >
            Retry
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 sm:p-14 text-center">
          <p aria-hidden="true" className="text-5xl">🎒</p>
          <h2 className="mt-4 text-2xl font-bold">
            {items.length === 0 ? "Your loadout is empty — for now" : "Nothing of this kind yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            {items.length === 0
              ? "Loot you earn will appear here with its quantities. Clear quests and check back."
              : "Try a different filter — your other spoils are still here."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Owned loot">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                "rounded-2xl border border-border/60 border-l-2 bg-card/40 p-5 pl-6 shadow-lg backdrop-blur-sm",
                "transition-colors hover:border-primary/40 hover:bg-card/60 motion-reduce:transition-none",
                rarityEdge(entry.items?.rarity ?? "common")
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold leading-tight">
                    <span aria-hidden="true">{entry.items?.icon ?? "✨"} </span>
                    {entry.items?.name ?? "Unknown item"}
                  </h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                    {entry.items?.item_type ?? "—"} · {entry.items?.rarity ?? "—"}
                  </p>
                </div>
                <p className="tabular shrink-0 text-lg font-bold text-primary">
                  ×{entry.quantity}
                  <span className="sr-only"> owned</span>
                </p>
              </div>
              {entry.items?.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.items.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Equipping, selling, and buying arrive with future milestones. Loot shown here is your true stored ownership.
      </p>
    </div>
  );
}
