export type Phase =
  | "awaiting_host"
  | "lobby"
  | "draft"
  | "voting"
  | "revealing"
  | "revealed"
  | "room_closed";

export type VoteValue = "XS" | "S" | "M" | "L" | "XL" | "UNKNOWN" | "COFFEE";

export type MemberRole = "host" | "guest";

export interface RoomMember {
  id: string;
  name: string;
  role: MemberRole;
  vote: VoteValue | null;
  hasVoted: boolean;
}

export interface RoomSnapshot {
  phase: Phase;
  roomName: string;
  roomOpen: boolean;
  members: RoomMember[];
  revealEndsAt: number | null;
  selfId: string;
  isHost: boolean;
}

export interface VoteStatRow {
  value: VoteValue;
  label: string;
  count: number;
  share: number;
}

export interface AgreementResult {
  percent: number;
  mode: VoteValue | null;
  votingCount: number;
}

export const MAX_PARTICIPANTS = 8;

export const ROOM_PARTY_ID = "global-room";

export const REVEAL_DELAY_MS = 3000;

export const VOTE_SEQUENCE: VoteValue[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "UNKNOWN",
  "COFFEE",
];

export const VOTE_HINTS: Record<VoteValue, string> = {
  XS: "~2h",
  S: "~4h",
  M: "6–8h",
  L: "~16h (2d)",
  XL: "32–40h (~5d)",
  UNKNOWN: "Desconhecido",
  COFFEE: "Pausa — não entra nas estatísticas",
};

export function isStatExcluded(value: VoteValue): boolean {
  return value === "COFFEE";
}
