"use client";

import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

interface Props {
  roomName: string;
  connected: boolean;
}

export function RoomHeader({ roomName, connected }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-ink-muted text-xs uppercase tracking-[0.24em]">
          Planning poker
        </p>
        <h1 className="font-display text-3xl font-semibold">
          {roomName || "Sala"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <span
          aria-live="polite"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            connected
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-200",
          )}
        >
          {connected ? (
            "Conectado"
          ) : (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Conectando
            </>
          )}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
