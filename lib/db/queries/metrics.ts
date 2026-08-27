import "server-only";
import { count, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { waitlistLeads } from "@/lib/db/schema";

export async function getWaitlistMetrics() {
  const db = getDb();

  const [byRole, byStatus, bySource, byState, totalRows] = await Promise.all([
    db.select({ role: waitlistLeads.role, total: count() }).from(waitlistLeads).groupBy(waitlistLeads.role),
    db
      .select({ status: waitlistLeads.status, total: count() })
      .from(waitlistLeads)
      .groupBy(waitlistLeads.status),
    db
      .select({ source: waitlistLeads.source, total: count() })
      .from(waitlistLeads)
      .groupBy(waitlistLeads.source)
      .orderBy(desc(count()))
      .limit(8),
    db
      .select({ state: waitlistLeads.state, total: count() })
      .from(waitlistLeads)
      .groupBy(waitlistLeads.state)
      .orderBy(desc(count()))
      .limit(8),
    db.select({ total: count() }).from(waitlistLeads),
  ]);

  const total = totalRows[0]?.total ?? 0;
  const convertedCount = byStatus
    .filter((s) => s.status === "qualified" || s.status === "invited")
    .reduce((sum, s) => sum + s.total, 0);
  const conversionRate = total > 0 ? convertedCount / total : 0;

  return {
    total,
    byRole,
    byStatus,
    bySource: bySource.filter((s) => s.source),
    byState: byState.filter((s) => s.state),
    conversionRate,
  };
}
