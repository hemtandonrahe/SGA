import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { isR2Configured } from "@/lib/integrations/config";

export class R2NotConfiguredError extends Error {
  constructor() {
    super("R2 image storage is not configured. Add the R2_* env vars — see README.md.");
    this.name = "R2NotConfiguredError";
  }
}

let cached: S3Client | null = null;

// R2 is S3-compatible, so the regular AWS S3 SDK works against Cloudflare's
// S3-compatible endpoint — just point it at the account's R2 endpoint instead of AWS.
export function getR2Client(): S3Client {
  if (!isR2Configured()) throw new R2NotConfiguredError();
  if (!cached) {
    cached = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID_SGA}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID_SGA!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY_SGA!,
      },
    });
  }
  return cached;
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME_SGA!;
}

export function getR2PublicUrl(objectKey: string): string {
  const base = process.env.R2_PUBLIC_URL_SGA!.replace(/\/$/, "");
  return `${base}/${objectKey}`;
}
