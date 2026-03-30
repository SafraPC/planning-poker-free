"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ClientMessage } from "@shared/wire";
import { RoomView } from "@/components/room-view";
import { usePlanningSocket } from "@/hooks/use-planning-socket";

function SalaContent() {
  const router = useRouter();
  const params = useSearchParams();
  const intentHost = params.get("host") === "1";
  const hostRoom = params.get("room")?.trim() ?? "";
  const hostName = params.get("name")?.trim() ?? "";

  const [guestName, setGuestName] = useState("");
  const [guestReady, setGuestReady] = useState(false);

  const displayName = intentHost ? hostName : guestName.trim();
  const roomTitle = intentHost ? hostRoom : "";

  const ready = intentHost
    ? Boolean(displayName && roomTitle && hostName && hostRoom)
    : guestReady && Boolean(displayName);

  const { snapshot, send, connected, lastError, setLastError } =
    usePlanningSocket(ready);

  const boot = useRef(false);

  useEffect(() => {
    if (intentHost && (!hostName || !hostRoom)) {
      router.replace("/anfitriao");
    }
  }, [intentHost, hostName, hostRoom, router]);

  useEffect(() => {
    if (!connected) {
      boot.current = false;
    }
  }, [connected]);

  useEffect(() => {
    if (!connected || !ready) return;
    if (intentHost) {
      if (boot.current) return;
      const msg: ClientMessage = {
        type: "HOST_INIT",
        roomName: roomTitle,
        displayName: displayName.trim(),
      };
      send(msg);
      boot.current = true;
      return;
    }
    if (!snapshot?.roomOpen) return;
    if (boot.current) return;
    send({
      type: "GUEST_JOIN",
      displayName: displayName.trim(),
    });
    boot.current = true;
  }, [
    connected,
    displayName,
    intentHost,
    ready,
    roomTitle,
    send,
    snapshot?.roomOpen,
  ]);

  if (intentHost && (!hostName || !hostRoom)) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-ink-muted">
        Redirecionando para o cadastro do anfitrião...
      </div>
    );
  }

  if (!intentHost && !guestReady) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-4 py-10">
        <div>
          <p className="text-ink-muted text-xs uppercase tracking-[0.26em]">Convidado</p>
          <h1 className="font-display text-3xl font-semibold">Entrar na sala</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Uma única sala compartilhada — use o mesmo link que o anfitrião enviou.
          </p>
        </div>
        <div className="glass-panel space-y-3 p-6">
          <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
            Seu nome
          </label>
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Como quer aparecer na mesa"
            className="w-full rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
          />
          <button
            type="button"
            disabled={!guestName.trim()}
            onClick={() => setGuestReady(true)}
            className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            Conectar
          </button>
        </div>
      </div>
    );
  }

  if (!ready || !snapshot) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center text-sm text-ink-muted">
        Conectando à sala compartilhada...
      </div>
    );
  }

  return (
    <RoomView
      snapshot={snapshot}
      send={send}
      connected={connected}
      lastError={lastError}
      onDismissError={() => setLastError(null)}
      intentHost={intentHost}
    />
  );
}

export default function SalaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-ink-muted">
          Carregando sala...
        </div>
      }
    >
      <SalaContent />
    </Suspense>
  );
}
