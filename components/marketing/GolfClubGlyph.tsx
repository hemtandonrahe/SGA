import { cn } from "@/lib/utils/cn";

/**
 * Stands in for the "l" in "golf" in the hero headline — sized in em units so it
 * scales with the surrounding heading text. The clubhead is drawn wide and flat
 * (not round) and stays within the normal ascender-to-baseline box — the heading
 * uses a tight line-height, so anything hanging below the baseline (like a real
 * club's head would) collided with the line below. A round head at this size also
 * just reads as a dot/lollipop, not a club — wide + a visible angled top edge is
 * what actually sells the "club head" silhouette at small sizes.
 */
export function GolfClubGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 100"
      aria-hidden="true"
      className={cn("inline-block h-[0.92em] w-auto translate-y-[0.02em] align-baseline text-accent", className)}
    >
      {/* Grip, with a wrapped-texture pattern */}
      <rect x="15.5" y="1" width="8" height="20" rx="3.4" fill="currentColor" />
      <g stroke="var(--bg-base)" strokeWidth="1.1" strokeLinecap="round" opacity="0.55">
        <line x1="16" y1="5.5" x2="23" y2="7.6" />
        <line x1="16" y1="9.5" x2="23" y2="11.6" />
        <line x1="16" y1="13.5" x2="23" y2="15.6" />
        <line x1="16" y1="17.5" x2="23" y2="19.3" />
      </g>

      {/* Shaft */}
      <path d="M 17.9 21 L 21 21 L 20.2 60 L 18.6 60 Z" fill="currentColor" />

      {/* Hosel: short bend from shaft into the clubhead */}
      <path d="M 18.4 59 L 20.6 59 L 22 65 L 17.2 65.6 Z" fill="currentColor" />

      {/* Clubhead: wide, flat iron-style blade — the width (not height) is what
          reads as "club" rather than "dot" at heading text size. Toe (right) runs
          long and low; heel (left, near the hosel) is short, matching a real
          iron's face profile. */}
      <path
        d="M 3 74
           C 3 69.5 8 66.3 14 65.6
           L 22 65
           C 30.5 65.4 37.5 68.3 37 74.5
           C 36.5 80.5 28.5 85 19 85
           C 9.5 85 3 80.5 3 74 Z"
        fill="currentColor"
      />
      {/* Score lines / grooves across the face for a touch of realism */}
      <g stroke="var(--bg-base)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
        <line x1="8" y1="73.5" x2="32.5" y2="73" />
        <line x1="7.5" y1="77.5" x2="33" y2="77" />
        <line x1="8.5" y1="81.3" x2="30.5" y2="80.8" />
      </g>
    </svg>
  );
}
