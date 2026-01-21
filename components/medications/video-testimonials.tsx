"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import Image from "next/image"

/**
 * Video testimonials carousel
 * Features real customer success stories with video previews
 */

interface Testimonial {
  id: string
  name: string
  image: string
  videoUrl: string
  quote: string
  highlight: string
  metric?: {
    label: string
    value: string
  }
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Emily Z*",
    image: "/testimonial-emily.jpg",
    videoUrl: "#",
    quote: "The biggest change I've noticed is in my energy levels",
    highlight: "the biggest",
  },
  {
    id: "2",
    name: "Zarya D*",
    image: "/testimonial-zarya.jpg",
    videoUrl: "#",
    quote: "My quality of life has improved dramatically",
    highlight: "my quality of",
    metric: {
      label: "Lost",
      value: "30lb.",
    },
  },
  {
    id: "3",
    name: "Nicole D*",
    image: "/testimonial-nicole.jpg",
    videoUrl: "#",
    quote: "Taking care of myself, so I can be a better example for my toddler",
    highlight: "and so far",
  },
]

export function VideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#F5EFE7" }}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-balance">
              Don't take
              <br />
              our word for it
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Hear stories of how medication made all the difference in these Lean Protocol journeys.*
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-[#2C3E3C] hover:bg-[#3d5250] text-white flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]">
                <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                  {/* Video preview side */}
                  <div className="relative aspect-[3/4] bg-gray-900">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                    {/* Play button overlay */}
                    <button
                      className="absolute inset-0 flex items-center justify-center group"
                      aria-label={`Play ${testimonial.name}'s story`}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </button>
                    {/* Highlight badge */}
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-[#C8D97E] text-[#2C3E3C] px-4 py-2 rounded-full text-sm font-medium">
                        {testimonial.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Quote side */}
                  <div className="bg-[#2C3E3C] text-white p-8 flex flex-col justify-center relative">
                    <div className="mb-6">
                      <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                      </svg>
                    </div>

                    {testimonial.metric && (
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-1">{testimonial.metric.label}</div>
                        <div className="font-serif text-6xl">{testimonial.metric.value}</div>
                      </div>
                    )}

                    <p className="font-serif text-xl md:text-2xl mb-6 italic leading-relaxed">{testimonial.quote}</p>

                    <div className="text-sm text-white/70">{testimonial.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-[#2C3E3C] w-8" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-8 max-w-4xl mx-auto">
          *Real users, paid for appearance. Individual results may vary. In 1 year, Lean Protocol users lost an average of 12%
          body weight. Results based on data from 1,773 users who reported their weight at least 1 time/week on avg. for
          1 year. Prescriptions are up to a medical provider's discretion. See risk information{" "}
          <a href="#" className="underline hover:text-gray-700">
            here
          </a>
          .
        </p>
      </div>
    </section>
  )
}
