"use client"

import { useEffect, useState } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Plan {
  id: string
  name: string
  description?: string | null
  price: number
  originalPrice?: number | null
  durationDays: number
  features: string[]
  isFeatured: boolean
  isRefundable: boolean
}

function durationLabel(days: number): string {
  const months = Math.round(days / 30)
  return months === 1 ? "1 Month" : `${months} Months`
}

export function PricingCarousel() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => {
        const fetched: Plan[] = data?.plans ?? []
        setPlans(fetched)
        // default to featured plan if present
        const featuredIdx = fetched.findIndex((p) => p.isFeatured)
        if (featuredIdx >= 0) setActive(featuredIdx)
      })
      .catch(() => {})
  }, [])

  if (plans.length === 0) return null

  const plan = plans[active]
  const prev = () => setActive((i) => (i - 1 + plans.length) % plans.length)
  const next = () => setActive((i) => (i + 1) % plans.length)

  return (
    <section className="mx-4 my-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="font-serif text-2xl text-dark leading-snug">
          Choose Your Plan
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          All plans include GLP-1 guided care
        </p>
      </div>

      {/* Card */}
      <div className="relative">
        <div className="rounded-3xl overflow-hidden bg-dark">
          {/* Plan header */}
          <div className="px-6 pt-6 pb-4">
            {plan.isFeatured && (
              <span className="inline-block mb-2 text-[10px] font-semibold tracking-widest uppercase bg-accent text-dark rounded-full px-3 py-0.5">
                Most Popular
              </span>
            )}
            <p className="text-xs font-semibold tracking-widest uppercase text-accent2 mb-1">
              {durationLabel(plan.durationDays)}
            </p>
            <div className="flex items-baseline gap-2">
              {plan.originalPrice && (
                <span className="text-sm text-accent2/50 line-through">
                  ₹{Number(plan.originalPrice).toLocaleString()}
                </span>
              )}
              <span className="text-5xl font-bold text-accent tracking-tight">
                ₹{plan.price.toLocaleString()}
              </span>
            </div>
            {plan.description && (
              <p className="text-xs text-accent2/70 mt-1 leading-snug">{plan.description}</p>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-white/10" />

          {/* Features */}
          <div className="px-6 pt-4 pb-5 space-y-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-accent2/50">
              What&apos;s included
            </p>
            {(plan.features as string[]).map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                </div>
                <span className="text-sm text-accent2 leading-snug">{f}</span>
              </div>
            ))}
            {plan.isRefundable && (
              <div className="flex items-start gap-3 pt-1 border-t border-white/10">
                <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                </div>
                <span className="text-sm text-accent font-medium leading-snug">
                  Money Back Guarantee
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <a href="https://wa.link/3s1upf" target="_blank" rel="noopener noreferrer">
              <Button
                className={`w-full rounded-full text-sm font-semibold h-11 cursor-pointer ${
                  plan.isFeatured
                    ? "bg-accent text-dark hover:bg-accent/90"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Chat with Experts
              </Button>
            </a>
          </div>
        </div>

        {/* Prev / Next arrows */}
        {plans.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-dark"
              aria-label="Previous plan"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-dark"
              aria-label="Next plan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {plans.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {plans.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to plan ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === active
                  ? "w-5 h-2 bg-dark"
                  : "w-2 h-2 bg-dark/25"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
