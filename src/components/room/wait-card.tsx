"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function WaitCard({
  title,
  subtitle,
  tone = "loading",
}: {
  title: string;
  subtitle: string;
  tone?: "loading" | "error";
}) {
  const err = tone === "error";
  return (
    <div className="relative isolate min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-12 text-center">
        <div className="surface-card w-full p-8 shadow-card">
          <div
            className={cn(
              "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl",
              err ? "bg-danger/10" : "bg-surface-muted",
            )}
          >
            {err ? (
              <AlertCircle
                className="h-6 w-6 text-danger"
                strokeWidth={2.5}
                aria-hidden
              />
            ) : (
              <Loader2
                className="h-6 w-6 animate-spin text-ink"
                strokeWidth={2.5}
                aria-hidden
              />
            )}
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h1>
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              err ? "text-danger" : "text-ink-muted",
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
