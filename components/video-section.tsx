"use client"

import * as C from "@/content/home-v2"

/**
 * Explainer video with trust pills beneath.
 *
 * preload="metadata" so the poster frame and duration are available without
 * pulling the whole file on page load - this sits below the fold and most
 * visitors never press play.
 */
export function VideoSection() {
  return (
    <section className="bg-lp-bg px-7 pb-[110px] pt-20">
      <div className="mx-auto max-w-[1180px] text-center">
        <h2
          className="mb-10 font-extrabold text-lp-dark"
          style={{ fontSize: "clamp(28px,3.6vw,48px)" }}
        >
          Understand the process behind{" "}
          <span className="font-serif italic tracking-normal text-lp-green">
            amazing results.
          </span>
        </h2>

        <div
          className="overflow-hidden rounded-[34px]"
          style={{ boxShadow: "0 44px 110px rgba(25,50,49,.28)" }}
        >
          <video
            src={C.explainer.videoSrc}
            poster={C.explainer.poster}
            controls
            preload="metadata"
            className="block w-full bg-black object-cover"
            style={{ aspectRatio: "16 / 9" }}
          />
        </div>

        <div className="mt-[26px] flex flex-wrap justify-center gap-3">
          {C.explainer.points.map((p) => (
            <div
              key={p}
              className="rounded-full border border-lp-green/20 bg-white px-[22px] py-[11px] text-sm font-bold text-lp-green"
              style={{ boxShadow: "0 8px 22px rgba(25,50,49,.08)" }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
