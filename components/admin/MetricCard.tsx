import { Card, CardContent } from "@/components/ui/Card";

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold text-text-primary">{value}</p>
        {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      </CardContent>
    </Card>
  );
}
