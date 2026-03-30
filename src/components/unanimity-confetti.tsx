"use client";

import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export function UnanimityConfetti({ fire }: { fire: boolean }) {
  const finished = useRef(false);
  useEffect(() => {
    if (!fire) {
      finished.current = false;
      return;
    }
    if (finished.current) return;
    finished.current = true;
    const end = Date.now() + 2600;
    let raf = 0;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#38bdf8", "#34d399", "#fbbf24", "#a78bfa"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#38bdf8", "#34d399", "#fbbf24", "#a78bfa"],
      });
      if (Date.now() < end) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [fire]);
  return null;
}
