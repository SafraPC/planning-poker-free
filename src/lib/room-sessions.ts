const STORAGE_KEY = "pp_room_sessions";
const MAX_SESSIONS = 8;

export const ROOM_SESSION_TTL_MS = 10 * 60 * 1000;

export type StoredRoomRole = "host" | "guest";

export interface RoomSessionRecord {
  token: string;
  roomName: string;
  displayName: string;
  role: StoredRoomRole;
  lastConnectedAt: number;
}

function readAll(): RoomSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is RoomSessionRecord =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as RoomSessionRecord).token === "string" &&
          typeof (x as RoomSessionRecord).roomName === "string" &&
          typeof (x as RoomSessionRecord).displayName === "string" &&
          ((x as RoomSessionRecord).role === "host" ||
            (x as RoomSessionRecord).role === "guest") &&
          typeof (x as RoomSessionRecord).lastConnectedAt === "number",
      )
      .map((r) => ({
        token: r.token,
        roomName: r.roomName,
        displayName: r.displayName,
        role: r.role,
        lastConnectedAt: r.lastConnectedAt,
      }));
  } catch {
    return [];
  }
}

function writeAll(sessions: RoomSessionRecord[]) {
  if (typeof window === "undefined") return;
  const trimmed = sessions
    .sort((a, b) => b.lastConnectedAt - a.lastConnectedAt)
    .slice(0, MAX_SESSIONS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function isSessionFresh(lastConnectedAt: number): boolean {
  return Date.now() - lastConnectedAt < ROOM_SESSION_TTL_MS;
}

export function pruneExpiredSessions(): void {
  writeAll(readAll().filter((s) => isSessionFresh(s.lastConnectedAt)));
}

export function getFreshSessionForToken(
  token: string,
): RoomSessionRecord | null {
  const s = readAll().find((r) => r.token === token) ?? null;
  if (!s) return null;
  if (!isSessionFresh(s.lastConnectedAt)) return null;
  return s;
}

export function getMostRecentFreshSession(): RoomSessionRecord | null {
  const all = readAll().filter((s) => isSessionFresh(s.lastConnectedAt));
  if (all.length === 0) return null;
  return all.reduce((a, b) =>
    a.lastConnectedAt >= b.lastConnectedAt ? a : b,
  );
}

export function upsertRoomSession(rec: RoomSessionRecord): void {
  const all = readAll().filter((s) => s.token !== rec.token);
  all.push({ ...rec, lastConnectedAt: rec.lastConnectedAt });
  writeAll(all);
}

export function touchRoomSession(token: string): void {
  const all = readAll();
  const i = all.findIndex((s) => s.token === token);
  if (i === -1) return;
  all[i] = { ...all[i]!, lastConnectedAt: Date.now() };
  writeAll(all);
}

export function removeRoomSession(token: string): void {
  writeAll(readAll().filter((s) => s.token !== token));
}
