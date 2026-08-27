"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/lib/actions/blog";
import { slugify } from "@/lib/utils/slugify";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { CoverImageUploader } from "@/components/admin/CoverImageUploader";
import { NewCategoryDialog } from "@/components/admin/NewCategoryDialog";
import type { BlogCategory, BlogPost } from "@/lib/db/schema";

export function BlogPostForm({
  post,
  categories,
  imageUploadConfigured,
}: {
  post?: BlogPost;
  categories: BlogCategory[];
  imageUploadConfigured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.coverImageUrl ?? null);
  const [categoryId, setCategoryId] = useState<string>(post?.categoryId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function onSave() {
    setError(null);
    setFieldErrors({});
    const payload = {
      title,
      slug,
      excerpt,
      contentHtml,
      coverImageUrl,
      categoryId: categoryId || null,
    };

    startTransition(async () => {
      const result = post ? await updatePost(post.id, payload) : await createPost(payload);
      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      if (post) {
        router.refresh();
      } else {
        router.push(`/admin/blog/${result.id}/edit`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} aria-invalid={!!fieldErrors.title} />
          {fieldErrors.title && <p className="text-xs text-danger">{fieldErrors.title}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            aria-invalid={!!fieldErrors.slug}
          />
          {fieldErrors.slug && <p className="text-xs text-danger">{fieldErrors.slug}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Category</Label>
            <NewCategoryDialog onCreated={setCategoryId} />
          </div>
          <Select value={categoryId || undefined} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="No category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Cover image</Label>
          <CoverImageUploader configured={imageUploadConfigured} value={coverImageUrl} onChange={setCoverImageUrl} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Content</Label>
          <RichTextEditor content={contentHtml} onChange={setContentHtml} />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      <div>
        <Button onClick={onSave} disabled={pending}>
          {post ? "Save changes" : "Create draft"}
        </Button>
      </div>
    </div>
  );
}
