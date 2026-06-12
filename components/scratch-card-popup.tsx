"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const BRUSH_RADIUS_DESKTOP = 28
const BRUSH_RADIUS_MOBILE  = 22

export function ScratchCardPopup() {
  const [visible,  setVisible]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const isDrawing   = useRef(false)
  const revealedRef = useRef(false)
  const isMobile    = useRef(false)

  // Show after 2.5 s — once per session
  useEffect(() => {
    if (sessionStorage.getItem("lpScratchShown")) return
    isMobile.current = window.innerWidth < 768
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Draw the scratch surface once the popup is visible
  useEffect(() => {
    if (!visible || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")!

    // Teal base
    ctx.fillStyle = "#0F766E"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle dot pattern
    ctx.fillStyle = "rgba(255,255,255,0.06)"
    for (let x = 0; x < canvas.width; x += 18) {
      for (let y = 0; y < canvas.height; y += 18) {
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Main instruction text
    ctx.fillStyle = "rgba(255,255,255,0.92)"
    ctx.font      = `bold ${isMobile.current ? 15 : 18}px Poppins, sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("✦  SCRATCH TO REVEAL  ✦", canvas.width / 2, canvas.height / 2 - 12)

    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.font      = `${isMobile.current ? 11 : 13}px Poppins, sans-serif`
    ctx.fillText("Your exclusive offer is hiding here!", canvas.width / 2, canvas.height / 2 + 14)
  }, [visible])

  // Core scratch logic
  const scratch = useCallback((x: number, y: number) => {
    if (!canvasRef.current || revealedRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")!
    const radius = isMobile.current ? BRUSH_RADIUS_MOBILE : BRUSH_RADIUS_DESKTOP

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // Auto-reveal when > 50% scratched
    const data        = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent   = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++
    }
    if ((transparent / (canvas.width * canvas.height)) * 100 > 50) autoReveal()
  }, [])

  const autoReveal = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")!
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
    setRevealed(true)
  }

  // Coordinate helpers (accounts for canvas CSS scaling)
  const coords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height),
    }
  }

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    const { x, y } = coords(e.clientX, e.clientY)
    scratch(x, y)
  }
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const { x, y } = coords(e.clientX, e.clientY)
    scratch(x, y)
  }
  const onMouseUp = () => { isDrawing.current = false }

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x, y } = coords(e.touches[0].clientX, e.touches[0].clientY)
    scratch(x, y)
  }
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x, y } = coords(e.touches[0].clientX, e.touches[0].clientY)
    scratch(x, y)
  }

  const handleClose = () => {
    sessionStorage.setItem("lpScratchShown", "1")
    setVisible(false)
  }

  const handleAvail = () => {
    handleClose()
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl
                   w-full max-w-[300px] md:max-w-[420px]"
        style={{ border: "2px solid #0F766E" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
          style={{ background: "rgba(15,118,110,0.12)", color: "#0F766E" }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-[#0F766E] px-5 py-3 md:py-4 text-center">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/60 mb-0.5">
            Exclusive deal
          </p>
          <h3 className="text-white font-bold text-base md:text-xl">
            Limited Time Offer 🎁
          </h3>
        </div>

        {/* Scratch card */}
        <div className="px-4 md:px-6 py-4 md:py-5">
          <div className="relative rounded-xl overflow-hidden" style={{ background: "#E1F5EE" }}>

            {/* Revealed content — always rendered, canvas sits on top */}
            <div className={`px-5 py-6 md:px-8 md:py-8 text-center transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-100"}`}>
              <p className="text-[10px] md:text-xs font-semibold text-[#0F766E]/60 uppercase tracking-widest mb-1">
                You unlocked
              </p>
              <div className="flex items-end justify-center gap-1 leading-none mb-1">
                <span className="text-[56px] md:text-[80px] font-bold text-[#085041] leading-none">
                  62
                </span>
                <span className="text-xl md:text-3xl font-bold text-[#0F6E56] pb-2 md:pb-3">
                  % OFF
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#0F6E56] font-medium mb-4 md:mb-5">
                1-Month GLP-1 Program
              </p>
              <button
                onClick={handleAvail}
                className="w-full py-2.5 md:py-3 rounded-xl font-bold text-sm text-white transition-colors"
                style={{ background: "#0F766E" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#085041")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0F766E")}
              >
                Avail Offer →
              </button>
            </div>

            {/* Canvas scratch overlay */}
            {!revealed && (
              <canvas
                ref={canvasRef}
                width={380}
                height={210}
                className="absolute inset-0 w-full h-full cursor-pointer select-none"
                style={{ touchAction: "none" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
              />
            )}
          </div>
        </div>

        {/* Footer hint */}
        {!revealed && (
          <p className="text-center text-[11px] md:text-xs text-gray-400 pb-3 md:pb-4">
            Use your finger or cursor to scratch!
          </p>
        )}
      </div>
    </div>
  )
}
