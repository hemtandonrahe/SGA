import "server-only";
import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/integrations/config";

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
  return { clerkUserId: userId, role };
}
