import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <ShieldAlert className="size-10 text-danger" />
      <h1 className="font-display text-xl font-semibold text-text-primary">You don&apos;t have access</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        This account isn&apos;t assigned a staff role in SGA admin. Ask another admin to grant you
        access, or sign in with a different account.
      </p>
      <Link href="/admin/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
        Back to sign in
      </Link>
    </div>
  );
}
