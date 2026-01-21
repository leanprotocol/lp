'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const benefits = [
  'Less back, foot, and joint pain',
  'Increased energy',
  'Boosted confidence',
  'Better heart health',
  'Better sleep',
  'And more'
];

export default function ProgramCalculator() {
  const [weight, setWeight] = useState(250);
  const minWeight = 150;
  const maxWeight = 400;
  
  // Calculate potential weight loss (20% of body weight)
  const potentialLoss = Math.round(weight * 0.2);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        <div className="grid lg:grid-cols-5 gap-4 lg:gap-20 items-center">
          
          {/* Left Side - Stats & Benefits */}
          <div className="space-y-8 col-span-2">
            
            {/* Circle Badge */}
            <div className="inline-flex flex-col items-center justify-center p-16 aspect-square bg-accent rounded-full">
              <p className="font-sans text-base text-black mb-5">Lose up to</p>
              <p className="font-sans tracking-tighter text-9xl text-black font-thin mb-5">20%</p>
              <p className="font-sans text-sm text-black text-center px-10">
                of your body weight with <br /> Zepbound<sup>®</sup>*
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <p className="font-sans text-[1.36rem] text-black font-medium max-w-sm">
                And see results beyond weight loss, which could include:
              </p>
              
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#FBC1A0] flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" strokeWidth={3} />
                      </div>
                    </div>
                    <p className="font-sans text-[17px] text-black font-normal">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Calculator */}
          <div className="space-y-8 col-span-3">
            
            {/* Heading */}
            <h2 className="font-serif text-center text-3xl md:text-4xl text-black leading-tight font-normal">
              Curious about weight loss medications?
            </h2>

            {/* Calculator Card */}
            <div className="bg-white rounded-[5rem] p-8 md:p-12 md:py-16 border border-black">
              
              {/* Current Weight Display */}
              <div className="mb-8 flex justify-between items-center w-full">
                <p className="font-sans text-2xl max-w-[12rem] text-black font-light mb-2">
                  Select your current weight
                </p>
                <p className="font-sans text-8xl text-black font-thin">
                  {weight}
                  <span className="text-5xl font-thin">lb.</span>
                </p>
              </div>

              {/* Range Slider */}
              <div className="mb-12">
                <input
                  type="range"
                  min={minWeight}
                  max={maxWeight}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #C4D89E 0%, #C4D89E ${((weight - minWeight) / (maxWeight - minWeight)) * 100}%, #E5E5E5 ${((weight - minWeight) / (maxWeight - minWeight)) * 100}%, #E5E5E5 100%)`
                  }}
                />
              </div>

              {/* Weight Loss Result */}
              <div className="flex justify-between items-center w-full">
                <p className="font-sans text-2xl max-w-[12rem] text-black font-semibold mb-2">
                  Weight you could lose (lb.)
                </p>
                <p className="font-sans text-8xl text-black font-thin">
                  {potentialLoss}
                  <span className="text-5xl font-thin">lb.</span>
                </p>
              </div>

            </div>
            
              {/* CTA Button */}
              <button className="mx-auto bg-dark text-white rounded-full py-4 px-6 font-sans text-base w-fit font-normal hover:bg-dark/90 transition-colors flex items-center justify-center gap-2">
                Take the quiz
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Disclaimer */}
              <p className="font-sans text-xs text-black font-light leading-relaxed mt-6 text-center">
                *average weight loss in 1 year is 20% (compared to 3.1% with diet and exercise alone). Based on a 72-week clinical trial studying the highest doses of Zepbound in non-diabetic patients with obesity, or with overweight plus a weight-related condition, when paired with healthy lifestyle changes.
              </p>
          </div>

        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #C4D89E;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #C4D89E;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}
