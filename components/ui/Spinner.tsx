import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Loader2 className="size-6 animate-spin text-accent" />
    </div>
  );
}
