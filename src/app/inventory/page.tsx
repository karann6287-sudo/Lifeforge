import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchUserInventory } from "@/lib/inventory";
import { InfoPage } from "@/components/InfoPage";
import { InventoryClient } from "@/components/inventory/InventoryClient";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Your LIFEFORGE pack — items you truly own, with quantities sealed by the forge.",
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/inventory");
  }

  const { items } = await fetchUserInventory(supabase);

  return (
    <InfoPage
      eyebrow="Inventory"
      title={<>Your pack, truly yours</>}
      lede="Everything below is read straight from your stored inventory — real ownership and quantities. Equipping, selling, and buying arrive with future milestones."
    >
      <InventoryClient initialItems={items} />
    </InfoPage>
  );
}
