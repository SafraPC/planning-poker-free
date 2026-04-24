"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const SIZE = 112;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function classifyAgreement(p: number) {
  if (p >= 80) return { label: "Forte", tone: "text-success" };
  if (p >= 60) return { label: "Bom", tone: "text-success" };
  if (p >= 40) return { label: "Misto", tone: "text-warning" };
  return { label: "Baixo", tone: "text-danger" };
}

export function AgreementRing({ percent }: { percent: number }) {
  const p = Math.min(100, Math.max(0, percent));
  const offset = CIRCUMFERENCE * (1 - p / 100);
  const { label, tone } = classifyAgreement(p);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        Sincronia
      </span>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-border"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className={tone}
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold tracking-tighter">
            {p}
            <span className="text-ink-muted text-xl">%</span>
          </span>
        </div>
      </div>
      <span className={cn("text-xs font-medium tracking-tight", tone)}>
        {label}
      </span>
    </div>
  );
}
