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

function pickNextHost(
  members: Record<string, MemberInternal>,
): string | null {
  let best: { id: string; order: number } | null = null;
  for (const [id, m] of Object.entries(members)) {
    if (!best || m.order < best.order) best = { id, order: m.order };
  }
  return best?.id ?? null;
}

export function applyDisconnect(
  state: EngineState,
  connectionId: string,
): void {
  delete state.members[connectionId];
  if (state.hostId === connectionId) {
    const next = pickNextHost(state.members);
    state.hostId = next;
    if (next) {
      state.members[next].role = "host";
    } else {
      state.phase = "awaiting_host";
      state.roomName = "";
      state.roomOpen = false;
      state.revealEndsAt = null;
      Object.keys(state.members).forEach((k) => delete state.members[k]);
    }
  }
}

export function sealReveal(state: EngineState): void {
  if (state.phase === "revealing") {
    state.phase = "revealed";
    state.revealEndsAt = null;
  }
}
