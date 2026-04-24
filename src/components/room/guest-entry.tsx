"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

interface Props {
  onJoin: (name: string) => void;
}

export function GuestEntry({ onJoin }: Props) {
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n) onJoin(n);
  }

  return (
    <div className="relative isolate min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-10 px-6 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-surface font-display text-sm font-semibold tracking-tight">
              pp
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            Convidado
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tighter">
            Entrar na sala
          </h1>
          <p className="text-base text-ink-muted">
            Uma única sala compartilhada — use o mesmo link que o anfitrião
            enviou.
          </p>
        </div>
        <form onSubmit={submit} className="surface-card space-y-5 p-6 shadow-card">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="guest-name">Seu nome</FieldLabel>
            <Input
              id="guest-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer aparecer na mesa"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!name.trim()}
          >
            Conectar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
