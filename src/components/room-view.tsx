"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import type { RoomSnapshot, VoteValue } from "@shared/types";
import { computeAgreement, isFullUnanimity } from "@shared/vote-stats";
import type { ClientMessage } from "@shared/wire";
import { DramaOverlay } from "@/components/drama-overlay";
import { PokerTable } from "@/components/poker-table";
import { ResultsPanel } from "@/components/results-panel";
import { UnanimityConfetti } from "@/components/unanimity-confetti";
import { DraftPanel } from "@/components/room/draft-panel";
import { ErrorBanner } from "@/components/room/error-banner";
import { LobbyPanel } from "@/components/room/lobby-panel";
import { RevealedPanel } from "@/components/room/revealed-panel";
import { RoomHeader } from "@/components/room/room-header";
import { VotingPanel } from "@/components/room/voting-panel";
import { WaitCard } from "@/components/room/wait-card";
import { useTaskDraft } from "@/hooks/use-task-draft";

interface Props {
  snapshot: RoomSnapshot;
  send: (msg: ClientMessage) => void;
  connected: boolean;
  lastError: string | null;
  onDismissError: () => void;
  intentHost: boolean;
}

function PhaseStage({
  snapshot,
  send,
  taskDraft,
  setTaskDraft,
}: {
  snapshot: RoomSnapshot;
  send: (msg: ClientMessage) => void;
  taskDraft: ReturnType<typeof useTaskDraft>[0];
  setTaskDraft: ReturnType<typeof useTaskDraft>[1];
}) {
  const { phase, isHost, members, selfId } = snapshot;
  const self = members.find((m) => m.id === selfId);

  if (phase === "lobby") {
    return (
      <LobbyPanel
        isHost={isHost}
        memberCount={members.length}
        onEnterDraft={() => send({ type: "HOST_ENTER_DRAFT" })}
      />
    );
  }
  if (phase === "draft") {
    return (
      <DraftPanel
        isHost={isHost}
        task={taskDraft}
        onTaskChange={setTaskDraft}
        onStartVoting={() => send({ type: "HOST_START_VOTING" })}
      />
    );
  }
  if (phase === "voting") {
    return (
      <VotingPanel
        isHost={isHost}
        self={self}
        onVote={(v) => send({ type: "CAST_VOTE", vote: v })}
        onReveal={() => send({ type: "HOST_REVEAL" })}
      />
    );
  }
  if (phase === "revealing") {
    return (
      <p className="text-ink-muted text-sm" aria-live="polite">
        Preparando a revelação...
      </p>
    );
  }
  if (phase === "revealed") {
    return (
      <RevealedPanel
        isHost={isHost}
        onNewRound={() => send({ type: "HOST_NEW_ROUND" })}
      />
    );
  }
  return null;
}

export function RoomView({
  snapshot,
  send,
  connected,
  lastError,
  onDismissError,
  intentHost,
}: Props) {
  const [taskDraft, setTaskDraft] = useTaskDraft({
    remoteTask: snapshot.task,
    isHost: snapshot.isHost,
    phase: snapshot.phase,
    send,
  });

  const votes = useMemo(
    () =>
      snapshot.members
        .map((m) => m.vote)
        .filter((v): v is VoteValue => v !== null),
    [snapshot.members],
  );

  const agreement = useMemo(() => computeAgreement(votes), [votes]);
  const celebrate = snapshot.phase === "revealed" && isFullUnanimity(votes);

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
      <DramaOverlay
        endsAt={snapshot.phase === "revealing" ? snapshot.revealEndsAt : null}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={snapshot.phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex w-full flex-col items-center gap-4"
        >
          <PhaseStage
            snapshot={snapshot}
            send={send}
            taskDraft={taskDraft}
            setTaskDraft={setTaskDraft}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 pb-16 pt-8">
      <UnanimityConfetti fire={celebrate} />
      <RoomHeader roomName={snapshot.roomName} connected={connected} />
      <AnimatePresence>
        {lastError ? (
          <ErrorBanner message={lastError} onDismiss={onDismissError} />
        ) : null}
      </AnimatePresence>
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
