import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  contentHtml: z.string(),
  coverImageUrl: z.string().trim().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable().or(z.literal("")),
  isFeatured: z.boolean().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
});
