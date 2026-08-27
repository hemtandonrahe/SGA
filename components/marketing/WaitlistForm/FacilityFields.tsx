"use client";

import { facilityWaitlistSchema, type FacilityWaitlistInput } from "@/lib/validations/waitlist";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { WaitlistRoleForm } from "./WaitlistRoleForm";

const defaultValues: FacilityWaitlistInput = {
  role: "facility",
  name: "",
  email: "",
  city: "",
  state: "",
  country: "",
  consent: false,
  source: "",
  facilityName: "",
  facilityCity: "",
  facilityState: "",
  numberOfBays: undefined,
  currentSimulatorTech: "",
  contactName: "",
  contactPhone: "",
};

export function FacilityWaitlistForm() {
  return (
    <WaitlistRoleForm schema={facilityWaitlistSchema} defaultValues={defaultValues} submitLabel="Submit facility interest">
      {(form) => (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="facilityName">Facility name</Label>
            <Input
              id="facilityName"
              aria-invalid={!!form.formState.errors.facilityName}
              {...form.register("facilityName")}
            />
            {form.formState.errors.facilityName && (
              <p className="text-xs text-danger">{String(form.formState.errors.facilityName.message)}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="numberOfBays">Number of bays</Label>
            <Input id="numberOfBays" type="number" min={0} {...form.register("numberOfBays")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="facilityCity">Facility city</Label>
            <Input id="facilityCity" {...form.register("facilityCity")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="facilityState">Facility state / region</Label>
            <Input id="facilityState" {...form.register("facilityState")} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="currentSimulatorTech">Current simulator hardware/software</Label>
            <Input id="currentSimulatorTech" placeholder="e.g. Trackman, GSPro, Foresight" {...form.register("currentSimulatorTech")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactName">Best contact name (if different)</Label>
            <Input id="contactName" {...form.register("contactName")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" type="tel" {...form.register("contactPhone")} />
          </div>
        </>
      )}
    </WaitlistRoleForm>
  );
}
