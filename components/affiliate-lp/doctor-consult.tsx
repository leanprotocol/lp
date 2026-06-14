"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DoctorConsult() {
  const scrollToPlans = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-lp-bg py-24 px-4 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#EAE5DA] rounded-3xl overflow-hidden shadow-2xl border border-[#D5D0C5] flex flex-col">
          
          {/* Top Image Area (Full poster except pricing) */}
          <div className="w-full relative h-[300px] md:h-[400px] overflow-hidden">
            <Image 
              src="/lp-assets/doctor-lean-protocol.jpeg"
              alt="Consult a GLP 1 Doctor Now"
              fill
              className="object-cover object-top scale-110"
              priority
            />
          </div>

          {/* Bottom Pricing & CTA Area */}
          <div className="p-6 md:p-10 pt-4 bg-gradient-to-b from-[#EAE5DA] to-[#DFD8CC]">
            <div className="bg-[#10241A] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#233B2F]">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto text-center sm:text-left">
                <div className="text-white text-base md:text-lg font-bold sm:pr-6 sm:border-r border-[#C9A84C]/50 leading-tight">
                  FIRST CONSULT<br className="hidden sm:block" /> DISCOUNT
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/60 line-through text-xl md:text-2xl font-serif">Rs 1500</span>
                  <span className="text-[#C9A84C] text-3xl md:text-4xl font-serif">Rs 449</span>
                </div>
              </div>
              
              <Button 
                  onClick={scrollToPlans}
                  className="w-full md:w-auto px-8 h-14 bg-[#EAE5DA] hover:bg-white text-[#10241A] font-bold rounded-full shadow-lg transition-transform hover:scale-105"
              >
                  Book Consultation
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-[#10241A]/80 font-serif">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-sm md:text-base tracking-wide">Guided by Science. Focused for your results.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
