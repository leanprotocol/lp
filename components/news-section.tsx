"use client"

import * as C from "@/content/home-v2"

/**
 * Press strip.
 *
 * Shared by the homepage, the affiliate page and /gip, so it takes a variant
 * rather than assuming a background. "light" is the default so the existing
 * callers keep their current appearance without being edited.
 *
 * Logos are greyscale until hovered. An entry with no href renders as a
 * plain logo rather than a dead link.
 */
export function NewsSection({
  variant = "light",
}: {
  variant?: "light" | "dark"
}) {
  const dark = variant === "dark"

  return (
    <section
      className="overflow-hidden px-7 py-[clamp(48px,7vh,80px)]"
      style={{ background: dark ? "#0E0E0F" : "#F9F7F2" }}
    >
      <div className="mx-auto max-w-[1180px] text-center">
        <h2
          className="m-0 font-extrabold"
          style={{
            fontSize: "clamp(22px,2.6vw,34px)",
            color: dark ? "#F9F7F2" : "#1C2B22",
          }}
        >
          Featured across India&apos;s{" "}
          <span
            className="font-serif italic tracking-normal"
            style={{ color: dark ? "#C8D9A7" : "#2D5A4E" }}
          >
            leading publications.
          </span>
        </h2>
        <p
          className="m-0 mt-2 text-[13px]"
          style={{ color: dark ? "rgba(168,190,183,.7)" : "rgba(28,43,34,.5)" }}
        >
          {C.press.sub}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-[clamp(32px,5vw,72px)] gap-y-10">
          {C.press.items.map((p) => {
            const logo = (
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="gw-press block h-[clamp(40px,4.6vw,64px)] w-auto object-contain"

              />
            )

            return p.href ? (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read the ${p.name} article`}
                className="inline-flex"
              >
                {logo}
              </a>
            ) : (
              <span key={p.name} className="inline-flex">
                {logo}
              </span>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .gw-press {
          opacity: 0.9;
          transition: opacity 0.25s, transform 0.25s;
        }
        a:hover .gw-press {
          opacity: 1;
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-press {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}
