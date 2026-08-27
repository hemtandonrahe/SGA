import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AdminShell } from "@/components/admin/AdminShell";
import type { StaffRole } from "@/lib/auth/requireAdmin";

function readRole(sessionClaims: unknown): StaffRole | null {
  const metadata = (sessionClaims as { metadata?: { role?: string } } | null)?.metadata;
  return metadata?.role === "admin" || metadata?.role === "staff" ? metadata.role : null;
}

// Authoritative gate: proxy.ts does an optimistic redirect first, but this layout
// (shared by every page under app/admin/(protected)/*) is what actually enforces
// access — every admin Server Action/Route Handler also re-checks via requireAdmin().
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/admin/login");

  const role = readRole(sessionClaims);
  if (!role) redirect("/admin/unauthorized");

  return <AdminShell role={role}>{children}</AdminShell>;
}
