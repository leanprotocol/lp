import * as W from "@/content/workshops"
import { WsHeader, ModulePicker, WsFaq, WsForm } from "@/components/workshops/workshops-interactive"

/**
 * /workshops - workplace health education.
 *
 * The front door to the corporate vertical. A six-month clinical programme
 * is a hard first ask; an hour is not. The page argues that education is
 * the first mile of that road, then shows what happens after the room
 * empties so it does not read as a talk for its own sake.
 *
 * Shape: hook -> why education first -> the six modules -> what changes
 * after -> formats -> partners -> the corporate offer -> FAQ -> one CTA.
 */
const TICK = "\u2713"

export default function WorkshopsPage() {
  const statsReady = W.proof.stats.every((s) => W.isReady(s.value))

  return (
    <div id="top">
      <WsHeader />

      {/* ---------------- hook ---------------- */}
      <section className="hero">
        <div aria-hidden className="hero-glow" />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <p className="eyebrow" style={{ color: "#C8D9A7" }}>
            {W.hero.eyebrow}
          </p>
          <h1>
            {W.hero.headA}
            <br />
            <span className="accent serif">{W.hero.headB}</span>
          </h1>
          <p className="lede">{W.hero.lede}</p>

          <div className="hero-cta">
            <a href={W.hero.ctaPrimary.href} className="btn btn-sage">
              {W.hero.ctaPrimary.label}
            </a>
            <a href={W.hero.ctaSecondary.href} className="btn btn-ghost">
              {W.hero.ctaSecondary.label}
            </a>
          </div>

          <ul className="hero-markers">
            {W.hero.markers.map((m) => (
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

      {/* ---------------- why education first ---------------- */}
      <section
        id={W.why.id}
        className="rounded-top"
        style={{ marginTop: -44, position: "relative", background: "#F9F7F2" }}
      >
        <div className="wrap">
          <p className="eyebrow">{W.why.eyebrow}</p>
          <h2 className="h">
            {W.why.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {W.why.headB}
            </span>
          </h2>
          <p className="lede">{W.why.body}</p>

          <div className="ws-chain">
            {W.why.chain.map((c) => (
              <div key={c.n} className="ws-link">
                <div className="ws-link-n">{c.n}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 28 }}>
            {W.why.note}
          </p>
        </div>
      </section>

      {/* ---------------- the sessions ---------------- */}
      <section id={W.sessions.id} className="on-dark">
        <div className="wrap">
          <p className="eyebrow">{W.sessions.eyebrow}</p>
          <h2 className="h" style={{ color: "#F9F7F2" }}>
            {W.sessions.headA}{" "}
            <span className="serif" style={{ color: "#C8D9A7" }}>
              {W.sessions.headB}
            </span>
          </h2>
          <p className="lede">{W.sessions.body}</p>

          <ModulePicker />
        </div>
      </section>

      {/* ---------------- what changes after ---------------- */}
      <section id={W.action.id}>
        <div className="wrap">
          <p className="eyebrow">{W.action.eyebrow}</p>
          <h2 className="h">
            {W.action.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {W.action.headB}
            </span>
          </h2>
          <p className="lede">{W.action.body}</p>

          <div className="grid">
            {W.action.cards.map((c) => (
              <div key={c.title} className="card">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 26 }}>
            {W.action.note}
          </p>
        </div>
      </section>

      {/* ---------------- formats ---------------- */}
      <section id={W.formats.id} style={{ background: "#F3F1EA" }}>
        <div className="wrap">
          <p className="eyebrow">{W.formats.eyebrow}</p>
          <h2 className="h">
            {W.formats.headA}{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              {W.formats.headB}
            </span>
          </h2>
          <p className="lede">{W.formats.body}</p>

          <div className="ws-formats">
            {W.formats.options.map((o) => (
              <div key={o.name} className="ws-format">
                <div className="ws-format-top">
                  <h3>{o.name}</h3>
                  <span className="ws-tagpill">{o.when.toUpperCase()}</span>
                </div>
                <p>{o.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- partners and the offer ---------------- */}
      <section id={W.partners.id} className="on-black">
        <div className="wrap on-dark">
          <p className="eyebrow">{W.partners.eyebrow}</p>
          <h2 className="h" style={{ color: "#F9F7F2" }}>
            {W.partners.headA}{" "}
            <span className="serif" style={{ color: "#C8D9A7" }}>
              {W.partners.headB}
            </span>
          </h2>
          <p className="lede">{W.partners.body}</p>

          <div className="ws-partners">
            {W.partners.list.map((p) => (
              <div key={p.name} className="ws-partner">
                <img src={p.logo} alt={p.name} loading="lazy" />
                <div>
                  <b>{p.name}</b>
                  <span>{p.role}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="fine" style={{ marginTop: 22 }}>
            {W.partners.note}
          </p>

          {/* The commercial ask, deliberately placed after the substance and
              framed the way it is framed in the room: mentioned once, at the
              end, never during the teaching. */}
          <div className="ws-offer">
            <p className="eyebrow" style={{ color: "#C8D9A7" }}>
              {W.offer.eyebrow}
            </p>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(24px,3vw,40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#F9F7F2",
              }}
            >
              {W.offer.headA}{" "}
              <span className="serif" style={{ color: "#C8D9A7" }}>
                {W.offer.headB}
              </span>
            </h3>
            <p className="lede" style={{ maxWidth: "62ch" }}>
              {W.offer.body}
            </p>

            <ul className="ws-offer-list">
              {W.offer.bullets.map((b) => (
                <li key={b}>
                  <span aria-hidden className="tick">
                    {TICK}
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <p className="fine" style={{ marginTop: 22 }}>
              {W.offer.note}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- proof ---------------- */}
      <section
        className="rounded-top"
        style={{ marginTop: -44, position: "relative", background: "#F9F7F2" }}
      >
        <div className="wrap">
          <p className="eyebrow">{W.proof.eyebrow}</p>
          {statsReady ? (
            <>
              <div className="grid" style={{ marginTop: 20 }}>
                {W.proof.stats.map((s) => (
                  <div key={s.label} className="card">
                    <h3 style={{ fontSize: 40, color: "#2D5A4E", letterSpacing: "-0.03em" }}>
                      {s.value}
                    </h3>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="fine" style={{ marginTop: 24 }}>
                {W.proof.note}
              </p>
            </>
          ) : (
            /* Values are still bracketed in content/workshops.ts, so the
               tiles stay hidden rather than showing a placeholder to a CHRO. */
            <p className="lede" style={{ marginTop: 8, maxWidth: "56ch" }}>
              {W.proof.fallback}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- bridge to /corporate ---------------- */}
      <section className="ws-bridge-wrap">
        <div className="wrap">
          <div className="ws-bridge">
            <div>
              <p className="eyebrow">{W.bridge.eyebrow}</p>
              <h2 className="h" style={{ fontSize: "clamp(26px,3.4vw,44px)" }}>
                {W.bridge.headA}{" "}
                <span className="serif" style={{ color: "#2D5A4E" }}>
                  {W.bridge.headB}
                </span>
              </h2>
              <p className="lede" style={{ maxWidth: "54ch" }}>
                {W.bridge.body}
              </p>

              <ul className="ws-bridge-list">
                {W.bridge.points.map((p) => (
                  <li key={p}>
                    <span aria-hidden className="tick">
                      {TICK}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <a href={W.bridge.cta.href} className="btn btn-ink" style={{ marginTop: 28 }}>
                {W.bridge.cta.label} {"\u2192"}
              </a>

              <p className="fine" style={{ marginTop: 18, maxWidth: "58ch" }}>
                {W.bridge.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p className="eyebrow">QUESTIONS HR TEAMS ASK</p>
          <h2 className="h">
            Before you{" "}
            <span className="serif" style={{ color: "#2D5A4E" }}>
              book a room.
            </span>
          </h2>
          <WsFaq />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id={W.cta.id} className="on-dark">
        <div className="wrap">
          <p className="eyebrow">{W.cta.eyebrow}</p>
          <h2 className="h" style={{ color: "#F9F7F2" }}>
            {W.cta.headA}{" "}
            <span className="serif" style={{ color: "#C8D9A7" }}>
              {W.cta.headB}
            </span>
          </h2>

          <div className="form-grid">
            <div>
              <p className="lede">{W.cta.body}</p>
              <ul
                className="hero-markers"
                style={{ flexDirection: "column", gap: 12, marginTop: 28 }}
              >
                {W.cta.bullets.map((b) => (
                  <li key={b}>
                    <span aria-hidden className="tick">
                      {TICK}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="fine" style={{ marginTop: 28 }}>
                Running a full programme already?{" "}
                <a href="/corporate" style={{ color: "#C8D9A7" }}>
                  See the six-month version
                </a>
              </p>
            </div>

            <WsForm />
          </div>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="foot">
        <div className="wrap">
          <img
            src="/logo-cropped.png"
            alt="Lean Protocol"
            style={{ height: 46, width: "auto" }}
          />
          <p className="fine" style={{ marginTop: 18, maxWidth: "90ch" }}>
            Workshops are educational and are not medical advice or a diagnosis. Clinical
            decisions, including any prescription, are made by licensed physicians after
            individual assessment. Participation in any screening or programme is voluntary and
            individually consented.
          </p>
          <p className="fine" style={{ marginTop: 14 }}>
            {"\u00A9"} {new Date().getFullYear()} Lean Protocol Private Limited {"\u00B7"}{" "}
            <a href="/corporate">Corporate wellness</a> {"\u00B7"}{" "}
            <a href="/privacy-policy">Privacy</a> {"\u00B7"}{" "}
            <a href="/terms-conditions">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
