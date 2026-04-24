"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ClientMessage } from "@shared/wire";
import { RoomView } from "@/components/room-view";
import { GuestEntry } from "@/components/room/guest-entry";
import { WaitCard } from "@/components/room/wait-card";
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
      <WaitCard
        title="Redirecionando"
        subtitle="Voltando para o cadastro do anfitrião..."
      />
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

  if (!ready || !snapshot) {
    return (
      <WaitCard
        title="Conectando"
        subtitle="Estabelecendo o WebSocket com a sala compartilhada..."
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
