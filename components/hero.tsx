"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Zap, ShieldCheck, TrendingDown, Stethoscope, Sun, ArrowRight } from "lucide-react"

export function Hero() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [defaultPlan, setDefaultPlan] = useState<
    | { id: string; price: number; originalPrice?: number | null; isDefault?: boolean }
    | null
  >(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(min-width: 768px)")

    const handleChange = (event: MediaQueryListEvent) => {
      setVideoSrc(event.matches ? "/hero-web.mp4" : "/hero-mobile.mp4")
    }

    setVideoSrc(mediaQuery.matches ? "/hero-web.mp4" : "/hero-mobile.mp4")
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const fetchDefaultPlan = async () => {
      try {
        const res = await fetch("/api/plans", { signal: controller.signal })
        const data = await res.json()
        if (!mounted) return
        if (!res.ok) {
          setDefaultPlan(null)
          return
        }

        const plans = (data?.plans ?? []) as Array<{
          id: string
          price: number
          originalPrice?: number | null
          isDefault?: boolean
        }>
        const matched = plans.find((p) => p.isDefault) ?? plans[0]
        setDefaultPlan(matched ?? null)
      } catch {
        if (!mounted) return
        setDefaultPlan(null)
      }
    }

    fetchDefaultPlan()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  return (
    <section className="relative bg-[#F6F1EE] overflow-hidden rounded-[2rem] mx-4 mt-7 py-4 md:mx-6">
      
      {/* Background Video & Overlay */}
      <div className="absolute inset-0 bg-black/30"> 
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        
        {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-hidden
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
        )}
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 md:px-10 py-16 md:py-16">
        <div className="max-w-4xl">
          
          <h1 className="mb-3 text-4xl font-serif tracking-tight text-balance md:text-[3.2rem] text-white leading-[1.3]">
            GLP 1 guided Fat Loss Made
            <br />
             <span className="italic font-light text-accent opacity-90">Affordable for India</span>
          </h1>

          <p className="mb-7 text-white max-w-2xl hidden sm:block">
            Advanced blood test & evaluation · 1:1 nutritionist consult (60 min) · Weight-loss doctor consultation · A clear future action plan · All for Rs {defaultPlan ? defaultPlan.price : "—"}. No hidden terms
          </p>

          {/* <div className="mb-7 text-white space-y-1 text-[14px] leading-[15px] sm:hidden">
            <p>- Advanced blood test &amp; evaluation</p>
            <p>- 1:1 nutritionist consult (60 min)</p>
            <p>- Weight-loss doctor consultation</p>
            <p>- A clear future action plan</p>
            <p>- All for Rs {defaultPlan ? defaultPlan.price : "—"}. No hidden terms</p>
          </div> */}

          <div className="mb-7 md:mt-5 mt-20 flex flex-col sm:flex-row gap-3">
      <a href="https://wa.link/3s1upf" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-white cursor-pointer text-black hover:bg-white/90 rounded-full text-base px-8 h-12 font-medium"
            >
              Chat with Experts <ArrowRight className="ml-2"/>
            </Button>
      </a>
            {/* <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white hover:border-white rounded-full text-base px-8 h-12 bg-transparent"
            >
              Check insurance
            </Button> */}
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 gap-4">
              
              <div className="flex flex-row items-start gap-3">
                <div className="p-1.5 rounded-full bg-white/10 shrink-0">
                  <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-white/90 leading-snug font-medium">
                  Upto 22% weight loss with our Protocol in 6 months<br />(Ex- 100kg to 78kg)
                </p>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="p-1.5 rounded-full bg-white/10 shrink-0">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-white/90 leading-snug font-medium">
                  Root Cause diagnosis
                </p>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="p-1.5 rounded-full bg-white/10 shrink-0">
                  <Sun className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-white/90 leading-snug font-medium">
                  Personalised Lifestyle Approach
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export function InsuranceLogos() {
  return (
    <div className="container mx-auto px-4 py-3 mt-2">
      <p className="mb-8 mt-5 text-[10px] leading-relaxed text-muted-foreground/60 max-w-4xl mx-auto text-center px-4">
Clinical trials of semaglutide and tirzepatide over 68–72 weeks showed average weight loss of ~15-22% when combined with diet and exercise, compared to ~2-3% with lifestyle changes alone. With multiple semaglutide-based options, medication choice depends on availability and medical suitability. Medicine will get delivered only if prescribed by our doctors.
      </p>
    </div>
  )
}