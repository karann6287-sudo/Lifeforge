"use client";

import type { Item } from "@/types";
import { cn } from "@/lib/utils";

export const MAX_PURCHASE_QUANTITY = 99;

export function clampQuantity(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_PURCHASE_QUANTITY, Math.max(1, Math.floor(n)));
}

function rarityBadge(rarity: string): { glyph: string; style: string } {
  switch (rarity) {
    case "uncommon":
      return { glyph: "◆", style: "border-green-500/40 bg-green-500/10 text-green-300" };
    case "rare":
      return { glyph: "★", style: "border-blue-500/40 bg-blue-500/10 text-blue-300" };
    case "epic":
      return { glyph: "⬢", style: "border-purple-500/40 bg-purple-500/10 text-purple-300" };
    case "legendary":
      return { glyph: "👑", style: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300" };
    default:
      return { glyph: "●", style: "border-input bg-background/60 text-muted-foreground" };
  }
}

interface ShopItemCardProps {
  item: Item;
  ownedQuantity: number;
  quantity: number;
  purchasing: boolean;
  error: string | null;
  onQuantityChange: (id: string, qty: number) => void;
  onPurchase: (id: string) => void;
}

export function ShopItemCard({
  item,
  ownedQuantity,
  quantity,
  purchasing,
  error,
  onQuantityChange,
  onPurchase,
}: ShopItemCardProps) {
  const badge = rarityBadge(item.rarity);
  // Display-only estimate; the server computes the authoritative total.
  const displayTotal = item.price * quantity;

  return (
    <article
      aria-labelledby={`shop-item-${item.id}`}
      className="rounded-2xl border bg-card/60 p-5 shadow-lg transition-colors hover:border-primary/40 motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl"
          >
            {item.icon}
          </span>
          <div className="min-w-0">
            <h3 id={`shop-item-${item.id}`} className="font-bold leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground capitalize">{item.item_type}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
            badge.style
          )}
        >
          <span aria-hidden="true">{badge.glyph} </span>
          {item.rarity}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <p className="font-semibold text-primary" aria-label={`Price ${item.price} gold each`}>
          <span aria-hidden="true">◉</span> {item.price} gold
        </p>
        <p className="text-muted-foreground" aria-live="polite">
          {ownedQuantity > 0 ? (
            <>Owned <span className="font-semibold text-foreground">×{ownedQuantity}</span></>
          ) : (
            <>Not yet owned</>
          )}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span id={`qty-label-${item.id}`} className="text-sm text-muted-foreground">
          Qty
        </span>
        <div className="flex items-center rounded-lg border border-input overflow-hidden" role="group" aria-labelledby={`qty-label-${item.id}`}>
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, quantity - 1)}
            disabled={purchasing || quantity <= 1}
            aria-label={`Decrease quantity for ${item.name}`}
            className="px-3 py-2 text-lg font-bold hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={MAX_PURCHASE_QUANTITY}
            value={quantity}
            disabled={purchasing}
            onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value, 10))}
            aria-label={`Quantity for ${item.name}, maximum ${MAX_PURCHASE_QUANTITY}`}
            className="w-14 bg-transparent text-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, quantity + 1)}
            disabled={purchasing || quantity >= MAX_PURCHASE_QUANTITY}
            aria-label={`Increase quantity for ${item.name}`}
            className="px-3 py-2 text-lg font-bold hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          >
            +
          </button>
        </div>
        <p className="ml-auto text-sm font-semibold" aria-label={`Estimated total ${displayTotal} gold`}>
          Total: <span className="text-primary">◉ {displayTotal}</span>
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => onPurchase(item.id)}
        disabled={purchasing}
        aria-label={`Purchase ${quantity} ${item.name} for about ${displayTotal} gold`}
        className={cn(
          "mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        )}
      >
        {purchasing ? "Trading…" : "Purchase"}
      </button>
    </article>
  );
}
