import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z
    .boolean()
    .refine((v) => v === true, "You must agree to be contacted to join the waitlist"),
  source: z.string().trim().max(200).optional().or(z.literal("")),
  // Honeypot: real visitors never fill this in — a bot filling every field will.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
};

export const playerWaitlistSchema = z.object({
  role: z.literal("player"),
  ...baseFields,
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "competitive"]).optional(),
  simulatorFrequency: z
    .enum(["never", "monthly", "weekly", "multiple-times-a-week"])
    .optional(),
  interestedInLeaguesOrTournaments: z.boolean().optional(),
});

export const facilityWaitlistSchema = z.object({
  role: z.literal("facility"),
  ...baseFields,
  facilityName: z.string().trim().min(1, "Facility name is required").max(200),
  city: z.string().trim().max(200).optional().or(z.literal("")),
  state: z.string().trim().max(200).optional().or(z.literal("")),
  numberOfBays: z.coerce.number().int().min(0).max(1000).optional(),
  currentSimulatorTech: z.string().trim().max(500).optional().or(z.literal("")),
  contactName: z.string().trim().max(200).optional().or(z.literal("")),
  contactPhone: z.string().trim().max(50).optional().or(z.literal("")),
});

export const partnerWaitlistSchema = z.object({
  role: z.literal("partner"),
  ...baseFields,
  company: z.string().trim().min(1, "Company is required").max(200),
  partnerType: z.enum(["hardware", "software", "other"]).optional(),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\//i.test(v) || /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v),
      "Enter a valid website"
    ),
  interestNotes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const waitlistSchema = z.discriminatedUnion("role", [
  playerWaitlistSchema,
  facilityWaitlistSchema,
  partnerWaitlistSchema,
]);

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type PlayerWaitlistInput = z.infer<typeof playerWaitlistSchema>;
export type FacilityWaitlistInput = z.infer<typeof facilityWaitlistSchema>;
export type PartnerWaitlistInput = z.infer<typeof partnerWaitlistSchema>;
