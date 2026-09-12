"use client";

import type { QuestWithCategory } from "@/types";
import { categoryIcon } from "@/lib/quests";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: QuestWithCategory;
  onStart: (id: string) => void;
  onEdit: (quest: QuestWithCategory) => void;
  onDelete: (quest: QuestWithCategory) => void;
  actionLoading: string | null;
}

function statusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
}

export function QuestCard({ quest, onStart, onEdit, onDelete, actionLoading }: QuestCardProps) {
  const busy = actionLoading === quest.id;
  const categoryName = quest.quest_categories?.name ?? "Unknown path";
  const attribute = quest.quest_categories?.attribute ?? "—";

  return (
    <article
      aria-labelledby={`quest-title-${quest.id}`}
      className={cn(
        "rounded-2xl border bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-lg",
        "transition-all duration-200 hover:border-primary/40 hover:shadow-xl",
        "motion-reduce:transition-none"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl"
          >
            {categoryIcon(categoryName)}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {categoryName} · grows {attribute}
            </p>
            <h3 id={`quest-title-${quest.id}`} className="text-lg font-bold leading-tight truncate">
              {quest.title}
            </h3>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
            quest.status === "active" && "border-green-500/40 bg-green-500/10 text-green-300",
            quest.status === "pending" && "border-primary/40 bg-primary/10 text-primary",
            quest.status === "completed" && "border-muted bg-muted text-muted-foreground",
            quest.status === "failed" && "border-destructive/40 bg-destructive/10 text-destructive"
          )}
        >
          {statusLabel(quest.status)}
        </span>
      </div>

      {quest.description && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{quest.description}</p>
      )}

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <dt className="text-muted-foreground">Difficulty:</dt>
          <dd className="font-semibold capitalize">{quest.difficulty}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="text-muted-foreground">Reward:</dt>
          <dd className="font-semibold text-primary" aria-label={`${quest.xp_reward} experience points and ${quest.gold_reward} gold`}>
            <span aria-hidden="true">✦</span> {quest.xp_reward} XP · <span aria-hidden="true">◉</span> {quest.gold_reward} gold
          </dd>
        </div>
      </dl>
      <p className="mt-1 text-xs text-muted-foreground">Rewards are forged by difficulty and category.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {quest.status === "pending" && (
          <button
            type="button"
            onClick={() => onStart(quest.id)}
            disabled={busy}
            aria-label={`Begin quest ${quest.title}`}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
          >
            {busy ? "Beginning…" : "Begin quest"}
          </button>
        )}
        {(quest.status === "pending" || quest.status === "active") && (
          <button
            type="button"
            disabled
            title="Quest completion unlocks in the next milestone"
            aria-describedby={`complete-hint-${quest.id}`}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold",
              "border border-input text-muted-foreground cursor-not-allowed opacity-70"
            )}
          >
            Complete — soon
          </button>
        )}
        <span id={`complete-hint-${quest.id}`} className="sr-only">
          Completing quests will be enabled in the next milestone. No experience is awarded yet.
        </span>
        {quest.status !== "completed" && (
          <>
            <button
              type="button"
              onClick={() => onEdit(quest)}
              disabled={busy}
              aria-label={`Edit quest ${quest.title}`}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              )}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(quest)}
              disabled={busy}
              aria-label={`Abandon quest ${quest.title}`}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "border border-destructive/30 text-destructive hover:bg-destructive/10",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              )}
            >
              {busy ? "Working…" : "Abandon"}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
