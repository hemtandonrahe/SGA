"use client";

import { Controller } from "react-hook-form";
import { partnerWaitlistSchema, type PartnerWaitlistInput } from "@/lib/validations/waitlist";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { WaitlistRoleForm } from "./WaitlistRoleForm";

const defaultValues: PartnerWaitlistInput = {
  role: "partner",
  name: "",
  email: "",
  location: "",
  consent: false,
  source: "",
  company: "",
  partnerType: undefined,
  website: "",
  interestNotes: "",
};

export function PartnerWaitlistForm() {
  return (
    <WaitlistRoleForm schema={partnerWaitlistSchema} defaultValues={defaultValues} submitLabel="Submit partner interest">
      {(form) => (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" aria-invalid={!!form.formState.errors.company} {...form.register("company")} />
            {form.formState.errors.company && (
              <p className="text-xs text-danger">{String(form.formState.errors.company.message)}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Partner type</Label>
            <Controller
              control={form.control}
              name="partnerType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware manufacturer</SelectItem>
                    <SelectItem value="software">Software / simulator platform</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://" {...form.register("website")} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="interestNotes">What kind of integration or sponsorship interests you?</Label>
            <Textarea id="interestNotes" {...form.register("interestNotes")} />
          </div>
        </>
      )}
    </WaitlistRoleForm>
  );
}
