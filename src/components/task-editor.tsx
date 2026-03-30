"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import type { TaskPayload } from "@shared/types";
import { cn } from "@/lib/cn";

export function TaskEditor({
  task,
  readOnly,
  onChange,
}: {
  task: TaskPayload;
  readOnly?: boolean;
  onChange: (t: TaskPayload) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function pullJira() {
    const key = task.jiraKey?.trim();
    if (!key) {
      setHint("Informe a chave do Jira.");
      return;
    }
    setBusy(true);
    setHint(null);
    try {
      const res = await fetch("/api/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = (await res.json()) as {
        configured?: boolean;
        summary?: string;
        description?: string;
        error?: string;
      };
      if (data.configured === false) {
        setHint("Integração Jira não configurada no servidor.");
        return;
      }
      if (!res.ok) {
        setHint(data.error ?? "Não foi possível buscar a issue.");
        return;
      }
      onChange({
        ...task,
        title: task.title || data.summary || task.title,
        description: data.description ?? task.description,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel w-full max-w-2xl space-y-4 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
          Título
        </label>
        <input
          value={task.title}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          placeholder="Ex.: Refatorar checkout"
          className="rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm font-medium text-ink shadow-inner outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
            Jira (opcional)
          </label>
          <input
            value={task.jiraKey ?? ""}
            disabled={readOnly}
            onChange={(e) => onChange({ ...task, jiraKey: e.target.value })}
            placeholder="PROJ-123"
            className="mt-1 w-full rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm font-medium outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
          />
        </div>
        <button
          type="button"
          onClick={pullJira}
          disabled={readOnly || busy}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-md transition-opacity",
            (readOnly || busy) && "cursor-not-allowed opacity-60",
          )}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Buscar
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-ink-muted text-xs font-semibold uppercase tracking-wide">
          Notas
        </label>
        <textarea
          value={task.description ?? ""}
          disabled={readOnly}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          rows={4}
          placeholder="Contexto rápido, critérios, links..."
          className="rounded-2xl border border-white/15 bg-white/60 px-4 py-3 text-sm outline-none ring-accent focus:ring-2 dark:border-white/10 dark:bg-table-inner"
        />
      </div>
      {hint ? (
        <p className="text-sm text-amber-600 dark:text-amber-300">{hint}</p>
      ) : null}
    </div>
  );
}
