import { ArrowRight, Coffee, Radio, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { EnterSalaInviteForm } from "@/components/enter-sala-invite-form";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  {
    icon: Radio,
    title: "Tempo real edge",
    body: "PartyKit em WebSocket de baixa latência. Cada token abre uma mesa isolada.",
  },
  {
    icon: ShieldCheck,
    title: "Sem persistência",
    body: "Estados vivem na memória da sessão. Nada salvo, nada exposto.",
  },
  {
    icon: Sparkles,
    title: "Reveal cinematográfico",
    body: "Contagem dramática de 3s, flip 3D nas cartas e confetes na unanimidade.",
  },
  {
    icon: Coffee,
    title: "Café neutro",
    body: "Quem só observa marca café — fora das estatísticas, dentro da mesa.",
  },
];

export default function HomePage() {
  return (
    <div className="relative isolate min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-surface font-display text-sm font-semibold tracking-tight">
              pp
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Planning Poker
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <section className="flex flex-col items-start gap-8 pt-8 sm:gap-10">
          <Badge tone="accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Free, sem cadastro, em tempo real
          </Badge>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl">
            Estimativas de squad,
            <br />
            <span className="text-ink-muted">sem fricção.</span>
          </h1>
          <p className="max-w-2xl text-lg text-ink-muted">
            Cada convite traz um token na URL (até 8 pessoas). Cartas em
            camiseta, café fora das estatísticas, do convite ao reveal.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/anfitriao"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-medium tracking-tight text-surface shadow-soft transition-transform hover:-translate-y-px"
            >
              Sou anfitrião
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="w-full max-w-lg">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Inserir convite aqui
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Cole a URL (ou o trecho com token). Com o link válido, a página abre
            a sala.
          </p>
          <div className="mt-4 surface-card p-5 shadow-card">
            <EnterSalaInviteForm variant="default" />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="surface-card flex gap-4 p-5 transition-colors hover:border-border-strong"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Deck
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
              XS · S · M · L · XL · ? · café
            </p>
          </div>
          <p className="max-w-xs text-sm text-ink-muted">
            2h, 4h, 6–8h, 16h, 32–40h, desconhecido e pausa. Café não soma — só
            participa da conversa.
          </p>
        </section>
      </div>
    </div>
  );
}
