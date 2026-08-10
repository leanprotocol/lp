"use client"

import { useEffect, useState } from "react"
import * as C from "@/content/home-v2"

/**
 * Pricing.
 *
 * Prices come from /api/plans, never from the design file. The delivered
 * design hardcoded them as strings, which would let the homepage disagree
 * with checkout the moment someone edits a price in the admin panel.
 *
 * content/home-v2.ts holds presentation only - the tilt, and which card is
 * featured - keyed by plan name.
 */
type DbPlan = {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  durationDays?: number | null
  features?: string[] | null
}

const inr = (n: number) =>
  `\u20B9${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`

export function PricingCarousel() {
  const [plans, setPlans] = useState<DbPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    fetch("/api/plans")
      .then((r) => r.json())
      .then((d) => {
        if (live && d?.success && Array.isArray(d.plans)) setPlans(d.plans)
      })
      .catch(() => {})
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [])

  // Order by the presentation map so the featured card sits in the middle,
  // then append anything the map does not know about.
  const order = Object.keys(C.pricing.presentation)
  const sorted = [...plans].sort((a, b) => {
    const ai = order.indexOf(a.name)
    const bi = order.indexOf(b.name)
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi)
  })

  return (
    <section id={C.pricing.id} className="bg-lp-bg px-7 pb-[110px] pt-[60px]">
      <div className="mx-auto max-w-[1180px]">
        <h2
          className="m-0 mb-2.5 text-center font-extrabold text-lp-dark"
          style={{ fontSize: "clamp(30px,4vw,54px)" }}
        >
          Simple{" "}
          <span className="font-serif italic tracking-normal text-lp-green">
            pricing.
          </span>
        </h2>
        <p className="m-0 mb-11 text-center text-[17px] text-lp-dark/60">
          {C.pricing.sub}
        </p>

        {loading ? (
          <div className="grid gap-[26px] [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-[28px] border border-lp-green/10 bg-white/60"
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-lp-dark/60">
            Plans are being updated. Please check back shortly.
          </p>
        ) : (
          <div className="grid items-center gap-[26px] [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {sorted.map((p) => {
              const look =
                C.pricing.presentation[p.name] ?? { rot: "0deg", featured: false }
              const off =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round((1 - p.price / p.originalPrice) * 100)
                  : null
              const months = p.durationDays ? Math.round(p.durationDays / 30) : null

              return (
                <div
                  key={p.id}
                  className="gw-plan relative rounded-[24px] p-6 sm:rounded-[28px] sm:p-[clamp(26px,3vw,38px)]"
                  style={{
                    ["--rot" as any]: look.rot,
                    background: look.featured ? "#193231" : "#FFFFFF",
                    border: look.featured
                      ? "1px solid rgba(200,217,167,.3)"
                      : "1px solid rgba(25,50,49,.1)",
                    boxShadow: look.featured
                      ? "0 34px 80px rgba(25,50,49,.3)"
                      : "0 16px 40px rgba(25,50,49,.1)",
                    zIndex: look.featured ? 2 : 1,
                  }}
                >
                  {look.ribbon && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-[11.5px] font-extrabold tracking-[0.1em] text-dark">
                      {look.ribbon.toUpperCase()}
                    </div>
                  )}

                  <div
                    className="text-[13px] font-bold tracking-[0.12em]"
                    style={{ color: look.featured ? "#C8D9A7" : "#2D5A4E" }}
                  >
                    {months ? `${months} MONTH${months > 1 ? "S" : ""}` : "PLAN"}
                  </div>

                  <div
                    className="mt-1.5 text-[22px] font-extrabold"
                    style={{ color: look.featured ? "#F9F7F2" : "#1C2B22" }}
                  >
                    {p.name}
                  </div>

                  <div className="mt-5 flex flex-wrap items-baseline gap-2.5">
                    <span
                      className="font-extrabold leading-none tracking-[-0.03em]"
                      style={{
                        fontSize: "clamp(38px,4vw,54px)",
                        color: look.featured ? "#C8D9A7" : "#1C2B22",
                      }}
                    >
                      {inr(p.price)}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span
                        className="text-lg line-through"
                        style={{ color: look.featured ? "#A8BEB7" : "#8A9690" }}
                      >
                        {inr(p.originalPrice)}
                      </span>
                    )}
                    {off !== null && (
                      <span className="rounded-md bg-lp-gold px-2 py-1 text-xs font-extrabold text-white">
                        {off}% OFF
                      </span>
                    )}
                  </div>

                  {Array.isArray(p.features) && p.features.length > 0 && (
                    <ul className="mt-6 grid list-none gap-2.5 p-0">
                      {p.features.slice(0, 6).map((f) => (
                        <li
                          key={f}
                          className="flex gap-2.5 text-[14.5px] leading-snug"
                          style={{ color: look.featured ? "#A8BEB7" : "#4A5751" }}
                        >
                          <span
                            aria-hidden
                            className="flex-none font-extrabold"
                            style={{ color: look.featured ? "#C8D9A7" : "#2D5A4E" }}
                          >
                            {"\u2713"}
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="/users"
                    className="mt-7 block rounded-full px-6 py-4 text-center text-[16.5px] font-extrabold transition-colors"
                    style={{
                      background: look.featured ? "#C8D9A7" : "#193231",
                      color: look.featured ? "#193231" : "#F9F7F2",
                    }}
                  >
                    {C.pricing.cta}
                  </a>
                </div>
              )
            })}
          </div>
        )}

        <p className="m-0 mt-8 text-center text-[11.5px] text-lp-dark/50">
          {C.pricing.note}
        </p>
      </div>

      <style jsx>{`
        /* Flat when stacked; the tilt only makes sense in a row. */
        .gw-plan {
          transform: none;
          transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        @media (min-width: 768px) {
          .gw-plan {
            transform: rotate(var(--rot, 0deg));
          }
        }
        .gw-plan:hover {
          transform: rotate(0deg) translateY(-8px) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-plan {
            transform: none !important;
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
