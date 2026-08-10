"use client"

import * as C from "@/content/home-v2"

/**
 * Four metric cards on black, tilted in 3D and flattening on hover.
 *
 * The tilt is decorative. Every figure carries an asterisk and the note
 * beneath is the disclaimer those asterisks refer to - the two must not be
 * separated. See CONTENT-MAP.md section 6.
 */
const TONE: Record<string, string> = {
  sage: "#C8D9A7",
  cream: "#F9F7F2",
  gold: "#C9A84C",
  muted: "#A8BEB7",
}

export function StatsSection() {
  return (
    <section className="overflow-hidden bg-black px-7 pb-[50px] pt-[60px]">
      <div
        className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 sm:gap-[30px] lg:grid-cols-4"
        style={{ perspective: "1200px" }}
      >
        {C.stats.items.map((st) => (
          <div
            key={st.label}
            className="gw-card flex aspect-[5/4] flex-col items-center justify-center gap-2 rounded-2xl border border-lp-bg/10 p-4 text-center sm:aspect-square sm:gap-3 sm:rounded-3xl sm:p-[22px]"
            style={{
              background:
                "linear-gradient(155deg,#1a1a1c 0%,#0E0E0F 60%,#0a0a0b 100%)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="font-extrabold leading-none"
              style={{
                fontSize: "clamp(28px,4.4vw,62px)",
                color: TONE[st.tone],
                transform: "translateZ(40px)",
              }}
            >
              {st.value}
            </div>
            <div
              className="text-[12px] font-bold leading-tight text-accent2 sm:text-[14.5px]"
              style={{ transform: "translateZ(24px)" }}
            >
              {st.label}
            </div>
          </div>
        ))}
      </div>

      <p className="m-0 mt-[30px] text-center text-[11.5px] text-accent2/55">
        {C.stats.note}
      </p>

      <style jsx>{`
        .gw-card {
          transform: rotateX(9deg) rotateY(-8deg);
          box-shadow: 14px 18px 0 rgba(249, 247, 242, 0.06),
            26px 34px 60px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(249, 247, 242, 0.09);
          transition: transform 0.35s, box-shadow 0.35s;
        }
        .gw-card:hover {
          transform: rotateX(0deg) rotateY(0deg) translateY(-8px);
          box-shadow: 0 6px 0 rgba(249, 247, 242, 0.08),
            0 30px 60px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(249, 247, 242, 0.09);
        }
        @media (max-width: 639px) {
          .gw-card {
            transform: none;
            box-shadow: 0 4px 0 rgba(249, 247, 242, 0.06),
              0 14px 30px rgba(0, 0, 0, 0.5);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-card {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
