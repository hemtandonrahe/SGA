"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing/utils";
import { SetupNotice } from "@/components/ui/SetupNotice";

export function CoverImageUploader({
  configured,
  value,
  onChange,
}: {
  configured: boolean;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <SetupNotice title="Image uploads aren't configured" className="p-4 text-left">
        Add <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">UPLOADTHING_TOKEN_SGA</code>{" "}
        to enable cover image uploads.
      </SetupNotice>
    );
  }

  if (value) {
    return (
      <div className="relative w-full max-w-md overflow-hidden rounded-md border border-border-strong">
        <Image src={value} alt="Cover" width={640} height={360} className="h-48 w-full object-cover" unoptimized />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-bg-base/80 text-text-primary hover:bg-danger"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <UploadDropzone
        endpoint="blogCoverImage"
        onClientUploadComplete={(res) => {
          setError(null);
          const url = res?.[0]?.url;
          if (url) onChange(url);
        }}
        onUploadError={(err) => setError(err.message)}
        appearance={{
          container:
            "border-border-strong bg-bg-raised rounded-md py-8",
          label: "text-text-secondary",
          allowedContent: "text-text-muted",
          button: "bg-accent text-accent-foreground",
        }}
      />
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
