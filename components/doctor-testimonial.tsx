"use client"

import * as C from "@/content/home-v2"

/**
 * Experts marquee.
 *
 * The list is duplicated so the -50% translate loops seamlessly. The
 * duplicate is aria-hidden so a screen reader reads each person once.
 *
 * Two exports are kept because app/page.tsx imports both, even though
 * DoctorTestimonial is currently commented out there.
 */
export function DoctorsSection() {
  return (
    <section id={C.experts.id} className="overflow-hidden bg-lp-bg pb-[110px] pt-5">
      <h2
        className="m-0 mb-12 text-center font-extrabold text-lp-dark"
        style={{ fontSize: "clamp(30px,4vw,54px)" }}
      >
        Meet the{" "}
        <span className="font-serif italic tracking-normal text-lp-green">
          experts.
        </span>
      </h2>

      <div className="gw-expert-track flex w-max gap-[22px]">
        {[...C.experts.people, ...C.experts.people].map((ex, i) => (
          <div
            key={i}
            className="w-[210px] flex-none text-center"
            aria-hidden={i >= C.experts.people.length}
          >
            <img
              src={ex.img}
              alt={ex.name}
              className="block h-[230px] w-full rounded-[20px] bg-[#DDE7E2] object-cover object-top"
              style={{ boxShadow: "0 16px 38px rgba(25,50,49,.16)" }}
            />
            <div className="mt-3 text-base font-bold text-lp-dark">{ex.name}</div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-lp-green">
              {ex.role}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gw-expert-track {
          animation: gwTickerR 48s linear infinite;
        }
        @keyframes gwTickerR {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-expert-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

/** Kept so the named import in app/page.tsx keeps resolving. */
export function DoctorTestimonial() {
  return null
}
