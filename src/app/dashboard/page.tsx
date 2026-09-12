import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ProfileCard, LogoutButton } from "@/components/auth/ProfileCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { UserProfile } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your LIFEFORGE character dashboard.",
};

async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
}

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Your adventure awaits, {profile.display_name}</p>
            </div>
            <LogoutButton />
          </div>

          <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
            <ProfileCard profile={profile} loading={false} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/quests" className="group rounded-xl border bg-card/50 p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Quests</h3>
              </div>
              <p className="text-sm text-muted-foreground">Create and complete habit quests</p>
            </Link>
            <Link href="/inventory" className="group rounded-xl border bg-card/50 p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Inventory</h3>
              </div>
              <p className="text-sm text-muted-foreground">View your items and equipment</p>
            </Link>
            <Link href="/shop" className="group rounded-xl border bg-card/50 p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Shop</h3>
              </div>
              <p className="text-sm text-muted-foreground">Spend your hard-earned gold</p>
            </Link>
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}