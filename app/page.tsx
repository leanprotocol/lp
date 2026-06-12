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
import { LimitedOffersSection } from "@/components/limited-offers-section"; 
import { VideoPopup } from "@/components/video-popup"
import { VideoSection } from "@/components/video-section"
export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <VideoPopup />
      <Hero />
      <InsuranceLogos />
      {<div className="hidden md:block"><CausesSection /></div>}
      <ParallaxJourney /> 
      <VideoSection />
      <TestimonialsCarousel />
      <MobileStatsCard />
      <div id="pricing">
        <PricingCarousel />
      </div>
      <LimitedOffersSection />
      <section className="py-10 px-4 text-center bg-[#E8F0D8] md:bg-white">
        <h3 className="font-extrabold text-black uppercase tracking-widest text-sm mb-8">Our Engagement Partners</h3>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="relative w-32 h-12">
            <img src="/lp-assets/logo-redcliffe.png" alt="Redcliffe Labs" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center font-bold text-2xl tracking-tight text-[#0066CC]">
            <span className="text-[#4CAF50]">Mr</span>Med
          </div>
          <div className="relative w-24 h-12">
            <img src="/lp-assets/logo-cult.png" alt="Cult" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>
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
