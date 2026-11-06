import type { CSSProperties } from "react"
import * as C from "@/content/corporate"
import { partners } from "@/content/workshops"
import { CorpForm } from "@/components/corporate/corporate-interactive"
import { CorpIcon, ReportChart } from "@/components/corporate/corporate-icons"

/**
 * /corporate - employee wellness, for HR and benefits teams.
 *
 * Server component. Only the enquiry form is client side.
 * Every class is prefixed cw- and scoped under .corporate-page in
 * corporate.css, so nothing here collides with Tailwind utilities or the
 * rest of the site.
 *
 * Order: hero -> strip -> why -> care team -> outcomes -> statement ->
 * add-ons -> workshops -> reports -> partners -> press -> enquiry.
 */
const TICK = "\u2713"

/* The strip scrolls by exactly one set; four copies keep it seamless on
   screens wider than a single set. Copies after the first are hidden from
   screen readers. */
const STRIP_COPIES = [0, 1, 2, 3]

export default function CorporatePage() {
  return (
    <div id="top">
      {/* ---------------- header ---------------- */}
      <header className="cw-hdr">
        <div className="cw-wrap cw-hdr-in">
          <a href="#top" className="cw-brand" aria-label="Lean Protocol">
            <img src="/logo-cropped.png" alt="Lean Protocol" />
          </a>
          <nav className="cw-nav" aria-label="Page sections">
            {C.NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#talk" className="cw-btn cw-btn-sm">
            Talk to us
          </a>
        </div>
      </header>

      {/* ---------------- hero ---------------- */}
      <section className="cw-hero">
        <div className="cw-wrap cw-hero-grid">
          <div>
            <p className="cw-eyebrow">{C.hero.eyebrow}</p>
            <h1>
              {C.hero.headA} <em>{C.hero.headB}</em>
            </h1>
            <div className="cw-actions">
              <a className="cw-btn cw-btn-big" href={C.hero.ctaPrimary.href}>
                {C.hero.ctaPrimary.label}
              </a>
              <a className="cw-btn cw-btn-big cw-btn-ghost" href={C.hero.ctaSecondary.href}>
                {C.hero.ctaSecondary.label}
              </a>
            </div>
          </div>
          <figure className="cw-hero-shot">
            <img
              src={C.hero.image.src}
              alt={C.hero.image.alt}
              width={C.hero.image.width}
              height={C.hero.image.height}
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      {/* ---------------- moving strip ---------------- */}
      <div className="cw-band" role="region" aria-label="Included in every programme">
        <div className="cw-marquee">
          <div className="cw-mq-track">
            {STRIP_COPIES.map((copy) => (
              <ul key={copy} className="cw-mq-set" aria-hidden={copy === 0 ? undefined : true}>
                {C.includes.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="cw-bt">
                      {TICK}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- why it matters ---------------- */}
      <section id={C.why.id} className="cw-sec">
        <div className="cw-wrap cw-why">
          <div className="cw-why-head">
            <p className="cw-eyebrow">{C.why.eyebrow}</p>
            <h2>
              {C.why.lines.map((l) => (
                <span key={l} className="cw-ln">
                  {l}
                </span>
              ))}
            </h2>
          </div>
          <div className="cw-why-grid">
            {C.why.conditions.map((c) => (
              <div
                key={c.title}
                className={"cw-cond" + (c.image ? " cw-cond-photo" : "")}
                style={c.image ? ({ "--img": `url(${c.image})` } as CSSProperties) : undefined}
              >
                <span className="cw-cond-ico">
                  <CorpIcon name={c.icon} size={30} />
                </span>
                <h3>{c.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- care team ---------------- */}
      <section id={C.team.id} className="cw-sec cw-soft">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.team.eyebrow}</p>
          <h2>{C.team.head}</h2>
          <div className="cw-docs">
            {C.team.doctors.map((d) => (
              <figure key={d.name} className="cw-doc">
                <img src={d.image} alt={d.name} width={420} height={420} loading="lazy" decoding="async" />
                <figcaption>
                  <b>{d.name}</b>
                  <span>{d.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- outcomes ---------------- */}
      <section id={C.outcomes.id} className="cw-sec cw-ink">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.outcomes.eyebrow}</p>
          <h2>{C.outcomes.head}</h2>
          <div className="cw-outs">
            {C.outcomes.items.map((o) => (
              <article key={o.title} className="cw-out">
                <span className="cw-tile-ico">
                  <CorpIcon name={o.icon} size={30} />
                </span>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
                <small>{o.measure}</small>
              </article>
            ))}
          </div>
          <p className="cw-note">{C.outcomes.note}</p>
        </div>
      </section>

      {/* ---------------- statement ---------------- */}
      <section className="cw-sec cw-soft">
        <div className="cw-wrap cw-say">
          <figure className="cw-shot">
            <img
              src={C.statement.image.src}
              alt={C.statement.image.alt}
              width={C.statement.image.width}
              height={C.statement.image.height}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <h2>{C.statement.head}</h2>
        </div>
      </section>

      {/* ---------------- add-ons ---------------- */}
      <section className="cw-sec cw-deep">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.addons.eyebrow}</p>
          <h2>{C.addons.head}</h2>
          <p className="cw-sub">{C.addons.sub}</p>
          <div className="cw-addons">
            {C.addons.items.map((a) => (
              <div key={a.title} className="cw-addon">
                <span className="cw-tile-ico">
                  <CorpIcon name={a.icon} size={28} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- workshops ---------------- */}
      <section id={C.workshops.id} className="cw-sec">
        <div className="cw-wrap cw-ws">
          <div>
            <p className="cw-eyebrow">{C.workshops.eyebrow}</p>
            <h2>{C.workshops.head}</h2>
            <ul className="cw-ws-list">
              {C.workshops.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <figure className="cw-shot cw-ws-shot">
              <img
                src={C.workshops.image.src}
                alt={C.workshops.image.alt}
                width={C.workshops.image.width}
                height={C.workshops.image.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="cw-ws-card">
              <b>{C.workshops.card.title}</b>
              <p>{C.workshops.card.text}</p>
              <a className="cw-btn" href={C.workshops.card.cta.href}>
                {C.workshops.card.cta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- quarterly reporting ---------------- */}
      <section id={C.reports.id} className="cw-sec cw-ink">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.reports.eyebrow}</p>
          <h2>{C.reports.head}</h2>
          <p className="cw-sub">{C.reports.sub}</p>
          <div className="cw-rcards">
            {C.reports.cards.map((r) => (
              <article key={r.title} className={"cw-rcard" + (r.wide ? " cw-rcard-wide" : "")}>
                <ReportChart kind={r.chart} />
                <div>
                  <b>{r.title}</b>
                  <p>{r.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="cw-rnote">
            <b>{C.reports.noteLead}</b>
            {C.reports.noteRest}
          </p>
        </div>
      </section>

      {/* ---------------- partners ---------------- */}
      <section className="cw-sec cw-center">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.partnersHead.eyebrow}</p>
          <h2>{C.partnersHead.head}</h2>
          <div className="cw-partners">
            {partners.names.map((p) => (
              <div key={p.name} className="cw-partner">
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" />
                <small>{p.sub}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- press ---------------- */}
      <section className="cw-sec cw-center cw-news">
        <div className="cw-wrap">
          <p className="cw-eyebrow">{C.press.eyebrow}</p>
          <h2>{C.press.head}</h2>
          <div className="cw-presses">
            {C.press.items.map((p) => (
              <a
                key={p.name}
                className="cw-press"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read the ${p.name} article`}
              >
                <img src={p.logo} alt={p.name} width={p.width} height={p.height} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- enquiry ---------------- */}
      <section id={C.cta.id} className="cw-sec cw-ink">
        <div className="cw-wrap cw-talk">
          <div>
            <p className="cw-eyebrow">{C.cta.eyebrow}</p>
            <h2>{C.cta.head}</h2>
            <p className="cw-sub">{C.cta.sub}</p>
          </div>
          <CorpForm />
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="cw-foot">
        <div className="cw-wrap">
          <img src="/logo-cropped.png" alt="Lean Protocol" className="cw-foot-logo" loading="lazy" />
          <p className="cw-foot-note">{C.footer.disclaimer}</p>
          <p className="cw-foot-links">
            <span>
              {"\u00A9"} {new Date().getFullYear()} {C.company.legalName}
            </span>
            <span>
              <a href="/privacy-policy">Privacy</a> {"\u00B7"} <a href="/terms-conditions">Terms</a> {"\u00B7"}{" "}
              <a href={`mailto:${C.company.email}`}>{C.company.email}</a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}
