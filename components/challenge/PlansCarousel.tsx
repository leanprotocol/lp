"use client";

interface Plan {
  tag?: string;
  title: string;
  forText: string;
  price: string;
  priceUnit: string;
  was: string;
  features: string[];
  ctaLabel: string;
  ctaClass: string;
}

const PLAN: Plan = {
  tag: "Popular",
  title: "30 Days Hard Challenge",
  forText: "The 1-month challenge — start here",
  price: "₹3,999",
  priceUnit: "/ 1 month",
  was: "+ spin to unlock your bonus offer",
  features: [
    "Doctor consult + eligibility review",
    "GLP-1 medications (in cold chain delivery)",
    "Personalised GLP-1 protocol",
    "Expert GLP-1 dietitian support",
    "24×7 health coach",
  ],
  ctaLabel: "Join the Challenge",
  ctaClass: "btn-primary",
};

export function PlansCarousel() {
  return (
    <section style={{ background: "var(--green-800)" }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="divider"></div>
          <h2>Choose your challenge plan</h2>
          <p>Every plan is doctor-designed. Start with the 30 Days Hard Challenge.</p>
        </div>

        <div className="pcard-single">
          <div className="pmedia">
            <img src="/challenge/plan-poster.png" alt="The 30 Days Hard Challenge" className="pmedia-fill" />
          </div>
          {PLAN.tag && <div className="ptag">{PLAN.tag}</div>}
          <h3>{PLAN.title}</h3>
          <div className="for">{PLAN.forText}</div>
          <div className="price">
            {PLAN.price} <small>{PLAN.priceUnit}</small>
          </div>
          <div className="was">{PLAN.was}</div>
          <ul>
            {PLAN.features.map((f, fi) => (
              <li key={fi}>{f}</li>
            ))}
          </ul>
          <a href="/challenge/unlock" className={`btn ${PLAN.ctaClass}`}>
            {PLAN.ctaLabel} <span className="arrow">›</span>
          </a>
        </div>
      </div>
    </section>
  );
}
