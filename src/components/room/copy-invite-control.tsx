"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { COPY_FEEDBACK_MS } from "@/lib/constants";

export function CopyInviteControl({
  inviteUrl,
  size = "sm",
  label = "Copiar link",
  className,
}: {
  inviteUrl: string;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyInvite() {
    if (typeof window === "undefined" || !inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }

  if (!inviteUrl) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      size={size}
      onClick={copyInvite}
      className={className ?? "shrink-0"}
      aria-label="Copiar link de convite da sala"
      title={inviteUrl}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Link2 className="h-3.5 w-3.5" aria-hidden />
      )}
      <span
        className={size === "sm" ? "hidden min-[380px]:inline" : ""}
        aria-live="polite"
      >
        {copied ? "Copiado" : label}
      </span>
    </Button>
  );
}
