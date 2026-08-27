import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/integrations/config";

// Next.js 16 renamed Middleware to Proxy; this file replaces what used to be middleware.ts.
const isProtectedAdminRoute = createRouteMatcher(["/admin/:path*"]);
const isPublicAdminRoute = createRouteMatcher(["/admin/login(.*)", "/admin/unauthorized"]);

// This is an *optimistic* check (fast redirect before rendering starts) — the
// authoritative gate lives in app/admin/(protected)/layout.tsx, which every
// protected page sits under, and requireAdmin() re-checks inside every admin
// Server Action/Route Handler regardless of which page invoked it.
const guardedProxy = clerkMiddleware(async (auth, req) => {
  if (!isProtectedAdminRoute(req) || isPublicAdminRoute(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const role = (sessionClaims as { metadata?: { role?: string } } | null)?.metadata?.role;
  if (role !== "admin" && role !== "staff") {
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }
});

// clerkMiddleware() throws immediately if Clerk keys are missing — which they
// are until the site owner configures them. Fall back to a no-op so /admin/*
// still renders (as a "Clerk isn't configured" page, not real admin data —
// see app/admin/layout.tsx) instead of crashing the whole route.
function passthroughProxy() {
  return NextResponse.next();
}

export default isClerkConfigured() ? guardedProxy : passthroughProxy;

export const config = {
  matcher: ["/admin/:path*"],
};
