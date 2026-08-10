"use client"

import * as C from "@/content/our-why"

/**
 * /our-why - the whole page.
 *
 * Five sections: hero, manifesto, the problem, the platform image, the
 * framework, and a closing CTA. Header and Footer are supplied by
 * app/our-why/page.tsx, which already imports them.
 *
 * The delivered design used CSS scroll-driven animations
 * (animation-timeline: view()), which Safari and Firefox do not support. The
 * entrance animations here run on load instead - the page is short enough
 * that a scroll-linked reveal buys little.
 */
export default function OurWhyHero() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-black px-5 pb-12 pt-[60px] sm:px-7 md:min-h-[88vh] md:pb-[70px]">
        <img
          src={C.hero.bgImage}
          alt=""
          aria-hidden
          className="ow-ken absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "100% 30%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(14,14,15,.86) 0%,rgba(14,14,15,.35) 40%,rgba(14,14,15,.9) 100%)",
          }}
        />
        <div
          aria-hidden
          className="ow-glow absolute -left-[100px] -top-[140px] h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(200,217,167,.2),transparent 65%)",
          }}
        />

        <div className="relative z-[2] mx-auto w-full max-w-[1360px]">
          <div className="ow-rise inline-flex rounded-full border border-accent/40 px-5 py-[9px] text-[12.5px] font-bold tracking-[0.16em] text-accent">
            {C.hero.eyebrow}
          </div>

          <h1
            className="ow-rise mb-0 mt-[26px] max-w-[14ch] font-extrabold leading-[0.95] tracking-[-0.035em] text-lp-bg"
            style={{ fontSize: "clamp(36px,8vw,116px)", animationDelay: ".1s" }}
          >
            {C.hero.headingA}{" "}
            <span className="font-serif italic font-normal tracking-normal text-accent">
              {C.hero.headingB}
            </span>
          </h1>

          <div
            className="ow-rise mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
            style={{ animationDelay: ".25s" }}
          >
            <a
              href={C.hero.ctaPrimary.href}
              className="rounded-full bg-accent px-8 py-4 text-center text-[16px] font-extrabold text-dark transition-colors hover:bg-white sm:px-10 sm:py-[18px] sm:text-[18px]"
              style={{ boxShadow: "0 14px 40px rgba(200,217,167,.22)" }}
            >
              {C.hero.ctaPrimary.label}
            </a>
            <a
              href={C.hero.ctaSecondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-[1.5px] border-lp-bg/30 px-8 py-4 text-center text-[16px] font-bold text-lp-bg transition-colors hover:border-accent hover:text-accent sm:px-10 sm:py-[18px] sm:text-[18px]"
            >
              {C.hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- manifesto ---------- */}
      <section className="bg-dark px-7 py-[clamp(80px,12vh,140px)]">
        <div className="mx-auto max-w-[1100px]">
          <p
            className="ow-rise m-0 font-medium leading-[1.12] tracking-[-0.03em] text-lp-bg"
            style={{ fontSize: "clamp(26px,4.4vw,60px)" }}
          >
            {C.manifesto.lead}{" "}
            <span className="font-serif italic font-normal tracking-normal text-accent">
              {C.manifesto.accent}
            </span>
          </p>
        </div>
      </section>

      {/* ---------- the problem ---------- */}
      <section className="rounded-t-[44px] bg-lp-bg px-7 pb-[90px] pt-[110px]">
        <div className="mx-auto grid max-w-[1360px] items-start gap-[clamp(30px,5vw,80px)] [grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr))]">
          <div className="ow-rise">
            <div className="mb-[18px] text-[12.5px] font-bold tracking-[0.16em] text-lp-green">
              {C.problem.eyebrow}
            </div>
            <h2
              className="m-0 mb-[22px] font-extrabold leading-[1.04] tracking-[-0.03em] text-lp-dark"
              style={{ fontSize: "clamp(30px,4.4vw,60px)" }}
            >
              {C.problem.headingA}{" "}
              <span className="font-serif italic font-normal tracking-normal text-lp-green">
                {C.problem.headingB}
              </span>
            </h2>
            <p
              className="m-0 max-w-[42ch] leading-[1.55] text-lp-dark/60"
              style={{ fontSize: "clamp(16px,1.6vw,21px)" }}
            >
              {C.problem.body}
            </p>
          </div>

          <div className="ow-rise grid gap-3.5" style={{ animationDelay: ".1s" }}>
            {C.problem.silos.map((s) => (
              <div
                key={s.who}
                className="flex items-center gap-4 rounded-[20px] border border-lp-dark/10 bg-white px-5 py-5 sm:gap-[18px] sm:px-[26px]"
                style={{ boxShadow: "0 10px 30px rgba(25,50,49,.06)" }}
              >
                <div className="min-w-[92px] text-[14px] font-extrabold text-lp-green sm:min-w-[118px] sm:text-[15px]">
                  {s.who}
                </div>
                <div aria-hidden className="h-[26px] w-px flex-none bg-lp-dark/[0.12]" />
                <div className="text-[15px] text-lp-dark/70 sm:text-[16.5px]">{s.has}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- platform ---------- */}
      <section className="bg-lp-bg px-7 pb-[90px]">
        <div
          className="ow-pop relative mx-auto max-w-[1360px] overflow-hidden rounded-[34px]"
          style={{ boxShadow: "0 44px 100px rgba(25,50,49,.26)" }}
        >
          <img
            src={C.platform.image}
            alt="The Lean Protocol care team"
            className="block w-full object-cover"
            style={{ height: "clamp(320px,58vh,560px)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 px-6 pb-[34px] pt-[120px] text-lp-bg sm:px-[34px]"
            style={{ background: "linear-gradient(transparent,rgba(14,14,15,.9))" }}
          >
            <h3
              className="m-0 mb-2.5 max-w-[20ch] font-extrabold tracking-[-0.02em]"
              style={{ fontSize: "clamp(22px,3vw,42px)" }}
            >
              {C.platform.heading}
            </h3>
            <p
              className="m-0 max-w-[56ch] leading-[1.5] text-accent2"
              style={{ fontSize: "clamp(14.5px,1.4vw,19px)" }}
            >
              {C.platform.body}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- framework ---------- */}
      <section className="bg-black px-7 py-[110px]">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-[18px] text-[12.5px] font-bold tracking-[0.16em] text-accent">
            {C.framework.eyebrow}
          </div>
          <h2
            className="m-0 mb-5 max-w-[18ch] font-extrabold leading-[1.02] tracking-[-0.035em] text-lp-bg"
            style={{ fontSize: "clamp(30px,4.6vw,66px)" }}
          >
            {C.framework.headingA}{" "}
            <span className="font-serif italic font-normal tracking-normal text-accent">
              {C.framework.headingB}
            </span>
          </h2>
          <p
            className="m-0 mb-14 max-w-[60ch] leading-[1.55] text-accent2"
            style={{ fontSize: "clamp(15.5px,1.5vw,20px)" }}
          >
            {C.framework.body}
          </p>

          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {C.framework.pillars.map((p, i) => (
              <div
                key={p.num}
                className="ow-card ow-rise rounded-[26px] border border-lp-bg/10 px-7 pb-9 pt-8 sm:px-[30px]"
                style={{
                  background: "linear-gradient(160deg,#1a1a1c,#0E0E0F 70%)",
                  boxShadow: "inset 0 1px 0 rgba(249,247,242,.08)",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <div className="text-[46px] font-extrabold leading-none tracking-[-0.03em] text-accent/30">
                  {p.num}
                </div>
                <h3 className="mb-3 mt-[18px] text-2xl font-extrabold tracking-[-0.02em] text-lp-bg">
                  {p.title}
                </h3>
                <p className="m-0 text-base leading-[1.55] text-accent2">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section
        className="px-7 pb-[120px] pt-[100px] text-center"
        style={{ background: "linear-gradient(180deg,#0E0E0F,#193231)" }}
      >
        <h2
          className="m-0 mb-2 font-extrabold leading-[1.02] tracking-[-0.035em] text-lp-bg"
          style={{ fontSize: "clamp(30px,5vw,72px)" }}
        >
          {C.closing.headingA}
        </h2>
        <p
          className="m-0 mb-10 font-serif italic text-accent"
          style={{ fontSize: "clamp(24px,4vw,58px)" }}
        >
          {C.closing.headingB}
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <a
            href={C.closing.ctaPrimary.href}
            className="rounded-full bg-accent px-9 py-[18px] text-[17px] font-extrabold text-dark transition-colors hover:bg-white"
          >
            {C.closing.ctaPrimary.label}
          </a>
          <a
            href={C.closing.ctaSecondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-[1.5px] border-lp-bg/35 px-9 py-[18px] text-[17px] font-bold text-lp-bg transition-colors hover:border-accent hover:text-accent"
          >
            {C.closing.ctaSecondary.label}
          </a>
        </div>
      </section>

      <style jsx>{`
        .ow-ken {
          animation: owKen 16s cubic-bezier(0.2, 0.7, 0.2, 1) both,
            owFade 1.4s ease both;
        }
        .ow-glow {
          animation: owGlow 9s ease-in-out infinite;
        }
        .ow-rise {
          animation: owRise 1s both;
        }
        .ow-pop {
          animation: owPop 1.1s both;
        }
        .ow-card {
          transition: transform 0.35s, border-color 0.35s;
        }
        .ow-card:hover {
          transform: translateY(-8px);
          border-color: rgba(200, 217, 167, 0.45);
        }
        @keyframes owKen {
          from {
            transform: scale(1.14);
          }
          to {
            transform: scale(1.02);
          }
        }
        @keyframes owFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes owGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }
        @keyframes owRise {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes owPop {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ow-ken,
          .ow-glow,
          .ow-rise,
          .ow-pop,
          .ow-card {
            animation: none !important;
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
