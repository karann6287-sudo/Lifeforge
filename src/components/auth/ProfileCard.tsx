"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getOverallTitle } from "@/lib/titles";
import { xpProgressInLevel } from "@/lib/quests";
import { UserProfile } from "@/types";

interface ProfileCardProps {
  profile: UserProfile | null;
  loading: boolean;
}

export function ProfileCard({ profile, loading }: ProfileCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading profile">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded-full" />
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No profile found.</p>
      </div>
    );
  }

  const overall = getOverallTitle({
    strength: profile.strength,
    intellect: profile.intellect,
    discipline: profile.discipline,
    wisdom: profile.wisdom,
  });
  const progress = xpProgressInLevel(profile.xp, profile.level);

  return (
    <div className="animate-in">
      {overall ? (
        <p
          aria-label={`Displayed title: ${overall.tier.name}`}
          className={cn(
            "text-lg font-bold uppercase tracking-[0.18em]",
            overall.tier.ultimate ? "text-gradient-gold" : "text-primary"
          )}
        >
          {overall.tier.ultimate && <span aria-hidden="true">✦ </span>}
          {overall.tier.name}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground/70">Untitled — reach 10 in any attribute</p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        RANK <span className="tabular text-4xl font-bold tracking-tight text-foreground">{profile.level}</span>
      </p>

      {/* AURA gauge */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="kicker">AURA</p>
          <p className="tabular text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{progress.into}</span> / {progress.span} to RANK {profile.level + 1}
          </p>
        </div>
        <div
          className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Aura progress: ${progress.into} of ${progress.span} toward rank ${profile.level + 1}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-yellow-300 to-primary transition-[width] duration-1000 ease-out motion-reduce:transition-none quest-xp-fill"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="tabular mt-2 text-sm text-muted-foreground">
          Total AURA <span className="font-bold text-foreground">{profile.xp}</span>
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-6" aria-live="polite">
        <div className="border-l-2 border-yellow-500/50 pl-4">
          <dt className="kicker">Credits</dt>
          <dd className="tabular mt-1 text-3xl font-bold">◉ {profile.gold}</dd>
        </div>
        <div className="border-l-2 border-orange-500/50 pl-4">
          <dt className="kicker">Combo</dt>
          <dd className="tabular mt-1 text-3xl font-bold">🔥 {profile.streak}</dd>
        </div>
      </dl>

      <hr className="forge-divider my-6" aria-hidden="true" />

      {/* Attributes */}
      <h3 className="kicker">Attributes</h3>
      <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <AttributeRow abbr="STR" full="Strength" value={profile.strength} bar="bg-red-500" />
        <AttributeRow abbr="INT" full="Intellect" value={profile.intellect} bar="bg-blue-500" />
        <AttributeRow abbr="DISC" full="Discipline" value={profile.discipline} bar="bg-purple-500" />
        <AttributeRow abbr="WIS" full="Wisdom" value={profile.wisdom} bar="bg-green-500" />
        <AttributeRow abbr="CHA" full="Charisma" value={0} bar="bg-pink-500" />
      </div>
    </div>
  );
}

function AttributeRow({
  abbr,
  full,
  value,
  bar,
}: {
  abbr: string;
  full: string;
  value: number;
  bar: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold tracking-widest">
          {abbr} <span className="font-medium normal-case tracking-normal text-muted-foreground">{full}</span>
        </p>
        <p className="tabular text-xl font-bold">{value}</p>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${full}: ${value}`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", bar)}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium",
        "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        "transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? "Leaving..." : "Leave the Forge"}
    </button>
  );
}
