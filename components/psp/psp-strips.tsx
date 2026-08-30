// components/psp/psp-strips.tsx
// Three proof strips for /psp: delivery partners, Google rating, press.
//
// Written in PSP markup on purpose. The homepage TrustedPartners and
// challenge GoogleReviews carry Tailwind and challenge-stylesheet classes
// respectively, so neither travels here - only the assets do.

const PARTNERS = [
  { src: "/lp-assets/logo-cult.png", alt: "Cult", sub: "Cult Pass Home" },
  { src: "/lp-assets/logo-redcliffe.png", alt: "Redcliffe Labs", sub: "Blood tests" },
  { src: "/lp-assets/logo-mrmed.jpg", alt: "Mr.Med", sub: "Medicine delivery" },
];

// Only outlets that have actually covered Lean Protocol belong here - a logo
// implies coverage. These three carry live article links in home-v2.ts.
const PRESS = [
  { name: "Zee News", logo: "/news/zee-news.svg", href: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html" },
  { name: "News24", logo: "/news/news-24.jpg", href: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/" },
  { name: "News Today 24x7", logo: "/news/news-today-24x7.png", href: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
  { name: "The Startup Story", logo: "/news/startup-story.webp", href: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/" },
  { name: "The Tribune", logo: "/news/the-tribune.webp", href: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/" },
  { name: "The Republic News", logo: "/news/the-republic-news.png", href: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
];

export function PspPartners() {
  return (
    <section className="sec sec-ivory">
      <div className="wrap">
        <p className="label">DELIVERY PARTNERS</p>
        <h2>The network already in place.</h2>
        <div className="psp-partners">
          {PARTNERS.map((p) => (
            <div className="psp-partner" key={p.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" />
              <span>{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PspGoogle() {
  return (
    <section className="sec sec-ivory">
      <div className="wrap psp-rating-wrap">
        <div className="psp-rating">
          <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.9z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z"
              fill="#34A853"
            />
            <path d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3z" fill="#FBBC05" />
            <path
              d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 12 1 11 11 0 0 0 2.3 7.3L6 10.1c.9-2.5 3.2-4.4 6-4.4z"
              fill="#EA4335"
            />
          </svg>
          <span className="psp-rating-n">4.8</span>
          <span className="psp-rating-stars" aria-hidden="true">
            {"\u2605\u2605\u2605\u2605\u2605"}
          </span>
          <span className="psp-rating-copy">
            rated by patients on Google, across the programmes we already run.
          </span>
        </div>
      </div>
    </section>
  );
}

export function PspNews() {
  return (
    <section className="sec sec-warm">
      <div className="wrap">
        <p className="label">IN THE NEWS</p>
        <h2>Covered across Indian media.</h2>
        <div className="psp-news">
          {PRESS.map((p) => (
            <a
              className="psp-news-item"
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} loading="lazy" />
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
