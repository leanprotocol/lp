"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, Phone, ArrowRight, Sparkles } from "lucide-react";
import { WhatsappIcon } from "@/components/whatsapp-icon";

export default function WelcomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-emerald-100 opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full bg-amber-100 opacity-60 blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-lg transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/logo-cropped.png"
              alt="Lean Protocol"
              width={130}
              height={46}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center space-y-6">
          {/* Success icon */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-serif text-[#1F302B] leading-tight">
              Welcome to Lean Protocol! 🎉
            </h1>
            <p className="text-[#6B5E4E] text-base leading-relaxed">
              Your payment has been received and your subscription is now{" "}
              <span className="text-emerald-600 font-semibold">active</span>.
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-2xl bg-[#F5F0E8] border border-[#E2D5BF] p-5 text-left space-y-3">
            <p className="text-sm text-[#4A3C2F] leading-relaxed">
              📞 Our team will contact you shortly on the number you registered
              with to get you started.
            </p>
            <p className="text-sm text-[#4A3C2F] leading-relaxed">
              💬 In the meantime, let us know you&apos;ve completed your payment by
              tapping the button below — our team will take the conversation
              forward from there.
            </p>
          </div>

          {/* Primary CTA — WhatsApp */}
          <a
            id="welcome-whatsapp-cta"
            href="https://wa.link/9w3oc6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 text-base group"
          >
            <WhatsappIcon className="w-5 h-5" />
            Let us know on WhatsApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Phone number */}
          <div className="flex items-center justify-center gap-2 text-[#6B5E4E] text-sm">
            <Phone className="w-4 h-4" />
            <span>Or call us at&nbsp;</span>
            <a
              href="tel:+919650401267"
              className="font-semibold text-[#1F302B] hover:underline"
            >
              9650401267
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E8DBC7] pt-4">
            <Link
              href="/dashboard"
              className="text-sm text-[#8A7860] hover:text-[#1F302B] transition-colors underline-offset-2 hover:underline"
            >
              Go to your dashboard →
            </Link>
          </div>
        </div>

        {/* Terms reminder */}
        <p className="text-center text-xs text-[#9A8570] mt-6 px-4 leading-relaxed">
          Your plan will be activated within 48 hours of purchase and our team
          will contact you on the number provided at checkout. Lean Protocol does
          not influence the doctor&apos;s prescription decision.
        </p>
      </div>
    </div>
  );
}
