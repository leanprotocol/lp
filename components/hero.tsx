"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Zap, ShieldCheck, TrendingDown, Stethoscope, Sun, ArrowRight } from "lucide-react"


import * as C from "@/content/home-v2"

export function Hero() {
  return (
    <section className="gw-hero relative flex min-h-[96vh] flex-col justify-center overflow-hidden px-7 pb-0 pt-[60px]">
      {/* Backdrop: photo with a slow Ken Burns drift, then three stacked
          washes that pull the bottom edge into the next section's colour. */}
      <img
        src={C.hero.bgImage}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        className="gw-ken absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "60% 30%" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(14,14,15,.9) 0%,rgba(14,14,15,.62) 32%,rgba(20,38,36,.78) 72%,#193231 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 75% at 50% 48%,rgba(14,14,15,.72),transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="gw-glow absolute -left-[120px] -top-[160px] h-[560px] w-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(200,217,167,.22),transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="gw-glow absolute -bottom-[120px] -right-[80px] h-[460px] w-[460px] rounded-full"
        style={{
          animationDuration: "10s",
          animationDelay: "1s",
          background:
            "radial-gradient(circle,rgba(201,168,76,.16),transparent 65%)",
        }}
      />

      {/* Floating polaroids. Hidden below md so they never crowd the wordmark. */}
      {C.hero.polaroids.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          aria-hidden
          className="gw-float absolute z-0 rounded-lg border-4 border-lp-bg object-cover md:border-[6px]"
          style={
            {
              "--r": p.rot,
              top: p.top,
              bottom: p.bottom,
              left: p.left,
              right: p.right,
              width: p.width,
              aspectRatio: "4 / 5",
              transform: `rotate(${p.rot})`,
              animationDuration: p.dur,
              animationDelay: p.delay,
              boxShadow: "0 30px 60px rgba(0,0,0,.5)",
            } as React.CSSProperties
          }
        />
      ))}

      <div
        className="relative z-[2] mx-auto max-w-[1100px] text-center"
        style={{ textShadow: "0 2px 30px rgba(14,14,15,.6)" }}
      >
        <div className="gw-rise inline-flex rounded-full border border-accent/40 px-5 py-[9px] text-[12.5px] font-bold tracking-[0.16em] text-accent">
          {C.hero.eyebrow}
        </div>

        <h1
          className="gw-rise mt-7 font-extrabold leading-[0.94] tracking-[-0.03em] text-lp-bg"
          style={{ fontSize: "clamp(58px,11vw,170px)", animationDelay: ".1s" }}
        >
          GET
          <br />
          <span className="gw-outline">
            LEANER<span className="gw-dot">.</span>
          </span>
        </h1>

        <p
          className="gw-rise mx-auto mb-[34px] mt-[26px] max-w-[560px] text-accent2"
          style={{ fontSize: "clamp(16px,1.7vw,20px)", animationDelay: ".2s" }}
        >
          {C.hero.lede}
        </p>

        <div
          className="gw-rise flex flex-wrap justify-center gap-[14px]"
          style={{ animationDelay: ".3s" }}
        >
          <a
            href={C.hero.ctaPrimary.href}
            className="rounded-full bg-accent px-10 py-[18px] text-[18px] font-extrabold text-dark transition-colors hover:bg-white"
            style={{ boxShadow: "0 14px 40px rgba(200,217,167,.25)" }}
          >
            {C.hero.ctaPrimary.label}
          </a>
          <a
            href={C.hero.ctaSecondary.href}
            className="rounded-full border-[1.5px] border-lp-bg/30 px-10 py-[18px] text-[18px] font-bold text-lp-bg transition-colors hover:border-accent hover:text-accent"
          >
            {C.hero.ctaSecondary.label}
          </a>
        </div>

        <p className="mb-[60px] mt-[22px] text-[11.5px] text-accent2/60">
          {C.hero.note}
        </p>
      </div>

      {/* Ticker. The list is duplicated so the -50% loop has no seam. */}
      <div className="relative -mx-7 overflow-hidden border-t border-lp-bg/10 py-4">
        <div className="gw-ticker flex w-max gap-12">
          {[...C.ticker, ...C.ticker].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-12 whitespace-nowrap text-[15px] font-bold text-accent"
            >
              {t}
              <span aria-hidden className="text-lp-gold">
                {"\u2726"}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gw-ken {
          animation: gwKen 14s cubic-bezier(0.2, 0.7, 0.2, 1) both,
            gwFade 1.6s ease both;
        }
        .gw-glow {
          animation: gwGlow 8s ease-in-out infinite;
        }
        .gw-float {
          animation: gwFloat 7s ease-in-out infinite;
        }
        .gw-rise {
          animation: gwRise 1s both;
        }
        .gw-ticker {
          animation: gwTicker 30s linear infinite;
        }
        .gw-outline {
          color: transparent;
          -webkit-text-stroke: 2px #c8d9a7;
        }
        .gw-dot {
          color: #c9a84c;
          -webkit-text-stroke: 0;
        }
        @keyframes gwKen {
          from {
            transform: scale(1.14) translateY(0);
          }
          to {
            transform: scale(1.02) translateY(-1.5%);
          }
        }
        @keyframes gwFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes gwGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }
        @keyframes gwFloat {
          0%,
          100% {
            transform: translateY(0) rotate(var(--r, 0deg));
          }
          50% {
            transform: translateY(-16px) rotate(var(--r, 0deg));
          }
        }
        @keyframes gwRise {
          from {
            opacity: 0;
            transform: translateY(70px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gwTicker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (max-width: 767px) {
          .gw-float {
            width: clamp(74px, 21vw, 104px) !important;
            opacity: 0.82;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-ken,
          .gw-glow,
          .gw-float,
          .gw-rise,
          .gw-ticker {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export function InsuranceLogos() {
  return (
    <div className="container mx-auto px-4 py-3 mt-2">
      <p className="mb-8 mt-5 text-[10px] leading-relaxed text-muted-foreground/60 max-w-4xl mx-auto text-center px-4">*GLP-1 only after doctor's evaluation and on the basis of valid prescription</p>
    </div>
  )
}









