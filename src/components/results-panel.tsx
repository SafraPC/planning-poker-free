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

  if (rows.length === 0) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card mt-8 flex w-full max-w-3xl flex-col items-center gap-2 p-6 shadow-card"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Resultado
        </p>
        <p className="text-sm text-ink-muted">
          Ninguém votou nesta rodada. Apenas observadores.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="surface-card mt-8 w-full max-w-4xl p-6 shadow-card sm:p-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-end justify-center gap-6 sm:gap-8">
          {rows.map((row, idx) => {
            const majority =
              agreement.mode === row.value && agreement.percent >= 50;
            return (
              <DistributionBar
                key={row.value}
                value={row.value}
                count={row.count}
                shareRatio={row.share / maxShare}
                majority={majority}
                index={idx}
              />
            );
          })}
        </div>
        <AgreementRing percent={agreement.votingCount ? agreement.percent : 0} />
      </div>
    </motion.div>
  );
}

interface BarProps {
  value: VoteValue;
  count: number;
  shareRatio: number;
  majority: boolean;
  index: number;
}

function DistributionBar({
  value,
  count,
  shareRatio,
  majority,
  index,
}: BarProps) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex h-32 w-9 items-end justify-center rounded-md bg-surface-muted">
        <motion.div
          className={cn(
            "w-full rounded-md",
            majority ? "bg-ink" : "bg-ink/30",
          )}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(8, shareRatio * 100)}%` }}
          transition={{
            delay: index * 0.04,
            type: "spring",
            stiffness: 200,
            damping: 22,
          }}
        />
      </div>
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg border bg-surface-elevated transition-colors",
          majority ? "border-ink shadow-soft" : "border-border",
        )}
      >
        <VoteGlyph value={value} />
      </div>
      <span
        className={cn(
          "text-xs font-medium tracking-tight",
          majority ? "text-ink" : "text-ink-muted",
        )}
      >
        {count} {count === 1 ? "voto" : "votos"}
      </span>
    </div>
  );
}
