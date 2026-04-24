"use client";

import type { RoomMember, VoteValue } from "@shared/types";
import { VotePicker } from "@/components/vote-picker";

interface Props {
  isHost: boolean;
  self: RoomMember | undefined;
  onVote: (value: VoteValue) => void;
  onReveal: () => void;
}

export function VotingPanel({ isHost, self, onVote, onReveal }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-2">
      {self ? (
        <VotePicker selected={self.vote} onPick={onVote} />
      ) : null}
      {isHost ? (
        <button
          type="button"
          onClick={onReveal}
          className="rounded-2xl border border-white/20 bg-white/30 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          Revelar cartas
        </button>
      ) : (
        <p className="text-ink-muted text-xs">
          O anfitrião revelará quando todos estiverem prontos.
        </p>
      )}
    </div>
  );
}
