"use client";

import { Button } from "@/components/ui/button";

interface Props {
  isHost: boolean;
  onStartVoting: () => void;
}

export function DraftPanel({ isHost, onStartVoting }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-2">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Pronto
        </p>
        <p className="mt-1.5 font-display text-xl font-semibold tracking-tight">
          {isHost
            ? "Inicie a votação quando o time estiver alinhado"
            : "Aguardando o anfitrião abrir a votação…"}
        </p>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          {isHost
            ? "Nome da sala e apelidos já vêm do convite. Nada mais a preencher."
            : null}
        </p>
      </div>
      {isHost ? (
        <Button size="lg" onClick={onStartVoting}>
          Iniciar votação
        </Button>
      ) : null}
    </div>
  );
}
