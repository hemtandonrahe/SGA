"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createCategory } from "@/lib/actions/blog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewCategoryDialog({ onCreated }: { onCreated?: (id: string) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createCategory({ name });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setName("");
      router.refresh();
      onCreated?.(result.id);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          <Plus className="size-3.5" /> New category
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>New category</DialogTitle>
        <div className="mt-4 flex flex-col gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button onClick={onSubmit} disabled={pending || !name.trim()} size="sm" className="self-end">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
