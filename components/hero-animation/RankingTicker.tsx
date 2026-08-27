"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { StagePhase } from "./useHeroSequence";
import { StageFrame } from "./StageFrame";

type Row = { id: string; name: string };

const BASE: Row[] = [
  { id: "chen", name: "M. Chen" },
  { id: "silva", name: "R. Silva" },
  { id: "you", name: "You" },
  { id: "park", name: "K. Park" },
];

const CLIMBED: Row[] = [
  { id: "chen", name: "M. Chen" },
  { id: "you", name: "You" },
  { id: "silva", name: "R. Silva" },
  { id: "park", name: "K. Park" },
];

export function RankingTicker({ phase, compact }: { phase: StagePhase; compact?: boolean }) {
  const climbed = phase === "active" || phase === "done";
  const rows = (climbed ? CLIMBED : BASE).slice(0, compact ? 3 : 4);

  return (
    <StageFrame phase={phase} className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-text-primary">Regional ranking</p>
        {climbed && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp className="size-3.5" /> +1
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-1.5">
        {rows.map((row, i) => (
          <motion.li
            key={row.id}
            layout
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={
              "flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm " +
              (row.id === "you" ? "bg-accent-soft text-accent" : "text-text-secondary")
            }
          >
            <span className="font-display text-xs font-semibold tabular-nums">{i + 1}</span>
            <span className="truncate">{row.name}</span>
          </motion.li>
        ))}
      </ul>
    </StageFrame>
  );
}
