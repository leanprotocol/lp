"use client";

import { 
  Ruler, 
  HeartPulse, 
  Scale, 
  AlertTriangle,
  ClipboardList,
  GitCompare
} from "lucide-react";

export default function WaistToHipInfo() {
  const riskData = [
    { label: "Men: Low Risk", range: "< 0.90" },
    { label: "Men: Increased Risk", range: "≥ 0.90" },
    { label: "Women: Low Risk", range: "< 0.85" },
    { label: "Women: Increased Risk", range: "≥ 0.85" },
  ];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 border-t border-[#1F302B]/10">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="mb-12 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1F302B] mb-6">
            WHR (Waist-to-Height Ratio)
          </h2>
          <p className="text-[#57534E] text-lg leading-relaxed">
            Most people know about their weight and BMI (Body Mass Index) when tracking fitness or weight loss.
            <br />
            But do you know your Waist-to-Hip Ratio (WHR)? It’s another useful measure of your health.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-[#1F302B]/10 pt-12">
            
            {/* left */}
            <div className="lg:col-span-7 space-y-12">
                
                {/* 1. What is it? */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        What is Waist-to-Hip Ratio (WHR)?
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">WHR shows how your body fat is distributed – especially around your waist and hips.</li>
                        <li className="pl-2">It’s calculated as:  
Waist measurement ÷ Hip measurement (use the same unit like cm or inches).
</li>
                        <li className="pl-2">Example: If your waist is 80 cm and hips are 90 cm → WHR = 80/90 = 0.89.
Why is WHR important?
</li>
                    </ul>
                </div>

                {/* 2. Importance (Cream Box) */}
              <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        WHR helps understand your risk of lifestyle diseases like:
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Heart disease</li>
                       <li className="pl-2">Diabetes (Type 2)</li>
                       <li className="pl-2">High cholesterol</li>
                       <li className="pl-2">High blood pressure</li>
                    </ul>
                    <p className="text-[#57534E]">It gives a clearer picture than BMI because it shows where fat is stored – especially around the belly.</p>
                    <p className="text-[#57534E]">Having more belly fat (apple-shaped body) increases risk, even if your BMI is normal.</p>
                    <p className="text-[#57534E]">People with more hip and thigh fat (pear-shaped body) usually have a healthier WHR.</p>
                </div>

                {/* 3. WHR vs BMI */}
                             <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        WHR vs BMI 
                    </h3>
                    <p className="text-[#57534E]">BMI only compares weight and height — it doesn’t consider muscle or fat distribution.</p>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                    For example:
                        <li className="pl-2">A muscular person (like a sportsperson) might have a high BMI but low body fat.</li>
                       <li className="pl-2">A person with normal BMI but belly fat could still be at risk for diseases.</li>
                    </ul>
                    <p className="text-[#57534E]">WHR better indicates metabolic health and fat around vital organs.</p>
                </div>

                                {/* 4. How to Check Your WHR */}
                             <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        How to Check Your WHR
                    </h3>
                    <p className="text-[#57534E]">BMI only compares weight and height — it doesn’t consider muscle or fat distribution.</p>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                    For example:
                        <li className="pl-2">Measure your waist and hips with a measuring tape.</li>
                        <li className="pl-2">Use an online Waist-to-Hip Ratio calculator (like the Lean Protocol or other health platforms).</li>
                        <li className="pl-2">Enter your details and get insights about your health status.</li>
                        <li className="pl-2">Remember: This is not medical advice. For specific concerns, consult your doctor or nutritionist.</li>
                    </ul>
                </div>

            </div>

            {/* right */}
            <div className="lg:col-span-5">
                <div className="border border-[#1F302B]/10 bg-white rounded-2xl">
                    
                    {/* Table Header */}
                    <div className="bg-[#1F302B] rounded-t-2xl p-6 text-white">
                        <h3 className="font-serif text-xl flex items-center gap-2">
                          Lower-Risk Waist-Hip Ratios Based on WHO Guidelines
                        </h3></div>

                    {/* Table Body - Clean Rows */}
                    <div className="divide-y divide-[#1F302B]/10">
                        {riskData.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 transition-colors">
                                <span className="font-bold text-[#1F302B] text-sm mb-1 sm:mb-0">
                                    {item.label}
                                </span>
                                <span className="font-mono text-[#5B746F] text-sm bg-[#1F302B]/5 px-2 py-1 rounded">
                                    {item.range}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Line Box */}
                <div className="mt-8 border-t-4 border-[#1F302B] pt-6">
                    <p className="text-[#57534E] mb-6">According to the World Health Organization (WHO), waist-to-hip ratios of 0.85 or higher in women and 0.90 or higher in men signify abdominal obesity and a “substantially elevated” risk of metabolic complications. </p>
                      <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2"><b>Increased Risk:</b> A ratio over these numbers indicates abdominal obesity (more fat around the waist/belly), associated with higher risks of cardiovascular disease, type 2 diabetes, and other metabolic problems.</li>
                        <li className="pl-2"><b>Significance:</b> A higher WHR suggests "apple-shaped" fat (around organs), which is more dangerous than "pear-shaped" fat (around hips/thighs)</li>
                    </ul>
                </div>


                {/* formula  */}
                <div className="w-full bg-background rounded-2xl p-6 mt-10">
      <div>
        
        <h3 className="font-bold text-[#1F302B] text-base mb-6">
          Formula:
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-4 text-[#1F302B] mb-8">
          <span className="font-serif text-base font-bold tracking-tight whitespace-nowrap">
            WHR
          </span>

          <span className="font-serif text-base hidden md:block">=</span>

          <div className="flex flex-col items-center">
            <span className="font-serif text-base pb-1 border-b-2 border-[#1F302B] text-center">
              waist circumference (cm)
            </span>
            <span className="font-serif text-base pt-1 text-center">
              hip circumference (cm)
            </span>
          </div>
        </div>

        <div className="text-[#1F302B] text-base font-light border-t border-[#1F302B]/10 pt-8">
          <span className="font-medium mr-2">Example:</span>
          Waist 92 cm, hips 112 cm <br className="md:hidden" />
          <p className="font-serif mt-1">
             = 92 / 112 = <strong>0.82</strong>
          </p>
        </div>

      </div>
    </div>
            </div>

        </div>
      </div>
    </section>
  );
}