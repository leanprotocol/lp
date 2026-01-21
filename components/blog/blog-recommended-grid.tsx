"use client";

import { useCallback, useState } from "react";

import { PostCard } from "@/components/blog/blog-cards";
import { Button } from "@/components/ui/button";
import type {
  BlogCursor,
  BlogListItem,
  BlogRecommendedPostsPageResponse,
} from "@/sanity/lib/posts.types";

type Props = {
  slug: string;
  initialItems: BlogListItem[];
  initialCursor: BlogCursor | null;
  pageSize?: number;
};

async function fetchRecommendedPostsPageClient(options: {
  slug: string;
  limit: number;
  cursor: BlogCursor | null;
}): Promise<BlogRecommendedPostsPageResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options.limit));

  if (options.cursor) {
    params.set("cursorDate", options.cursor.date);
    params.set("cursorId", options.cursor.id);
  }

  const res = await fetch(
    `/api/blog/posts/${encodeURIComponent(options.slug)}/recommended?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch recommended posts (${res.status})`);
  }

  return res.json() as Promise<BlogRecommendedPostsPageResponse>;
}

export default function BlogRecommendedGrid({
  slug,
  initialItems,
  initialCursor,
  pageSize = 4,
}: Props) {
  const [items, setItems] = useState<BlogListItem[]>(initialItems);
  const [cursor, setCursor] = useState<BlogCursor | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    if (!cursor) return;

    setIsLoading(true);
    setError(null);
    try {
      const page = await fetchRecommendedPostsPageClient({
        slug,
        limit: pageSize,
        cursor,
      });
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load recommended posts"
      );
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading, pageSize, slug]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((post) => (
          <PostCard key={post._id} post={post} showTypeBadge={false} />
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {cursor ? (
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading…" : "Show more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
