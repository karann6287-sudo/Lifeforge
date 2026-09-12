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
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-forge-pattern opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-balance">{title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{lede}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6">{children}</div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/quests"
            className="px-6 py-3 rounded-lg font-semibold text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Enter your quests
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg font-medium text-center border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Begin your journey
          </Link>
        </div>
      </div>
    </div>
  );
}
