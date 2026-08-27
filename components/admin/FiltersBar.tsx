import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const roleOptions = [
  { value: "", label: "All roles" },
  { value: "player", label: "Player" },
  { value: "facility", label: "Facility" },
  { value: "partner", label: "Partner" },
];

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "invited", label: "Invited" },
  { value: "archived", label: "Archived" },
];

function nativeSelectClass() {
  return "h-11 rounded-md border border-border-strong bg-bg-raised px-3 text-sm text-text-primary outline-none focus:border-accent-border focus:ring-2 focus:ring-accent/30";
}

export function FiltersBar({
  action,
  defaults,
  hasFilters,
}: {
  action: string;
  defaults: { q?: string; role?: string; status?: string };
  hasFilters: boolean;
}) {
  return (
    <form action={action} method="GET" className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="q" className="text-xs font-medium text-text-muted">
          Search
        </label>
        <Input id="q" name="q" placeholder="Name or email" defaultValue={defaults.q} className="w-56" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-xs font-medium text-text-muted">
          Role
        </label>
        <select id="role" name="role" defaultValue={defaults.role ?? ""} className={nativeSelectClass()}>
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-xs font-medium text-text-muted">
          Status
        </label>
        <select id="status" name="status" defaultValue={defaults.status ?? ""} className={nativeSelectClass()}>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={cn(buttonVariants({ variant: "secondary", size: "md" }))}>
        Filter
      </button>
      {hasFilters && (
        <Link href={action} className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
          Clear
        </Link>
      )}
    </form>
  );
}
