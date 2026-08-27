import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { isDbConfigured } from "@/lib/integrations/config";
import * as schema from "./schema";

export class DbNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL_SGA is not configured. Add it to .env.local — see README.md.");
    this.name = "DbNotConfiguredError";
  }
}

let cached: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Callers should check `isDbConfigured()` first and render a setup banner instead
 * of reaching this — it throws so a missing env var never fails silently.
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!isDbConfigured()) throw new DbNotConfiguredError();
  if (!cached) {
    const sql = neon(process.env.DATABASE_URL_SGA!);
    cached = drizzle(sql, { schema });
  }
  return cached;
}

export { schema };
