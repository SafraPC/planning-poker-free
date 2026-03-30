"use client";

import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MAX_PARTICIPANTS } from "@shared/types";
import type { RoomSnapshot, TaskPayload, VoteValue } from "@shared/types";
import { computeAgreement, isFullUnanimity } from "@shared/vote-stats";
import type { ClientMessage } from "@shared/wire";
import { DramaOverlay } from "@/components/drama-overlay";
import { PokerTable } from "@/components/poker-table";
import { ResultsPanel } from "@/components/results-panel";
import { TaskEditor } from "@/components/task-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { UnanimityConfetti } from "@/components/unanimity-confetti";
import { VotePicker } from "@/components/vote-picker";
import { cn } from "@/lib/cn";

function WaitCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="text-ink-muted max-w-md text-sm">{subtitle}</p>
    </div>
  );
}

export function RoomView({
  snapshot,
  send,
  connected,
  lastError,
  onDismissError,
  intentHost,
}: {
  snapshot: RoomSnapshot;
  send: (m: ClientMessage) => void;
  connected: boolean;
  lastError: string | null;
  onDismissError: () => void;
  intentHost: boolean;
}) {
  const self = snapshot.members.find((m) => m.id === snapshot.selfId);
  const isHost = snapshot.isHost;
  const [taskDraft, setTaskDraft] = useState<TaskPayload>(
    snapshot.task ?? { title: "", jiraKey: "", description: "" },
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (snapshot.task) {
      setTaskDraft(snapshot.task);
    }
  }, [snapshot.task?.title, snapshot.task?.jiraKey, snapshot.task?.description, snapshot.task]);

  useEffect(() => {
    if (!isHost || snapshot.phase !== "draft") return;
    const handle = window.setTimeout(() => {
      send({
        type: "SET_TASK",
        task: {
          title: taskDraft.title,
          jiraKey: taskDraft.jiraKey,
          description: taskDraft.description,
        },
      });
    }, 450);
    return () => window.clearTimeout(handle);
  }, [taskDraft, isHost, snapshot.phase, send]);

  const votes = useMemo(
    () =>
      snapshot.members
        .map((m) => m.vote)
        .filter((v): v is VoteValue => v !== null),
    [snapshot.members],
  );

  const agreement = useMemo(() => computeAgreement(votes), [votes]);
  const celebrate = snapshot.phase === "revealed" && isFullUnanimity(votes);

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/sala` : "";

  async function copyInvite() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (
    intentHost &&
    snapshot.phase === "awaiting_host" &&
    snapshot.members.length === 0
  ) {
    return (
      <WaitCard
        title="Abrindo sua mesa"
        subtitle="Estamos reservando seu lugar de anfitrião na sala única."
      />
    );
  }

  if (
    !intentHost &&
    !snapshot.members.some((m) => m.id === snapshot.selfId)
  ) {
    if (!snapshot.roomOpen) {
      return (
        <WaitCard
          title="Aguardando anfitrião"
          subtitle="Assim que a sala for criada você entrará automaticamente na mesma mesa."
        />
      );
    }
    return (
      <WaitCard
        title="Entrando na sala"
        subtitle="Sincronizando seu nome com os demais participantes."
      />
    );
  }

  const tableCenter = (
    <div className="relative flex w-full flex-col items-center gap-4 text-center">
      <DramaOverlay endsAt={snapshot.phase === "revealing" ? snapshot.revealEndsAt : null} />
      {snapshot.phase === "lobby" ? (
        <div className="space-y-3 px-2">
          <p className="font-display text-lg text-ink">Sala pronta</p>
          <p className="text-ink-muted text-sm">
            Compartilhe o link com o time ({snapshot.members.length}/{MAX_PARTICIPANTS}).
          </p>
          {isHost ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={copyInvite}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/40 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar convite"}
              </button>
              <button
                type="button"
                onClick={() => send({ type: "HOST_ENTER_DRAFT" })}
                className="rounded-2xl bg-accent px-5 py-2 text-sm font-semibold text-white shadow-md"
              >
                Ir para o rascunho
              </button>
            </div>
          ) : (
            <p className="text-ink-muted text-sm">Aguardando o anfitrião iniciar o rascunho.</p>
          )}
        </div>
      ) : null}

      {snapshot.phase === "draft" ? (
        <div className="flex w-full flex-col items-center gap-4">
          {isHost ? (
            <TaskEditor task={taskDraft} onChange={setTaskDraft} />
          ) : (
            <TaskEditor
              task={taskDraft}
              readOnly
              onChange={() => undefined}
            />
          )}
          {isHost ? (
            <button
              type="button"
              onClick={() => send({ type: "HOST_START_VOTING" })}
              className="rounded-2xl bg-accent px-6 py-3 font-semibold text-white shadow-lg"
            >
              Iniciar votação
            </button>
          ) : (
            <p className="text-ink-muted text-sm">Aguardando o anfitrião abrir a votação.</p>
          )}
        </div>
      ) : null}

      {snapshot.phase === "voting" ? (
        <div className="flex w-full flex-col items-center gap-4 px-2">
          {self ? (
            <VotePicker
              selected={self.vote}
              onPick={(v) => send({ type: "CAST_VOTE", vote: v })}
            />
          ) : null}
          {isHost ? (
            <button
              type="button"
              onClick={() => send({ type: "HOST_REVEAL" })}
              className="rounded-2xl border border-white/20 bg-white/30 px-6 py-3 text-sm font-semibold backdrop-blur-md dark:border-white/10 dark:bg-white/10"
            >
              Revelar cartas
            </button>
          ) : (
            <p className="text-ink-muted text-xs">O anfitrião revelará quando todos estiverem prontos.</p>
          )}
        </div>
      ) : null}

      {snapshot.phase === "revealing" ? (
        <p className="text-ink-muted text-sm">Preparando a revelação...</p>
      ) : null}

      {snapshot.phase === "revealed" ? (
        <div className="flex w-full flex-col items-center gap-3">
          <button
            type="button"
            disabled={!isHost}
            onClick={() => send({ type: "HOST_NEW_ROUND" })}
            className={cn(
              "rounded-2xl px-6 py-3 text-sm font-semibold shadow-md",
              isHost
                ? "bg-table-inner text-ink dark:bg-white/10 dark:text-white"
                : "cursor-not-allowed opacity-50",
            )}
          >
            Iniciar nova votação
          </button>
          {!isHost ? (
            <p className="text-ink-muted text-xs">Somente o anfitrião reinicia a mesa.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 pb-16 pt-8">
      <UnanimityConfetti fire={celebrate} />
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-ink-muted text-xs uppercase tracking-[0.24em]">Planning poker</p>
          <h1 className="font-display text-3xl font-semibold">{snapshot.roomName || "Sala"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
              connected
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-200",
            )}
          >
            {connected ? (
              "Conectado"
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Conectando
              </>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>
      {lastError ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200"
        >
          <span>{lastError}</span>
          <button type="button" className="text-xs font-semibold" onClick={onDismissError}>
            Fechar
          </button>
        </motion.div>
      ) : null}
      <PokerTable
        members={snapshot.members}
        selfId={snapshot.selfId}
        phase={snapshot.phase}
        modeValue={agreement.mode}
        center={tableCenter}
      />
      {snapshot.phase === "revealed" ? <ResultsPanel votes={votes} /> : null}
    </div>
  );
}
