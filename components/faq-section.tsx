"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"

interface FAQItem {
  question: string
  answer?: string | React.ReactNode
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "How Does the Weight Loss Program Work?",
      answer: (
        <div className="space-y-3">
          <p>Lean Protocol works in three simple steps:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>We assess your body (blood markers + doctor review) to find the real cause of weight gain.</li>
            <li>We build your plan with the right mix of nutrition, workouts, and, if needed, safe medical support through GLP-1 and allied options.</li>
            <li>We track results weekly and keep adjusting so you lose weight faster, safely, and maintain it long-term.</li>
          </ol>
        </div>
      )
    },
    {
      question: "Who Decides What Treatment Plan Is Right for Me?",
      answer: (
        <div className="space-y-3">
          <p>Your plan is decided by our doctor-led team, based on your health history, blood reports, and goals.</p>
          <p>If medication is needed, it’s recommended only by qualified doctors, with safety as the priority.</p>
        </div>
      )
    },
    {
      question: "Why Does Weight Loss Need a Medical Approach?",
      answer: (
        <div className="space-y-3">
          <p>Because for many people, weight gain isn’t just about willpower. It’s often driven by hormones, metabolism, insulin resistance, stress, or underlying medical conditions.</p>
          <p>A medical approach helps us find the real cause and treat it safely, so results actually last.</p>
        </div>
      )
    },
    {
      question: "Who Can Take These Medications?",
      answer: (
        <div className="space-y-3">
          <p>Not everyone needs them. These medications are for people who may benefit medically, based on their weight, health reports, and doctor evaluation.</p>
          <p>Your doctor will recommend them only if they’re safe and suitable for you.</p>
        </div>
      )
    },
    {
      question: "Are These Medications Safe?",
      answer: (
        <div className="space-y-3">
          <p>Yes, when prescribed correctly and monitored by a doctor. Many of these medications have been used for 20+ years, are approved in 75+ countries, and have been taken by millions of people worldwide.</p>
          <p>That said, they’re not for everyone, which is why we only recommend them after a proper medical assessment and regular follow-ups.</p>
        </div>
      )
    },
    {
      question: "What's Included in the Weight Management Package?",
      answer: (
        <div className="space-y-3">
          <p>Lean Protocol gives you a complete doctor-led weight loss system:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>GLP-1 trained expert doctor consultations + follow-ups</li>
            <li>Blood marker assessment to find the root cause</li>
            <li>Personalized plan: unlimited 1:1 nutritionist consultations and 20 days a month of personalized workouts</li>
            <li>Medication support (if eligible) with medication delivery, dose & side-effect monitoring</li>
            <li>Tracking tools + coaching to handle plateaus, cravings, sleep, and stress</li>
          </ul>
          <p>Everything is designed for safe fat loss and long-term maintenance.</p>
        </div>
      )
    }
  ]

  return (
    <section className="py-12 md:py-18">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid Container: Heading Left (1), Accordion Right (2) */}
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* LEFT SIDE: Heading (Sticky) */}
          <div className="md:col-span-5 md:sticky md:top-24">
            <h2 className="heading">
              Your questions, <br />
              <span className="italic text-dark/70">answered.</span>
            </h2>
            
            <div className="inline-flex flex-col gap-2">
              <a href="#" className="text-dark text-sm border-b border-dark pb-1 hover:opacity-70 transition-opacity">
                Get in touch with us here →
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Accordion List */}
          <div className="md:col-span-7 divide-y divide-[#D4D1C5] -mt-2">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-7 flex items-start justify-between text-left transition-all cursor-pointer"
                >
                  <span className={`text-xl md:text-xl font-serif pr-8 group-hover:text-dark transition-colors ${openIndex === index ? 'text-dark' : 'text-dark/80'}`}>
                    {faq.question}
                  </span>
                  
                  <span className="mt-1 shrink-0">
                    {openIndex === index ? (
                      <div className="bg-dark rounded-full p-1 shadow-sm">
                        <Minus className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="border border-dark/30 rounded-full p-1 group-hover:border-dark">
                        <Plus className="h-4 w-4 text-dark" />
                      </div>
                    )}
                  </span>
                </button>

                {/* Animated Answer Body */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-125 pb-8 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="text-sm leading-relaxed pr-10">
                    {faq.answer || "Specific clinical information is provided during your 1-on-1 consultation."}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}