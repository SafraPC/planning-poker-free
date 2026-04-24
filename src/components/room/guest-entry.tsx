"use client";

import { ArrowRight, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { getStoredDisplayName, setStoredDisplayName } from "@/lib/display-name";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

interface Props {
  onJoin: (name: string) => void;
  wsConnected: boolean;
  roomOpen: boolean | null;
}

export function GuestEntry({ onJoin, wsConnected, roomOpen }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getStoredDisplayName());
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n) {
      setStoredDisplayName(n);
      onJoin(n);
    }
  }

  const waitingForHost = wsConnected && roomOpen === false;
  const canTypeName = wsConnected && roomOpen !== false;

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
            Já estamos conectando ao PartyKit. Quando a sala estiver aberta, diga
            como quer ser chamado.
          </p>
          <div className="pt-1">
            <Badge tone={wsConnected ? "success" : "neutral"}>
              {wsConnected ? (
                <>
                  <Wifi className="h-3 w-3" aria-hidden />
                  Canal em tempo real
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" aria-hidden />
                  Conectando…
                </>
              )}
            </Badge>
          </div>
        </div>
        {waitingForHost ? (
          <div className="surface-card p-6 text-center shadow-card">
            <p className="font-display text-lg font-semibold text-ink">
              Ainda sem anfitrião ativo
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Quando a pessoa que criou a sala abrir, este passo destrava. Peça
              o link de novo se passou o tempo.
            </p>
          </div>
        ) : null}
        <form
          onSubmit={submit}
          className="surface-card space-y-5 p-6 shadow-card"
        >
          <div className="space-y-1.5">
            <FieldLabel htmlFor="guest-name">Como quer ser chamado</FieldLabel>
            <Input
              id="guest-name"
              autoFocus
              value={name}
              disabled={!canTypeName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Bia, João, @nick"
            />
            {!wsConnected ? (
              <p className="text-xs text-ink-muted">
                Abrindo o canal com o PartyKit…
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!name.trim() || !canTypeName}
          >
            Conectar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
