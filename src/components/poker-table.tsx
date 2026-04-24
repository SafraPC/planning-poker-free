"use client";

import type { ReactNode } from "react";
import type { Phase, RoomMember, VoteValue } from "@shared/types";
import { PlayerSeat } from "@/components/player-seat";

function splitHalves<T>(arr: T[]): [T[], T[]] {
  if (arr.length <= 1) return [arr, []];
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

interface Props {
  members: RoomMember[];
  selfId: string;
  phase: Phase;
  modeValue: VoteValue | null;
  center: ReactNode;
}

export function PokerTable({ members, selfId, phase, modeValue, center }: Props) {
  const [top, bottom] = splitHalves(members);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <SeatRow members={top} selfId={selfId} phase={phase} modeValue={modeValue} />
      <div className="surface-card relative isolate mx-auto flex min-h-[14rem] w-full max-w-3xl items-center justify-center overflow-hidden p-8 shadow-card">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="relative w-full">{center}</div>
      </div>
      <SeatRow members={bottom} selfId={selfId} phase={phase} modeValue={modeValue} />
    </div>
  );
}

function SeatRow({
  members,
  selfId,
  phase,
  modeValue,
}: {
  members: RoomMember[];
  selfId: string;
  phase: Phase;
  modeValue: VoteValue | null;
}) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10">
      {members.map((m) => (
        <PlayerSeat
          key={m.id}
          member={m}
          self={m.id === selfId}
          phase={phase}
          modeValue={modeValue}
        />
      ))}
    </div>
  );
}
