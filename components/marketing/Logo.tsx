import { cn } from "@/lib/utils/cn";

/**
 * Placeholder mark: an ascending bar sequence (ranking climb) cutting through a
 * ring (a certified/verified badge). Swap this file wholesale once real brand
 * assets exist — nothing else references its internals.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="8" y="18" width="3.4" height="7" rx="1" fill="currentColor" />
      <rect x="13.5" y="13" width="3.4" height="12" rx="1" fill="currentColor" />
      <rect x="19" y="7" width="3.4" height="18" rx="1" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-text-primary", className)}>
      <LogoMark className={cn("text-accent", markClassName)} />
      <span className="font-display text-lg font-semibold tracking-tight">SGA</span>
    </span>
  );
}
