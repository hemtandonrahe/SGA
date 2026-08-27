"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { MemberCard } from "./MemberCard";
import { FacilityNode } from "./FacilityNode";
import { QRCheckIn } from "./QRCheckIn";
import { ScoreReveal } from "./ScoreReveal";
import { RankingTicker } from "./RankingTicker";
import { Connector } from "./Connector";
import { STAGE_COUNT, phaseFor, useHeroSequence } from "./useHeroSequence";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const paused = Boolean(prefersReducedMotion) || !inView || tabHidden;
  const activeStep = useHeroSequence(paused);

  // Reduced motion: skip the loop entirely and render the fully "arrived" end state —
  // the headline/CTA next to it remain the real content either way.
  const effectiveStep = prefersReducedMotion ? STAGE_COUNT - 1 : activeStep;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mx-auto flex w-full max-w-sm flex-col gap-0 rounded-lg border border-border-subtle bg-bg-raised/60 p-5 backdrop-blur-sm"
    >
      <MemberCard phase={phaseFor(effectiveStep, 0)} />
      <Connector phase={phaseFor(effectiveStep, 1)} />
      <FacilityNode phase={phaseFor(effectiveStep, 1)} />
      <Connector phase={phaseFor(effectiveStep, 2)} />
      <QRCheckIn phase={phaseFor(effectiveStep, 2)} />
      <Connector phase={phaseFor(effectiveStep, 3)} />
      <ScoreReveal phase={phaseFor(effectiveStep, 3)} />
      <Connector phase={phaseFor(effectiveStep, 4)} />
      <RankingTicker phase={phaseFor(effectiveStep, 4)} compact={isMobile} />
    </div>
  );
}
