"use client";

import PartySocket from "partysocket";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoomSnapshot } from "@shared/types";
import type { ClientMessage } from "@shared/wire";
import { getPartyKitHost, getPartyName, getRoomId, isStatePayload } from "@/lib/party";

const STORAGE_KEY = "pp_conn_id";

function readStableId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function usePlanningSocket(enabled: boolean) {
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const sockRef = useRef<PartySocket | null>(null);

  const endpoint = useMemo(
    () => ({
      host: getPartyKitHost(),
      party: getPartyName(),
      room: getRoomId(),
    }),
    [],
  );

  useEffect(() => {
    if (!enabled) return;
    const id = readStableId();
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
  }, [enabled, endpoint.host, endpoint.party, endpoint.room]);

  const send = useCallback((msg: ClientMessage) => {
    const s = sockRef.current;
    if (s && s.readyState === WebSocket.OPEN) {
      s.send(JSON.stringify(msg));
    }
  }, []);

  return { snapshot, send, connected, lastError, setLastError };
}
