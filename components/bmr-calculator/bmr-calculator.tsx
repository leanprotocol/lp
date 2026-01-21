"use client";

import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function BMRCalculator() {
  // RESTORED DEFAULT VALUES HERE
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<string>("70");
  const [feet, setFeet] = useState<string>("5");
  const [inches, setInches] = useState<string>("10");
  const [age, setAge] = useState<string>("30");
  const [bmr, setBmr] = useState<number | null>(null);

  useEffect(() => {
    calculateBMR();
  }, [weight, feet, inches, age, gender]);

  const calculateBMR = () => {
    const w = parseFloat(weight); // Weight in kg
    const f = parseFloat(feet);
    const i = parseFloat(inches);
    const a = parseFloat(age);

    if (w > 0 && f >= 0 && a > 0) {
      // Convert Height to cm for the formula
      // (feet * 12 + inches) * 2.54
      const heightInCm = ((f * 12) + (i || 0)) * 2.54;

      let bmrValue = 0;

      // Formula (Men): 10 * weight + 6.25 * height - 5 * age + 5
      if (gender === "male") {
        bmrValue = (10 * w) + (6.25 * heightInCm) - (5 * a) + 5;
      } 
      // Formula (Women): 10 * weight + 6.25 * height - 5 * age - 161
      else {
        bmrValue = (10 * w) + (6.25 * heightInCm) - (5 * a) - 161;
      }

      setBmr(Math.round(bmrValue));
    } else {
      setBmr(null);
    }
  };

  return (
    <section className="w-full bg-[#F6F1EE] py-24 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* --- LEFT: Inputs --- */}
          <div className="w-full lg:w-5/12">
            <h1 className="font-serif text-4xl md:text-5xl text-[#1F302B] mb-2">
              BMR Calculator
            </h1>
            <p className="text-[#57534E] text-base font-light mb-10">
              Estimate the calories your body burns at rest using your gender, age, height, and weight.
            </p>

            <div className="space-y-6">
              
              {/* Gender Selection */}
              <div className="flex p-0.5 bg-accent2/20 rounded-full w-fit">
                <button
                  onClick={() => setGender("male")}
                  className={`px-4 py-2 rounded-full cursor-pointer text-xs tracking-wider transition-all ${
                    gender === "male"
                      ? "bg-dark text-white shadow-md"
                      : "text-dark/90 hover:bg-white/60"
                  }`}
                >
                  Men
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`px-4 py-2 rounded-full cursor-pointer text-xs tracking-wider transition-all ${
                    gender === "female"
                      ? "bg-dark text-white shadow-md"
                      : "text-dark/90 hover:bg-white/60"
                  }`}
                >
                  Women
                </button>
              </div>

              {/* Age and Weight Row (Side by Side) */}
              <div className="flex gap-4 md:gap-8">
                
                {/* Age Field */}
                <div className="relative w-1/2 group">
                  <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      yrs
                    </span>
                  </div>
                </div>

                {/* Weight Field */}
                <div className="relative w-1/2 group">
                  <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      kg
                    </span>
                  </div>
                </div>

              </div>

              {/* Height Fields */}
              <div className="relative group">
                <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                  Height
                </label>
                <div className="flex gap-4 md:gap-8">
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      ft
                    </span>
                  </div>
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                      in
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => {
                    setWeight("");
                    setFeet("");
                    setInches("");
                    setAge("");
                  }}
                  className="flex items-center gap-2 text-xs text-black/60 uppercase tracking-wider hover:text-black/90 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset values
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Result Circle --- */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="relative w-[360px] h-[360px] rounded-full bg-[#1F302B] flex flex-col justify-center items-center text-white p-8 shadow-2xl shadow-[#1F302B]/20 ring-1 ring-[#1F302B]/5">
              
              {bmr ? (
                <div className="text-center w-full animate-in fade-in zoom-in duration-500">
                  <span className="text-[#D6F0E6]/50 uppercase tracking-[0.2em] text-[10px] font-bold block mb-4">
                    {/* Daily Calories */}
                  </span>
                  
                  {/* BMR Value */}
                  <div className="font-serif text-8xl text-white leading-none tracking-tight mb-2">
                    {bmr.toLocaleString()}
                  </div>
                  
                  <div className="text-xl font-serif text-[#D6F0E6] opacity-80 mb-8">
                    calories/day
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