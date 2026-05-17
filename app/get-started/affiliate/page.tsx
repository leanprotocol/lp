"use client";

import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Highest Commission Rates",
    description: "Earn up to 10% commission on every sale. We offer the best rates in the healthcare segment.",
    icon: TrendingUp,
  },
  {
    title: "Multi-Tiered Earnings",
    description: "Flexible earning models based on plan duration. 10% for 1-month, 8% for 3-months, and 6% for 6-months.",
    icon: Sparkles,
  },
  {
    title: "Advanced Dashboard",
    description: "AWS-style metrics dashboard to track your sales, earnings, and customer growth in real-time.",
    icon: ShieldCheck,
  },
  {
    title: "Massive Reach",
    description: "Leverage our established platform and infrastructure to reach thousands of potential customers instantly.",
    icon: Users,
  },
];

const steps = [
  {
    title: "Register as a Affiliate",
    description: "Fill out the simple registration form with your basic details and professional background.",
  },
  {
    title: "Create Your Plans",
    description: "Design and list your personalized healthcare subscription plans with your own pricing.",
  },
  {
    title: "Start Earning",
    description: "Promote your link and watch your dashboard grow as customers subscribe to your expertise.",
  },
];

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF8EF]">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                  Affiliate Platform 2.0
                </span>
                <h1 className="text-5xl md:text-7xl font-serif text-[#1F302B] leading-tight">
                  Turn your expertise into a <span className="text-emerald-600">thriving</span> healthcare business
                </h1>
                <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed inter">
                  The most powerful platform for healthcare professionals to launch, manage, and scale their subscription services.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white px-10 py-7 text-lg">
                    <Link href="/affiliate/register">Join as Affiliate</Link>
                  </Button>
                  <Button variant="ghost" asChild size="lg" className="rounded-full text-[#1F302B] hover:bg-emerald-50 px-10 py-7 text-lg">
                    <Link href="#how-it-works">How it works</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-[#1F302B]">Why Affiliates Choose Us</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-50 transition-colors">
                    <benefit.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F302B] mb-3">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers Section */}
        <section className="py-24 bg-[#FDF8EF]">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto rounded-[3rem] bg-[#1F302B] p-12 md:p-20 text-white relative overflow-hidden">
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-serif mb-6 leading-tight">Simple, transparent, and rewarding commission tiers</h2>
                  <p className="text-emerald-100/70 text-lg mb-8 leading-relaxed">
                    We believe in rewarding long-term commitment. Our tiered structure ensures you earn more while providing better value to your patients.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "10% for 1-month subscriptions",
                      "8% for 3-month subscriptions",
                      "6% for 6-month subscriptions",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-emerald-400 text-xs uppercase tracking-widest mb-2">Example</p>
                        <p className="text-2xl font-serif mb-1">Sell a ₹10,000 Plan</p>
                        <p className="text-slate-400 text-sm">Earn ₹1,000 instantly on a 1-month plan.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-emerald-400 text-xs uppercase tracking-widest mb-2">Payments</p>
                        <p className="text-2xl font-serif mb-1">Manual Settlements</p>
                        <p className="text-slate-400 text-sm">Weekly settlements directly to your bank account.</p>
                    </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-[#1F302B]">Three Steps to Launch</h2>
            </div>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mx-auto mb-6">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-[#1F302B] mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-6 -right-6 w-12 border-t border-dashed border-slate-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-20 text-center">
              <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-7">
                <Link href="/affiliate/register" className="flex items-center gap-2">
                  Apply to become a Affiliate <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
