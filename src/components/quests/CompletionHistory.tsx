"use client";

import { formatCompletionDate } from "@/lib/quests";
import type { QuestCompletion } from "@/types";

export function CompletionHistory({ completions }: { completions: QuestCompletion[] }) {
  if (completions.length === 0) return null;
  return (
    <section aria-label="Recent triumphs" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Recent triumphs</h2>
        <p className="text-sm text-muted-foreground">
          Sealed by the forge — read-only history of what you earned.
        </p>
      </div>
      <ol className="space-y-2">
        {completions.slice(0, 8).map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card/50 px-4 py-3 text-sm"
          >
            <div className="min-w-0">
              <p className="font-semibold truncate">{c.quests?.title ?? "Quest"}</p>
              <p className="text-xs text-muted-foreground">
                {formatCompletionDate(c.completed_at)} · {c.attribute_gained} +{c.attribute_amount}
                {c.new_level > c.previous_level && (
                  <span className="font-semibold text-primary"> · Lv {c.previous_level} → {c.new_level}</span>
                )}
              </p>
            </div>
            <p className="font-semibold text-primary shrink-0" aria-label={`Earned ${c.xp_awarded} experience and ${c.gold_awarded} gold`}>
              +{c.xp_awarded} XP · +{c.gold_awarded} gold
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
