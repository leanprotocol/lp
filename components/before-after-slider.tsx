"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

/**
 * Interactive before/after image comparison slider
 * Users can drag the handle to reveal before/after images
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  // Track slider position (0-100%)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Calculate slider position based on mouse/touch position
   */
  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100

    // Clamp between 0 and 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  // Handle mouse/touch move
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      updateSliderPosition(clientX)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging])

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    updateSliderPosition(clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] overflow-hidden rounded-xl cursor-ew-resize select-none"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        <img src={afterImage || "/placeholder.svg"} alt={afterLabel} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-[#A8C29F]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3D4F4A]">
          {afterLabel}
        </div>
      </div>

      {/* Before image (clipped overlay) */}
      <div className="absolute inset-0 transition-none" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <img src={beforeImage || "/placeholder.svg"} alt={beforeLabel} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#3D4F4A]">
          {beforeLabel}
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Draggable circle handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-[#3D4F4A]">
              <path d="M3 1L0 6L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="text-[#3D4F4A]">
              <path d="M5 1L8 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
