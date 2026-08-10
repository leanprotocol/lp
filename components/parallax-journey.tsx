"use client"

import { useEffect, useRef, useState } from "react"
import * as C from "@/content/home-v2"

/**
 * The Lean Protocol journey.
 *
 * A tall section (560vh) with a sticky viewport inside it. Scroll position
 * within the section drives which of the five steps is showing, so the copy
 * and the image cross-fade as you move down the page rather than on a timer.
 *
 * The progress read is throttled with requestAnimationFrame: a raw scroll
 * listener calling setState fires far more often than React can usefully
 * render, and on mobile that shows up as jank.
 */
export function ParallaxJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      setProgress((prev) => (Math.abs(p - prev) > 0.0015 ? p : prev))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    read()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const steps = C.journey.steps
  const n = steps.length
  const exact = progress * n
  const active = Math.min(n - 1, Math.floor(exact))

  return (
    <section
      ref={sectionRef}
      id={C.journey.id}
      className="relative bg-dark"
      style={{ height: `${n * 112}vh` }}
    >
      {/* The image is short on mobile so the copy fits beside it inside one
          viewport; desktop gets the full-height treatment back. */}
      <style jsx>{`
        @media (min-width: 768px) {
          .gw-journey-shot {
            height: min(72vh, 640px) !important;
          }
        }
      `}</style>
      <div className="sticky top-[73px] flex min-h-[calc(100dvh-73px)] items-start py-4 md:items-center md:py-7">
        <div className="grid w-full items-center gap-6 md:gap-[clamp(26px,3.4vw,60px)] md:[grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr))]">

          {/* Image stack. All five are mounted; only the active one is opaque,
              so the cross-fade has nothing to load mid-scroll. */}
          <div
            className="gw-journey-shot relative mx-5 min-h-0 overflow-hidden rounded-[22px] bg-[#0E1512] md:ml-[clamp(28px,5vw,70px)] md:mr-0 md:rounded-[30px]"
            style={{
              height: "min(42vh, 360px)",
              boxShadow: "0 40px 90px rgba(0,0,0,.45)",
            }}
          >
            {steps.map((s, i) => (
              <img
                key={s.n}
                src={s.img}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `scale(${i === active ? 1 : 1.06})`,
                  transition:
                    "opacity .8s cubic-bezier(.2,.7,.2,1), transform 1.6s cubic-bezier(.2,.7,.2,1)",
                }}
              />
            ))}
            <div className="absolute bottom-6 left-6 rounded-full bg-lp-bg/90 px-5 py-2.5 text-sm font-bold text-dark backdrop-blur-sm">
              Step {String(active + 1).padStart(2, "0")} of {String(n).padStart(2, "0")}
            </div>
          </div>

          {/* Copy column */}
          <div className="flex h-full flex-col justify-center px-5 md:px-0 md:pr-[clamp(28px,5vw,70px)]">
            <div className="mb-4 text-[12.5px] font-bold tracking-[0.16em] text-accent">
              THE LEAN PROTOCOL
            </div>

            <div className="relative min-h-[190px] md:min-h-[clamp(230px,34vh,310px)]">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className="absolute inset-0"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform:
                      i === active
                        ? "translateY(0)"
                        : `translateY(${i < active ? -28 : 28}px)`,
                    transition:
                      "opacity .6s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <div
                    className="font-extrabold leading-none tracking-[-0.03em] text-lp-bg/[0.16]"
                    style={{ fontSize: "clamp(38px,5.6vw,88px)" }}
                  >
                    {s.n}
                  </div>
                  <h2
                    className="mb-4 mt-3.5 max-w-[16ch] font-extrabold leading-[1.05] tracking-[-0.03em] text-lp-bg"
                    style={{ fontSize: "clamp(24px,3.7vw,54px)" }}
                  >
                    {s.title}
                  </h2>
                  <p
                    className="m-0 max-w-[42ch] leading-[1.5] text-accent2"
                    style={{ fontSize: "clamp(14.5px,1.5vw,21px)" }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* One bar per step. The active bar fills with the fractional
                progress, so the rail tracks scroll rather than snapping. */}
            <div className="mt-auto flex gap-2 pt-6 md:gap-2.5 md:pt-[clamp(24px,6vh,64px)]">
              {steps.map((s, i) => {
                const fill = i < active ? 100 : i === active ? (exact - active) * 100 : 0
                return (
                  <div
                    key={s.n}
                    className="h-[3px] flex-1 overflow-hidden rounded-[3px] bg-lp-bg/[0.14]"
                  >
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${fill}%`, transition: "width .25s linear" }}
                    />
                  </div>
                )
              })}
            </div>

            <p className="m-0 mt-3.5 max-w-[60ch] text-[11.5px] text-accent2/60">
              {C.journey.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
