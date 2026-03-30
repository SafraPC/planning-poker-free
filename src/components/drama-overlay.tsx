"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DramaOverlay({ endsAt }: { endsAt: number | null }) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!endsAt) {
      setLeft(0);
      return;
    }
    const tick = () => {
      const ms = Math.max(0, endsAt - Date.now());
      setLeft(Math.ceil(ms / 1000));
    };
    tick();
    const id = window.setInterval(tick, 120);
    return () => window.clearInterval(id);
  }, [endsAt]);
  return (
    <AnimatePresence>
      {endsAt ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-surface/70 backdrop-blur-md dark:bg-surface/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={left}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="font-display text-6xl font-bold text-accent drop-shadow-sm sm:text-7xl"
          >
            {left}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
