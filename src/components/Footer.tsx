import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className={cn("border-t border-border/60 py-8")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.18em]">LIFEFORGE</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your real-life actions forge your character.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex items-center gap-5 text-sm">
              <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">About</Link></li>
              <li><Link href="/demo" className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Demo</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Privacy</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground/80 sm:flex-row">
          <p className="tracking-[0.18em]">LIFEFORGE</p>
          <p>&copy; {new Date().getFullYear()} · Forge a little every day.</p>
        </div>
      </div>
    </footer>
  );
}
