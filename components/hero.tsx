import { Button } from "@/components/ui/button"
import { Check, Zap, ShieldCheck, TrendingDown, Stethoscope, Sun, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative bg-[#F6F1EE] overflow-hidden rounded-[2rem] mx-4 mt-7 py-4 md:mx-6">
      
      {/* Background Video & Overlay */}
      <div className="absolute inset-0 bg-black/30"> 
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/heronew.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 md:px-10 py-16 md:py-16">
        <div className="max-w-4xl">
          
          <h1 className="mb-3 text-4xl font-serif tracking-tight text-balance md:text-[3.2rem] text-white leading-[1.3]">
            Clinically Proven Fat Loss Made
            <br />
             <span className="italic font-light text-accent opacity-90">Affordable for India</span>
          </h1>

          <p className="mb-7 text-white max-w-2xl"> Advanced blood test & evaluation
1:1 nutritionist consult (60 min)
Weight-loss doctor consultation.
A clear future action plan
All for 2299. No hidden terms</p>

          <div className="mb-7 flex flex-col sm:flex-row gap-3">
      <Link href="/get-started">
            <Button 
              size="lg" 
              className="bg-white cursor-pointer text-black hover:bg-white/90 rounded-full text-base w-40 px-10 h-12 font-medium"
            >
              Book Now <ArrowRight className="ml-2"/>
            </Button>
      </Link>
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
                  Up to 15%-22% weight loss with GLP 1 Medications and Lean's- "Protocol"
                </p>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="p-1.5 rounded-full bg-white/10 shrink-0">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-white/90 leading-snug font-medium">
                  Foundation Diagnosis
                </p>
              </div>

              <div className="flex flex-row items-start gap-3">
                <div className="p-1.5 rounded-full bg-white/10 shrink-0">
                  <Sun className="w-4 h-4 text-white" />
                </div>
                <p className="text-base text-white/90 leading-snug font-medium">
                  Lifestyle Changing Approach
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
        In large 68–72 week clinical trials, Wegovy (2.4 mg) and Zepbound (15 mg) showed average weight loss of ~15% and ~20% respectively in adults with obesity, when combined with diet and exercise Versus just 2–3% with lifestyle changes alone. Prescriptions are at a doctor’s discretion. GLP-1 medications carry safety warnings; full risk information applies. See full risk info here

      </p>
    </div>
  )
}