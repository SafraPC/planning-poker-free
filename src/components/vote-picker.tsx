"use client";

import { motion } from "framer-motion";
import type { VoteValue } from "@shared/types";
import { VOTE_HINTS, VOTE_SEQUENCE } from "@shared/types";
import { cn } from "@/lib/cn";
import { VoteGlyph } from "@/components/vote-token";

interface Props {
  selected: VoteValue | null;
  disabled?: boolean;
  onPick: (v: VoteValue) => void;
}

export function VotePicker({ selected, disabled, onPick }: Props) {
  return (
    <div className="flex w-full max-w-3xl flex-wrap justify-center gap-2">
      {VOTE_SEQUENCE.map((v, i) => {
        const active = selected === v;
        return (
          <motion.button
            key={v}
            type="button"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              delay: i * 0.03,
              type: "spring",
              stiffness: 320,
              damping: 26,
            }}
            disabled={disabled}
            onClick={() => onPick(v)}
            aria-pressed={active}
            className={cn(
              "group flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl border bg-surface-elevated px-3 py-3 transition-all focus-ring",
              active
                ? "border-ink shadow-card -translate-y-0.5"
                : "border-border hover:border-border-strong hover:-translate-y-0.5",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <VoteGlyph
              value={v}
              className={cn(active ? "text-ink" : "text-ink")}
            />
            <span className="text-[10px] font-medium tracking-tight text-ink-muted">
              {VOTE_HINTS[v]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
