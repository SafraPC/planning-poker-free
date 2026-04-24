import { describe, expect, it } from "vitest";
import type * as Party from "partykit/server";
import { createInitialEngine, type EngineState } from "./engine-state";
import { reduceMessage } from "./reduce-message";
import { buildSnapshot } from "./snapshot";

const HOST = "host";
const G1 = "g1";
const G2 = "g2";

function fakeConn(id: string): Party.Connection {
  return { id } as unknown as Party.Connection;
}

function setupVotingState(): EngineState {
  const state = createInitialEngine();
  reduceMessage(state, HOST, {
    type: "HOST_INIT",
    roomName: "Sprint",
    displayName: "Anfitrião",
  });
  reduceMessage(state, G1, { type: "GUEST_JOIN", displayName: "Guest 1" });
  reduceMessage(state, G2, { type: "GUEST_JOIN", displayName: "Guest 2" });
  reduceMessage(state, HOST, { type: "HOST_ENTER_DRAFT" });
  reduceMessage(state, HOST, { type: "HOST_START_VOTING" });
  reduceMessage(state, G1, { type: "CAST_VOTE", vote: "M" });
  reduceMessage(state, G2, { type: "CAST_VOTE", vote: "L" });
  reduceMessage(state, HOST, { type: "CAST_VOTE", vote: "M" });
  return state;
}

describe("buildSnapshot — visibilidade dos votos", () => {
  it("oculta votos dos outros durante voting", () => {
    const state = setupVotingState();
    const snap = buildSnapshot(state, fakeConn(G1));
    const me = snap.members.find((m) => m.id === G1);
    const other = snap.members.find((m) => m.id === G2);
    expect(me?.vote).toBe("M");
    expect(other?.vote).toBeNull();
    expect(other?.hasVoted).toBe(true);
  });

  it("oculta TODOS os votos durante revealing", () => {
    const state = setupVotingState();
    reduceMessage(state, HOST, { type: "HOST_REVEAL" });
    const snap = buildSnapshot(state, fakeConn(G1));
    for (const m of snap.members) {
      expect(m.vote).toBeNull();
      expect(m.hasVoted).toBe(true);
    }
  });

  it("revela todos os votos quando phase=revealed", () => {
    const state = setupVotingState();
    reduceMessage(state, HOST, { type: "HOST_REVEAL" });
    state.phase = "revealed";
    state.revealEndsAt = null;
    const snap = buildSnapshot(state, fakeConn(G1));
    expect(snap.members.find((m) => m.id === G1)?.vote).toBe("M");
    expect(snap.members.find((m) => m.id === G2)?.vote).toBe("L");
    expect(snap.members.find((m) => m.id === HOST)?.vote).toBe("M");
  });

  it("não vaza votos no lobby/draft", () => {
    const state = setupVotingState();
    state.phase = "lobby";
    let snap = buildSnapshot(state, fakeConn(G1));
    snap.members.forEach((m) => expect(m.vote).toBeNull());
    state.phase = "draft";
    snap = buildSnapshot(state, fakeConn(G1));
    snap.members.forEach((m) => expect(m.vote).toBeNull());
  });

  it("isHost reflete o anfitrião correto", () => {
    const state = setupVotingState();
    expect(buildSnapshot(state, fakeConn(HOST)).isHost).toBe(true);
    expect(buildSnapshot(state, fakeConn(G1)).isHost).toBe(false);
  });

  it("ordena membros pela ordem de chegada", () => {
    const state = setupVotingState();
    const ids = buildSnapshot(state, fakeConn(HOST)).members.map((m) => m.id);
    expect(ids).toEqual([HOST, G1, G2]);
  });
});
