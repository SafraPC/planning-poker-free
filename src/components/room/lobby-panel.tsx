"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { MAX_PARTICIPANTS } from "@shared/types";
import { COPY_FEEDBACK_MS, INVITE_PATH } from "@/lib/constants";

interface Props {
  isHost: boolean;
  memberCount: number;
  onEnterDraft: () => void;
}

export function LobbyPanel({ isHost, memberCount, onEnterDraft }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyInvite() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${INVITE_PATH}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }

  return (
    <div className="space-y-3 px-2">
      <p className="font-display text-lg text-ink">Sala pronta</p>
      <p className="text-ink-muted text-sm">
        Compartilhe o link com o time ({memberCount}/{MAX_PARTICIPANTS}).
      </p>
      {isHost ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={copyInvite}
            aria-live="polite"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/40 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Link2 className="h-4 w-4" aria-hidden />
            )}
            {copied ? "Copiado" : "Copiar convite"}
          </button>
          <button
            type="button"
            onClick={onEnterDraft}
            className="rounded-2xl bg-accent px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            Ir para o rascunho
          </button>
        </div>
      ) : (
        <p className="text-ink-muted text-sm">
          Aguardando o anfitrião iniciar o rascunho.
        </p>
      )}
    </div>
  );
}
