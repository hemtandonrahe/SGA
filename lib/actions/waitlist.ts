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

const MIN_SUBMIT_MS = 1500;

export async function submitWaitlistLead(raw: unknown): Promise<SubmitWaitlistResult> {
  // Honeypot: a plain uncontrolled field, deliberately not part of the zod schema
  // react-hook-form validates client-side (see lib/validations/waitlist.ts) — a
  // non-empty value here is treated as a bot signal, never a client-blocking error.
  const honeypot = (raw as { companyWebsite?: unknown } | null)?.companyWebsite;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    console.warn("[waitlist] rejected a submission that filled the honeypot field");
    return { ok: false, error: "Please check the highlighted fields." };
  }

  // Time-trap spam guard: the client stamps when the form rendered; a real visitor
  // can't read/fill/submit it faster than this, but a scripted bot often can.
  // Fails the same generic way as a validation error, so it doesn't tip bots off.
  const renderedAt = (raw as { formRenderedAt?: unknown } | null)?.formRenderedAt;
  if (typeof renderedAt === "number" && Date.now() - renderedAt < MIN_SUBMIT_MS) {
    console.warn("[waitlist] rejected a submission that arrived suspiciously fast");
    return { ok: false, error: "Please check the highlighted fields." };
  }

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
      error: "The waitlist isn't connected yet — the site owner needs to configure DATABASE_URL_SGA.",
    };
  }

  const input = parsed.data;
  const db = getDb();

  try {
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
  } catch (err) {
    // A raw DB error thrown from a Server Action becomes a client-side unhandled
    // promise rejection — the form would just look like it did nothing. Surface a
    // real (if generic) message instead, and log the actual cause server-side.
    console.error("[waitlist] insert failed:", err);
    return {
      ok: false,
      error: "Something went wrong saving your submission. Please try again in a moment.",
    };
  }

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
