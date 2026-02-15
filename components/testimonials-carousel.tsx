"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType } from "embla-carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  name: string
  age?: string
  weightLost?: string
  duration?: string
  imageFilename: string
}

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    skipSnaps: false,
  })
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback((api?: EmblaCarouselType) => {
    if (!api) return
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    updateScrollState(emblaApi)
    emblaApi.on("select", updateScrollState)
    emblaApi.on("reInit", updateScrollState)

    return () => {
      emblaApi?.off("select", updateScrollState)
      emblaApi?.off("reInit", updateScrollState)
    }
  }, [emblaApi, updateScrollState])

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
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="basis-full sm:basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 shrink-0"
                >
                  <div className="bg-white/20 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4">
                      <div className="w-full overflow-hidden rounded-xl bg-white/10 h-[360px] sm:h-[340px] md:h-[280px]">
                        <img
                          src={`/before-after/${encodeURIComponent(testimonial.imageFilename)}`}
                          alt={testimonial.name ? `${testimonial.name} result` : "Testimonial result"}
                          className="h-full w-full object-cover bg-white"
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
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className={`w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white transition-colors ${
              canScrollPrev ? "hover:bg-white/20" : "opacity-40 cursor-not-allowed"
            }`}
            aria-label="View previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className={`w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white transition-colors ${
              canScrollNext ? "hover:bg-white/20" : "opacity-40 cursor-not-allowed"
            }`}
            aria-label="View next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
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