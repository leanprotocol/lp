import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { format } from "date-fns";
import type React from "react";
import { ArrowLeft, Calendar, User, Hash, AlignLeft, Table } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/blog/blog-cards";
import { urlFor } from "@/sanity/lib/image";
import {
  fetchPostBySlug,
  fetchPostSlugs,
  fetchRecommendedPosts,
  type BlogPost,
} from "@/sanity/lib/posts";

export const revalidate = 60;

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function extractToc(body: BlogPost["body"]): TocItem[] {
  if (!body) return [];
  const items: TocItem[] = [];

  for (const block of body as any[]) {
    if (!block || block._type !== "block") continue;
    const style = String(block.style || "normal");
    if (style !== "h2" && style !== "h3" && style !== "h4") continue;
    if (typeof block._key !== "string" || !block._key) continue;

    const text = Array.isArray(block.children)
      ? block.children
          .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
          .join("")
          .trim()
      : "";

    if (!text) continue;

    const level = style === "h2" ? 2 : style === "h3" ? 3 : 4;
    items.push({ id: block._key, text, level });
  }

  return items;
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-base md:text-lg text-dark/80 leading-relaxed mb-6 font-light">
        {children}
      </p>
    ),
    h1: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { _key?: string };
    }) => (
      <h1
        id={value?._key}
        className="font-serif text-3xl md:text-4xl text-dark leading-tight mt-10 mb-6 scroll-mt-28"
      >
        {children}
      </h1>
    ),
    h2: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { _key?: string };
    }) => (
      <h2
        id={value?._key}
        className="font-serif text-2xl md:text-3xl text-dark leading-tight mt-10 mb-4 scroll-mt-28 border-b border-dark/10 pb-2"
      >
        {children}
      </h2>
    ),
    h3: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { _key?: string };
    }) => (
      <h3
        id={value?._key}
        className="font-serif text-xl md:text-2xl text-dark leading-tight mt-8 mb-4 scroll-mt-28"
      >
        {children}
      </h3>
    ),
    h4: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { _key?: string };
    }) => (
      <h4
        id={value?._key}
        className="font-sans text-lg font-bold text-dark mt-6 mb-3 scroll-mt-28"
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-[#798F8B] pl-6 py-2 my-8 italic text-xl text-dark bg-accent/20">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pl-6 space-y-2 mb-6 text-dark/80 marker:text-[#798F8B]">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <li className="leading-relaxed pl-2">{children}</li>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        className="text-dark underline underline-offset-4 decoration-[#798F8B]/50 hover:text-[#798F8B] transition-colors"
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    ),
  },
};

export async function generateStaticParams() {
  try {
    const slugs = await fetchPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error(
      "[/blog/[slug]] generateStaticParams fetchPostSlugs failed",
      err
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    post = await fetchPostBySlug(slug);
  } catch (err) {
    console.error("[/blog/[slug]] generateMetadata fetchPostBySlug failed", {
      slug,
      err,
    });
  }

  if (!post) {
    return {
      title: "Blog post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    post = await fetchPostBySlug(slug);
  } catch (err) {
    console.error("[/blog/[slug]] page fetchPostBySlug failed", { slug, err });
  }

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(2000).height(1200).fit("crop").url()
    : null;
  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image).width(160).height(160).fit("crop").url()
    : null;
  const dateText = post.publishedAt
    ? format(new Date(post.publishedAt), "MMM d, yyyy")
    : null;
  const wordCount = post.excerpt
    ? post.excerpt.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));
  const tocItems = extractToc(post.body);

  const categorySlugs = (post.categories || [])
    .map((c) => c.slug)
    .filter((v): v is string => Boolean(v));

  const recommendedPosts = await fetchRecommendedPosts({
    categorySlugs,
    excludeIds: [post._id],
    limit: 3,
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />

<div className="border-b border-dark/10 ">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#798F8B] hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            All Blogs
          </Link>
        </div>
      </div>

      <section className="relative overflow-visible pb-20">
        <div className="container mx-auto px-4 md:px-8 py-10 md:pb-16 pt-10 max-w-7xl">
          
          <div className="grid gap-12 lg:grid-cols-[1fr_340px] items-start">
            <div>
              {/* <div className="flex flex-wrap items-center gap-2 mb-10">
                {post.isFeatured && (
                  <Badge className="bg-dark text-white hover:bg-dark rounded-full px-4 text-xs font-bold tracking-wider">
                    FEATURED
                  </Badge>
                )}
                {(post.categories || []).map((c) => (
                  <Badge
                    key={c.slug || c.title}
                    variant="outline"
                    className="border-dark/20 text-dark rounded-full px-4 text-xs font-bold tracking-wider"
                  >
                    {c.title}
                  </Badge>
                ))}
              </div> */}

              <h1 className="font-serif text-4xl md:text-[3.1rem] text-dark leading-[1.3] mb-8 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 border-y border-dark/10 py-5 mb-10">
                <div className="flex items-center gap-3">
                  {authorImageUrl ? (
                    <img
                      src={authorImageUrl}
                      alt={post.author?.name || "Author"}
                      className="h-10 w-10 rounded-full object-cover border border-dark/10"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-dark/5 flex items-center justify-center">
                      <User className="h-5 w-5 text-dark/50" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#798F8B]">Author</span>
                    <span className="text-sm font-medium text-dark">
                      {post.author?.name || "Jen Foods Team"}
                    </span>
                  </div>
                </div>

                <div className="w-px h-8 bg-dark/10 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center text-[#798F8B]">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#798F8B]">Date</span>
                        <span className="text-sm font-medium text-dark">{dateText}</span>
                    </div>
                </div>
              </div>

              {imageUrl ? (
                <div className="mb-12 h-130 rounded-2xl overflow-hidden border border-dark/5">
                  <img
                    src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/660bdff49b02fc0b5ff75273_CTA%20Ready%20to%20Get%20Started%20Image.webp"
                    // src={imageUrl} 
                    alt={post.mainImage?.alt || post.title}
                    className="block w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div className="prose prose-lg max-w-none">
                {post.body ? (
                  <PortableText
                    value={post.body}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No content.</p>
                )}
              </div>
            </div>

            <aside className="hidden lg:block sticky top-24 self-start space-y-2">
              
              <div className="bg-white p-4 py-6 rounded-lg border border-dark/10 ">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#798F8B] mb-4 flex items-center gap-2">
                  <AlignLeft className="w-3 h-3" /> Article Info
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm pb-3 border-b border-dark/5">
                    <span className="text-dark/60 flex items-center gap-2"> Reading time</span>
                    <span className="text-dark/60">
                      {readingMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark/60">Type</span>
                    <span className="text-dark/60">
                      {post.isFeatured ? "Featured" : "Blog Post"}
                    </span>
                  </div>
                </div>
              </div>

               <div className="bg-white p-4 py-6 rounded-lg border border-dark/10 ">
                               {post.categories.length > 0 ? (
                  <div className="">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#798F8B] mb-3 flex items-center gap-2">
                        <Hash className="w-3 h-3" /> Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.slice(0, 6).map((c) => (
                        <span
                          key={c.slug || c.title}
                          className="px-2.5 py-1 bg-accent2/50 text-dark text-[10px] font-bold uppercase tracking-wider rounded-full border border-dark/10"
                        >
                          {c.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
               </div>

              <div className="bg-white p-4 py-6 rounded-lg border border-dark/10 ">
                 <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#798F8B] mb-3 flex items-center gap-2">
                        <Table className="w-3 h-3" /> Table of contents
                    </div>

                {tocItems.length > 0 ? (
                  <ul className="space-y-3 text-sm border-l-2 border-accent pl-2">
                    {tocItems.map((item) => (
                      <li
                        key={item.id}
                        className={
                          item.level === 3
                            ? "pl-4"
                            : item.level === 4
                            ? "pl-6"
                            : ""
                        }
                      >
                        <a
                          href={`#${item.id}`}
                          className="block text-dark/70 hover:text-dark transition-all"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No headings.
                  </p>
                )}
              </div>
            </aside>

          </div>
        </div>
      </section>

      {recommendedPosts.length > 0 ? (
        <section className="py-10 md:py-24 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <h2 className="heading mb-1">Recommended Blogs</h2>
                <p className="sub-heading text-dark/70">
                  More from the same topics.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedPosts.map((p) => (
                <PostCard key={p._id} post={p} showTypeBadge={false} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}