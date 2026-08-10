"use client"

/**
 * Knowledge Hub hero.
 *
 * Standalone - no data, no Sanity. The post cards below keep their existing
 * components so images continue to come from Sanity unchanged.
 */
export function BlogHero() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-14 pt-[70px] sm:px-7"
      style={{ background: "linear-gradient(180deg,#0E0E0F,#193231)" }}
    >
      <div
        aria-hidden
        className="bh-glow absolute -right-[100px] -top-[160px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(201,168,76,.16),transparent 65%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1360px]">
        <div className="bh-rise text-[12.5px] font-bold tracking-[0.16em] text-accent">
          KNOWLEDGE HUB
        </div>

        <h1
          className="bh-rise mb-0 mt-[22px] max-w-[15ch] font-extrabold leading-[0.96] tracking-[-0.035em] text-lp-bg"
          style={{ fontSize: "clamp(36px,7vw,104px)", animationDelay: ".05s" }}
        >
          The blog that keeps it{" "}
          <span className="font-serif font-normal italic tracking-normal text-accent">
            practical.
          </span>
        </h1>

        <p
          className="bh-rise m-0 mt-6 max-w-[58ch] leading-[1.55] text-accent2"
          style={{ fontSize: "clamp(15.5px,1.6vw,20px)", animationDelay: ".12s" }}
        >
          Evidence-based guidance on medication, nutrition, mindset and
          day-to-day habits {"\u2014"} written to be easy to apply.
        </p>
      </div>

      <style jsx>{`
        .bh-glow {
          animation: bhGlow 10s ease-in-out infinite;
        }
        .bh-rise {
          animation: bhRise 0.9s both;
        }
        @keyframes bhGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }
        @keyframes bhRise {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bh-glow,
          .bh-rise {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
