import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50")}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight" aria-label="LIFEFORGE Home">
            LIFEFORGE
          </Link>
          <div className="hidden md:flex md:gap-6" role="navigation" aria-label="Primary">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/quests" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Quests
            </Link>
            <Link href="/inventory" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Inventory
            </Link>
            <Link href="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Shop
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Enter Forge
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Begin Journey
          </Link>
        </div>
      </nav>
    </header>
  );
}