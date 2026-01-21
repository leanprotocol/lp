import "server-only";

import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

import { client } from "@/sanity/lib/client";

export type SanityImage = {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
};

export type BlogCategory = {
  title: string | null;
  slug: string | null;
};

export type BlogAuthor = {
  name: string | null;
  image?: SanityImage | null;
};

export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  isHero: boolean;
  isFeatured: boolean;
  enabled: boolean;
  mainImage: SanityImage | null;
  author: BlogAuthor | null;
  categories: BlogCategory[];
  excerpt: string | null;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  isHero: boolean;
  isFeatured: boolean;
  enabled: boolean;
  mainImage: SanityImage | null;
  author: BlogAuthor | null;
  categories: BlogCategory[];
  excerpt: string | null;
  body: PortableTextBlock[] | null;
};

export type BlogCursor = {
  date: string;
  id: string;
};

export type BlogPostsPage = {
  items: BlogListItem[];
  nextCursor: BlogCursor | null;
};

export type BlogIndexData = {
  hero: BlogListItem | null;
  featured: BlogListItem[];
  page: BlogPostsPage;
  excludeIds: string[];
};

export type BlogCategoryListItem = {
  title: string;
  slug: string;
  postCount: number | null;
};

const postsQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && defined(slug.current)] | order(coalesce(isFeatured, false) desc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const postBySlugQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  body,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const heroPostQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && defined(slug.current) && coalesce(isHero, false) == true] | order(coalesce(publishedAt, _createdAt) desc, _id desc)[0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const featuredPostsQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && defined(slug.current) && coalesce(isFeatured, false) == true && !(_id in $excludeIds)] | order(coalesce(publishedAt, _createdAt) desc, _id desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const categoriesQuery = groq`*[_type == "category" && defined(slug.current)]{
  title,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && coalesce(enabled, true) == true && references(^._id)])
} | order(postCount desc, title asc)`;

const categoriesLimitedQuery = groq`*[_type == "category" && defined(slug.current)]{
  title,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && coalesce(enabled, true) == true && references(^._id)])
} | order(postCount desc, title asc)[0...$limit]`;

const postMetaBySlugQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && slug.current == $slug][0]{
  _id,
  "categorySlugs": coalesce(categories[]->slug.current, [])
}`;

const recommendedPostsQuery = groq`*[
  _type == "post" &&
  coalesce(enabled, true) == true &&
  defined(slug.current) &&
  !(_id in $excludeIds) &&
  defined(coalesce(categories[]->slug.current, [])[ @ in $categorySlugs ][0])
] | order(coalesce(publishedAt, _createdAt) desc, _id desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const recommendedPostsPageQuery = groq`*[
  _type == "post" &&
  coalesce(enabled, true) == true &&
  defined(slug.current) &&
  !(_id in $excludeIds) &&
  defined(coalesce(categories[]->slug.current, [])[ @ in $categorySlugs ][0]) &&
  (
    !defined($cursorDate) ||
    coalesce(publishedAt, _createdAt) < $cursorDate ||
    (coalesce(publishedAt, _createdAt) == $cursorDate && defined($cursorId) && _id < $cursorId)
  )
] | order(coalesce(publishedAt, _createdAt) desc, _id desc)[0...$limitPlusOne]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "cursorDate": coalesce(publishedAt, _createdAt),
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const postsPageQuery = groq`*[
  _type == "post" &&
  coalesce(enabled, true) == true &&
  defined(slug.current) &&
  (
    $categorySlug == null ||
    $categorySlug in coalesce(categories[]->slug.current, [])
  ) &&
  !(_id in $excludeIds) &&
  (
    !defined($cursorDate) ||
    coalesce(publishedAt, _createdAt) < $cursorDate ||
    (coalesce(publishedAt, _createdAt) == $cursorDate && defined($cursorId) && _id < $cursorId)
  )
] | order(coalesce(publishedAt, _createdAt) desc, _id desc)[0...$limitPlusOne]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "cursorDate": coalesce(publishedAt, _createdAt),
  "isHero": coalesce(isHero, false),
  "isFeatured": coalesce(isFeatured, false),
  "enabled": coalesce(enabled, true),
  mainImage,
  "author": author->{name, image},
  "categories": coalesce(categories[]->{title, "slug": slug.current}, []),
  "excerpt": pt::text(body)
}`;

const slugsQuery = groq`*[_type == "post" && coalesce(enabled, true) == true && defined(slug.current)][]{"slug": slug.current}`;

export async function fetchAllPosts(): Promise<BlogListItem[]> {
  return client.fetch<BlogListItem[]>(postsQuery);
}

export async function fetchCategories(options?: {
  limit?: number;
}): Promise<BlogCategoryListItem[]> {
  const limit = options?.limit;
  if (typeof limit === "number") {
    return client.fetch<BlogCategoryListItem[]>(categoriesLimitedQuery, {
      limit,
    });
  }

  return client.fetch<BlogCategoryListItem[]>(categoriesQuery);
}

type BlogPostMeta = {
  _id: string;
  categorySlugs: string[];
};

export async function fetchPostMetaBySlug(
  slug: string
): Promise<BlogPostMeta | null> {
  return client.fetch<BlogPostMeta | null>(postMetaBySlugQuery, { slug });
}

export async function fetchRecommendedPosts(options: {
  categorySlugs: string[];
  excludeIds: string[];
  limit?: number;
}): Promise<BlogListItem[]> {
  const limit = options.limit ?? 10;
  const categorySlugs = options.categorySlugs;
  const excludeIds = options.excludeIds;

  if (categorySlugs.length === 0) return [];

  return client.fetch<BlogListItem[]>(recommendedPostsQuery, {
    limit,
    categorySlugs,
    excludeIds,
  });
}

export async function fetchRecommendedPostsPage(options: {
  categorySlugs: string[];
  excludeIds: string[];
  limit?: number;
  cursor?: BlogCursor | null;
}): Promise<BlogPostsPage> {
  const limit = options.limit ?? 4;
  const limitPlusOne = limit + 1;
  const categorySlugs = options.categorySlugs;
  const excludeIds = options.excludeIds;
  const cursorDate = options.cursor?.date ?? null;
  const cursorId = options.cursor?.id ?? null;

  if (categorySlugs.length === 0) return { items: [], nextCursor: null };

  const results = await client.fetch<BlogListItemWithCursor[]>(
    recommendedPostsPageQuery,
    {
      limitPlusOne,
      categorySlugs,
      excludeIds,
      cursorDate,
      cursorId,
    }
  );

  const hasMore = results.length > limit;
  const pageSlice = results.slice(0, limit);
  const last = pageSlice[pageSlice.length - 1];

  const items: BlogListItem[] = pageSlice.map(
    ({ cursorDate: _cursorDate, ...rest }) => rest
  );
  const nextCursor: BlogCursor | null =
    hasMore && last
      ? {
          date: last.cursorDate,
          id: last._id,
        }
      : null;

  return { items, nextCursor };
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch<BlogPost | null>(postBySlugQuery, { slug });
}

export async function fetchBlogHeroPost(): Promise<BlogListItem | null> {
  return client.fetch<BlogListItem | null>(heroPostQuery);
}

export async function fetchFeaturedPosts(options?: {
  limit?: number;
  excludeIds?: string[];
}): Promise<BlogListItem[]> {
  const limit = options?.limit ?? 10;
  const excludeIds = options?.excludeIds ?? [];
  return client.fetch<BlogListItem[]>(featuredPostsQuery, {
    limit,
    excludeIds,
  });
}

type BlogListItemWithCursor = BlogListItem & { cursorDate: string };

export async function fetchPostsPage(options: {
  limit?: number;
  cursor?: BlogCursor | null;
  excludeIds?: string[];
  categorySlug?: string | null;
}): Promise<BlogPostsPage> {
  const limit = options.limit ?? 12;
  const limitPlusOne = limit + 1;
  const excludeIds = options.excludeIds ?? [];
  const cursorDate = options.cursor?.date ?? null;
  const cursorId = options.cursor?.id ?? null;
  const categorySlug = options.categorySlug ?? null;

  const results = await client.fetch<BlogListItemWithCursor[]>(postsPageQuery, {
    limitPlusOne,
    excludeIds,
    cursorDate,
    cursorId,
    categorySlug,
  });

  const hasMore = results.length > limit;
  const pageSlice = results.slice(0, limit);
  const last = pageSlice[pageSlice.length - 1];

  const items: BlogListItem[] = pageSlice.map(
    ({ cursorDate: _cursorDate, ...rest }) => rest
  );
  const nextCursor: BlogCursor | null =
    hasMore && last
      ? {
          date: last.cursorDate,
          id: last._id,
        }
      : null;

  return { items, nextCursor };
}

export async function fetchBlogIndexData(options?: {
  featuredLimit?: number;
  pageLimit?: number;
}): Promise<BlogIndexData> {
  const featuredLimit = options?.featuredLimit ?? 10;
  const pageLimit = options?.pageLimit ?? 12;

  let hero = await fetchBlogHeroPost();
  let featured = await fetchFeaturedPosts({
    limit: featuredLimit,
    excludeIds: hero?._id ? [hero._id] : [],
  });

  if (!hero && featured.length > 0) {
    hero = featured[0];
    featured = featured.slice(1);
  }

  const excludeIds = [hero?._id].filter((v): v is string => Boolean(v));

  const page = await fetchPostsPage({
    limit: pageLimit,
    cursor: null,
    excludeIds,
  });

  return { hero, featured, page, excludeIds };
}

export async function fetchHomeHeroPost(): Promise<BlogListItem | null> {
  const hero = await fetchBlogHeroPost();
  if (hero) return hero;

  const featured = await fetchFeaturedPosts({ limit: 1 });
  return featured[0] ?? null;
}

export async function fetchHomeFeaturedPosts(options?: {
  limit?: number;
  excludeIds?: string[];
}): Promise<BlogListItem[]> {
  const limit = options?.limit ?? 3;
  const excludeIds = options?.excludeIds ?? [];
  return fetchFeaturedPosts({ limit, excludeIds });
}

export async function fetchPostSlugs(): Promise<string[]> {
  const slugs = await client.fetch<Array<{ slug: string }>>(slugsQuery);
  return slugs.map((s) => s.slug).filter(Boolean);
}
