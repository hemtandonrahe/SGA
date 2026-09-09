const highlights = [
  {
    number: "01",
    title: "Verified play",
    points: ["Every round checked in and confirmed at a certified bay", "No self-reported scores, ever"],
  },
  {
    number: "02",
    title: "Portable rankings",
    points: ["One ranking that follows you across every facility", "Works across formats and locations"],
  },
  {
    number: "03",
    title: "Real competition",
    points: ["Tournaments and leagues under one shared rulebook", "The same rules everywhere SGA operates"],
  },
  {
    number: "04",
    title: "Certified facilities",
    points: ["Find SGA-certified places to play you can trust", "Every certified bay meets the same standard"],
  },
];

export function SplashHighlights() {
  return (
    <section id="highlights" className="border-b border-border-subtle bg-bg-raised">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-accent uppercase">What&rsquo;s inside</p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Four pillars, one verified network.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <div key={highlight.number} className="flex flex-col gap-3 bg-bg-elevated p-7">
              <span className="font-display text-2xl font-semibold text-accent">{highlight.number}</span>
              <h3 className="font-display text-base font-semibold text-text-primary">{highlight.title}</h3>
              <ul className="space-y-1.5">
                {highlight.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
                    <span className="text-text-muted" aria-hidden="true">
                      —
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
