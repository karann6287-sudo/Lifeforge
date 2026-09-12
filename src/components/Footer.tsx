import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className={cn("border-t py-10")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">LIFEFORGE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your real-life actions forge your character.
            </p>
          </div>
          <nav aria-label="Product links">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/quests" className="text-muted-foreground hover:text-foreground">Quests</Link></li>
              <li><Link href="/inventory" className="text-muted-foreground hover:text-foreground">Inventory</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link></li>
              <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground">Leaderboard</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company links">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LIFEFORGE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}