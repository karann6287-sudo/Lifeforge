"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
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

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
          {profile.display_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile.display_name}</h2>
          <p className="text-muted-foreground">Level {profile.level} Adventurer</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-primary">{profile.xp}</p>
          <p className="text-sm text-muted-foreground">XP</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{profile.gold}</p>
          <p className="text-sm text-muted-foreground">Gold</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{profile.streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold mb-4">Attributes</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <AttributeBar name="Strength" value={profile.strength} color="red" icon="⚔️" />
          <AttributeBar name="Intellect" value={profile.intellect} color="blue" icon="🧠" />
          <AttributeBar name="Discipline" value={profile.discipline} color="purple" icon="🛡️" />
          <AttributeBar name="Wisdom" value={profile.wisdom} color="green" icon="👁️" />
          <AttributeBar name="Charisma" value={0} color="pink" icon="✨" />
        </div>
      </div>
    </div>
  );
}

function AttributeBar({ name, value, color, icon }: { name: string; value: number; color: string; icon: string }) {
  const colorClasses = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClasses[color as keyof typeof colorClasses])}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name}: ${value}`}
        />
      </div>
      <span className="text-lg font-bold">{value}</span>
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
        "px-4 py-2 rounded-lg font-medium",
        "border border-destructive/20 text-destructive hover:bg-destructive/10",
        "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? "Leaving..." : "Leave the Forge"}
    </button>
  );
}