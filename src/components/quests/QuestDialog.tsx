"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface QuestDialogProps {
  open: boolean;
  title: string;
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function QuestDialog({ open, title, titleId, onClose, children }: QuestDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>(
      "input, select, textarea, button:not([data-close])"
    );
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden="true" className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border bg-card p-6 sm:p-8 shadow-2xl",
          "animate-in motion-reduce:animate-none"
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 id={titleId} className="text-2xl font-bold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            data-close
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              "rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
