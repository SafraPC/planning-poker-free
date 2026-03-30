"use client";

import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { Phase, RoomMember, VoteValue } from "@shared/types";
import { cn } from "@/lib/cn";
import { VoteCardFace } from "@/components/vote-token";

export function PlayerSeat({
  member,
  self,
  phase,
  modeValue,
}: {
  member: RoomMember;
  self: boolean;
  phase: Phase;
  modeValue: VoteValue | null;
}) {
  const faceUp =
    phase === "revealed" ||
    (phase === "voting" && self && member.vote !== null);
  const showGlyph =
    phase === "revealed"
      ? member.vote
      : phase === "voting" && self
        ? member.vote
        : null;
  const majorityGlow =
    phase === "revealed" &&
    member.vote !== null &&
    modeValue !== null &&
    member.vote === modeValue &&
    member.vote !== "COFFEE";
  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <div className="relative">
        {member.role === "host" ? (
          <span
            className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-md"
            aria-label="Anfitrião"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
        ) : null}
        <VoteCardFace
          value={showGlyph}
          faceUp={
            phase === "revealing"
              ? false
              : faceUp
          }
          glow={Boolean(majorityGlow)}
        />
      </div>
      <div
        className={cn(
          "max-w-[6.5rem] truncate text-center font-display text-sm font-semibold",
          self ? "text-accent" : "text-ink",
        )}
      >
        {member.name}
        {self ? (
          <span className="text-ink-muted block text-[10px] font-normal">você</span>
        ) : null}
      </div>
    </motion.div>
  );
}
