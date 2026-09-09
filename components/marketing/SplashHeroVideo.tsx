"use client";

import { useReducedMotion } from "framer-motion";

// Autoplay + loop are dropped (not just visually paused) when the visitor has
// requested reduced motion — the poster frame then stands in as a static image,
// same intent as HeroAnimation's reduced-motion handling elsewhere on the site.
export function SplashHeroVideo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <video
      autoPlay={!prefersReducedMotion}
      loop={!prefersReducedMotion}
      muted
      playsInline
      preload="auto"
      poster="/video/hero-poster.jpg"
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
