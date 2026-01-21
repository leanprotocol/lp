"use client";

import { 
  Activity, 
  Scale, 
  Brain, 
  Dna, 
  Thermometer, 
  Stethoscope, 
  Pill, 
  Clock 
} from "lucide-react";

export default function WhyMedication() {
  const factors = [
    { label: "Insulin resistance", icon: Activity },
    { label: "Hormonal imbalance", icon: Scale },
    { label: "Chronic stress", icon: Brain },
    { label: "Genetics", icon: Dna },
    { label: "Hypothyroidism", icon: Thermometer },
    { label: "PCOS / PCOD", icon: Stethoscope },
    { label: "Side-effects of other medicines", icon: Pill },
    { label: "Metabolic changes over time", icon: Clock }
  ];

  return (
    <section className="bg-white py-12 md:py-18 px-4 md:px-8 border-y border-[#1F302B]/5">
      <div className="max-w-[84rem] mx-auto">
        
        <div className="text-center mb-10">
          <p className="text-black text-2xl font-serif  leading-relaxed max-w-2xl mx-auto">
            For many people, excess weight isn't about willpower. <br className="hidden md:block" />
            <span className="border-b-2 border-accent2">It is influenced by complex internal factors like:</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border border-[#E5E5E5] rounded-2xl overflow-hidden mb-10">
            {factors.map((item, index) => (
            <div 
                key={index} 
                className=" border border-[#E5E5E5] px-1 md:px-2 py-1 md:py-4 flex items-center gap-2"
            >
                <div className="md:w-11 md:h-11 w-9 h-9 flex items-center justify-center text-[#5B746F]">
                    <item.icon className="md:w-7 md:h-7 w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[#191919] text-sm md:text-[17px] font-medium">
                    {item.label}
                </span>
            </div>
            ))}
        </div>

        <div className="bg-[#1F302B] max-w-4xl mx-auto rounded-[2rem] p-6 md:p-10 md:px-12 text-white text-center relative overflow-hidden">
            
            <div className="relative z-10">
                <p className="font-serif text-2xl md:text-3xl leading-relaxed text-white mb-4">
                  "When weight gain is biologically driven, medication is <span className="opacity-50 line-through decoration-white/80 decoration-1">not cheating</span>."
                </p>
                
                   <p className="font-serif text-2xl md:text-3xl text-accent2">
                      It’s healthcare.
                   </p>
            </div>
        </div>

      </div>
    </section>
  );
}