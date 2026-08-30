// app/psp/page.tsx
// White-labelled Patient Support Programme page for pharmaceutical
// partners. Seven sections, image-led, deliberately short.
//
// Copy lives in content/psp.ts and is length-constrained: visible
// main-page copy must stay under 950 words. Do not add explanatory
// sentences without removing others.

import type { Metadata } from "next";
import {
  HERO,
  VALUE,
  EVIDENCE,
  JOURNEY,
  RUN,
  AREAS,
  MODEL,
  PILOT,
  FINAL,
  CTA,
  DISCLAIMER,
} from "@/content/psp";
import { PspPartners, PspGoogle, PspNews } from "@/components/psp/psp-strips";
import {
  PspHeader,
  Reveal,
  Faq,
  RequestForm,
} from "@/components/psp/psp-interactive";

export const metadata: Metadata = {
  title: "White-Label Patient Support Programmes for Pharma | Lean Protocol",
  description:
    "Lean Protocol runs white-labelled patient support for metabolic and chronic therapies across India, including education, follow-ups, diagnostics, delivery and doctor coordination.",
  alternates: { canonical: "https://www.leanprotocol.in/psp" },
  openGraph: {
    title: "White-Label Patient Support Programmes for Pharma | Lean Protocol",
    description:
      "Patient support run under your brand, for metabolic and chronic therapies across India.",
    url: "https://www.leanprotocol.in/psp",
    siteName: "Lean Protocol",
    type: "website",
    images: ["/og-image.jpg"],
  },
};

export default function PspPage() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <PspHeader />

      <main id="main">
        {/* ---------- 1. Hero ---------- */}
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <p className="label">{HERO.eyebrow}</p>
              <h1>{HERO.h1}</h1>
              <p className="big">{HERO.copy}</p>
              <div className="hero-ctas">
                <a href="#request" className="btn btn-sage">
                  {CTA.primary}
                </a>
                <a href="#request" className="link-under">
                  {CTA.secondary}
                </a>
              </div>
              <p className="fine">{HERO.audience}</p>
            </div>

            {/* Care-team photograph. Place at /public/psp/hero-care-team.webp */}
            <div className="well well-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/psp/hero-care-team.webp"
                alt="A Lean Protocol care team reviewing a patient nutrition plan together."
                width={900}
                height={1200}
              />
            </div>
          </div>
        </section>

        {/* ---------- 2. Business value + evidence ---------- */}
        <section className="sec sec-ivory">
          <div className="wrap">
            <Reveal>
              <p className="label">{VALUE.label}</p>
              <h2>{VALUE.h2}</h2>
              <p className="big">{VALUE.intro}</p>
            </Reveal>

            <Reveal>
              <div className="ev">
                <h3>{EVIDENCE.h3}</h3>
                <div className="ev-row">
                  {EVIDENCE.stats.map((s) => (
                    <div key={s.label}>
                      <span className="ev-val">{s.value}</span>
                      <span className="ev-lab">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="ev-note">
                  <p className="fine">
                    {EVIDENCE.note}{" "}
                    <a
                      className="link-under"
                      href={EVIDENCE.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View the study
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 3. Patient journey ---------- */}
        <section className="sec sec-forest" id="how">
          <div className="wrap">
            <Reveal>
              <p className="label">{JOURNEY.label}</p>
              <h2>{JOURNEY.h2}</h2>

              <div className="steps">
                {JOURNEY.steps.map((s, i) => (
                  <div className="step" key={s.title}>
                    <span className="step-n">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{s.title}</h3>
                    <p className="body">{s.copy}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <PspPartners />
        {/* ---------- 4. What we run ---------- */}
        <section className="sec sec-warm" id="run">
          <div className="wrap">
            <Reveal>
              <p className="label">{RUN.label}</p>
              <h2>{RUN.h2}</h2>

              <div className="quad">
                {RUN.blocks.map((b) => (
                  <div key={b.title}>
                    <h3>{b.title}</h3>
                    <p className="body">{b.copy}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 5. Care areas ---------- */}
        <section className="sec sec-ivory" id="areas">
          <div className="wrap">
            <Reveal>
              <p className="label">{AREAS.label}</p>
              <h2>{AREAS.h2}</h2>
              <p className="big">{AREAS.intro}</p>

              <div className="mosaic">
                {AREAS.cards.map((c) => (
                  <figure
                    className={"tile " + (c.size === "lg" ? "tile-lg" : "tile-sm")}
                    key={c.title}
                  >
                    <div className="well">
                      {c.img ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.img} alt={c.alt} loading="lazy" />
                      ) : null}
                    </div>
                    <figcaption>{c.title}</figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <PspGoogle />
        {/* ---------- 6. White-label model and pilot ---------- */}
        <section className="sec sec-forest" id="pilot">
          <div className="wrap split">
            <Reveal>
              <h2>{MODEL.h2}</h2>
              <p className="big">{MODEL.copy}</p>

              <div className="flow">
                {MODEL.flow.map((f, i) => (
                  <span key={f}>
                    {f}
                    {i < MODEL.flow.length - 1 && (
                      <i aria-hidden="true" style={{ marginLeft: 10 }}>
                        {"\u2192"}
                      </i>
                    )}
                  </span>
                ))}
              </div>

              <p className="body">{MODEL.brandLine}</p>
            </Reveal>

            <Reveal>
              <h3>{PILOT.h3}</h3>
              <p className="big" style={{ marginTop: 12 }}>
                {PILOT.copy}
              </p>

              <div className="stages">
                {PILOT.stages.map((s, i) => (
                  <div className="stage" key={s}>
                    <em>{String(i + 1).padStart(2, "0")}</em>
                    {s}
                  </div>
                ))}
              </div>

              <p className="fine">{PILOT.proof}</p>
            </Reveal>
          </div>
        </section>

        <PspNews />
        {/* ---------- 7. Final CTA, form and FAQ ---------- */}
        <section className="sec sec-forest" id="request">
          <div className="wrap split">
            <div>
              <h2>{FINAL.h2}</h2>
              <p className="big">{FINAL.copy}</p>
              <p style={{ marginTop: 26 }}>
                <a href="#request" className="link-under">
                  {CTA.secondary}
                </a>
              </p>
            </div>
            <RequestForm />
          </div>

          <div className="wrap">
            <Faq />
          </div>
        </section>
      </main>

      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-cropped.png" alt="Lean Protocol" className="ftr-logo" />
            <div className="ftr-links">
              <a href="mailto:support@leanprotocol.in">
                support@leanprotocol.in
              </a>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-conditions">Terms and Conditions</a>
            </div>
          </div>
          <div className="ftr-base">
            <p className="fine" style={{ maxWidth: "76ch" }}>
              {DISCLAIMER}
            </p>
            <p className="fine" style={{ marginTop: 14 }}>
              {"\u00A9"} 2026 Lean Protocol Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
