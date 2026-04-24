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
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <AnimatePresence>
      {endsAt ? (
        <motion.div
          role="status"
          aria-live="assertive"
          aria-label={`Revelando em ${left} segundo${left === 1 ? "" : "s"}`}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-surface/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={left}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="font-display text-7xl font-semibold tracking-tighter text-ink sm:text-8xl"
          >
            {left}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
