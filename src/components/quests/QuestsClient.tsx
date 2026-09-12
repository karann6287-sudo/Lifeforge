"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { QuestCategory, QuestDifficulty, QuestWithCategory } from "@/types";
import { QuestList } from "./QuestList";
import { CreateQuestDialog } from "./CreateQuestDialog";
import { EditQuestDialog } from "./EditQuestDialog";
import { DeleteQuestDialog } from "./DeleteQuestDialog";
import { cn } from "@/lib/utils";

interface QuestsClientProps {
  initialQuests: QuestWithCategory[];
  categories: QuestCategory[];
  displayName: string;
}

type DialogState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; quest: QuestWithCategory }
  | { kind: "delete"; quest: QuestWithCategory };

export function QuestsClient({ initialQuests, categories, displayName }: QuestsClientProps) {
  const router = useRouter();
  const [quests, setQuests] = useState<QuestWithCategory[]>(initialQuests);
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setBannerError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/quests");
        return;
      }
      const { data, error } = await supabase
        .from("quests")
        .select("*, quest_categories(id,name,attribute,xp_multiplier,gold_multiplier,created_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setQuests((data ?? []) as QuestWithCategory[]);
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : "Could not reach the forge. Check your connection and retry.");
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  const closeDialog = useCallback(() => {
    if (submitting || actionLoading) return;
    setDialog({ kind: "none" });
    setDialogError(null);
  }, [submitting, actionLoading]);

  const handleCreate = useCallback(async (input: { title: string; description: string; category_id: string; difficulty: QuestDifficulty }) => {
    if (submitting) return;
    setSubmitting(true);
    setDialogError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/quests");
        return;
      }
      // Trusted RPC only — never inserts xp_reward / gold_reward / user_id from client.
      const { data, error } = await supabase.rpc("create_quest", {
        p_title: input.title,
        p_description: input.description ? input.description : null,
        p_category_id: input.category_id,
        p_difficulty: input.difficulty,
      });
      if (error) throw error;
      if (!data) throw new Error("The forge returned no quest. Try again.");
      await refresh();
      setDialog({ kind: "none" });
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : "Could not forge your quest.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, refresh, router]);

  const handleEditSubmit = useCallback(async (id: string, input: { title: string; description: string }) => {
    if (submitting) return;
    setSubmitting(true);
    setDialogError(null);
    try {
      const supabase = createClient();
      // Only permitted columns: title, description. Never status, rewards, category, difficulty.
      const { error } = await supabase
        .from("quests")
        .update({
          title: input.title,
          description: input.description ? input.description : null,
        })
        .eq("id", id);
      if (error) throw error;
      await refresh();
      setDialog({ kind: "none" });
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : "Could not reshape your quest.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, refresh]);

  const handleDeleteConfirm = useCallback(async (id: string) => {
    if (submitting) return;
    setSubmitting(true);
    setDialogError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("quests").delete().eq("id", id);
      if (error) throw error;
      await refresh();
      setDialog({ kind: "none" });
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : "Could not abandon your quest.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, refresh]);

  const handleStart = useCallback(async (id: string) => {
    if (actionLoading) return;
    setActionLoading(id);
    setBannerError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("start_quest", { p_quest_id: id });
      if (error) throw error;
      await refresh();
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : "Could not begin your quest.");
    } finally {
      setActionLoading(null);
    }
  }, [actionLoading, refresh]);

  const pendingCount = quests.filter((q) => q.status === "pending").length;
  const activeCount = quests.filter((q) => q.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 sm:p-8 shadow-xl overflow-hidden relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-forge-pattern opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Today&apos;s Adventure</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Your real-life actions <span className="text-gradient-gold">become quests</span>, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Forge a deed from your day — train, learn, tidy, reach out. The forge seals
            difficulty and rewards so every triumph is earned, never edited.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm" aria-live="polite">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
              {activeCount} in progress
            </span>
            <span className="rounded-full border border-input bg-background/60 px-3 py-1">
              {pendingCount} ready to begin
            </span>
            <span className="rounded-full border border-input bg-background/60 px-3 py-1">
              {quests.length} total deeds
            </span>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { setDialogError(null); setDialog({ kind: "create" }); }}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors"
              )}
            >
              ＋ Forge a quest
            </button>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className={cn(
                "px-6 py-3 rounded-lg font-medium border border-input bg-background hover:bg-accent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {refreshing ? "Consulting the forge…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {bannerError && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p>{bannerError}</p>
          <button
            type="button"
            onClick={refresh}
            className="shrink-0 px-4 py-2 rounded-lg border border-destructive/40 font-medium hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
          >
            Retry
          </button>
        </div>
      )}

      {categories.length === 0 && (
        <div role="alert" className="rounded-xl border border-input bg-card/50 p-4 text-sm text-muted-foreground">
          Quest categories are unavailable. Check your connection, then refresh.
        </div>
      )}

      <QuestList
        quests={quests}
        onStart={handleStart}
        onEdit={(q) => { setDialogError(null); setDialog({ kind: "edit", quest: q }); }}
        onDelete={(q) => { setDialogError(null); setDialog({ kind: "delete", quest: q }); }}
        actionLoading={actionLoading}
      />

      {dialog.kind === "create" && (
        <CreateQuestDialog
          open
          categories={categories}
          submitting={submitting}
          serverError={dialogError}
          onClose={closeDialog}
          onSubmit={handleCreate}
        />
      )}
      {dialog.kind === "edit" && (
        <EditQuestDialog
          key={dialog.quest.id}
          quest={dialog.quest}
          submitting={submitting}
          serverError={dialogError}
          onClose={closeDialog}
          onSubmit={handleEditSubmit}
        />
      )}
      {dialog.kind === "delete" && (
        <DeleteQuestDialog
          quest={dialog.quest}
          submitting={submitting}
          serverError={dialogError}
          onClose={closeDialog}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
