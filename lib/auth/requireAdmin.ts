import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured, isDbConfigured } from "@/lib/integrations/config";
import { getDb } from "@/lib/db";
import { staffUsers } from "@/lib/db/schema";

export type StaffRole = "admin" | "staff";

export type StaffSession = {
  clerkUserId: string;
  role: StaffRole;
};

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function readRole(sessionClaims: unknown): StaffRole | null {
  const metadata = (sessionClaims as { metadata?: { role?: string } } | null)?.metadata;
  return metadata?.role === "admin" || metadata?.role === "staff" ? metadata.role : null;
}

// Best-effort mirror into staff_users (see lib/db/schema/staff.ts) so notes/
// assignments can show a real name instead of a raw Clerk ID. This makes the
// Clerk webhook a nice-to-have (fresher sync) rather than required — without it,
// this keeps the mirror current anyway, one admin write action at a time. Never
// let a failure here block the actual authorization result.
async function syncStaffUser(clerkUserId: string, role: StaffRole) {
  if (!isDbConfigured()) return;
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;

    const db = getDb();
    await db
      .insert(staffUsers)
      .values({ clerkUserId, email, name, role })
      .onConflictDoUpdate({
        target: staffUsers.clerkUserId,
        set: { email, name, role, updatedAt: new Date() },
      });
  } catch (err) {
    console.error("[requireAdmin] failed to sync staff_users (non-fatal):", err);
  }
}

/**
 * Defense in depth: `proxy.ts` already gates the /admin/* route tree, but every
 * admin Server Action and Route Handler calls this too, since Server Functions are
 * reachable directly via POST regardless of which page rendered the form.
 */
export async function requireAdmin(): Promise<StaffSession> {
  if (!isClerkConfigured()) {
    throw new UnauthorizedError("Admin auth is not configured (Clerk keys missing).");
  }
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new UnauthorizedError("Not signed in.");
  const role = readRole(sessionClaims);
  if (!role) throw new UnauthorizedError("This account has no staff role assigned.");
  await syncStaffUser(userId, role);
  return { clerkUserId: userId, role };
}
