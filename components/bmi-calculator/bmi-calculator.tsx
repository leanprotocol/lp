"use client";

import { useState, useEffect } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

export default function BMICalculator() {
  const [weight, setWeight] = useState<string>("70");
  const [feet, setFeet] = useState<string>("5");
  const [inches, setInches] = useState<string>("7");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<{ label: string } | null>(null);

  const CATEGORIES = [
    { label: "Underweight", min: 0, max: 18.5 },
    { label: "Healthy Weight", min: 18.5, max: 24.9 },
    { label: "Overweight", min: 25.0, max: 29.9 },
    { label: "Obesity (Class 1)", min: 30.0, max: 34.9 },
    { label: "Obesity (Class 2)", min: 35.0, max: 39.9 },
    { label: "Obesity (Class 3)", min: 40.0, max: 100 },
  ];

  useEffect(() => {
    calculateBMI();
  }, [weight, feet, inches]);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const f = parseFloat(feet);
    const i = parseFloat(inches);

    if (w > 0 && f >= 0) {
      const totalInches = (f * 12) + (i || 0);
      const heightInMeters = totalInches * 0.0254;

      if (heightInMeters > 0) {
        const bmiValue = w / (heightInMeters * heightInMeters);
        setBmi(parseFloat(bmiValue.toFixed(1)));
        determineCategory(bmiValue);
      }
    } else {
      setBmi(null);
      setCategory(null);
    }
  };

  const determineCategory = (value: number) => {
    let cat = CATEGORIES.find((c) => value >= c.min && value < c.max);
    if (!cat && value >= 40) cat = CATEGORIES[5];
    if (cat) {
      setCategory({ label: cat.label });
    }
  };

  const getMarkerPosition = () => {
    if (!bmi) return 0;
    const minBMI = 10;
    const maxBMI = 45;
    const percent = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  return (
    <section className="w-full bg-[#F6F1EE] py-24 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* LEFT*/}
          <div className="w-full lg:w-5/10">
            <h1 className="font-serif text-4xl md:text-5xl text-[#1F302B] mb-2">
              BMI Calculator
            </h1>
            <p className="text-[#57534E] text-base font-light mb-12">
              Tells you whether your weight is in a healthy range for your height. It’s a quick indicator for underweight, healthy, overweight, or obese categories.
            </p>

            <div className="space-y-8">
              {/* Weight Field */}
              <div className="relative group">
                <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()} // Prevents scroll change
                    className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[#1F302B]/20"
                    placeholder="0"
                  />
                  <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                    kg
                  </span>
                </div>
              </div>

              {/* Height Fields */}
              <div className="relative group">
                <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                  Height
                </label>
                <div className="flex gap-8">
                  {/* Feet */}
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()} // Prevents scroll change
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[#1F302B]/20"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      ft
                    </span>
                  </div>
                  {/* Inches */}
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()} // Prevents scroll change
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[#1F302B]/20"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      in
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setWeight("");
                    setFeet("");
                    setInches("");
                  }}
                  className="flex items-center gap-2 text-xs text-black/60 uppercase tracking-wider hover:text-black/90 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset values
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="relative w-[360px] h-[360px] rounded-full bg-[#1F302B] flex flex-col justify-center items-center text-white p-8 shadow-2xl shadow-[#1F302B]/20 ring-1 ring-[#1F302B]/5">
              
              {/* Inner content */}
              {bmi ? (
                <div className="text-center w-full animate-in fade-in zoom-in duration-500">
                  <span className="text-[#D6F0E6]/50 uppercase tracking-[0.2em] text-[10px] font-bold block mb-2">
                    {/* BMI */}
                  </span>
                  <div className="font-serif text-8xl text-white leading-none tracking-tight mb-4">
                    {bmi}
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm tracking-wider mb-6 bg-white/10 backdrop-blur-md border border-white/5">
                    <span className="text-sm text-[#D6F0E6]">
                      {category?.label}
                    </span>
                  </div>

                  <div className="w-[200px] mx-auto relative">
                    <div className="w-full h-1.5 rounded-full flex overflow-hidden bg-[#1F302B]">
                      <div className="h-full w-[20%] bg-[#D6F0E6] opacity-30"></div>
                      <div className="h-full w-[15%] bg-[#D6F0E6] opacity-100"></div>
                      <div className="h-full w-[12%] bg-[#D6F0E6] opacity-60"></div>
                      <div className="h-full w-[12%] bg-[#D6F0E6] opacity-40"></div>
                      <div className="h-full flex-1 bg-[#D6F0E6] opacity-20"></div>
                    </div>

                    {/* Marker */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-[#1F302B] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all duration-700 ease-out"
                        style={{ left: `calc(${getMarkerPosition()}% - 6px)` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-30">
                  <p className="font-serif text-2xl leading-snug">
                    Enter details <br /> to calculate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}