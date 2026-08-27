import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { WaitlistLead } from "@/lib/db/schema";

const roleLabels: Record<WaitlistLead["role"], string> = {
  player: "Player",
  facility: "Facility",
  partner: "Partner",
};

export function RoleBadge({ role }: { role: WaitlistLead["role"] }) {
  return <Badge variant={role === "facility" ? "info" : role === "partner" ? "accent" : "neutral"}>{roleLabels[role]}</Badge>;
}

const statusVariants: Record<WaitlistLead["status"], BadgeProps["variant"]> = {
  new: "neutral",
  contacted: "info",
  qualified: "accent",
  invited: "success",
  archived: "warning",
};

const statusLabels: Record<WaitlistLead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  invited: "Invited",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: WaitlistLead["status"] }) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
