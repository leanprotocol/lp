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
  type: "video" | "image";
  src: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initial: "P",
    name: "Pratima",
    meta: "37 yrs",
    badge: "Before & After",
    quote: "I finally found a program that actually understood my body instead of just giving generic advice.",
    result: "−7 kg",
    when: "in 2.5 months",
    type: "image",
    src: "/before-after/Pratima, 37 Lost 7Kgs in 2.5 months.jpeg",
  },
  {
    initial: "K",
    name: "Kanti",
    meta: "44 yrs",
    badge: "Before & After",
    quote: "I was skeptical about GLP-1 at first, but the doctor consultations made me feel safe every step of the way.",
    result: "−8.5 kg",
    when: "in 3 months",
    type: "image",
    src: "/before-after/Kanti, 44 Lost 8.5 Kgs in 3 months.png",
  },
  {
    initial: "M",
    name: "Manav",
    meta: "24 yrs · Student",
    badge: "Video story",
    quote: "For the first time the food noise just went quiet. My doctor adjusted my plan every week — I never felt alone.",
    result: "−20 kg",
    when: "in 5 months",
    type: "video",
    src: "/before-after/manav.mp4",
  },
  {
    initial: "U",
    name: "Uday",
    meta: "",
    badge: "Video story",
    quote: "Structured, doctor-led, and genuinely effective. The weekly check-ins kept me accountable.",
    result: "Transformation",
    when: "journey",
    type: "video",
    src: "/before-after/uday.mp4",
  },
  {
    initial: "A",
    name: "Ayushi",
    meta: "22 yrs",
    badge: "Video story",
    quote: "I'd tried every diet. This was the first one with actual science and a doctor behind it. The check-ins kept me going.",
    result: "−15 kg",
    when: "in 6 months",
    type: "video",
    src: "/before-after/ayushi.mp4",
  },
  {
    initial: "A",
    name: "Ananya",
    meta: "20 yrs",
    badge: "Video story",
    quote: "The at-home blood test found what years of dieting missed. My energy and confidence are transformed.",
    result: "−14 kg",
    when: "in 7 months",
    type: "video",
    src: "/before-after/ananya.mp4",
  },
  {
    initial: "A",
    name: "Aditya",
    meta: "",
    badge: "Video story",
    quote: "Doorstep delivery and constant support made this the easiest health decision I've made.",
    result: "Transformation",
    when: "journey",
    type: "video",
    src: "/before-after/Aditya .mp4",
  },
  {
    initial: "R",
    name: "Roshni",
    meta: "23 yrs",
    badge: "Video story",
    quote: "Doctor-led made all the difference. Side effects were managed early and the support was constant.",
    result: "−15 kg",
    when: "in 6 months",
    type: "video",
    src: "/before-after/roshni.mp4",
  },
  {
    initial: "N",
    name: "Neema",
    meta: "46 yrs",
    badge: "Before & After",
    quote: "At 46 I thought it was too late. The personalised plan proved me wrong — sustainable and safe.",
    result: "−10.8 kg",
    when: "in 4 months",
    type: "image",
    src: "/before-after/Neema, 46 Lost 10.8 kgs in 4 months.png",
  },
  {
    initial: "R",
    name: "Rohit",
    meta: "39 yrs",
    badge: "Before & After",
    quote: "Labs, doctor, dietitian, delivery — everything in one place. I just had to show up and follow it.",
    result: "−9.1 kg",
    when: "in 15 weeks",
    type: "image",
    src: "/before-after/Rohit, 39 Lost 9.1 kg in 15 weeks.png",
  },
  {
    initial: "A",
    name: "Atreyee",
    meta: "28 yrs",
    badge: "Video story",
    quote: "I was about to buy a GLP-1 program that cost less and thank god I didn't. The constant motivation made all the difference.",
    result: "−6 kg",
    when: "in 1 month",
    type: "video",
    src: "/before-after/atreyee.mp4",
  },
];

export function TestimonialsCarousel() {
  const { idx, goTo, next, prev, stageRef, getCardStyle } = useCoverflow({
    count: TESTIMONIALS.length,
    cardWidth: 340,
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
                        {t.type === "video" ? (
                          <video
                            src={t.src}
                            controls
                            playsInline
                            preload="metadata"
                            className="tmedia-fill"
                          />
                        ) : (
                          <img src={t.src} alt={`${t.name} result`} className="tmedia-fill" loading="lazy" />
                        )}
                        <span className="badge">{t.badge}</span>
                      </div>
                      <div className="who">
                        <div className="ava">{t.initial}</div>
                        <div>
                          <b>{t.name}</b>
                          {t.meta && <small>{t.meta}</small>}
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
