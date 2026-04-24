"use client";

import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import type { VoteValue } from "@shared/types";
import { cn } from "@/lib/cn";

export function voteLabel(v: VoteValue) {
  if (v === "UNKNOWN") return "?";
  if (v === "COFFEE") return "café";
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
  const size = large ? "text-3xl" : "text-lg";
  if (value === "COFFEE") {
    return (
      <Coffee
        className={cn(large ? "h-7 w-7" : "h-4 w-4", className)}
        strokeWidth={2.25}
        aria-hidden
      />
    );
  }
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tighter leading-none",
        size,
        className,
      )}
    >
      {voteLabel(value)}
    </span>
  );
}

interface CardFaceProps {
  value: VoteValue | null;
  faceUp: boolean;
  glow?: boolean;
  pending?: boolean;
}

export function VoteCardFace({ value, faceUp, glow, pending }: CardFaceProps) {
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
            "absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-surface-elevated p-2 transition-shadow",
            glow
              ? "border-accent shadow-glow"
              : "border-border shadow-soft",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {value ? (
            <VoteGlyph value={value} large />
          ) : (
            <span className="text-xs font-medium text-ink-faint">—</span>
          )}
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-xl border bg-ink shadow-soft",
            pending ? "border-ink ring-2 ring-accent/40" : "border-ink/80",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardBackPattern />
        </div>
      </motion.div>
    </div>
  );
}

function CardBackPattern() {
  return (
    <div className="flex h-12 w-9 flex-col items-center justify-center gap-1 rounded-md border border-surface/15">
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-surface/70">
        pp
      </span>
      <span className="h-px w-4 bg-surface/30" />
    </div>
  );
}
