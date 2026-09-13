"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * RPG-hub idle presentation for the approved adventurer artwork.
 *
 * Drop the full-body art (transparent PNG recommended) at:
 *   public/character/adventurer.png
 * and this stage picks it up with zero code changes.
 *
 * Until the art lands, the component renders nothing — no placeholder
 * character is invented. All motion is CSS-only (transform + opacity),
 * with no timers, no state churn, and no re-renders after mount.
 */

const EMBERS = [
  { left: "18%", size: 5, duration: "6.5s", delay: "0s" },
  { left: "34%", size: 4, duration: "7.5s", delay: "2.1s" },
  { left: "52%", size: 6, duration: "6s", delay: "1.2s" },
  { left: "68%", size: 4, duration: "8s", delay: "3.4s" },
  { left: "82%", size: 5, duration: "7s", delay: "0.7s" },
] as const;

interface CharacterIdleProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function CharacterIdle({
  src = "/character/adventurer.png",
  alt = "Your adventurer standing ready",
  className,
}: CharacterIdleProps) {
  const [missing, setMissing] = useState(false);

  // Artwork not provided yet — stay invisible rather than faking a character.
  if (missing) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden select-none", className)}
    >
      {/* Ambient forge glow (opacity-only pulse — cheap). */}
      <div
        className="idle-glow motion-reduce:animate-none absolute inset-x-8 bottom-0 top-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 65%, rgba(212,168,67,0.22), transparent 70%)",
        }}
      />
      {/* Weight shift (outer) + breathing (inner) — nested so transforms never fight. */}
      <div className="idle-sway motion-reduce:animate-none relative h-full w-full">
        <div className="idle-breathe motion-reduce:animate-none relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 85vw, 420px"
            className="object-contain"
            priority
            onError={() => setMissing(true)}
          />
        </div>
      </div>
      {/* Rising embers — five spans, staggered, transform + opacity only. */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="idle-ember motion-reduce:animate-none absolute bottom-6 rounded-full bg-primary"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: e.duration,
            animationDelay: e.delay,
          }}
        />
      ))}
      {/* Ground shadow anchors the figure. */}
      <div
        className="absolute inset-x-1/4 bottom-1 h-3 rounded-full bg-black/50 blur-sm"
        aria-hidden="true"
      />
    </div>
  );
}
