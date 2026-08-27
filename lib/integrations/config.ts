export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function isUploadThingConfigured(): boolean {
  return Boolean(process.env.UPLOADTHING_TOKEN);
}
