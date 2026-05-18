import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    vertical: "/journey/step-1-vertical.jpeg",
    horizontal: "/journey/step-1-horizontal.jpeg",
    alt: "Step 1 - Take our free quiz",
  },
  {
    vertical: "/journey/step-2-vertical.jpeg",
    horizontal: "/journey/step-2-horizontal.jpeg",
    alt: "Step 2 - Chat with our experts",
  },
  {
    vertical: "/journey/step-3-vertical.jpeg",
    horizontal: "/journey/step-3-horizontal.jpeg",
    alt: "Step 3 - Your GLP-1 Based Diet Plan",
  },
  {
    vertical: "/journey/step-4-vertical.jpeg",
    horizontal: "/journey/step-4-horizontal.jpeg",
    alt: "Step 4 - Get your medication",
  },
  {
    vertical: "/journey/step-5-vertical.jpeg",
    horizontal: "/journey/step-5-horizontal.jpeg",
    alt: "Step 5 - Cult Pass Home",
  },
  {
    vertical: "/journey/step-6-vertical.jpeg",
    horizontal: "/journey/step-6-horizontal.jpeg",
    alt: "Step 6 - Start seeing results",
  },
]

export function JourneySteps() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Kick off your own <span className="text-emerald-600">weight loss</span> journey
        </h2>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={index} className="overflow-hidden rounded-2xl group hover:shadow-xl transition-all duration-300 bg-slate-50 border border-slate-100">
              <picture>
                <source media="(min-width: 768px)" srcSet={step.horizontal} />
                <img
                  src={step.vertical}
                  alt={step.alt}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </picture>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
           <Link href="/get-started">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
           </Link>
        </div>
      </div>
    </section>
  )
}
