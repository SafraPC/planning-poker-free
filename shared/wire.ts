import { z } from "zod";

export const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("HOST_INIT"),
    roomName: z.string().min(1).max(80),
    displayName: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal("GUEST_JOIN"),
    displayName: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal("HOST_ENTER_DRAFT"),
  }),
  z.object({
    type: z.literal("HOST_START_VOTING"),
  }),
  z.object({
    type: z.literal("CAST_VOTE"),
    vote: z.enum(["XS", "S", "M", "L", "XL", "UNKNOWN", "COFFEE"]),
  }),
  z.object({
    type: z.literal("HOST_REVEAL"),
  }),
  z.object({
    type: z.literal("HOST_NEW_ROUND"),
  }),
  z.object({
    type: z.literal("HOST_CLOSE_ROOM"),
  }),
  z.object({
    type: z.literal("PING"),
  }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export const ServerMessageSchema = z.object({
  type: z.literal("STATE"),
  payload: z.unknown(),
});

export type ServerMessage =
  | { type: "STATE"; payload: unknown }
  | { type: "ERROR"; code: string; message: string };
