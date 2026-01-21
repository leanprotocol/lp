import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    title: "Take our free quiz",
    description: "Share your goals and history to power your personalized MetabolicPrint™ health assessment",
    image: "/person-taking-online-health-quiz-on-phone.jpg",
  },
  {
    title: "Chat with our experts",
    description: "We'll find the best medication option for your budget & set goals",
    image: "/doctor-video-consultation.png",
  },
  {
    title: "Get your medication",
    description: "Delivered in 3 to 5 days for most medications",
    image: "/medication-delivery-box.jpg",
  },
  {
    title: "Start seeing and feeling results",
    description: "Log your habits, take on challenges, and hop into the Lean community for support",
    image: "/person-tracking-weight-loss-progress-on-app.jpg",
  },
]

export function JourneySteps() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Kick off your own <span className="text-emerald-600">weight loss</span> journey
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="mb-4 text-muted-foreground">{step.description}</p>
               <Link href="/get-started">
                <Button variant="link" className="p-0 text-emerald-600 hover:text-emerald-700">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
               </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
