import { listCategories } from "@/lib/db/queries/blog";
import { isDbConfigured, isUploadThingConfigured } from "@/lib/integrations/config";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage() {
  if (!isDbConfigured()) {
    return <SetupNotice title="No database connected yet" />;
  }

  const categories = await listCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-text-primary">New post</h1>
      <BlogPostForm categories={categories} uploadThingConfigured={isUploadThingConfigured()} />
    </div>
  );
}
