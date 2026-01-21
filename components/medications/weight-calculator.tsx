"use client"

import { useState } from "react"

/**
 * Interactive weight loss calculator
 * Allows users to visualize potential weight loss with medication
 */
export function WeightCalculator() {
  const [weight, setWeight] = useState(345)
  const lossPercentage = 20
  const potentialLoss = Math.round((weight * lossPercentage) / 100)

  return (
    <section className="w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Left: Percentage circle */}
         <div>
           <div className="flex justify-center">
            <div className="relative p-28 rounded-full bg-[#D4E5C4] flex flex-col items-center justify-center">
              <p className="text-sm text-black/70 mb-2">Lose up to</p>
              <p className="font-sans font-thin tracking-tighter text-[8rem] text-black">20%</p>
              <p className="text-sm text-black/70 mt-2">of your body weight with Zepbound®*</p>
            </div>
                
          </div>
           <p className="text-xs text-center text-black/50 mt-12 max-w-4xl mx-auto">
          *average weight loss in 1 year is 20% (compared to 3.1% with diet and exercise alone). Based on a 72-week
          clinical trial studying the highest doses of Zepbound in non-diabetic patients with obesity, or with
          overweight plus a weight-related condition, when paired with healthy lifestyle changes.
        </p>
         </div>

          {/* Right: Weight slider */}
          <div>
             <h2 className="font-serif text-4xl lg:text-5xl text-black mb-16 text-center">
          Curious about weight loss medications?
        </h2>
            <div className="bg-white border border-black rounded-[3rem] p-8 lg:p-12 py-16">
            <div className="flex items-center justify-between mb-8">
              <p className="text-black">Select your current weight</p>
              <p className="font-serif text-5xl text-black">{weight} lb.</p>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="150"
              max="450"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-12"
              style={{
                background: `linear-gradient(to right, #D4E5C4 0%, #D4E5C4 ${((weight - 150) / 300) * 100}%, #E5E5E5 ${((weight - 150) / 300) * 100}%, #E5E5E5 100%)`,
              }}
            />

            {/* Result */}
            <div className="flex items-center justify-between">
              <p className="font-semibold text-black">Weight you could lose (lb.)</p>
              <p className="font-serif text-5xl text-black">{potentialLoss} lb.</p>
            </div>
          </div>
          </div>
        </div>

   
      </div>
    </section>
  )
}
