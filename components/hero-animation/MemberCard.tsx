"use client";

import { LogoMark } from "@/components/marketing/Logo";
import type { StagePhase } from "./useHeroSequence";
import { StageFrame } from "./StageFrame";

export function MemberCard({ phase }: { phase: StagePhase }) {
  return (
    <StageFrame phase={phase} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <LogoMark className="size-5" />
          <span className="font-display text-[11px] font-semibold uppercase tracking-wider">SGA Member</span>
        </div>
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">
          Digital ID
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-text-primary">J. Alvarez</p>
          <p className="text-xs text-text-muted">Member #SGA-04821</p>
        </div>
        <div className="grid grid-cols-3 gap-1" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="size-1.5 rounded-full bg-text-muted/50" />
          ))}
        </div>
      </div>
    </StageFrame>
  );
}
