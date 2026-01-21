"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Stethoscope, FileHeart } from "lucide-react";
import Image from "next/image";
import OTPModal from "./otp-modal";

export default function GetStartedPage() {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNextScreen, setShowNextScreen] = useState(false);

  const handleQuizClick = () => {
    setShowOTPModal(true);
  };

  const handleOTPNext = () => {
    setShowOTPModal(false);
    // setShowNextScreen(true); // Enable when ready
  };

  const benefits = [
    {
      icon: ClipboardCheck,
      title: "Check if you qualify for this program",
    },
    {
      icon: Stethoscope,
      title: "An eligibility quiz and advanced blood tests determine what treatment is right for you.",
    },
  ];

  return (
    <section className="relative bg-white min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row -mb-1 -mt-21">
      <div className="relative w-full lg:w-[45%] min-h-[55vh] lg:min-h-[calc(100vh-5rem)] bg-[#F0F2E9] order-1 lg:order-1 overflow-hidden flex-1">
        <Image
          src="/get-started.png"
          alt="Medical consultation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/20 mix-blend-multiply" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 bg-gradient-to-t from-black/80 via-black/70 to-black/0 text-white">
          <p className="font-serif hidden lg:block text-2xl leading-tight opacity-95">
            Check your eligibility for a personalized plan.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[55%] order-2 lg:order-2 flex flex-col justify-center py-16 px-4 md:px-16 xl:px-24 bg-white flex-1 min-h-[50vh] lg:min-h-[calc(100vh-5rem)]">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <div className="mb-12">
            <h1 className="heading">
              Let us check your
              <span className="italic opacity-70"> GLP 1 based treatment Eligibility</span>
            </h1>
            {/* <p className="sub-heading text-dark/60">
              Get the home checkup done to identify the foundational causes of weight gain and the right Supplements and GLP 1 plan that makes the journey quicker.
            </p> */}
          </div>

          <div className="space-y-4 mb-14 max-w-xl">
            {benefits.map((item, index) => (
              <div key={index} className="flex gap-4 items-center group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#F0F2E9] flex items-center justify-center text-dark group-hover:bg-dark group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-serif text-base text-dark">{item.title}</h3>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center border-t border-[#191919]/10 pt-10">
            <Link href="#" onClick={handleQuizClick} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto cursor-pointer bg-dark hover:bg-dark/90 text-white rounded-full px-10 py-4 text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                Begin the 2 mins Eligibility Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onNext={handleOTPNext}
      />
    </section>
  );
}
