import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const f = createUploadthing();

export const ourFileRouter = {
  blogCoverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Runs before the upload is accepted — an unauthenticated/non-admin caller
      // never gets an upload URL, so this endpoint can't be used as an open file host.
      try {
        const admin = await requireAdmin();
        return { uploadedBy: admin.clerkUserId };
      } catch {
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.info(`[uploadthing] blog cover uploaded by ${metadata.uploadedBy}: ${file.url}`);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
