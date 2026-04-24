"use client";

import type { TaskPayload } from "@shared/types";
import { TaskEditor } from "@/components/task-editor";

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
    <div className="flex w-full flex-col items-center gap-4">
      <TaskEditor
        task={task}
        readOnly={!isHost}
        autoFocus={isHost}
        onChange={onTaskChange}
      />
      {isHost ? (
        <button
          type="button"
          onClick={onStartVoting}
          className="rounded-2xl bg-accent px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
        >
          Iniciar votação
        </button>
      ) : (
        <p className="text-ink-muted text-sm">
          Aguardando o anfitrião abrir a votação.
        </p>
      )}
    </div>
  );
}
