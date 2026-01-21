"use client";

import { 
  Info, 
  Flame, 
  Activity, 
  Calculator,
  AlertTriangle,
  ClipboardList
} from "lucide-react";

export default function BMRInfo() {
  const formulas = [
    { label: "Indirect Calorimetry", type: "Lab Test (Most Accurate)" },
    { label: "Mifflin-St Jeor", type: "Formula (Most Popular)" },
    { label: "Katch-McArdle", type: "Formula (Uses Lean Mass)" },
    { label: "Harris-Benedict", type: "Formula (Classic)" },
  ];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 border-t border-[#1F302B]/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1F302B] mb-6">
            BMR (Basal Metabolic Rate)
          </h2>
          <p className="text-[#57534E] text-lg leading-relaxed">
            In today’s fitness world, term like BMR is common. Knowing your BMR helps you understand how many calories your body needs just to survive, even when you are not doing any physical activity.
          </p>
        </div>

        <div className="border-t border-[#1F302B]/10 pt-12">
            
            <div className="lg:col-span-7 space-y-12">
                
                {/* 1. understanding */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                        Understanding BMR and How It Helps You
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">In today’s fitness world, people often talk about metabolism — especially when trying to lose or manage weight.</li>
                        <li className="pl-2">Common terms include BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), and RMR (Resting Metabolic Rate).</li>
                        <li className="pl-2">Knowing your BMR helps you understand how many calories your body needs just to survive — even when you’re not doing any physical activity.</li>
                        
                    </ul>
                </div>

                {/* 2. what is BMR */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                       What Exactly Is BMR?
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">BMR stands for Basal Metabolic Rate.</li>
                        <li className="pl-2">It’s the number of calories your body burns to perform basic functions like breathing, maintaining body temperature, and pumping blood — all while you’re at complete rest.</li>
                        <li className="pl-2">Think of it as the “idle mode” of your body’s engine — just enough energy to keep your system running.</li>
                        <li className="pl-2">BMR usually makes up 60–70% of your total daily calorie burn.</li>
                        <li className="pl-2">For most people, this equals about 1000–2000 kilocalories per day, depending on factors like age, gender, and body composition.</li>
                        <li className="pl-2">BMIB</li>
                    </ul>
                </div>

                {/* 3.  */}
                 <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                      How BMR and Body Composition Are Linked
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Muscle burns more calories than fat, even when you’re resting.</li>
                        <li className="pl-2">So, more lean muscle = higher BMR.</li>
                        <li className="pl-2">People with more muscle generally have better glucose metabolism (meaning better blood sugar control).</li>
                        <li className="pl-2">A lower BMR is often linked to higher body fat and a greater risk of insulin resistance or Type 2 diabetes, which are common health concerns in India today.</li>
                    </ul>
                </div>

                {/*  Is Higher Always Good? */}
                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                      Is a Higher BMR Always Good?
                    </h3>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Not necessarily!</li>
                        <li className="pl-2">A higher BMR can also be a sign of inflammation, thyroid problems (like hyperthyroidism), or other immune-related conditions.</li>
                        <li className="pl-2">So while a strong metabolism is helpful, unusually high readings should be checked by a doctor.</li>
                    </ul>
                </div>

{/* how to calculate  */}
                     <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#1F302B] flex items-center gap-2">
                      How to Calculate BMR
                    </h3>
                    <p className="text-[#57534E]">The most accurate method is indirect calorimetry, where oxygen and carbon dioxide in your breath are measured to estimate energy use.</p>
                    <p className="text-[#57534E]">However, this test is available mostly in advanced labs or hospitals.</p>
                    <div>
                        <p className="text-[#57534E] mb-2">For home or gym use, there are popular BMR calculation formulas, such as:</p>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Mifflin-St Jeor Equation</li>
                        <li className="pl-2">Katch-McArdle Formula</li>
                        <li className="pl-2">Harris-Benedict Formula</li>
                    </ul>
                    </div>
                    <p className="text-[#57534E]">These formulas use your height, weight, age, and gender to estimate your daily calorie needs.</p>
                    <p className="text-[#57534E]">Once you know your BMR, you can plan your diet and exercise routine more effectively — whether your goal is weight loss, maintenance, or muscle gain.</p>
                </div>

            </div>


        </div>

        <div className="border-t border-[#1F302B]/10 pt-10 mt-8">
          <div className="space-y-4">
            <p className="text-[#57534E]"><b>"Ideal" BMR</b>: There's no single ideal BMR; it varies by age, gender, genetics, muscle mass, and body size.</p>
                    <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                        <li className="pl-2">Averages: Average BMRs are around 1400 calories for women and 1700 for men, but these are just estimates, say Cleveland Clinic and Integris Health.</li>
                    </ul>
                </div>
        </div>


     {/* formula  */}
        <div className="w-full bg-background rounded-2xl p-6 mt-10">
      <div className="">
        
        {/* Label */}
        <h3 className="font-bold text-[#1F302B] text-base mb-8">
          Formula:
        </h3>

        {/* The Equations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 text-[#1F302B]">
            
            {/* Men */}
            <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5B746F] mb-3">
                    For Men
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-serif text-base leading-relaxed">
                    <span className="font-bold tracking-tight">BMR</span>
                    <span>=</span>
                    <span>10 × weight (kg)</span>
                    <span>+</span>
                    <span>6.25 × height (cm)</span>
                    <span>-</span>
                    <span>5 × age</span>
                    <span>+</span>
                    <strong>5</strong>
                </div>
            </div>

            {/* Women */}
            <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5B746F] mb-3">
                    For Women
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-serif text-base leading-relaxed">
                    <span className="font-bold tracking-tight">BMR</span>
                    <span>=</span>
                    <span>10 × weight (kg)</span>
                    <span>+</span>
                    <span>6.25 × height (cm)</span>
                    <span>-</span>
                    <span>5 × age</span>
                    <span>-</span>
                    <strong>161</strong>
                </div>
            </div>

        </div>

        {/* The Example */}
        <div className="text-[#1F302B] text-base font-light border-t border-[#1F302B]/10 pt-8">
          <span className="font-medium mr-2">Example:</span>
          <span className="text-base text-[#57534E] block md:inline mb-2 md:mb-0">
            (Man, 30 years, 70 kg, 170 cm)
          </span>
          <div className="font-serif mt-2 text-base">
             BMR = 10(70) + 6.25(170) - 5(30) + 5 = <strong>1,660 kcal/day</strong>
          </div>
        </div>

      </div>
    </div>
      </div>
    </section>
  );
}