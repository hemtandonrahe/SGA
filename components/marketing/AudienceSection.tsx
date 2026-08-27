import { Trophy, Building2, CalendarRange, Cable } from "lucide-react";

const audiences = [
  {
    icon: Trophy,
    title: "Players",
    description:
      "Carry one identity across every certified venue: your membership, verified rounds, ranking, achievements, rewards, and competition history.",
  },
  {
    icon: Building2,
    title: "Facilities",
    description:
      "Become SGA-certified and host trusted events, giving members confidence that every round played on-site counts.",
  },
  {
    icon: CalendarRange,
    title: "Tournament organizers",
    description:
      "Run leagues and tournaments across multiple locations under the same rules and verification standards.",
  },
  {
    icon: Cable,
    title: "Technology partners",
    description:
      "Connect simulator hardware and software through SGA without SGA favoring any one manufacturer.",
  },
];

export function AudienceSection() {
  return (
    <section id="who-its-for" className="border-y border-border-subtle bg-bg-raised">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-2">Who it&apos;s for</p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Everyone in simulated golf, on the same network.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => (
            <div key={audience.title} className="flex flex-col gap-4 bg-bg-elevated p-7">
              <span className="flex size-11 items-center justify-center rounded-md bg-accent-2-soft text-accent-2">
                <audience.icon className="size-5" />
              </span>
              <h3 className="font-display text-base font-semibold text-text-primary">{audience.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
