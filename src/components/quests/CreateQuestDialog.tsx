"use client";

import { useState } from "react";
import type { QuestCategory, QuestDifficulty } from "@/types";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, normalizeCreateInput, validateQuestInput } from "@/lib/quests";
import { CategorySelector } from "./CategorySelector";
import { DifficultySelector } from "./DifficultySelector";
import { QuestDialog } from "./QuestDialog";
import { cn } from "@/lib/utils";

interface CreateQuestDialogProps {
  open: boolean;
  categories: QuestCategory[];
  submitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (input: { title: string; description: string; category_id: string; difficulty: QuestDifficulty }) => void;
}

export function CreateQuestDialog({
  open,
  categories,
  submitting,
  serverError,
  onClose,
  onSubmit,
}: CreateQuestDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("easy");
  const [clientError, setClientError] = useState<string | null>(null);

  // Fresh state on every mount — parent mounts this dialog only when opened.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const normalized = normalizeCreateInput({ title, description, category_id: categoryId, difficulty });
    const err = validateQuestInput(
      { ...normalized, description: normalized.description },
      categories
    );
    if (err) {
      setClientError(err);
      return;
    }
    setClientError(null);
    onSubmit({ title: normalized.title, description: normalized.description ?? "", category_id: normalized.category_id, difficulty: normalized.difficulty });
  };

  const error = clientError ?? serverError;

  return (
    <QuestDialog open={open} title="Forge a new quest" titleId="create-quest-title" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="new-quest-title" className="block text-sm font-medium text-muted-foreground mb-2">
            Deed title
          </label>
          <input
            id="new-quest-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. Morning run, read 20 pages"
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-background/50 text-foreground",
              "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none transition-all disabled:opacity-50"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? "create-quest-error" : undefined}
          />
        </div>

        <div>
          <label htmlFor="new-quest-desc" className="block text-sm font-medium text-muted-foreground mb-2">
            Details <span className="opacity-70">(optional)</span>
          </label>
          <textarea
            id="new-quest-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={3}
            placeholder="What does success look like?"
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-background/50 text-foreground",
              "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none transition-all disabled:opacity-50 resize-y"
            )}
          />
        </div>

        <CategorySelector categories={categories} value={categoryId} onChange={setCategoryId} disabled={submitting} id="new-quest-category" />
        <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={submitting} />

        {error && (
          <p id="create-quest-error" role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-input hover:bg-accent disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {submitting ? "Forging…" : "Forge quest"}
          </button>
        </div>
      </form>
    </QuestDialog>
  );
}
