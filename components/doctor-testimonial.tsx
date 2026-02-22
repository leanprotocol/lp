"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"

type DoctorProfile = {
  title: string
  subtitle: string
  imageFilename: string
}

export function DoctorTestimonial() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-10 items-center">
          
          {/* Left column - Heading with serif elegance */}
          <div>
            <h2 className="heading">
              Lean Protocol's program is designed by leading doctors in obesity medicine
            </h2>
          </div>

          {/* Right column - Testimonial card */}
          <div className="bg-[#B8CCC5] rounded-2xl p-8 md:p-12 relative shadow-sm">
            
            {/* Improved Quote Icon: Uses the Lucide component for a crisp, professional look */}
            <div className="mb-6">
              <Quote 
                className="w-12 h-12 text-white opacity-80" 
                strokeWidth={3}
                fill="currentColor" 
              />
            </div>

            <blockquote className="space-y-8">
              <p className="text-xl md:text-[30px] text-dark leading-[1.4] font-light font-sans">
                As Lean Protocol's Senior Medical Advisor, I help design the clinical protocols 
                that guide the medical care Lean Protocol's members receive care that is 
                guided by the latest advancements in obesity medicine.
              </p>

              {/* Author info: Right-aligned structure as seen in your reference */}
              <div className="flex items-center justify-end gap-4 border-t border-dark/10 pt-8">
                <div className="text-right">
                  <p className="text-lg font-bold text-dark leading-none mb-1">
                    Dr. Kumar
                  </p>
                  <p className="text-xs uppercase tracking-widest text-dark/70 font-semibold">
                    Senior Medical Advisor
                  </p>
                </div>
                
                {/* Avatar with a subtle border to match professional medical branding */}
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#F5F3ED]">
                  <img 
                    src="/dr-kumar-avatar.jpg" 
                    alt="Dr. Kumar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  )
}

export function DoctorsSection() {
  const doctors: DoctorProfile[] = [
    {
      title: "Dr Akhil Konduru",
      subtitle: "MD Internal Medicine",
      imageFilename: "Dr Akhil Konduru - MD, Internal Medicine.png",
    },
    {
      title: "Dr Siddharth Garg",
      subtitle: "MD Internal Medicine",
      imageFilename: "Dr Siddharth Garg - MD, Internal Medicine.png",
    },
    {
      title: "Richa Singh",
      subtitle: "Yoga & Fat Loss Expert",
      imageFilename: "Richa Singh- Yoga & Fat Loss Expert.png",
    },
    {
      title: "Simran Kumawat",
      subtitle: "Nutritionist & Obesity Expert",
      imageFilename: "Simran Kumawat - Nutritionist and Obesity Expert.png",
    },
    {
      title: "Richa Sharma",
      subtitle: "Expert Nutritionist & Dietitian",
      imageFilename: "Richa Sharma - Expert Nutritionist & Dietitian.png",
    },
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: doctors.length > 3,
    align: "start",
    skipSnaps: false,
    containScroll: "trimSnaps",
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback((api?: UseEmblaCarouselType[1]) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    updateScrollState(emblaApi)
    emblaApi.on("select", updateScrollState)
    emblaApi.on("reInit", updateScrollState)

    return () => {
      emblaApi?.off("select", updateScrollState)
      emblaApi?.off("reInit", updateScrollState)
    }
  }, [emblaApi, updateScrollState])

  return (
    <section className="py-20 md:py-28 bg-[#F6F1EE]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="heading text-center">Meet the Experts working with us</h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.imageFilename}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 shrink-0 bg-white rounded-2xl overflow-hidden border border-dark/10 shadow-sm"
                  >
                    <div className="w-full h-[320px] bg-[#EDE7E1]">
                      <img
                        src={`/doctors/${encodeURIComponent(doctor.imageFilename)}`}
                        alt={doctor.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-lg font-serif text-dark leading-tight">{doctor.title}</p>
                      {doctor.subtitle ? (
                        <p className="text-sm text-dark/70 mt-2 leading-snug">{doctor.subtitle}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className={`w-11 h-11 rounded-full border border-dark/20 flex items-center justify-center text-dark transition-colors cursor-pointer ${
                  canScrollPrev ? "hover:bg-dark hover:text-white" : "opacity-40 cursor-not-allowed"
                }`}
                aria-label="View previous doctors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className={`w-11 h-11 rounded-full border border-dark/20 flex items-center justify-center text-dark transition-colors cursor-pointer ${
                  canScrollNext ? "hover:bg-dark hover:text-white" : "opacity-40 cursor-not-allowed"
                }`}
                aria-label="View next doctors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}