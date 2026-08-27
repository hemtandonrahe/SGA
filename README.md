# SGA — Simulated Golf Association

The public landing page, waitlist, and admin CMS for SGA — the trusted competitive
network for simulated golf. Built with Next.js (App Router) + TypeScript + Tailwind,
Neon Postgres + Drizzle ORM, Clerk (admin auth), Resend (email), and Cloudflare R2
(blog images).

**The app runs with zero configuration.** Every third-party integration degrades
gracefully when its keys are missing — `npm run dev` and `npm run build` both work
immediately after `npm install`, showing a friendly "not configured" banner on any
page that needs a service you haven't set up yet. Configure services one at a time,
in any order, as you get to them.
  
## Quick start
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — the landing page, hero animation, and waitlist form UI
all work immediately. The waitlist won't actually save anything until `DATABASE_URL_SGA`
is set (see below), and `/admin` will show a setup screen until Clerk is configured.

Most env vars below are suffixed `_SGA` so they don't collide with another project's
vars of the same name if you share a Neon/Resend/Cloudflare account across projects.
Clerk's two keys are the one exception — see the note in `.env.example`.

## Setting up each service

### 1. Database — Neon Postgres

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string into `DATABASE_URL_SGA`, and the **direct
   (unpooled)** connection string into `DATABASE_URL_UNPOOLED_SGA` in `.env.local`.
   (Neon's dashboard labels these — the app uses the pooled one at runtime via
   `@neondatabase/serverless`; `drizzle-kit` uses the unpooled one for migrations.)
3. Run the migrations:
   ```bash
   npm run db:generate   # only needed after you change lib/db/schema/*
   npm run db:migrate
   ```
4. Optional: `npm run db:studio` opens Drizzle Studio to browse/edit data directly.

Once `DATABASE_URL_SGA` is set, the waitlist form, admin dashboard, waitlist management,
and blog all become functional.

### 2. Admin auth — Clerk

These two keys keep Clerk's standard (unsuffixed) names on purpose — Clerk's SDK
auto-detects them by these exact names throughout the app (middleware, every
protected page's `auth()` call), so renaming them would need extra explicit wiring
for no real benefit.

1. Create an application at [clerk.com](https://clerk.com).
2. Copy the publishable and secret keys into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
   `CLERK_SECRET_KEY`.
3. In the Clerk Dashboard → **Sessions** → customize the session token, add a custom
   claim so the app can read a user's role without an extra API call:
   ```json
   { "metadata": "{{user.public_metadata}}" }
   ```
4. **Restrict sign-up** for this Clerk instance: Dashboard → **User & Authentication →
   Access mode** → select **Invite-only**. There is no public admin sign-up route in
   the app; staff accounts are created manually (next step).
5. Create your own staff account in the Clerk Dashboard (Users → Create), then edit
   its **Public metadata** to grant access:
   ```json
   { "role": "admin" }
   ```
   (`"staff"` is the other valid role — both currently have identical permissions.)
6. Optional: `requireAdmin()` already self-syncs the signed-in user into `staff_users`
   on every admin action, so real names show up on notes/assignments without any
   extra setup. Configuring the Clerk webhook on top of that just makes the sync
   happen the moment a profile changes in Clerk, rather than on that user's next
   admin action. In Clerk Dashboard → Webhooks, point it at
   `<your-domain>/api/webhooks/clerk`, subscribe to `user.created` and
   `user.updated`, and put the signing secret in `CLERK_WEBHOOK_SIGNING_SECRET_SGA`.

Once configured, sign in at `/admin/login`.

### 3. Email — Resend

1. Create an account at [resend.com](https://resend.com) and grab an API key into
   `RESEND_API_KEY_SGA`.
2. Set `SGA_TEAM_NOTIFICATION_EMAIL` to where internal "new lead" emails should go
   (left unsuffixed since "SGA" is already in the name).
3. Without a verified sending domain, Resend's sandbox mode only delivers to the
   account owner's own address — verify a domain (Resend Dashboard → Domains) and
   update `RESEND_FROM_EMAIL_SGA` before relying on this for real signups.

Email is strictly best-effort: a missing key or a Resend error never blocks a
waitlist signup — it just skips the email and logs why.

### 4. Blog cover images — Cloudflare R2

The app generates a short-lived presigned URL server-side (`/api/r2-upload`, admin-only)
and the browser uploads the file directly to R2 with it — no image bytes pass through
the Next.js server.

1. Create a bucket in the [Cloudflare dashboard](https://dash.cloudflare.com) → R2
   (or use an existing one — this project defaults to `sga-tours-bucket`).
2. **Enable public access** on the bucket: bucket → Settings → Public access → allow
   access via the **R2.dev subdomain**. Copy the `https://pub-xxxxxxxx.r2.dev` URL it
   gives you into `R2_PUBLIC_URL_SGA`.
3. **Configure CORS on the bucket** (required — without this, the browser's direct
   PUT upload will fail): bucket → Settings → CORS policy → add a rule allowing
   `PUT` (and `GET`) from `http://localhost:3000` and your production domain, e.g.:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://sga-tours.vercel.app"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
4. Create an **R2 API token**: Cloudflare dashboard → R2 → **Manage API Tokens** →
   Create API Token, with **Object Read & Write** permission scoped to your bucket.
   Copy the three values it gives you into `R2_ACCOUNT_ID_SGA`, `R2_ACCESS_KEY_ID_SGA`,
   and `R2_SECRET_ACCESS_KEY_SGA`.
5. Set `R2_BUCKET_NAME_SGA` to your bucket's name.

Only PNG/JPEG/WebP/GIF up to 4MB are accepted (enforced server-side in
`app/api/r2-upload/route.ts`, not just in the UI).

## Project structure

```
app/
  page.tsx                # landing page
  blog/, blog/[slug]/     # public blog
  admin/
    layout.tsx            # ClerkProvider (scoped here only — public site never needs Clerk)
    login/, unauthorized/  # public within /admin
    (protected)/           # route group: dashboard, waitlist, blog — gated by
                            # app/admin/(protected)/layout.tsx + proxy.ts
  api/
    waitlist/export/       # CSV export
    r2-upload/             # presigned R2 upload URL, admin-only
    webhooks/clerk/        # syncs Clerk users into staff_users
proxy.ts                  # Next 16's renamed middleware.ts — gates /admin/*
lib/
  db/                      # Drizzle schema + queries
  actions/                 # Server Actions (waitlist, blog)
  validations/             # zod schemas
  auth/requireAdmin.ts     # re-checked inside every admin action/route, not just proxy.ts
  email/, r2/, integrations/config.ts  # lazy clients + isXConfigured() checks
components/
  marketing/, hero-animation/, blog/, admin/, ui/
```

## Notes for whoever picks this up next

- **This repo runs Next.js 16**, which renamed `middleware.ts` to `proxy.ts` (see
  `proxy.ts`) among other changes — if an AI assistant or a contributor's memory of
  Next.js predates that, point them at `node_modules/next/dist/docs/` before they
  make routing/caching assumptions from an older version.
- Every external client (Drizzle, Resend, Clerk, R2) is instantiated lazily behind an
  `isXConfigured()` check in `lib/integrations/config.ts` — never import one of these
  clients eagerly at module scope without that guard, or you'll break the "works with
  zero env vars" property.
- Blog cover images used to go through UploadThing; that was replaced with Cloudflare
  R2 (direct browser-to-R2 presigned uploads via `/api/r2-upload`) because R2 was
  already in use for other buckets on this account. If you ever see a stray reference
  to `isomorphic-dompurify` in git history/docs elsewhere: that was also swapped out
  (for `sanitize-html`) after it broke blog post creation in Vercel's production
  bundle with an `ERR_REQUIRE_ESM` error from a jsdom sub-dependency — ESM/CJS
  interop issue, not a config problem, so don't reintroduce a jsdom-based sanitizer.
- `npm audit` will flag a moderate advisory in `drizzle-kit`'s dev-only esbuild
  dependency — it's a local-CLI-only tool (not shipped to production), so this is
  left as-is rather than downgrading `drizzle-kit` to a much older version.
