import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchShopCatalog } from "@/lib/shop";
import { fetchUserInventory } from "@/lib/inventory";
import { ShopClient } from "@/components/shop/ShopClient";
import type { Item } from "@/types";

export const metadata: Metadata = {
  title: "Market",
  description: "The LIFEFORGE market — spend hard-earned CREDITS on real wares, sealed by the forge.",
};

export default async function ShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/shop");
  }

  const [profileRes, catalogRes, invRes] = await Promise.all([
    supabase.from("profiles").select("gold").eq("id", user.id).single(),
    fetchShopCatalog(supabase),
    fetchUserInventory(supabase),
  ]);

  if (!profileRes.data) {
    redirect("/login?redirect=/shop");
  }

  const owned: Record<string, number> = {};
  for (const row of invRes.items) owned[row.item_id] = row.quantity;

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="kicker">Merchant quarter</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">MARKET</h1>
          <p className="max-w-md text-muted-foreground">
            Relics, tonics, and banners — every price sealed in the forge.
            What you buy lands straight in your loadout.
          </p>
        </div>
        <hr className="forge-divider mt-6" aria-hidden="true" />
        <div className="mt-8">
          <ShopClient
            initialCatalog={catalogRes.items as Item[]}
            initialGold={profileRes.data.gold as number}
            initialOwned={owned}
            catalogError={catalogRes.error ?? invRes.error}
          />
        </div>
      </div>
    </div>
  );
}
