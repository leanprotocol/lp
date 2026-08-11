"use client";

// components/campaign/rest-sections.tsx
// Stories: mobile = manual snap swipe carousel (per mobile template),
// desktop = infinite ticker. Experts: ticker both, smaller mobile cards.
// Consult: mobile = image first, short kicker, title-only points.
// Symptoms: mobile = compact 2-col grid. Final CTA: mobile = stacked
// full-width buttons. Footer: mobile = 2-col grid with merged
// Legal & Contact.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  stories,
  experts,
  brandLogos,
  consultSection,
  symptoms,
  symptomsCta,
  faqs,
  footerDisclaimer,
  consultMeta,
  WA_LINK,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
} from "@/content/campaign";
import { Reveal } from "./reveal";
import styles from "./campaign.module.css";

// ---------- Stories ----------
function StoryCard({
  s,
  mobile,
}: {
  s: (typeof stories)[number];
  mobile: boolean;
}) {
  const mediaCls = mobile
    ? "block h-[290px] w-full object-cover"
    : "block h-[340px] w-full object-cover";
  return (
    <div
      className={
        mobile
          ? "w-[246px] min-w-0 flex-none snap-center overflow-hidden rounded-[20px] bg-[#193231] shadow-[0_14px_36px_rgba(25,50,49,0.16)]"
          : "w-[290px] flex-none overflow-hidden rounded-[24px] bg-[#193231] shadow-[0_18px_44px_rgba(25,50,49,0.18)]"
      }
    >
      {s.type === "video" ? (
        <video
          src={s.src}
          controls
          preload="none"
          playsInline
          className={mediaCls + " bg-[#0E0E0F]"}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={s.src} alt={s.name} loading="lazy" className={mediaCls} />
      )}
      <div className={mobile ? "px-[17px] pb-[17px] pt-[15px]" : "px-[22px] pb-5 pt-[18px]"}>
        <div
          className={
            "mb-2 inline-flex rounded-full border border-[rgba(200,217,167,0.4)] bg-[rgba(200,217,167,0.16)] font-bold text-[#C8D9A7] " +
            (mobile ? "px-[11px] py-1 text-[10.5px]" : "px-[13px] py-[5px] text-[11.5px]")
          }
        >
          {"\u2713"} VERIFIED{mobile ? "" : " RESULT"}
        </div>
        <div className={"font-extrabold tracking-[-0.01em] text-[#F9F7F2] " + (mobile ? "text-[17px]" : "text-[19px]")}>
          {s.name}
        </div>
        <div className={"mt-0.5 text-[#A8BEB7] " + (mobile ? "text-[13px]" : "text-[14px]")}>
          {s.result}
        </div>
      </div>
    </div>
  );
}

export function StoriesMarquee() {
  return (
    <section className="overflow-hidden rounded-t-[32px] bg-[#F9F7F2] py-11 md:rounded-t-[44px] md:py-[90px]">
      <div className="mx-auto max-w-[1360px] px-4 pb-[22px] md:px-7 md:pb-8">
        <h2 className="mb-[7px] text-[25px] font-extrabold leading-[1.14] tracking-[-0.03em] text-[#1C2B22] md:mb-2 md:text-[clamp(26px,3.4vw,46px)]">
          Real stories,{" "}
          <span className="font-serif-accent italic text-[#2D5A4E]">
            real results.
          </span>
        </h2>
        <p className="text-[14.5px] text-[rgba(28,43,34,0.6)] md:text-[16.5px]">
          <span className="md:hidden">Verified transformations from members</span>
          <span className="hidden md:inline">
            Verified transformations from Lean Protocol members
          </span>
        </p>
      </div>
      {/* Mobile: manual snap swipe */}
      <div
        className={
          "flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 md:hidden " +
          styles.noScrollbar
        }
      >
        {stories.map((s) => (
          <StoryCard key={s.name} s={s} mobile />
        ))}
      </div>
      {/* Desktop: infinite ticker */}
      <div
        className={"hidden w-max gap-5 md:flex " + styles.ticker}
        style={{ "--ticker-dur": "60s" } as React.CSSProperties}
      >
        {[...stories, ...stories].map((s, i) => (
          <StoryCard key={s.name + i} s={s} mobile={false} />
        ))}
      </div>
      <p className="mt-[18px] text-center text-[11px] text-[rgba(28,43,34,0.45)] md:mt-6 md:text-[11.5px]">
        *Individual results may vary.
      </p>
    </section>
  );
}

// ---------- Experts ----------
export function ExpertsSection() {
  const loop = [...experts, ...experts];
  return (
    <section className="overflow-hidden bg-[#0E0E0F] py-11 md:py-[90px]">
      <div className="mx-auto max-w-[1360px] px-4 pb-6 md:px-7 md:pb-[42px]">
        <div className="mb-[11px] text-[11px] font-extrabold tracking-[0.15em] text-[#C8D9A7] md:mb-4 md:text-[12.5px] md:font-bold md:tracking-[0.16em]">
          PEOPLE ASK HOW WE DO IT
        </div>
        <h2 className="max-w-[20ch] text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#F9F7F2] md:text-[clamp(28px,3.8vw,54px)] md:leading-[1.03] md:tracking-[-0.035em]">
          It's only possible because of our{" "}
          <span className="font-serif-accent italic text-[#C8D9A7]">
            experts.
          </span>
        </h2>
      </div>
      <div className="overflow-hidden">
        <div
          className={"flex w-max gap-3.5 md:gap-5 " + styles.ticker}
          style={{ "--ticker-dur": "46s" } as React.CSSProperties}
        >
          {loop.map((ex, i) => (
            <div
              key={ex.name + i}
              className="w-[142px] flex-none text-center md:w-[200px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ex.img}
                alt={ex.name}
                loading="lazy"
                className="block h-[165px] w-full rounded-2xl bg-[#22453c] object-cover object-top md:h-[220px] md:rounded-[20px]"
              />
              <div className="mt-2 text-[13.5px] font-extrabold leading-[1.3] tracking-[-0.01em] text-[#F9F7F2] md:mt-3 md:text-[16px]">
                {ex.name}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold leading-[1.3] text-[#C8D9A7] md:text-[12.5px]">
                {ex.role}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-[34px] max-w-[1360px] px-4 text-center md:mt-[52px] md:px-7">
        <div className="mb-[18px] text-[11px] font-extrabold tracking-[0.15em] text-[rgba(168,190,183,0.6)] md:mb-[26px] md:text-[12.5px] md:font-bold md:tracking-[0.16em]">
          BRANDS TRUST US
        </div>
        <div className="mx-auto flex max-w-[720px] flex-wrap items-center justify-center gap-[26px] rounded-[20px] bg-[#F9F7F2] px-6 py-6 md:gap-[52px] md:rounded-[24px] md:px-10 md:py-8">
          {brandLogos.map((b) =>
            b.img ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={b.name}
                src={b.img}
                alt={b.name}
                loading="lazy"
                className="h-8 w-auto object-contain md:h-11"
              />
            ) : (
              /* MrMed has no usable logo asset - same styled wordmark
                 the affiliate page uses (components/affiliate-lp/social-trust.tsx) */
              <div
                key={b.name}
                className="flex items-center text-[24px] font-bold tracking-tight text-[#0066CC] md:text-[30px]"
              >
                <span className="text-[#4CAF50]">Mr</span>Med
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- Consult ----------
export function ConsultSection({
  price,
  was,
}: {
  price?: string;
  was?: string;
}) {
  return (
    <section className="bg-[#193231] px-4 py-11 md:px-7 md:py-[90px]">
      <div className="mx-auto max-w-[1360px] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-center md:gap-[clamp(28px,4vw,64px)]">
        {/* Image first on mobile (per template), second column on desktop */}
        <div className="mb-6 h-[290px] overflow-hidden rounded-[22px] bg-[#0E1512] md:order-2 md:mb-0 md:h-auto md:rounded-[30px] md:shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={consultSection.imageMobile}
            alt="GLP-1 expert doctor consultation"
            loading="lazy"
            className="block h-full w-full object-cover object-top md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={consultSection.image}
            alt="GLP-1 expert doctor consultation"
            loading="lazy"
            className="hidden h-full w-full object-cover object-top md:block md:h-[min(56vh,470px)]"
          />
        </div>
        <div className="md:order-1">
          <div className="mb-[11px] text-[11px] font-extrabold tracking-[0.15em] text-[#C8D9A7] md:mb-4 md:text-[12.5px] md:font-bold md:tracking-[0.16em]">
            <span className="md:hidden">STILL NOT SURE?</span>
            <span className="hidden md:inline">{consultSection.kicker}</span>
          </div>
          <h2 className="mb-[11px] max-w-[18ch] text-[27px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#F9F7F2] md:mb-3.5 md:text-[clamp(28px,3.8vw,54px)] md:leading-[1.03] md:tracking-[-0.035em]">
            Consult a GLP-1 doctor{" "}
            <span className="font-serif-accent italic text-[#C8D9A7]">
              first.
            </span>
          </h2>
          <p className="mb-[22px] max-w-[48ch] text-[15.5px] leading-relaxed text-[#A8BEB7] md:mb-8 md:text-[17.5px]">
            <span className="md:hidden">No programme commitment required.</span>
            <span className="hidden md:inline">
              Let our experts guide you {"\u2014"} one step at a time. No
              programme commitment required.
            </span>
          </p>
          <div className="mb-6 flex flex-col gap-[11px] md:mb-[34px] md:grid md:gap-4">
            {consultSection.points.map((c) => (
              <div
                key={c.n}
                className="flex min-w-0 items-center gap-[13px] md:items-start md:gap-[18px]"
              >
                <div className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border border-[rgba(200,217,167,0.45)] bg-[rgba(200,217,167,0.16)] text-[12.5px] font-extrabold text-[#C8D9A7] md:h-[34px] md:w-[34px] md:text-[15px]">
                  {c.n}
                </div>
                <div className="min-w-0">
                  <div className="text-[15.5px] font-bold tracking-[-0.01em] text-[#F9F7F2] md:mb-1 md:text-[18px] md:font-extrabold">
                    {c.title}
                  </div>
                  {/* Point body text: desktop only (mobile shows titles) */}
                  <div className="hidden text-[15.5px] leading-normal text-[#A8BEB7] md:block">
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            <div className="flex-none">
              <span className="text-[14px] text-[#A8BEB7] line-through md:text-[16px]">
                {was || consultMeta.fallbackWas}
              </span>{" "}
              <span className="text-[28px] font-extrabold tracking-[-0.02em] text-[#C8D9A7] md:text-[34px]">
                {price || consultMeta.fallbackPrice}
              </span>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[150px] flex-1 rounded-full bg-[#C8D9A7] px-5 py-[15px] text-center text-[15.5px] font-extrabold text-[#193231] transition-colors hover:bg-white md:flex-none md:px-[34px] md:py-4 md:text-[16.5px]"
            >
              Book consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Symptoms ----------
export function SymptomsSection() {
  return (
    <section className="rounded-t-[32px] bg-[#F9F7F2] px-4 py-11 md:rounded-t-[44px] md:px-7 md:py-[90px]">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-[11px] text-[11px] font-extrabold tracking-[0.15em] text-[#2D5A4E] md:mb-4 md:text-[12.5px] md:font-bold md:tracking-[0.16em]">
          GUIDED BY SCIENCE
        </div>
        <h2 className="mb-[22px] max-w-[20ch] text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#1C2B22] md:mb-10 md:text-[clamp(28px,3.8vw,52px)] md:leading-[1.06] md:tracking-[-0.035em]">
          Do you relate to{" "}
          <span className="font-serif-accent italic text-[#2D5A4E]">
            any of these?
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-[11px] md:grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] md:gap-[18px]">
          {symptoms.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 70}>
              <div className="flex min-w-0 flex-col justify-center rounded-[14px] border border-[rgba(28,43,34,0.1)] bg-white px-[11px] py-3 shadow-[0_8px_20px_rgba(25,50,49,0.05)] [aspect-ratio:1/0.82] md:aspect-auto md:rounded-[24px] md:px-[26px] md:py-7 md:shadow-[0_12px_32px_rgba(25,50,49,0.06)] md:transition-all md:hover:-translate-y-1.5 md:hover:border-[rgba(45,90,78,0.35)]">
                <div className="mb-[5px] text-[12.5px] font-extrabold leading-[1.22] tracking-[-0.02em] text-[#1C2B22] md:mb-2 md:text-[19px]">
                  {s.title}
                </div>
                <p className="font-serif-accent text-[12.5px] italic leading-[1.3] text-[#2D5A4E] md:text-[18px] md:leading-snug">
                  {"\u201C"}
                  {s.quote}
                  {"\u201D"}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 rounded-[20px] bg-[#193231] p-5 md:mt-[30px] md:flex md:flex-wrap md:items-center md:gap-[22px] md:rounded-[24px] md:px-[30px] md:py-[26px]">
          <p className="mb-4 text-[15.5px] leading-normal text-[#F9F7F2] md:mb-0 md:min-w-[260px] md:flex-1 md:text-[17px]">
            {symptomsCta}
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full bg-[#C8D9A7] p-3.5 text-center text-[15.5px] font-extrabold text-[#193231] transition-colors hover:bg-white md:inline-block md:px-[30px] md:py-[15px] md:text-[16px]"
          >
            Chat with a doctor
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#F9F7F2] px-4 pb-[46px] pt-2.5 md:px-7 md:pb-[100px] md:pt-5">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-5 text-[25px] font-extrabold leading-[1.14] tracking-[-0.03em] text-[#1C2B22] md:mb-[34px] md:text-center md:text-[clamp(26px,3.4vw,46px)]">
          Frequently asked{" "}
          <span className="font-serif-accent italic text-[#2D5A4E]">
            questions.
          </span>
        </h2>
        <div className="flex flex-col gap-2.5 md:gap-3">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <button
                key={f.q}
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? -1 : i)}
                className={
                  "rounded-2xl border bg-white p-[18px] text-left shadow-[0_8px_22px_rgba(25,50,49,0.05)] transition-colors md:rounded-[20px] md:px-7 md:py-6 md:shadow-[0_10px_28px_rgba(25,50,49,0.06)] " +
                  (on
                    ? "border-[rgba(45,90,78,0.4)]"
                    : "border-[rgba(28,43,34,0.1)]")
                }
              >
                <div className="flex items-start justify-between gap-3.5 md:gap-5">
                  <div className="min-w-0 text-[15.5px] font-extrabold leading-[1.35] tracking-[-0.015em] text-[#1C2B22] md:text-[18px]">
                    {f.q}
                  </div>
                  <div className="flex-none text-[20px] font-extrabold leading-none text-[#2D5A4E] md:text-[22px]">
                    {on ? "\u2212" : "+"}
                  </div>
                </div>
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-300"
                  style={{
                    gridTemplateRows: on ? "1fr" : "0fr",
                    opacity: on ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="mt-3 text-[14.5px] leading-relaxed text-[rgba(28,43,34,0.68)] md:mt-3.5 md:text-[16.5px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Final CTA ----------
export function FinalCta() {
  return (
    <section className="bg-gradient-to-b from-[#0E0E0F] to-[#193231] px-4 py-14 text-center md:px-7 md:py-[100px]">
      <h2 className="mb-1 text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#F9F7F2] md:mb-1.5 md:text-[clamp(32px,5vw,74px)] md:leading-none md:tracking-[-0.04em]">
        Your first step?
      </h2>
      <p className="mb-[26px] font-serif-accent text-[29px] italic text-[#C8D9A7] md:mb-10 md:text-[clamp(26px,4vw,56px)]">
        A conversation.
      </p>
      <div className="mx-auto flex max-w-[430px] flex-col gap-[11px] md:max-w-none md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-[#C8D9A7] p-[17px] text-[16.5px] font-extrabold text-[#193231] transition-colors hover:bg-white md:px-10 md:py-[18px] md:text-[17px]"
        >
          Chat with experts {"\u2192"}
        </a>
        <a
          href="#plans"
          className="block rounded-full border-[1.5px] border-[rgba(249,247,242,0.35)] p-[17px] text-[16.5px] font-bold text-[#F9F7F2] transition-colors hover:border-[#C8D9A7] hover:text-[#C8D9A7] md:px-10 md:py-[18px] md:text-[17px]"
        >
          Back to plans
        </a>
      </div>
    </section>
  );
}

// ---------- Footer ----------
export function CampaignFooter() {
  return (
    <footer className="bg-[#0E0E0F] px-4 pb-[110px] pt-10 text-[#cfd6cf] md:px-7 md:pb-9 md:pt-[60px]">
      <div className="mx-auto max-w-[1360px]">
        {/* Mobile: logo + blurb then 2-col grid (Quick Links | Legal & Contact) */}
        <div className="md:hidden">
          <Image
            src="/logo.png"
            alt="Lean Protocol"
            width={120}
            height={30}
            className="h-[42px] w-auto"
          />
          <p className="mb-[26px] mt-3 text-[13.5px] leading-relaxed text-[#8f978f]">
            Modern weight loss medication, prescribed online and delivered to
            your door.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-[11px] text-[13px] font-extrabold text-[#F9F7F2]">
                Quick Links
              </div>
              <div className="flex flex-col gap-2 text-[13.5px]">
                <Link href="/" className="text-[#9aa79b]">Home</Link>
                <Link href="/our-why" className="text-[#9aa79b]">Our Why</Link>
                <a href="#plans" className="text-[#9aa79b]">Plans</a>
                <Link href="/blog" className="text-[#9aa79b]">Knowledge Hub</Link>
              </div>
            </div>
            <div>
              <div className="mb-[11px] text-[13px] font-extrabold text-[#F9F7F2]">
                Legal & Contact
              </div>
              <div className="flex flex-col gap-2 text-[13.5px]">
                <Link href="/terms-conditions" className="text-[#9aa79b]">Terms & Conditions</Link>
                <Link href="/privacy-policy" className="text-[#9aa79b]">Privacy Policy</Link>
                <a href={"mailto:" + SUPPORT_EMAIL} className="break-words text-[#9aa79b]">
                  {SUPPORT_EMAIL}
                </a>
                <a href={"tel:" + SUPPORT_PHONE} className="text-[#9aa79b]">
                  {SUPPORT_PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden flex-wrap items-start justify-between gap-11 md:flex">
          <div className="max-w-[300px]">
            <Image
              src="/logo.png"
              alt="Lean Protocol"
              width={140}
              height={36}
              className="h-[50px] w-auto"
            />
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#8f978f]">
              Modern weight loss medication, prescribed online and delivered to
              your door.
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            <div>
              <div className="mb-3.5 text-[14.5px] font-bold text-[#F9F7F2]">
                Quick Links
              </div>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/" className="text-[#9aa79b] hover:text-[#C8D9A7]">Home</Link>
                <Link href="/our-why" className="text-[#9aa79b] hover:text-[#C8D9A7]">Our Why</Link>
                <a href="#plans" className="text-[#9aa79b] hover:text-[#C8D9A7]">Plans</a>
                <Link href="/blog" className="text-[#9aa79b] hover:text-[#C8D9A7]">Knowledge Hub</Link>
              </div>
            </div>
            <div>
              <div className="mb-3.5 text-[14.5px] font-bold text-[#F9F7F2]">
                Legal
              </div>
              <div className="flex flex-col gap-2 text-[14px]">
                <Link href="/terms-conditions" className="text-[#9aa79b] hover:text-[#C8D9A7]">Terms & Conditions</Link>
                <Link href="/privacy-policy" className="text-[#9aa79b] hover:text-[#C8D9A7]">Privacy Policy</Link>
                <Link href="/refund-policy" className="text-[#9aa79b] hover:text-[#C8D9A7]">Refund Policy</Link>
              </div>
            </div>
            <div>
              <div className="mb-3.5 text-[14.5px] font-bold text-[#F9F7F2]">
                Contact
              </div>
              <div className="flex flex-col gap-2 text-[14px] text-[#9aa79b]">
                <a href={"mailto:" + SUPPORT_EMAIL} className="hover:text-[#C8D9A7]">
                  {SUPPORT_EMAIL}
                </a>
                <a href={"tel:" + SUPPORT_PHONE} className="hover:text-[#C8D9A7]">
                  {SUPPORT_PHONE}
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8D9A7]">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[30px] border-t border-[rgba(255,255,255,0.1)] pt-[18px] text-[10.5px] leading-[1.7] text-[#6f776f] md:mt-[42px] md:pt-6 md:text-[11.5px]">
          {footerDisclaimer}
          <div className="mt-2 md:mt-2.5">
            {"\u00A9"} 2026 Lean Protocol Pvt Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Sticky mobile buy bar ----------
export function StickyBuyBar({
  label,
  price,
  planId,
  isConsult,
  onBuyNow,
  isCheckoutLoading,
}: {
  label: string;
  price: string;
  planId: string | null;
  isConsult: boolean;
  onBuyNow: (planId: string) => void;
  isCheckoutLoading: boolean;
}) {
  const cls =
    "min-w-0 flex-1 whitespace-nowrap rounded-full bg-[#2D5A4E] px-3 py-[15px] text-center text-[15.5px] font-extrabold text-[#F9F7F2] transition-colors hover:bg-[#193231]";
  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] flex items-center gap-3 border-t border-[rgba(28,43,34,0.14)] bg-[rgba(249,247,242,0.97)] px-4 py-[11px] shadow-[0_-8px_26px_rgba(25,50,49,0.1)] backdrop-blur-md md:hidden">
      <div className="min-w-0 flex-none">
        <div className="text-[10.5px] font-bold tracking-[0.06em] text-[rgba(28,43,34,0.5)]">
          {label}
        </div>
        <div className="text-[20px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#2D5A4E]">
          {price}
        </div>
      </div>
      {isConsult ? (
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
        >
          Book consultation
        </a>
      ) : (
        <button
          type="button"
          onClick={() => planId && onBuyNow(planId)}
          disabled={isCheckoutLoading || !planId}
          className={cls + " disabled:cursor-not-allowed disabled:opacity-60"}
        >
          {isCheckoutLoading ? "Opening\u2026" : "Get started now"}
        </button>
      )}
    </div>
  );
}
