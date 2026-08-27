import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function CsvExportButton({ query }: { query: string }) {
  return (
    <a
      href={`/api/waitlist/export${query ? `?${query}` : ""}`}
      className={cn(buttonVariants({ variant: "outline", size: "md" }), "gap-2")}
    >
      <Download className="size-4" />
      Export CSV
    </a>
  );
}
