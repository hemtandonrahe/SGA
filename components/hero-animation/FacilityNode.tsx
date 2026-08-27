"use client";

import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import type { StagePhase } from "./useHeroSequence";
import { StageFrame } from "./StageFrame";

export function FacilityNode({ phase }: { phase: StagePhase }) {
  return (
    <StageFrame phase={phase} className="flex items-center gap-3 p-4">
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
        <Building2 className="size-4" />
        {phase === "active" && (
          <motion.span
            className="absolute inset-0 rounded-md border border-accent"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-text-primary">Fairway Social — Bay 04</p>
        <p className="flex items-center gap-1 text-xs text-text-muted">
          <MapPin className="size-3" /> SGA-Certified Facility
        </p>
      </div>
    </StageFrame>
  );
}
