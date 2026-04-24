"use client";

import { motion } from "framer-motion";

interface Props {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200"
    >
      <span>{message}</span>
      <button
        type="button"
        className="text-xs font-semibold underline-offset-2 hover:underline"
        onClick={onDismiss}
      >
        Fechar
      </button>
    </motion.div>
  );
}
