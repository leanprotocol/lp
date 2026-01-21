import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { fetchPostBySlug } from "@/sanity/lib/posts";
import type { BlogPost } from "@/sanity/lib/posts.types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug?.trim();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const post: BlogPost | null = await fetchPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.error("[/api/blog/posts/[slug]] GET failed", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
