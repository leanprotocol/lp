"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Info, ChevronDown } from "lucide-react";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onBuyNow: (planTitle: string) => void;
  isCheckoutLoading: boolean;
  dbPlans: any[];
}

export function HeroSection({ onBuyNow, isCheckoutLoading, dbPlans }: HeroSectionProps) {
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Map DB plans to the UI format
  const displayPlans = dbPlans.length > 0 ? dbPlans.map(plan => {
    let durationLabel = "1 Month";
    if (plan.durationDays >= 180) durationLabel = "6 Months";
    else if (plan.durationDays >= 90) durationLabel = "3 Months";
    else if (plan.durationDays <= 1) durationLabel = "Doctor Consultation";

    let image = "/lp-assets/image15.png";
    if (durationLabel === "3 Months") image = "/lp-assets/image4.png";
    else if (durationLabel === "6 Months") image = "/lp-assets/image28.png";
    else if (durationLabel === "Doctor Consultation") image = "/lp-assets/image17.png";

    return {
      id: plan.id,
      durationLabel,
      title: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice || Math.round(plan.price * 1.5),
      image,
    };
  }) : [
    {
      durationLabel: "1 Month",
      title: "Lean Start – Beginner Plan",
      price: 5999,
      originalPrice: 9229,
      image: "/lp-assets/image15.png",
    },
    {
        durationLabel: "3 Months",
        title: "Lean Pro – Comprehensive Plan",
        price: 19999,
        originalPrice: 28778,
        image: "/lp-assets/image4.png",
      },
      {
        durationLabel: "6 Months",
        title: "Lean Champion – Guaranteed Weight Loss",
        price: 39998,
        originalPrice: 58667,
        image: "/lp-assets/image28.png",
      },
      {
        durationLabel: "Doctor Consultation",
        title: "For Prescription / Eligibility",
        price: 449,
        originalPrice: 1500,
        image: "/lp-assets/image17.png",
      },
  ];

  const activePlan = displayPlans[selectedPlanIdx] || displayPlans[0];

  return (
    <>
      {/* SECTION 1 – Sticky Navbar (matches main site) */}
      <header className="sticky top-0 md:top-3 z-50 mx-auto w-full md:w-[98%] md:max-w-[97%] md:rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition-all duration-300">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-cropped.png"
              alt="Lean Protocol"
              width={70}
              height={30}
              className="object-contain"
              priority
            />
          </Link>
          <a
            href="https://wa.link/5btsrr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full hover:bg-[#1fba58] transition shadow-sm font-medium text-sm"
          >
            <WhatsappIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </a>
        </div>
      </header>

      {/* SECTION 2 – Hero / Plan Selector */}
      <section className="pt-8 md:pt-12 pb-16 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12" id="plans">
        
        {/* Left Side: Copy & Selection */}
        <div className="space-y-8 flex flex-col justify-center order-2 lg:order-1">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-lp-green text-sm font-bold border border-green-100">
              Obesema (Torrent Pharma)
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-lp-dark leading-tight">
              Semaglutide GLP-1 Pen Shot – A Complete Transformation Plan
            </h1>
            
            <div className="flex items-center gap-5 mt-6">
              <span className="text-4xl font-bold text-lp-dark">₹{activePlan.price.toLocaleString()}</span>
              <span className="text-xl text-gray-400 line-through">₹{activePlan.originalPrice.toLocaleString()}</span>
              <div className="bg-lp-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                {Math.round((1 - activePlan.price / activePlan.originalPrice) * 100)}% OFF
              </div>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="flex flex-col gap-3">
            {displayPlans.map((plan, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPlanIdx(idx)}
                className={`flex items-center gap-4 border-2 rounded-2xl p-4 text-left transition-all duration-300 ${
                  idx === selectedPlanIdx 
                    ? "border-lp-green bg-[#F0F7F4] shadow-md" 
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                {/* Radio Circle */}
                <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  idx === selectedPlanIdx ? "border-lp-green" : "border-gray-300"
                }`}>
                  {idx === selectedPlanIdx && <div className="w-2.5 h-2.5 rounded-full bg-lp-green" />}
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-xs font-bold uppercase tracking-wider ${idx === selectedPlanIdx ? "text-lp-green" : "text-gray-500"}`}>
                      {plan.durationLabel}
                    </p>
                    <div className="text-right">
                       <p className="text-lg font-bold text-lp-dark leading-none">₹{plan.price.toLocaleString()}</p>
                       <p className="line-through text-gray-400 text-xs mt-1">₹{plan.originalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="font-bold text-lp-dark text-sm pr-8 md:pr-16">{plan.title}</p>
                </div>
              </button>
            ))}
          </div>

          <Button 
            onClick={() => onBuyNow(activePlan.title)}
            disabled={isCheckoutLoading}
            className="w-full h-16 text-xl bg-lp-green hover:bg-[#1C3A32] text-white rounded-full shadow-xl transition-all active:scale-95 disabled:opacity-70 font-bold"
          >
            {isCheckoutLoading ? "Processing..." : `Get Started Now`}
          </Button>

          {/* SECTION 3 – Terms & Conditions Block */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <h3 className="font-bold text-lp-dark text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-lp-green" />
              Terms & Conditions
            </h3>
            <ul className="text-xs text-gray-500 space-y-3 pl-5 list-disc marker:text-lp-green">
              <li>Your plan will be activated within 48 hours of purchase. In case of any activation issue, our team will call you on the number provided during purchase.</li>
              <li>Post activation, a doctor will call you to check your eligibility and prescribe the medication. If the doctor determines you are not eligible, you will receive a full refund within 24-48 hours.</li>
              <li>Please note - Lean Protocol does not influence the doctor's prescription decision.</li>
              <li>The prescribed drug is delivered by a third-party pharmacy. Lean Protocol does not source or manufacture any drug.</li>
            </ul>
            <p className="italic font-medium pt-2 text-[10px] text-gray-400">Disclaimer: Medications are prescribed solely by a licensed medical practitioner; eligibility is at their discretion. Drugs are fulfilled by third-party pharmacies. This program is not a substitute for medical diagnosis or treatment.</p>
          </div>
        </div>

        {/* Right Side: Dynamic Image */}
        <div className="order-1 lg:order-2 rounded-[2.5rem] bg-[#F8F9F8] aspect-[4/5] lg:aspect-[3/4] flex items-center justify-center relative overflow-hidden border-8 border-white shadow-2xl">
           <div className="absolute inset-0 z-10 p-6 md:p-10 flex items-center justify-center">
             <Image 
                src={activePlan.image} 
                alt={activePlan.title}
                fill
                className="object-contain object-center z-10 transition-transform duration-700 hover:scale-105"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
             />
           </div>
           {/* Fallback placeholder */}
           <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 z-0">
             <span className="font-bold text-xl text-center px-4 opacity-50">
               {activePlan.durationLabel} Plan Image<br/>
               <span className="text-sm font-normal">Building your protocol...</span>
             </span>
           </div>
        </div>

      </section>
    </>
  );
}
