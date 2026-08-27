import Link from "next/link";
import { Plus } from "lucide-react";
import { isDbConfigured } from "@/lib/integrations/config";
import { listAllPostsForAdmin } from "@/lib/db/queries/blog";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { cn } from "@/lib/utils/cn";

export default async function AdminBlogListPage() {
  if (!isDbConfigured()) {
    return <SetupNotice title="No database connected yet" />;
  }

  const posts = await listAllPostsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Blog</h1>
          <p className="text-sm text-text-muted">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className={cn(buttonVariants({ size: "md" }), "gap-2")}>
          <Plus className="size-4" /> New post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border-subtle bg-bg-elevated text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-muted">
                  No posts yet — create your first one.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated">
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-text-primary hover:text-accent">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={post.isPublished ? "success" : "neutral"}>
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                    {post.isFeatured && <Badge variant="accent">Featured</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{post.viewCount}</td>
                <td className="px-4 py-3 text-text-muted">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(post.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <PostRowActions post={post} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
