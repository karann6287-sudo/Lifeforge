export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" aria-hidden="true" />
        <p className="text-muted-foreground">Loading LIFEFORGE...</p>
      </div>
    </div>
  );
}