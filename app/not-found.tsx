import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <CompassIcon className="size-10 text-accent" />
      <h1 className="font-display text-2xl font-semibold text-text-primary">Page not found</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        This page doesn&apos;t exist, or it may have moved. Let&apos;s get you back on course.
      </p>
      <Link href="/" className={buttonVariants({ size: "sm" })}>
        Back to SGA
      </Link>
    </div>
  );
}
