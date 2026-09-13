"use client";

import type { Item } from "@/types";
import { cn } from "@/lib/utils";

export const MAX_PURCHASE_QUANTITY = 99;

export function clampQuantity(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_PURCHASE_QUANTITY, Math.max(1, Math.floor(n)));
}

function rarityBadge(rarity: string): { glyph: string; style: string; edge: string } {
  switch (rarity) {
    case "uncommon":
      return { glyph: "◆", style: "text-green-300", edge: "border-l-green-500/60" };
    case "rare":
      return { glyph: "★", style: "text-blue-300", edge: "border-l-blue-500/60" };
    case "epic":
      return { glyph: "⬢", style: "text-purple-300", edge: "border-l-purple-500/60" };
    case "legendary":
      return { glyph: "👑", style: "text-yellow-300", edge: "border-l-yellow-500/60" };
    default:
      return { glyph: "●", style: "text-muted-foreground", edge: "border-l-border" };
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
      className={cn(
        "rounded-2xl border border-border/60 border-l-2 bg-card/40 p-5 pl-6 shadow-lg backdrop-blur-sm",
        "transition-colors hover:border-primary/40 hover:bg-card/60 motion-reduce:transition-none",
        badge.edge
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("kicker !text-[0.65rem]", badge.style)}>
            <span aria-hidden="true">{badge.glyph} </span>
            {item.rarity} · {item.item_type}
          </p>
          <h3 id={`shop-item-${item.id}`} className="mt-1 flex items-center gap-2 text-lg font-bold leading-tight">
            <span aria-hidden="true" className="text-2xl">{item.icon}</span>
            {item.name}
          </h3>
        </div>
        <p className="shrink-0 text-right font-semibold text-primary" aria-label={`Price ${item.price} credits each`}>
          <span aria-hidden="true">◉</span> {item.price}
          <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">Credits</span>
        </p>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

      <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
        {ownedQuantity > 0 ? (
          <>Owned <span className="tabular font-semibold text-foreground">×{ownedQuantity}</span></>
        ) : (
          <>Not yet owned</>
        )}
      </p>

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
        <p className="ml-auto text-sm font-semibold" aria-label={`Estimated total ${displayTotal} credits`}>
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
        aria-label={`Purchase ${quantity} ${item.name} for about ${displayTotal} credits`}
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
