"use client";

import { AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="flex items-center justify-between gap-3 rounded-lg border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger"
    >
      <span className="inline-flex items-center gap-2">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {message}
      </span>
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-danger/10"
        onClick={onDismiss}
        aria-label="Fechar"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
