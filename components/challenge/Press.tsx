const PRESS_LOGOS = [
  {
    className: "zee",
    href: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html",
    content: (
      <>
        <span className="box">ZEE</span>
        <span className="t">NEWS</span>
      </>
    ),
  },
  {
    className: "n24",
    href: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/",
    content: (
      <span className="t">
        NEWS<b>24</b>
      </span>
    ),
  },
  {
    className: "ntoday",
    href: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
    content: (
      <span className="t">
        News Today<b> 24x7</b>
      </span>
    ),
  },
  {
    className: "startup",
    href: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/",
    content: (
      <span className="t">
        The <b>Startup</b> Story
      </span>
    ),
  },
  {
    className: "tribune",
    href: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/",
    content: <span className="t">The Tribune</span>,
  },
  {
    className: "republic",
    href: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
    content: (
      <span className="t">
        The <b>Republic</b> News
      </span>
    ),
  },
];

export function Press() {
  return (
    <section className="press">
      <div className="wrap">
        <div className="label">Featured across India&apos;s leading publications</div>
        <div className="press-logos">
          {PRESS_LOGOS.map((logo) => (
            <a
              key={logo.className}
              className={`plogo ${logo.className}`}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {logo.content}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
