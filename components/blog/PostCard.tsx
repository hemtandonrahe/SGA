import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "./CategoryBadge";
import type { PostWithCategory } from "@/lib/db/queries/blog";

export function PostCard({ post }: { post: PostWithCategory }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated transition-colors hover:border-accent-border"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-elevated-2">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">SGA</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {post.categoryName && <CategoryBadge name={post.categoryName} />}
        <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-accent">
          {post.title}
        </h3>
        {post.excerpt && <p className="line-clamp-2 text-sm text-text-secondary">{post.excerpt}</p>}
        <p className="mt-auto pt-2 text-xs text-text-muted">
          {post.publishedAt &&
            new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(post.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
