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
  title: "30 Days GLP-1 Challenge",
  forText: "The 1-month challenge — start here",
  price: "₹399",
  priceUnit: "",
  was: "+ spin to unlock your bonus offer",
  features: [
    "Root cause analysis & eligibility check",
    "GLP-1 prescription (if suitable)",
    "Dedicated health coach",
    "Personalised diet chart according to roadmap",
    "NMC-certified doctor assessment (endocrine & internal medicine)",
    "Avg. 6 kg weight loss*",
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
          <p>Every plan is doctor-designed. Start with the 30 Days GLP-1 Challenge.</p>
        </div>

        <div className="pcard-single">
          <div className="pmedia">
            <img src="/challenge/plan-poster.png" alt="The 30 Days GLP-1 Challenge" className="pmedia-fill" />
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
          <a href="/unlock" className={`btn ${PLAN.ctaClass}`}>
            {PLAN.ctaLabel} <span className="arrow">›</span>
          </a>
          <p style={{ fontSize: "10px", color: "var(--muted, #9DB0A8)", marginTop: "10px", textAlign: "center", fontWeight: 300 }}>*Data calculated based on 1000+ participants. Individual results vary.</p>
        </div>
      </div>
    </section>
  );
}

