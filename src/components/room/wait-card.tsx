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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="text-ink-muted max-w-md text-sm">{subtitle}</p>
    </div>
  );
}
