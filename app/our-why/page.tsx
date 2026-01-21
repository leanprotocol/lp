import Footer from "@/components/footer"
import { Header } from "@/components/header"
import FounderMessage from "@/components/our-why/founder-mesage"
import OurWhyHero from "@/components/our-why/our-why-hero"
import SixPillars from "@/components/our-why/six-pillars"
import WhyUs from "@/components/our-why/why-us"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why Lean Healthcare? | Integrated Weight Loss Protocol for India",
  description: "Discover why Lean Protocol works - medical-first approach connecting doctors, nutritionists & trainers. 6 foundational pillars: Protocol, Prioritisation, Legit Science. Starting ₹2,299.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function WhyPage() { 
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <OurWhyHero/>
      <WhyUs/>
      <FounderMessage/>
      <SixPillars/>
      <Footer/>
    </main>
  )
}
