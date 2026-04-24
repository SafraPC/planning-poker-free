"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-surface hover:bg-ink/90 dark:bg-ink dark:text-surface dark:hover:bg-ink/90 shadow-soft",
  secondary:
    "bg-surface-elevated text-ink border border-border hover:border-border-strong hover:bg-surface-muted",
  ghost: "bg-transparent text-ink hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90 shadow-soft",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-sm gap-2",
};

interface Props extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium tracking-tight transition-colors focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
