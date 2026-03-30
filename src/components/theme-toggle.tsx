"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10",
          className,
        )}
      />
    );
  }
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? "Tema claro" : "Tema escuro"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-ink shadow-card backdrop-blur-md transition-colors hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
        className,
      )}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
