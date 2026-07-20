"use client"

import { useState, useEffect } from "react"

export function WeightSlider() {
  const [weight, setWeight] = useState(100)
  const [displayWeight, setDisplayWeight] = useState(78)
  const [isAnimating, setIsAnimating] = useState(false)
  const lossPercentage = 22
  const targetWeight = Math.round(weight * (1 - lossPercentage / 100))

  useEffect(() => {
    setIsAnimating(true)
    const start = displayWeight
    const end = targetWeight
    const duration = 500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const current = Math.round(start + (end - start) * progress)
      setDisplayWeight(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }, [targetWeight])

  return (
    <section className="w-full bg-white py-12 lg:py-18">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-[28px] lg:text-5xl text-black mb-10 md:mb-16 text-center">
              Your estimated weight in 6 months with Lean Protocol
            </h2>
            <div className="bg-white border border-black rounded-3xl md:rounded-[3rem] p-6 md:p-12 md:py-16">
              <div className="flex items-center justify-between mb-8">
                <p className="text-black text-sm">Select your current weight</p>
                <p className="font-serif text-2xl md:text-5xl text-black">{weight} kg</p>
              </div>

              <input
               type="range"
               min="50"
               max="250"
               value={weight}
               aria-label="Weight slider in kilograms"
               onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-12 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#14532d] 
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#14532d]
               [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
               [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150"
                style={{
                  background: `linear-gradient(to right, #D4E5C4 0%, #D4E5C4 ${((weight - 50) / 200) * 100}%, #E5E5E5 ${((weight - 50) / 200) * 100}%, #E5E5E5 100%)`,
                }}
              />

              <div className="flex items-center justify-between">
                <p className="font-semibold text-black text-lg">Estimated new weight*</p>
                <div className="relative">
                  <p className="font-serif text-2xl md:text-5xl text-[#14532d] transition-transform duration-150" 
                     style={{ transform: isAnimating ? 'scale(1.1)' : 'scale(1)' }}>
                    {displayWeight} kg
                  </p>
                  <svg
                    className="absolute -bottom-4 left-0 h-5 w-full"
                    viewBox="0 0 220 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 6 12
                         C 30 3, 52 19, 74 10
                         C 94 2, 112 18, 132 10
                         C 152 2, 170 18, 190 10
                         C 202 6, 212 9, 214 12"
                      stroke="#FFFFFF"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.95"
                    />
                    <path
                      d="M 6 12
                         C 30 3, 52 19, 74 10
                         C 94 2, 112 18, 132 10
                         C 152 2, 170 18, 190 10
                         C 202 6, 212 9, 214 12"
                      stroke="#D4E5C4"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.98"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <p className="text-[11px] text-muted-foreground/60 mt-6 px-4 text-center max-w-3xl mx-auto">*Individual results may vary. The data is on the basis of average results of a Lean Protocol user.</p>
    </section>
  )
}



