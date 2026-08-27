"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addLeadNote } from "@/lib/actions/waitlist";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { LeadNote, StaffUser } from "@/lib/db/schema";

function authorLabel(authorUserId: string | null, staff: StaffUser[]) {
  if (!authorUserId) return "Unknown";
  const match = staff.find((s) => s.clerkUserId === authorUserId);
  return match?.name || match?.email || "Staff";
}

export function LeadNotesPanel({
  leadId,
  notes,
  staff,
}: {
  leadId: string;
  notes: LeadNote[];
  staff: StaffUser[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    const body = String(formData.get("body") || "");
    if (!body.trim()) return;
    startTransition(async () => {
      await addLeadNote(leadId, body);
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form ref={formRef} action={onSubmit} className="flex flex-col gap-2">
        <Textarea name="body" placeholder="Add an internal note…" required />
        <Button type="submit" size="sm" className="self-end" disabled={pending}>
          Add note
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {notes.length === 0 && <p className="text-sm text-text-muted">No notes yet.</p>}
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border border-border-subtle bg-bg-elevated p-3">
            <p className="whitespace-pre-wrap text-sm text-text-primary">{note.body}</p>
            <p className="mt-2 text-xs text-text-muted">
              {authorLabel(note.authorUserId, staff)} ·{" "}
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
                note.createdAt
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
