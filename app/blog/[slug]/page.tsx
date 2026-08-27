import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { PostContent } from "@/components/blog/PostContent";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { isDbConfigured } from "@/lib/integrations/config";
import { getPublishedPostBySlug, incrementPostViewCount } from "@/lib/db/queries/blog";

// Every render increments the view count, and admin edits (title, publish state,
// content) must show up immediately — force per-request rendering rather than a
// cached build-time snapshot.
export const dynamic = "force-dynamic";

type Params = { slug: string };

async function loadPost(slug: string) {
  if (!isDbConfigured()) return null;
  return getPublishedPostBySlug(slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  try {
    await incrementPostViewCount(post.id);
  } catch (err) {
    console.error("[blog] failed to increment view count (non-fatal):", err);
  }

  return (
    <>
      <Nav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-16">
          {post.categoryName && (
            <div className="mb-4">
              <CategoryBadge name={post.categoryName} />
            </div>
          )}
          <h1 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">{post.title}</h1>
          {post.publishedAt && (
            <p className="mt-3 text-sm text-text-muted">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(post.publishedAt)}
            </p>
          )}

          {post.coverImageUrl && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image src={post.coverImageUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          )}

          <div className="mt-8">
            <PostContent html={post.contentHtml} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
