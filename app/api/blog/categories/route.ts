import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { fetchCategories } from "@/sanity/lib/posts";
import type { BlogCategoriesResponse } from "@/sanity/lib/posts.types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const url = new URL(_req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : null;
    const effectiveLimit = Number.isFinite(limit)
      ? Math.max(1, Math.min(100, limit!))
      : undefined;

    const categories = await fetchCategories({ limit: effectiveLimit });
    const payload: BlogCategoriesResponse = { categories };
    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error("[/api/blog/categories] GET failed", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
