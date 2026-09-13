import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { fetchUserInventory } from "@/lib/inventory";
import { InventoryClient } from "@/components/inventory/InventoryClient";

export const metadata: Metadata = {
  title: "Loadout",
  description: "Your LIFEFORGE loadout — loot you truly own, with quantities sealed by the forge.",
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
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="kicker">Collection vault</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">LOADOUT</h1>
          <p className="max-w-md text-muted-foreground">
            Every relic below was earned, never given. Complete missions and
            trade in the market to grow the collection.
          </p>
        </div>
        <hr className="forge-divider mt-6" aria-hidden="true" />
        <div className="mt-8">
          <InventoryClient initialItems={items} />
        </div>
      </div>
    </div>
  );
}
