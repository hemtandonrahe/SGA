"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, StarOff, Eye, EyeOff, Trash2 } from "lucide-react";
import { deletePost, setPostFeatured, setPostPublished } from "@/lib/actions/blog";
import type { BlogPost } from "@/lib/db/schema";

export function PostRowActions({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 text-text-secondary">
      <button
        title={post.isPublished ? "Unpublish" : "Publish"}
        disabled={pending}
        onClick={() => run(() => setPostPublished(post.id, !post.isPublished))}
        className="flex size-8 items-center justify-center rounded-md hover:bg-bg-elevated-2 hover:text-text-primary"
      >
        {post.isPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <button
        title={post.isFeatured ? "Unfeature" : "Feature"}
        disabled={pending}
        onClick={() => run(() => setPostFeatured(post.id, !post.isFeatured))}
        className="flex size-8 items-center justify-center rounded-md hover:bg-bg-elevated-2 hover:text-text-primary"
      >
        {post.isFeatured ? <Star className="size-4 fill-accent text-accent" /> : <StarOff className="size-4" />}
      </button>
      <button
        title="Delete"
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${post.title}"? This can't be undone.`)) {
            run(() => deletePost(post.id));
          }
        }}
        className="flex size-8 items-center justify-center rounded-md hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
