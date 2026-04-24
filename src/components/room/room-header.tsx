"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CopyInviteControl } from "@/components/room/copy-invite-control";
import { ThemeToggle } from "@/components/theme-toggle";

interface Props {
  roomName: string;
  connected: boolean;
  reconnecting: boolean;
  isHost: boolean;
  inviteUrl: string;
}

export function RoomHeader({
  roomName,
  connected,
  reconnecting,
  isHost,
  inviteUrl,
}: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-surface font-display text-sm font-semibold tracking-tight">
            pp
          </span>
        </Link>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            Sala
          </p>
          <h1 className="font-display text-xl font-semibold tracking-tight">
            {roomName || "Planning Poker"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          tone={connected ? "success" : reconnecting ? "warning" : "neutral"}
          aria-live="polite"
        >
          {connected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Conectado
            </>
          ) : reconnecting ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Reconectando
            </>
          ) : (
            <>
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Conectando
            </>
          )}
        </Badge>
        {isHost ? <CopyInviteControl inviteUrl={inviteUrl} /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
