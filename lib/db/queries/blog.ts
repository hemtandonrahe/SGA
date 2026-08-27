import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { blogCategories, blogPosts } from "@/lib/db/schema";

function withCategory() {
  const db = getDb();
  return db
    .select({ post: blogPosts, categoryName: blogCategories.name })
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id));
}

function flatten<T extends { post: typeof blogPosts.$inferSelect; categoryName: string | null }>(row: T) {
  return { ...row.post, categoryName: row.categoryName };
}

export type PostWithCategory = ReturnType<typeof flatten>;

export async function listPublishedPosts(): Promise<PostWithCategory[]> {
  const rows = await withCategory()
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map(flatten);
}

export async function getFeaturedPost(): Promise<PostWithCategory | null> {
  const [row] = await withCategory()
    .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.isFeatured, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(1);
  return row ? flatten(row) : null;
}

export async function getPublishedPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const [row] = await withCategory()
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
    .limit(1);
  return row ? flatten(row) : null;
}

export async function incrementPostViewCount(id: string) {
  const db = getDb();
  await db
    .update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, id));
}

export async function getTopViewedPosts(limit = 5) {
  const db = getDb();
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.viewCount))
    .limit(limit);
}

export async function listAllPostsForAdmin() {
  const db = getDb();
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getPostById(id: string) {
  const db = getDb();
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return post ?? null;
}

export async function listCategories() {
  const db = getDb();
  return db.select().from(blogCategories).orderBy(blogCategories.name);
}
