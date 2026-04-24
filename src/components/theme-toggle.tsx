"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";
  const baseClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-ink-muted transition-colors hover:border-border-strong hover:text-ink";

  if (!mounted) {
    return <span className={cn(baseClass, className)} aria-hidden />;
  }

  return (
    <button
      type="button"
      aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(baseClass, "focus-ring", className)}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
