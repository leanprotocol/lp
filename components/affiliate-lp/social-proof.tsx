"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const metricsTabs = [
  {
    id: "weight-loss",
    value: "18–22%",
    label: "Avg Weight Loss",
    title: "18-22% Average Weight Loss",
    description: "Our GLP-1 protocol is clinically proven to help you lose up to 22% of your body weight safely and sustainably.",
    image: "/lp-assets/image10.jpg",
    objectPosition: "object-center"
  },
  {
    id: "success-rate",
    value: "98%",
    label: "Success Rate",
    title: "98% Success Rate",
    description: "Join thousands of successful members who have transformed their lives, reversed chronic conditions, and maintained their results.",
    image: "/lp-assets/metric_success_rate.png",
    objectPosition: "object-top"
  },
  {
    id: "hba1c",
    value: "2.6%",
    label: "Avg. HbA1c Drop",
    title: "2.6% Avg. HbA1c Drop",
    description: "Beyond weight loss, our protocol significantly improves metabolic health, reversing insulin resistance and lowering blood sugar.",
    image: "/lp-assets/metric_hba1c.png",
    objectPosition: "object-top"
  },
  {
    id: "guarantee",
    value: "6 mo",
    label: "Results Guaranteed",
    title: "6 Months Guaranteed Results",
    description: "We are so confident in our science-backed approach that we offer a results guarantee. Achieve your goals or get your money back.",
    image: "/lp-assets/metric_guarantee.png",
    objectPosition: "object-center"
  }
];

export function SocialProof() {
  const [activeMetricTab, setActiveMetricTab] = useState("weight-loss");

  const scrollToPlans = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SECTION 4 – Social Proof Stats Bar */}
      <section className="bg-lp-green text-white py-16 md:py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-1xl font-serif leading-tight">
              Thousands have transformed with Lean Protocol.<br />
              <span className="text-lp-light-green italic">It's your turn now!</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 text-center border-y border-white/20 py-4">
            <div className="space-y-2 p-6 md:p-8 border-r border-b md:border-b-0 border-white/20 flex flex-col justify-center">
              <p className="text-4xl md:text-5xl font-bold">10k+</p>
              <p className="text-xs md:text-sm font-bold text-white/80 mt-2">GLP-1<br/>Transformations</p>
            </div>
            
            <div className="space-y-2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-center items-center">
              <div className="flex gap-1 text-lp-gold mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                ))}
              </div>
              <p className="text-base md:text-lg font-bold leading-tight text-white/90">4.8 Rating 1,200+<br/>Reviews</p>
            </div>
            
            <div className="space-y-2 p-6 md:p-8 border-r border-white/20 flex flex-col justify-center">
              <p className="text-4xl md:text-5xl font-bold">6.8<span className="text-2xl ml-1 font-normal opacity-80">Kg</span></p>
              <p className="text-xs md:text-sm font-bold text-white/80 mt-2">Avg Weight Lost</p>
            </div>
            
            <div className="space-y-2 p-6 md:p-8 flex flex-col justify-center">
              <p className="text-4xl md:text-5xl font-bold">2<span className="text-2xl ml-1 font-normal opacity-80">%</span></p>
              <p className="text-xs md:text-sm font-bold text-white/80 mt-2">Avg HbA1c Drop</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 – Testimonial / Transformation Card */}
      <section className="bg-lp-bg py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white flex flex-col md:flex-row transition-all hover:shadow-green-900/10 duration-500">
            {/* Image Side */}
            <div className="relative w-full md:w-[45%] aspect-square md:aspect-auto md:min-h-[600px] bg-gray-100">
              <Image 
                src="/lp-assets/atreyee-transformation.jpeg" 
                alt="Atreyee's Transformation"
                fill
                className="object-cover object-top"
                priority
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
            {/* Content Side */}
            <div className="w-full md:w-[55%] flex flex-col">
              {/* Primary Stat Banner */}
              <div className="bg-lp-green text-white p-8 md:p-12 flex flex-col justify-center space-y-2">
                <h3 className="font-serif text-3xl md:text-4xl leading-tight">Lost 6 Kgs<br/><span className="text-lp-light-green italic font-light">in 1 month</span></h3>
              </div>

              {/* Detailed Testimonial Block */}
              <div className="flex-grow bg-[#F3F7F3] p-8 md:p-12 flex flex-col justify-center space-y-10 relative">
                
                <div className="relative">
                  <svg className="absolute -top-6 -left-6 w-12 h-12 text-lp-green/10 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium relative z-10 pl-2">
                    I was about to buy a GLP 1 program that would cost me a bit less and thank god I did not. My wedding approached and I wanted to lose weight quickly. Thanks to their constant motivation and nudging I lost more than I thought I would.
                  </p>
                  <p className="mt-4 font-bold text-lp-dark pl-2">— Atreyee</p>
                </div>
                
                <div className="pt-4 flex justify-center md:justify-start">
                  <Button 
                    onClick={scrollToPlans}
                    className="w-full sm:w-auto h-auto min-h-[3.5rem] py-3 px-4 sm:px-8 bg-lp-dark hover:bg-black text-white rounded-full shadow-xl hover:shadow-2xl transition-all group whitespace-normal"
                  >
                    <span className="font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest leading-snug group-hover:scale-[1.02] transition-transform text-center inline-block">
                      Start Your Journey With Us
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 & 9 – Combined Metrics Grid (Image Cards) */}
      <section className="bg-lp-bg py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-2xl md:text-4xl text-lp-dark mb-4">The numbers speak for themselves</h2>
            <p className="text-gray-500 text-lg">Proven science, guaranteed results.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {metricsTabs.map(card => (
              <div key={card.id} className="relative aspect-[4/5] md:aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-md border border-gray-100">
                {card.id === "hba1c" ? (
                  <div className="absolute inset-0 bg-[#0c1810]">
                    {/* Blurred background image */}
                    <Image 
                      src={card.image} 
                      alt="" 
                      fill 
                      className="object-cover blur-3xl opacity-35 scale-125 pointer-events-none"
                    />
                    {/* Contained foreground image */}
                    <Image 
                      src={card.image} 
                      alt={card.title} 
                      fill 
                      className="object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-[1.03]" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : card.id === "guarantee" ? (
                  <div className="absolute inset-0 bg-[#0d1610]">
                    {/* Contained Guarantee Seal */}
                    <Image 
                      src={card.image} 
                      alt={card.title} 
                      fill 
                      className="object-contain p-10 md:p-12 transition-transform duration-700 group-hover:scale-105" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill 
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                      card.objectPosition === "object-top" ? "object-top" : "object-center"
                    }`} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {/* Dark Overlay for overall text legibility */}
                <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-500 group-hover:bg-black/60" />
                
                {/* Subtle Top & Bottom Gradients for edge contrast */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                
                {/* Top Left Text */}
                <div className="absolute top-0 left-0 p-5 md:p-8 w-full">
                  <h3 className="font-serif text-xl md:text-3xl lg:text-4xl text-white mb-2 leading-tight drop-shadow-md pr-4">{card.title}</h3>
                  <p className="hidden md:block text-white/90 text-xs md:text-sm font-medium drop-shadow-md max-w-[95%] md:max-w-[85%] leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
