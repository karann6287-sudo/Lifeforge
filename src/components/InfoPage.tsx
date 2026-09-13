import Link from "next/link";
import type { ReactNode } from "react";

interface InfoPageProps {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
}

export function InfoPage({ eyebrow, title, lede, children }: InfoPageProps) {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="kicker">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{lede}</p>
        <hr className="forge-divider mt-6" aria-hidden="true" />
        <div className="mt-8 space-y-6">{children}</div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <Link
            href="/quests"
            className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Enter your quests
          </Link>
          <Link
            href="/signup"
            className="text-center text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Begin your journey →
          </Link>
        </div>
      </div>
    </div>
  );
}
