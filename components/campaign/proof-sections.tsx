"use client";

// components/campaign/proof-sections.tsx
// Press: mobile = 2-col grid of white bordered cards (per mobile template),
// desktop = inline logo row. Proof: 2-col stat grid on mobile, image then
// quote stacked.

import Image from "next/image";
import {
  press,
  proof,
  featuredStory,
  RESULTS_DISCLAIMER,
} from "@/content/campaign";
import { Reveal } from "./reveal";

export function PressStrip() {
  return (
    <section className="bg-[#F9F7F2] px-4 pb-[46px] pt-2.5 text-center md:px-7 md:pb-[90px] md:pt-20">
      <h2 className="mb-[7px] text-[23px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1C2B22] md:mb-2.5 md:text-[clamp(24px,3vw,40px)]">
        Featured across{" "}
        <span className="font-serif-accent italic text-[#2D5A4E]">
          India's leading publications.
        </span>
      </h2>
      <p className="mb-[22px] text-[13.5px] text-[rgba(28,43,34,0.5)] md:mb-[34px] md:text-[16px] md:text-[rgba(28,43,34,0.55)]">
        <span className="md:hidden">(tap to read)</span>
        <span className="hidden md:inline">(click to read)</span>
      </p>
      {/* Mobile: 2-col card grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {press.map((pr) => (
          <a
            key={pr.name}
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[66px] min-w-0 items-center justify-center rounded-2xl border border-[rgba(28,43,34,0.1)] bg-white p-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pr.logo}
              alt={pr.name}
              loading="lazy"
              className="block max-h-[38px] max-w-full object-contain mix-blend-multiply"
            />
          </a>
        ))}
      </div>
      {/* Desktop: inline logo row */}
      <div className="mx-auto hidden max-w-[1060px] flex-wrap items-center justify-center gap-[clamp(26px,4vw,58px)] md:flex">
        {press.map((pr, i) => (
          <Reveal key={pr.name} delay={i * 60}>
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[70px] items-center justify-center px-1.5 opacity-70 transition-all hover:-translate-y-1 hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pr.logo}
                alt={pr.name}
                className="block max-h-[56px] max-w-[168px] object-contain mix-blend-multiply"
                loading="lazy"
              />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProofSection() {
  return (
    <section className="bg-[#0E0E0F] px-4 py-[46px] md:px-7 md:py-[90px]">
      <div className="mx-auto max-w-[1360px]">
        <h2 className="mb-6 max-w-[24ch] text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#F9F7F2] md:mb-11 md:text-[clamp(28px,3.8vw,54px)] md:leading-[1.04] md:tracking-[-0.035em]">
          Thousands have transformed with Lean Protocol.{" "}
          <span className="font-serif-accent italic text-[#C8D9A7]">
            It's your turn.
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-[11px] md:grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] md:gap-[18px]">
          {proof.map((p, i) => (
            <Reveal key={p.label} delay={i * 70}>
              <div className="min-w-0 rounded-[18px] border border-[rgba(249,247,242,0.1)] bg-gradient-to-br from-[#1a1a1c] to-[#0E0E0F] px-4 py-5 md:rounded-[24px] md:px-6 md:py-7 md:shadow-[inset_0_1px_0_rgba(249,247,242,0.08)]">
                <div className="text-[30px] font-extrabold leading-none tracking-[-0.03em] text-[#C8D9A7] md:text-[clamp(34px,3.6vw,50px)]">
                  {p.value}
                </div>
                <div className="mt-2 text-[12.5px] font-bold leading-snug text-[#A8BEB7] md:mt-2.5 md:text-[14.5px]">
                  {p.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 md:mt-[22px] md:grid md:items-stretch md:grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] md:gap-[22px]">
          <div className="relative h-[280px] overflow-hidden rounded-[22px] md:h-auto md:min-h-[300px] md:rounded-[26px] md:shadow-[0_26px_60px_rgba(0,0,0,0.4)]">
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredStory.imageMobile}
                alt="Atreyee's transformation, before and after"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover md:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredStory.image}
                alt="Atreyee's transformation, before and after"
                loading="lazy"
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
              />
            </>
          </div>
          <div className="mt-3 flex flex-col justify-center rounded-[22px] bg-[#193231] px-5 py-6 md:mt-0 md:rounded-[26px] md:px-8 md:py-[34px]">
            <div className="mb-[15px] inline-flex self-start rounded-full border border-[rgba(200,217,167,0.45)] bg-[rgba(200,217,167,0.16)] px-[15px] py-[7px] text-[12.5px] font-extrabold text-[#C8D9A7] md:mb-5 md:px-[18px] md:py-2 md:text-[13.5px]">
              {featuredStory.badge}
            </div>
            <p className="mb-[15px] text-[16px] leading-relaxed text-[#F9F7F2] md:mb-5 md:text-[clamp(17px,1.7vw,22px)]">
              {featuredStory.quote}
            </p>
            <div className="font-serif-accent text-[19px] italic text-[#C9A84C] md:text-[21px]">
              {featuredStory.name}
            </div>
          </div>
        </div>
        <div className="mt-7 hidden justify-center md:flex md:mt-[34px]">
          <a
            href="#plans"
            className="rounded-full bg-[#C8D9A7] px-10 py-[17px] text-[16.5px] font-extrabold text-[#193231] transition-colors hover:bg-white"
          >
            Start your journey with us
          </a>
        </div>
        <p className="mt-[18px] text-[11px] leading-relaxed text-[rgba(168,190,183,0.55)] md:mt-[26px] md:text-[11.5px]">
          {RESULTS_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
