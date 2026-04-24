import { MAX_PARTICIPANTS, REVEAL_DELAY_MS } from "../shared/types";
import type { ClientMessage } from "../shared/wire";
import type { EngineState, MemberInternal } from "./engine-state";

function memberCount(members: Record<string, MemberInternal>) {
  return Object.keys(members).length;
}

export function reduceMessage(
  state: EngineState,
  connectionId: string,
  msg: ClientMessage,
): { ok: true } | { ok: false; code: string; message: string } {
  if (msg.type === "PING") return { ok: true };

  if (msg.type === "HOST_INIT") {
    if (state.hostId && state.hostId !== connectionId) {
      return { ok: false, code: "HOST_TAKEN", message: "Já existe um anfitrião." };
    }
    if (state.hostId === connectionId && state.members[connectionId]) {
      state.roomName = msg.roomName.trim();
      state.members[connectionId].name = msg.displayName.trim();
      state.roomOpen = true;
      return { ok: true };
    }
    state.roomName = msg.roomName.trim();
    state.orderSeed += 1;
    state.members[connectionId] = {
      name: msg.displayName.trim(),
      role: "host",
      vote: null,
      order: state.orderSeed,
    };
    state.hostId = connectionId;
    state.roomOpen = true;
    state.phase = "lobby";
    state.revealEndsAt = null;
    return { ok: true };
  }

  const self = state.members[connectionId];
  if (!self) {
    if (msg.type !== "GUEST_JOIN") {
      return {
        ok: false,
        code: "NOT_JOINED",
        message: "Identifique-se antes de interagir.",
      };
    }
  }

  if (msg.type === "GUEST_JOIN") {
    if (!state.roomOpen) {
      return {
        ok: false,
        code: "ROOM_CLOSED",
        message: "A sala ainda não foi aberta pelo anfitrião.",
      };
    }
    if (state.members[connectionId]) {
      return { ok: true };
    }
    if (memberCount(state.members) >= MAX_PARTICIPANTS) {
      return {
        ok: false,
        code: "ROOM_FULL",
        message: `Limite de ${MAX_PARTICIPANTS} participantes.`,
      };
    }
    state.orderSeed += 1;
    state.members[connectionId] = {
      name: msg.displayName.trim(),
      role: "guest",
      vote: null,
      order: state.orderSeed,
    };
    return { ok: true };
  }

  const hostOnly = () =>
    state.hostId === connectionId
      ? ({ ok: true } as const)
      : ({
          ok: false,
          code: "HOST_ONLY",
          message: "Somente o anfitrião pode fazer isso.",
        } as const);

  if (msg.type === "HOST_ENTER_DRAFT") {
    const h = hostOnly();
    if (!h.ok) return h;
    if (state.phase !== "lobby") {
      return {
        ok: false,
        code: "INVALID_PHASE",
        message: "Fluxo inválido para esta fase.",
      };
    }
    state.phase = "draft";
    return { ok: true };
  }

  if (msg.type === "HOST_START_VOTING") {
    const h = hostOnly();
    if (!h.ok) return h;
    if (state.phase !== "draft") {
      return {
        ok: false,
        code: "INVALID_PHASE",
        message: "Abra a etapa de preparo antes da votação.",
      };
    }
    state.phase = "voting";
    state.revealEndsAt = null;
    for (const id of Object.keys(state.members)) {
      state.members[id].vote = null;
    }
    return { ok: true };
  }

  if (msg.type === "CAST_VOTE") {
    if (state.phase !== "voting") {
      return {
        ok: false,
        code: "INVALID_PHASE",
        message: "Não há votação aberta.",
      };
    }
    if (!self) return { ok: false, code: "NOT_JOINED", message: "" };
    self.vote = msg.vote;
    return { ok: true };
  }

  if (msg.type === "HOST_REVEAL") {
    const h = hostOnly();
    if (!h.ok) return h;
    if (state.phase !== "voting") {
      return {
        ok: false,
        code: "INVALID_PHASE",
        message: "Só é possível revelar durante a votação.",
      };
    }
    state.phase = "revealing";
    state.revealEndsAt = Date.now() + REVEAL_DELAY_MS;
    return { ok: true };
  }

  if (msg.type === "HOST_NEW_ROUND") {
    const h = hostOnly();
    if (!h.ok) return h;
    if (state.phase !== "revealed") {
      return {
        ok: false,
        code: "INVALID_PHASE",
        message: "Termine uma rodada antes de iniciar outra.",
      };
    }
    state.phase = "draft";
    state.revealEndsAt = null;
    for (const id of Object.keys(state.members)) {
      state.members[id].vote = null;
    }
    return { ok: true };
  }

  return { ok: false, code: "UNKNOWN", message: "Mensagem inválida." };
}
