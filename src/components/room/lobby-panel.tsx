"use client";

import { Users } from "lucide-react";
import { MAX_PARTICIPANTS } from "@shared/types";
import { Button } from "@/components/ui/button";
import { CopyInviteControl } from "@/components/room/copy-invite-control";

interface Props {
  isHost: boolean;
  memberCount: number;
  inviteUrl: string;
  onEnterDraft: () => void;
}

export function LobbyPanel({
  isHost,
  memberCount,
  inviteUrl,
  onEnterDraft,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Aguardando o time
        </p>
        <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
          Sala pronta
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
          <Users className="h-3.5 w-3.5" aria-hidden />
          {memberCount} de {MAX_PARTICIPANTS} {memberCount === 1 ? "pessoa" : "pessoas"}
        </p>
      </div>
      {isHost ? (
        <div className="flex max-w-md flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <p className="w-full break-all text-center text-[10px] text-ink-faint sm:text-left">
            {inviteUrl}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <CopyInviteControl
              inviteUrl={inviteUrl}
              size="md"
              label="Copiar convite"
            />
            <Button onClick={onEnterDraft}>Continuar</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-muted">
          Aguardando o anfitrião continuar.
        </p>
      )}
    </div>
  );
}
