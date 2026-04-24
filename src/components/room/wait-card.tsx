"use client";

import { Loader2 } from "lucide-react";

export function WaitCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-ink-muted" aria-hidden />
      <p className="font-display text-2xl font-semibold tracking-tight">
        {title}
      </p>
      <p className="max-w-sm text-sm text-ink-muted">{subtitle}</p>
    </div>
  );
}
