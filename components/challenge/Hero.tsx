"use client";

import { useEffect, useRef, useState } from "react";
const COHORT_FLOOR = 4;        // never drops below this
const COHORT_TICK_MS = 20_000; // one popup + one decrement every 20s

function getCohortMeta() {
  const now = new Date();
  const cohortDate = new Date(now);
  cohortDate.setDate(cohortDate.getDate() + 4); // 4 days ahead, rolls daily
  const dateLabel = cohortDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const key = `lp-cohort-${cohortDate.getFullYear()}-${cohortDate.getMonth() + 1}-${cohortDate.getDate()}`;
  const seed = cohortDate.getFullYear() * 10000 + (cohortDate.getMonth() + 1) * 100 + cohortDate.getDate();
  const start = 24 + (seed % 5); // per-cohort start, 24–28
  return { dateLabel, key, start };
}
export function Hero() {
const [cohort, setCohort] = useState<{ slots: number; dateLabel: string } | null>(null);
  const [day, setDay] = useState(0);
  const [shotFiring, setShotFiring] = useState(false);
  const lastShotRef = useRef(-1);
  const firedConfettiRef = useRef(false);
  const slotsRef = useRef(0);

  useEffect(() => {
    const { dateLabel, key, start } = getCohortMeta();

    // Read any saved value; never let it climb back up (descending across refreshes)
    let slots = start;
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) slots = Math.min(start, Math.max(COHORT_FLOOR, parseInt(saved, 10)));
    } catch {}
    const persist = (v: number) => { try { localStorage.setItem(key, String(v)); } catch {} };

    slotsRef.current = slots;
    persist(slots);
    setCohort({ slots, dateLabel });

    if (slots <= COHORT_FLOOR) return; // already at floor → no popups

    const interval = setInterval(() => {
      if (slotsRef.current <= COHORT_FLOOR) { clearInterval(interval); return; }
      const nextSlots = slotsRef.current - 1;
      slotsRef.current = nextSlots;
      persist(nextSlots);
      setCohort((c) => (c ? { ...c, slots: nextSlots } : c));
      window.dispatchEvent(new CustomEvent("lp-cohort-joiner")); // tell JoinerToasts to pop
      if (nextSlots <= COHORT_FLOOR) clearInterval(interval);    // reached floor → stop
    }, COHORT_TICK_MS);

    return () => clearInterval(interval);
  }, []);

  const t = day / 30;
  const afterOpacity = t;
  const beforeOpacity = 1 - t * 0.85;
  const energyWidth = 30 + 60 * t;
  const confWidth = 25 + 68 * t;
  const healthWidth = 35 + 58 * t;
  const sparkOpacity = t > 0.92 ? 1 : 0;

  useEffect(() => {
    // Fire the injection-shot animation every 7th day, once per value.
    if (day > 0 && day % 7 === 0) {
      if (lastShotRef.current !== day) {
        lastShotRef.current = day;
        setShotFiring(false);
        // restart the CSS animation by toggling the class off then on
        requestAnimationFrame(() => setShotFiring(true));
      }
    } else {
      lastShotRef.current = -1;
    }

    if (day >= 30 && !firedConfettiRef.current) {
      firedConfettiRef.current = true;
      (window as any).lpConfetti?.(150);
    }
    if (day < 30) firedConfettiRef.current = false;
  }, [day]);

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="badge-row">
            <span className="pill">Doctor-led</span>
            <span className="pill">Made for India</span>
            <span className="pill">GLP-1 backed</span>
          </div>
          <h1>
             <span className="pct">30 Days</span>
            <br />
            Hard Challenge
          </h1>
          <p className="hero-tag">
           With GLP-1 medicines, doctors, dietitians and health coaches for your transformation in next 30 days.
           </p>
          <ul className="sub" style={{ listStyle: "none", padding: 0 }}>
             <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
              <span>💪</span> No mandatory workouts
             </li>
             <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
             <span>💪</span> No strict diets
             </li>
             <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span>💪</span> A community that keeps pushing you forward
           </li>
          </ul>
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
            <span className="dot"></span> Only&nbsp;<b>{cohort ? cohort.slots : "—"}</b>&nbsp;slots left for the {cohort ? cohort.dateLabel : "upcoming"} cohort
          </div>
          <a href="/challenge/unlock" className="btn btn-primary" style={{ marginTop: "22px", fontSize: "17px", padding: "15px 30px" }}>
            Begin the Challenge <span className="arrow">›</span>
          </a>
        </div>

        <div className="hero-anim">
          <div className="tx-figure">
            <div className="tx-day-badge">DAY {day}</div>
            <span className={`shot-label ${shotFiring ? "fire" : ""}`}>💉 Shot day!</span>

            {/* Before character */}
            <div className="tx-char" style={{ opacity: beforeOpacity }}>
              <svg viewBox="0 0 240 360" width="186" aria-hidden="true">
                <ellipse cx="120" cy="348" rx="62" ry="9" fill="rgba(0,0,0,.25)" />
                <path d="M96 250 q-10 50 -12 86 q-1 9 9 9 q9 0 10 -9 l6 -78z" fill="#2A2A30" />
                <path d="M124 250 q10 50 12 86 q1 9 -9 9 q-9 0 -10 -9 l-6 -78z" fill="#2A2A30" />
                <path d="M84 344 q-3 8 7 9 h15 q4 0 4 -5 l-1 -7z" fill="#F0F0F0" />
                <path d="M156 344 q3 8 -7 9 h-15 q-4 0 -4 -5 l1 -7z" fill="#F0F0F0" />
                <path
                  d="M72 158 q48 -24 96 0 q16 9 18 46 q3 40 -6 60 q-2 6 -11 6 h-98 q-9 0 -11 -6 q-9 -20 -6 -60 q2 -37 18 -46z"
                  fill="#C77F88"
                />
                <path d="M84 212 q36 16 72 0 q-4 28 -13 42 h-46 q-9 -14 -13 -42z" fill="#B66E78" opacity=".5" />
                <path d="M72 162 q-12 4 -18 26 l16 8 q4 -18 12 -28z" fill="#B66E78" />
                <path d="M168 162 q12 4 18 26 l-16 8 q-4 -18 -12 -28z" fill="#B66E78" />
                <path d="M58 184 q-10 26 -10 50 q0 8 7 8 q6 0 7 -8 q1 -22 8 -42z" fill="#E8B59B" />
                <path d="M182 184 q10 26 10 50 q0 8 -7 8 q-6 0 -7 -8 q-1 -22 -8 -42z" fill="#E8B59B" />
                <circle cx="50" cy="244" r="9" fill="#E8B59B" />
                <circle cx="190" cy="244" r="9" fill="#E8B59B" />
                <path d="M108 128 q12 6 24 0 l-2 20 q-10 6 -20 0z" fill="#E8B59B" />
                <ellipse cx="120" cy="98" rx="34" ry="38" fill="#E8B59B" />
                <circle cx="86" cy="102" r="7" fill="#E8B59B" />
                <circle cx="154" cy="102" r="7" fill="#E8B59B" />
                <path
                  d="M84 96 q-4 -52 36 -54 q40 2 36 54 q-2 -12 -8 -20 q-2 10 -6 16 q-2 -28 -22 -30 q-20 2 -22 30 q-4 -6 -6 -16 q-6 8 -8 20z"
                  fill="#2B1B14"
                />
                <circle cx="120" cy="50" r="11" fill="#2B1B14" />
                <path d="M100 88 q8 -4 16 -1" stroke="#3a2a20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M124 87 q8 -3 16 1" stroke="#3a2a20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <ellipse cx="108" cy="99" rx="3.4" ry="4" fill="#2a1d18" />
                <ellipse cx="132" cy="99" rx="3.4" ry="4" fill="#2a1d18" />
                <path d="M120 101 l-2 10 q2 2 4 0" stroke="#cf9a82" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M110 121 q10 3 20 0" stroke="#a4655c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            {/* After character */}
            <div className="tx-char" style={{ opacity: afterOpacity }}>
              <svg viewBox="0 0 240 360" width="186" aria-hidden="true">
                <defs>
                  <radialGradient id="aura3">
                    <stop offset="0%" stopColor="rgba(201,162,75,.45)" />
                    <stop offset="72%" stopColor="rgba(201,162,75,0)" />
                  </radialGradient>
                </defs>
                <circle cx="120" cy="192" r="122" fill="url(#aura3)" />
                <ellipse cx="120" cy="348" rx="46" ry="8" fill="rgba(0,0,0,.25)" />
                <path d="M106 246 q-6 52 -7 88 q0 8 8 8 q7 0 8 -8 l3 -86z" fill="#2A2A30" />
                <path d="M120 246 q6 52 7 88 q0 8 -8 8 q-7 0 -8 -8 l-3 -86z" fill="#2A2A30" />
                <path d="M97 344 q-3 8 6 9 h13 q4 0 4 -5 l-1 -7z" fill="#F0F0F0" />
                <path d="M143 344 q3 8 -6 9 h-13 q-4 0 -4 -5 l1 -7z" fill="#F0F0F0" />
                <path
                  d="M92 158 q28 -16 56 0 q12 8 13 42 q2 34 -5 56 q-2 6 -10 6 h-52 q-8 0 -10 -6 q-7 -22 -5 -56 q1 -34 13 -42z"
                  fill="#C77F88"
                />
                <path d="M97 212 q23 12 46 0 q-3 24 -10 38 h-26 q-7 -14 -10 -38z" fill="#B66E78" opacity=".45" />
                <path d="M92 162 q-10 4 -14 22 l14 7 q3 -16 10 -25z" fill="#B66E78" />
                <path d="M148 162 q10 4 14 22 l-14 7 q-3 -16 -10 -25z" fill="#B66E78" />
                <path d="M94 184 q-16 14 -14 36 q1 7 8 7 l12 -3 q-8 -22 -2 -38z" fill="#E8B59B" />
                <g>
                  <path d="M146 182 q22 -10 28 -40 q2 -8 -6 -9 q-7 -1 -9 6 q-6 24 -20 33z" fill="#E8B59B" />
                  <rect x="168" y="118" width="10" height="30" rx="3" fill="#3AA0E0" transform="rotate(22 173 133)" />
                  <rect x="167" y="112" width="11" height="9" rx="2" fill="#1D6FA5" transform="rotate(22 172 116)" />
                </g>
                <path d="M110 130 q10 6 20 0 l-2 18 q-8 5 -16 0z" fill="#E8B59B" />
                <ellipse cx="120" cy="100" rx="31" ry="35" fill="#E8B59B" />
                <circle cx="90" cy="103" r="6.5" fill="#E8B59B" />
                <circle cx="150" cy="103" r="6.5" fill="#E8B59B" />
                <path
                  d="M89 98 q-4 -48 31 -50 q35 2 31 50 q-2 -11 -7 -18 q-2 9 -6 14 q-2 -26 -18 -28 q-16 2 -18 28 q-4 -5 -6 -14 q-5 7 -7 18z"
                  fill="#2B1B14"
                />
                <circle cx="120" cy="54" r="10" fill="#2B1B14" />
                <path d="M102 90 q7 -4 14 -1" stroke="#3a2a20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M124 89 q7 -3 14 1" stroke="#3a2a20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <ellipse cx="109" cy="101" rx="3.2" ry="3.8" fill="#2a1d18" />
                <ellipse cx="131" cy="101" rx="3.2" ry="3.8" fill="#2a1d18" />
                <circle cx="110" cy="100" r="1" fill="#fff" />
                <circle cx="132" cy="100" r="1" fill="#fff" />
                <path d="M120 103 l-2 9 q2 2 4 0" stroke="#cf9a82" strokeWidth="2" fill="none" strokeLinecap="round" />
                <ellipse cx="104" cy="113" rx="5" ry="3" fill="#e89a90" opacity=".5" />
                <ellipse cx="136" cy="113" rx="5" ry="3" fill="#e89a90" opacity=".5" />
                <path d="M108 117 q12 11 24 0" stroke="#a4655c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <svg className="tx-spark" viewBox="0 0 300 320" aria-hidden="true" style={{ opacity: sparkOpacity }}>
              <g fill="#E8CB85">
                <path className="st" d="M50 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
                <path className="st" d="M250 90l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" style={{ animationDelay: ".3s" }} />
                <path className="st" d="M240 220l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" style={{ animationDelay: ".6s" }} />
                <path className="st" d="M48 230l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" style={{ animationDelay: ".9s" }} />
              </g>
            </svg>

            {/* Injection-shot animation — fires every 7th day */}
            <div className={`shot-flash ${shotFiring ? "fire" : ""}`} />
            <svg className={`tx-shot ${shotFiring ? "fire" : ""}`} viewBox="0 0 90 44" aria-hidden="true">
              <g transform="rotate(-18 45 22)">
                <rect x="6" y="17" width="44" height="10" rx="2" fill="#dfe7ea" stroke="#9fb3bb" strokeWidth="1" />
                <rect x="10" y="19" width="34" height="6" rx="1" fill="#bfe0ef" />
                <rect x="48" y="14" width="9" height="16" rx="2" fill="#cfd8dc" stroke="#9fb3bb" strokeWidth="1" />
                <rect x="0" y="15" width="7" height="14" rx="2" fill="#cfd8dc" stroke="#9fb3bb" strokeWidth="1" />
                <rect x="57" y="20.5" width="22" height="3" rx="1.5" fill="#9fb3bb" />
                <rect x="79" y="21" width="9" height="2" fill="#7d9199" />
              </g>
            </svg>
          </div>

          <div className="tx-slider-wrap">
            <input
              type="range"
              className="tx-slider"
              min={0}
              max={30}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
            />
            <div className="lab">
              <span>Day 0</span>
              <span>Day 30</span>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--gold-light)", textAlign: "center", margin: "2px 0 12px", fontWeight: 600 }}>
            💉 An injection day every 7 days
          </p>

          <div className="bars">
            <div className="bar">
              <b>Energy</b>
              <div className="track">
                <div className="fill" style={{ width: `${energyWidth}%` }} />
              </div>
            </div>
            <div className="bar">
              <b>Confidence</b>
              <div className="track">
                <div className="fill" style={{ width: `${confWidth}%` }} />
              </div>
            </div>
            <div className="bar">
              <b>Health markers</b>
              <div className="track">
                <div className="fill" style={{ width: `${healthWidth}%` }} />
              </div>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "var(--sage)", opacity: 0.7, marginTop: "8px", textAlign: "center" }}>
            *Illustrative simulation. Individual results vary.
          </p>
        </div>
      </div>
    </section>
  );
}
