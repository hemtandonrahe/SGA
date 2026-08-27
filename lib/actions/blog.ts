"use server";

import { and, eq, ne } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { blogPostSchema, categorySchema, type BlogPostInput } from "@/lib/validations/blog";
import { slugify } from "@/lib/utils/slugify";

export type BlogActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function parseInput(raw: unknown): { ok: true; data: BlogPostInput } | { ok: false; result: BlogActionResult } {
  const parsed = blogPostSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, result: { ok: false, error: "Please check the highlighted fields.", fieldErrors } };
  }
  return { ok: true, data: parsed.data };
}

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const db = getDb();
  const condition = excludeId
    ? and(eq(blogPosts.slug, slug), ne(blogPosts.id, excludeId))
    : eq(blogPosts.slug, slug);
  const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(condition).limit(1);
  return !existing;
}

export async function createPost(raw: unknown): Promise<BlogActionResult> {
  const admin = await requireAdmin();
  const parsed = parseInput(raw);
  if (!parsed.ok) return parsed.result;
  const input = parsed.data;

  if (!(await assertSlugAvailable(input.slug))) {
    return { ok: false, error: "That slug is already in use.", fieldErrors: { slug: "Already in use" } };
  }

  const db = getDb();
  const [post] = await db
    .insert(blogPosts)
    .values({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      contentHtml: sanitizeHtml(input.contentHtml),
      coverImageUrl: input.coverImageUrl || null,
      categoryId: input.categoryId || null,
      authorUserId: admin.clerkUserId,
      isFeatured: false,
    })
    .returning({ id: blogPosts.id });

  revalidatePath("/admin/blog");
  return { ok: true, id: post.id };
}

export async function updatePost(id: string, raw: unknown): Promise<BlogActionResult> {
  await requireAdmin();
  const parsed = parseInput(raw);
  if (!parsed.ok) return parsed.result;
  const input = parsed.data;

  if (!(await assertSlugAvailable(input.slug, id))) {
    return { ok: false, error: "That slug is already in use.", fieldErrors: { slug: "Already in use" } };
  }

  const db = getDb();
  await db
    .update(blogPosts)
    .set({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      contentHtml: sanitizeHtml(input.contentHtml),
      coverImageUrl: input.coverImageUrl || null,
      categoryId: input.categoryId || null,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}/edit`);
  revalidatePath("/blog");
  return { ok: true, id };
}

export async function setPostPublished(id: string, isPublished: boolean) {
  await requireAdmin();
  const db = getDb();

  if (isPublished) {
    const [existing] = await db
      .select({ publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    await db
      .update(blogPosts)
      .set({ isPublished: true, publishedAt: existing?.publishedAt ?? new Date(), updatedAt: new Date() })
      .where(eq(blogPosts.id, id));
  } else {
    await db.update(blogPosts).set({ isPublished: false, updatedAt: new Date() }).where(eq(blogPosts.id, id));
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function setPostFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  const db = getDb();

  if (isFeatured) {
    await db.update(blogPosts).set({ isFeatured: false }).where(ne(blogPosts.id, id));
  }
  await db.update(blogPosts).set({ isFeatured, updatedAt: new Date() }).where(eq(blogPosts.id, id));

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const db = getDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function createCategory(raw: unknown): Promise<BlogActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Category name is required." };
  }
  const db = getDb();
  const [category] = await db
    .insert(blogCategories)
    .values({ name: parsed.data.name, slug: slugify(parsed.data.name) })
    .returning({ id: blogCategories.id });

  revalidatePath("/admin/blog");
  return { ok: true, id: category.id };
}
