"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

// ─── Change this to your video URL ───────────────────────────────────────────
// Option A — local file:  "/lp-assets/final-video.mp4"
// Option B — YouTube:     "https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
const VIDEO_SRC = "/lp-assets/lp-explainer.mp4"
const IS_YOUTUBE = VIDEO_SRC.includes("youtube.com")
// ─────────────────────────────────────────────────────────────────────────────

export function VideoPopup() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Show after 4 seconds — once per session
  useEffect(() => {
    if (sessionStorage.getItem("lpVideoShown")) return
    const t = setTimeout(() => setVisible(true), typeof window !== 'undefined' && window.innerWidth < 768 ? 3000 : 4000)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    sessionStorage.setItem("lpVideoShown", "1")
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 md:p-8"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[95vw] md:max-w-[75vw] lg:max-w-[65vw] bg-[#0A2422] rounded-2xl overflow-hidden shadow-2xl border border-[#0F766E]/40 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          aria-label="Close video"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse flex-shrink-0" />
            <span className="text-[#14B8A6] text-[10px] md:text-xs font-semibold uppercase tracking-widest">
              Watch Now
            </span>
          </div>
          <h2 className="text-white font-serif text-sm md:text-2xl leading-snug pr-8">
            Understand How Lean Protocol Works —{" "}
            <span className="italic text-[#14B8A6]">In Under 60 Seconds</span>
          </h2>
        </div>

        {/* Video — 16:9 aspect ratio */}
        <div className="relative w-full aspect-video bg-black flex-shrink-0">
          {IS_YOUTUBE ? (
            <iframe
              src={VIDEO_SRC}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              autoPlay
              muted
              playsInline
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 md:px-6 md:py-4 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] md:text-xs text-white/50">
            Doctor-guided. Made for India.
          </p>
          <button
            onClick={handleClose}
            className="text-[10px] md:text-xs text-[#14B8A6] font-semibold hover:text-white transition-colors"
          >
            Skip for now →
          </button>
        </div>

      </div>
    </div>
  )
}
