import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { QuestsClient } from "@/components/quests/QuestsClient";
import type { QuestCategory, QuestWithCategory } from "@/types";

export const metadata: Metadata = {
  title: "Today's Adventure",
  description: "Forge real-life deeds into quests. The forge seals rewards — every triumph is earned.",
};

export default async function QuestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/quests");
  }

  const [{ data: profile }, { data: categories }, { data: quests }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase
      .from("quest_categories")
      .select("id,name,attribute,xp_multiplier,gold_multiplier,created_at")
      .order("name"),
    supabase
      .from("quests")
      .select("*, quest_categories(id,name,attribute,xp_multiplier,gold_multiplier,created_at)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <QuestsClient
            initialQuests={(quests ?? []) as QuestWithCategory[]}
            categories={(categories ?? []) as QuestCategory[]}
            displayName={profile?.display_name ?? "Adventurer"}
          />
        </div>
      </Main>
      <Footer />
    </div>
  );
}
