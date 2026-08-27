import Link from "next/link";
import { isDbConfigured } from "@/lib/integrations/config";
import { listLeads, type LeadFilters } from "@/lib/db/queries/waitlist";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { RoleBadge, StatusBadge } from "@/components/admin/LeadBadges";
import type { WaitlistLead } from "@/lib/db/schema";

const PAGE_SIZE = 25;

function parseFilters(sp: Record<string, string | string[] | undefined>): LeadFilters {
  const role = typeof sp.role === "string" && sp.role ? (sp.role as WaitlistLead["role"]) : undefined;
  const status = typeof sp.status === "string" && sp.status ? (sp.status as WaitlistLead["status"]) : undefined;
  const q = typeof sp.q === "string" && sp.q.trim() ? sp.q.trim() : undefined;
  return { role, status, q };
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const page = Math.max(1, Number(sp.page) || 1);

  if (!isDbConfigured()) {
    return (
      <SetupNotice title="No database connected yet">
        Add <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">DATABASE_URL_SGA</code> to see
        real waitlist submissions here.
      </SetupNotice>
    );
  }

  const { rows, total } = await listLeads(filters, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const queryString = new URLSearchParams(
    Object.entries({ q: filters.q, role: filters.role, status: filters.status }).filter(
      ([, v]) => v
    ) as [string, string][]
  ).toString();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Waitlist</h1>
          <p className="text-sm text-text-muted">{total} total signups</p>
        </div>
        <CsvExportButton query={queryString} />
      </div>

      <FiltersBar
        action="/admin/waitlist"
        defaults={{ q: filters.q, role: filters.role, status: filters.status }}
        hasFilters={Boolean(filters.q || filters.role || filters.status)}
      />

      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border-subtle bg-bg-elevated text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                  No signups match these filters yet.
                </td>
              </tr>
            )}
            {rows.map((lead) => (
              <tr key={lead.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated">
                <td className="px-4 py-3">
                  <Link href={`/admin/waitlist/${lead.id}`} className="font-medium text-text-primary hover:text-accent">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-secondary">{lead.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={lead.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-text-secondary">{lead.location || "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{lead.source || "—"}</td>
                <td className="px-4 py-3 text-text-muted">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/waitlist?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(queryString)), page: String(p) })}`}
              className={
                p === page
                  ? "rounded-md bg-accent px-3 py-1.5 font-medium text-accent-foreground"
                  : "rounded-md px-3 py-1.5 text-text-secondary hover:bg-bg-elevated"
              }
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
