import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeadDetail } from "@/lib/db/queries/waitlist";
import { listStaffUsers } from "@/lib/db/queries/staff";
import { isDbConfigured } from "@/lib/integrations/config";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { RoleBadge, StatusBadge } from "@/components/admin/LeadBadges";
import { LeadDetailsCard } from "@/components/admin/LeadDetailsCard";
import { LeadStatusControl } from "@/components/admin/LeadStatusControl";
import { AssigneeControl } from "@/components/admin/AssigneeControl";
import { LeadNotesPanel } from "@/components/admin/LeadNotesPanel";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDbConfigured()) {
    return <SetupNotice title="No database connected yet" />;
  }

  const [detail, staff] = await Promise.all([getLeadDetail(id), listStaffUsers()]);
  if (!detail) notFound();

  const { lead, notes, history } = detail;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/waitlist" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" /> Back to waitlist
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <RoleBadge role={lead.role} />
            <StatusBadge status={lead.status} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">{lead.name}</h1>
          <p className="text-sm text-text-secondary">{lead.email}</p>
        </div>
        <LeadStatusControl leadId={lead.id} status={lead.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="mb-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">City</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">{lead.city || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">State / Region</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">{lead.state || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Country</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">{lead.country || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Source</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">{lead.source || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Consent</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">{lead.consent ? "Given" : "Not given"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Joined</dt>
                  <dd className="mt-0.5 text-sm text-text-primary">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(lead.createdAt)}
                  </dd>
                </div>
              </dl>
              <LeadDetailsCard details={lead.details} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadNotesPanel leadId={lead.id} notes={notes} staff={staff} />
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status history</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center gap-2">
                      <span className="text-text-muted">
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
                          h.changedAt
                        )}
                      </span>
                      <span>
                        {h.oldStatus ? `${h.oldStatus} → ${h.newStatus}` : `Set to ${h.newStatus}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <AssigneeControl
              leadId={lead.id}
              assignedToUserId={lead.assignedToUserId}
              followUpDueAt={lead.followUpDueAt}
              staff={staff}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
