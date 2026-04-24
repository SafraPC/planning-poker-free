"use client";

import type { TaskPayload } from "@shared/types";

interface Props {
  task: TaskPayload;
}

export function TaskHeadline({ task }: Props) {
  return (
    <div className="flex max-w-xl flex-col items-center gap-1.5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        Estimando
      </p>
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
        {task.title}
      </h2>
      {task.description ? (
        <p className="line-clamp-2 max-w-md text-sm text-ink-muted">
          {task.description}
        </p>
      ) : null}
    </div>
  );
}
