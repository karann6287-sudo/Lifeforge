import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your real-life actions forge your character",
  description: "Turn real-life habits into RPG progression. Complete quests, earn XP, level up attributes, and build your character.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <section className="flex-1 flex items-center justify-center px-4 py-20 sm:py-32" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-4xl text-center">
          <h1 id="hero-heading" className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">
            Your real-life actions{" "}
            <span className="text-primary">forge your character</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Turn habits into quests. Earn XP, level up attributes, collect rewards, and watch your character grow — one real action at a time.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="w-full max-w-xs px-6 py-3 text-base font-medium text-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Start Your Journey
            </Link>
            <Link
              href="/demo"
              className="w-full max-w-xs px-6 py-3 text-base font-medium text-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="features-heading" className="sr-only">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Quests from Habits</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Transform any habit into a quest. Set difficulty, category, and rewards. Complete them to earn XP and gold.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Attribute System</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Six core attributes — Strength, Intelligence, Wisdom, Dexterity, Constitution, Charisma. Each quest grows the right one.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Non-Linear Leveling</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Exponential XP curves mean early progress feels fast, mastery takes dedication. Prestige system for long-term goals.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m10-12v4m2-4h4m-4 12v4m-2-2h4m-10 4v4m0-4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Streaks & Consistency</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Daily streaks multiply rewards. Miss a day, lose the streak — but your progress remains. Consistency compounds.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Virtual Inventory</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Earn and collect items — potions, equipment, cosmetics. Trade, use, or display them on your profile.
              </p>
            </article>
            <article className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Social & Economy</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Leaderboards, guilds, trading, and a player-driven economy. Compete or cooperate — your choice.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:py-24 bg-muted/50" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to forge your character?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of players turning their daily habits into epic adventures.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="w-full max-w-xs px-6 py-3 text-base font-medium text-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Create Free Account
            </Link>
            <Link
              href="/demo"
              className="w-full max-w-xs px-6 py-3 text-base font-medium text-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try Interactive Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}