"use client";

import type { TaskPayload } from "@shared/types";
import { TaskEditor } from "@/components/task-editor";
import { Button } from "@/components/ui/button";

interface Props {
  isHost: boolean;
  task: TaskPayload;
  onTaskChange: (task: TaskPayload) => void;
  onStartVoting: () => void;
}

export function DraftPanel({
  isHost,
  task,
  onTaskChange,
  onStartVoting,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-2">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Rascunho
        </p>
        <p className="mt-1.5 font-display text-xl font-semibold tracking-tight">
          {isHost ? "O que vamos estimar?" : "Definindo o que estimar..."}
        </p>
      </div>
      <TaskEditor
        task={task}
        readOnly={!isHost}
        autoFocus={isHost}
        onChange={onTaskChange}
      />
      {isHost ? (
        <Button size="lg" onClick={onStartVoting}>
          Iniciar votação
        </Button>
      ) : (
        <p className="text-sm text-ink-muted">
          Aguardando o anfitrião abrir a votação.
        </p>
      )}
    </div>
  );
}
