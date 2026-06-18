"use client"

import Image from "next/image"

// ─── News channels (6 total → 3 per row) ─────────────────────────────────────
const NEWS_FEATURES: { name: string; logo: string; article: string; className?: string }[] = [
  {
    name: "Zee News",
    logo: "/news/zee-news.svg",
    article: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html",
  },
  {
    name: "News24",
    logo: "/news/news-24.jpg",
    article: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/",
  },
  {
    name: "News Today 24x7",
    logo: "/news/news-today-24x7.png",
    article: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
  },
  {
    name: "The Startup Story",
    logo: "/news/startup-story.jpg",
    article: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/",
    className: "scale-[1.9]",
  },
  {
    name: "The Tribune",
    logo: "/news/the-tribune.webp",
    article: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/",
    className: "scale-[1.25]",
  },
  {
    name: "The Republic News",
    logo: "/news/the-republic-news.png",
    article: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
  },
]
// ─────────────────────────────────────────────────────────────────────────────

export function NewsSection() {
  return (
    <section className="py-12 md:py-20 bg-white md:bg-background">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-2xl md:text-4xl text-black leading-snug">
            Lean Protocol
            <br />
            Featured Across India&apos;s Leading Publications
          </h2>
          <p className="text-sm md:text-base text-black/50 mt-3">
            Click on a logo to read our feature on that publication
          </p>
        </div>

        {/* 3 logos per row, faded-black divider between every logo */}
        <div className="grid grid-cols-3 max-w-3xl mx-auto">
          {NEWS_FEATURES.map((item, i) => (
            <a
              key={item.name}
              href={item.article}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read our feature on ${item.name}`}
              className={[
                "flex items-center justify-center py-5 px-4 md:py-7 md:px-6",
                "transition duration-300 hover:opacity-80",
                i % 3 !== 0 ? "border-l border-black/10" : "", // vertical line between logos in a row
                i >= 3 ? "border-t border-black/10" : "",       // horizontal line between the two rows
              ].join(" ")}
            >
              <div className={`relative h-14 w-full md:h-14 ${item.className ?? ""}`}>
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 30vw, 200px"
                  className="object-contain"
                />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
