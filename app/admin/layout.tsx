import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/integrations/config";
import { SetupNotice } from "@/components/ui/SetupNotice";

// ClerkProvider is scoped to /admin only — never the root layout — so a missing
// Clerk key can never break the public marketing site or blog.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-base px-6">
        <SetupNotice title="Admin auth isn't configured yet">
          Add <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
          and <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">CLERK_SECRET_KEY</code> to{" "}
          <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">.env.local</code> — see README.md.
        </SetupNotice>
      </div>
    );
  }

  return (
    <ClerkProvider signInUrl="/admin/login" afterSignOutUrl="/admin/login">
      <div className="min-h-screen bg-bg-base">{children}</div>
    </ClerkProvider>
  );
}
