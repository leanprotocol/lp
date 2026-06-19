"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CalendarCheck, ScanSearch, ClipboardList, ShieldCheck, Instagram, Facebook, Mail } from "lucide-react";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { Button } from "@/components/ui/button";

const consultSteps = [
  {
    num: 1,
    icon: CalendarCheck,
    title: "Consultation Scheduling",
    desc: "One on one virtual appointment with GLP 1 expert doctors from reputed hospitals.",
  },
  {
    num: 2,
    icon: ScanSearch,
    title: "Detailed Body Evaluation",
    desc: "We review your history and suggest treatment for the root causes of weight gain.",
  },
  {
    num: 3,
    icon: ClipboardList,
    title: "Personalised Wellness Plan",
    desc: "A prescription with clear actionable steps designed for your weight loss.",
  },
];

const problems = [
  { icon: "💉", label: "Insulin Resistance", subtext: "I gain weight even when I eat less" },
  { icon: "🐢", label: "Slow Metabolism", subtext: "Struggling to burn calories efficiently" },
  { icon: "⚡", label: "Low Energy", subtext: "I feel tired all the time" },
  { icon: "🧬", label: "Hormonal Issues", subtext: "My body feels out of balance" },
  { icon: "🍽️", label: "Constant Cravings", subtext: "Hard to control hunger throughout the day" },
  { icon: "😔", label: "Emotional Eating", subtext: "Using food for comfort during stress" },
];

const faqs = [
  { 
    q: "What is GLP-1 and how does it help with weight loss?", 
    a: "GLP-1 (Glucagon-like peptide-1) is a naturally occurring hormone that regulates appetite and blood sugar. Our medication mimics this hormone, helping you feel full sooner, reducing cravings, and slowing down stomach emptying, which leads to sustainable weight loss." 
  },
  { 
    q: "Am I eligible for this program?", 
    a: "Eligibility is determined by our doctors. Generally, it is for individuals with a BMI above 27 who have weight-related medical problems, or a BMI above 30. Your initial blood test and doctor consultation will confirm if this treatment is right and safe for you." 
  },
  { 
    q: "What happens if I'm not eligible after the blood test?", 
    a: "If our doctors determine that GLP-1 medication is not suitable for you based on your blood test and consultation, you will receive a 100% full refund within 48 hours. No questions asked." 
  },
  { 
    q: "Is the medication safe?", 
    a: "Yes. All medications are prescribed by licensed doctors and sourced from reputed pharmaceutical companies. Like any medication, there can be side effects (such as mild nausea initially), which our medical team will discuss with you and monitor throughout your journey." 
  },
  { 
    q: "How soon will I see results?", 
    a: "Most users begin seeing initial weight loss within the first 4–6 weeks. However, significant, lasting results (15-22% of body weight) are typically achieved over the full 6-month protocol when combined with our dietitian-guided nutrition plan." 
  },
];

export function EligibilityFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToPlans = () => {
    window.dispatchEvent(new CustomEvent('selectDoctorPlan'));
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SECTION 15 – "Still Confused?" / Doctor Consultation Block */}
      <section className="bg-[#F5F2EB] py-20 md:py-28 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16 space-y-3">
            <h2 className="font-serif text-2xl md:text-4xl text-lp-dark leading-tight">
              Still confused if this is right for you?
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
              Let our GLP-1 experts guide you — one step at a time.
            </p>
          </div>

          {/* Doctor Consult Card — Inspired by doctor-cropped.png */}
          <div className="bg-[#EAE5DA] rounded-3xl overflow-hidden shadow-2xl border border-[#D5D0C5]">
            
            {/* Main Content: Steps + Doctor Image */}
            <div className="grid md:grid-cols-2 min-h-[520px]">

              {/* Left: Steps */}
              <div className="p-6 md:p-10 flex flex-col justify-center relative z-10 order-2 md:order-1">
                <h3 className="font-serif text-2xl md:text-[2rem] text-lp-dark leading-tight mb-8 md:mb-10">
                  Consult a<br />
                  <span className="text-lp-green">GLP-1 Doctor Now</span>
                </h3>

                <div className="space-y-5">
                  {consultSteps.map((step) => (
                    <div key={step.num} className="flex items-start gap-4">
                      {/* Icon Circle with Number Badge */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-[#EAE5DA] border-2 border-[#C5BFAF] flex items-center justify-center shadow-sm">
                          <step.icon className="w-6 h-6 text-lp-dark/70" strokeWidth={1.5} />
                        </div>
                        {/* Number badge */}
                        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-lp-green text-white text-xs font-bold flex items-center justify-center shadow-md ring-2 ring-[#EAE5DA]">
                          {step.num}
                        </div>
                      </div>
                      
                      {/* Step Card */}
                      <div className="bg-[#10241A] rounded-2xl px-5 py-4 flex-grow shadow-lg">
                        <h4 className="text-white font-bold text-base md:text-lg leading-snug">
                          {step.title}
                        </h4>
                        <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Doctor Image */}
              <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-0">
                <Image
                  src="/lp-assets/doctor-consult-hero.png"
                  alt="GLP-1 Expert Doctor Consultation"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay for text readability on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#EAE5DA] via-transparent to-transparent md:bg-gradient-to-r md:from-[#EAE5DA] md:via-[#EAE5DA]/20 md:to-transparent pointer-events-none" />

                {/* Lean Protocol Badge */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
                  <Image
                    src="/logo-cropped.png"
                    alt="Lean Protocol"
                    width={80}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Pricing CTA Bar */}
            <div className="p-5 md:p-8 pt-3 bg-gradient-to-b from-[#EAE5DA] to-[#DFD8CC]">
              <div className="bg-[#10241A] rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 border border-[#233B2F]">
                
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto text-center sm:text-left">
                  <div className="text-white text-sm md:text-base font-bold sm:pr-6 sm:border-r border-[#C9A84C]/50 leading-tight uppercase tracking-wider">
                    First Consult<br className="hidden sm:block" /> Discount
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white/50 line-through text-lg md:text-xl font-serif">₹1,500</span>
                    <span className="text-[#C9A84C] text-3xl md:text-4xl font-serif font-bold">₹449</span>
                  </div>
                </div>
                
                <Button 
                  onClick={scrollToPlans}
                  className="w-full md:w-auto px-8 h-13 bg-[#EAE5DA] hover:bg-white text-[#10241A] font-bold rounded-full shadow-lg transition-all hover:scale-105 text-base"
                >
                  Book Consultation
                </Button>
              </div>
              
              <div className="mt-5 flex items-center justify-center gap-2 text-[#10241A]/70 font-serif">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-sm tracking-wide">Guided by Science. Focused for your results.</p>
              </div>
            </div>
          </div>

          {/* Problems Grid Below */}
          <div className="mt-16 md:mt-20">
            <h3 className="text-center font-serif text-2xl md:text-3xl text-lp-dark mb-10">
              Do you relate to any of these?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {problems.map((problem, idx) => (
                <div key={idx} className="bg-lp-dark text-white rounded-2xl p-5 md:p-7 flex flex-col items-center text-center space-y-2.5 shadow-lg hover:bg-[#25392D] hover:scale-[1.02] transition-all duration-300 cursor-default">
                  <div className="text-3xl md:text-4xl mb-1">{problem.icon}</div>
                  <h4 className="font-bold text-sm md:text-base leading-tight">{problem.label}</h4>
                  {problem.subtext && (
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{problem.subtext}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 text-center space-y-5">
              <p className="text-base md:text-lg text-gray-600">
                If you relate to any of these, <span className="font-semibold text-lp-dark">GLP-1 may be right for you.</span>
              </p>
              <a
                href="https://wa.link/5btsrr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white font-semibold py-3.5 px-8 rounded-full transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                <WhatsappIcon className="w-5 h-5" />
                Chat with a Doctor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 17 – FAQ Accordion */}
      <section className="bg-gray-50 py-24 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-lp-dark text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-lp-dark text-lg pr-8">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-lp-green transition-transform duration-300 flex-shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 – "Your First Steps?" CTA Block */}
      <section className="bg-lp-green py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl text-white">Your First Steps?</h2>
          
          <a
            href="https://wa.link/5btsrr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1fba58] text-white font-bold py-5 px-10 rounded-full transition-colors text-xl shadow-2xl hover:scale-105"
          >
            <WhatsappIcon className="w-6 h-6" />
            Chat with Experts
            <span className="ml-2">→</span>
          </a>
        </div>
      </section>

      {/* SECTION 18 – Footer */}
      <footer className="bg-black text-white/80 pt-14 pb-8 px-4 md:px-14 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          
          {/* Top: Brand + Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="space-y-5 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo-cropped.png"
                  alt="Lean Protocol"
                  width={120}
                  height={44}
                  className="object-contain"
                />
              </Link>
              <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                Modern weight loss medication, prescribed online and delivered to your door. Science-backed paths to a healthier you.
              </p>
              <div className="flex gap-3 pt-1">
                {[Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/20 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link href="/our-why" className="text-white/70 hover:text-white transition-colors text-sm">Our Why</Link></li>
                <li><Link href="#plans" className="text-white/70 hover:text-white transition-colors text-sm">Plans</Link></li>
                <li><Link href="/blog" className="text-white/70 hover:text-white transition-colors text-sm">Knowledge Hub</Link></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terms-conditions" className="text-white/70 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy" className="text-white/70 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="text-white/70 hover:text-white transition-colors text-sm">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70 text-sm">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
                 <a href="mailto:support@leanprotocol.in" className="hover:text-white transition-colors" aria-label="Email Lean Protocol support team">
                  support@leanprotocol.in
                </a>
                </li>
                <li className="text-white/70 text-sm">9650491267</li>
                <li className="pt-1">
                  <a
                    href="https://wa.link/5btsrr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm rounded-full px-4 py-1.5 transition-colors"
                  >
                    <WhatsappIcon className="w-3.5 h-3.5" />
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-xs text-white/30 italic max-w-4xl leading-relaxed mb-4">
              Treatment decisions are made solely by a licensed physician. Medications, if prescribed, are supplied by external pharmacy partners. Some images may be AI-created. This program is not a substitute for medical diagnosis or treatment.
            </p>
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Lean Protocol Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
