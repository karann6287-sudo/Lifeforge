import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "About",
  description: "What LIFEFORGE is: real-life actions become quests, quests grant XP and gold, and your character grows.",
};

const STEPS = [
  { icon: "🗺️", title: "Real life becomes quests", text: "A workout, a chapter read, a tidy room — each becomes a deed with a category and difficulty you choose." },
  { icon: "✦", title: "Quests grant XP and gold", text: "Rewards are sealed by the forge from difficulty and category. Nothing is hand-editable, so every gain is earned." },
  { icon: "📊", title: "Attributes grow", text: "Fitness feeds Strength, learning feeds Intellect, focus feeds Discipline, reflection feeds Wisdom." },
  { icon: "🔥", title: "Streaks compound", text: "Show up daily to build a streak. Miss a day and the streak resets — your XP and levels stay." },
  { icon: "👑", title: "Levels mark mastery", text: "A non-linear curve means early progress feels fast and true mastery takes dedication." },
];

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title={<>Your real-life actions forge your character</>}
      lede="LIFEFORGE turns habits into a role-playing game. Instead of checking off todos, you complete quests — and your character levels up with you."
    >
      <section aria-label="How it works" className="grid gap-4 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <article key={s.title} className="rounded-2xl border bg-card/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {i + 1}</p>
            <h2 className="mt-1 font-bold">
              <span aria-hidden="true">{s.icon} </span>
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </section>
      <section aria-label="Project stage" className="rounded-2xl border bg-card/50 p-5 sm:p-6">
        <h2 className="text-xl font-bold">Built in the open</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          LIFEFORGE is a hackathon-stage project: quests, progression, streaks, and history work today,
          while inventory, shop, and leaderboards are still on the roadmap. What you see is what the forge can do.
        </p>
      </section>
    </InfoPage>
  );
}
