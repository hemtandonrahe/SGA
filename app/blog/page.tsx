import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { isDbConfigured } from "@/lib/integrations/config";
import { listPublishedPosts } from "@/lib/db/queries/blog";

// New/unpublished posts must appear immediately rather than waiting for the next
// build-time snapshot to expire.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and updates from SGA, the trusted competitive network for simulated golf.",
};

export default async function BlogIndexPage() {
  const posts = isDbConfigured() ? await listPublishedPosts() : [];

  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Blog</p>
            <h1 className="font-display text-4xl font-semibold text-text-primary">News from SGA</h1>
          </div>

          {!isDbConfigured() ? (
            <SetupNotice title="No database connected yet" />
          ) : posts.length === 0 ? (
            <p className="text-text-muted">No posts published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
