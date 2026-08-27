import { Badge } from "@/components/ui/Badge";

export function CategoryBadge({ name }: { name: string }) {
  return <Badge variant="accent">{name}</Badge>;
}
