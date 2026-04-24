"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/input";
import { parseSalaInviteInput } from "@/lib/parse-sala-invite";
import { cn } from "@/lib/cn";

const AUTO_REDIRECT_MS = 500;

export function EnterSalaInviteForm({
  className,
  variant = "default",
  autoRedirect = true,
}: {
  className?: string;
  variant?: "default" | "compact";
  autoRedirect?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoRedirect) return;
    const t = value.trim();
    if (!t) return;
    const r = parseSalaInviteInput(t);
    if ("error" in r) return;
    const id = window.setTimeout(() => {
      const r2 = parseSalaInviteInput(value.trim());
      if ("error" in r2) return;
      router.push(r2.path);
    }, AUTO_REDIRECT_MS);
    return () => window.clearTimeout(id);
  }, [value, autoRedirect, router]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const r = parseSalaInviteInput(value);
    if ("error" in r) {
      setError(r.error);
      return;
    }
    router.push(r.path);
  }

  return (
    <form
      onSubmit={submit}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="space-y-1.5">
        <FieldLabel htmlFor="invite-link">Inserir convite aqui</FieldLabel>
        <Input
          id="invite-link"
          type="url"
          name="url"
          inputMode="url"
          autoComplete="url"
          placeholder="Cole a URL de convite (redireciona quando estiver completa)"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          className={variant === "compact" ? "text-sm" : ""}
        />
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size={variant === "compact" ? "md" : "lg"}
        className="w-full"
        disabled={!value.trim()}
      >
        <Link2 className="h-4 w-4" aria-hidden />
        Entrar na sala
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </form>
  );
}
