import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Shop",
  description: "The LIFEFORGE emporium — preview wares that will one day cost hard-earned gold. Purchases are not yet enabled.",
};

const PREVIEW_WARES = [
  { name: "Ember Potion", icon: "🧪", price: "25 gold", blurb: "A warm draft for cold mornings. Restores resolve." },
  { name: "Iron Charm", icon: "🪙", price: "60 gold", blurb: "A steadfast token. Worn by disciplined adventurers." },
  { name: "Traveler's Cloak", icon: "🧥", price: "120 gold", blurb: "Weathered and proud. For those who show up daily." },
  { name: "Star Map", icon: "🗺️", price: "200 gold", blurb: "Charts constellations of long-term goals." },
];

export default function ShopPage() {
  return (
    <InfoPage
      eyebrow="Shop"
      title={<>The emporium opens soon</>}
      lede="Spend the gold you earn from quests on potions, charms, and cosmetics. The cards below are interface previews — the economy backend does not exist yet, so nothing can be bought or stored."
    >
      <p role="note" className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
        Preview only — purchase buttons are disabled until the economy backend arrives. No gold will be spent.
      </p>
      <section aria-label="Preview wares" className="grid gap-4 sm:grid-cols-2">
        {PREVIEW_WARES.map((w) => (
          <article key={w.name} className="rounded-2xl border bg-card/60 p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {w.icon}
              </span>
              <div>
                <h2 className="font-bold">{w.name}</h2>
                <p className="text-xs text-muted-foreground">Preview ware</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{w.blurb}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="font-semibold text-primary" aria-label={`Costs ${w.price}`}>
                <span aria-hidden="true">◉</span> {w.price}
              </p>
              <button
                type="button"
                disabled
                title="Purchases unlock with the economy backend"
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-input text-muted-foreground cursor-not-allowed opacity-70"
              >
                Coming soon
              </button>
            </div>
          </article>
        ))}
      </section>
    </InfoPage>
  );
}
