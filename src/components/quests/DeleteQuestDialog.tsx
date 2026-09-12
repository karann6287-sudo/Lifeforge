"use client";

import type { QuestWithCategory } from "@/types";
import { QuestDialog } from "./QuestDialog";
import { cn } from "@/lib/utils";

interface DeleteQuestDialogProps {
  quest: QuestWithCategory | null;
  submitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteQuestDialog({ quest, submitting, serverError, onClose, onConfirm }: DeleteQuestDialogProps) {
  if (!quest) return null;
  return (
    <QuestDialog open={!!quest} title="Abandon this quest?" titleId="delete-quest-title" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">“{quest.title}”</span> will leave your
        adventure chronicle. This cannot be undone.
      </p>
      {serverError && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-sm font-medium border border-input hover:bg-accent disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Keep quest
        </button>
        <button
          type="button"
          onClick={() => onConfirm(quest.id)}
          disabled={submitting}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
          )}
        >
          {submitting ? "Abandoning…" : "Yes, abandon"}
        </button>
      </div>
    </QuestDialog>
  );
}
