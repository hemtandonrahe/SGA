import { defineConfig } from "drizzle-kit";

// drizzle-kit's bundled dotenv only auto-loads `.env`, not Next.js's `.env.local` —
// load it explicitly so `npm run db:*` scripts see the same vars as `next dev`.
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local doesn't exist yet (fresh checkout) — fine, dbCredentials check below reports it.
}

// drizzle-kit runs standalone (outside the Next.js request lifecycle), so it needs
// its own env loading. Prefer the unpooled connection string for migrations —
// Neon's pooled endpoint can behave differently for the DDL statements drizzle-kit runs.
const connectionString = process.env.DATABASE_URL_UNPOOLED_SGA ?? process.env.DATABASE_URL_SGA;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL_SGA (or DATABASE_URL_UNPOOLED_SGA) must be set to run drizzle-kit commands. Copy .env.example to .env.local first."
  );
}

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: connectionString },
  strict: true,
});
