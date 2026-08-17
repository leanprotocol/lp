// app/psp/page.tsx
// White-labelled Patient Support Programme site for pharmaceutical
// partners. Server component; interaction lives in components/psp.
//
// Copy is held in content/psp.ts. Compliance language there is approved:
// do not reword claims about titration, outcomes, data access or
// dispensing without review.

import type { Metadata } from "next";
import {
  HERO,
  PROBLEM,
  STAKEHOLDERS,
  THERAPIES,
  JOURNEY,
  CAPABILITIES,
  INTELLIGENCE,
  EVIDENCE,
  CONTINUITY,
  WHITELABEL,
  PILOT,
  WHY,
  FINAL,
  CTA,
  COMPLIANCE_FOOTER,
} from "@/content/psp";
import {
  PspHeader,
  Reveal,
  StakeholderTabs,
  Journey,
  ContinuityCalculator,
  Faq,
  RequestForm,
} from "@/components/psp/psp-interactive";

export const metadata: Metadata = {
  title: "White-Label Patient Support Programmes for Pharma | Lean Protocol",
  description:
    "Lean Protocol provides trained care teams, technology and protocol-led coordination to design and operate white-labelled post-prescription Patient Support Programmes.",
  alternates: { canonical: "https://www.leanprotocol.in/psp" },
  openGraph: {
    title: "White-Label Patient Support Programmes for Pharma | Lean Protocol",
    description:
      "Post-prescription care infrastructure for metabolic and chronic therapies. Trained care teams, white-labelled technology and protocol-led coordination.",
    url: "https://www.leanprotocol.in/psp",
    siteName: "Lean Protocol",
    type: "website",
    images: ["/og-image.jpg"],
  },
};

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="src" href={href} target="_blank" rel="noopener noreferrer">
      Source: {label}
    </a>
  );
}

export default function PspPage() {
  const humira = EVIDENCE.cards[1] as Extract<
    (typeof EVIDENCE.cards)[number],
    { kind: "humira" }
  >;
  const coach = EVIDENCE.cards[2] as Extract<
    (typeof EVIDENCE.cards)[number],
    { kind: "coach" }
  >;
  const review = EVIDENCE.cards[0] as Extract<
    (typeof EVIDENCE.cards)[number],
    { kind: "stat" }
  >;

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <PspHeader />

      <main id="main">
        {/* ---------- 1. Hero ---------- */}
        <section className="hero" id="top">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <p className="eyebrow">{HERO.eyebrow}</p>
                <h1>{HERO.headline}</h1>
                <p className="lede">{HERO.copy}</p>
                <p className="lede" style={{ marginTop: 10 }}>
                  <span className="serif-em">{HERO.secondary}</span>
                </p>
                <div className="hero-ctas">
                  <a href="#request" className="btn btn-primary">
                    {CTA.primary}
                  </a>
                  <a href="#request" className="btn btn-ghost">
                    {CTA.secondary}
                  </a>
                </div>
                <p className="fine">{HERO.audience}</p>
              </div>

              {/* IMAGE SLOT 1: care team and programme infrastructure.
                  Drop the asset at /public/psp/hero-care-team.webp and
                  replace this block with an <img>. */}
              <div className="figure-slot" style={{ minHeight: 340 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/psp/hero-care-team.webp" alt="" aria-hidden="true" />
              </div>
            </div>

            <div className="trust-strip">
              {HERO.trust.map((t) => (
                <span key={t}>
                  <i className="trust-dot" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 2. Business problem ---------- */}
        <section className="sec sec-ivory">
          <div className="wrap">
            <Reveal>
              <h2>{PROBLEM.headline}</h2>
              <p className="lede">{PROBLEM.copy}</p>
            </Reveal>

            <Reveal>
              <div className="grid g4" style={{ marginTop: 34 }}>
                {PROBLEM.cards.map((c, i) => (
                  <div className="card" key={c.title}>
                    <span className="card-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                ))}
              </div>
              <p className="callout">{PROBLEM.note}</p>
            </Reveal>
          </div>
        </section>

        {/* ---------- 3. Stakeholders ---------- */}
        <section className="sec">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Commercial and Medical Value</p>
              <h2>{STAKEHOLDERS.headline}</h2>
            </Reveal>
            <Reveal>
              <div style={{ marginTop: 28 }}>
                <StakeholderTabs />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 4. Therapy areas ---------- */}
        <section className="sec sec-ivory" id="therapies">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Therapy Areas</p>
              <h2>{THERAPIES.headline}</h2>
            </Reveal>
            <Reveal>
              <div className="grid g3" style={{ marginTop: 32 }}>
                {THERAPIES.cards.map((c) => (
                  <div className="card" key={c.title}>
                    <h3>{c.title}</h3>
                    <ul className="ticks" style={{ marginTop: 12 }}>
                      {c.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    {"note" in c && c.note && (
                      <p className="note-box">{c.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 5. Patient journey ---------- */}
        <section className="sec sec-forest" id="journey">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Patient Journey</p>
              <h2>{JOURNEY.headline}</h2>
              <p className="lede">{JOURNEY.copy}</p>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 36 }}>
                <Journey />
              </div>
            </Reveal>

            <Reveal>
              <div
                className="card"
                style={{ marginTop: 28, borderColor: "rgba(200,217,167,0.4)" }}
              >
                <p className="eyebrow" style={{ marginBottom: 8 }}>
                  {JOURNEY.titration.label}
                </p>
                <h3 style={{ color: "var(--p-ivory)" }}>
                  {JOURNEY.titration.headline}
                </h3>
                <p style={{ marginTop: 8 }}>{JOURNEY.titration.copy}</p>
                <p className="note-box">{JOURNEY.titration.note}</p>
              </div>

              <p
                className="serif-em"
                style={{ marginTop: 26, fontSize: 21, display: "block" }}
              >
                {JOURNEY.endState}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- 6. Capabilities ---------- */}
        <section className="sec" id="capabilities">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Programme Capabilities</p>
              <h2>{CAPABILITIES.headline}</h2>
            </Reveal>
            <Reveal>
              <div className="grid g2" style={{ marginTop: 32 }}>
                {CAPABILITIES.layers.map((l) => (
                  <div className="card" key={l.title}>
                    <h3>{l.title}</h3>
                    <ul className="ticks" style={{ marginTop: 14 }}>
                      {l.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    {"note" in l && l.note && <p className="note-box">{l.note}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 7. Programme intelligence ---------- */}
        <section className="sec sec-ivory" id="intelligence">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Programme Intelligence</p>
              <h2>{INTELLIGENCE.headline}</h2>
              <p className="lede">{INTELLIGENCE.copy}</p>
            </Reveal>

            <Reveal>
              <div className="dash" style={{ marginTop: 32 }}>
                <div className="dash-bar">
                  {INTELLIGENCE.dashboardLabel}
                  <span className="dash-tag">ILLUSTRATIVE</span>
                </div>
                <div className="dash-grid">
                  {INTELLIGENCE.modules.map((m) => (
                    <div className="dash-cell" key={m}>
                      <span>{m}</span>
                      <b aria-hidden="true">{"\u2014"}</b>
                    </div>
                  ))}
                </div>
              </div>
              <p className="fine" style={{ marginTop: 12 }}>
                Interface shown for illustration. No Lean Protocol performance
                data is displayed.
              </p>
            </Reveal>

            <Reveal>
              <div className="grid g2" style={{ marginTop: 30 }}>
                <div className="card">
                  <h3>Data governance</h3>
                  <ul className="ticks" style={{ marginTop: 12 }}>
                    {INTELLIGENCE.governance.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="card">
                  <h3>What sponsors receive</h3>
                  <p style={{ marginTop: 8 }}>{INTELLIGENCE.richer}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 8. Published evidence ---------- */}
        <section className="sec" id="evidence">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Published Evidence</p>
              <h2>{EVIDENCE.headline}</h2>
              <p className="lede">{EVIDENCE.intro}</p>
            </Reveal>

            <Reveal>
              <div className="grid g3" style={{ marginTop: 32 }}>
                {/* Card 1 */}
                <div className="card">
                  <h3>{review.title}</h3>
                  <p className="stat-lg" style={{ margin: "16px 0 10px" }}>
                    {review.stat}
                  </p>
                  <p>{review.label}</p>
                  <p style={{ marginTop: 10 }}>{review.detail}</p>
                  <SourceLink href={review.source} label={review.sourceLabel} />
                </div>

                {/* Card 2 */}
                <div className="card">
                  <h3>{humira.title}</h3>
                  <ul className="ticks" style={{ margin: "14px 0 18px" }}>
                    {humira.stats.map((s) => (
                      <li key={s.label}>
                        <span>
                          <b style={{ color: "var(--p-green)" }}>{s.value}</b>{" "}
                          {s.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {humira.bars.map((b, i) => (
                    <div className="bar-row" key={b.label}>
                      <div className="bar-label">
                        <span>{b.label}</span>
                        <span>{b.value}%</span>
                      </div>
                      <div
                        className="bar-track"
                        role="img"
                        aria-label={b.label + ": " + b.value + " percent"}
                      >
                        <div
                          className={"bar-fill" + (i ? " alt" : "")}
                          style={{ width: b.value + "%" }}
                        />
                      </div>
                    </div>
                  ))}
                  <p style={{ marginTop: 14 }}>{humira.copy}</p>
                  <p className="fine" style={{ marginTop: 12 }}>
                    {humira.footnote}
                  </p>
                  <SourceLink href={humira.source} label={humira.sourceLabel} />
                </div>

                {/* Card 3 */}
                <div className="card">
                  <h3>{coach.title}</h3>
                  <div style={{ marginTop: 16 }}>
                    {coach.groups.map((g) => (
                      <div key={g.label} style={{ marginBottom: 16 }}>
                        <p
                          className="fine"
                          style={{ marginBottom: 8, color: "var(--p-ink-60)" }}
                        >
                          {g.label}
                        </p>
                        <div className="bar-row">
                          <div className="bar-label">
                            <span>With COACH</span>
                            <span>{g.withPsp}%</span>
                          </div>
                          <div
                            className="bar-track"
                            role="img"
                            aria-label={
                              g.label +
                              " with COACH: " +
                              g.withPsp +
                              " percent"
                            }
                          >
                            <div
                              className="bar-fill"
                              style={{ width: g.withPsp + "%" }}
                            />
                          </div>
                        </div>
                        <div className="bar-row">
                          <div className="bar-label">
                            <span>Without COACH</span>
                            <span>{g.without}%</span>
                          </div>
                          <div
                            className="bar-track"
                            role="img"
                            aria-label={
                              g.label +
                              " without COACH: " +
                              g.without +
                              " percent"
                            }
                          >
                            <div
                              className="bar-fill alt"
                              style={{ width: g.without + "%" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="fine">{coach.hazard}</p>
                  <p style={{ marginTop: 10 }}>{coach.copy}</p>
                  <SourceLink href={coach.source} label={coach.sourceLabel} />
                </div>
              </div>

              <p className="callout">{EVIDENCE.disclaimer}</p>

              <div className="card" style={{ marginTop: 22 }}>
                <p>{EVIDENCE.indiaBenchmark.copy}</p>
                <SourceLink
                  href={EVIDENCE.indiaBenchmark.source}
                  label={EVIDENCE.indiaBenchmark.sourceLabel}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 9. Commercial continuity ---------- */}
        <section className="sec sec-ivory">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Commercial Continuity</p>
              <h2>{CONTINUITY.headline}</h2>
              <p className="lede">{CONTINUITY.copy}</p>
              <p
                className="serif-em"
                style={{ display: "block", marginTop: 20, fontSize: 18 }}
              >
                {CONTINUITY.formula}
              </p>
            </Reveal>
            <Reveal>
              <div style={{ marginTop: 28, maxWidth: 720 }}>
                <ContinuityCalculator />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 10. White-label model ---------- */}
        <section className="sec sec-forest">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">White-Label Programme Model</p>
              <h2>{WHITELABEL.headline}</h2>
            </Reveal>

            <Reveal>
              <div className="grid g2" style={{ marginTop: 32 }}>
                <div>
                  {WHITELABEL.flow.map((f, i) => (
                    <div className="jstep" key={f}>
                      <div className="jnum" aria-hidden="true">
                        {i + 1}
                      </div>
                      <div className="jbody">{f}</div>
                    </div>
                  ))}
                </div>

                {/* IMAGE SLOT 2: white-label operating architecture diagram.
                    Place at /public/psp/whitelabel-architecture.webp */}
                <div className="figure-contain">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/psp/whitelabel-architecture.webp"
                    alt="Programme flow from the pharmaceutical company through the treating physician, patient enrolment and care operations to programme reporting."
                  />
                </div>
              </div>

              <div className="card" style={{ marginTop: 26 }}>
                <h3 style={{ color: "var(--p-ivory)" }}>White-label options</h3>
                <ul className="ticks" style={{ marginTop: 14 }}>
                  {WHITELABEL.options.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 11. Defined pilot ---------- */}
        <section className="sec" id="pilot">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Defined Pilot</p>
              <h2>{PILOT.headline}</h2>
              <p className="lede">{PILOT.copy}</p>
            </Reveal>

            <Reveal>
              <div className="grid g4" style={{ marginTop: 32 }}>
                {PILOT.stages.map((s, i) => (
                  <div className="card" key={s.title}>
                    <span className="card-num">
                      Stage {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 30,
                }}
              >
                <a href="#request" className="btn btn-solid">
                  {CTA.primary}
                </a>
                <a href="#request" className="btn btn-ghost">
                  {CTA.secondary}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 12. Why Lean Protocol ---------- */}
        <section className="sec sec-ivory">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Why Lean Protocol</p>
              <h2>{WHY.headline}</h2>
            </Reveal>
            <Reveal>
              <div className="card" style={{ marginTop: 28 }}>
                <ul className="ticks">
                  {WHY.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="fine" style={{ marginTop: 18 }}>
                  {WHY.partners}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 13. FAQ ---------- */}
        <section className="sec">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Questions</p>
              <h2>Frequently asked questions</h2>
            </Reveal>
            <Reveal>
              <div style={{ marginTop: 28, maxWidth: 900 }}>
                <Faq />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 14. Final CTA and form ---------- */}
        <section className="sec sec-forest" id="request">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <p className="eyebrow">Request Demo</p>
                <h2 style={{ color: "var(--p-ivory)" }}>{FINAL.headline}</h2>
                <p className="lede">{FINAL.copy}</p>
                <p className="fine" style={{ marginTop: 22 }}>
                  {COMPLIANCE_FOOTER}
                </p>
              </div>
              <RequestForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="ftr">
        <div className="wrap">
          <p className="fine" style={{ maxWidth: "72ch" }}>
            {COMPLIANCE_FOOTER}
          </p>
          <p style={{ marginTop: 20, fontSize: 13 }}>
            <a href="/privacy-policy">Privacy Policy</a>
            {"  \u00B7  "}
            <a href="/terms-conditions">Terms &amp; Conditions</a>
          </p>
          <p className="fine" style={{ marginTop: 18 }}>
            {"\u00A9"} 2026 Lean Protocol Pvt Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
