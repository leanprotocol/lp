"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  name: string
  age?: string
  weightLost?: string
  duration?: string
  imageFilename: string
}

export function TestimonialsCarousel() {
  // 1. Fixed: Set to 0 to show the first card by default
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartXRef = useRef<number | null>(null)
  const touchDeltaXRef = useRef<number>(0)

  const parseTestimonialFilename = (filename: string) => {
    const name = filename.split(",")[0]?.trim() || ""

    const ageMatch = filename.match(/,\s*(\d+)\s*Lost/i)
    const weightMatch = filename.match(/Lost\s*([\d.]+)\s*(?:Kgs?|kg|kgs)/i)
    const durationMatch = filename.match(/\sin\s(.+?)\.(?:jpe?g|png|webp)$/i)

    return {
      name,
      age: ageMatch?.[1],
      weightLost: weightMatch?.[1],
      duration: durationMatch?.[1]?.trim(),
    }
  }

  const testimonials: Testimonial[] = [
    {
      ...parseTestimonialFilename("Kanti, 44 Lost 8.5 Kgs in 3 months.jpeg"),
      imageFilename: "Kanti, 44 Lost 8.5 Kgs in 3 months.jpeg",
    },
    {
      ...parseTestimonialFilename("Neema, 46 Lost 10.8 kgs in 4 weeks.png"),
      imageFilename: "Neema, 46 Lost 10.8 kgs in 4 weeks.png",
    },
    {
      ...parseTestimonialFilename("Pratima, 37 Lost 7Kgs in 2.5 months.jpeg"),
      imageFilename: "Pratima, 37 Lost 7Kgs in 2.5 months.jpeg",
    },
    {
      ...parseTestimonialFilename("Rohit, 39 Lost 9.1 kg in 15 weeks.png"),
      imageFilename: "Rohit, 39 Lost 9.1 kg in 15 weeks.png",
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
          <div
            className="overflow-hidden"
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0]?.clientX ?? null
              touchDeltaXRef.current = 0
            }}
            onTouchMove={(e) => {
              if (touchStartXRef.current == null) return
              const currentX = e.touches[0]?.clientX
              if (currentX == null) return
              touchDeltaXRef.current = currentX - touchStartXRef.current
            }}
            onTouchEnd={() => {
              const deltaX = touchDeltaXRef.current
              touchStartXRef.current = null
              touchDeltaXRef.current = 0

              const threshold = 50
              if (Math.abs(deltaX) < threshold) return

              if (deltaX < 0) {
                setActiveIndex((idx) => Math.min(testimonials.length - 1, idx + 1))
              } else {
                setActiveIndex((idx) => Math.max(0, idx - 1))
              }
            }}
          >
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
                      <div className="w-full overflow-hidden rounded-xl bg-white/10 h-[360px] sm:h-[340px] md:h-[280px]">
                        <img
                          src={`/before-after/${encodeURIComponent(testimonial.imageFilename)}`}
                          alt={testimonial.name ? `${testimonial.name} result` : "Testimonial result"}
                          className="h-full w-full object-contain bg-white"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="p-6 pt-4 flex items-end justify-between gap-4">
  <div className="flex-1 min-w-0">
    <h3 className="text-2xl font-serif text-white leading-none mb-2 truncate">
      {testimonial.name}
    </h3>
    {(testimonial.weightLost || testimonial.duration || testimonial.age) && (
      <p className="text-sm text-accent2 leading-snug">
        {testimonial.age ? <span>{testimonial.age} yrs</span> : null}
        {testimonial.age && (testimonial.weightLost || testimonial.duration) ? <span> · </span> : null}
        {testimonial.weightLost ? <span>Lost {testimonial.weightLost} kg</span> : null}
        {testimonial.weightLost && testimonial.duration ? <span> in </span> : null}
        {testimonial.duration ? <span>{testimonial.duration}</span> : null}
      </p>
    )}
  </div>
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