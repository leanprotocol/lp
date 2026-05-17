"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { FAQSection } from "@/components/faq-section";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Briefcase,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { WhatsappIcon } from "@/components/whatsapp-icon";

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: "", mobileNumber: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: "", mobileNumber: "", email: "", message: "" });
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lp-bg">
      <Header />

      {/* ─── HERO & CONTACT INFO ─── */}
      <section className="bg-[#EFF5ED] pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-stretch">
            
            {/* Left: Hero Content & Image */}
            <div className="space-y-10 flex flex-col">
              <div className="space-y-4">
                <p className="text-lp-green text-sm font-semibold tracking-[0.25em] uppercase">
                  Contact Us
                </p>
                <h1 className="font-serif text-4xl md:text-[56px] md:leading-[1.1] text-dark tracking-tight">
                  We&apos;d love to hear<br className="hidden md:block" /> from you
                </h1>
                <p className="text-dark/60 text-lg max-w-lg">
                  Have questions about our program, support, or careers? Our team is here to help you on your weight loss journey.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] shadow-sm border border-dark/5 flex-grow">
                <Image
                  src="/lp-assets/contact-hero-indian.png"
                  alt="Person enjoying healthy lifestyle"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right: Contact Tabs/Cards */}
            <div className="lg:pt-24 flex flex-col h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-grow">
                {/* Phone */}
                <div className="bg-white rounded-2xl border border-dark/10 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-dark/40 uppercase tracking-widest font-semibold mb-2">
                    General Information
                  </p>
                  <a
                    href="tel:+919650491267"
                    className="text-dark font-semibold text-lg group-hover:text-lp-green transition-colors"
                  >
                    9650491267
                  </a>
                  <p className="text-xs text-dark/50 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Mon – Sat, 9 am – 7 pm
                  </p>
                </div>

                {/* Support Email */}
                <div className="bg-white rounded-2xl border border-dark/10 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-dark/40 uppercase tracking-widest font-semibold mb-2">
                    Support
                  </p>
                  <a
                    href="mailto:support@leanprotocol.in"
                    className="text-dark font-semibold text-base group-hover:text-lp-green transition-colors break-all"
                  >
                    support@leanprotocol.in
                  </a>
                  <p className="text-xs text-dark/50 mt-1.5">We reply within 24 hours</p>
                </div>

                {/* Careers */}
                <div className="bg-white rounded-2xl border border-dark/10 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5 text-violet-600" />
                  </div>
                  <p className="text-xs text-dark/40 uppercase tracking-widest font-semibold mb-2">
                    For Jobs
                  </p>
                  <a
                    href="mailto:careers@leanprotocol.in"
                    className="text-dark font-semibold text-base group-hover:text-lp-green transition-colors break-all"
                  >
                    careers@leanprotocol.in
                  </a>
                  <p className="text-xs text-dark/50 mt-1.5">Join our growing team</p>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl border border-dark/10 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-xs text-dark/40 uppercase tracking-widest font-semibold mb-2">
                    Address
                  </p>
                  <a
                    href="https://maps.google.com/?q=NO+20+BLOCK+H1+A+Sector+63+Noida+Uttar+Pradesh+201301"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark font-semibold text-sm leading-snug group-hover:text-lp-green transition-colors"
                  >
                    NO 20 BLOCK H1/A, Lean Protocol Pvt. Ltd., Sector 63, Noida, UP 201301
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Form + Photo Section ─── */}
      <section className="py-16 md:py-24 px-4 bg-lp-bg">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl border border-dark/10 p-8 md:p-10 shadow-sm">
              <h3 className="font-serif text-2xl md:text-3xl text-dark mb-1">
                Send us a message
              </h3>
              <p className="text-sm text-dark/50 mb-8">
                Fill in the form and we&apos;ll get back to you as soon as possible.
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <p className="text-dark font-semibold text-lg">Message received!</p>
                  <p className="text-sm text-dark/60">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-sm text-lp-green hover:underline mt-2 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs text-dark/60 font-medium uppercase tracking-wider block mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full h-12 px-4 rounded-xl border border-dark/15 bg-lp-bg text-dark text-sm placeholder:text-dark/30 focus:outline-none focus:border-lp-green focus:ring-1 focus:ring-lp-green/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark/60 font-medium uppercase tracking-wider block mb-1.5">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full h-12 px-4 rounded-xl border border-dark/15 bg-lp-bg text-dark text-sm placeholder:text-dark/30 focus:outline-none focus:border-lp-green focus:ring-1 focus:ring-lp-green/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark/60 font-medium uppercase tracking-wider block mb-1.5">
                      Email (optional)
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-dark/15 bg-lp-bg text-dark text-sm placeholder:text-dark/30 focus:outline-none focus:border-lp-green focus:ring-1 focus:ring-lp-green/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark/60 font-medium uppercase tracking-wider block mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-dark/15 bg-lp-bg text-dark text-sm placeholder:text-dark/30 focus:outline-none focus:border-lp-green focus:ring-1 focus:ring-lp-green/20 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-lp-green hover:bg-lp-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Photo + WhatsApp CTA */}
            <div className="space-y-6">
              {/* Photo */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-sm border border-dark/10 bg-white">
                <Image
                  src="/lp-assets/image4.png"
                  alt="Lean Protocol support team member"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* WhatsApp Quick CTA */}
              <div className="bg-lp-dark rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#25D366]/20 flex items-center justify-center mx-auto">
                  <WhatsappIcon className="w-7 h-7 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-white font-serif text-xl mb-1">Need instant help?</h3>
                  <p className="text-white/60 text-sm">
                    Chat with us on WhatsApp for quick responses
                  </p>
                </div>
                <a
                  href="https://wa.link/5btsrr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white font-semibold py-3 px-7 rounded-full transition-colors duration-200 text-sm"
                >
                  <WhatsappIcon className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section className="bg-lp-bg py-4 px-4 border-t border-dark/10">
        <div className="max-w-6xl mx-auto">
          <FAQSection />
        </div>
      </section>

      <Footer />
    </div>
  );
}
