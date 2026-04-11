import { Header } from "@/components/header";
import { Hero, InsuranceLogos } from "@/components/hero";
import { ParallaxJourney } from "@/components/parallax-journey";
import { MicrodoseSection } from "@/components/microdose-section";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { DoctorTestimonial, DoctorsSection } from "@/components/doctor-testimonial";
import MembersServed from "@/components/members-served";
import MedicationToolkit from "@/components/medication-toolkit";
import InsuranceCoverage from "@/components/insurance-coverage";
import BenefitsMarquee from "@/components/benefits-marquee";
import Footer from "@/components/footer";
import CausesSection from "@/components/causes-section";
import { WeightSlider } from "@/components/weight-slider";
import { MobileStatsCard } from "@/components/mobile-stats-card";
import { PricingCarousel } from "@/components/pricing-carousel";
import { WeightLossChart } from "@/components/weight-loss-chart";
import { NewsRibbon } from "@/components/news-ribbon";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <InsuranceLogos />
      {<div className="hidden md:block"><CausesSection /></div>}
      <ParallaxJourney /> 
      <TestimonialsCarousel />
      <MobileStatsCard />
      <PricingCarousel />
      {/* <MembersServed /> */}
      {<div className="hidden md:block"><MedicationToolkit /></div>}
      {/* <MicrodoseSection /> */}
      <WeightSlider />
      <DoctorsSection />
      <NewsRibbon />
      <WeightLossChart />
      <BenefitsMarquee />
      <InsuranceCoverage />
      
      {/* <StatsSection /> */}
      {/* <DoctorTestimonial /> */}
      {/* <DoctorsSection /> */}
      <Footer />
    </main>
  );
}
