import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SetupNotice({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-lg flex-col items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 p-8 text-center",
        className
      )}
    >
      <AlertTriangle className="size-6 text-warning" />
      <p className="font-display text-base font-semibold text-text-primary">{title}</p>
      {children && <div className="text-sm text-text-secondary">{children}</div>}
    </div>
  );
}
