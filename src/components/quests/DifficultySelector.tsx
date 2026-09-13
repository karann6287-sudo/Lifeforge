"use client";

import { QUEST_DIFFICULTIES } from "@/lib/quests";
import type { QuestDifficulty } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  value: QuestDifficulty;
  onChange: (d: QuestDifficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({ value, onChange, disabled }: DifficultySelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="block text-sm font-medium text-muted-foreground mb-2">
        Difficulty
      </legend>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Difficulty">
        {QUEST_DIFFICULTIES.map((d) => {
          const selected = value === d.value;
          return (
            <label
              key={d.value}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-2.5 text-center transition-all duration-200",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
                selected
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-input bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <input
                type="radio"
                name="quest-difficulty"
                value={d.value}
                checked={selected}
                onChange={() => onChange(d.value)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold">{d.label}</span>
              <span className="block text-xs opacity-80">{d.hint}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Harder deeds earn greater AURA and CREDITS — set by the forge, not by you.
      </p>
    </fieldset>
  );
}
