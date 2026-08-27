import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { requireAdmin, UnauthorizedError } from "@/lib/auth/requireAdmin";
import { getR2BucketName, getR2Client, getR2PublicUrl, R2NotConfiguredError } from "@/lib/r2/client";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

// Admin-only: returns a short-lived presigned URL the browser uploads directly to
// R2 (not proxied through this server), plus the public URL to store once it lands.
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  let body: { fileName?: string; contentType?: string; fileSize?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fileName, contentType, fileSize } = body;
  if (!fileName || !contentType) {
    return NextResponse.json({ error: "fileName and contentType are required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({ error: "Only PNG, JPEG, WebP, or GIF images are allowed" }, { status: 400 });
  }
  if (typeof fileSize === "number" && fileSize > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File must be 4MB or smaller" }, { status: 400 });
  }

  try {
    const extension = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const objectKey = `blog-covers/${nanoid()}.${extension}`;

    const uploadUrl = await getSignedUrl(
      getR2Client(),
      new PutObjectCommand({
        Bucket: getR2BucketName(),
        Key: objectKey,
        ContentType: contentType,
      }),
      { expiresIn: 60 }
    );

    return NextResponse.json({ uploadUrl, publicUrl: getR2PublicUrl(objectKey) });
  } catch (err) {
    if (err instanceof R2NotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("[r2-upload] failed to create presigned URL:", err);
    return NextResponse.json({ error: "Failed to prepare upload" }, { status: 500 });
  }
}
