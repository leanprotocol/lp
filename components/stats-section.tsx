"use client"

import { useState } from "react"

export function StatsSection() {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      stat1: "83%",
      desc1: "of members sustain results for one year*",
      stat2: "1M+",
      desc2: "pounds lost by Lean members",
    },
  ]

  return (
    <section className="pb-20 md:pb-32 pt-10 bg-dark text-white">
      <div className="container mx-auto px-4">

        {/* Stats display */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            {/* Stat 1 */}
            <div className="text-center md:text-center md:pr-20 md:border-r border-white/20">
              <div className="text-7xl md:text-8xl lg:text-[13rem] font-light text-accent tracking-[-5px] mb-4">{slides[0].stat1}</div>
              <p className="text-base text-accent2">{slides[0].desc1}</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center md:text-center">
              <div className="text-7xl md:text-8xl lg:text-[13rem] font-light text-accent tracking-[-5px] mb-4">{slides[0].stat2}</div>
              <p className="text-base text-accent2">{slides[0].desc2}</p>
            </div>
          </div>

          {/* Main message */}
          <h2 className="text-3xl md:text-4xl font-serif text-center text-accent2 text-balance mt-4">
            It's not just about the weight you've lost,
            <br />
            it's about the life you've found.
          </h2>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-accent2 text-center mt-14 max-w-4xl mx-auto leading-relaxed">
          *Real members[1], paid for appearance. Individual results may vary. †In 1 year, Lean Protocol users lost on avg. of
          13% body weight. Results based on data from 1,773 users who reported their weight at least 1 time/week, on
          avg. for 1 year. Rx are up to a medical provider's discretion. See below for risk info{" "}
          <a href="#" className="underline">
            here
          </a>
          .
        </p>
      </div>
    </section>
  )
}
