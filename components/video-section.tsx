"use client"

import { useEffect, useRef } from "react"

const VIDEO_SRC = "/lp-assets/lp-explainer.mp4"

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay when section scrolls into view, pause when out
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.3 } // lower threshold for mobile — triggers earlier
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-10 md:py-24 bg-dark">
      <div className="container mx-auto px-3 md:px-4">

        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="font-serif text-xl md:text-4xl text-white leading-snug px-2">
            Understand The Process That Let Us Deliver Amazing Results!
          </h2>
        </div>

        {/* Video player */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-[#0F766E]/30 bg-black">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              preload="none"
              className="absolute inset-0 w-full h-full object-contain"
              controls
              muted
              playsInline
              poster="/lp-assets/video-thumbnail.jpg"
            />
          </div>

          {/* Below video — hidden on very small screens */}
          <div className="hidden sm:flex items-center justify-center gap-6 mt-4 md:mt-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="text-white/60 text-xs">Doctor-guided</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="text-white/60 text-xs">Made for India</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="text-white/60 text-xs">GLP-1 backed</span>
            </div>
          </div>

          {/* Mobile only — single line trust badge */}
          <p className="sm:hidden text-center text-[10px] text-white/40 mt-3">
            Doctor-guided · Made for India · GLP-1 backed
          </p>
        </div>

      </div>
    </section>
  )
}
