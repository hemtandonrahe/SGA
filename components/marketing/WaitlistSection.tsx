import { WaitlistForm } from "./WaitlistForm/WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="border-t border-border-subtle bg-bg-raised">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Get early access</p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Join the SGA waitlist
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Tell us who you are so we can invite you to the right part of SGA first.
          </p>
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-elevated p-6 sm:p-10">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
