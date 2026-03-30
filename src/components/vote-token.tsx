"use client";

import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import type { VoteValue } from "@shared/types";
import { cn } from "@/lib/cn";

export function voteLabel(v: VoteValue) {
  if (v === "UNKNOWN") return "?";
  if (v === "COFFEE") return "coffee";
  return v;
}

export function VoteGlyph({
  value,
  className,
  large,
}: {
  value: VoteValue;
  className?: string;
  large?: boolean;
}) {
  const size = large ? "text-2xl" : "text-lg";
  if (value === "COFFEE") {
    return (
      <Coffee
        className={cn(size, "text-accent", className)}
        strokeWidth={2.25}
        aria-hidden
      />
    );
  }
  return (
    <span className={cn("font-display font-semibold tracking-tight", size, className)}>
      {voteLabel(value)}
    </span>
  );
}

export function VoteCardFace({
  value,
  faceUp,
  glow,
}: {
  value: VoteValue | null;
  faceUp: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className="relative h-28 w-20 sm:h-32 sm:w-24"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: faceUp ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
      >
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 bg-gradient-to-br p-2 shadow-card",
            glow
              ? "border-white ring-2 ring-white/80 dark:ring-white/50"
              : "border-ringbrand/60 dark:border-ringbrand/40",
            "from-white/90 to-surface-muted/90 dark:from-table-inner dark:to-table",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {value ? (
            <VoteGlyph value={value} large />
          ) : (
            <span className="text-ink-muted text-xs font-medium">—</span>
          )}
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/25 via-surface-muted to-table-inner shadow-inner dark:from-accent/30"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-10 w-10 rounded-xl border border-white/30 bg-white/10 dark:border-white/10" />
        </div>
      </motion.div>
    </div>
  );
}
