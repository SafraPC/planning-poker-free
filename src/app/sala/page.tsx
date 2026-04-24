"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage } from "@shared/wire";
import { EnterSalaInviteForm } from "@/components/enter-sala-invite-form";
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
import { ThemeToggle } from "@/components/theme-toggle";
import {
  clearLocalStoragePreservingUserIdAndDisplayName,
  setStoredDisplayName,
} from "@/lib/display-name";

function SalaContent() {
  const router = useRouter();
  const params = useSearchParams();
  const roomToken = params.get("token")?.trim() ?? "";
  const intentHost = params.get("host") === "1";
  const hostRoom = params.get("room")?.trim() ?? "";
  const hostName = params.get("name")?.trim() ?? "";
  const nameParam = params.get("name")?.trim() ?? "";

  const [entryReady, setEntryReady] = useState(!!roomToken);
  const [guestName, setGuestName] = useState(nameParam);
  const [guestReady, setGuestReady] = useState(Boolean(nameParam));

  const displayName = intentHost ? hostName : guestName.trim();
  const roomTitle = intentHost ? hostRoom : "";

  const socketEnabled =
    Boolean(roomToken) &&
    (intentHost ? Boolean(hostName && hostRoom) : true);

  const onRoomClosed = useCallback(() => {
    clearLocalStoragePreservingUserIdAndDisplayName();
    router.replace("/");
  }, [router]);

  const { snapshot, send, connected, reconnecting, lastError, setLastError } =
    usePlanningSocket(socketEnabled, roomToken || null, onRoomClosed);

  const [inviteOrigin, setInviteOrigin] = useState("");

  const boot = useRef(false);

  useEffect(() => {
    if (roomToken) {
      setEntryReady(true);
    }
  }, [roomToken]);

  useEffect(() => {
    setInviteOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (roomToken) {
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
    setStoredDisplayName(me.name);
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
    if (!guestReady) return;
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
    guestReady,
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
        subtitle="Conferindo se há uma sessão salva neste aparelho…"
      />
    );
  }

  if (intentHost && (!hostName || !hostRoom)) {
    return (
      <WaitCard
        title="Redirecionando"
        subtitle="Voltando para o cadastro do anfitrião…"
      />
    );
  }

  if (!roomToken) {
    return (
      <div className="relative isolate min-h-dvh">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
        <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-6 py-12">
          <div className="flex items-center justify-end">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Sala
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Link do convite
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Sem token na URL, cole o link completo. Com sessão recente, você
              entra sozinho se ainda for válida.
            </p>
          </div>
          <div className="surface-card p-6 shadow-card">
            <EnterSalaInviteForm />
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/anfitriao"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-ink text-sm font-medium text-surface"
            >
              Criar sala
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border text-sm text-ink"
            >
              Início
            </Link>
          </div>
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
        wsConnected={connected}
        roomOpen={snapshot?.roomOpen ?? null}
      />
    );
  }

  if (!socketEnabled || !snapshot) {
    return (
      <WaitCard
        title="Conectando"
        subtitle="Abrindo o canal com o PartyKit e carregando a mesa."
      />
    );
  }

  if (snapshot.phase === "room_closed") {
    return (
      <WaitCard
        title="Sala encerrada"
        subtitle="O anfitrião encerrou. Voltando ao início…"
      />
    );
  }

  return (
    <RoomView
      snapshot={snapshot}
      send={send}
      connected={connected}
      reconnecting={reconnecting}
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
          title="Abrindo sala"
          subtitle="Lendo o endereço e preparando a mesa…"
        />
      }
    >
      <SalaContent />
    </Suspense>
  );
}
