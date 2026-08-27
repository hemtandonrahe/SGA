"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroAnimation } from "@/components/hero-animation/HeroAnimation";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_0%,var(--accent-soft),transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-2 lg:pt-28">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-4 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="size-3.5" />
            Launching soon — join the waitlist
          </span>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-text-primary sm:text-5xl lg:text-6xl">
            The trusted competitive network for simulated golf.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            SGA connects players, certified facilities, tournament organizers, and technology
            partners on one verified network — one identity, one ranking, real competition,
            everywhere you play.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => scrollTo("waitlist")}>
              Join the waitlist
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollTo("how-it-works")}>
              See how it works
            </Button>
          </div>
        </div>

        <HeroAnimation />
      </div>
    </section>
  );
}
