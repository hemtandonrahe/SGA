"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leadNotes, leadStatusHistory, waitlistLeads } from "@/lib/db/schema";
import type { LeadDetails } from "@/lib/db/schema/waitlist";
import { isDbConfigured } from "@/lib/integrations/config";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist";
import { sendInternalLeadNotification, sendWaitlistConfirmation } from "@/lib/email/resend";
import { revalidatePath } from "next/cache";

export type SubmitWaitlistResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function detailsFromInput(input: WaitlistInput): LeadDetails {
  switch (input.role) {
    case "player":
      return {
        skillLevel: input.skillLevel,
        simulatorFrequency: input.simulatorFrequency,
        interestedInLeaguesOrTournaments: input.interestedInLeaguesOrTournaments,
      };
    case "facility":
      return {
        facilityName: input.facilityName,
        city: input.city || undefined,
        state: input.state || undefined,
        numberOfBays: input.numberOfBays,
        currentSimulatorTech: input.currentSimulatorTech || undefined,
        contactName: input.contactName || undefined,
        contactPhone: input.contactPhone || undefined,
      };
    case "partner":
      return {
        company: input.company,
        partnerType: input.partnerType,
        website: input.website || undefined,
        interestNotes: input.interestNotes || undefined,
      };
  }
}

export async function submitWaitlistLead(raw: unknown): Promise<SubmitWaitlistResult> {
  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  if (!isDbConfigured()) {
    return {
      ok: false,
      error: "The waitlist isn't connected yet — the site owner needs to configure DATABASE_URL.",
    };
  }

  const input = parsed.data;
  const db = getDb();

  await db
    .insert(waitlistLeads)
    .values({
      role: input.role,
      name: input.name,
      email: input.email.toLowerCase(),
      location: input.location || null,
      consent: input.consent,
      source: input.source || null,
      details: detailsFromInput(input),
    })
    .onConflictDoUpdate({
      target: waitlistLeads.email,
      set: {
        name: input.name,
        location: input.location || null,
        consent: input.consent,
        source: input.source || null,
        details: detailsFromInput(input),
        updatedAt: new Date(),
      },
    });

  // Best-effort, non-blocking: email delivery must never fail the actual signup.
  try {
    await Promise.all([
      sendWaitlistConfirmation({ name: input.name, email: input.email, role: input.role }),
      sendInternalLeadNotification({ name: input.name, email: input.email, role: input.role }),
    ]);
  } catch (err) {
    console.error("[waitlist] email notification failed (non-fatal):", err);
  }

  return { ok: true };
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: (typeof waitlistLeads.$inferSelect)["status"]
) {
  const admin = await requireAdmin();
  const db = getDb();

  const [existing] = await db
    .select({ status: waitlistLeads.status })
    .from(waitlistLeads)
    .where(eq(waitlistLeads.id, leadId))
    .limit(1);
  if (!existing) throw new Error("Lead not found");

  await db
    .update(waitlistLeads)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(waitlistLeads.id, leadId));

  await db.insert(leadStatusHistory).values({
    leadId,
    oldStatus: existing.status,
    newStatus,
    changedByUserId: admin.clerkUserId,
  });

  revalidatePath("/admin/waitlist");
  revalidatePath(`/admin/waitlist/${leadId}`);
}

export async function assignLead(leadId: string, assignedToUserId: string | null, followUpDueAt: Date | null) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(waitlistLeads)
    .set({ assignedToUserId, followUpDueAt, updatedAt: new Date() })
    .where(eq(waitlistLeads.id, leadId));

  revalidatePath("/admin/waitlist");
  revalidatePath(`/admin/waitlist/${leadId}`);
}

export async function addLeadNote(leadId: string, body: string) {
  const admin = await requireAdmin();
  const trimmed = body.trim();
  if (!trimmed) throw new Error("Note cannot be empty");

  const db = getDb();
  await db.insert(leadNotes).values({ leadId, authorUserId: admin.clerkUserId, body: trimmed });

  revalidatePath(`/admin/waitlist/${leadId}`);
}
