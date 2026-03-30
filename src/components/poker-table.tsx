"use client";

import type { ReactNode } from "react";
import type { Phase, RoomMember, VoteValue } from "@shared/types";
import { PlayerSeat } from "@/components/player-seat";
import { cn } from "@/lib/cn";

function splitHalves<T>(arr: T[]): [T[], T[]] {
  if (arr.length <= 1) return [arr, []];
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

export function PokerTable({
  members,
  selfId,
  phase,
  modeValue,
  center,
}: {
  members: RoomMember[];
  selfId: string;
  phase: Phase;
  modeValue: VoteValue | null;
  center: ReactNode;
}) {
  const [top, bottom] = splitHalves(members);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div
        className={cn(
          "flex flex-wrap items-end justify-center gap-4 sm:gap-8",
          top.length <= 2 ? "justify-evenly" : "",
        )}
      >
        {top.map((m) => (
          <PlayerSeat
            key={m.id}
            member={m}
            self={m.id === selfId}
            phase={phase}
            modeValue={modeValue}
          />
        ))}
      </div>
      <div
        className={cn(
          "glass-panel relative isolate mx-auto flex min-h-[12rem] w-full max-w-3xl items-center justify-center p-8",
          "noise",
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-accent/10 via-transparent to-transparent" />
        {center}
      </div>
      <div
        className={cn(
          "flex flex-wrap items-start justify-center gap-4 sm:gap-8",
          bottom.length <= 2 ? "justify-evenly" : "",
        )}
      >
        {bottom.map((m) => (
          <PlayerSeat
            key={m.id}
            member={m}
            self={m.id === selfId}
            phase={phase}
            modeValue={modeValue}
          />
        ))}
      </div>
    </div>
  );
}
