import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { getDb } from "@/lib/db";
import { staffUsers } from "@/lib/db/schema";
import { isDbConfigured } from "@/lib/integrations/config";

type ClerkUserEventData = {
  id: string;
  email_addresses?: { id: string; email_address: string }[];
  primary_email_address_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  public_metadata?: { role?: string };
};

type ClerkWebhookEvent = { type: string; data: ClerkUserEventData };

export async function POST(req: Request) {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!signingSecret) {
    return NextResponse.json({ error: "Webhook signing secret not configured" }, { status: 503 });
  }

  const payload = await req.text();
  const headerList = await headers();
  const svixHeaders = {
    "svix-id": headerList.get("svix-id") ?? "",
    "svix-timestamp": headerList.get("svix-timestamp") ?? "",
    "svix-signature": headerList.get("svix-signature") ?? "",
  };

  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(signingSecret).verify(payload, svixHeaders) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[clerk webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  if (!isDbConfigured()) {
    console.warn("[clerk webhook] DATABASE_URL not set — skipping staff_users sync");
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { id, email_addresses, primary_email_address_id, first_name, last_name, public_metadata } =
    event.data;
  const email =
    email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address ??
    email_addresses?.[0]?.email_address ??
    "";
  const name = [first_name, last_name].filter(Boolean).join(" ") || null;
  // Cosmetic mirror only — NOT the authorization boundary. Access is gated by
  // reading live Clerk session claims in requireAdmin()/proxy.ts, never this table.
  const role = public_metadata?.role === "admin" ? "admin" : "staff";

  const db = getDb();
  await db
    .insert(staffUsers)
    .values({ clerkUserId: id, email, name, role })
    .onConflictDoUpdate({
      target: staffUsers.clerkUserId,
      set: { email, name, role, updatedAt: new Date() },
    });

  return NextResponse.json({ ok: true });
}
