import "server-only";
import { Resend } from "resend";
import { isResendConfigured } from "@/lib/integrations/config";
import { WaitlistConfirmationEmail } from "./templates/WaitlistConfirmation";
import { InternalLeadNotificationEmail } from "./templates/InternalLeadNotification";

let cached: Resend | null = null;

function getResendClient(): Resend {
  if (!cached) cached = new Resend(process.env.RESEND_API_KEY);
  return cached;
}

const FROM = () => process.env.RESEND_FROM_EMAIL || "SGA <onboarding@resend.dev>";

export async function sendWaitlistConfirmation(params: {
  name: string;
  email: string;
  role: string;
}) {
  if (!isResendConfigured()) {
    console.info("[email] RESEND_API_KEY not set — skipping waitlist confirmation email.");
    return;
  }
  await getResendClient().emails.send({
    from: FROM(),
    to: params.email,
    subject: "You're on the SGA waitlist",
    react: WaitlistConfirmationEmail({ name: params.name, role: params.role }),
  });
}

export async function sendInternalLeadNotification(params: {
  name: string;
  email: string;
  role: string;
}) {
  if (!isResendConfigured()) {
    console.info("[email] RESEND_API_KEY not set — skipping internal lead notification.");
    return;
  }
  const notifyEmail = process.env.SGA_TEAM_NOTIFICATION_EMAIL;
  if (!notifyEmail) {
    console.info("[email] SGA_TEAM_NOTIFICATION_EMAIL not set — skipping internal notification.");
    return;
  }
  await getResendClient().emails.send({
    from: FROM(),
    to: notifyEmail,
    subject: `New ${params.role} waitlist signup: ${params.name}`,
    react: InternalLeadNotificationEmail(params),
  });
}
