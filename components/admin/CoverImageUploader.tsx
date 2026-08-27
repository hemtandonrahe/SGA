"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { SetupNotice } from "@/components/ui/SetupNotice";

async function uploadToR2(file: File): Promise<string> {
  const presignRes = await fetch("/api/r2-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, fileSize: file.size }),
  });
  if (!presignRes.ok) {
    const body = await presignRes.json().catch(() => ({}));
    throw new Error(body.error || "Failed to prepare upload");
  }
  const { uploadUrl, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error("Upload to storage failed");

  return publicUrl;
}

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
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!configured) {
    return (
      <SetupNotice title="Image uploads aren't configured" className="p-4 text-left">
        Add the <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">R2_*</code>{" "}
        environment variables to enable cover image uploads.
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

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const url = await uploadToR2(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-md">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={onFileSelected}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-border-strong bg-bg-raised py-10 text-text-secondary transition-colors hover:border-accent-border hover:text-text-primary disabled:opacity-60"
      >
        {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
        <span className="text-sm">{uploading ? "Uploading…" : "Click to upload a cover image"}</span>
        <span className="text-xs text-text-muted">PNG, JPEG, WebP, or GIF — up to 4MB</span>
      </button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
