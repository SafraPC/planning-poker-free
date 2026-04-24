"use client";

import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import type { Phase, RoomMember, VoteValue } from "@shared/types";
import { cn } from "@/lib/cn";
import { displayNameToInitials } from "@/lib/display-initials";
import { VoteCardFace } from "@/components/vote-token";

interface Props {
  member: RoomMember;
  self: boolean;
  phase: Phase;
  modeValue: VoteValue | null;
}

function resolveCardState(member: RoomMember, phase: Phase, self: boolean) {
  const revealed = phase === "revealed";
  const myTurn = phase === "voting" && self && member.vote !== null;
  const faceUp = revealed || myTurn;
  const showValue = revealed
    ? member.vote
    : myTurn
      ? member.vote
      : null;
  return {
    faceUp: phase === "revealing" ? false : faceUp,
    value: showValue,
  };
}

export function PlayerSeat({ member, self, phase, modeValue }: Props) {
  const { faceUp, value } = resolveCardState(member, phase, self);
  const isMajority =
    phase === "revealed" &&
    member.vote !== null &&
    member.vote === modeValue &&
    member.vote !== "COFFEE";

  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-2.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <div className="relative">
        {member.role === "host" ? (
          <span
            className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink shadow-soft"
            aria-label="Anfitrião"
          >
            <Crown className="h-2.5 w-2.5" strokeWidth={2.5} />
          </span>
        ) : null}
        <VoteCardFace
          value={value}
          faceUp={faceUp}
          glow={isMajority}
          pending={member.hasVoted && !faceUp}
          backInitials={displayNameToInitials(member.name)}
        />
      </div>
      <div className="text-center">
        <p
          className={cn(
            "max-w-[7rem] truncate font-display text-sm font-semibold tracking-tight",
            self ? "text-ink" : "text-ink",
          )}
        >
          {member.name}
        </p>
        {self ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            você
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
