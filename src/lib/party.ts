import type { RoomSnapshot } from "@shared/types";

const DEV_PARTYKIT_HOST = "127.0.0.1:1999";

export const PARTYKIT_CONFIG_HELP =
  "Defina NEXT_PUBLIC_PARTYKIT_HOST com o host do deploy PartyKit (sem https://, ex. o subdomínio exibido após npx partykit deploy). Requer novo deploy do front na Vercel.";

export function getPartyKitHost(): string {
  const fromEnv = process.env.NEXT_PUBLIC_PARTYKIT_HOST?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return DEV_PARTYKIT_HOST;
  }
  return "";
}

export function getPartyName() {
  return process.env.NEXT_PUBLIC_PARTYKIT_PARTY ?? "main";
}

export function getRoomIdForToken(token: string): string {
  const t = token.trim();
  if (!t) {
    throw new Error("Token de sala ausente.");
  }
  return t;
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
