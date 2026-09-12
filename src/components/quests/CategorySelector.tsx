"use client";

import type { QuestCategory } from "@/types";
import { categoryIcon } from "@/lib/quests";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: QuestCategory[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  id?: string;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  disabled,
  id = "quest-category",
}: CategorySelectorProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
        Quest category
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        className={cn(
          "w-full px-4 py-3 rounded-lg border bg-background/50",
          "text-foreground",
          "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
          "focus:outline-none transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <option value="">Choose a path…</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {categoryIcon(c.name)} {c.name} — {c.attribute}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-muted-foreground">
        The category decides which attribute your legend grows.
      </p>
    </div>
  );
}
