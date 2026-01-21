"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

import type {
  BlogCursor,
  BlogCategoryListItem,
  BlogCategoriesResponse,
  BlogListItem,
  BlogPostsPage,
} from "@/sanity/lib/posts.types";
import { PostCard } from "@/components/blog/blog-cards";
import { Button } from "@/components/ui/button";

type Props = {
  initialItems: BlogListItem[];
  initialCursor: BlogCursor | null;
  excludeIds: string[];
  pageSize?: number;
  initialCategories?: BlogCategoryListItem[];
};

async function fetchPostsPageClient(options: {
  limit: number;
  cursor: BlogCursor | null;
  excludeIds: string[];
  categorySlug: string | null;
}): Promise<BlogPostsPage> {
  const params = new URLSearchParams();
  params.set("limit", String(options.limit));

  if (options.cursor) {
    params.set("cursorDate", options.cursor.date);
    params.set("cursorId", options.cursor.id);
  }

  if (options.excludeIds.length > 0) {
    params.set("excludeIds", options.excludeIds.join(","));
  }

  if (options.categorySlug) {
    params.set("category", options.categorySlug);
  }

  const res = await fetch(`/api/blog/posts?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts page (${res.status})`);
  }
  return res.json() as Promise<BlogPostsPage>;
}

async function fetchCategoriesClient(options?: {
  limit?: number;
}): Promise<BlogCategoryListItem[]> {
  const params = new URLSearchParams();
  if (typeof options?.limit === "number") {
    params.set("limit", String(options.limit));
  }

  const qs = params.toString();
  const res = await fetch(
    qs ? `/api/blog/categories?${qs}` : "/api/blog/categories"
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }
  const data = (await res.json()) as BlogCategoriesResponse;
  return data.categories ?? [];
}

export default function BlogInfiniteGrid({
  initialItems,
  initialCursor,
  excludeIds,
  pageSize = 12,
  initialCategories,
}: Props) {
  const stableExcludeIds = useMemo(() => excludeIds, [excludeIds]);

  const initialItemsRef = useRef(initialItems);
  const initialCursorRef = useRef(initialCursor);

  const [categories, setCategories] = useState<BlogCategoryListItem[]>(
    initialCategories ?? []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [items, setItems] = useState<BlogListItem[]>(initialItems);
  const [cursor, setCursor] = useState<BlogCursor | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const querySeqRef = useRef(0);

  const categoriesScrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let cancelled = false;

    if (categories.length > 0) return;

    setIsLoadingCategories(true);
    setCategoriesError(null);
    fetchCategoriesClient({ limit: 10 })
      .then((cats) => {
        if (cancelled) return;
        setCategories(cats);
      })
      .catch((e) => {
        if (cancelled) return;
        setCategoriesError(
          e instanceof Error ? e.message : "Failed to load categories"
        );
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const seq = ++querySeqRef.current;

    if (!selectedCategorySlug) {
      setItems(initialItemsRef.current);
      setCursor(initialCursorRef.current);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchPostsPageClient({
      limit: pageSize,
      cursor: null,
      excludeIds: [],
      categorySlug: selectedCategorySlug,
    })
      .then((page) => {
        if (querySeqRef.current !== seq) return;
        setItems(page.items);
        setCursor(page.nextCursor);
      })
      .catch((e) => {
        if (querySeqRef.current !== seq) return;
        setItems([]);
        setCursor(null);
        setError(e instanceof Error ? e.message : "Failed to load posts");
      })
      .finally(() => {
        if (querySeqRef.current !== seq) return;
        setIsLoading(false);
      });
  }, [pageSize, selectedCategorySlug, stableExcludeIds]);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    if (!cursor) return;

    setIsLoading(true);
    setError(null);
    try {
      const effectiveExcludeIds = selectedCategorySlug ? [] : stableExcludeIds;
      const page = await fetchPostsPageClient({
        limit: pageSize,
        cursor,
        excludeIds: effectiveExcludeIds,
        categorySlug: selectedCategorySlug,
      });
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more posts");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading, pageSize, stableExcludeIds, selectedCategorySlug]);

  const scrollCategoriesBy = useCallback((dir: -1 | 1) => {
    const el = categoriesScrollerRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.min(420, el.clientWidth * 0.75));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!showAllCategories) return;
    if (categories.length > 10) return;

    let cancelled = false;
    setIsLoadingCategories(true);
    setCategoriesError(null);

    fetchCategoriesClient()
      .then((cats) => {
        if (cancelled) return;
        setCategories(cats);
      })
      .catch((e) => {
        if (cancelled) return;
        setCategoriesError(
          e instanceof Error ? e.message : "Failed to load categories"
        );
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categories.length, showAllCategories]);

  return (
    <div>
      <div className="mb-10">
        <div className="relative group/cats">
          <div
            ref={categoriesScrollerRef}
            className="flex items-center gap-1 mx-7 overflow-x-auto pb-4 pt-1 whitespace-nowrap [&::-webkit-scrollbar]:hidden mask-linear-fade"
          >
            {/* 'All' Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                selectedCategorySlug === null
                  ? "bg-black text-white border-black hover:bg-black/90"
                  : "bg-transparent text-black border-black/10 hover:border-black/40 hover:bg-black cursor-pointer hover:text-white"
              }`}
              onClick={() => setSelectedCategorySlug(null)}
            >
              All Articles
            </Button>

            {/* Category List */}
            {(showAllCategories ? categories : categories.slice(0, 10)).map(
              (c) => (
                <Button
                  key={c.slug}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategorySlug === c.slug
                      ? "bg-black text-white border-black hover:bg-black/90"
                      : "bg-transparent text-black border-black/10 hover:border-black/40 hover:bg-black cursor-pointer hover:text-white"
                  }`}
                  onClick={() => setSelectedCategorySlug(c.slug)}
                  disabled={isLoadingCategories}
                >
                  {c.title}
                  {typeof c.postCount === "number" ? (
                    <span className="ml-1.5 opacity-60 text-xs">
                      {c.postCount}
                    </span>
                  ) : (
                    ""
                  )}
                </Button>
              )
            )}
          </div>
          {(showAllCategories
            ? categories.length
            : Math.min(categories.length, 10)) > 4 ? (
            <>
              <div className="absolute -mt-1.5 left-0 top-1/2 -translate-y-1/2 -translate-x-3 opacity-100 transition-opacity duration-300 hidden md:block">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer border border-[#191919]/10 bg-white text-[#191919] hover:bg-[#191919] hover:text-white hover:border-[#191919] shadow-sm transition-colors"
                  onClick={() => scrollCategoriesBy(-1)}
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </div>
              <div className="absolute -mt-1.5 right-0 top-1/2 -translate-y-1/2 translate-x-3 opacity-100 transition-opacity duration-300 hidden md:block">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer border border-[#191919]/10 bg-white text-[#191919] hover:bg-[#191919] hover:text-white hover:border-[#191919] shadow-sm transition-colors"
                  onClick={() => scrollCategoriesBy(1)}
                  aria-label="Scroll categories right"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {categories.length > 10 ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setShowAllCategories((v) => !v)}
              className="px-0 text-[#191919]/60 hover:text-[#191919] text-xs uppercase tracking-wider font-medium decoration-[#191919]/20"
            >
              {showAllCategories ? "Show top 10" : "View all categories"}
            </Button>
          ) : null}

          {categoriesError ? (
            <span className="text-sm text-red-500/80">
              {categoriesError}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {items.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center border rounded-4xl border-dashed border-[#191919]/10 mt-8">
          <p className="inter text-[#191919]/40 text-lg">No articles found.</p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-12 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          {cursor ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="text-sm font-medium underline text-red-700 hover:text-red-900"
            >
              Try again
            </button>
          ) : null}
        </div>
      ) : null}

      {cursor ? (
        <div className="mt-16 flex items-center justify-between">
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={isLoading}
            className="rounded-full border border-[#191919]/20 bg-transparent px-8 py-3 text-sm font-medium text-[#191919] hover:bg-[#191919] hover:text-white transition-all disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More Articles"}
          </button>
          <div className="flex-1 flex justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="ml-4 rounded-full border border-[#191919]/20 bg-transparent p-3 text-[#191919] hover:bg-[#191919] hover:text-white transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : items.length > 0 && !isLoading ? (
        <div className="mt-20 flex items-center justify-center gap-4 opacity-40">
           <div className="h-px w-12 bg-[#191919]" />
           <p className="text-sm text-[#191919] font-medium uppercase tracking-widest">You're up to date</p>
           <div className="h-px w-12 bg-[#191919]" />
        </div>
      ) : null}
    </div>
  );
}
