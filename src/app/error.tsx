"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4" role="alert">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm font-mono text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className={cn(
              "px-6 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            Try Again
          </button>
          <Link
            href="/"
            className={cn(
              "px-6 py-3 text-base font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}