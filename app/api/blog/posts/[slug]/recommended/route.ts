import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  fetchPostMetaBySlug,
  fetchRecommendedPostsPage,
  type BlogCursor,
} from "@/sanity/lib/posts";
import type { BlogRecommendedPostsPageResponse } from "@/sanity/lib/posts.types";

export const dynamic = "force-dynamic";

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug?.trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const url = new URL(req.url);
    const limitRaw = Number(url.searchParams.get("limit") ?? "10");
    const limit = clampInt(Number.isFinite(limitRaw) ? limitRaw : 10, 1, 20);

    const cursorDate = url.searchParams.get("cursorDate");
    const cursorId = url.searchParams.get("cursorId");

    if ((cursorDate && !cursorId) || (!cursorDate && cursorId)) {
      return NextResponse.json(
        { error: "Both cursorDate and cursorId are required together." },
        { status: 400 }
      );
    }

    const cursor: BlogCursor | null =
      cursorDate && cursorId ? { date: cursorDate, id: cursorId } : null;

    const meta = await fetchPostMetaBySlug(slug);
    if (!meta) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const page = await fetchRecommendedPostsPage({
      categorySlugs: meta.categorySlugs,
      excludeIds: [meta._id],
      limit,
      cursor,
    });

    const payload: BlogRecommendedPostsPageResponse = {
      items: page.items,
      nextCursor: page.nextCursor,
    };
    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error("[/api/blog/posts/[slug]/recommended] GET failed", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
