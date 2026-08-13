"use client"

import { useEffect, useRef, useState } from "react"
import * as C from "@/content/home-v2"

/**
 * Horizontal film strip of member results.
 *
 * The section is tall (320vh) with a sticky viewport; vertical scroll is
 * translated into horizontal travel across the strip. The design relied on
 * CSS scroll-driven animations (view-timeline), which Safari and Firefox do
 * not support yet, so this reads scroll position in JS instead and works
 * everywhere.
 */
export function TestimonialsCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const sec = sectionRef.current
      const track = trackRef.current
      if (!sec || !track) return

      const r = sec.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0

      // Travel the full strip width, less one viewport, so the last card
      // finishes flush with the right edge rather than scrolling past it.
      const distance = Math.max(0, track.scrollWidth - window.innerWidth + 60)
      setShift(p * distance)
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

  return (
    <section ref={sectionRef} id={C.results.id} className="bg-black" style={{ height: "320vh" }}>
      <div className="sticky top-[73px] flex h-[calc(100vh-73px)] flex-col justify-center overflow-hidden">
        <h2
          className="m-0 mb-[26px] text-center font-extrabold text-lp-bg"
          style={{ fontSize: "clamp(30px,4vw,54px)" }}
        >
          Real people.{" "}
          <span className="font-serif italic tracking-normal text-accent">
            Real results.
          </span>{" "}
          <span className="text-[0.45em] font-semibold text-accent2">
            {"\u2014"} keep scrolling {"\u2192"}
          </span>
        </h2>

        <div
          ref={trackRef}
          className="flex w-max gap-[22px] px-[clamp(28px,5vw,70px)]"
          style={{
            transform: `translateX(-${shift}px)`,
            willChange: "transform",
          }}
        >
          {C.results.films.map((s) => (
            <div
              key={s.name}
              className="flex-none overflow-hidden rounded-[26px] bg-dark"
              style={{
                width: "clamp(300px,26vw,380px)",
                boxShadow: "0 18px 44px rgba(0,0,0,.4)",
              }}
            >
              {s.isVideo ? (
                <video
                  src={s.src}
                  poster={s.src.replace(/\.mp4$/, "-poster.jpg")}
                  playsInline
                  controls
                  preload="none"
                  className="block w-full bg-black object-cover"
                  style={{ height: "clamp(380px,52vh,460px)" }}
                />
              ) : (
                <img
                  src={s.src}
                  alt={`${s.name} result`}
                  className="block w-full object-cover"
                  style={{ height: "clamp(380px,52vh,460px)" }}
                />
              )}
              <div className="px-5 pb-[18px] pt-4 text-lp-bg">
                <div className="text-xl font-bold">{s.name}</div>
                <div className="mt-0.5 text-sm font-bold text-accent">{s.result}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="m-0 mt-4 text-center text-[11.5px] text-accent2/55">
          {C.results.note}
        </p>
      </div>
    </section>
  )
}
