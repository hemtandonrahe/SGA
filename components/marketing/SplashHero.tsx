import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { SplashNav } from "./SplashNav";
import { SplashHeroVideo } from "./SplashHeroVideo";

export function SplashHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-bg-base">
      <SplashHeroVideo />

      {/* Scrim: a constant tint over the whole frame, plus a stronger gradient at
          the top (nav) and bottom (where the headline now sits, lower-third style,
          and where the section blends into the highlights below). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg-base/35" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg-base/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-base via-bg-base/70 to-transparent"
      />

      <SplashNav />

      {/* Lower-third layout: left-aligned and bottom-anchored rather than dead
          center, so the copy reads as an overlay on the footage instead of
          competing with the swing motion in the middle of the frame. */}
      <div className="relative z-[1] flex w-full flex-1 flex-col justify-end px-6 pt-32 pb-20 sm:px-12 lg:px-20 lg:pb-24">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated/60 px-4 py-1.5 text-xs font-medium tracking-widest text-text-secondary uppercase backdrop-blur-sm">
            Simulated Golf Association
          </span>

          <h1 className="font-display text-5xl leading-[1.05] font-semibold text-text-primary sm:text-6xl lg:text-7xl">
            One network.
            <br /> Every round that counts.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Verified play, portable rankings, and real competition — connecting players, certified
            facilities, tournament organizers, and technology partners on one trusted network.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/join" className={buttonVariants({ size: "lg" })}>
              Enter SGA
            </Link>
            <a href="#highlights" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Keep exploring
            </a>
          </div>
        </div>
      </div>

      <a
        href="#highlights"
        aria-label="Scroll to learn more"
        className="relative z-[1] mb-8 flex justify-center text-text-muted transition-colors hover:text-text-primary lg:absolute lg:right-12 lg:bottom-8 lg:mb-0"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}
