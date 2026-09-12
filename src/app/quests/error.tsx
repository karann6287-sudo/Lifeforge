"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function QuestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Quests error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4" role="alert">
      <div className="text-center max-w-md">
        <p aria-hidden="true" className="text-5xl">🔥</p>
        <h1 className="mt-4 text-2xl font-bold">The forge flickered</h1>
        <p className="mt-2 text-muted-foreground">
          Your quests could not be summoned. Check your connection and try again.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-medium border border-input hover:bg-accent text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
