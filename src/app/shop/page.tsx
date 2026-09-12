import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchShopCatalog } from "@/lib/shop";
import { fetchUserInventory } from "@/lib/inventory";
import { InfoPage } from "@/components/InfoPage";
import { ShopClient } from "@/components/shop/ShopClient";
import type { Item } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "The LIFEFORGE emporium — spend hard-earned gold on real wares, sealed by the forge.",
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
    <InfoPage
      eyebrow="Shop"
      title={<>Spend your hard-earned gold</>}
      lede="Every price is sealed in the forge — what you see is what the database charges. Buys land straight in your pack."
    >
      <ShopClient
        initialCatalog={catalogRes.items as Item[]}
        initialGold={profileRes.data.gold as number}
        initialOwned={owned}
        catalogError={catalogRes.error ?? invRes.error}
      />
    </InfoPage>
  );
}
