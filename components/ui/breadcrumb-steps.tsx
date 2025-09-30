"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function BreadcrumbSteps({
  total,
  current,
  answered,
}: {
  total: number;
  current: number;
  answered: boolean[];
}) {
  const items = Array.from({ length: total }, (_, i) => i);
  return (
    <nav className="mx-auto max-w-7xl px-4 py-3" aria-label="Question progress">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((i) => {
          const isCurrent = i === current;
          const isAnswered = answered[i];
          const status = isCurrent
            ? "current"
            : isAnswered
            ? "answered"
            : "upcoming";
          return (
            <li key={i} className="flex items-center gap-2 z-10">
              <div
                className={cn(
                  "rounded-md border px-3 py-1.5",
                  status === "current" &&
                    "border-primary text-primary-foreground bg-primary",
                  status === "answered" && "border-primary/40 text-primary",
                  status === "upcoming" &&
                    "opacity-60 bg-muted/20 border-border/40"
                )}
              >
                Q{i + 1}
              </div>
              {i < items.length - 1 && (
                <ChevronRight
                  className="size-4 text-muted-foreground/70"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
