"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions/waitlist";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { WaitlistLead } from "@/lib/db/schema";

const STATUSES: WaitlistLead["status"][] = ["new", "contacted", "qualified", "invited", "archived"];

export function LeadStatusControl({ leadId, status }: { leadId: string; status: WaitlistLead["status"] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);

  function onChange(next: string) {
    const nextStatus = next as WaitlistLead["status"];
    setValue(nextStatus);
    startTransition(async () => {
      await updateLeadStatus(leadId, nextStatus);
      router.refresh();
    });
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-44" disabled={pending}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
