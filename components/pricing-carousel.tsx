"use client"

import { useEffect, useState } from "react"
import * as C from "@/content/home-v2"
import { pricingBreakdown, breakdownCopy } from "@/content/pricing-breakdown"

/**
 * Pricing.
 *
 * Prices come from /api/plans, never from the design file. The delivered
 * design hardcoded them as strings, which would let the homepage disagree
 * with checkout the moment someone edits a price in the admin panel.
 *
 * content/home-v2.ts holds presentation only - the tilt, and which card is
 * featured - keyed by plan name.
 *
 * content/pricing-breakdown.ts holds what the same things cost when sourced
 * separately. Those are third-party retail figures, never anything we bill,
 * so the rule above still holds: the price and the saving are computed from
 * the live plan record, not typed anywhere.
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
                className="h-[560px] animate-pulse rounded-[28px] border border-lp-green/10 bg-white/60"
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-lp-dark/60">
            Plans are being updated. Please check back shortly.
          </p>
        ) : (
          <div className="grid items-start gap-[26px] [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {sorted.map((p) => {
              const look =
                C.pricing.presentation[p.name] ?? { rot: "0deg", featured: false }
              const months = p.durationDays ? Math.round(p.durationDays / 30) : null
              const bd = pricingBreakdown[p.name]

              // Retail total is summed from the lines, never typed.
              const retail = bd
                ? bd.lines.reduce((s, l) => s + l.unit * l.qty, 0)
                : p.originalPrice ?? null

              if (
                process.env.NODE_ENV !== "production" &&
                bd &&
                retail !== bd.expectedTotal
              ) {
                // eslint-disable-next-line no-console
                console.warn(
                  `[pricing] ${p.name}: lines sum to ${retail}, expectedTotal says ${bd.expectedTotal}`,
                )
              }

              const fg = look.featured ? "#F9F7F2" : "#1C2B22"
              const muted = look.featured ? "#A8BEB7" : "#6B7873"
              const accent = look.featured ? "#C8D9A7" : "#2D5A4E"
              const hair = look.featured
                ? "1px solid rgba(200,217,167,.18)"
                : "1px solid rgba(25,50,49,.1)"

              return (
                <div
                  key={p.id}
                  className="gw-plan relative rounded-[24px] p-6 sm:rounded-[28px] sm:p-[clamp(24px,2.4vw,32px)]"
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
                    style={{ color: accent }}
                  >
                    {months ? `${months} MONTH${months > 1 ? "S" : ""}` : "PLAN"}
                  </div>

                  <div
                    className="mt-1.5 text-[22px] font-extrabold"
                    style={{ color: fg }}
                  >
                    {p.name}
                  </div>

                  {bd ? (
                    <>
                      <div
                        className="mt-6 text-[12px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: muted }}
                      >
                        {breakdownCopy.includedHeading}
                      </div>

                      <ul className="mt-3 grid list-none gap-0 p-0">
                        {bd.lines.map((l) => (
                          <li
                            key={l.label}
                            className="flex items-baseline justify-between gap-3 py-2.5"
                            style={{ borderBottom: hair }}
                          >
                            <span
                              className="min-w-0 text-[14.5px] leading-snug"
                              style={{ color: look.featured ? "#D8E3D4" : "#4A5751" }}
                            >
                              <span
                                aria-hidden
                                className="mr-2 font-extrabold"
                                style={{ color: accent }}
                              >
                                {"\u2713"}
                              </span>
                              {l.label}
                              {l.qtyLabel ? (
                                <span
                                  className="ml-1.5 whitespace-nowrap text-[12.5px]"
                                  style={{ color: muted }}
                                >
                                  {l.qtyLabel}
                                </span>
                              ) : l.qty > 1 ? (
                                <span
                                  className="ml-1.5 whitespace-nowrap text-[12.5px]"
                                  style={{ color: muted }}
                                >
                                  {l.qty}
                                  {"\u00D7"}
                                  {inr(l.unit)}
                                </span>
                              ) : null}
                              {l.detail && (
                                <span
                                  className="ml-1.5 text-[12.5px] italic"
                                  style={{ color: muted }}
                                >
                                  {l.detail}
                                </span>
                              )}
                            </span>
                            <span
                              className="flex-none text-[14.5px] font-bold tabular-nums"
                              style={{ color: look.featured ? "#D8E3D4" : "#2D3A34" }}
                            >
                              {inr(l.unit * l.qty)}
                            </span>
                          </li>
                        ))}

                        {retail !== null && (
                          <li className="flex items-baseline justify-between gap-3 pt-3">
                            <span className="text-[14px]" style={{ color: muted }}>
                              {breakdownCopy.totalLabel}
                            </span>
                            <span className="flex-none text-[15px] tabular-nums">
                              <span className="line-through" style={{ color: muted }}>
                                {inr(retail)}
                              </span>
                              <span
                                aria-hidden
                                className="ml-2 font-extrabold"
                                style={{ color: accent }}
                              >
                                {"\u2192"}
                              </span>
                            </span>
                          </li>
                        )}
                      </ul>

                      <div
                        className="mt-5 pt-5 text-[16px] font-bold leading-snug"
                        style={{ borderTop: hair, color: accent }}
                      >
                        {breakdownCopy.teaser}
                      </div>
                    </>
                  ) : (
                    /* No breakdown written for this plan yet - plain price. */
                    <div
                      className="mt-5 text-[16px] font-bold leading-snug"
                      style={{ color: accent }}
                    >
                      {breakdownCopy.teaser}
                    </div>
                  )}

                  <a
                    href="https://forms.leanprotocol.in/"
                    className="mt-6 block rounded-full px-6 py-4 text-center text-[16.5px] font-extrabold transition-colors"
                    style={{
                      background: look.featured ? "#C8D9A7" : "#193231",
                      color: look.featured ? "#193231" : "#F9F7F2",
                    }}
                  >
                    {breakdownCopy.cta}
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
