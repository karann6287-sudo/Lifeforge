"use client";

import { useState } from "react";
import type { QuestWithCategory } from "@/types";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from "@/lib/quests";
import { QuestDialog } from "./QuestDialog";
import { cn } from "@/lib/utils";

interface EditQuestDialogProps {
  quest: QuestWithCategory | null;
  submitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (id: string, input: { title: string; description: string }) => void;
}

export function EditQuestDialog({ quest, submitting, serverError, onClose, onSubmit }: EditQuestDialogProps) {
  // Fresh state on every mount — parent mounts this dialog only when a quest is selected.
  const [title, setTitle] = useState(quest?.title ?? "");
  const [description, setDescription] = useState(quest?.description ?? "");
  const [clientError, setClientError] = useState<string | null>(null);

  if (!quest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const t = title.trim();
    if (!t) {
      setClientError("Give your quest a title.");
      return;
    }
    if (t.length > MAX_TITLE_LENGTH) {
      setClientError(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      return;
    }
    if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      setClientError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`);
      return;
    }
    setClientError(null);
    onSubmit(quest.id, { title: t, description: description.trim() });
  };

  const error = clientError ?? serverError;

  return (
    <QuestDialog open={!!quest} title="Reshape your quest" titleId="edit-quest-title" onClose={onClose}>
      <p className="mb-4 text-xs text-muted-foreground">
        Only title and details can be reshaped. Category, difficulty, rewards and status are sealed by the forge.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="edit-quest-title" className="block text-sm font-medium text-muted-foreground mb-2">
            Deed title
          </label>
          <input
            id="edit-quest-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            maxLength={MAX_TITLE_LENGTH}
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-background/50 text-foreground",
              "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none transition-all disabled:opacity-50"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? "edit-quest-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="edit-quest-desc" className="block text-sm font-medium text-muted-foreground mb-2">
            Details
          </label>
          <textarea
            id="edit-quest-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={3}
            className={cn(
              "w-full px-4 py-3 rounded-lg border bg-background/50 text-foreground",
              "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none transition-all disabled:opacity-50 resize-y"
            )}
          />
        </div>
        {error && (
          <p id="edit-quest-error" role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
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
            {submitting ? "Reshaping…" : "Save changes"}
          </button>
        </div>
      </form>
    </QuestDialog>
  );
}
