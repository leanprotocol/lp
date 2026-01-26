import { Header } from "@/components/header";
import { Hero, InsuranceLogos } from "@/components/hero";
import { ParallaxJourney } from "@/components/parallax-journey";
import { MicrodoseSection } from "@/components/microdose-section";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { FAQSection } from "@/components/faq-section";
import { DoctorTestimonial } from "@/components/doctor-testimonial";
import MembersServed from "@/components/members-served";
import MedicationToolkit from "@/components/medication-toolkit";
import InsuranceCoverage from "@/components/insurance-coverage";
import BenefitsMarquee from "@/components/benefits-marquee";
import Footer from "@/components/footer";
import CausesSection from "@/components/causes-section";
import { WeightSlider } from "@/components/weight-slider";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <InsuranceLogos />
      <CausesSection />
      <ParallaxJourney /> 
      {/* <MembersServed /> */}
      <MedicationToolkit />
      {/* <MicrodoseSection /> */}
      <WeightSlider />
      <InsuranceCoverage />
      <BenefitsMarquee />
      {/* <TestimonialsCarousel /> */}
      {/* <StatsSection /> */}
      {/* <DoctorTestimonial /> */}
      <FAQSection />
      <Footer />
    </main>
  );
}
