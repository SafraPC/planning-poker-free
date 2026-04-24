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
import {
  PING_INTERVAL_MS,
  partySocketReconnectOptions,
} from "@/lib/party-socket-options";
import { touchRoomSession } from "@/lib/room-sessions";
import { getOrCreatePersistentUserId } from "@/lib/user-id";

const PING_PAYLOAD = JSON.stringify({ type: "PING" as const });

export function usePlanningSocket(
  enabled: boolean,
  roomToken: string | null,
  onRoomClosed?: () => void,
) {
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const sockRef = useRef<PartySocket | null>(null);
  const tokenRef = useRef<string | null>(null);
  const hadSuccessfulOpenRef = useRef(false);
  const onRoomClosedRef = useRef(onRoomClosed);
  const roomCloseHandledRef = useRef(false);

  useEffect(() => {
    onRoomClosedRef.current = onRoomClosed;
  }, [onRoomClosed]);

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
    roomCloseHandledRef.current = false;

    const tryNotifyRoomClosed = () => {
      if (roomCloseHandledRef.current) return;
      roomCloseHandledRef.current = true;
      onRoomClosedRef.current?.();
    };

    const socket = new PartySocket({
      host: endpoint.host,
      party: endpoint.party,
      room: endpoint.room,
      id,
      ...partySocketReconnectOptions,
    });
    sockRef.current = socket;

    const onOpen = () => {
      setConnected(true);
      setReconnecting(false);
      setLastError(null);
      hadSuccessfulOpenRef.current = true;
    };
    const onClose = (ev: Event) => {
      setConnected(false);
      if (
        ev instanceof CloseEvent &&
        ev.code === 1000 &&
        ev.reason === "room_closed"
      ) {
        setReconnecting(false);
        hadSuccessfulOpenRef.current = false;
        tryNotifyRoomClosed();
        return;
      }
      if (hadSuccessfulOpenRef.current) {
        setReconnecting(true);
      }
    };
    const onMessage = (evt: MessageEvent) => {
      try {
        const data = JSON.parse(String(evt.data)) as {
          type: string;
          payload?: unknown;
          message?: string;
        };
        if (data.type === "STATE" && isStatePayload(data.payload)) {
          setSnapshot(data.payload);
          if (data.payload.phase === "room_closed") {
            tryNotifyRoomClosed();
          } else {
            const tok = tokenRef.current;
            if (tok) {
              touchRoomSession(tok);
            }
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

    const pingId = window.setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(PING_PAYLOAD);
      }
    }, PING_INTERVAL_MS);

    const onNetOnline = () => {
      if (socket.readyState !== WebSocket.OPEN) {
        socket.reconnect();
      }
    };
    const onVis = () => {
      if (
        document.visibilityState === "visible" &&
        socket.readyState !== WebSocket.OPEN &&
        hadSuccessfulOpenRef.current
      ) {
        socket.reconnect();
      }
    };
    window.addEventListener("online", onNetOnline);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.clearInterval(pingId);
      window.removeEventListener("online", onNetOnline);
      document.removeEventListener("visibilitychange", onVis);
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
      socket.removeEventListener("message", onMessage);
      hadSuccessfulOpenRef.current = false;
      setReconnecting(false);
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

  return {
    snapshot,
    send,
    connected,
    reconnecting,
    lastError,
    setLastError,
  };
}
