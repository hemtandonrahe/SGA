"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignLead } from "@/lib/actions/waitlist";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { StaffUser } from "@/lib/db/schema";

function toDateInputValue(d: Date | null) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export function AssigneeControl({
  leadId,
  assignedToUserId,
  followUpDueAt,
  staff,
}: {
  leadId: string;
  assignedToUserId: string | null;
  followUpDueAt: Date | null;
  staff: StaffUser[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [assignee, setAssignee] = useState(assignedToUserId ?? "");
  const [followUp, setFollowUp] = useState(toDateInputValue(followUpDueAt));

  function save() {
    startTransition(async () => {
      await assignLead(leadId, assignee || null, followUp ? new Date(followUp) : null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Assigned to</Label>
        <Select value={assignee || undefined} onValueChange={setAssignee}>
          <SelectTrigger>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {staff.map((s) => (
              <SelectItem key={s.clerkUserId} value={s.clerkUserId}>
                {s.name || s.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="followUp">Follow-up due</Label>
        <Input
          id="followUp"
          type="date"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
      </div>

      <Button size="sm" variant="secondary" onClick={save} disabled={pending}>
        Save
      </Button>
    </div>
  );
}
