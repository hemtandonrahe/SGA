"use client";

import { useEffect, useState } from "react";

export const STAGE_COUNT = 5;
export const STAGE_DURATION_MS = 2400;

export type StagePhase = "idle" | "active" | "done";

export function phaseFor(activeStep: number, stepIndex: number): StagePhase {
  if (activeStep === stepIndex) return "active";
  if (activeStep > stepIndex) return "done";
  return "idle";
}

/**
 * Cycles activeStep 0..STAGE_COUNT-1 on an interval, looping back to 0. `paused`
 * (off-screen, tab hidden, or prefers-reduced-motion) simply stops advancement —
 * callers decide what a paused/static render looks like.
 */
export function useHeroSequence(paused: boolean, stepDurationMs = STAGE_DURATION_MS) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveStep((step) => (step + 1) % STAGE_COUNT);
    }, stepDurationMs);
    return () => clearInterval(id);
  }, [paused, stepDurationMs]);

  return activeStep;
}
