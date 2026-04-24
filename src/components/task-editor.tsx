"use client";

import { useEffect, useRef } from "react";
import type { TaskPayload } from "@shared/types";
import { FieldLabel, Input, Textarea } from "@/components/ui/input";

interface Props {
  task: TaskPayload;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange: (t: TaskPayload) => void;
}

export function TaskEditor({ task, readOnly, autoFocus, onChange }: Props) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus && !readOnly) {
      titleRef.current?.focus();
    }
  }, [autoFocus, readOnly]);

  return (
    <div className="surface-card w-full max-w-2xl space-y-4 p-5 shadow-soft">
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="task-title">Título</FieldLabel>
        <Input
          id="task-title"
          ref={titleRef}
          value={task.title}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          placeholder="Ex.: Refatorar checkout"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="task-notes">Notas</FieldLabel>
        <Textarea
          id="task-notes"
          value={task.description ?? ""}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          rows={4}
          placeholder="Contexto rápido, critérios, links..."
        />
      </div>
    </div>
  );
}
