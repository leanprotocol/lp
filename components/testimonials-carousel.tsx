"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BeforeAfterSlider } from "./before-after-slider"

interface Testimonial {
  category: string
  name: string
  weightLost: string
  beforeImage: string
  afterImage: string
}

export function TestimonialsCarousel() {
  // 1. Fixed: Set to 0 to show the first card by default
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      category: "SEMAGLUTIDE",
      name: "Colleen",
      weightLost: "280",
      beforeImage: "/colleen-before.jpg",
      afterImage: "/colleen-after.jpg",
    },
    {
      category: "TIRZEPATIDE",
      name: "Jessica",
      weightLost: "120",
      beforeImage: "/jessica-before.jpg",
      afterImage: "/jessica-after.jpg",
    },
    {
      category: "LIRAGLUTIDE",
      name: "Lupe",
      weightLost: "43",
      beforeImage: "/lupe-before.jpg",
      afterImage: "/lupe-after.jpg",
    },
    {
      category: "LIRAGLUTIDE",
      name: "Christie",
      weightLost: "49",
      beforeImage: "/christie-before.jpg",
      afterImage: "/christie-after.jpg",
    },
    {
      category: "LIRAGLUTIDE",
      name: "Nicole",
      weightLost: "85",
      beforeImage: "/nicole-before.jpg",
      afterImage: "/nicole-after.jpg",
    },
  ]

  return (
    <section className="pb-20 pt-20 md:pb-20 bg-dark">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <h2 className="heading-white text-center">
          Real people. Real stories. <span className="italic text-white">Real results.*</span>
        </h2>

        {/* Carousel container */}
        <div className="relative max-w-7xl mx-auto mt-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              // 2. Fixed: Adjusted transform to move 100% per card plus the gap for mobile UX
              style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 1.5}rem))` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-full md:min-w-[calc(33.33%-1rem)] lg:min-w-[calc(25%-1.125rem)] flex-shrink-0"
                >
                  <div className="bg-white/20 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4">
                      <BeforeAfterSlider
                        beforeImage={testimonial.beforeImage}
                        afterImage={testimonial.afterImage}
                        beforeLabel="Before"
                        afterLabel="After"
                      />
                    </div>

                    <div className="p-6 pt-4 flex items-end justify-between gap-4">
  <div className="flex-1 min-w-0">
    <p className="text-[10px] uppercase text-accent2 mb-1 tracking-[0.1em] font-medium opacity-80">
      {testimonial.category}
    </p>
    <h3 className="text-2xl font-serif text-white leading-none mb-2 truncate">
      {testimonial.name}
    </h3>
    <p className="text-sm text-accent2 flex items-baseline gap-1">
      <span>lost</span>
      <span className="text-accent font-bold text-xl leading-none">
        {testimonial.weightLost}
      </span>
      <span>lbs</span>
    </p>
  </div>

  <Button
    variant="outline"
    size="sm"
    className="rounded-full font-normal text-[11px] px-4 h-9 border-white/20 text-white hover:bg-white/10 hover:text-white whitespace-nowrap bg-transparent transition-colors flex-shrink-0"
  >
    What {testimonial.name} says
  </Button>
</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* 3. Fixed: Dots now map exactly to the number of testimonial objects */}
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => setActiveIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
            // 4. Fixed: Right arrow disables correctly at the end of the array
            disabled={activeIndex === testimonials.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[#B8CCC5] text-center mt-12 max-w-4xl mx-auto leading-relaxed">
          *Individual results may vary. In 1 year, GLP-1 users lost an avg. of 13% to 15% body weight. Results based on data
          from 1,773 users who reported their weight at least 1 time/week, on avg. for 1 year. Rx are up to a medical provider's
          discretion. See below for risk info{" "}
          <a href="#" className="underline">
            here
          </a>
          .
        </p>
      </div>
    </section>
  )
}