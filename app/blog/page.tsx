import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { HeroPostCard } from "@/components/blog/blog-cards";
import BlogFeaturedRail from "@/components/blog/blog-featured-rail";
import BlogInfiniteGrid from "@/components/blog/blog-infinite-grid";
import { fetchBlogIndexData, fetchCategories } from "@/sanity/lib/posts";
import { BlogHero } from "@/components/blog/blog-hero";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weight Loss Knowledge Hub | Lean Healthcare Articles & Insights",
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
    <main className="min-h-screen bg-[#F8F9FA]"> {/* Lighter background for better contrast */}
      <Header />
      <BlogHero />

      {hero ? (
        <section className="py-10 md:py-16 mt-3">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            
            {/* Styled Section Header */}
            <div className="mb-10 md:mb-14 max-w-2xl">
              <h2 className="heading">
                Featured Stories
              </h2>
              <p className="-mt-1 inter text-dark/60 text-lg font-light leading-relaxed">
                Highlights and deep dives you don't want to miss.
              </p>
            </div>

            <div className="mb-16">
              <HeroPostCard post={hero} />
            </div>
            {featured.length > 0 ? (
              <div className="border-t border-dark/10 pt-8 md:pt-16">
                <BlogFeaturedRail posts={featured} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="py-8 md:py-16 bg-white border-t border-dark/5">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          {/* Styled Section Header */}
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="heading">
                Latest Articles
              </h2>
              <p className="-mt-1 inter text-dark/60 text-lg font-light leading-relaxed">
                Browse our full library of evidence-based insights.
              </p>
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