"use client"

import Link from "next/link"
import * as C from "@/content/home-v2"

/**
 * Site footer.
 *
 * Opens with the closing call to action from the design, then the usual
 * navigation and legal block. Default export is kept because app/page.tsx
 * imports it without braces.
 */
const NAV = [
  {
    title: "Programme",
    links: [
      { label: "How it works", href: "/#journey" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Our experts", href: "/#experts" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "BMI calculator", href: "/bmi-calculator" },
      { label: "BMR calculator", href: "/bmr-calculator" },
      { label: "Waist-to-hip ratio", href: "/waist-to-hip-calculator" },
      { label: "Knowledge hub", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our why", href: "/our-why" },
      { label: "Contact", href: "/contact" },
      { label: "Innovation", href: "/innovation" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms-conditions" },
      { label: "Refund policy", href: "/refund-policy" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-black text-lp-bg">
      {/* Closing CTA */}
      <div className="border-b border-lp-bg/10 px-7 py-[clamp(60px,9vh,110px)] text-center">
        <h2
          className="m-0 font-extrabold tracking-[-0.03em]"
          style={{ fontSize: "clamp(30px,4.4vw,60px)" }}
        >
          One small step.{" "}
          <span className="font-serif italic tracking-normal text-accent">
            To a leaner you.
          </span>
        </h2>
        <a
          href={C.closing.cta.href}
          className="mt-8 inline-block rounded-full bg-accent px-10 py-[18px] text-[18px] font-extrabold text-dark transition-colors hover:bg-white"
          style={{ boxShadow: "0 14px 40px rgba(200,217,167,.22)" }}
        >
          {C.closing.cta.label}
        </a>
      </div>

      {/* Navigation */}
      <div className="mx-auto grid max-w-[1180px] gap-10 px-7 py-14 [grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))]">
        <div className="min-w-[200px]">
          <img
            src="/logo-cropped.png"
            alt="Lean Protocol"
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-accent2">
            Doctor-led, science-backed weight care. Consultations, diagnostics,
            prescriptions and support in one programme.
          </p>
          <div className="mt-5 grid gap-1.5 text-sm text-accent2">
            <a href="mailto:support@leanprotocol.in" className="hover:text-accent">
              support@leanprotocol.in
            </a>
            <a href="tel:+919650491267" className="hover:text-accent">
              +91 96504 91267
            </a>
          </div>
        </div>

        {NAV.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <div className="text-[12px] font-bold tracking-[0.14em] text-accent">
              {col.title.toUpperCase()}
            </div>
            <ul className="mt-4 grid list-none gap-2.5 p-0">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-accent2 transition-colors hover:text-lp-bg"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Legal */}
      <div className="border-t border-lp-bg/10 px-7 py-8">
        <div className="mx-auto max-w-[1180px]">
          <p className="m-0 max-w-[100ch] text-[11.5px] leading-relaxed text-accent2/60">
            {C.closing.note} GLP-1 medications are dispensed solely when a
            licensed physician determines they are clinically appropriate.
            Results vary and are not guaranteed. The information on this site is
            for general awareness and is not medical advice.
          </p>
          <p className="m-0 mt-4 text-[11.5px] text-accent2/50">
            {"\u00A9"} {new Date().getFullYear()} Lean Protocol Private Limited
          </p>
        </div>
      </div>
    </footer>
  )
}
