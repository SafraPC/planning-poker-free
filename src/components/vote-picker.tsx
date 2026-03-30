"use client";

import { motion } from "framer-motion";
import type { VoteValue } from "@shared/types";
import { VOTE_HINTS, VOTE_SEQUENCE } from "@shared/types";
import { cn } from "@/lib/cn";
import { VoteGlyph } from "@/components/vote-token";

export function VotePicker({
  selected,
  disabled,
  onPick,
}: {
  selected: VoteValue | null;
  disabled?: boolean;
  onPick: (v: VoteValue) => void;
}) {
  return (
    <div className="flex w-full max-w-3xl flex-wrap justify-center gap-2 sm:gap-3">
      {VOTE_SEQUENCE.map((v, i) => {
        const active = selected === v;
        return (
          <motion.button
            key={v}
            type="button"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 26 }}
            disabled={disabled}
            onClick={() => onPick(v)}
            className={cn(
              "flex min-w-[4.25rem] flex-col items-center rounded-2xl border px-3 py-2 text-xs font-medium shadow-sm transition-colors",
              active
                ? "border-accent bg-accent/15 text-ink shadow-card dark:text-ink"
                : "border-white/15 bg-white/40 text-ink-muted hover:border-accent/60 hover:text-ink dark:border-white/10 dark:bg-white/5 dark:hover:border-accent/50",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <VoteGlyph value={v} />
            <span className="mt-1 text-[10px] text-ink-muted">{VOTE_HINTS[v]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
