"use client";

import { useCoverflow } from "./useCoverflow";

interface Testimonial {
  initial: string;
  name: string;
  meta: string;
  badge: string;
  quote: string;
  result: string;
  when: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initial: "M",
    name: "Manav",
    meta: "24 yrs · Student",
    badge: "Before & After",
    quote: "For the first time the food noise just went quiet. My doctor adjusted my plan every week — I never felt alone.",
    result: "−20 kg",
    when: "in 5 months",
  },
  {
    initial: "A",
    name: "Ayushi",
    meta: "22 yrs",
    badge: "Video story",
    quote: "I'd tried every diet. This was the first one with actual science and a doctor behind it. The check-ins kept me going.",
    result: "−15 kg",
    when: "in 6 months",
  },
  {
    initial: "R",
    name: "Roshni",
    meta: "23 yrs",
    badge: "Before & After",
    quote: "Doctor-led made all the difference. Side effects were managed early and the support was constant.",
    result: "−15 kg",
    when: "in 6 months",
  },
  {
    initial: "A",
    name: "Ananya",
    meta: "20 yrs",
    badge: "Video story",
    quote: "The at-home blood test found what years of dieting missed. My energy and confidence are transformed.",
    result: "−14 kg",
    when: "in 7 months",
  },
  {
    initial: "N",
    name: "Neema",
    meta: "46 yrs",
    badge: "Before & After",
    quote: "At 46 I thought it was too late. The personalised plan proved me wrong — sustainable and safe.",
    result: "−10.8 kg",
    when: "in 4 months",
  },
  {
    initial: "R",
    name: "Rohit",
    meta: "39 yrs",
    badge: "Video story",
    quote: "Labs, doctor, dietitian, delivery — everything in one place. I just had to show up and follow it.",
    result: "−9.1 kg",
    when: "in 15 weeks",
  },
];

export function TestimonialsCarousel() {
  const { idx, goTo, next, prev, stageRef, getCardStyle } = useCoverflow({
    count: TESTIMONIALS.length,
    cardWidth: 300,
    intervalMs: 4400,
  });

  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="divider"></div>
          <h2>Real people. Real results.</h2>
          <p>10,000+ transformations and counting. Swipe through real Lean Protocol members.</p>
        </div>

        <div className="stage testi-stage" ref={stageRef}>
          <div className="ring">
            {TESTIMONIALS.map((t, i) => {
              const style = getCardStyle(i);
              return (
                <div
                  key={i}
                  className={`c3d ${style.isActive ? "active" : ""}`}
                  style={{
                    transform: style.transform,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                    filter: style.filter,
                    pointerEvents: style.pointerEvents,
                  }}
                >
                  <div className="inner">
                    <div className="tcard">
                      <div className="tmedia">
                        <div className="tmedia-ph">
                          <span className="play">▶</span>
                          <span className="ph-label">Photo / video</span>
                        </div>
                        <span className="badge">{t.badge}</span>
                      </div>
                      <div className="who">
                        <div className="ava">{t.initial}</div>
                        <div>
                          <b>{t.name}</b>
                          <small>{t.meta}</small>
                        </div>
                      </div>
                      <div className="stars">★★★★★</div>
                      <div className="quote">&quot;{t.quote}&quot;</div>
                      <div className="res">
                        <div className="big">{t.result}</div>
                        <div className="when">{t.when}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="controls">
          <button className="cbtn" onClick={prev} aria-label="Previous">‹</button>
          <div className="dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`dot-i ${i === idx ? "on" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${i + 1}`}
              />
            ))}
          </div>
          <button className="cbtn" onClick={next} aria-label="Next">›</button>
        </div>
        <p className="swipe-hint">↔ Drag, swipe, or use the arrows</p>
        <p className="swipe-hint" style={{ marginTop: "18px" }}>
          *Individual results vary. Names/results shown with member consent. Quotes are illustrative of member
          experiences.
        </p>
      </div>
    </section>
  );
}
