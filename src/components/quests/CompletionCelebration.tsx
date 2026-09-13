"use client";

import { useEffect, useRef } from "react";
import type { CompleteQuestResult } from "@/types";
import { attributeShort } from "@/lib/quests";
import { cn } from "@/lib/utils";

interface CompletionCelebrationProps {
  result: CompleteQuestResult | null;
  questTitle: string;
  ownedQuantity: number | null;
  onClose: () => void;
}

export function CompletionCelebration({ result, questTitle, ownedQuantity, onClose }: CompletionCelebrationProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!result) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [result, onClose]);

  if (!result || !result.success) return null;

  const leveledUp = result.new_level > result.previous_level;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden="true" className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-title"
        className={cn(
          "relative w-full max-w-lg px-6 py-10 text-center sm:p-12",
          "quest-reward-pop motion-reduce:animate-none"
        )}
      >
        <p className="kicker">Battle report</p>
        <h2 id="completion-title" className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
          QUEST<br />CLEARED
        </h2>
        <p className="mt-3 text-muted-foreground">{questTitle}</p>

        <hr className="forge-divider mx-auto mt-6 max-w-xs" aria-hidden="true" />

        <dl className="mx-auto mt-6 max-w-xs space-y-3 text-left" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">AURA</dt>
            <dd
              className="tabular text-4xl font-bold text-primary quest-trophy-bounce motion-reduce:animate-none"
              aria-label={`Gained ${result.xp_awarded} aura`}
            >
              +{result.xp_awarded}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">CREDITS</dt>
            <dd className="tabular text-2xl font-bold text-yellow-300">+{result.gold_awarded}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Stat increase</dt>
            <dd className="text-2xl font-bold">
              {attributeShort(result.attribute_gained)} +{result.attribute_amount}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">COMBO</dt>
            <dd className="tabular text-2xl font-bold">🔥 ×{result.streak_at_completion}</dd>
          </div>
        </dl>

        {leveledUp && (
          <div
            role="status"
            className="mx-auto mt-8 max-w-xs border-y border-primary/60 py-4 quest-level-glow motion-reduce:animate-none"
          >
            <p aria-hidden="true" className="text-4xl">👑</p>
            <p className="mt-2 text-2xl font-bold uppercase tracking-widest text-gradient-gold">
              RANK {result.previous_level} → {result.new_level}
            </p>
          </div>
        )}

        {result.item_awarded_id && (
          <div
            role="status"
            aria-label={`Loot found: ${result.item_awarded_name}, quantity ${result.item_awarded_quantity}`}
            className="mx-auto mt-6 max-w-xs"
          >
            <p className="kicker">✦ Loot found</p>
            <p className="mt-2 text-2xl font-bold">
              {result.item_awarded_name}{" "}
              <span className="tabular text-primary">×{result.item_awarded_quantity}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {ownedQuantity !== null ? (
                <>Now ×{ownedQuantity} in your loadout · </>
              ) : null}
              <a href="/inventory" className="underline hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                View loadout
              </a>
            </p>
          </div>
        )}

        <p className="tabular mt-6 text-xs text-muted-foreground" aria-live="polite">
          Total AURA {result.new_xp}
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={cn(
            "mt-8 w-full max-w-xs px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          Claim triumph
        </button>
      </div>
    </div>
  );
}
