"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const journeySteps = [
  {
    title: "At Home Advanced Blood Panel and Health Evaluation Checkup",
    description: "Share your goals and history to power your personalized MetabolicPrint™ health assessment",
    image: "/journey/journey1.webp",
    gradient: "from-[#8B8A6F] to-[#A39F88]",
  },
  {
    title: "Deep Chats with our Expert Doctors & Nutritionists for a Personalised Protocol",
    description: "We'll find the best medication option for your budget & set goals",
    image: "/journey/journey2.png",
    gradient: "from-[#A39F88] to-[#B8B29E]",
  },
  {
    title: "Medications & Allied Supplements Delivered to your place",
    description: "Fast, discreet shipping right to your door within days",
    image: "/journey/journey3.png",
    gradient: "from-[#8B8A6F] to-[#9B9A80]",
  },
  {
    title: "Get your accountability partner & expert-designed workouts",
    description: "Monitor your weight loss journey with our app and regular check-ins",
    image: "/journey/journey4.webp",
    gradient: "from-[#7A7961] to-[#8B8A6F]",
  },
  {
    title: "Get lighter- lose up to 15-22% of body weight",
    description: "Celebrate your success with ongoing support from our care team",
    image: "/journey/journey5.webp",
    gradient: "from-[#9B9A80] to-[#A39F88]",
  },
] 

export function ParallaxJourney() {
  return (
    <section className="relative min-h-screen py-12 md:py-18">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Sticky Text Content */}
          <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2 md:mt-30">
            <h2 className="heading">
              The weight-loss secret of celebrities <span className="font-serif opacity-70 italic">made safer and accessible</span> 
            </h2>
            <Link href="/get-started">
              <Button 
                size="lg" 
                className="bg-dark cursor-pointer text-white hover:bg-dark/90 rounded-full text-base px-8 w-40 h-12 mt-5"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Scrolling Image Cards (Updated Design) */}
          <div className="space-y-8">
            {journeySteps.map((step, index) => {
              const stepNumber = String(index + 1).padStart(2, "0")
              return (
                <div
                  key={step.title}
                  className="journey-card group relative overflow-hidden rounded-[2.2rem] bg-gray-100"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="relative h-[450px] w-full">
                    {/* Image with Zoom Effect */}
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />



                    {/* Smart Gradient Overlay: Only darkens the bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                    {/* Content Positioned at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-white transition-transform duration-500">
                      <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
                        <span className="h-px w-10 bg-white/40" />
                        Step {stepNumber}
                      </div>
                      <h3 className="text-2xl md:text-[26px] font-light mb-2 leading-tight text-balance">
                        {step.title}
                      </h3>

                      {/* Uncomment this if you want the description visible.
                          It will now be readable. */}
                      {/* <p className="text-base text-white/80 max-w-lg text-balance mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {step.description}
                      </p>
                      */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        .journey-card {
          opacity: 0;
          transform: translateY(32px);
          animation: journeyCardReveal 0.75s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes journeyCardReveal {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .journey-card {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}