import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { isDbConfigured } from "@/lib/integrations/config";
import { listPublishedPosts } from "@/lib/db/queries/blog";

// Omitted entirely (not an empty-state message) when there's nothing published
// yet — an empty "Built in the open" section on the splash page would read as
// broken rather than honest.
export async function SplashBuildLog() {
  const posts = isDbConfigured() ? (await listPublishedPosts()).slice(0, 3) : [];
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium tracking-widest text-accent-2 uppercase">Built in the open</p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Follow the build, before you join.
          </h2>
        </div>
        <Link href="/blog" className="text-sm font-medium text-text-secondary hover:text-text-primary">
          View all posts →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
