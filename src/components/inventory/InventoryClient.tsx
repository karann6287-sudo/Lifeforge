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

function rarityStyle(rarity: string): string {
  switch (rarity) {
    case "uncommon":
      return "border-green-500/40 bg-green-500/10 text-green-300";
    case "rare":
      return "border-blue-500/40 bg-blue-500/10 text-blue-300";
    case "epic":
      return "border-purple-500/40 bg-purple-500/10 text-purple-300";
    case "legendary":
      return "border-yellow-500/40 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-input bg-background/60 text-muted-foreground";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by item type">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                filter === f.value
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-input bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {items.length} {items.length === 1 ? "item" : "items"} · {totalUnits} total
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {refreshing ? "Checking…" : "Refresh"}
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
            {items.length === 0 ? "Your pack is empty — for now" : "Nothing of this kind yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            {items.length === 0
              ? "Items you earn will appear here with their quantities. Complete quests and check back."
              : "Try a different filter — your other spoils are still here."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Owned items">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl border bg-card/60 p-5 shadow-lg transition-colors hover:border-primary/40 motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl"
                  >
                    {entry.items?.icon ?? "✨"}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold leading-tight truncate">{entry.items?.name ?? "Unknown item"}</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {entry.items?.item_type ?? "—"} · {entry.items?.rarity ?? "—"}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
                    rarityStyle(entry.items?.rarity ?? "common")
                  )}
                >
                  ×{entry.quantity}
                </span>
              </div>
              {entry.items?.description && (
                <p className="mt-3 text-sm text-muted-foreground">{entry.items.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Equipping, selling, and buying arrive with future milestones. Items shown here are your true stored ownership.
      </p>
    </div>
  );
}
