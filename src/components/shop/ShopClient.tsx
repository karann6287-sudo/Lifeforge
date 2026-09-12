"use client";

import { useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { fetchShopCatalog } from "@/lib/shop";
import { fetchUserInventory } from "@/lib/inventory";
import type { Item, ItemType, PurchaseResult } from "@/types";
import { QuestDialog } from "@/components/quests/QuestDialog";
import { ShopItemCard, clampQuantity } from "./ShopItemCard";
import { cn } from "@/lib/utils";

type Filter = "all" | ItemType;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All wares" },
  { value: "equipment", label: "Equipment" },
  { value: "consumable", label: "Consumable" },
  { value: "cosmetic", label: "Cosmetic" },
];

interface ShopClientProps {
  initialCatalog: Item[];
  initialGold: number;
  initialOwned: Record<string, number>;
  catalogError: string | null;
}

interface Confirmation extends PurchaseResult {
  icon: string;
}

export function ShopClient({ initialCatalog, initialGold, initialOwned, catalogError }: ShopClientProps) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Item[]>(initialCatalog);
  const [gold, setGold] = useState<number>(initialGold);
  const [owned, setOwned] = useState<Record<string, number>>(initialOwned);
  const [filter, setFilter] = useState<Filter>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string | null>>({});
  const [bannerError, setBannerError] = useState<string | null>(catalogError);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const qtyFor = useCallback((id: string): number => quantities[id] ?? 1, [quantities]);

  const handleQuantity = useCallback((id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: clampQuantity(qty) }));
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setBannerError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/shop");
        return;
      }
      const [catalogRes, invRes, profileRes] = await Promise.all([
        fetchShopCatalog(supabase),
        fetchUserInventory(supabase),
        supabase.from("profiles").select("gold").eq("id", user.id).single(),
      ]);
      if (catalogRes.error) throw new Error(catalogRes.error);
      if (invRes.error) throw new Error(invRes.error);
      if (profileRes.error || !profileRes.data) throw new Error(profileRes.error?.message ?? "Could not load your gold.");
      setCatalog(catalogRes.items);
      setGold(profileRes.data.gold as number);
      const nextOwned: Record<string, number> = {};
      for (const row of invRes.items) nextOwned[row.item_id] = row.quantity;
      setOwned(nextOwned);
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : "Could not reach the emporium. Check your connection and retry.");
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  const handlePurchase = useCallback(async (id: string) => {
    if (purchasingId) return;
    const quantity = clampQuantity(qtyFor(id));
    setPurchasingId(id);
    setCardErrors((prev) => ({ ...prev, [id]: null }));
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/shop");
        return;
      }
      // Real RPC only — the client sends ONLY item id and quantity.
      // Price, total, user, balances, and inventory are all server-derived.
      const { data, error } = await supabase.rpc("purchase_item", {
        p_item_id: id,
        p_quantity: quantity,
      });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as PurchaseResult | undefined;
      if (!row) throw new Error("The merchant gave no answer. Try again.");
      if (!row.success) {
        throw new Error(row.error_message ?? "Purchase failed.");
      }
      // Authoritative values only — Gold and owned counts come from the server.
      setGold(row.remaining_gold);
      setQuantities((prev) => ({ ...prev, [id]: 1 }));
      try {
        const inv = await fetchUserInventory(supabase);
        if (!inv.error) {
          const nextOwned: Record<string, number> = {};
          for (const entry of inv.items) nextOwned[entry.item_id] = entry.quantity;
          setOwned(nextOwned);
        }
      } catch {
        // Non-fatal: inventory page re-reads fresh on navigation.
      }
      const item = catalog.find((c) => c.id === id);
      setConfirmation({ ...row, icon: item?.icon ?? "🎁" });
    } catch (err) {
      // Gold and inventory state untouched — nothing was optimistically changed.
      setCardErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : "Purchase failed. Try again.",
      }));
    } finally {
      setPurchasingId(null);
    }
  }, [purchasingId, qtyFor, catalog, router]);

  const visible = filter === "all" ? catalog : catalog.filter((c) => c.item_type === filter);

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card/50 p-4 sm:p-5"
        aria-live="polite"
      >
        <p className="text-lg font-bold" aria-label={`Your gold balance: ${gold} gold`}>
          <span aria-hidden="true">◉</span> <span className="text-primary">{gold}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground">gold</span>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/inventory"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View pack →
          </Link>
          <button
            type="button"
            onClick={refreshAll}
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

      {bannerError && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p>{bannerError}</p>
          <button
            type="button"
            onClick={refreshAll}
            className="shrink-0 px-4 py-2 rounded-lg border border-destructive/40 font-medium hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
          >
            Retry
          </button>
        </div>
      )}

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

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 text-center">
          <p aria-hidden="true" className="text-5xl">🏪</p>
          <h2 className="mt-4 text-2xl font-bold">
            {catalog.length === 0 ? "The shelves are bare" : "Nothing of this kind"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            {catalog.length === 0
              ? "The merchant has no wares right now. Check your connection and refresh — nothing here is faked."
              : "Try a different filter — the rest of the stock is still here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2" role="list" aria-label="Shop wares">
          {visible.map((item) => (
            <div key={item.id} role="listitem">
              <ShopItemCard
                item={item}
                ownedQuantity={owned[item.id] ?? 0}
                quantity={qtyFor(item.id)}
                purchasing={purchasingId === item.id}
                error={cardErrors[item.id] ?? null}
                onQuantityChange={handleQuantity}
                onPurchase={handlePurchase}
              />
            </div>
          ))}
        </div>
      )}

      {confirmation && (
        <QuestDialog
          open
          title="Trade complete"
          titleId="purchase-confirm-title"
          onClose={() => setConfirmation(null)}
        >
          <div className="text-center" role="status">
            <p aria-hidden="true" className="text-5xl quest-trophy-bounce motion-reduce:animate-none">
              {confirmation.icon}
            </p>
            <p className="mt-3 font-bold text-lg">
              {confirmation.item_name} <span className="text-primary">×{confirmation.quantity_purchased}</span>
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border bg-background/50 p-3">
                <dt className="text-muted-foreground">Gold spent</dt>
                <dd className="font-bold text-yellow-300">◉ {confirmation.total_cost}</dd>
              </div>
              <div className="rounded-xl border bg-background/50 p-3">
                <dt className="text-muted-foreground">Remaining</dt>
                <dd className="font-bold">◉ {confirmation.remaining_gold}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Link
                href="/inventory"
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-center border border-input hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View pack
              </Link>
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Keep shopping
              </button>
            </div>
          </div>
        </QuestDialog>
      )}
    </div>
  );
}
