import Link from "next/link";
import { Metadata } from "next";
import { CharacterIdle } from "@/components/CharacterIdle";

export const metadata: Metadata = {
  title: "Your real-life actions forge your character",
  description: "Turn real-life habits into RPG progression. Clear quests, earn AURA, rank up attributes, and build your character.",
};

const RITES = [
  {
    numeral: "I",
    title: "Forge the mission",
    text: "A workout, a chapter read, a room tidied — name the deed, choose its discipline and difficulty. The forge seals the reward.",
  },
  {
    numeral: "II",
    title: "Clear it in real life",
    text: "Do the thing in the physical world. Return and clear the mission to release AURA, CREDITS, and attribute growth.",
  },
  {
    numeral: "III",
    title: "Grow eternal",
    text: "Ranks compound, COMBOs streak, titles accumulate. Your character becomes a record of everything you actually did.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      {/* Opening */}
      <section
        className="relative flex min-h-[calc(100svh-180px)] items-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-forge-pattern opacity-40"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div>
            <p className="kicker">A role-playing game for your real life</p>
            <h1 id="hero-heading" className="mt-4 text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-7xl">
              REAL LIFE
              <span aria-hidden="true" className="mx-3 text-primary">↓</span>
              <span className="sm:whitespace-nowrap">MISSIONS</span>
              <span aria-hidden="true" className="mx-3 text-primary">↓</span>
              <span className="text-gradient-gold">CHARACTER</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              LIFEFORGE turns your habits into missions and your missions into a
              character. Five seconds to understand. A lifetime to master.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-block w-full max-w-xs rounded-lg bg-primary px-8 py-4 text-center text-base font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                Enter the forge
              </Link>
            </div>
          </div>
          <CharacterIdle className="mx-auto h-[400px] w-full max-w-[360px] sm:h-[520px] lg:h-[600px]" />
        </div>
      </section>

      {/* Rites */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="rites-heading">
        <div className="mx-auto max-w-4xl">
          <p className="kicker">How the world works</p>
          <h2 id="rites-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Three rites
          </h2>
          <hr className="forge-divider mt-5" aria-hidden="true" />
          <ol className="mt-2 divide-y divide-border/60">
            {RITES.map((rite) => (
              <li key={rite.numeral} className="grid gap-2 py-7 sm:grid-cols-[80px_minmax(0,1fr)] sm:gap-6">
                <p aria-hidden="true" className="text-4xl font-bold text-primary/40">
                  {rite.numeral}
                </p>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{rite.title}</h3>
                  <p className="mt-1 max-w-2xl leading-relaxed text-muted-foreground">{rite.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 border-t border-border/60 pt-8 text-center">
            <p className="text-lg text-muted-foreground">
              Difficulty sets the reward. Consistency builds the legend.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
