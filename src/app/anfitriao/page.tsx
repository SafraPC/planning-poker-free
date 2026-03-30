"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const LS_NAME = "pp_display_name";
const LS_ROOM = "pp_room_name";

export default function AnfitriaoPage() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!room.trim() || !name.trim()) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(LS_ROOM, room.trim());
      sessionStorage.setItem(LS_NAME, name.trim());
    }
    const q = new URLSearchParams({
      host: "1",
      room: room.trim(),
      name: name.trim(),
    });
    router.push(`/sala?${q.toString()}`);
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col gap-10 px-4 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-ink-muted text-sm hover:text-accent">
          ← Início
        </Link>
        <ThemeToggle />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-ink-muted inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em]">
            <Sparkles className="h-4 w-4 text-accent" />
            Modo anfitrião
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Crie a sala e convide até 8 pessoas
          </h1>
          <p className="text-ink-muted max-w-xl text-base">
            Esta instância mantém uma única sala em tempo real. Ao definir o nome do time,
            o link de convite fica pronto para enviar pelo Slack, e-mail ou Teams.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="glass-panel space-y-4 p-8"
        >
          <div className="space-y-2">
            <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
              Nome da sala
            </label>
            <input
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Time Safra — Sprint 42"
              className="w-full rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
              Como você aparece
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-semibold text-white shadow-lg transition-transform active:translate-y-[1px]"
          >
            Abrir sala
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
