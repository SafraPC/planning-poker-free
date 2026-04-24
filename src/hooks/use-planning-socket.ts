"use client";

import PartySocket from "partysocket";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoomSnapshot } from "@shared/types";
import type { ClientMessage } from "@shared/wire";
import {
  getPartyKitHost,
  getPartyName,
  getRoomIdForToken,
  isStatePayload,
} from "@/lib/party";
import { touchRoomSession } from "@/lib/room-sessions";
import { getOrCreatePersistentUserId } from "@/lib/user-id";

export function usePlanningSocket(enabled: boolean, roomToken: string | null) {
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const sockRef = useRef<PartySocket | null>(null);
  const tokenRef = useRef<string | null>(null);

  const endpoint = useMemo(() => {
    const t = roomToken?.trim() ?? "";
    if (!t) {
      return { host: "", party: "", room: "" };
    }
    return {
      host: getPartyKitHost(),
      party: getPartyName(),
      room: getRoomIdForToken(t),
    };
  }, [roomToken]);

  useEffect(() => {
    tokenRef.current = roomToken?.trim() ?? null;
  }, [roomToken]);

  useEffect(() => {
    if (!enabled || !roomToken?.trim()) return;
    const id = getOrCreatePersistentUserId();
    if (!id) return;

    const socket = new PartySocket({
      host: endpoint.host,
      party: endpoint.party,
      room: endpoint.room,
      id,
    });
    sockRef.current = socket;

    const onOpen = () => {
      setConnected(true);
      setLastError(null);
    };
    const onClose = () => setConnected(false);
    const onMessage = (evt: MessageEvent) => {
      try {
        const data = JSON.parse(String(evt.data)) as {
          type: string;
          payload?: unknown;
          message?: string;
        };
        if (data.type === "STATE" && isStatePayload(data.payload)) {
          setSnapshot(data.payload);
          const tok = tokenRef.current;
          if (tok) {
            touchRoomSession(tok);
          }
        }
        if (data.type === "ERROR" && data.message) {
          setLastError(data.message);
        }
      } catch {
        setLastError("Falha ao interpretar mensagem.");
      }
    };
    socket.addEventListener("open", onOpen);
    socket.addEventListener("close", onClose);
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
      socket.removeEventListener("message", onMessage);
      socket.close();
      sockRef.current = null;
    };
  }, [enabled, roomToken, endpoint.host, endpoint.party, endpoint.room]);

  const send = useCallback((msg: ClientMessage) => {
    const s = sockRef.current;
    if (s && s.readyState === WebSocket.OPEN) {
      s.send(JSON.stringify(msg));
    }
  }, []);

  return { snapshot, send, connected, lastError, setLastError };
}
