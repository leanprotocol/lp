import type { PortableTextBlock } from "@portabletext/types";

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

export type BlogCategoryListItem = {
  title: string;
  slug: string;
  postCount: number | null;
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

export type BlogCategoriesResponse = {
  categories: BlogCategoryListItem[];
};

export type BlogRecommendedPostsResponse = {
  items: BlogListItem[];
};

export type BlogRecommendedPostsPageResponse = {
  items: BlogListItem[];
  nextCursor: BlogCursor | null;
};

export type BlogIndexData = {
  hero: BlogListItem | null;
  featured: BlogListItem[];
  page: BlogPostsPage;
  excludeIds: string[];
};
