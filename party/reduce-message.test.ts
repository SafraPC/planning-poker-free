import { beforeEach, describe, expect, it } from "vitest";
import type { ClientMessage } from "../shared/wire";
import { MAX_PARTICIPANTS } from "../shared/types";
import { applyDisconnect, createInitialEngine, sealReveal, type EngineState } from "./engine-state";
import { reduceMessage } from "./reduce-message";

const HOST = "host-conn";
const G1 = "guest-1";
const G2 = "guest-2";

function send(state: EngineState, conn: string, msg: ClientMessage) {
  return reduceMessage(state, conn, msg);
}

function bootHost(state: EngineState) {
  return send(state, HOST, {
    type: "HOST_INIT",
    roomName: "Sprint",
    displayName: "Alfredo",
  });
}

function joinGuest(state: EngineState, id: string, name: string) {
  return send(state, id, { type: "GUEST_JOIN", displayName: name });
}

describe("reduceMessage", () => {
  let state: EngineState;

  beforeEach(() => {
    state = createInitialEngine();
  });

  describe("HOST_INIT", () => {
    it("toma o lugar de host quando vazio", () => {
      const r = bootHost(state);
      expect(r.ok).toBe(true);
      expect(state.hostId).toBe(HOST);
      expect(state.phase).toBe("lobby");
      expect(state.roomOpen).toBe(true);
      expect(state.members[HOST].role).toBe("host");
    });

    it("rejeita se já existe outro host", () => {
      bootHost(state);
      const r = send(state, "intruder", {
        type: "HOST_INIT",
        roomName: "X",
        displayName: "Y",
      });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("HOST_TAKEN");
    });

    it("permite host atual atualizar seus dados", () => {
      bootHost(state);
      const r = send(state, HOST, {
        type: "HOST_INIT",
        roomName: "Renomeada",
        displayName: "Novo",
      });
      expect(r.ok).toBe(true);
      expect(state.roomName).toBe("Renomeada");
      expect(state.members[HOST].name).toBe("Novo");
    });
  });

  describe("GUEST_JOIN", () => {
    it("bloqueia se sala não está aberta", () => {
      const r = joinGuest(state, G1, "Bia");
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("ROOM_CLOSED");
    });

    it("entra após host abrir", () => {
      bootHost(state);
      const r = joinGuest(state, G1, "Bia");
      expect(r.ok).toBe(true);
      expect(state.members[G1].role).toBe("guest");
    });

    it("é idempotente para mesma conexão", () => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
      const r = joinGuest(state, G1, "Bia");
      expect(r.ok).toBe(true);
      expect(Object.keys(state.members).length).toBe(2);
    });

    it("rejeita quando sala cheia", () => {
      bootHost(state);
      for (let i = 1; i < MAX_PARTICIPANTS; i++) {
        joinGuest(state, `g-${i}`, `User-${i}`);
      }
      const r = joinGuest(state, "overflow", "Overflow");
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("ROOM_FULL");
    });
  });

  describe("transições do host", () => {
    beforeEach(() => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
    });

    it("HOST_ENTER_DRAFT só do lobby", () => {
      const ok = send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      expect(ok.ok).toBe(true);
      expect(state.phase).toBe("draft");
      const again = send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      expect(again.ok).toBe(false);
    });

    it("SET_TASK só durante o draft", () => {
      const fail = send(state, HOST, {
        type: "SET_TASK",
        task: { title: "X" },
      });
      expect(fail.ok).toBe(false);
      send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      const ok = send(state, HOST, {
        type: "SET_TASK",
        task: { title: "Refatorar checkout", description: "  ctx  " },
      });
      expect(ok.ok).toBe(true);
      expect(state.task?.title).toBe("Refatorar checkout");
      expect(state.task?.description).toBe("ctx");
    });

    it("SET_TASK rejeita guest", () => {
      send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      const r = send(state, G1, { type: "SET_TASK", task: { title: "X" } });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("HOST_ONLY");
    });

    it("HOST_START_VOTING zera votos e troca fase", () => {
      send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      state.members[G1].vote = "M";
      const r = send(state, HOST, { type: "HOST_START_VOTING" });
      expect(r.ok).toBe(true);
      expect(state.phase).toBe("voting");
      expect(state.members[G1].vote).toBeNull();
    });
  });

  describe("CAST_VOTE", () => {
    beforeEach(() => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
      send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      send(state, HOST, { type: "HOST_START_VOTING" });
    });

    it("registra voto durante voting", () => {
      const r = send(state, G1, { type: "CAST_VOTE", vote: "L" });
      expect(r.ok).toBe(true);
      expect(state.members[G1].vote).toBe("L");
    });

    it("rejeita voto fora de voting", () => {
      state.phase = "draft";
      const r = send(state, G1, { type: "CAST_VOTE", vote: "L" });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("INVALID_PHASE");
    });

    it("permite trocar voto", () => {
      send(state, G1, { type: "CAST_VOTE", vote: "S" });
      send(state, G1, { type: "CAST_VOTE", vote: "XL" });
      expect(state.members[G1].vote).toBe("XL");
    });

    it("aceita café como voto válido", () => {
      send(state, G1, { type: "CAST_VOTE", vote: "COFFEE" });
      expect(state.members[G1].vote).toBe("COFFEE");
    });
  });

  describe("HOST_REVEAL e HOST_NEW_ROUND", () => {
    beforeEach(() => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
      send(state, HOST, { type: "HOST_ENTER_DRAFT" });
      send(state, HOST, { type: "HOST_START_VOTING" });
      send(state, G1, { type: "CAST_VOTE", vote: "M" });
    });

    it("revela e agenda fim", () => {
      const before = Date.now();
      const r = send(state, HOST, { type: "HOST_REVEAL" });
      expect(r.ok).toBe(true);
      expect(state.phase).toBe("revealing");
      expect(state.revealEndsAt).toBeGreaterThanOrEqual(before + 2999);
    });

    it("HOST_NEW_ROUND zera votos e volta para draft", () => {
      send(state, HOST, { type: "HOST_REVEAL" });
      sealReveal(state);
      const r = send(state, HOST, { type: "HOST_NEW_ROUND" });
      expect(r.ok).toBe(true);
      expect(state.phase).toBe("draft");
      expect(state.members[G1].vote).toBeNull();
      expect(state.revealEndsAt).toBeNull();
    });

    it("HOST_NEW_ROUND rejeita fora de revealed", () => {
      const r = send(state, HOST, { type: "HOST_NEW_ROUND" });
      expect(r.ok).toBe(false);
    });
  });

  describe("applyDisconnect", () => {
    it("remove guest sem afetar host", () => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
      applyDisconnect(state, G1);
      expect(state.members[G1]).toBeUndefined();
      expect(state.hostId).toBe(HOST);
      expect(state.phase).toBe("lobby");
    });

    it("promove próximo membro a host quando host sai", () => {
      bootHost(state);
      joinGuest(state, G1, "Bia");
      joinGuest(state, G2, "Caio");
      applyDisconnect(state, HOST);
      expect(state.hostId).toBe(G1);
      expect(state.members[G1].role).toBe("host");
    });

    it("reseta sala quando último membro sai", () => {
      bootHost(state);
      applyDisconnect(state, HOST);
      expect(state.phase).toBe("awaiting_host");
      expect(state.roomOpen).toBe(false);
      expect(Object.keys(state.members).length).toBe(0);
    });
  });

  it("PING é no-op idempotente", () => {
    const r = send(state, "x", { type: "PING" });
    expect(r.ok).toBe(true);
  });
});
