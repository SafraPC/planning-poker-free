"use client";

import type { RoomMember, VoteValue } from "@shared/types";
import { Button } from "@/components/ui/button";
import { VotePicker } from "@/components/vote-picker";

interface Props {
  isHost: boolean;
  self: RoomMember | undefined;
  votedCount: number;
  totalCount: number;
  onVote: (value: VoteValue) => void;
  onReveal: () => void;
}

export function VotingPanel({
  isHost,
  self,
  votedCount,
  totalCount,
  onVote,
  onReveal,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-2">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Votação aberta
        </p>
        <p className="mt-1.5 font-display text-xl font-semibold tracking-tight">
          {votedCount === totalCount && totalCount > 0
            ? "Todos votaram"
            : `${votedCount} de ${totalCount} votaram`}
        </p>
      </div>
      {self ? <VotePicker selected={self.vote} onPick={onVote} /> : null}
      {isHost ? (
        <Button variant="secondary" size="md" onClick={onReveal}>
          Revelar cartas
        </Button>
      ) : (
        <p className="text-xs text-ink-muted">
          O anfitrião revela quando todos estiverem prontos.
        </p>
      )}
    </div>
  );
}
