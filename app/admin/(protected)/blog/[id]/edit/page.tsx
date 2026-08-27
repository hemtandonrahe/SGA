import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostById, listCategories } from "@/lib/db/queries/blog";
import { isDbConfigured, isUploadThingConfigured } from "@/lib/integrations/config";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Badge } from "@/components/ui/Badge";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDbConfigured()) {
    return <SetupNotice title="No database connected yet" />;
  }

  const [post, categories] = await Promise.all([getPostById(id), listCategories()]);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" /> Back to blog
      </Link>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit post</h1>
        <Badge variant={post.isPublished ? "success" : "neutral"}>{post.isPublished ? "Published" : "Draft"}</Badge>
      </div>
      <BlogPostForm post={post} categories={categories} uploadThingConfigured={isUploadThingConfigured()} />
    </div>
  );
}
