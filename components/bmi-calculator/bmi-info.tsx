"use client";

import { 
  Info, 
  AlertCircle, 
  Check, 
  ArrowRight,
  ClipboardList
} from "lucide-react";

export default function BMIInfo() {
  const categories = [
    { label: "Underweight", range: "Below 18.5" },
    { label: "Healthy Weight (Ideal)", range: "18.5 – 24.9" },
    { label: "Overweight", range: "25.0 – 29.9" },
    { label: "Obesity Class 1 (Low Risk)", range: "30.0 – 34.9" },
    { label: "Obesity Class 2 (Moderate Risk)", range: "35.0 – 39.9" },
    { label: "Obesity Class 3 (High Risk)", range: "40.0 or above" },
  ];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 border-t border-[#1F302B]/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1F302B] mb-6">
            BMI (Body Mass Index)
          </h2>
          <p className="text-[#57534E] text-lg leading-relaxed">
            BMI is a useful screening tool used by doctors and researchers, but it is just one piece of the puzzle. Understanding the context behind the number is key to better health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-[#1F302B]/10 pt-12">
            
            {/* left  */}
            <div className="lg:col-span-7 space-y-12">
                
                {/* 1. What is it? */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        What Does BMI Tell You?
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">BMI (Body Mass Index) measures the ratio of your weight to your height.</li>
                        <li className="pl-2">It’s often used by doctors, dieticians, fitness trainers, and health insurers to estimate whether your weight is healthy for your height.</li>
                        <li className="pl-2">A higher or lower BMI can suggest risk for conditions like heart disease, diabetes, or high blood pressure, which are common in India.</li>
                        <li className="pl-2">Many people use BMI to decide if they need to lose or gain weight for better health.</li>
                    </ul>
                </div>

                {/* 2. Limitations*/}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        Why BMI Isn’t Perfect
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">BMI was designed in the 19th century to study population health, not individual health.</li>
                         <li className="pl-2">It does not differentiate between fat and muscle, so an athlete and an unfit person of the same height and weight may have the same BMI.</li>
                          <li className="pl-2">Your body composition (ratio of muscle, fat, and bone) matters more than your weight alone.</li>
                           <li className="pl-2">In 2023, the American Medical Association advised that BMI should not be used alone to judge a person’s health.</li>
                    </ul>
                </div>

                {/* 3. What else to consider */}
   <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        What You Should Consider Along with BMI
                    </h3>
                    <p className="text-[#57534E]">Combine your BMI with other health checks such as:</p>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Blood sugar levels (for diabetes).</li>
                         <li className="pl-2">Cholesterol and blood pressure tests.</li>
                          <li className="pl-2">Physical fitness assessments.</li>
                    </ul>
                     <p className="text-[#57534E]">Consider your daily habits: diet, physical activity, sleep, and stress levels.</p>
                     <p className="text-[#57534E]">Indian diets and lifestyles vary widely, so individual assessment by a doctor or nutritionist is more accurate than BMI alone.</p>
                </div>

            </div>

            {/* right */}
            <div className="lg:col-span-5">
                <div className="border border-[#1F302B]/10 rounded-2xl bg-white">
                    
                    {/* Table Header */}
                    <div className="bg-[#1F302B] p-6 text-white rounded-t-2xl">
                        <h3 className="font-serif text-xl flex items-center gap-2">
                            Weight Status Categories (Adults)
                        </h3> </div>

                    {/* Table Body - Clean Rows */}
                    <div className="divide-y divide-[#1F302B]/10">
                        {categories.map((item, index) => (
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

                {/* Bottom Line */}
                <div className="space-y-4 mt-8 border-t-4 border-[#1F302B] pt-6">
                     <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">BMI is just one piece of the puzzle.</li>
                        <li className="pl-2">Use it as a starting point, not as a final judgment on your health.</li>
                        <li className="pl-2">For a true picture, get regular health check-ups and discuss your results with a qualified medical professional.</li>
                    </ul>
                </div>

                {/* formula  */}
                <div className="w-full bg-background rounded-2xl p-6 mt-10">
      <div>
        
        {/* Label */}
        <h3 className="font-bold text-[#1F302B] text-base mb-6">
          Formula:
        </h3>

        {/* The Equation */}
        <div className="flex items-center gap-4 text-[#1F302B] mb-8">
          <span className="font-serif text-base font-bold tracking-tight">
            BMI
          </span>

          <span className="font-serif text-2xl">=</span>

          <div className="flex flex-col items-center">
            <span className="font-serif text-base pb-1 border-b-2 border-[#1F302B]">
              weight (kg)
            </span>
            <span className="font-serif text-base pt-1">
              height (m)<sup className="text-sm">2</sup>
            </span>
          </div>
        </div>

        {/* The Example */}
        <div className="text-[#1F302B] text-base font-light border-t border-[#1F302B]/10 pt-8">
          <span className="font-medium mr-2">Example:</span>
          For 70 kg and 1.70 m, <br className="md:hidden" />
          <p className="font-serif">
            BMI = 70 / (1.70)² = <strong>24.2</strong>
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