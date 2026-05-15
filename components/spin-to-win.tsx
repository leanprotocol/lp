"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";

interface SpinToWinProps {
  enabled?: boolean;
}

export function SpinToWin({ enabled = true }: SpinToWinProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-trigger after 5 seconds on first visit
  useEffect(() => {
    if (!enabled || hasAutoOpened) return;

    const timer = setTimeout(() => {
      // Check if already opened manually or results achieved
      const status = localStorage.getItem("spin_to_win_status");
      if (!status) {
        setIsOpen(true);
        setHasAutoOpened(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [enabled, hasAutoOpened]);

  if (!enabled) return null;

  const handleSpin = async () => {
    if (name.length < 2) {
      alert("Please enter your name");
      return;
    }
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit number");
      return;
    }
    
    setIsSpinning(true);

    try {
      // Capture lead
      await fetch("/api/affiliate/lead-capture", {
        method: "POST",
        body: JSON.stringify({ name, mobileNumber: phone, source: 'LANDING_PAGE' }),
        headers: { "Content-Type": "application/json" }
      });

      // Simulate spin duration
      setTimeout(() => {
        setIsSpinning(false);
        const outcomes = ["35% OFF", "10% OFF", "FREE CONSULT", "20% OFF"];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setResult(randomOutcome);
        localStorage.setItem("spin_to_win_status", "completed");
        localStorage.setItem("spin_to_win_result", randomOutcome);
      }, 3000);
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-4 rounded-r-xl shadow-xl flex flex-col items-center gap-2 z-40 transition-transform hover:translate-x-1"
      >
        <Gift className="w-5 h-5 animate-bounce" />
        <span className="[writing-mode:vertical-lr] font-bold tracking-widest uppercase text-sm">Spin to Win</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full relative shadow-2xl overflow-hidden">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 relative z-10">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                <Gift className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="font-serif text-2xl text-[#1F302B]">Spin & Win!</h2>
              
              {!result ? (
                <>
                  <p className="text-sm text-gray-600">Spin the wheel and unlock exclusive discounts up to 50% OFF.</p>
                  
                  <div className="relative mx-auto w-44 h-44 my-4">
                    <div className={`w-full h-full rounded-full border-8 border-amber-400 flex items-center justify-center bg-amber-50 relative overflow-hidden ${isSpinning ? 'animate-spin' : ''}`}>
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[10px] font-bold text-amber-900">
                         <div className="border-r border-b border-amber-200 flex items-center justify-center bg-amber-100/50">10%</div>
                         <div className="border-b border-amber-200 flex items-center justify-center bg-white">35%</div>
                         <div className="border-r border-amber-200 flex items-center justify-center bg-white">FREE</div>
                         <div className="flex items-center justify-center bg-amber-100/50">20%</div>
                      </div>
                    </div>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-red-500 z-10" />
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-center font-medium focus:border-amber-400 focus:outline-none"
                    />
                    <input 
                      type="text"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-center font-medium focus:border-amber-400 focus:outline-none"
                    />
                    <Button 
                      onClick={handleSpin}
                      disabled={isSpinning || phone.length !== 10 || name.length < 2}
                      className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-lg disabled:opacity-50"
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN NOW'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8 space-y-4 animate-in zoom-in duration-300">
                  <h3 className="text-xl text-gray-600">Congratulations {name.split(' ')[0]}!</h3>
                  <div className="text-4xl font-bold text-emerald-600 font-serif">
                    {result}
                  </div>
                  <p className="text-sm text-gray-500 pt-4">Your discount has been applied to your number. Proceed to checkout to claim it.</p>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="w-full h-12 bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-xl mt-4"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
            
            {/* Background effects */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      )}
    </>
  );
}

