"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Check } from "lucide-react";
import type { StagePhase } from "./useHeroSequence";
import { StageFrame } from "./StageFrame";

export function QRCheckIn({ phase }: { phase: StagePhase }) {
  return (
    <StageFrame phase={phase} className="flex items-center gap-3 p-4">
      <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-strong bg-bg-raised text-text-secondary">
        <QrCode className="size-7" />
        {phase === "active" && (
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_8px_var(--accent)]"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        )}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-bg-raised/90"
            >
              <Check className="size-6 text-accent" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-text-primary">Bay check-in</p>
        <p className="text-xs text-text-muted">
          {phase === "active" ? "Scanning bay QR…" : phase === "done" ? "Checked in" : "Awaiting scan"}
        </p>
      </div>
    </StageFrame>
  );
}
