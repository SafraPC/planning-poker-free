"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateRoomToken } from "@/lib/room-token";
import { upsertRoomSession } from "@/lib/room-sessions";

export default function AnfitriaoPage() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = room.trim();
    const n = name.trim();
    if (!r || !n) return;
    const token = generateRoomToken();
    upsertRoomSession({
      token,
      roomName: r,
      displayName: n,
      role: "host",
      lastConnectedAt: Date.now(),
    });
    const q = new URLSearchParams({ host: "1", room: r, name: n, token });
    router.push(`/sala?${q.toString()}`);
  }

  return (
    <div className="relative isolate min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col gap-12 px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Início
          </Link>
          <ThemeToggle />
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            Modo anfitrião
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tighter sm:text-5xl">
            Crie a sala e
            <br />
            convide até 8 pessoas.
          </h1>
          <p className="max-w-md text-base text-ink-muted">
            Um token único abre a sala no PartyKit. O convite é{" "}
            <span className="whitespace-nowrap">/sala?token=…</span> — envie o link
            completo.
          </p>
        </div>

        <form onSubmit={submit} className="surface-card space-y-5 p-6 shadow-card">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="room-name">Nome da sala</FieldLabel>
            <Input
              id="room-name"
              required
              autoFocus
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Time Safra — Sprint 42"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="host-name">Como você aparece</FieldLabel>
            <Input
              id="host-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome ou apelido"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!room.trim() || !name.trim()}
          >
            Abrir sala
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
