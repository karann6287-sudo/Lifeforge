"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "/inventory", label: "Loadout" },
  { href: "/shop", label: "Market" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="LIFEFORGE Home"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary">
              <path
                d="M12 2c1 3-2 4.5-2 7a4.5 4.5 0 0 0 9 .5C19 6 14.5 4.5 12 2Zm0 20a6.5 6.5 0 0 1-6.5-6.5c0-2 1-3.8 2.4-5.2C9 12 10 13 10 14.5a2.5 2.5 0 0 0 5 .5c1.2-.7 2-2 2-3.7 2 1.6 3.5 4 3.5 6.7A6.5 6.5 0 0 1 12 22Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-lg font-bold tracking-[0.12em]">LIFEFORGE</span>
          </Link>
          <ul className="hidden md:flex md:items-center md:gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-foreground text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Enter Forge
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Begin Journey
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-input p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-border/70 px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-base font-medium",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-input px-4 py-2.5 text-center text-sm font-medium text-muted-foreground"
            >
              Enter Forge
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Begin Journey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
