"use client";

import { xpProgressInLevel } from "@/lib/quests";
import type { UserProfile } from "@/types";

export function ProgressionHeader({ profile }: { profile: UserProfile | null }) {
  if (!profile) {
    return (
      <div
        className="rounded-2xl border bg-card/50 p-5 sm:p-6 animate-pulse"
        aria-busy="true"
        aria-label="Loading character progression"
      >
        <div className="h-6 w-40 bg-muted rounded" />
        <div className="mt-3 h-3 w-full bg-muted rounded-full" />
      </div>
    );
  }

  const progress = xpProgressInLevel(profile.xp, profile.level);
  const leveledAttrs: Array<{ name: string; value: number; icon: string }> = [
    { name: "Strength", value: profile.strength, icon: "⚔️" },
    { name: "Intellect", value: profile.intellect, icon: "📚" },
    { name: "Discipline", value: profile.discipline, icon: "🛡️" },
    { name: "Wisdom", value: profile.wisdom, icon: "🌙" },
  ];

  return (
    <section
      aria-label="Character progression"
      className="rounded-2xl border bg-card/50 backdrop-blur-sm p-5 sm:p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Character</p>
          <h2 className="text-2xl font-bold">
            Lv {profile.level} <span className="text-muted-foreground font-medium">· {profile.display_name}</span>
          </h2>
        </div>
        <div className="flex gap-2 text-sm" aria-live="polite">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary">
            <span aria-hidden="true">✦</span> {profile.xp} XP
          </span>
          <span className="rounded-full border border-input bg-background/60 px-3 py-1 font-semibold">
            <span aria-hidden="true">◉</span> {profile.gold} gold
          </span>
          <span className="rounded-full border border-input bg-background/60 px-3 py-1 font-semibold">
            <span aria-hidden="true">🔥</span> {profile.streak} streak
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>
            {progress.into} / {progress.span} XP to Lv {profile.level + 1}
          </span>
          <span>{progress.pct}%</span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Experience progress: ${progress.into} of ${progress.span} toward level ${profile.level + 1}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-yellow-300 to-primary transition-[width] duration-1000 ease-out motion-reduce:transition-none quest-xp-fill"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {leveledAttrs.map((a) => (
          <div key={a.name} className="rounded-xl border bg-background/40 px-3 py-2 text-center">
            <dt className="text-xs text-muted-foreground">
              <span aria-hidden="true">{a.icon} </span>
              {a.name}
            </dt>
            <dd className="text-lg font-bold">{a.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
