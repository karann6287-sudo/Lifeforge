"use client";

import { useEffect, useRef } from "react";
import type { CompleteQuestResult } from "@/types";
import { cn } from "@/lib/utils";

interface CompletionCelebrationProps {
  result: CompleteQuestResult | null;
  questTitle: string;
  onClose: () => void;
}

export function CompletionCelebration({ result, questTitle, onClose }: CompletionCelebrationProps) {
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden="true" className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-title"
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-primary/40 bg-card p-6 sm:p-8 shadow-2xl text-center",
          "quest-reward-pop motion-reduce:animate-none"
        )}
      >
        <p aria-hidden="true" className="text-5xl quest-trophy-bounce motion-reduce:animate-none">
          {leveledUp ? "👑" : "⚔️"}
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Quest complete
        </p>
        <h2 id="completion-title" className="mt-1 text-2xl font-bold">
          {questTitle}
        </h2>

        {leveledUp && (
          <p
            role="status"
            className="mx-auto mt-3 inline-block rounded-full border border-primary bg-primary/15 px-4 py-1.5 font-bold text-primary quest-level-glow motion-reduce:animate-none"
          >
            ✨ LEVEL UP — Lv {result.previous_level} → Lv {result.new_level} ✨
          </p>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border bg-background/50 p-3">
            <dt className="text-xs text-muted-foreground">XP gained</dt>
            <dd className="text-xl font-bold text-primary">+{result.xp_awarded}</dd>
          </div>
          <div className="rounded-xl border bg-background/50 p-3">
            <dt className="text-xs text-muted-foreground">Gold gained</dt>
            <dd className="text-xl font-bold text-yellow-300">+{result.gold_awarded}</dd>
          </div>
          <div className="rounded-xl border bg-background/50 p-3">
            <dt className="text-xs text-muted-foreground capitalize">{result.attribute_gained}</dt>
            <dd className="text-xl font-bold">+{result.attribute_amount}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          Streak: <span className="font-semibold text-foreground">{result.streak_at_completion} day{result.streak_at_completion === 1 ? "" : "s"}</span>
          {" · "}Total XP: <span className="font-semibold text-foreground">{result.new_xp}</span>
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={cn(
            "mt-6 w-full px-6 py-3 rounded-lg font-semibold",
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
