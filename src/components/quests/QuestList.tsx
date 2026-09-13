"use client";

import type { QuestWithCategory } from "@/types";
import { QuestCard } from "./QuestCard";

interface QuestListProps {
  quests: QuestWithCategory[];
  onStart: (id: string) => void;
  onComplete: (quest: QuestWithCategory) => void;
  onEdit: (quest: QuestWithCategory) => void;
  onDelete: (quest: QuestWithCategory) => void;
  actionLoading: string | null;
}

function Board({
  kicker,
  title,
  description,
  quests,
  startIndex,
  ...rest
}: {
  kicker: string;
  title: string;
  description: string;
  quests: QuestWithCategory[];
  startIndex: number;
} & Omit<QuestListProps, "quests">) {
  if (quests.length === 0) return null;
  return (
    <section aria-label={title} className="mt-10">
      <p className="kicker">{kicker}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-2 divide-y divide-border/60">
        {quests.map((q, i) => (
          <QuestCard key={q.id} quest={q} index={startIndex + i} {...rest} />
        ))}
      </div>
    </section>
  );
}

export function QuestList({ quests, onStart, onComplete, onEdit, onDelete, actionLoading }: QuestListProps) {
  const handlers = { onStart, onComplete, onEdit, onDelete, actionLoading };
  const active = quests.filter((q) => q.status === "active");
  const pending = quests.filter((q) => q.status === "pending");
  const done = quests.filter((q) => q.status === "completed" || q.status === "failed");

  if (quests.length === 0) {
    return (
      <div className="py-14 text-center">
        <p aria-hidden="true" className="text-5xl">🗺️</p>
        <h2 className="mt-4 text-2xl font-bold">The board is empty, adventurer</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Your real-life actions become missions here. Forge your first deed —
          a workout, a chapter read, a room tidied — and watch your legend begin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Board
        kicker="Underway"
        title="Active contracts"
        description="Deeds already in motion."
        quests={active}
        startIndex={0}
        {...handlers}
      />
      <Board
        kicker="Awaiting orders"
        title="Standing by"
        description="Forged deeds waiting for the first step."
        quests={pending}
        startIndex={active.length}
        {...handlers}
      />
      <Board
        kicker="Archive"
        title="Chronicle"
        description="Cleared and fallen missions, kept for your legend."
        quests={done}
        startIndex={active.length + pending.length}
        {...handlers}
      />
    </div>
  );
}
