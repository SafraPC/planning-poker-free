import type * as Party from "partykit/server";
import type { RoomMember, VoteValue } from "../shared/types";
import type { EngineState } from "./engine-state";

export function buildMembersPublic(
  state: EngineState,
  viewerId: string,
): RoomMember[] {
  const list: RoomMember[] = [];
  for (const [id, m] of Object.entries(state.members)) {
    const hasVoted = m.vote !== null;
    let vote: VoteValue | null = m.vote;
    if (state.phase === "revealing") {
      vote = null;
    } else if (state.phase === "voting" && id !== viewerId) {
      vote = null;
    }
    if (state.phase === "lobby" || state.phase === "draft") {
      vote = null;
    }
    list.push({
      id,
      name: m.name,
      role: m.role,
      vote,
      hasVoted:
        state.phase === "voting" || state.phase === "revealing"
          ? hasVoted
          : state.phase === "revealed"
            ? hasVoted
            : false,
    });
  }
  list.sort(
    (a, b) =>
      state.members[a.id].order - state.members[b.id].order,
  );
  return list;
}

export function buildSnapshot(
  state: EngineState,
  connection: Party.Connection,
): {
  phase: EngineState["phase"];
  roomName: string;
  roomOpen: boolean;
  members: RoomMember[];
  revealEndsAt: number | null;
  selfId: string;
  isHost: boolean;
} {
  return {
    phase: state.phase,
    roomName: state.roomName,
    roomOpen: state.roomOpen,
    members: buildMembersPublic(state, connection.id),
    revealEndsAt: state.revealEndsAt,
    selfId: connection.id,
    isHost: state.hostId === connection.id,
  };
}
