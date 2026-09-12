"use client";

import type { QuestWithCategory } from "@/types";
import { QuestCard } from "./QuestCard";

interface QuestListProps {
  quests: QuestWithCategory[];
  onStart: (id: string) => void;
  onEdit: (quest: QuestWithCategory) => void;
  onDelete: (quest: QuestWithCategory) => void;
  actionLoading: string | null;
}

function Section({
  title,
  description,
  quests,
  ...rest
}: {
  title: string;
  description: string;
  quests: QuestWithCategory[];
} & Omit<QuestListProps, "quests">) {
  if (quests.length === 0) return null;
  return (
    <section aria-label={title} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} {...rest} />
        ))}
      </div>
    </section>
  );
}

export function QuestList({ quests, onStart, onEdit, onDelete, actionLoading }: QuestListProps) {
  const handlers = { onStart, onEdit, onDelete, actionLoading };
  const active = quests.filter((q) => q.status === "active");
  const pending = quests.filter((q) => q.status === "pending");
  const done = quests.filter((q) => q.status === "completed" || q.status === "failed");

  if (quests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 sm:p-14 text-center">
        <p aria-hidden="true" className="text-5xl">🗺️</p>
        <h2 className="mt-4 text-2xl font-bold">No quests yet, adventurer</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Your real-life actions become quests here. Forge your first deed —
          a workout, a chapter read, a room tidied — and watch your legend begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Section
        title="In progress"
        description="Deeds you have begun. Finish them in real life — completion rewards arrive next milestone."
        quests={active}
        {...handlers}
      />
      <Section
        title="Ready to begin"
        description="Forged deeds waiting for you to take the first step."
        quests={pending}
        {...handlers}
      />
      <Section
        title="Chronicle"
        description="Completed and failed quests, kept for your legend."
        quests={done}
        {...handlers}
      />
    </div>
  );
}
