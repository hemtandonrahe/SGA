"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-base px-6 text-center">
      <AlertOctagon className="size-10 text-danger" />
      <h1 className="font-display text-2xl font-semibold text-text-primary">Something went wrong</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        An unexpected error occurred. Try again, and if it keeps happening, let us know.
      </p>
      <Button size="sm" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
