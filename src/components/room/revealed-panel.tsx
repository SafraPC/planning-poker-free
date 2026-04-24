"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isHost: boolean;
  onNewRound: () => void;
}

export function RevealedPanel({ isHost, onNewRound }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        Resultado revelado
      </p>
      <Button
        variant="primary"
        size="lg"
        disabled={!isHost}
        onClick={onNewRound}
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Iniciar nova votação
      </Button>
      {!isHost ? (
        <p className="text-xs text-ink-muted">
          Somente o anfitrião reinicia a mesa.
        </p>
      ) : null}
    </div>
  );
}
