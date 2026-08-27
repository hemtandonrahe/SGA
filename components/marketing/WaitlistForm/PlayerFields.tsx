"use client";

import { Controller } from "react-hook-form";
import { playerWaitlistSchema, type PlayerWaitlistInput } from "@/lib/validations/waitlist";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { WaitlistRoleForm } from "./WaitlistRoleForm";

const defaultValues: PlayerWaitlistInput = {
  role: "player",
  name: "",
  email: "",
  city: "",
  state: "",
  country: "United States",
  consent: false,
  source: "",
  skillLevel: undefined,
  simulatorFrequency: undefined,
  interestedInLeaguesOrTournaments: false,
};

export function PlayerWaitlistForm() {
  return (
    <WaitlistRoleForm schema={playerWaitlistSchema} defaultValues={defaultValues}>
      {(form) => (
        <>
          <div className="flex flex-col gap-1.5">
            <Label>Skill level</Label>
            <Controller
              control={form.control}
              name="skillLevel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>How often do you use a simulator?</Label>
            <Controller
              control={form.control}
              name="simulatorFrequency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">I don&apos;t yet</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="multiple-times-a-week">Multiple times a week</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="col-span-full flex items-start gap-3">
            <Controller
              control={form.control}
              name="interestedInLeaguesOrTournaments"
              render={({ field }) => (
                <Checkbox
                  id="interested"
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <Label htmlFor="interested" className="font-normal text-text-secondary">
              I&apos;m interested in joining leagues or tournaments
            </Label>
          </div>
        </>
      )}
    </WaitlistRoleForm>
  );
}
