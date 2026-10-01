import * as W from "@/content/workshops"
import { WsHeader, SamplePoll } from "@/components/workshops/workshops-interactive"

/**
 * /workshops - workplace wellness workshop.
 *
 * Markup follows the delivered template; styling is the template's own CSS,
 * scoped under .ws-page in app/workshops/workshops.css. Copy lives in
 * content/workshops.ts so a wording change never touches this file.
 */
export default function WorkshopsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <WsHeader />

      <main id="main">
        {/* ---------------- hero ---------------- */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow light">{W.hero.eyebrow}</p>
              <h1 id="hero-title">
                {W.hero.headA} <span>{W.hero.headEm}</span> {W.hero.headB}
              </h1>
              <p className="hero-lead">{W.hero.lead}</p>
              <div className="hero-actions">
                <a className="button button-lime" href={W.hero.ctaPrimary.href}>
                  {W.hero.ctaPrimary.label}
                </a>
                <a className="text-link light-link" href={W.hero.ctaSecondary.href}>
                  {W.hero.ctaSecondary.label}
                </a>
              </div>
              <div className="hero-note">
                <span className="note-rule" />
                <span>
                  {W.hero.noteA}
                  <br />
                  {W.hero.noteB}
                </span>
              </div>
            </div>

            <div className="hero-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={W.hero.image} alt={W.hero.imageAlt} width={1536} height={1024} />
              <div className="hero-overlay">
                <span className="overlay-label">{W.hero.overlayLabel}</span>
                <strong>
                  {W.hero.overlayA}
                  <br />
                  {W.hero.overlayB}
                </strong>
              </div>
              <div className="hero-orbit" aria-hidden="true">
                {W.hero.orbit.repeat(3)}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- 01 approach ---------------- */}
        <section className="intro section" id={W.intro.id} aria-labelledby="intro-title">
          <div className="wrap intro-grid">
            <div>
              <p className="eyebrow">{W.intro.eyebrow}</p>
              <h2 id="intro-title">
                {W.intro.headA}
                <br />
                <em>{W.intro.headEm}</em>
              </h2>
            </div>
            <div className="intro-copy">
              <p>{W.intro.copy}</p>
              <a className="inline-link" href={W.intro.link.href}>
                {W.intro.link.label}
              </a>
            </div>
          </div>

          <div className="wrap promise-strip">
            <div>
              <strong>{W.intro.splitA.n}</strong>
              <span>{W.intro.splitA.label}</span>
            </div>
            <span className="strip-divider" aria-hidden="true" />
            <div>
              <strong>{W.intro.splitB.n}</strong>
              <span>{W.intro.splitB.label}</span>
            </div>
            <p>{W.intro.splitNote}</p>
          </div>
        </section>

        {/* ---------------- 02 curriculum ---------------- */}
        <section className="learn section" id={W.curriculum.id} aria-labelledby="learn-title">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{W.curriculum.eyebrow}</p>
                <h2 id="learn-title">{W.curriculum.head}</h2>
              </div>
              <p>{W.curriculum.intro}</p>
            </div>

            <div className="learn-grid">
              {W.curriculum.cards.map((c, i) => (
                <article className={`learn-card card-${["one", "two", "three"][i]}`} key={c.n}>
                  <span className="card-index">{c.n}</span>
                  <div className="learn-symbol" aria-hidden="true">
                    {c.symbol}
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                  <ul>
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p className="learn-footnote">{W.curriculum.footnote}</p>
          </div>
        </section>

        {/* ---------------- 03 sample ---------------- */}
        <section className="sample section" id={W.sample.id} aria-labelledby="sample-title">
          <div className="wrap">
            <div className="sample-head">
              <div>
                <p className="eyebrow light">{W.sample.eyebrow}</p>
                <h2 id="sample-title">{W.sample.head}</h2>
              </div>
              <p>{W.sample.intro}</p>
            </div>

            <div className="sample-layout">
              <figure className="sample-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={W.sample.image} alt={W.sample.imageAlt} width={1672} height={941} />
                <figcaption>{W.sample.caption}</figcaption>
              </figure>

              <SamplePoll />
            </div>

            <div className="sample-foot">
              {W.sample.foot.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- 04 care ---------------- */}
        <section className="care section" id={W.care.id} aria-labelledby="care-title">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{W.care.eyebrow}</p>
                <h2 id="care-title">{W.care.head}</h2>
              </div>
            </div>

            <div className="care-intent">
              <strong>{W.care.intentTitle}</strong>
              <p>{W.care.intentCopy}</p>
            </div>

            <div className="care-grid">
              {W.care.cards.map((c) => (
                <article className={`care-card${c.featured ? " featured" : ""}`} key={c.title}>
                  <span className="care-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                  <ul>
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a className="inline-link" href={c.link.href}>
                    {c.link.label}
                  </a>
                </article>
              ))}
            </div>

            <p className="care-note">{W.care.note}</p>
          </div>
        </section>

        {/* ---------------- partners ---------------- */}
        <section className="partners section" aria-labelledby="partners-title">
          <div className="wrap partner-row">
            <div>
              <p className="eyebrow">{W.partners.eyebrow}</p>
              <h2 id="partners-title">{W.partners.head}</h2>
            </div>
            <div className="partner-names" aria-label="Lean Protocol partners">
              {W.partners.names.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>
          <div className="wrap">
            <p className="partner-caption">{W.partners.caption}</p>
          </div>
        </section>

        {/* ---------------- 05 evidence ---------------- */}
        <section className="evidence section" aria-labelledby="evidence-title">
          <div className="wrap evidence-grid">
            <div>
              <p className="eyebrow">{W.evidence.eyebrow}</p>
              <h2 id="evidence-title">{W.evidence.head}</h2>
              <p>{W.evidence.copy}</p>
            </div>
            <div className="evidence-list">
              {W.evidence.items.map((e) => (
                <article key={e.source}>
                  <span>{e.source}</span>
                  <p>{e.copy}</p>
                  <a href={e.link.href} target="_blank" rel="noopener noreferrer">
                    {e.link.label}
                  </a>
                </article>
              ))}
              <small>{W.evidence.note}</small>
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="faq section" aria-labelledby="faq-title">
          <div className="wrap faq-grid">
            <div>
              <p className="eyebrow">{W.faqs.eyebrow}</p>
              <h2 id="faq-title">{W.faqs.head}</h2>
            </div>
            <div className="faq-list">
              {W.faqs.items.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- contact ---------------- */}
        <section className="contact section" id={W.contact.id} aria-labelledby="contact-title">
          <div className="wrap contact-grid">
            <div>
              <p className="eyebrow light">{W.contact.eyebrow}</p>
              <h2 id="contact-title">
                {W.contact.headA} <em>{W.contact.headEm}</em>
              </h2>
              <p>{W.contact.copy}</p>
            </div>
            <div className="contact-card">
              <span>{W.contact.cardLabel}</span>
              <a
                className="button button-lime"
                href={`mailto:${W.contact.email}?subject=${W.contact.emailSubject}`}
              >
                {W.contact.emailCta}
              </a>
              <p>{W.contact.cardCopy}</p>
              {W.contact.links.map((l) => (
                <a className="contact-site" href={l.href} key={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- footer ---------------- */}
      <footer className="footer">
        <div className="wrap footer-top">
          <a className="wordmark" href="/" aria-label="Lean Protocol home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-cropped.png" alt="Lean Protocol" />
          </a>
          <p>{W.footer.tagline}</p>
          <a href="#main">{W.footer.backToTop}</a>
        </div>
        <div className="wrap footer-bottom">
          <span>
            {"\u00A9"} {new Date().getFullYear()} Lean Protocol
          </span>
          <span>{W.footer.legal}</span>
          <a href={W.footer.link.href}>{W.footer.link.label}</a>
        </div>
      </footer>
    </>
  )
}
