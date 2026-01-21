import { Header } from "@/components/header"
import { MedicationsHero } from "@/components/medications/hero-section"
import { DoctorBiologySection } from "@/components/medications/doctor-biology-section"
import { WeightCalculator } from "@/components/medications/weight-calculator"
import { ScienceVideoSection } from "@/components/medications/science-video-section"
import { MedicationCarousel } from "@/components/medications/medication-carousel"
import { ProgramSupportSection } from "@/components/medications/program-support-section"
import { ExpertTeamCarousel } from "@/components/medications/expert-team-carousel"
import { MedicationDisclaimers } from "@/components/medications/medication-disclaimers"
import { VideoTestimonials } from "@/components/medications/video-testimonials"
import { FinalCTA } from "@/components/medications/final-cta"
import Footer from "@/components/footer"
import WhyMedication from "@/components/medications/why-medication"
import PricingSection from "@/components/medications/pricing-section"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weight Loss Medications | Zepbound, Mounjaro, Victoza, Wegovy, Ozempic, Orlistat, Metformin | Lean Healthcare",
  description: "GLP-1 medications for fat loss: Zepbound®, Wegovy®, Ozempic®. Treat insulin resistance, PCOS, hormonal imbalance. Lean Protocol + doctor monitoring from ₹2,299.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}


export default function MedicationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <MedicationsHero />
      <WhyMedication/>
      {/* <DoctorBiologySection /> */}
      {/* <WeightCalculator /> */}
      {/* <ScienceVideoSection /> */}
      <MedicationCarousel />
      <ProgramSupportSection />
      {/* <ExpertTeamCarousel /> */}
      {/* <MedicationDisclaimers /> */}
      {/* <VideoTestimonials /> */}
      <PricingSection/>
      <FinalCTA />
      <Footer />
    </main>
  )
}
