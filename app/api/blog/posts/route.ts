import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { fetchPostsPage, type BlogCursor } from "@/sanity/lib/posts";
import type { BlogPostsPage } from "@/sanity/lib/posts.types";

export const dynamic = "force-dynamic";

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const limitRaw = Number(searchParams.get("limit") ?? "12");
    const limit = clampInt(Number.isFinite(limitRaw) ? limitRaw : 12, 1, 50);

    const excludeIdsParam = searchParams.get("excludeIds") ?? "";
    const excludeIds = excludeIdsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const cursorDate = searchParams.get("cursorDate");
    const cursorId = searchParams.get("cursorId");

    const category = searchParams.get("category");
    const categorySlug =
      category && category.trim().length > 0 ? category.trim() : null;

    if ((cursorDate && !cursorId) || (!cursorDate && cursorId)) {
      return NextResponse.json(
        { error: "Both cursorDate and cursorId are required together." },
        { status: 400 }
      );
    }

    const cursor: BlogCursor | null =
      cursorDate && cursorId ? { date: cursorDate, id: cursorId } : null;

    const page: BlogPostsPage = await fetchPostsPage({
      limit,
      cursor,
      excludeIds,
      categorySlug,
    });

    return NextResponse.json(page, { status: 200 });
  } catch (err) {
    console.error("[/api/blog/posts] GET failed", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
