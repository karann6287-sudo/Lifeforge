import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Interactive Demo",
  description: "Preview the LIFEFORGE adventure loop: forge a deed, begin it, and claim forge-sealed rewards.",
};

export default function DemoPage() {
  return (
    <InfoPage
      eyebrow="Demo"
      title={<>Taste the adventure loop</>}
      lede="This is a guided preview — nothing here writes to the database. Create a free account to forge real quests whose rewards are sealed by the forge."
    >
      <section aria-label="Demo quest preview" className="rounded-2xl border bg-card/60 p-5 sm:p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sample quest · preview only
        </p>
        <h2 className="mt-1 text-xl font-bold">Morning run around the park</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fitness · grows strength · Hard difficulty
        </p>
        <p className="mt-3 text-sm font-semibold text-primary" aria-label="Sample reward of 200 experience points and 50 gold">
          <span aria-hidden="true">✦</span> 200 XP · <span aria-hidden="true">◉</span> 50 gold
        </p>
        <div className="mt-2" role="progressbar" aria-valuenow={62} aria-valuemin={0} aria-valuemax={100} aria-label="Sample progress: 62 percent toward next level">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-yellow-300 to-primary" style={{ width: "62%" }} />
          </div>
        </div>
        <ol className="mt-5 space-y-2 text-sm">
          <li className="flex gap-2"><span aria-hidden="true">1️⃣</span> Forge the deed — title, category, difficulty. The forge sets the reward.</li>
          <li className="flex gap-2"><span aria-hidden="true">2️⃣</span> Begin it — the quest moves from pending to active.</li>
          <li className="flex gap-2"><span aria-hidden="true">3️⃣</span> Complete it — XP, gold, attribute, streak, and level-up arrive together.</li>
        </ol>
      </section>

      <section aria-label="Try it for real" className="rounded-2xl border border-primary/30 bg-primary/10 p-5 sm:p-6">
        <h2 className="text-xl font-bold">Ready for the real forge?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign up, forge your first Easy Fitness quest, begin it, and complete it to watch
          XP, gold, Strength, and streak update for real.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg font-semibold text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Create free account
          </Link>
          <Link
            href="/quests"
            className="px-6 py-3 rounded-lg font-medium text-center border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go to quests
          </Link>
        </div>
      </section>
    </InfoPage>
  );
}
