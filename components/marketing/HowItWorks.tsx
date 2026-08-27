import { UserPlus, MapPin, QrCode, PlayCircle, ShieldCheck, LineChart, Gift } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "Join" },
  { icon: MapPin, label: "Find a certified facility" },
  { icon: QrCode, label: "QR check-in" },
  { icon: PlayCircle, label: "Play" },
  { icon: ShieldCheck, label: "Verify" },
  { icon: LineChart, label: "Rank" },
  { icon: Gift, label: "Reward" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">How it works</p>
        <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          From sign-up to your next event, in one flow.
        </h2>
      </div>

      <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((step, i) => (
          <li key={step.label} className="flex flex-col items-center gap-3 text-center">
            <span className="relative flex size-14 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-accent">
              <step.icon className="size-6" />
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent font-display text-[10px] font-semibold text-accent-foreground">
                {i + 1}
              </span>
            </span>
            <span className="text-sm font-medium text-text-secondary">{step.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
