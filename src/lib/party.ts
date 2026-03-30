import type { RoomSnapshot } from "@shared/types";
import { ROOM_PARTY_ID } from "@shared/types";

export function getPartyKitHost() {
  return (
    process.env.NEXT_PUBLIC_PARTYKIT_HOST ??
    `${typeof window !== "undefined" ? window.location.hostname : "127.0.0.1"}:1999`
  );
}

export function getPartyName() {
  return process.env.NEXT_PUBLIC_PARTYKIT_PARTY ?? "main";
}

export function getRoomId() {
  return process.env.NEXT_PUBLIC_PARTYKIT_ROOM ?? ROOM_PARTY_ID;
}

export function isStatePayload(value: unknown): value is RoomSnapshot {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.phase === "string" &&
    typeof v.roomName === "string" &&
    Array.isArray(v.members)
  );
}
