"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ClientMessage } from "@shared/wire";
import { RoomView } from "@/components/room-view";
import { GuestEntry } from "@/components/room/guest-entry";
import { WaitCard } from "@/components/room/wait-card";
import { usePlanningSocket } from "@/hooks/use-planning-socket";
import { buildSalaUrlWithToken } from "@/lib/invite-url";
import {
  getMostRecentFreshSession,
  pruneExpiredSessions,
  upsertRoomSession,
} from "@/lib/room-sessions";

function SalaContent() {
  const router = useRouter();
  const params = useSearchParams();
  const roomToken = params.get("token")?.trim() ?? "";
  const intentHost = params.get("host") === "1";
  const hostRoom = params.get("room")?.trim() ?? "";
  const hostName = params.get("name")?.trim() ?? "";
  const nameParam = params.get("name")?.trim() ?? "";

  const [entryReady, setEntryReady] = useState(false);
  const [guestName, setGuestName] = useState(nameParam);
  const [guestReady, setGuestReady] = useState(Boolean(nameParam));

  const displayName = intentHost ? hostName : guestName.trim();
  const roomTitle = intentHost ? hostRoom : "";

  const socketEnabled =
    Boolean(roomToken) &&
    (intentHost
      ? Boolean(hostName && hostRoom)
      : guestReady && Boolean(displayName));

  const { snapshot, send, connected, lastError, setLastError } =
    usePlanningSocket(socketEnabled, roomToken || null);

  const [inviteOrigin, setInviteOrigin] = useState("");

  const boot = useRef(false);

  useEffect(() => {
    setInviteOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (roomToken) {
      setEntryReady(true);
      return;
    }
    pruneExpiredSessions();
    const s = getMostRecentFreshSession();
    if (s) {
      if (s.role === "host") {
        router.replace(
          `/sala?${new URLSearchParams({ host: "1", token: s.token, room: s.roomName, name: s.displayName }).toString()}`,
        );
        return;
      }
      router.replace(
        `/sala?${new URLSearchParams({ token: s.token, name: s.displayName }).toString()}`,
      );
      return;
    }
    setEntryReady(true);
  }, [roomToken, router]);

  useEffect(() => {
    if (intentHost && !roomToken) {
      router.replace("/anfitriao");
    }
  }, [intentHost, roomToken, router]);

  useEffect(() => {
    if (!roomToken || !snapshot) return;
    const me = snapshot.members.find((m) => m.id === snapshot.selfId);
    if (!me) return;
    upsertRoomSession({
      token: roomToken,
      roomName: snapshot.roomName,
      displayName: me.name,
      role: snapshot.isHost ? "host" : "guest",
      lastConnectedAt: Date.now(),
    });
  }, [roomToken, snapshot]);

  useEffect(() => {
    if (!connected) {
      boot.current = false;
    }
  }, [connected]);

  useEffect(() => {
    if (!connected || !socketEnabled) return;
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
    roomTitle,
    send,
    snapshot?.roomOpen,
    socketEnabled,
  ]);

  const inviteUrl =
    inviteOrigin && roomToken
      ? buildSalaUrlWithToken(inviteOrigin, roomToken)
      : "";

  if (!entryReady) {
    return (
      <WaitCard
        title="Carregando"
        subtitle="Verificando sessão salva neste aparelho..."
      />
    );
  }

  if (intentHost && (!hostName || !hostRoom)) {
    return (
      <WaitCard
        title="Redirecionando"
        subtitle="Voltando para o cadastro do anfitrião..."
      />
    );
  }

  if (!roomToken) {
    return (
      <div className="relative isolate mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            Sala
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Link necessário
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Abra a sala por um convite com token ou crie uma como anfitrião.
            Sessões recentes (até 10 min) reconectam sozinhas.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/anfitriao"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-ink text-sm font-medium text-surface shadow-soft"
          >
            Criar sala
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-border bg-surface-elevated text-sm font-medium text-ink"
          >
            Início
          </Link>
        </div>
      </div>
    );
  }

  if (!intentHost && !guestReady) {
    return (
      <GuestEntry
        onJoin={(n) => {
          setGuestName(n);
          setGuestReady(true);
        }}
      />
    );
  }

  if (!socketEnabled || !snapshot) {
    return (
      <WaitCard
        title="Conectando"
        subtitle="WebSocket e sala por token no PartyKit."
      />
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
      inviteUrl={inviteUrl}
    />
  );
}

export default function SalaPage() {
  return (
    <Suspense
      fallback={
        <WaitCard
          title="Carregando"
          subtitle="Preparando a mesa de planning poker..."
        />
      }
    >
      <SalaContent />
    </Suspense>
  );
}
