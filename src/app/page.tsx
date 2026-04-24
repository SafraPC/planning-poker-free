import { ArrowRight, Radio, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent/10" />
      <div className="noise pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-16 pt-10">
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-accent/15 text-accent flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg font-semibold">
              PP
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Planning Poker Free</p>
              <p className="text-ink-muted text-xs">Estimativas em camiseta, ao vivo</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-accent inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em]">
              <Sparkles className="h-4 w-4" />
              Sem cadastro • WebSocket em tempo real
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Decisões alinhadas, estética premium e zero fricção
            </h1>
            <p className="text-ink-muted max-w-2xl text-lg">
              Uma sala única pensada para squads que precisam estimar rápido: cartas XS–XL, pausa com café
              fora das estatísticas, contagem dramática e confetes na unanimidade.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/anfitriao"
                className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-transform active:translate-y-[1px]"
              >
                Sou anfitrião
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sala"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/40 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:border-accent/50 dark:border-white/10 dark:bg-white/5"
              >
                Entrar como convidado
              </Link>
            </div>
          </div>
          <div className="glass-panel relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
            <div className="relative space-y-4">
              {[
                {
                  icon: Radio,
                  title: "PartyKit WebSockets",
                  body: "Tempo real na borda com uma sala compartilhada — ideal para Vercel + PartyKit.",
                },
                {
                  icon: ShieldCheck,
                  title: "Sem persistência",
                  body: "Os dados vivem na sessão ao vivo: privacidade simples para times internos.",
                },
                {
                  icon: Sparkles,
                  title: "Experiência cinematográfica",
                  body: "Contagem regressiva dramática, cartas com flip 3D e confetes na unanimidade.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <item.icon className="text-accent mt-1 h-6 w-6" />
                  <div>
                    <p className="font-display text-base font-semibold">{item.title}</p>
                    <p className="text-ink-muted text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
