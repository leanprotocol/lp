"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import * as C from "@/content/home-v2"

/**
 * Experts marquee - auto-scrolls, and can be dragged by hand.
 *
 * The position is driven by a single offset in a ref, advanced each frame by
 * requestAnimationFrame and wrapped at half the track width. The list is
 * duplicated, so wrapping at -50% lands on an identical frame and the loop
 * has no seam.
 *
 * Why not CSS animation plus overflow-x: because a CSS transform and the
 * browser's own scroller both move the same element and fight each other,
 * which leaves a visible gap. Owning the offset in JS means drag and
 * auto-scroll share one source of truth.
 *
 * Two exports are kept because app/page.tsx imports both, even though
 * DoctorTestimonial is currently commented out there.
 */
const SPEED = 0.35 // px per frame, about 21px/sec at 60fps

export function DoctorsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startOffset = useRef(0)
  const paused = useRef(false)
  const [grabbing, setGrabbing] = useState(false)

  const half = useCallback(
    () => (trackRef.current ? trackRef.current.scrollWidth / 2 : 0),
    []
  )

  const apply = useCallback(() => {
    const w = half()
    if (w > 0) {
      // keep the offset inside one copy of the list
      if (offset.current <= -w) offset.current += w
      if (offset.current > 0) offset.current -= w
    }
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offset.current}px,0,0)`
    }
  }, [half])

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let frame = 0
    const tick = () => {
      if (!paused.current && !dragging.current && !reduced) {
        offset.current -= SPEED
        apply()
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [apply])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
    startOffset.current = offset.current
    setGrabbing(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    offset.current = startOffset.current + (e.clientX - startX.current)
    apply()
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  return (
    <section id={C.experts.id} className="overflow-hidden bg-lp-bg pb-[110px] pt-5">
      <h2
        className="m-0 mb-12 text-center font-extrabold text-lp-dark"
        style={{ fontSize: "clamp(30px,4vw,54px)" }}
      >
        Meet the{" "}
        <span className="font-serif italic tracking-normal text-lp-green">
          experts.
        </span>
      </h2>

      {/* touch-action: pan-y lets the page scroll vertically while this
          strip handles horizontal movement itself. */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        style={{
          touchAction: "pan-y",
          cursor: grabbing ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <div ref={trackRef} className="flex w-max gap-[22px] will-change-transform">
          {[...C.experts.people, ...C.experts.people].map((ex, i) => (
            <div
              key={i}
              className="w-[210px] flex-none text-center"
              aria-hidden={i >= C.experts.people.length}
            >
              <img
                src={ex.img}
                alt={ex.name}
                draggable={false}
                className="block h-[230px] w-full rounded-[20px] bg-[#DDE7E2] object-cover object-top"
                style={{ boxShadow: "0 16px 38px rgba(25,50,49,.16)" }}
              />
              <div className="mt-3 text-base font-bold text-lp-dark">{ex.name}</div>
              <div className="mt-0.5 text-[12.5px] font-semibold text-lp-green">
                {ex.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Kept so the named import in app/page.tsx keeps resolving. */
export function DoctorTestimonial() {
  return null
}
