import { ShieldCheck, LineChart, Swords, Gift, MapPin } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified scores",
    description: "Every round is checked in and confirmed at a certified bay — no self-reported results.",
  },
  {
    icon: LineChart,
    title: "Portable rankings",
    description: "One ranking that follows you across facilities, formats, and locations.",
  },
  {
    icon: Swords,
    title: "Real competition",
    description: "Tournaments and leagues that run under the same rules everywhere SGA operates.",
  },
  {
    icon: Gift,
    title: "Rewards",
    description: "Verified play and results unlock rewards and recommendations for what to do next.",
  },
  {
    icon: MapPin,
    title: "Certified places to play",
    description: "Find SGA-certified facilities you can trust, wherever you are.",
  },
];

export function WhyItMatters() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Why it matters</p>
        <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Simulated golf has never had one trusted layer connecting all of it.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-lg border border-border-subtle bg-bg-elevated p-6 transition-colors hover:border-accent-border"
          >
            <span className="mb-4 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent">
              <pillar.icon className="size-5" />
            </span>
            <h3 className="mb-2 font-display text-base font-semibold text-text-primary">{pillar.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
