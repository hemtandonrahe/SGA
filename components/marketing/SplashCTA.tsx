import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export function SplashCTA() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_100%,var(--accent-soft),transparent)]"
      />
      <div className="relative mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="mb-3 text-sm font-medium tracking-widest text-accent uppercase">Founding members</p>
        <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          First players, first facilities, first tournaments.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          Meet the players, facilities, and tournaments already on the network — and join the
          waitlist to be part of the founding cohort.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/join#waitlist" className={buttonVariants({ size: "lg" })}>
            Claim your spot
          </Link>
        </div>
      </div>
    </section>
  );
}
