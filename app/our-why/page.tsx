import Footer from "@/components/footer"
import { Header } from "@/components/header"
import OurWhyHero from "@/components/our-why/our-why-hero"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why Lean Protocol? | Integrated Weight Loss Protocol for India",
  description: "A medical-first approach connecting doctors, nutritionists and trainers, built on six foundational pillars. Starting Rs 4,999.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function WhyPage() { 
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <OurWhyHero/>
      <Footer/>
    </main>
  )
}
