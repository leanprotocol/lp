"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingDown } from "lucide-react"

interface Testimonial {
  name: string
  weightLost: string
  beforeImage: string
  afterImage: string
  quote: string
}

export function BeforeAfter() {
  const [mobileIndex, setMobileIndex] = useState(0)
  const [desktopIndex, setDesktopIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      name: "Priya",
      weightLost: "12",
      beforeImage: "/before-after/beforeafter2a.png",
      afterImage: "/before-after/beforeafter2b.png",
      quote: "The energy I have now is unmatched. I feel confident and alive every single day."
    },
    {
      name: "Amit",
      weightLost: "10",
      beforeImage: "/before-after/beforeafter4a.png",
      afterImage: "/before-after/beforeafter4b.png",
      quote: "I feel like I got my life back completely. Sustainable results without extreme dieting."
    },
    {
      name: "Keshav",
      weightLost: "13",
      beforeImage: "/before-after/beforeafter3a.png",
      afterImage: "/before-after/beforeafter3b.png",
      quote: "Finally, a solution that actually worked. Simple protocol, incredible transformation."
    },
    {
      name: "Disha",
      weightLost: "11",
      beforeImage: "/before-after/beforeafter5a.png",
      afterImage: "/before-after/beforeafter5b.png",
      quote: "The energy I have now is unmatched. Clothes fit perfectly and confidence restored."
    },
    {
      name: "Jay",
      weightLost: "13",
      beforeImage: "/before-after/beforeafter1a.png",
      afterImage: "/before-after/beforeafter1b.png",
      quote: "Consistency finally paid off with this protocol. Results exceeded all expectations."
    },
    {
      name: "Pooja",
      weightLost: "14",
      beforeImage: "/before-after/beforeafter8a.png",
      afterImage: "/before-after/beforeafter8b.png",
      quote: "The energy I have now is unmatched. Best decision for my health and happiness."
    },
    {
      name: "Ramesh",
      weightLost: "15",
      beforeImage: "/before-after/beforeafter6a.png",
      afterImage: "/before-after/beforeafter6b.png",
      quote: "Consistency finally paid off with this protocol. Life-changing weight loss journey."
    },
    {
      name: "Amey",
      weightLost: "15",
      beforeImage: "/before-after/beforeafter7a.png",
      afterImage: "/before-after/beforeafter7b.png",
      quote: "Consistency finally paid off with this protocol. Healthier, happier, and stronger."
    },
  ]

  const nextMobile = () => {
    if (mobileIndex < testimonials.length - 1) setMobileIndex(mobileIndex + 1)
  }
  const prevMobile = () => {
    if (mobileIndex > 0) setMobileIndex(mobileIndex - 1)
  }

  const maxDesktopIndex = Math.max(0, testimonials.length - 3)

  const nextDesktop = () => {
    if (desktopIndex < maxDesktopIndex) setDesktopIndex(desktopIndex + 1)
  }
  const prevDesktop = () => {
    if (desktopIndex > 0) setDesktopIndex(desktopIndex - 1)
  }

  return (
    <section className="relative py-8 md:py-16 bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2D3319] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-2 md:px-4">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="heading-white">
            Real people. <span className="italic text-white">Real results.</span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="lg:hidden relative">
            <div className="overflow-hidden px-1">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] gap-4"
                style={{ transform: `translateX(calc(-${mobileIndex * 100}% - ${mobileIndex * 1}rem))` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full flex-shrink-0">
                    <div className="max-w-xs mx-auto h-full">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 md:mt-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 border border-white/10"
                onClick={prevMobile}
                disabled={mobileIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setMobileIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === mobileIndex ? "w-8 bg-white" : "w-2 bg-white/20"
                      }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 border border-white/10"
                onClick={nextMobile}
                disabled={mobileIndex === testimonials.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block relative group/desktop">

            <div className="absolute top-1/2 lg:-left-4 xl:-left-20 -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                className={`text-dark hover:text-white bg-accent2/80 hover:bg-accent2/20 rounded-full h-13 w-13 cursor-pointer border border-white/5 transition-all duration-300 ${desktopIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={prevDesktop}
              >
                <ChevronLeft className="h-12 w-12" />
              </Button>
            </div>

            <div className="absolute top-1/2 lg:-right-4 xl:-right-20 -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                className={`text-dark hover:text-white bg-accent2/80 hover:bg-accent2/20 rounded-full h-13 w-13 cursor-pointer border border-white/5 transition-all duration-300 ${desktopIndex >= maxDesktopIndex ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={nextDesktop}
              >
                <ChevronRight className="h-12 w-12" />
              </Button>
            </div>

            <div className="overflow-hidden -mx-4 px-4">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] gap-8"
                style={{ transform: `translateX(calc(-${desktopIndex * (100 / 3)}% - ${desktopIndex * 10.66}px))` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-[calc(33.333%-21.33px)] flex-shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-[10px] text-white/40 text-center max-w-3xl mx-auto leading-relaxed font-light">
            Real member(s), paid for appearance. individual results may vary.  In 1 year, Lean Protocol users lost an avg. of 12% body weight. Results based on data from 1,773 users who reported their weight at least 1 time/week on avg. for 1 year. RX are up to a medical provider’s discretion. See below for risk info here.
          </p>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="h-full group">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl md:rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 h-full flex flex-col hover:bg-white/10">
        <div className="p-3 md:p-2 grid grid-cols-2 gap-1">
          <div className="space-y-2 relative">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-white/80">
              Before
            </div>
            <div className="aspect-[4/5] md:aspect-[3/4] relative rounded-xl md:rounded-2xl md:rounded-l-3xl md:rounded-r-none overflow-hidden bg-white/5 shadow-inner">
              <img
                src={testimonial.beforeImage}
                alt="Before"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-[#D6F0E6] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-[#1F302B]">
              After
            </div>
            <div className="aspect-[4/5] md:aspect-[3/4] relative rounded-xl md:rounded-2xl md:rounded-r-3xl md:rounded-l-none overflow-hidden bg-white/5 shadow-inner">
              <img
                src={testimonial.afterImage}
                alt="After"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-4 flex flex-col flex-1">

          <div className="flex justify-between items-start mb-3 md:mb-4 border-b border-white/10 pb-3 md:pb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-1">
                {testimonial.name}
              </h3>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-baseline gap-2">
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-[#D6F0E6] mt-1 flex-shrink-0" />
                <span className="text-3xl md:text-4xl font-serif text-[#D6F0E6] leading-none">
                  {testimonial.weightLost}<span className="text-[14px] md:text-[16px] ml-1.5 font-sans">kgs</span>
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] mt-1 uppercase tracking-wider text-white/50 font-medium">
                Lost
              </span>
            </div>
          </div>

          <div className="">
            <p className="text-xs md:text-sm text-white/70 italic font-light leading-relaxed ">
              "{testimonial.quote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}