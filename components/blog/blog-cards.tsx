import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/sanity/lib/image";
import type { BlogListItem } from "@/sanity/lib/posts.types";
import { ArrowUpRight } from "lucide-react";

export function PostCard({
  post,
  showTypeBadge = true,
}: {
  post: BlogListItem;
  showTypeBadge?: boolean;
}) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(800).fit("crop").url()
    : null;
  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image).width(96).height(96).fit("crop").url()
    : null;
  const dateText = post.publishedAt
    ? format(new Date(post.publishedAt), "MMM d, yyyy")
    : null;
  const excerpt = post.excerpt
    ? post.excerpt.length > 160
      ? `${post.excerpt.slice(0, 160)}…`
      : post.excerpt
    : null;
  const wordCount = post.excerpt
    ? post.excerpt.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
<Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full bg-white rounded-[1.2rem] overflow-hidden border border-black/5 hover:border-black/10 transition-colors"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            // src={imageUrl}
            src="https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D"
            alt={post.mainImage?.alt || post.title}
            className="h-full w-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#F5F5F0]" />
        )}
        
        {/* Badges - Top Left, Clean */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-1">
          {(post.categories || []).slice(0, 2).map((c, i) => (
            <Badge
              key={`${c.slug ?? c.title ?? "cat"}-${i}`}
              className="rounded-full bg-white/90 text-black backdrop-blur-md border-0 px-2 py-1 text-[9px] font-medium uppercase tracking-wider shadow-sm"
            >
              {c.title || "Topic"}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-4 mb-3">
          {dateText ? (
            <div className="flex items-center gap-2 text-xs font-medium text-black/40 uppercase tracking-wide">
              <span>{dateText}</span>
              {readingMinutes ? (
                <>
                  <span className="w-px h-2.5 bg-black/10" />
                  <span>{readingMinutes} min</span>
                </>
              ) : ""}
            </div>
          ) : (
            <span />
          )}

          {showTypeBadge ? (
            post.isFeatured ? (
              <Badge className="rounded-full bg-accent2 text-white border-0 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                Featured
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full border-black/10 text-black/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              >
                Blog
              </Badge>
            )
          ) : (
            <span />
          )}
        </div>

        {/* Title */}
        <h3 className=" text-[20px] text-black leading-[1.3] mb-3 group-hover:opacity-70 transition-opacity">
          {post.title}
        </h3>

        {/* Excerpt */}
        {/* {excerpt && (
          <p className="inter text-black/60 text-sm leading-relaxed mb-6 font-light line-clamp-2">
            {excerpt}
          </p>
        )} */}

        {/* Footer: Author */}
        <div className=" pt-3 mt-2 border-t border-black/5 flex items-center gap-3">
          {authorImageUrl ? (
            <img
              src={authorImageUrl}
              alt={post.author?.name || "Author"}
              className="h-8 w-8 rounded-full border border-black/5 object-cover opacity-90"
            />
          ) : post.author?.name ? (
            <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-xs font-serif text-black/40">
                {post.author.name.charAt(0)}
            </div>
          ) : null}

          {post.author?.name ? (
            <div className="flex flex-col">
                <span className="inter text-xs font-medium text-black">
                  {post.author.name}
                </span>
                <span className="inter text-[10px] text-black/40 uppercase tracking-wide">
                  Author
                </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function HeroPostCard({ post }: { post: BlogListItem }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(2200).height(1400).fit("crop").url()
    : null;
  const authorImageUrl = post.author?.image
    ? urlFor(post.author.image).width(128).height(128).fit("crop").url()
    : null;
  const dateText = post.publishedAt
    ? format(new Date(post.publishedAt), "MMM d, yyyy")
    : null;
  const excerpt = post.excerpt
    ? post.excerpt.length > 260
      ? `${post.excerpt.slice(0, 260)}…`
      : post.excerpt
    : null;
  const wordCount = post.excerpt
    ? post.excerpt.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
<Link
      href={`/blog/${post.slug}`}
      className="group grid md:grid-cols-[1.1fr_0.9fr] gap-0 bg-background rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-500"
    >
      {/* Image Side */}
      <div className="relative min-h-75 md:min-h-95 overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            // src={imageUrl}
            src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/660bdff49b02fc0b5ff75273_CTA%20Ready%20to%20Get%20Started%20Image.webp"
            alt={post.mainImage?.alt || post.title}
            className="h-full w-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
        ) : (
           <div className="h-full w-full bg-[#F5F5F0]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-40" />

        <div className="absolute top-8 left-8 flex flex-wrap gap-2">
            {(post.categories || []).slice(0, 2).map((c, i) => (
              <Badge
                key={`${c.slug ?? c.title ?? "cat"}-${i}`}
                className="rounded-full bg-white/80 text-black backdrop-blur-md border-0 md:px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider shadow-sm"
              >
                {c.title || "Topic"}
              </Badge>
            ))}
        </div>
      </div>

      {/* Content Side */}
      <div className="p-3 py-8 md:p-12 flex flex-col justify-center relative">
        <div className="flex items-center gap-3 mb-4 text-xs font-medium text-black/50 uppercase tracking-widest">
          {dateText && <span>{dateText}</span>}
          {dateText && <span className="w-1 h-1 rounded-full bg-black/20" />}
          <span>{readingMinutes} min read</span>
        </div>

        <h2 className="font-serif text-4xl md:text-[2.3rem] text-black leading-tight mb-4 text-balance relative inline-block">
          <span className="transition-all duration-700 ease-out pb-1">
            {post.title}
          </span>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-black text-base leading-relaxed mb-9 font-light opacity-90">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-3 md:pt-8">
          <div className="flex items-center gap-4">
            {authorImageUrl ? (
                <img
                src={authorImageUrl}
                alt={post.author?.name || "Author"}
                className="h-11 w-11 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
            ) : post.author?.name ? (
                <div className="h-11 w-11 rounded-full bg-black/5 flex items-center justify-center text-sm font-serif text-black/40">
                    {post.author.name.charAt(0)}
                </div>
            ) : null}

            <div className="flex flex-col gap-0.5">
                <span className="inter text-sm font-medium text-black">
                {post.author?.name}
                </span>
                <span className="inter text-[10px] text-black/40 uppercase tracking-widest">
                Author
                </span>
            </div>
          </div>
          
          <div className="h-12 w-12 rounded-full border border-dark/10 flex items-center justify-center text-dark group-hover:bg-dark group-hover:text-white group-hover:border-dark transition-all duration-300">
             <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedRailCard({ post }: { post: BlogListItem }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(800).fit("crop").url()
    : null;
  const dateText = post.publishedAt
    ? format(new Date(post.publishedAt), "MMM d, yyyy")
    : null;

  return (
   <Link
      href={`/blog/${post.slug}`}
      className="group snap-start shrink-0 w-75 sm:w-[320px] flex flex-col gap-5 bg-transparent"
    >
      <div className="relative h-44 w-full rounded-[1.7rem] overflow-hidden bg-secondary border border-black/5 group-hover:border-black/10 transition-colors">

        {imageUrl ? (
          <img
            // src={imageUrl}
            src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D"
            alt={post.mainImage?.alt || post.title}
            className="h-full w-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
        ) : (
           <div className="h-full w-full bg-[#F5F5F0]" />
        )}
      </div>

      <div className="px-2 flex flex-col">
        <div className="text-xs font-medium text-black/40 uppercase tracking-widest mb-3">
            {dateText || ""}
        </div>

        <div className="flex justify-between items-start gap-4">
            <h3 className=" text-[22px] text-black leading-[1.1] group-hover:opacity-70 transition-opacity">
              {post.title}
            </h3>
            
            <div className="shrink-0 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-white bg-dark opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
            </div>
        </div>
      </div>
    </Link>
  );
}
