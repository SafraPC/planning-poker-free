import type * as Party from "partykit/server";
import { REVEAL_DELAY_MS } from "../shared/types";
import { ClientMessageSchema } from "../shared/wire";
import {
  applyDisconnect,
  createInitialEngine,
  sealReveal,
  type EngineState,
} from "./engine-state";
import { reduceMessage } from "./reduce-message";
import { buildSnapshot } from "./snapshot";

export default class PlanningPokerServer implements Party.Server {
  readonly options = { hibernate: false };
  private engine: EngineState = createInitialEngine();
  private revealTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(readonly room: Party.Room) {}

  private clearRevealTimer() {
    if (this.revealTimer) {
      clearTimeout(this.revealTimer);
      this.revealTimer = null;
    }
  }

  private scheduleRevealFinalize() {
    this.clearRevealTimer();
    this.revealTimer = setTimeout(() => {
      sealReveal(this.engine);
      this.revealTimer = null;
      this.pushAll();
    }, REVEAL_DELAY_MS);
  }

  private pushAll() {
    for (const connection of this.room.getConnections()) {
      const payload = buildSnapshot(this.engine, connection);
      connection.send(JSON.stringify({ type: "STATE", payload }));
    }
  }

  async onConnect(connection: Party.Connection) {
    connection.send(
      JSON.stringify({
        type: "STATE",
        payload: buildSnapshot(this.engine, connection),
      }),
    );
  }

  async onClose(connection: Party.Connection) {
    applyDisconnect(this.engine, connection.id);
    if (this.engine.phase === "room_closed") {
      this.clearRevealTimer();
      this.pushAll();
      this.engine = createInitialEngine();
      for (const c of this.room.getConnections()) {
        if (c.id !== connection.id) {
          c.close(1000, "room_closed");
        }
      }
      return;
    }
    if (this.engine.phase !== "revealing") {
      this.clearRevealTimer();
    }
    this.pushAll();
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    if (typeof message !== "string") return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(message);
    } catch {
      sender.send(
        JSON.stringify({
          type: "ERROR",
          code: "BAD_JSON",
          message: "Pacote inválido.",
        }),
      );
      return;
    }
    const safe = ClientMessageSchema.safeParse(parsed);
    if (!safe.success) {
      sender.send(
        JSON.stringify({
          type: "ERROR",
          code: "BAD_SHAPE",
          message: "Mensagem inválida.",
        }),
      );
      return;
    }
    const result = reduceMessage(this.engine, sender.id, safe.data);
    if (!result.ok) {
      sender.send(
        JSON.stringify({
          type: "ERROR",
          code: result.code,
          message: result.message,
        }),
      );
      return;
    }
    if (safe.data.type === "HOST_REVEAL") {
      this.scheduleRevealFinalize();
    }
    if (
      safe.data.type === "HOST_NEW_ROUND" ||
      safe.data.type === "HOST_START_VOTING"
    ) {
      this.clearRevealTimer();
    }
    if (safe.data.type === "HOST_CLOSE_ROOM") {
      this.clearRevealTimer();
      this.pushAll();
      this.engine = createInitialEngine();
      for (const connection of this.room.getConnections()) {
        connection.close(1000, "room_closed");
      }
      return;
    }
    this.pushAll();
  }
}
