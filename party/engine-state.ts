import type { Phase, VoteValue } from "../shared/types";

export interface MemberInternal {
  name: string;
  role: "host" | "guest";
  vote: VoteValue | null;
  order: number;
}

export interface EngineState {
  phase: Phase;
  roomName: string;
  roomOpen: boolean;
  hostId: string | null;
  members: Record<string, MemberInternal>;
  revealEndsAt: number | null;
  orderSeed: number;
}

export function createInitialEngine(): EngineState {
  return {
    phase: "awaiting_host",
    roomName: "",
    roomOpen: false,
    hostId: null,
    members: {},
    revealEndsAt: null,
    orderSeed: 0,
  };
}

export function closeEntireRoom(state: EngineState): void {
  state.phase = "room_closed";
  state.roomName = "";
  state.roomOpen = false;
  state.hostId = null;
  state.members = {};
  state.revealEndsAt = null;
  state.orderSeed = 0;
}

export function applyDisconnect(
  state: EngineState,
  connectionId: string,
): void {
  const wasHost = state.hostId === connectionId;
  delete state.members[connectionId];
  if (wasHost) {
    closeEntireRoom(state);
  }
}

export function sealReveal(state: EngineState): void {
  if (state.phase === "revealing") {
    state.phase = "revealed";
    state.revealEndsAt = null;
  }
}
