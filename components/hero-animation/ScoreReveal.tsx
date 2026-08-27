"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { StagePhase } from "./useHeroSequence";
import { StageFrame } from "./StageFrame";

const TARGET_SCORE = 74;

export function ScoreReveal({ phase }: { phase: StagePhase }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(rounded, "change", (v) => setDisplay(v));

  useEffect(() => {
    if (phase === "active") {
      const controls = animate(count, TARGET_SCORE, { duration: 1.1, ease: "easeOut" });
      return () => controls.stop();
    }
    if (phase === "done") count.set(TARGET_SCORE);
    if (phase === "idle") count.set(0);
  }, [phase, count]);

  return (
    <StageFrame phase={phase} className="flex items-center justify-between p-4">
      <div>
        <p className="font-display text-sm font-semibold text-text-primary">Round verified</p>
        <p className="text-xs text-text-muted">18 holes · Fairway Social</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-display text-2xl font-bold tabular-nums text-accent">{display}</span>
        {phase !== "idle" && <ShieldCheck className="size-4 text-accent" />}
      </div>
    </StageFrame>
  );
}
