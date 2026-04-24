"use client";

import { useEffect, useRef } from "react";
import type { TaskPayload } from "@shared/types";

const inputClass =
  "rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm font-medium text-ink shadow-inner outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner";

export function TaskEditor({
  task,
  readOnly,
  autoFocus,
  onChange,
}: {
  task: TaskPayload;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange: (t: TaskPayload) => void;
}) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus && !readOnly) {
      titleRef.current?.focus();
    }
  }, [autoFocus, readOnly]);

  return (
    <div className="glass-panel w-full max-w-2xl space-y-4 p-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="task-title"
          className="text-ink-muted text-xs font-semibold uppercase tracking-wide"
        >
          Título
        </label>
        <input
          id="task-title"
          ref={titleRef}
          value={task.title}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          placeholder="Ex.: Refatorar checkout"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="task-notes"
          className="text-ink-muted text-xs font-semibold uppercase tracking-wide"
        >
          Notas
        </label>
        <textarea
          id="task-notes"
          value={task.description ?? ""}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          rows={4}
          placeholder="Contexto rápido, critérios, links..."
          className={inputClass}
        />
      </div>
    </div>
  );
}
