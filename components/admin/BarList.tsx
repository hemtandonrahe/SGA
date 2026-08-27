export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) {
    return <p className="text-sm text-text-muted">No data yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary">{item.value}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated-2">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
