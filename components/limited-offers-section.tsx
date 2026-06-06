"use client"

import { useState, useEffect } from "react"

// Matches PricingCarousel plan order exactly:
// Plan 0 → 1 month          → 62% OFF
// Plan 1 → Doctor consult   → 70% OFF
// Plan 2 → 3 months         → 56% OFF
// Plan 3 → 6 months         → 53% OFF
const OFFERS = [
  { pct: "62", title: "1-month GLP-1 program",    tag: "Most popular", featured: true  },
  { pct: "70", title: "Doctor consultation plan", tag: "Limited seats", featured: false },
  { pct: "56", title: "3-month GLP-1 program",    tag: "",             featured: false },
  { pct: "53", title: "6-month GLP-1 program",    tag: "Best value",   featured: false },
]

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function LimitedOffersSection() {
  const [views,       setViews]       = useState<number | null>(null)
  const [timer,       setTimer]       = useState<number | null>(null)
  const [activeOffer, setActiveOffer] = useState(0)

  // Init random values on mount
  useEffect(() => {
    setViews(rand(1500, 6000))
    setTimer(rand(16 * 3600, 30 * 3600))
    const current = (window as any).__lpActivePlan ?? 0
    setActiveOffer(current % OFFERS.length)
  }, [])

  // Listen for plan changes from PricingCarousel
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<{ index: number }>).detail?.index ?? 0
      setActiveOffer(idx % OFFERS.length)
    }
    window.addEventListener("lpPlanChanged", handler)
    return () => window.removeEventListener("lpPlanChanged", handler)
  }, [])

  // Countdown
  useEffect(() => {
    if (timer === null) return
    const t = setInterval(() => {
      setTimer(prev => prev !== null ? Math.max(0, prev - 1) : prev)
    }, 1000)
    return () => clearInterval(t)
  }, [timer !== null])

  // Views counter gently fluctuates
  useEffect(() => {
    if (views === null) return
    const t = setInterval(() => {
      setViews(v => v !== null ? Math.min(6000, Math.max(1500, v + rand(-3, 3))) : v)
    }, 4000)
    return () => clearInterval(t)
  }, [views !== null])

  const offer = OFFERS[activeOffer]

  return (
    <section className="py-8 md:py-20 bg-[#F0FDFA]">
      <div className="container mx-auto px-3 md:px-4">

        {/* Header */}
        <div className="text-center mb-5 md:mb-8">
          <span className="inline-block bg-[#0F766E] text-[#E1F5EE] text-[10px] md:text-xs font-semibold tracking-widest uppercase px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-2 md:mb-4">
            Limited time
          </span>
          <h2 className="font-serif text-2xl md:text-4xl text-[#1E1B4B] mb-2 md:mb-4">
            Limited Offers
          </h2>

          {/* Live views counter */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#9FE1CB] rounded-full px-3 md:px-5 py-1.5 md:py-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#0F766E] animate-pulse flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-600">
              <strong className="text-[#0F766E]">
                {views !== null ? views.toLocaleString("en-IN") : "—"}
              </strong>
              {" "}people visited the site in the last 24 hours
            </span>
          </div>
        </div>

        {/* Offer card — stacks vertically on mobile, landscape on desktop */}
        <div className="max-w-xs md:max-w-2xl mx-auto">
          <div
            className={`bg-white rounded-xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row border ${
              offer.featured ? "border-[#0F766E] border-2" : "border-[#9FE1CB]/60"
            }`}
          >
            {/* Top/Left — discount */}
            <div className="bg-[#E1F5EE] px-5 py-4 md:px-8 md:py-7 flex flex-col justify-center md:min-w-[200px]">
              {offer.tag ? (
                <span className={`inline-block text-[10px] md:text-[11px] font-semibold rounded-full px-2.5 md:px-3 py-0.5 mb-2 md:mb-3 self-start ${
                  offer.featured
                    ? "bg-[#0F766E] text-[#E1F5EE]"
                    : "border border-[#9FE1CB] text-[#0F6E56] bg-[#E1F5EE]"
                }`}>
                  {offer.tag}
                </span>
              ) : (
                <span className="inline-block h-4 md:h-5 mb-2 md:mb-3" />
              )}
              <div className="flex items-end gap-1 leading-none">
                <span className="text-[42px] md:text-[72px] font-bold leading-none text-[#085041]">
                  {offer.pct}
                </span>
                <span className="text-base md:text-2xl font-bold text-[#0F6E56] pb-1.5 md:pb-2">% OFF</span>
              </div>
              <p className="text-xs md:text-sm text-[#0F6E56]/80 mt-1 md:mt-2">{offer.title}</p>
            </div>

            {/* Divider — horizontal on mobile, vertical on desktop */}
            <div className="h-px w-full md:h-auto md:w-px bg-[#9FE1CB]/40" />

            {/* Bottom/Right — timer + CTA */}
            <div className="flex-1 px-5 py-4 md:px-8 md:py-7 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-2 md:mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] md:text-xs font-semibold text-red-500 uppercase tracking-widest">
                  Hurry! Offer expires in
                </p>
              </div>

              {/* Segmented timer blocks */}
              <div className="flex items-center gap-1.5 md:gap-2 mb-4 md:mb-5">
                {timer !== null ? (() => {
                  const h   = Math.floor(timer / 3600)
                  const m   = Math.floor((timer % 3600) / 60)
                  const sec = timer % 60
                  return (
                    <>
                      {[{ val: h, label: "HRS" }, { val: m, label: "MIN" }, { val: sec, label: "SEC" }].map((seg, i) => (
                        <div key={i} className="flex items-center gap-1.5 md:gap-2">
                          <div className="flex flex-col items-center">
                            <div className="bg-[#1E1B4B] text-white font-mono font-bold text-base md:text-2xl w-9 h-9 md:w-14 md:h-14 flex items-center justify-center rounded-lg md:rounded-xl">
                              {String(seg.val).padStart(2, "0")}
                            </div>
                            <span className="text-[9px] md:text-[10px] font-semibold text-gray-400 mt-1 tracking-widest">{seg.label}</span>
                          </div>
                          {i < 2 && (
                            <span className="text-[#1E1B4B] font-bold text-base md:text-xl mb-3 md:mb-4">:</span>
                          )}
                        </div>
                      ))}
                    </>
                  )
                })() : (
                  <div className="flex gap-1.5">
                    {["HRS","MIN","SEC"].map(l => (
                      <div key={l} className="flex flex-col items-center">
                        <div className="bg-[#1E1B4B] text-white font-mono font-bold text-base w-9 h-9 flex items-center justify-center rounded-lg">--</div>
                        <span className="text-[9px] font-semibold text-gray-400 mt-1 tracking-widest">{l}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="w-full py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[#0F766E] text-[#E1F5EE] text-xs md:text-sm font-semibold hover:bg-[#085041] transition-colors"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Claim offer
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
