"use client";

import { useEffect, useState } from "react";
import { HeroLeadForm } from "./HeroLeadForm";

export function Hero() {
  const [viewers, setViewers] = useState(79);

  useEffect(() => {
    // Slowly ticks up to feel alive, like the original page's effect.
    const interval = setInterval(() => {
      setViewers((v) => v + (Math.random() > 0.6 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="lead">
      <div className="wrap hero-grid">
        <div>
          <div className="badge-row">
            <span className="pill">Doctor-led</span>
            <span className="pill">Made for India</span>
            <span className="pill">GLP-1 backed</span>
          </div>
          <h1>
            The <span className="pct">30 Days</span>
            <br />
            Hard Challenge
          </h1>
          <p className="sub">
            Lose up to <b>22% body weight</b> in 30 days with a personalised, doctor-led GLP-1 protocol — blood
            tests, 1-on-1 expert care, and medicines delivered.{" "}
            <b>Start the 30 Days Hard Challenge with a ₹449 doctor consultation.</b>
          </p>
          <div className="hero-trust">
            <div className="avatars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>{" "}
            Joined by <b style={{ color: "var(--cream)", margin: "0 3px" }}>10,000+</b> people across India
          </div>
          <div className="viewing">
            <span className="dot"></span> <b>{viewers}</b>&nbsp;people joined the challenge today
          </div>
        </div>

        <HeroLeadForm />
      </div>
    </section>
  );
}
