import {
  STAT_LABELS,
  TITLE_LADDERS,
  TITLE_STATS,
  getHighestTitles,
  getNextTitleForStat,
} from "@/lib/titles";
import type { TitleStat } from "@/lib/titles";
import { cn } from "@/lib/utils";

interface TitlesSectionProps {
  stats: Record<TitleStat, number>;
}

export function TitlesSection({ stats }: TitlesSectionProps) {
  const highest = getHighestTitles(stats);

  return (
    <div>
      <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {TITLE_STATS.map((stat) => {
          const value = stats[stat];
          const earned = highest[stat];
          const next = getNextTitleForStat(stat, value);
          const labels = STAT_LABELS[stat];
          return (
            <li
              key={stat}
              aria-label={`${labels.full} ${value}: ${
                earned ? `current title ${earned.tier.name}` : "untitled"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {labels.short} · <span className="tabular">{value}</span>
                  <span className="sr-only"> ({labels.full})</span>
                </p>
                <p
                  className={cn(
                    "text-xl font-bold uppercase tracking-wide",
                    earned
                      ? earned.tier.ultimate
                        ? "text-gradient-gold"
                        : "text-primary"
                      : "text-muted-foreground/60"
                  )}
                >
                  {earned ? earned.tier.name : "Untitled"}
                </p>
              </div>
              <ol className="mt-3 border-l-2 border-border/60">
                {TITLE_LADDERS[stat].map((tier) => {
                  const isEarned = value >= tier.threshold;
                  const isCurrent =
                    earned !== null &&
                    earned.tier.threshold === tier.threshold;
                  return (
                    <li
                      key={tier.threshold}
                      className={cn(
                        "relative flex items-center gap-3 py-2 pl-5",
                        isCurrent && "-ml-px border-l-2 border-primary pl-[18px]"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-1/2 -left-[5px] h-2 w-2 -translate-y-1/2 rounded-full",
                          isCurrent
                            ? "bg-primary"
                            : isEarned
                              ? "bg-muted-foreground"
                              : "border border-muted-foreground/50 bg-transparent"
                        )}
                      />
                      <span className="sr-only">
                        {isCurrent ? "Current title: " : isEarned ? "Earned: " : "Locked: "}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate font-semibold uppercase tracking-wide",
                          tier.ultimate
                            ? "text-gradient-gold"
                            : isCurrent
                              ? "text-primary"
                              : !isEarned
                                ? "font-medium text-muted-foreground/80"
                                : "text-foreground/90"
                        )}
                      >
                        {tier.ultimate && (
                          <span aria-hidden="true">✦ </span>
                        )}
                        {tier.name}
                      </span>
                      <span className="tabular shrink-0 text-sm text-muted-foreground">
                        {tier.threshold}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-2 pl-5 text-xs text-muted-foreground">
                {next ? (
                  <>
                    Next: {next.name} at {next.threshold}
                  </>
                ) : (
                  <>Ladder complete — legend</>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
