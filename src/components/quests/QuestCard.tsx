"use client";

import type { QuestWithCategory } from "@/types";
import { attributeShort } from "@/lib/quests";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: QuestWithCategory;
  index: number;
  onStart: (id: string) => void;
  onComplete: (quest: QuestWithCategory) => void;
  onEdit: (quest: QuestWithCategory) => void;
  onDelete: (quest: QuestWithCategory) => void;
  actionLoading: string | null;
}

function statusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Underway";
    case "completed":
      return "Cleared";
    case "failed":
      return "Failed";
    default:
      return "Standing by";
  }
}

export function QuestCard({ quest, index, onStart, onComplete, onEdit, onDelete, actionLoading }: QuestCardProps) {
  const busy = actionLoading === quest.id;
  const categoryName = quest.quest_categories?.name ?? "Unknown path";
  const attribute = quest.quest_categories?.attribute ?? "—";
  const archived = quest.status === "completed" || quest.status === "failed";
  const number = `MISSION ${String(index + 1).padStart(2, "0")}`;

  return (
    <article
      aria-labelledby={`quest-title-${quest.id}`}
      className={cn(
        "group relative py-5",
        archived && "opacity-80"
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="kicker">{number}</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {statusLabel(quest.status)}
          <span aria-hidden="true" className="mx-2 text-muted-foreground/40">·</span>
          <span className="capitalize">{quest.difficulty}</span>
        </p>
      </div>

      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <h3 id={`quest-title-${quest.id}`} className="text-2xl font-bold tracking-tight">
          {quest.title}
        </h3>
        <p
          className="tabular whitespace-nowrap text-base font-bold"
          aria-label={`${quest.xp_reward} aura and ${quest.gold_reward} credits`}
        >
          <span className="text-primary">+{quest.xp_reward} AURA</span>
          <span aria-hidden="true" className="mx-1.5 text-muted-foreground/50">·</span>
          <span className="text-yellow-300">+{quest.gold_reward}</span>
        </p>
      </div>

      {quest.description && (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{quest.description}</p>
      )}

      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {categoryName} → {attributeShort(attribute)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {quest.status === "pending" && (
          <button
            type="button"
            onClick={() => onStart(quest.id)}
            disabled={busy}
            aria-label={`Begin quest ${quest.title}`}
            className="text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {busy ? "Mustering…" : "Begin →"}
          </button>
        )}
        {(quest.status === "pending" || quest.status === "active") && (
          <button
            type="button"
            onClick={() => onComplete(quest)}
            disabled={busy}
            aria-label={`Clear quest ${quest.title} and claim forge-sealed rewards`}
            className={cn(
              "rounded-lg bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-primary-foreground",
              "hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
          >
            {busy ? "Clearing…" : "Clear mission →"}
          </button>
        )}
        {!archived && (
          <span className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => onEdit(quest)}
              disabled={busy}
              aria-label={`Edit quest ${quest.title}`}
              className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Amend
            </button>
            <button
              type="button"
              onClick={() => onDelete(quest)}
              disabled={busy}
              aria-label={`Abandon quest ${quest.title}`}
              className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-destructive disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-sm"
            >
              {busy ? "Working…" : "Abandon"}
            </button>
          </span>
        )}
        {archived && (
          <p className="text-sm text-muted-foreground">Sealed in your chronicle.</p>
        )}
      </div>
    </article>
  );
}
