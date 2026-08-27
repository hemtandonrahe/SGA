import "server-only";
import { getDb } from "@/lib/db";
import { staffUsers } from "@/lib/db/schema";

export async function listStaffUsers() {
  const db = getDb();
  return db.select().from(staffUsers);
}
