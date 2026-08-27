export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL_SGA);
}

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY_SGA);
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID_SGA &&
      process.env.R2_ACCESS_KEY_ID_SGA &&
      process.env.R2_SECRET_ACCESS_KEY_SGA &&
      process.env.R2_BUCKET_NAME_SGA &&
      process.env.R2_PUBLIC_URL_SGA
  );
}
