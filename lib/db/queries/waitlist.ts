import "server-only";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leadNotes, leadStatusHistory, waitlistLeads, type WaitlistLead } from "@/lib/db/schema";

export type LeadFilters = {
  role?: WaitlistLead["role"];
  status?: WaitlistLead["status"];
  q?: string;
};

function buildWhere(filters: LeadFilters) {
  const conditions = [];
  if (filters.role) conditions.push(eq(waitlistLeads.role, filters.role));
  if (filters.status) conditions.push(eq(waitlistLeads.status, filters.status));
  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(or(ilike(waitlistLeads.name, term), ilike(waitlistLeads.email, term)));
  }
  return conditions.length ? and(...conditions) : undefined;
}

export async function listLeads(
  filters: LeadFilters,
  { limit, offset }: { limit: number; offset: number }
) {
  const db = getDb();
  const where = buildWhere(filters);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(waitlistLeads)
      .where(where)
      .orderBy(desc(waitlistLeads.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(waitlistLeads).where(where),
  ]);
  return { rows, total: totalRows[0]?.total ?? 0 };
}

export async function listAllLeadsForExport(filters: LeadFilters) {
  const db = getDb();
  const where = buildWhere(filters);
  return db.select().from(waitlistLeads).where(where).orderBy(desc(waitlistLeads.createdAt));
}

export async function getLeadDetail(leadId: string) {
  const db = getDb();
  const [lead] = await db.select().from(waitlistLeads).where(eq(waitlistLeads.id, leadId)).limit(1);
  if (!lead) return null;

  const [notes, history] = await Promise.all([
    db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt)),
    db
      .select()
      .from(leadStatusHistory)
      .where(eq(leadStatusHistory.leadId, leadId))
      .orderBy(desc(leadStatusHistory.changedAt)),
  ]);

  return { lead, notes, history };
}
