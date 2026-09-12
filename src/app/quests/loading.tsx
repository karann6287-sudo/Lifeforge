export default function QuestsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading quests">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary motion-reduce:animate-none" aria-hidden="true" />
        <p className="text-muted-foreground">Consulting the forge…</p>
      </div>
    </div>
  );
}
