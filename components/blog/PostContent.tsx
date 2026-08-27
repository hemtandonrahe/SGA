// contentHtml is sanitized with DOMPurify at write time (lib/actions/blog.ts) before
// it ever reaches the database, so rendering it here is safe.
export function PostContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-display prose-a:text-accent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
