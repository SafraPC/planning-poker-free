"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "elevated" | "soft" | "outline";

const VARIANTS: Record<Variant, string> = {
  elevated: "surface-card shadow-card",
  soft: "surface-soft",
  outline: "rounded-2xl border border-border bg-transparent",
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Card({ variant = "elevated", className, ...rest }: Props) {
  return <div className={cn(VARIANTS[variant], className)} {...rest} />;
}
