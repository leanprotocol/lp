"use client";

import { RefreshCcw, Calendar, Mail, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <section className="bg-[#F6F1EE] min-h-screen py-10 md:py-14 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Document Header --- */}
        <div className="bg-[#1F302B] text-white rounded-t-2xl rounded-t-[2rem] p-8 md:p-12 border-b border-white/10">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
            Lean Protocol Results Promise
          </h1>
          <div className="flex items-center gap-2 text-[#D6F0E6]/80 font-mono text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: 15 January 2026</span>
          </div>
        </div>

        {/* --- Document Body --- */}
        <div className="bg-white rounded-b-2xl rounded-b-[2rem] border border-[#1F302B]/5 overflow-hidden">
          
          <div className="p-4 md:p-12 space-y-10">

            {/* Introduction */}
            <div className="prose max-w-none">
              <p className="text-[#57534E] leading-relaxed mb-4">
                Lean Protocol is built on medically supervised, evidence-based weight loss. We stand by our process and our outcomes.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                If you meet the eligibility and adherence criteria below and do not achieve the promised result, you may be eligible for a refund review under this policy.
              </p>
            </div>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Promise */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">The Results We Promise</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Lose <b>at least 6% of your starting body weight within the first 3 months</b> of your Lean Protocol program.
              </p>
              <p className="text-[#57534E] leading-relaxed mb-4">This promise applies to both <b>3-month and 6-month GLP-1 based programs.</b></p>
              <p className="text-[#57534E] leading-relaxed">The promise does not apply to 1-month or short-duration programs.</p>
            </section>

            {/* Who Applies */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-6">Who This Promise Applies To</h2>
              <div className="">
                  <p className="text-[#57534E] mb-4">This Results Promise is applicable only if <b>all</b> of the following conditions are met:</p>
                  <ul className="space-y-1 mb-4 text-[#57534E] pl-2 list-decimal">
                    <li className="ml-3">
                        You are a <b>new Lean Protocol customer</b> enrolling for the first time.
                    </li>
                    <li className="ml-3">
                        Your <b>starting BMI is 30 or higher</b>, as assessed during onboarding and confirmed by a Lean Protocol doctor.
                    </li>
                    <li className="ml-3">
                        You are enrolled in a <b>doctor-approved GLP-1 based therapy program</b> with Lean Protocol.
                    </li>
                  </ul>
              </div>
            </section>

            {/* Adherence Requirements */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4 flex items-center gap-3">
                Adherence Requirements
                <span className="text-xs font-sans font-bold bg-[#F6F1EE] text-[#5B746F] px-2 py-1 rounded border border-[#5B746F]/20 uppercase tracking-wide">Mandatory</span>
              </h2>
              <p className="text-[#57534E] mb-4">Eligibility for the Results Promise requires good-faith participation and adherence to the program.</p>

              <div className="space-y-5">
                  <section>
                    <h3 className="font-bold text-[#1F302B] mb-1">Weight Tracking</h3>
                    <p className="text-[#57534E]">Your body weight must be recorded using the Lean Protocol smart scale in <b>at least 75% of the weeks</b> during your program.(Eg 9 of 12 weeks) <br /> 
                    The final weight must be recorded <b>within 15 days</b> of the completion of the 3-month results window.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-1">Medication Adherence</h3>
                    <p className="text-[#57534E]">You must take prescribed medication strictly as directed by your Lean Protocol doctor, unless medically advised otherwise.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-1">Consultation Attendance</h3>
                    <p className="text-[#57534E]">Doctor consultations must be attended <b>at least once per month</b> throughout the program duration. <br />
                    Nutritionist consultations must be attended <b>at least twice per month</b> throughout the program duration.
</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-1">Meal Logging</h3>
                    <p className="text-[#57534E]">You must log meals or share meal details with your assigned nutritionist for <b>at least 4 days per week</b>, in <b>at least 75% of the weeks</b> of your program.</p>
                </section>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Results Measurement */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">How Results Are Measured</h2>
              <ul className="space-y-1 mb-4 text-[#57534E] pl-2 list-disc">
                <li className="ml-3">
                    Your <b>starting weight</b> is the first valid smart-scale reading recorded during onboarding
                </li>
                <li className="ml-3">
                    Your <b>final weight</b> is the last valid smart-scale reading recorded within the allowed completion window.
                </li>
                <li className="ml-3">
                   Percentage weight loss is calculated using these two measurements only.
                </li>
                <li className="ml-3">
                   Manual, altered, or manipulated data may invalidate eligibility.
                </li>
              </ul>
            </section>

            {/* Calculation */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Refund Eligibility & Calculation</h2>
              <p className="text-[#57534E] mb-4">
                If you meet <b>all eligibility and adherence criteria</b> and do not achieve at least <b>6% weight loss within 3 months</b>, your case will be reviewed for a refund.
                <br />
                Approved refunds are calculated on a <b>pro-rata basis</b>, considering:
              </p>
              <ul className="space-y-1 mb-4 text-[#57534E] pl-2 list-disc">
                <li className="ml-3">The remaining unused portion of the program</li>
                <li className="ml-3">Services already delivered (consultations, coaching, diagnostics)</li>
                <li className="ml-3">Medications already dispensed or delivered</li>
                <li className="ml-3">Any complimentary kits or program resources already provided</li>
              </ul>
              <p className="text-[#57534E] mt-4 text-sm italic">
              The final refund amount may be <b>partial</b>, and Lean Protocol reserves the right to deduct the value of services and products already consumed.
              </p>
            </section>

            {/* Medical Override - Warning Block */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Medical Safety Overrides</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">Your health always comes first.</p>
              <p className="text-[#57534E] leading-relaxed mb-4">If the Lean Protocol doctor determines that GLP-1 therapy must be discontinued due to <b>clinically significant side effects or safety concerns</b>, your eligibility for a refund will be reviewed separately under medical grounds.</p>
              <p className="text-[#57534E] leading-relaxed mb-4">In such cases: <br />
- Medicines already dispensed or delivered are generally <b>non-refundable</b> for safety and regulatory reasons. 
<br />
- Unused program components may be eligible for a <b>pro-rata refund</b>, subject to review.</p>
            </section>

            {/* Exclusions */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">When This Promise Does Not Apply</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">This Results Promise does not apply if:</p>
              <ul className="space-y-1 text-[#57534E] text-sm">
                 <li className="flex gap-2 items-center">
                    <span className="text-red-300 font-bold text-xs">✕</span> You cancel the program early for non-medical reasons.
                 </li>
                 <li className="flex gap-2 items-center">
                    <span className="text-red-300 font-bold text-xs">✕</span> You fail to meet the adherence requirements outlined above.
                 </li>
                 <li className="flex gap-2 items-center">
                    <span className="text-red-300 font-bold text-xs">✕</span> You provide incomplete, inaccurate, or misleading medical info.
                 </li>
                 <li className="flex gap-2 items-center">
                    <span className="text-red-300 font-bold text-xs">✕</span> There is evidence of unsafe behavior, misuse, or non-compliance.
                 </li>
                 <li className="flex gap-2 items-center">
                    <span className="text-red-300 font-bold text-xs">✕</span> There is suspected fraud, data manipulation, or abuse of the program.
                 </li>
              </ul>
            </section>

            {/* <div className="w-full h-px bg-[#E5E5E5]"></div> */}

            {/* How to Request */}
            <section>
                <h2 className="font-serif text-2xl text-[#1F302B] mb-4">How to Request a Refund Review</h2>
                <div className="">
                    <p className="text-[#57534E] mb-4">If you believe you qualify under this Results Promise, you must email:</p>
                    <div className="font-mono text-sm bg-white p-4 rounded border border-[#E5E5E5] text-[#1F302B] mb-4">
                        To: <b>support@leanprotocol.in</b> <br />
                        Subject: <b>“Lean Protocol - Refund Request”</b>
                    </div>
                    <ul className="space-y-1 mb-4 text-[#57534E] pl-2 list-disc">
                        <li className="ml-3">Requests must be submitted <b>within 15 days</b> of the end of the applicable results period.</li>
                        <li className="ml-3">Our team will review your program data, adherence records, and clinical notes before issuing a decision.</li>
                    </ul>
                </div>
            </section>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Final Authority */}
            <section >
                <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Final Authority & Policy Updates</h2>
                <p className="text-[#57534E] mb-4">All refund decisions under this policy are made by Lean Protocol and are final, subject to applicable law.
</p>
<p className="text-[#57534E] mb-4">Lean Protocol reserves the right to update or modify this policy. The version applicable to you will generally be the one in effect at the time of purchase unless a change is required by law.</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}