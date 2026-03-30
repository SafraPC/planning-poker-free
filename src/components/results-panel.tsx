"use client";

import { motion } from "framer-motion";
import type { VoteValue } from "@shared/types";
import { computeAgreement, computeDistribution } from "@shared/vote-stats";
import { AgreementRing } from "@/components/agreement-ring";
import { VoteGlyph } from "@/components/vote-token";
import { cn } from "@/lib/cn";

export function ResultsPanel({ votes }: { votes: VoteValue[] }) {
  const rows = computeDistribution(votes);
  const agreement = computeAgreement(votes);
  const maxShare = rows.reduce((m, r) => Math.max(m, r.share), 0) || 1;
  return (
    <motion.div
      layout
      className="glass-panel mt-8 w-full max-w-4xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-wrap items-end justify-center gap-6 sm:gap-10">
          {rows.map((row, idx) => {
            const majority = agreement.mode === row.value && agreement.percent >= 50;
            return (
              <div key={row.value} className="flex flex-col items-center gap-2">
                <div className="flex h-36 w-10 items-end justify-center rounded-full bg-white/20 dark:bg-white/10">
                  <motion.div
                    className="w-full rounded-full bg-gradient-to-t from-accent/70 to-accent"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(12, (row.share / maxShare) * 100)}%` }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 200, damping: 22 }}
                  />
                </div>
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/70 dark:bg-table-inner",
                    majority
                      ? "border-ink shadow-md dark:border-white"
                      : "border-white/20 dark:border-white/10",
                  )}
                >
                  <VoteGlyph value={row.value} />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    majority ? "text-ink dark:text-white" : "text-ink-muted",
                  )}
                >
                  {row.count}{" "}
                  {row.count === 1 ? "voto" : "votos"}
                </span>
              </div>
            );
          })}
        </div>
        <AgreementRing percent={agreement.votingCount ? agreement.percent : 0} />
      </div>
    </motion.div>
  );
}
