import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { HeroPostCard } from "@/components/blog/blog-cards";
import BlogFeaturedRail from "@/components/blog/blog-featured-rail";
import BlogInfiniteGrid from "@/components/blog/blog-infinite-grid";
import { fetchBlogIndexData, fetchCategories } from "@/sanity/lib/posts";
import { BlogHero } from "@/components/blog/blog-hero";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weight Loss Knowledge Hub | Lean Protocol Articles & Insights",
  description: "Latest articles on GLP-1 medications, weight loss science, Lean Protocol tips, Indian health insights. Evidence-based content from doctors & nutritionists.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export const revalidate = 60;

export default async function BlogPage() {
  const { hero, featured, page, excludeIds } = await fetchBlogIndexData({
    featuredLimit: 10,
    pageLimit: 12,
  });

  const categories = await fetchCategories({ limit: 10 });

  return (
    <main className="min-h-screen bg-lp-bg">
      <Header />
      <BlogHero />

      {hero ? (
        <section className="bg-dark px-1 pb-20 pt-6 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            
            {/* Styled Section Header */}
            <div className="mb-10 md:mb-14 max-w-2xl">
              <h2 className="m-0 text-[12.5px] font-bold tracking-[0.16em] text-accent">FEATURED STORY</h2>
              
            </div>

            <div className="mb-16">
              <HeroPostCard post={hero} />
            </div>
            {featured.length > 0 ? (
              <div className="border-t border-lp-bg/10 pt-8 md:pt-16">
                <BlogFeaturedRail posts={featured} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="rounded-t-[44px] bg-lp-bg px-1 pb-24 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          {/* Styled Section Header */}
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="m-0 mb-2 font-extrabold tracking-[-0.03em] text-lp-dark" style={{ fontSize: "clamp(28px,3.8vw,52px)" }}>Latest <span className="font-serif font-normal italic tracking-normal text-lp-green">articles.</span></h2>
              <p className="m-0 text-[17px] text-lp-dark/60">Browse the full library of evidence-based insights.</p>
            </div>
            {/* Categories could potentially go here in a filter dropdown later */}
          </div>

          <BlogInfiniteGrid
            initialItems={page.items}
            initialCursor={page.nextCursor}
            excludeIds={excludeIds}
            pageSize={12}
            initialCategories={categories}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}