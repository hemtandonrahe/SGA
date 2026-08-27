import type { LeadDetails } from "@/lib/db/schema/waitlist";

function labelize(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export function LeadDetailsCard({ details }: { details: LeadDetails }) {
  const entries = Object.entries(details).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) {
    return <p className="text-sm text-text-muted">No additional details provided.</p>;
  }
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{labelize(key)}</dt>
          <dd className="mt-0.5 text-sm text-text-primary">{formatValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
