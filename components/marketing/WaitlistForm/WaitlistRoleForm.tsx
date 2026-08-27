"use client";

import { useState, type ReactNode } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { Check, Loader2 } from "lucide-react";
import { submitWaitlistLead } from "@/lib/actions/waitlist";
import { playSwingSound } from "@/lib/audio/swingSound";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";

type CommonValues = {
  name: string;
  email: string;
  location?: string;
  consent: boolean;
  source?: string;
  companyWebsite?: string;
};

export function WaitlistRoleForm<T extends FieldValues & CommonValues>({
  schema,
  defaultValues,
  children,
  submitLabel = "Join the waitlist",
}: {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  children: (form: UseFormReturn<T>) => ReactNode;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // zod's resolver generic plumbing doesn't infer cleanly through a generic T here
  // (TFieldValues vs TTransformedValues) — cast once at the boundary; the runtime
  // behavior (validate `raw` against `schema`) is unaffected.
  const form = useForm<T>({
    resolver: zodResolver(schema as ZodType<T, FieldValues>) as unknown as Resolver<T>,
    defaultValues,
  });

  async function onSubmit(values: T) {
    setStatus("idle");
    setErrorMessage(null);
    const result = await submitWaitlistLead(values);
    if (result.ok) {
      setStatus("success");
      playSwingSound();
      form.reset(defaultValues);
      return;
    }
    setStatus("error");
    setErrorMessage(result.error);
    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        form.setError(field as Path<T>, { type: "server", message });
      }
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-accent-border bg-accent-soft px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <p className="font-display text-lg font-semibold text-text-primary">You&apos;re on the list.</p>
        <p className="max-w-sm text-sm text-text-secondary">
          Check your inbox for confirmation — we&apos;ll reach out as soon as there&apos;s a next
          step for you.
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => setStatus("idle")}>
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" aria-invalid={!!form.formState.errors.name} {...form.register("name" as Path<T>)} />
        {form.formState.errors.name && (
          <p className="text-xs text-danger">{String(form.formState.errors.name.message)}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email" as Path<T>)}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-danger">{String(form.formState.errors.email.message)}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Location (city, state/country)</Label>
        <Input id="location" {...form.register("location" as Path<T>)} />
      </div>

      {children(form)}

      {/* Honeypot — hidden from real visitors via CSS, not `type="hidden"`, so bots that
          fill every visible field still trip it; screen readers skip it via aria-hidden. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Leave this field empty</label>
        <input id="companyWebsite" tabIndex={-1} autoComplete="off" {...form.register("companyWebsite" as Path<T>)} />
      </div>

      <div className="col-span-full flex items-start gap-3 pt-1">
        <Checkbox
          id="consent"
          checked={!!form.watch("consent" as Path<T>)}
          onCheckedChange={(checked) =>
            form.setValue("consent" as Path<T>, (checked === true) as never, { shouldValidate: true })
          }
          aria-invalid={!!form.formState.errors.consent}
        />
        <Label htmlFor="consent" className="font-normal leading-snug text-text-secondary">
          I agree to be contacted by SGA about my waitlist signup and future updates.
        </Label>
      </div>
      {form.formState.errors.consent && (
        <p className="col-span-full -mt-3 text-xs text-danger">
          {String(form.formState.errors.consent.message)}
        </p>
      )}

      {status === "error" && errorMessage && (
        <p className="col-span-full rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div className="col-span-full">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
