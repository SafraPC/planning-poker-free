"use client";

import { motion } from "framer-motion";

function SyncMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <circle cx="32" cy="30" r="22" fill="currentColor" className="text-table-inner dark:text-table" />
      <circle cx="24" cy="28" r="4" fill="currentColor" className="text-ink" />
      <circle cx="40" cy="28" r="4" fill="currentColor" className="text-ink" />
      <path
        d="M22 42c4 6 16 6 20 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-ink"
      />
      <path
        d="M48 14c4 2 6 6 4 10-1 3-5 4-8 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-accent"
      />
    </svg>
  );
}

export function AgreementRing({ percent }: { percent: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const offset = c * (1 - p / 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
        Sincronia
      </span>
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/30 dark:text-white/15"
          />
          <motion.circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-emerald-400"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-emerald-500">
          <SyncMascot className="h-14 w-14 opacity-90" />
        </div>
      </div>
      <span className="font-display text-lg font-semibold text-emerald-500">{p}%</span>
    </div>
  );
}
