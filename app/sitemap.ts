import type { MetadataRoute } from "next"

/**
 * /sitemap.xml - the list of public pages that search engines should read.
 *
 * Before this file existed, /sitemap.xml fell through to the short partner-link
 * page (app/[ref]) and returned a web page, so Google had no sitemap to read.
 *
 * Add a page here when a new public page goes live. Leave out anything that is
 * hidden from search (lead forms, checkout, dashboards, partner landing pages).
 */
const SITE = "https://www.leanprotocol.in"

// Rebuilt at most once an hour, so a new article shows up without a deploy.
export const revalidate = 3600

const PAGES = [
  "",
  "/programme",
  "/our-why",
  "/blog",
  "/bmi-calculator",
  "/bmr-calculator",
  "/waist-to-hip-calculator",
  "/course",
  "/corporate",
  "/workshops",
  "/psp",
  "/innovation",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
  "/refund-policy",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = PAGES.map((path) => ({ url: SITE + path }))

  // Articles come from the CMS. If it cannot be reached, still return the fixed
  // pages instead of failing the whole sitemap.
  try {
    const { fetchAllPosts } = await import("@/sanity/lib/posts")
    const posts = await fetchAllPosts()
    for (const post of posts) {
      if (!post.slug) continue
      const published = post.publishedAt ? new Date(post.publishedAt) : null
      const hasDate = published !== null && !Number.isNaN(published.getTime())
      entries.push({
        url: `${SITE}/blog/${post.slug}`,
        ...(hasDate ? { lastModified: published as Date } : {}),
      })
    }
  } catch (err) {
    console.error("[sitemap] could not load articles", err)
  }

  return entries
}
