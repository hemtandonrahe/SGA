"use client";

import { motion } from "framer-motion";
import type { StagePhase } from "./useHeroSequence";

export function Connector({ phase }: { phase: StagePhase }) {
  const lit = phase === "active" || phase === "done";
  return (
    <div className="flex h-8 justify-center" aria-hidden="true">
      <svg width="2" height="32" viewBox="0 0 2 32" fill="none">
        <line x1="1" y1="0" x2="1" y2="32" stroke="var(--border-strong)" strokeWidth="2" />
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="32"
          stroke="var(--accent)"
          strokeWidth="2"
          initial={false}
          animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
