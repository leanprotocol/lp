"use client"

import * as C from "@/content/home-v2"

/**
 * Benefit marquees.
 *
 * Two rows running in opposite directions. Each list is duplicated so the
 * -50% translate loops with no visible seam; the duplicate is aria-hidden so
 * a screen reader reads each benefit once.
 *
 * Artwork paths live in content/home-v2.ts. A missing file hides the image
 * and leaves the tinted circle behind it, so a broken path degrades to a
 * plain dot rather than a broken-image icon.
 *
 * Default export: app/page.tsx loads this through next/dynamic with no named
 * import, so the default must stay.
 */
function Pill({
  item,
  dark,
  hidden,
}: {
  item: { text: string; image: string }
  dark: boolean
  hidden: boolean
}) {
  return (
    <div
      aria-hidden={hidden}
      className={
        dark
          ? "flex items-center gap-3 rounded-full bg-dark py-[11px] pl-[13px] pr-6"
          : "flex items-center gap-3 rounded-full border border-lp-green/[0.12] bg-white py-[11px] pl-[13px] pr-6"
      }
      style={{
        boxShadow: dark
          ? "0 10px 24px rgba(25,50,49,.14)"
          : "0 10px 24px rgba(25,50,49,.08)",
      }}
    >
      <span
        className="relative block h-11 w-11 flex-none overflow-hidden rounded-full"
        style={{ background: dark ? "#2D5A4E" : "#EAF0DC" }}
      >
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      </span>
      <span
        className={
          dark
            ? "whitespace-nowrap text-[17px] font-bold text-lp-bg"
            : "whitespace-nowrap text-[17px] font-bold text-lp-dark"
        }
      >
        {item.text}
      </span>
    </div>
  )
}

export default function BenefitsMarquee() {
  return (
    <section
      className="overflow-hidden pb-[110px] pt-10"
      style={{ background: "linear-gradient(180deg,#F9F7F2,#EFF2E2)" }}
    >
      <h2
        className="mx-auto mb-11 max-w-[900px] px-7 text-center font-extrabold text-lp-dark"
        style={{ fontSize: "clamp(26px,3.2vw,44px)" }}
      >
        Breaking free from obesity improves{" "}
        <span className="font-serif italic tracking-normal text-lp-green">
          everything{"\u2026"}
        </span>
      </h2>

      <div className="flex flex-col gap-[18px]">
        <div className="gw-mq-a flex w-max gap-4">
          {[...C.benefits.rowA, ...C.benefits.rowA].map((item, i) => (
            <Pill
              key={`a-${i}`}
              item={item}
              dark={false}
              hidden={i >= C.benefits.rowA.length}
            />
          ))}
        </div>

        <div className="gw-mq-b flex w-max gap-4">
          {[...C.benefits.rowB, ...C.benefits.rowB].map((item, i) => (
            <Pill
              key={`b-${i}`}
              item={item}
              dark
              hidden={i >= C.benefits.rowB.length}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .gw-mq-a {
          animation: gwMqA 42s linear infinite;
        }
        .gw-mq-b {
          animation: gwMqB 48s linear infinite;
        }
        @keyframes gwMqA {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes gwMqB {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-mq-a,
          .gw-mq-b {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
