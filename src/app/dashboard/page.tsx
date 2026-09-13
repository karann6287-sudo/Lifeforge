import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ProfileCard, LogoutButton } from "@/components/auth/ProfileCard";
import { CharacterIdle } from "@/components/CharacterIdle";
import { TitlesSection } from "@/components/TitlesSection";
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

const GATES = [
  {
    href: "/quests",
    kicker: "Mission board",
    title: "Quests",
    text: "Missions you can clear today.",
  },
  {
    href: "/inventory",
    kicker: "Collection",
    title: "Loadout",
    text: "Loot you truly own.",
  },
  {
    href: "/shop",
    kicker: "Merchant",
    title: "Market",
    text: "Spend hard-earned CREDITS.",
  },
];

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Character command</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {profile.display_name}
            </h1>
          </div>
          <LogoutButton />
        </div>
        <hr className="forge-divider mt-6" aria-hidden="true" />

        {/* Command center: character anchor + live progression readout */}
        <section aria-label="Your character" className="relative mt-8 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-forge-pattern opacity-40"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
            <CharacterIdle className="mx-auto h-[440px] w-full max-w-[400px] sm:h-[540px] lg:h-[620px]" />
            <ProfileCard profile={profile} loading={false} />
          </div>
        </section>

        {/* Archive */}
        <section aria-labelledby="titles-heading" className="mt-14">
          <p className="kicker">Title archive</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 id="titles-heading" className="text-3xl font-bold tracking-tight">
              TITLES
            </h2>
            <p className="text-muted-foreground">Earn them. Never claim them.</p>
          </div>
          <hr className="forge-divider mt-5" aria-hidden="true" />
          <div className="mt-6">
            <TitlesSection
              stats={{
                strength: profile.strength,
                intellect: profile.intellect,
                discipline: profile.discipline,
                wisdom: profile.wisdom,
              }}
            />
          </div>
        </section>

        {/* Gates to the rest of the world */}
        <nav aria-label="Game sections" className="mt-14">
          <p className="kicker">Where to next</p>
          <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
            {GATES.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="group flex items-center gap-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-6 sm:py-5"
                >
                  <span className="kicker w-24 shrink-0 sm:w-32">{g.kicker}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-bold tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
                      {g.title}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">{g.text}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
