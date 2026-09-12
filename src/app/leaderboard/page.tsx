import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "How legends compare. Multiplayer rankings are coming soon — no rankings exist yet.",
};

export default function LeaderboardPage() {
  return (
    <InfoPage
      eyebrow="Leaderboard"
      title={<>The hall of legends is being built</>}
      lede="One day, adventurers will compare levels, streaks, and triumphs here. There is no ranking data yet — and we won't fabricate any."
    >
      <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 text-center">
        <p aria-hidden="true" className="text-5xl">🏆</p>
        <h2 className="mt-4 text-2xl font-bold">No rankings yet</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Leaderboards need real fellow adventurers and a multiplayer backend. Until then,
          your only rival is yesterday&apos;s self — check your streak on the quests page.
        </p>
      </div>
      <section aria-label="Planned boards" className="rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 className="text-xl font-bold">Planned boards</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
          <li className="rounded-xl border bg-background/40 p-4">
            <p className="font-semibold">Highest level</p>
            <p className="text-muted-foreground text-xs mt-1">Coming soon</p>
          </li>
          <li className="rounded-xl border bg-background/40 p-4">
            <p className="font-semibold">Longest streak</p>
            <p className="text-muted-foreground text-xs mt-1">Coming soon</p>
          </li>
          <li className="rounded-xl border bg-background/40 p-4">
            <p className="font-semibold">Most triumphs</p>
            <p className="text-muted-foreground text-xs mt-1">Coming soon</p>
          </li>
        </ul>
      </section>
    </InfoPage>
  );
}
