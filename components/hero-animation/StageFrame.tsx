"use client";

import { motion } from "framer-motion";
import type { StagePhase } from "./useHeroSequence";
import { cn } from "@/lib/utils/cn";

const variants = {
  idle: { opacity: 0.45, scale: 0.97 },
  active: { opacity: 1, scale: 1 },
  done: { opacity: 0.85, scale: 1 },
};

export function StageFrame({
  phase,
  className,
  children,
}: {
  phase: StagePhase;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={phase}
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "rounded-md border bg-bg-elevated-2/60 transition-colors duration-500",
        phase === "active" ? "border-accent-border shadow-[0_0_0_1px_var(--accent-soft),0_0_24px_var(--accent-soft)]" : "border-border-subtle",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
