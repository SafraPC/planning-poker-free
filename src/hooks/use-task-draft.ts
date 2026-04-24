"use client";

import { useEffect, useState } from "react";
import type { Phase, TaskPayload } from "@shared/types";
import type { ClientMessage } from "@shared/wire";
import { TASK_SYNC_DEBOUNCE_MS } from "@/lib/constants";

const EMPTY_TASK: TaskPayload = { title: "", description: "" };

export function useTaskDraft({
  remoteTask,
  isHost,
  phase,
  send,
}: {
  remoteTask: TaskPayload | null;
  isHost: boolean;
  phase: Phase;
  send: (msg: ClientMessage) => void;
}) {
  const [draft, setDraft] = useState<TaskPayload>(remoteTask ?? EMPTY_TASK);

  useEffect(() => {
    if (remoteTask) {
      setDraft(remoteTask);
    }
  }, [remoteTask?.title, remoteTask?.description, remoteTask]);

  useEffect(() => {
    if (!isHost || phase !== "draft") return;
    const handle = window.setTimeout(() => {
      send({
        type: "SET_TASK",
        task: { title: draft.title, description: draft.description },
      });
    }, TASK_SYNC_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [draft, isHost, phase, send]);

  return [draft, setDraft] as const;
}
