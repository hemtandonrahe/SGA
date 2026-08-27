import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth/requireAdmin";
import { listAllLeadsForExport } from "@/lib/db/queries/waitlist";
import { toCsv } from "@/lib/utils/csv";
import type { WaitlistLead } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  const sp = req.nextUrl.searchParams;
  const role = sp.get("role") as WaitlistLead["role"] | null;
  const status = sp.get("status") as WaitlistLead["status"] | null;
  const q = sp.get("q");

  const rows = await listAllLeadsForExport({
    role: role || undefined,
    status: status || undefined,
    q: q || undefined,
  });

  const csv = toCsv(
    ["Name", "Email", "Role", "Status", "Location", "Source", "Consent", "Details", "Created At"],
    rows.map((r) => [
      r.name,
      r.email,
      r.role,
      r.status,
      r.location ?? "",
      r.source ?? "",
      r.consent ? "yes" : "no",
      JSON.stringify(r.details ?? {}),
      r.createdAt.toISOString(),
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sga-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
