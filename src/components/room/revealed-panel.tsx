"use client";

import { cn } from "@/lib/cn";

interface Props {
  isHost: boolean;
  onNewRound: () => void;
}

export function RevealedPanel({ isHost, onNewRound }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="button"
        disabled={!isHost}
        onClick={onNewRound}
        className={cn(
          "rounded-2xl px-6 py-3 text-sm font-semibold shadow-md transition-transform",
          isHost
            ? "bg-table-inner text-ink hover:scale-[1.02] dark:bg-white/10 dark:text-white"
            : "cursor-not-allowed opacity-50",
        )}
      >
        Iniciar nova votação
      </button>
      {!isHost ? (
        <p className="text-ink-muted text-xs">
          Somente o anfitrião reinicia a mesa.
        </p>
      ) : null}
    </div>
  );
}
