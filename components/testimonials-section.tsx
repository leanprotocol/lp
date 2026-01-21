"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const testimonials = [
  {
    name: "Colleen",
    weightLost: "280lbs",
    quote: "I found I'm getting my life back. I am now the best version of myself that I have been in over 20 years.",
    beforeImage: "/placeholder.svg?height=400&width=300",
    afterImage: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Jessica",
    weightLost: "120lbs",
    quote:
      "120 pounds down through Lean Protocol and I no longer have sleep apnea, which is such a relief and I'm sleeping so much better.",
    beforeImage: "/placeholder.svg?height=400&width=300",
    afterImage: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Lupe",
    weightLost: "43lbs",
    quote: "Lean Protocol has made a huge difference in my life",
    beforeImage: "/placeholder.svg?height=400&width=300",
    afterImage: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Christie",
    weightLost: "49lbs",
    quote: "I'm happy to say consistency is key",
    beforeImage: "/placeholder.svg?height=400&width=300",
    afterImage: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Nicole",
    weightLost: "80lbs",
    quote: "I'm living a more productive, happy, and full life",
    beforeImage: "/placeholder.svg?height=400&width=300",
    afterImage: "/placeholder.svg?height=400&width=300",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showQuote, setShowQuote] = useState(false)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Real people. Real stories. <span className="text-emerald-600">Real results.</span>*
        </h2>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            {!showQuote ? (
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[3/4]">
                  <div className="absolute top-4 left-4 bg-background px-3 py-1 rounded-full text-sm font-medium">
                    Before
                  </div>
                  <img
                    src={testimonials[activeIndex].beforeImage || "/placeholder.svg"}
                    alt={`${testimonials[activeIndex].name} before`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4]">
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    After
                  </div>
                  <img
                    src={testimonials[activeIndex].afterImage || "/placeholder.svg"}
                    alt={`${testimonials[activeIndex].name} after`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
                <Button variant="ghost" size="sm" className="w-fit mb-6" onClick={() => setShowQuote(false)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="text-6xl text-emerald-600 mb-4">&quot;</div>
                <blockquote className="text-2xl font-medium mb-6 text-balance">
                  {testimonials[activeIndex].quote}
                </blockquote>
                <p className="text-lg font-semibold">— {testimonials[activeIndex].name}</p>
              </div>
            )}

            <div className="p-6 bg-muted/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{testimonials[activeIndex].name}</h3>
                <p className="text-sm text-muted-foreground">
                  lost{" "}
                  <span className="font-bold text-emerald-600 text-lg">{testimonials[activeIndex].weightLost}</span>
                </p>
              </div>
              <Button onClick={() => setShowQuote(!showQuote)} className="bg-emerald-600 hover:bg-emerald-700">
                {showQuote ? "View photos" : `What ${testimonials[activeIndex].name} says`}
              </Button>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index)
                  setShowQuote(false)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-emerald-600" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
