"use client";

import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function WaistToHipCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState<string>("36"); // Default changed to reasonable inch value
  const [hip, setHip] = useState<string>("44");     // Default changed to reasonable inch value
  const [ratio, setRatio] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Moderate" | "High" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    calculateWHR();
  }, [waist, hip, gender]);

  const calculateWHR = () => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);

    if (w > 0 && h > 0) {
      // Formula: Waist / Hip (Unit independent as long as units match)
      const result = w / h;
      const formattedResult = parseFloat(result.toFixed(2));
      setRatio(formattedResult);

      let currentRisk: "Low" | "Moderate" | "High" = "Low";

      // Determine Risk based on expanded guidelines
      if (gender === "male") {
        if (formattedResult >= 1.0) {
          currentRisk = "High";
        } else if (formattedResult >= 0.90) {
          currentRisk = "Moderate";
        } else {
          currentRisk = "Low";
        }
      } else {
        // Female
        if (formattedResult >= 0.85) {
          currentRisk = "High";
        } else if (formattedResult >= 0.80) {
          currentRisk = "Moderate";
        } else {
          currentRisk = "Low";
        }
      }

      setRiskLevel(currentRisk);

      // Set specific message
      if (currentRisk === "High") {
        setMessage("Your waist-to-hip ratio is in the high risk category.");
      } else if (currentRisk === "Moderate") {
        setMessage("Your waist-to-hip ratio is in the moderate risk category.");
      } else {
        setMessage("Your waist-to-hip ratio is in the low health risk category.");
      }

    } else {
      setRatio(null);
      setRiskLevel(null);
      setMessage(null);
    }
  };

  // Helper to get badge styles based on risk
  const getBadgeStyle = () => {
    switch (riskLevel) {
      case "High":
        return "bg-orange-500/20 text-orange-200 border border-orange-500/30";
      case "Moderate":
        return "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30";
      default:
        return "bg-[#D6F0E6]/10 text-[#D6F0E6] border border-[#D6F0E6]/20";
    }
  };

  return (
    <section className="w-full bg-[#F6F1EE] py-24 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* --- LEFT: Inputs --- */}
          <div className="w-full lg:w-5/12">
            <h1 className="font-serif text-4xl md:text-5xl text-[#1F302B] mb-2">
              Waist-to-Hip Ratio
            </h1>
            <p className="text-[#57534E] text-base font-light mb-10">
              Calculate your fat distribution to assess health risks according to World Health Organization standards.
            </p>

            <div className="space-y-6">
              
              {/* Gender Selection */}
              <div className="flex p-0.5 bg-accent2/20 rounded-full w-fit">
                <button
                  onClick={() => setGender("male")}
                  className={`px-4 py-2 rounded-full cursor-pointer text-xs tracking-wider transition-all ${
                    gender === "male"
                      ? "bg-dark text-white shadow-md"
                      : "text-dark/90 hover:bg-gray-50"
                  }`}
                >
                  Men
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`px-4 py-2 rounded-full cursor-pointer text-xs tracking-wider transition-all ${
                    gender === "female"
                      ? "bg-dark text-white shadow-md"
                      : "text-dark/90 hover:bg-gray-50"
                  }`}
                >
                  Women
                </button>
              </div>

              {/* Waist Field - UPDATED TO INCHES */}
              <div className="relative group">
                <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                  Waist  (in inches)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                    in
                  </span>
                </div>
              </div>

              {/* Hip Field - UPDATED TO INCHES */}
              <div className="relative group">
                <label className="block text-xs font-bold text-[#5B746F] uppercase tracking-[0.1em] mb-2">
                  Hip  (in inches)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full h-14 pl-4 pr-12 bg-white rounded-xl text-xl font-serif text-[#1F302B] focus:outline-none focus:ring-2 focus:ring-[#1F302B]/10 transition-all placeholder:text-[#1F302B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <span className="absolute right-4 bottom-4 text-sm text-[#1F302B]/30 font-serif">
                    in
                  </span>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => {
                    setWaist("");
                    setHip("");
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
            <div className="relative w-[400px] h-[400px] rounded-full bg-[#1F302B] flex flex-col justify-center items-center text-white p-8 shadow-2xl shadow-[#1F302B]/20 ring-1 ring-[#1F302B]/5">
              
              {ratio ? (
                <div className="text-center w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                  <span className="text-[#D6F0E6]/50 uppercase tracking-[0.2em] text-[10px] font-bold block mb-2">
                    {/* Waist-to-Hip Ratio */}
                  </span>
                  
                  {/* WHR Value */}
                  <div className="font-serif text-8xl text-white leading-none tracking-tight mb-4">
                    {ratio}
                  </div>

                  {/* Dynamic Risk Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm tracking-wider mb-6 transition-colors duration-500 ${getBadgeStyle()}`}>
                    {riskLevel} Risk
                  </div>

                  
                  {/* Specific User Message */}
                  <p className="text-sm leading-relaxed text-[#D6F0E6] max-w-[260px] animate-in slide-in-from-bottom-2 fade-in duration-700">
                    {message}
                  </p>
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