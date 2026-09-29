import * as C from "@/content/corporate"
import { CorpHeader, ScaleCalculator, CorpFaq, CorpForm } from "@/components/corporate/corporate-interactive"

/**
 * /corporate - employee wellness, for HR and benefits teams.
 *
 * Server component. Only the header, calculator, FAQ and form are client
 * side; everything else renders on the server.
 *
 * Shape: hook (hero) -> substance (gap, how, measure, scale, HR, privacy,
 * proof, FAQ) -> one CTA. There is a single conversion action on the page,
 * deliberately: a walkthrough booking. Nothing competes with it.
 */
const TICK = "\u2713"

export default function CorporatePage() {
  const statsReady = C.proof.stats.every((s) => C.isReady(s.value))

  return (
    <div id="top">
      <CorpHeader />

      {/* ---------------- hook ---------------- */}
      <section className="hero">
        <div aria-hidden className="hero-glow" />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <p className="eyebrow" style={{ color: "#C8D9A7" }}>
            {C.hero.eyebrow}
          </p>
          <h1>
            {C.hero.headA}
            <br />
            {C.hero.headB}
            <br />
            <span className="accent serif">{C.hero.headC}</span>
          </h1>
          <p className="lede">{C.hero.lede}</p>

          <div className="hero-cta">
            <a href={C.hero.ctaPrimary.href} className="btn btn-sage">
              {C.hero.ctaPrimary.label}
            </a>
            <a href={C.hero.ctaSecondary.href} className="btn btn-ghost">
              {C.hero.ctaSecondary.label}
            </a>
          </div>

          <ul className="hero-markers">
            {C.hero.markers.map((m) => (
              <li key={m}>
                <span aria-hidden className="tick">
                  {TICK}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- the gap ---------------- */}
      <section id={C.gap.id} className="rounded-top" style={{ marginTop: -44, position: "relative", background: "#F9F7F2" }}>
        <div className="wrap">
          <p className="eyebrow">{C.gap.eyebrow}</p>
          <h2 className="h">
            {C.gap.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {C.gap.headB}
            </span>
          </h2>
          <p className="lede">{C.gap.body}</p>

          <div className="grid">
            {C.gap.cards.map((c) => (
              <div key={c.title} className="card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section id={C.how.id} className="on-dark">
        <div className="wrap">
          <p className="eyebrow">{C.how.eyebrow}</p>
          <h2 className="h" style={{ color: "#F9F7F2" }}>
            {C.how.headA}{" "}
            <span className="serif" style={{ color: "#C8D9A7" }}>
              {C.how.headB}
            </span>
          </h2>
          <p className="lede">{C.how.body}</p>

          <div className="steps">
            {C.how.steps.map((s) => (
              <div key={s.n} className="step">
                <div className="step-n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="step-when">{s.detail.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- what we measure ---------------- */}
      <section id={C.measure.id}>
        <div className="wrap">
          <p className="eyebrow">{C.measure.eyebrow}</p>
          <h2 className="h">
            {C.measure.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {C.measure.headB}
            </span>
          </h2>
          <p className="lede">{C.measure.body}</p>

          <div className="markers">
            {C.measure.markers.map((m) => (
              <div key={m.name} className="marker">
                <span aria-hidden className="marker-dot" />
                <div>
                  <b>{m.name}</b>
                  <span>{m.why}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 26 }}>
            {C.measure.note}
          </p>
        </div>
      </section>

      {/* ---------------- scale calculator ---------------- */}
      <ScaleCalculator />

      {/* ---------------- for HR ---------------- */}
      <section id={C.hr.id}>
        <div className="wrap">
          <p className="eyebrow">{C.hr.eyebrow}</p>
          <h2 className="h">
            {C.hr.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {C.hr.headB}
            </span>
          </h2>
          <p className="lede">{C.hr.body}</p>

          <div className="grid">
            {C.hr.cards.map((c) => (
              <div key={c.title} className="card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 26 }}>
            {C.hr.footnote}
          </p>
        </div>
      </section>

      {/* ---------------- proof ---------------- */}
      <section className="on-black">
        <div className="wrap on-dark">
          <p className="eyebrow">{C.proof.eyebrow}</p>
          {statsReady ? (
            <>
              <div className="grid" style={{ marginTop: 26 }}>
                {C.proof.stats.map((s) => (
                  <div key={s.label} className="card card-dark">
                    <h3 style={{ fontSize: 40, color: "#C8D9A7", letterSpacing: "-0.03em" }}>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="fine" style={{ marginTop: 24 }}>
                {C.proof.note}
              </p>
            </>
          ) : (
            /* Numbers are still bracketed in content/corporate.ts, so the
               tiles stay hidden and this honest line shows instead. */
            <p className="lede" style={{ marginTop: 10, maxWidth: "50ch" }}>
              {C.proof.fallback}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- privacy ---------------- */}
      <section id={C.privacy.id} className="rounded-top" style={{ marginTop: -44, position: "relative", background: "#F9F7F2" }}>
        <div className="wrap">
          <p className="eyebrow">{C.privacy.eyebrow}</p>
          <h2 className="h">
            {C.privacy.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {C.privacy.headB}
            </span>
          </h2>

          <ul className="privacy-list">
            {C.privacy.points.map((p) => (
              <li key={p}>
                <span aria-hidden className="tick">
                  {TICK}
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p className="fine" style={{ marginTop: 26 }}>
            {C.privacy.note}
          </p>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p className="eyebrow">QUESTIONS HR TEAMS ASK</p>
          <h2 className="h">
            Before you{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              commit a budget.
            </span>
          </h2>
          <CorpFaq />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id={C.cta.id} className="on-dark">
        <div className="wrap">
          <p className="eyebrow">{C.cta.eyebrow}</p>
          <h2 className="h" style={{ color: "#F9F7F2" }}>
            {C.cta.headA}{" "}
            <span className="serif" style={{ color: "#C8D9A7" }}>
              {C.cta.headB}
            </span>
          </h2>

          <div className="form-grid">
            <div>
              <p className="lede">{C.cta.body}</p>
              <ul className="hero-markers" style={{ flexDirection: "column", gap: 12, marginTop: 28 }}>
                {C.cta.bullets.map((b) => (
                  <li key={b}>
                    <span aria-hidden className="tick">
                      {TICK}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="fine" style={{ marginTop: 28 }}>
                Prefer email?{" "}
                <a href={`mailto:${C.company.email}`} style={{ color: "#C8D9A7" }}>
                  {C.company.email}
                </a>
              </p>
            </div>

            <CorpForm />
          </div>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="foot">
        <div className="wrap">
          <img src="/logo-cropped.png" alt="Lean Protocol" style={{ height: 46, width: "auto" }} />
          <p className="fine" style={{ marginTop: 18, maxWidth: "90ch" }}>
            Lean Protocol is a doctor-led weight and metabolic health service. Clinical decisions,
            including any prescription, are made by licensed physicians after individual assessment.
            Results vary between individuals. Nothing on this page is medical advice.
          </p>
          <p className="fine" style={{ marginTop: 14 }}>
            {"\u00A9"} {new Date().getFullYear()} {C.company.legalName} {"\u00B7"}{" "}
            <a href="/privacy-policy">Privacy</a> {"\u00B7"} <a href="/terms-conditions">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
