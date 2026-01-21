"use client";

import { FileText, Calendar, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsConditions() {
  return (
    <section className="bg-[#F6F1EE] min-h-screen py-10 md:py-14 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Document Header --- */}
        <div className="bg-[#1F302B] text-white rounded-t-2xl rounded-t-[2rem] p-8 md:p-12 border-b border-white/10">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
            Terms & Conditions
          </h1>
          <div className="flex items-center gap-2 text-[#D6F0E6]/80 font-mono text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: 15 January 2026</span>
          </div>
        </div>

        {/* --- Document Body --- */}
        <div className="bg-white rounded-b-2xl md:rounded-b-[2rem] border border-[#1F302B]/5 overflow-hidden">
          
          <div className="p-4 md:p-12 space-y-10">

            {/* Introduction */}
            <div className="prose max-w-none">
              <p className="text-[#57534E]  leading-relaxed">
                By accessing or using the Lean Protocol website, mobile application, services, community channels, or by purchasing any Lean Protocol package (collectively, the “Platform”), you agree to these Terms & Conditions (“Terms”) and our Privacy Policy. If you do not agree, you must not access or use the Platform.
              </p>
            </div>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Who We Are */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Who We Are</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Lean Protocol is operated by <b>Lean Protocol Private Limited</b> (“Lean Protocol”, “we”, “us”, “our”). Lean Protocol operates a technology-enabled, doctor-guided weight-management program in India.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                Medical services, where applicable, are provided by qualified healthcare professionals exercising independent clinical judgment. Lean Protocol does not practice medicine and does not interfere with medical decision-making. Lean Protocol does not guarantee the availability of any specific doctor, coach, or expert and may assign an alternate qualified provider when required.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Eligibility</h2>
              <p className="text-[#57534E] mb-4">You may use the Platform only if you:</p>
            <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
  <li className="ml-3">
    Are between <b>18 and 65 years of age</b>
  </li>
  <li className="ml-3">
    Are physically located in <b>India</b>
  </li>
  <li className="ml-3">
    Are capable of providing accurate, complete, and truthful health information
  </li>
            </ul>

              <p className="text-[#57534E] leading-relaxed">
                Lean Protocol reserves the right to refuse onboarding, pause services, or discontinue access if eligibility criteria are not met or if continuation is not clinically appropriate.
              </p>
            </section>

            {/* Not for Emergencies */}
            <section className="bg-[#F6F1EE] p-5 rounded-xl ">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#1F302B] mt-1 shrink-0" />
                <div>
                  <h2 className="font-serif text-xl text-[#1F302B] mb-2">Not for Emergencies</h2>
                  <p className="text-[#57534E] leading-relaxed">
                    Lean Protocol is <b>not intended for emergency care</b>. If you believe you are experiencing a medical emergency, you must seek immediate in-person medical attention or contact local emergency services.
                  </p>
                </div>
              </div>
            </section>

            {/* What We Offer */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">What We Offer</h2>
              <p className="text-[#57534E] mb-4">Depending on the package purchased, Lean Protocol may provide access to:</p>
              <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                {["Doctor teleconsultations", "Dietician consultations", "Trainer/workout coaching", "Psychological consultations", "Laboratory tests (home collection)", "Medication education and guidance", "Prescription-based medicine fulfillment", "Community support features", "Complimentary kits (limited-time offers)"].map((item, i) => (
                    <li key={i} className="ml-3">{item}</li>
                ))}
              </ul>
              <p className="text-[#57534E] leading-relaxed italic">
                Services may be modified, replaced, rescheduled, or discontinued for safety, quality, operational, or clinical reasons.
              </p>
            </section>

            {/* <div className="w-full h-px bg-[#E5E5E5]"></div> */}

            {/* Medical Disclaimer & Guarantees */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Medical Disclaimer and No Guarantees</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Health outcomes vary based on clinical eligibility, physiology, adherence, lifestyle, and external factors. Except as explicitly stated under the <b>Lean Protocol Results Promise</b>, no specific results, timelines, or outcomes are guaranteed.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                You agree to provide complete and accurate medical history, medication details, allergies, symptoms, and reports. Failure to disclose accurate information may affect safety, treatment decisions, and outcomes.
              </p>
            </section>

            {/* GLP-1 Medications */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">GLP-1 Medications and Clinical Suitability</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                GLP-1 based therapy is prescribed only where a Lean Protocol doctor determines it is clinically appropriate and safe.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                Side effects may occur. The treating doctor may modify, pause, or discontinue treatment at any time based on clinical judgment. Lean Protocol does not guarantee that any medication will be prescribed, continued, or effective for any individual.
              </p>
            </section>

            {/* Telemedicine Consent */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Telemedicine Consent</h2>
              <p className="text-[#57534E] leading-relaxed">
                You must accept a separate Telemedicine Consent during onboarding. You acknowledge that teleconsultation has inherent limitations and may not be suitable for all conditions. If advised to seek in-person care, you agree to comply.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">User Responsibilities</h2>
              <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                <li className="ml-3">
                    You agree to use the Platform responsibly and in good faith.
                </li>
                <li className="ml-3">
                    You are responsible for maintaining account confidentiality and for all activity under your account. You must not misuse the Platform, attempt unauthorized access, reverse engineer systems, upload harmful content, harass others, or abuse staff or providers.
                </li>
                <li className="ml-3">
                    You must follow all medical, safety, and program instructions provided by experts.
                </li>
              </ul>
            </section>

            {/* Community Rules */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Community Rules</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Community features are intended for support, accountability, and general education only.
              </p>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Users must not provide medical advice, prescriptions, diagnoses, or claim clinical authority in community spaces. Community posts may be visible to other members and must not include sensitive personal or medical details.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                Lean Protocol reserves the right to moderate, remove content, or restrict access to maintain safety and program integrity.
              </p>
            </section>

            {/* Appointments */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Appointments, Rescheduling, and No-Shows</h2>
             
                <p className="text-[#57534E] leading-relaxed mb-4">
                    Rescheduling requests must be made at least 24 hours before the scheduled appointment time.
                </p>
                <p className="text-[#57534E] leading-relaxed mb-4">
                    A maximum of two reschedules per appointment is permitted.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                    If a user does not attend a scheduled consultation, one additional opportunity will be provided. A second no-show will result in the consultation being treated as forfeited and terminated.
                </p>
            
            </section>

            {/* <div className="w-full h-px bg-[#E5E5E5]"></div> */}

            {/* Logistics & Delivery */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Medicines, Pharmacy Fulfillment, and Delivery</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Lean Protocol facilitates prescription-based medicine delivery through partner pharmacies where included in the package.
              </p>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Medicines are supplied only against a valid prescription. Prescription medicines are <b>non-returnable and non-refundable</b> for safety and regulatory reasons, except where required by applicable law.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                Lean Protocol is not responsible for manufacturer defects, third-party logistics delays, or issues arising from incorrect delivery details provided by the user.
              </p>
            </section>

            {/* Labs */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Labs and Home Collection</h2>
              <p className="text-[#57534E] leading-relaxed">
                Lab services are facilitated through partner laboratories and are subject to location-based availability. If a test or home collection is not serviceable, Lean Protocol will attempt to arrange an alternative provider or method. If this is not feasible, a refund may be considered in accordance with the Refund section.
              </p>
            </section>

            {/* Kits */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Complimentary Kits and Third-Party Products</h2>
              <p className="text-[#57534E] leading-relaxed mb-4">
                Complimentary kits may be provided only in limited-time offers or select packages.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                Kits are non-returnable and non-refundable. Any manufacturer warranty is subject to the original brand’s policy. Supplements are not substitutes for medical advice.
              </p>
            </section>

            {/* Payments */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Payments and Billing</h2>
              <p className="text-[#57534E] leading-relaxed">
                Payments are processed through Razorpay and may be subject to Razorpay’s terms. All applicable taxes, including GST, may apply. Failed or incomplete payments may result in service suspension or cancellation.
              </p>
            </section>

            {/* Refunds */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Refunds and Cancellations</h2>
            
                <p className="text-[#57534E] leading-relaxed mb-4">
                    Lean Protocol does not offer trials.
                </p>
                <p className="text-[#57534E] leading-relaxed mb-4">
                    Refunds are limited and considered only under defined circumstances, including medical ineligibility identified after purchase, doctor-directed discontinuation due to safety concerns, or non-serviceability of essential services.
                </p>
                <p className="text-[#57534E] leading-relaxed mb-4">
                    Approved refunds may be full or partial and may deduct the value of services already consumed, tests performed, medicines dispensed or delivered, or other program components delivered.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                    No refunds apply to medicines already dispensed or delivered, except where required by law.
                </p>
           
            </section>

            {/* Results Promise - Special Card */}
            <section className="">
              <h2 className="font-serif text-2xl text-[#1F302B] mb-6 border-b border-[#E5E5E5] pb-4">Lean Protocol Results Promise</h2>
              <div className="space-y-4 text-[#57534E] text-sm md:text-base">
                <p>This Results Promise forms part of these Terms and must be read together with the Refund, Medical Disclaimer, and GLP-1 sections. In case of conflict, these Terms prevail.</p>
                <p>Lean Protocol offers a results-based promise for eligible users enrolled in GLP-1 based programs.</p>
                <p>Eligible users who meet all adherence requirements may qualify for a refund review if they do not lose <b>at least 6% of their starting body weight within the first 3 months</b> of the program.</p>
                <p>This promise applies only to <b>new customers</b> enrolled in <b>3-month or 6-month GLP-1 based programs</b> with a <b>starting BMI of 30 or higher.</b> It does not apply to 1-month or short-duration programs.</p>
                <p>Eligibility requires good-faith participation, including weight tracking using the Lean Protocol smart scale in at least <b>75% of the program weeks</b>, final weight recording within <b>7 days</b> of the results window, prescribed medication adherence, doctor consultations at least once per month, nutritionist consultations at least twice per month, and meal logging for at least <b>4 days per week</b> in at least <b>75% of the program weeks.</b></p>
                <p>If eligibility is met and results are not achieved, refunds are calculated on a<b> pro-rata basis,</b> deducting the value of services, diagnostics, medicines, and benefits already consumed.</p>
                <p>If GLP-1 therapy is discontinued due to medically significant side effects based on doctor judgment, refund eligibility will be reviewed separately. Medicines already dispensed remain non-refundable.</p>
                <p>Early cancellation for non-medical reasons, failure to adhere, inaccurate disclosures, unsafe behavior, or fraud voids eligibility.</p>
                <p>Refund review requests must be submitted within <b>30 days</b> of the applicable results period by emailing <a href="mailto:support@leanprotocol.in" className="text-dark/80 hover:underline font-bold">support@leanprotocol.in</a>. Lean Protocol’s decision is final, subject to applicable law.</p>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Final Legal Blocks */}
            <div className="space-y-6">
                  <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Recording and Quality</h3>
                    <p className="text-[#57534E]">Lean Protocol may record certain consultations or chats for quality, training, compliance, and continuity of care. Where recording occurs, users will be informed.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Data and Privacy</h3>
                    <p className="text-[#57534E]">Personal and health data is collected and processed for service delivery, record-keeping, care coordination, and program improvement. Access is restricted to authorized personnel. Details are provided in the Privacy Policy.</p>
                </section>
                 <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Intellectual Property</h3>
                    <p className="text-[#57534E]">All platform content, protocols, trademarks, and materials are owned by Lean Protocol or its licensors and protected by law. Unauthorized use is prohibited.</p>
                </section>
                 <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Platform Availability and Disclaimer of Warranties</h3>
                    <p className="text-[#57534E]">The Platform is provided on an “as is” and “as available” basis. Lean Protocol does not guarantee uninterrupted or error-free access.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Limitation of Liability</h3>
                    <p className="text-[#57534E]">To the maximum extent permitted by law, Lean Protocol’s total liability shall not exceed the fees paid by you for the relevant package. Indirect or consequential damages are excluded where legally permitted.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Indemnity</h3>
                    <p className="text-[#57534E]">You agree to indemnify Lean Protocol against claims arising from your breach of these Terms, misuse of the Platform, violation of law, or violation of third-party rights.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Suspension and Termination</h3>
                    <p className="text-[#57534E]">Lean Protocol may suspend or terminate access for false disclosures, abuse, policy violations, misuse, or non-payment. Certain provisions survive termination.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Governing Law and Jurisdiction</h3>
                    <p className="text-[#57534E]">These Terms are governed by Indian law. Subject to arbitration, courts at Noida have jurisdiction.</p>
                </section>
                 <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Dispute Resolution</h3>
                    <p className="text-[#57534E]">Disputes shall first be resolved amicably. If unresolved, disputes shall be referred to arbitration. If arbitration does not resolve the matter, courts at Noida shall have jurisdiction.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Updates to These Terms</h3>
                    <p className="text-[#57534E]">Lean Protocol may update these Terms from time to time. Continued use constitutes acceptance of updated Terms.</p>
                </section>
            </div>

            {/* Contact Footer */}
            <div className="bg-[#1F302B] rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-serif text-2xl mb-2">Contact</h3>
                    <p className="opacity-70 text-sm">For support or queries</p>
                </div>
                <Link href="mailto:support@leanprotocol.in">
                    <button className="flex items-center gap-2 cursor-pointer bg-white text-[#1F302B] px-6 py-3 rounded-lg font-medium hover:bg-[#F6F1EE] transition-colors">
                        <Mail className="w-4 h-4" />
                        support@leanprotocol.in
                    </button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}