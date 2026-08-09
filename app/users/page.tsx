"use client";

/* Lean Protocol - /users funnel, v2.
   Also served at forms.leanprotocol.in via the rewrite in next.config.mjs.

   NOTE: this file contains no raw non-ASCII characters. Arrows, dashes and
   symbols use JSX unicode escapes such as {"\u2192"} so the file cannot be
   corrupted by an editor or shell writing ANSI. See ARCHITECTURE.md section 12.

   Step order:
     0 intro | 1 reason | 2 target | 3 height | 4 weight
     5 conditions | 6 timing | 7 loading | 8 projection | 9 BMI
     10 register | 11 done                                                   */

import { useCallback, useEffect, useRef, useState } from "react";

const ARROW = "\u2192";
const TICK = "\u2713";
const MINUS = "\u2212";
const DASH = "\u2014";
const APPROX = "\u2248";

const S = {
  INTRO: 0, REASON: 1, TARGET: 2, HEIGHT: 3, WEIGHT: 4,
  CONDITIONS: 5, TIMING: 6, LOADING: 7, GRAPH: 8, BMI: 9,
  REGISTER: 10, DONE: 11,
} as const;

const NONE = "None of these";

type Question = {
  step: number;
  key: string;
  title: string;
  hint: string;
  multi: boolean;
  options: string[];
  img?: string;
  caption?: string;
};

const QUESTIONS: Question[] = [
  {
    step: S.REASON, key: "reason",
    title: "What is your main reason for losing fat?",
    hint: "It changes which expert leads your protocol.",
    multi: false,
    options: [
      "For better energy and performance",
      "My doctor suggested it",
      "For aesthetic reasons",
    ],
    img: "/journey/journey4.png", caption: "Your why comes first",
  },
  {
    step: S.TARGET, key: "target",
    title: "How much are you planning to lose?",
    hint: `A rough target is enough ${DASH} we model the rest.`,
    multi: false,
    options: ["2-5 kg", "5-10 kg", "10 kg or more"],
    img: "/journey/journey5.webp", caption: "Modelled on real outcomes",
  },
  {
    step: S.CONDITIONS, key: "conditions",
    title: "Any of these medical conditions?",
    hint: `Select all that apply ${DASH} this is what a doctor reviews first.`,
    multi: true,
    options: ["Diabetes", "Hypertension", "Thyroid", "Fatty liver", "PCOS / PCOD", NONE],
  },
  {
    step: S.TIMING, key: "timing",
    title: "When would you like to begin?",
    hint: "Blood collection is usually scheduled within 48 hours.",
    multi: false,
    options: ["As soon as possible", "Within one month", "Not sure yet"],
    img: "/journey/journey1.webp", caption: "Collected at your door",
  },
];

const STORIES = [
  { name: "Pratima, 37", result: "Lost 7 kg in 2.5 months*", img: "/testimonials/pratima.png",
    quote: "The first month I barely noticed. By the third my clothes did." },
  { name: "Neema, 46", result: "Lost 10.8 kg in 4 months*", img: "/testimonials/neema.png",
    quote: "At 46 I thought it was too late. The plan proved me wrong." },
  { name: "Rohit, 39", result: "Lost 9.1 kg in 15 weeks*", img: "/testimonials/rohit.png",
    quote: "They fixed my protein before they touched anything else." },
  { name: "Atreyee, 28", result: "Lost 6 kg*", img: "/lp-assets/atreyee-transformation.jpeg",
    quote: "My wedding approached and I lost more than I thought I would." },
];

const DOCTORS = [
  { name: "Dr. Nishant Jain", role: "MD, DM (Endo)", img: "/lp-assets/experts/nishant.jpeg" },
  { name: "Dr. Akhil Konduru", role: "MD, Internal Med", img: "/lp-assets/experts/akhil.jpeg" },
  { name: "Dr. Gautam Kumar", role: "MD, DM (Endo)", img: "/lp-assets/experts/gautam.jpeg" },
];

const LOAD_MSGS = [
  "Reading your inputs",
  "Modelling your metabolism",
  "Comparing to member outcomes",
  "Building your projection",
];

const BANDS = [
  { name: "Underweight", range: "<18.5", color: "#8FB8D9" },
  { name: "Normal", range: "18.5-24.9", color: "#9CBF6B" },
  { name: "Overweight", range: "25-29.9", color: "#E3C04A" },
  { name: "Obesity", range: "30-39.9", color: "#DE9A4E" },
  { name: "Extreme", range: "40+", color: "#C85A42" },
];

/* Content is written per band. The headline, the explanation and the bullets
   all change with the result - a generic paragraph under a specific number
   reads as boilerplate and undercuts the rest of the screen. */
/* Content is written per band. Kept deliberately short - this sits at the
   end of a six-step funnel, and a wall of text is where people leave. */
const BAND_CONTENT = [
  {
    lead: "A low BMI needs a doctor to look at why first.",
    body: "Weight loss is not the goal here. Thyroid, absorption and nutrition come first.",
    points: [
      "A GLP-1 protocol would not be appropriate.",
      "The panel still checks thyroid, iron and hormones.",
    ],
  },
  {
    lead: "You are in the normal range, but where fat sits matters more than the number.",
    body: "A normal BMI can still hide visceral fat, which is what drives insulin resistance.",
    points: [
      "Waist size tells a doctor more than BMI here.",
      "The panel reads insulin, HbA1c and lipids directly.",
    ],
  },
  {
    lead: "This range is linked to early insulin resistance and a slowing metabolism.",
    body: "It is also the window where intervention works best, while the changes are still reversible.",
    points: [
      "Eligibility usually needs BMI 27+ with a related condition.",
      "Your doctor decides that from the panel, not from BMI.",
    ],
  },
  {
    lead: "At this range weight is likely affecting other systems already.",
    body: "Blood pressure, liver markers and glucose are often affected before symptoms show.",
    points: [
      "BMI 30+ is the usual threshold a doctor considers.",
      "Any prescription still depends on your panel and history.",
    ],
  },
  {
    lead: "This range carries significant metabolic risk.",
    body: "Weight at this level rarely acts alone. Supervised care with regular review is essential.",
    points: [
      "An endocrinologist reviews your case first.",
      "Existing medication is accounted for before anything starts.",
    ],
  },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function UsersFunnel() {
  const [step, setStep] = useState<number>(S.INTRO);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [other, setOther] = useState("");
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [weight, setWeight] = useState(84);
  const [load, setLoad] = useState(0);
  const [storyIdx, setStoryIdx] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [hoverT, setHoverT] = useState<number | null>(null);

  const plotRef = useRef<HTMLDivElement>(null);

  const loadTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const storyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Pointer tracking on the projection chart. Works for mouse and touch:
     we normalise the x position to 0-1 across the plot, then read the same
     easing curve the line is drawn from, so the dot sits exactly on it. */
  const onHover = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const el = plotRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = "touches" in e && e.touches[0] ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    if (cx === undefined) return;
    setHoverT(Math.min(1, Math.max(0, (cx - r.left) / r.width)));
  }, []);

  const onLeave = useCallback(() => setHoverT(null), []);

  const clearTimers = useCallback(() => {
    if (loadTimer.current) clearInterval(loadTimer.current);
    if (storyTimer.current) clearInterval(storyTimer.current);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /* ---------- derived ---------- */
  const heightCm = Math.round((ft * 12 + inch) * 2.54);
  const bmiNum = weight / Math.pow(heightCm / 100, 2);
  const bmi = bmiNum.toFixed(1);

  const bandIdx =
    bmiNum < 18.5 ? 0 : bmiNum < 25 ? 1 : bmiNum < 30 ? 2 : bmiNum < 40 ? 3 : 4;
  const bandPos =
    bmiNum < 18.5 ? (bmiNum / 18.5) * 20
    : bmiNum < 25 ? 20 + ((bmiNum - 18.5) / 6.5) * 20
    : bmiNum < 30 ? 40 + ((bmiNum - 25) / 5) * 20
    : bmiNum < 40 ? 60 + ((bmiNum - 30) / 10) * 20
    : 80 + Math.min(1, (bmiNum - 40) / 10) * 20;

  const goalPick = answers.target as string | undefined;
  const goalKg =
    goalPick === "2-5 kg" ? 5 : goalPick === "5-10 kg" ? 10 : Math.max(12, Math.round(weight * 0.18));
  const loss = Math.min(goalKg, Math.round(weight * 0.22));
  const target = Math.max(45, weight - loss);
  const lossKg = weight - target;
  const lossPct = Math.round((lossKg / weight) * 100);

  const now = new Date();
  const monthPts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { label: MONTHS[d.getMonth()], y: d.getFullYear() };
  });
  const targetDate = `${monthPts[6].label} ${monthPts[6].y}`;

  const yTop = 12, yBot = 140, xL = 6, xR = 314;
  const hiV = weight + 2, loV = target - 4;
  const yFor = (v: number) => yTop + ((hiV - v) / (hiV - loV)) * (yBot - yTop);
  const pts = monthPts.map((m, i) => {
    const t = i / 6;
    const v = weight - (weight - target) * (1 - Math.pow(1 - t, 1.9));
    return { x: Math.round(xL + t * (xR - xL)), y: Math.round(yFor(v) * 10) / 10, label: m.label, i };
  });
  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i], cx = (p0.x + p1.x) / 2;
    linePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const areaPath = `${linePath} L ${pts[6].x} ${yBot} L ${pts[0].x} ${yBot} Z`;
  const gridVals = [Math.round(hiV), Math.round((hiV + loV) / 2), Math.round(loV)];

  /* Same curve as linePath, sampled at the pointer. nearIdx highlights the
     closest month label so the axis responds too. */
  let hover = { on: false, left: 0, top: 0, tipTop: 0, kg: 0, month: "" };
  let nearIdx = -1;
  if (hoverT !== null) {
    const hv = weight - (weight - target) * (1 - Math.pow(1 - hoverT, 1.9));
    const hy = yFor(hv);
    nearIdx = Math.round(hoverT * 6);
    const mo = monthPts[Math.min(6, Math.max(0, nearIdx))];
    hover = {
      on: true,
      left: Math.round(hoverT * 1000) / 10,
      top: Math.round((hy / 160) * 150),
      tipTop: Math.max(6, Math.round((hy / 160) * 150) - 56),
      kg: Math.round(hv * 10) / 10,
      month: `${mo.label} ${mo.y}`,
    };
  }

  const conds = (answers.conditions as string[]) || [];
  const flags: string[] = [];
  if (conds.includes("Diabetes")) flags.push("Diabetes flagged - GLP-1 is often prescribed for this overlap.");
  if (conds.includes("Thyroid")) flags.push("Thyroid is checked before anything is prescribed.");
  if (conds.includes("PCOS / PCOD")) flags.push("PCOS changes how you store fat. The protocol accounts for it.");
  if (conds.includes("Fatty liver")) flags.push("Fatty liver often improves as visceral fat comes down.");
  if (conds.includes("Hypertension")) flags.push("Blood pressure is tracked alongside weight.");

  const question = QUESTIONS.find((q) => q.step === step);
  const isChoice = Boolean(question);
  const noneOnly = conds.length === 1 && conds[0] === NONE;
  const answered = question
    ? question.multi
      ? conds.length > 0 || other.trim().length > 0
      : answers[question.key] !== undefined
    : false;

  const qNumByStep: Record<number, number> = {
    [S.REASON]: 1, [S.TARGET]: 2, [S.HEIGHT]: 3,
    [S.WEIGHT]: 4, [S.CONDITIONS]: 5, [S.TIMING]: 6,
  };
  const qNum = qNumByStep[step] || 1;
  const showBar = step >= S.REASON && step <= S.TIMING;
  const timeLeft = step <= S.TARGET ? `${APPROX} 90 sec left`
    : step <= S.WEIGHT ? `${APPROX} 60 sec left`
    : `${APPROX} 30 sec left`;

  const phoneDigits = phone.replace(/\D/g, "");
  const canSubmit = name.trim().length > 0 && /^[6-9]\d{9}$/.test(phoneDigits) && consent;

  /* ---------- navigation ---------- */
  const startLoading = useCallback(() => {
    clearTimers();
    setLoad(0);
    setStoryIdx(0);
    loadTimer.current = setInterval(() => {
      setLoad((n) => {
        if (n + 2 >= 100) {
          if (loadTimer.current) clearInterval(loadTimer.current);
          if (storyTimer.current) clearInterval(storyTimer.current);
          setStep(S.GRAPH);
          return 100;
        }
        return n + 2;
      });
    }, 120);   /* 100 steps of 2 at 120ms = 6.0s, one third longer than before */
    storyTimer.current = setInterval(() => setStoryIdx((i) => (i + 1) % STORIES.length), 2300);
  }, [clearTimers]);

  const next = useCallback(() => {
    setStep((s) => {
      if (s === S.LOADING) return s;
      if (s === S.TIMING) {
        setTimeout(startLoading, 60);
        return S.LOADING;
      }
      return s + 1;
    });
  }, [startLoading]);

  const back = useCallback(() => {
    clearTimers();
    setStep((s) => (s === S.INTRO ? s : s === S.GRAPH ? S.TIMING : s - 1));
  }, [clearTimers]);

  const restart = useCallback(() => {
    clearTimers();
    setStep(S.INTRO);
    setAnswers({});
    setOther("");
    setName("");
    setPhone("");
    setConsent(false);
    setLoad(0);
    setSendError(null);
  }, [clearTimers]);

  function choose(q: Question, value: string) {
    if (q.multi) {
      setAnswers((a) => {
        let cur = ((a[q.key] as string[]) || []).slice();
        if (value === NONE) {
          cur = cur.includes(NONE) ? [] : [NONE];
          setOther("");
        } else {
          cur = cur.filter((x) => x !== NONE);
          const i = cur.indexOf(value);
          if (i >= 0) cur.splice(i, 1);
          else cur.push(value);
        }
        return { ...a, [q.key]: cur };
      });
    } else {
      setAnswers((a) => ({ ...a, [q.key]: value }));
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(next, 240);
    }
  }

  async function submit() {
    if (!canSubmit || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/users/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+91${phoneDigits}`,
          weight: String(weight),
          height_cm: String(heightCm),
          bmi,
          bmi_band: BANDS[bandIdx].name,
          goal: (answers.reason as string) || "",
          target_loss: (answers.target as string) || "",
          conditions: conds.join(", "),
          conditions_other: other.trim(),
          timeline: (answers.timing as string) || "",
          projected_target_kg: String(target),
          source: "users-questionnaire",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data?.error || "Could not submit. Please try again.");
      setStep(S.DONE);
    } catch (err: any) {
      setSendError(err.message || "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const firstName = name.trim().split(" ")[0] || "friend";

  /* ---------- render ---------- */
  return (
    <div className="stage">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="card">
        <div className="card-wash" />
        <div className="blob blob-a" />
        <div className="blob blob-b" />

        <div className="topbar">
          <button
            type="button"
            className="back"
            onClick={back}
            style={{ opacity: step === S.INTRO ? 0 : 1, pointerEvents: step === S.INTRO ? "none" : "auto" }}
            aria-label="Go back"
          >
            {"\u2190"}
          </button>
          <img src="/logo-cropped.png" alt="Lean Protocol" />
        </div>

        {showBar && (
          <div className="prog">
            <div className="prog-bars">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="prog-bar"
                  style={{ background: i < qNum ? "#2D5A4E" : i === qNum ? "#C8D9A7" : "rgba(28,43,34,.12)" }}
                />
              ))}
            </div>
            <div className="prog-meta">
              <span>QUESTION 0{qNum} OF 06</span>
              <span style={{ letterSpacing: ".04em" }}>{timeLeft}</span>
            </div>
          </div>
        )}

        <div className="step" key={`step-${step}`}>

          {/* ---------- intro ---------- */}
          {step === S.INTRO && (
            <div className="pane">
              <div className="badge">2-MINUTE ELIGIBILITY CHECK</div>
              <h1 className="q-h1">
                India&apos;s doctor-led<br />
                <span className="serif">expert-guided</span> fat-loss plan
              </h1>
              <p className="lede">
                Six questions. We&apos;ll model your six-month curve and tell you if a doctor
                is likely to find you eligible.
              </p>
              <div className="shot" style={{ flex: 1, minHeight: 200, margin: "18px 0 2px" }}>
                <img src="/journey/journey2.png" alt="" style={{ objectPosition: "60% 22%" }} />
                <div className="shot-veil" />
                <div className="shot-cap">Doctor-led from day one</div>
              </div>
              <div className="trust">
                {["Doctor-led", "No medication without a prescription", "Money-back guarantee*"].map((t) => (
                  <div className="trust-item" key={t}>
                    <span className="trust-tick">{TICK}</span>{t}
                  </div>
                ))}
              </div>
              <div className="cta-wrap">
                <button type="button" className="cta cta-primary" onClick={next}>
                  Get my free metabolic score {ARROW}
                </button>
              </div>
              <p className="fine">
                *Screening only. Eligibility and any prescription are decided by a licensed
                physician. Money-back guarantee applies to eligible 6-month programme members
                and is subject to the terms.
              </p>
            </div>
          )}

          {/* ---------- choice questions ---------- */}
          {isChoice && question && (
            <div className="pane">
              <h2 className="q-h2">{question.title}</h2>
              <p className="q-hint">{question.hint}</p>

              <div
                className="opts"
                style={{
                  gridTemplateColumns: question.multi ? "1fr 1fr" : "1fr",
                  flex: question.multi ? 1 : "none",
                  alignContent: question.multi ? "stretch" : "start",
                }}
              >
                {question.options.map((label) => {
                  const on = question.multi
                    ? conds.includes(label)
                    : answers[question.key] === label;
                  return (
                    <button
                      type="button"
                      key={label}
                      className={`opt ${on ? "on" : ""}`}
                      onClick={() => choose(question, label)}
                      aria-pressed={on}
                      style={{
                        flexDirection: question.multi ? "column" : "row",
                        alignItems: question.multi ? "flex-start" : "center",
                        justifyContent: question.multi ? "space-between" : "flex-start",
                        gap: question.multi ? 12 : 15,
                        padding: question.multi ? "16px 14px" : "19px 20px",
                      }}
                    >
                      <span
                        className="opt-mark"
                        style={{
                          width: question.multi ? 30 : 22,
                          height: question.multi ? 30 : 22,
                          borderRadius: question.multi ? 7 : "50%",
                          fontSize: question.multi ? 16 : 12,
                        }}
                      >
                        {on ? TICK : ""}
                      </span>
                      <span
                        className="opt-label"
                        style={{
                          fontSize: question.multi ? 16 : 17,
                          color: on ? "#193231" : "rgba(28,43,34,.8)",
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {question.multi && !noneOnly && (
                <div style={{ marginTop: 14 }}>
                  <input
                    type="text"
                    className="field"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    placeholder="Something else? Type it here"
                    aria-label="Other condition"
                  />
                </div>
              )}

              {question.img && (
                <div className="shot" style={{ flex: 1, minHeight: 110, maxHeight: 190, marginTop: 20 }}>
                  <img src={question.img} alt="" style={{ objectPosition: "center 30%" }} />
                  <div
                    className="shot-veil"
                    style={{ background: "linear-gradient(100deg,rgba(25,50,49,.74),rgba(25,50,49,.06))" }}
                  />
                  <div className="shot-cap" style={{ inset: "auto auto 16px 18px", fontSize: 20 }}>
                    {question.caption}
                  </div>
                </div>
              )}

              <div className="cta-wrap">
                <button
                  type="button"
                  className={`cta ${answered ? "cta-primary" : "cta-idle"}`}
                  onClick={next}
                  disabled={!answered}
                  style={{ padding: 18, fontSize: 17 }}
                >
                  {answered ? `Continue ${ARROW}` : "Pick one to continue"}
                </button>
              </div>
            </div>
          )}

          {/* ---------- height ---------- */}
          {step === S.HEIGHT && (
            <div className="pane">
              <h2 className="q-h2">How tall are you?</h2>
              <p className="q-hint" style={{ marginBottom: 28 }}>
                Height and weight together give us your metabolic baseline.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "FEET", unit: "ft", value: ft, set: setFt, lo: 3, hi: 7 },
                  { label: "INCHES", unit: "in", value: inch, set: setInch, lo: 0, hi: 11 },
                ].map((f) => (
                  <div className="dial" key={f.label}>
                    <div className="dial-label">{f.label}</div>
                    <div className="dial-row">
                      <button
                        type="button" className="nub"
                        style={{ width: 36, height: 36, fontSize: 20 }}
                        onClick={() => f.set(Math.max(f.lo, f.value - 1))}
                        aria-label={`Decrease ${f.label}`}
                      >{MINUS}</button>
                      <span className="dial-val">{f.value}</span>
                      <button
                        type="button" className="nub"
                        style={{ width: 36, height: 36, fontSize: 20 }}
                        onClick={() => f.set(Math.min(f.hi, f.value + 1))}
                        aria-label={`Increase ${f.label}`}
                      >+</button>
                    </div>
                    <div className="dial-unit">{f.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 20, fontSize: 15, color: "rgba(28,43,34,.55)", fontWeight: 600 }}>
                That&apos;s {heightCm} cm
              </div>
              <div className="cta-wrap">
                <button type="button" className="cta cta-primary" onClick={next} style={{ padding: 18, fontSize: 17 }}>
                  Continue {ARROW}
                </button>
              </div>
            </div>
          )}

          {/* ---------- weight ---------- */}
          {step === S.WEIGHT && (
            <div className="pane">
              <h2 className="q-h2">And what do you weigh today?</h2>
              <p className="q-hint" style={{ marginBottom: 30 }}>
                Roughly is fine. Your blood panel is what the doctor actually reads.
              </p>
              <div className="dial" style={{ borderRadius: 26, padding: "30px 24px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
                  <button
                    type="button" className="nub"
                    style={{ width: 46, height: 46, fontSize: 26 }}
                    onClick={() => setWeight((w) => Math.max(40, w - 1))}
                    aria-label="Decrease weight"
                  >{MINUS}</button>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 60, color: "#C8D9A7", letterSpacing: "-.04em", lineHeight: 1 }}>
                      {weight}
                    </span>
                    <span style={{ fontSize: 22, color: "#A8BEB7", fontWeight: 700, marginLeft: 6 }}>kg</span>
                  </div>
                  <button
                    type="button" className="nub"
                    style={{ width: 46, height: 46, fontSize: 26 }}
                    onClick={() => setWeight((w) => Math.min(180, w + 1))}
                    aria-label="Increase weight"
                  >+</button>
                </div>
                <input
                  type="range" min={40} max={180} value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#C8D9A7", marginTop: 24, cursor: "pointer" }}
                  aria-label="Weight in kilograms"
                />
              </div>
              <div className="cta-wrap">
                <button type="button" className="cta cta-primary" onClick={next} style={{ padding: 18, fontSize: 17 }}>
                  Continue {ARROW}
                </button>
              </div>
            </div>
          )}

          {/* ---------- loading ---------- */}
          {step === S.LOADING && (
            <div className="pane">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div className="spin" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: "#193231", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {LOAD_MSGS[Math.min(3, Math.floor(load / 26))]}
                  </div>
                  <div style={{ height: 3, borderRadius: 3, background: "rgba(28,43,34,.12)", marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${load}%`, background: "#2D5A4E", transition: "width .12s linear" }} />
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "rgba(28,43,34,.5)", flex: "none" }}>{load}%</div>
              </div>

              <div className="story" key={`st-${storyIdx}`}>
                <div style={{ position: "relative", flex: 1, minHeight: 250, background: "#22453c" }}>
                  <img
                    src={STORIES[storyIdx].img} alt={STORIES[storyIdx].name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(14,20,17,.1) 30%,rgba(14,20,17,.92))" }} />
                  <div style={{ position: "absolute", inset: "auto 0 0 0", padding: "22px 24px" }}>
                    <div style={{ display: "inline-flex", background: "rgba(200,217,167,.2)", border: "1px solid rgba(200,217,167,.5)", color: "#C8D9A7", borderRadius: 999, padding: "5px 12px", fontWeight: 800, fontSize: 10.5, letterSpacing: ".08em", marginBottom: 10 }}>
                      {STORIES[storyIdx].result}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 19, color: "#F9F7F2", letterSpacing: "-.025em" }}>
                      {STORIES[storyIdx].name}
                    </div>
                  </div>
                </div>
                <div style={{ padding: "18px 22px 20px" }}>
                  <p className="story-quote">{"\u201C"}{STORIES[storyIdx].quote}{"\u201D"}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 18 }}>
                {STORIES.map((_, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === storyIdx ? "#2D5A4E" : "rgba(28,43,34,.18)", transition: "background .3s" }} />
                ))}
              </div>
              <p className="fine" style={{ marginTop: 14 }}>
                *Individual results vary. Names and results shown with member consent.
              </p>
            </div>
          )}

          {/* ---------- projection ---------- */}
          {step === S.GRAPH && (
            <div className="pane">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, color: "rgba(28,43,34,.6)", fontWeight: 600 }}>We can help you reach</div>
                <div style={{ fontWeight: 800, fontSize: "clamp(48px,13vw,68px)", color: "#2D5A4E", letterSpacing: "-.045em", lineHeight: 1, margin: "6px 0", animation: "fnPop .6s both" }}>
                  {target} kg*
                </div>
                <div style={{ fontWeight: 800, fontSize: 19, color: "#193231" }}>by {targetDate}</div>
                <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(28,43,34,.6)", margin: "14px 0 20px" }}>
                  Modelled from your numbers {DASH} then sustained past the six months.
                </p>
              </div>

              <div className="panel" style={{ padding: "20px 16px 14px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "4px 0 10px", flex: "none" }}>
                    {gridVals.map((y) => (
                      <div key={y} style={{ fontSize: 11, fontWeight: 700, color: "rgba(28,43,34,.5)", textAlign: "right", lineHeight: 1 }}>{y}</div>
                    ))}
                  </div>
                  <div
                    ref={plotRef}
                    onMouseMove={onHover}
                    onMouseLeave={onLeave}
                    onTouchStart={onHover}
                    onTouchMove={onHover}
                    onTouchEnd={onLeave}
                    style={{ flex: 1, minWidth: 0, position: "relative", cursor: "crosshair", touchAction: "none" }}
                  >
                    {hover.on && (
                      <>
                        <div style={{ position: "absolute", top: 0, bottom: 34, left: `${hover.left}%`, width: 1, background: "rgba(45,90,78,.35)", pointerEvents: "none", zIndex: 1 }} />
                        <div style={{ position: "absolute", top: hover.top, left: `${hover.left}%`, transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: "#C9A84C", border: "2.5px solid #F9F7F2", boxShadow: "0 4px 12px rgba(25,50,49,.35)", pointerEvents: "none", zIndex: 2 }} />
                        <div style={{ position: "absolute", top: hover.tipTop, left: `${hover.left}%`, transform: "translateX(-50%)", background: "#193231", color: "#F9F7F2", borderRadius: 12, padding: "8px 13px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 3, boxShadow: "0 12px 28px rgba(25,50,49,.35)" }}>
                          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1, color: "#C8D9A7" }}>{hover.kg} kg</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#A8BEB7", marginTop: 3, letterSpacing: ".06em" }}>{hover.month}</div>
                        </div>
                      </>
                    )}
                    <svg viewBox="0 0 320 160" preserveAspectRatio="none" style={{ width: "100%", height: 150, display: "block" }} aria-label="Projected weight over six months">
                      <defs>
                        <linearGradient id="fnFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2D5A4E" stopOpacity=".22" />
                          <stop offset="100%" stopColor="#2D5A4E" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {gridVals.map((v) => (
                        <line key={v} x1="0" y1={Math.round(yFor(v))} x2="320" y2={Math.round(yFor(v))} stroke="rgba(28,43,34,.1)" strokeWidth="1" strokeDasharray="3 5" />
                      ))}
                      <path d={areaPath} fill="url(#fnFill)" />
                      <path
                        d={linePath} fill="none" stroke="#2D5A4E" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1000"
                        vectorEffect="non-scaling-stroke"
                        style={{ animation: "fnDraw 1.4s cubic-bezier(.2,.7,.2,1) both" }}
                      />
                      {pts.map((p) => (
                        <circle key={p.i} cx={p.x} cy={p.y} r={p.i === 6 ? 5.5 : 4} fill={p.i === 6 ? "#C9A84C" : "#2D5A4E"} stroke="#F9F7F2" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      {pts.map((p) => (
                        <div key={p.i} style={{ fontSize: 11, fontWeight: 800, color: p.i === nearIdx ? "#2D5A4E" : p.i === 6 ? "#193231" : "rgba(28,43,34,.45)", lineHeight: 1, whiteSpace: "nowrap", transition: "color .2s" }}>
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <div className="stat">
                  <div className="stat-n" style={{ color: "#C8D9A7" }}>{lossKg} kg</div>
                  <div className="stat-l">Projected loss*</div>
                </div>
                <div className="stat">
                  <div className="stat-n" style={{ color: "#C9A84C" }}>{lossPct}%</div>
                  <div className="stat-l">Of body weight*</div>
                </div>
              </div>

              <div className="cta-wrap" style={{ paddingTop: 22 }}>
                <button type="button" className="cta cta-primary" onClick={next} style={{ padding: 18, fontSize: 17 }}>
                  Get my insights {ARROW}
                </button>
              </div>
              <p className="fine" style={{ fontSize: 10.5, marginTop: 12 }}>
                *Modelled from Lean Protocol member averages. Individual results vary with
                medical assessment. Not a prediction or a guarantee of outcome.
              </p>
            </div>
          )}

          {/* ---------- BMI ---------- */}
          {step === S.BMI && (
            <div className="pane">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, color: "rgba(28,43,34,.6)", fontWeight: 600 }}>Your BMI is</div>
                <div style={{ fontWeight: 800, fontSize: "clamp(56px,16vw,84px)", color: BANDS[bandIdx].color, letterSpacing: "-.05em", lineHeight: 1, margin: "2px 0", animation: "fnPop .6s both" }}>
                  {bmi}
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(28,43,34,.7)", margin: "10px 0 24px" }}>
                  You fall into the{" "}
                  <span style={{ background: "rgba(201,168,76,.22)", color: "#8a6d18", fontWeight: 800, padding: "2px 9px", borderRadius: 6 }}>
                    {BANDS[bandIdx].name.toLowerCase()}
                  </span>{" "}
                  range.
                </p>
              </div>

              <div className="panel" style={{ padding: "20px 18px", borderRadius: 22 }}>
                <div style={{ position: "relative", height: 20, marginBottom: 10 }}>
                  <div style={{ position: "absolute", left: `${Math.round(bandPos * 10) / 10}%`, top: 0, transform: "translateX(-50%)", color: BANDS[bandIdx].color, fontSize: 15, lineHeight: 1, transition: "left .8s cubic-bezier(.2,.7,.2,1)" }}>
                    {"\u25BC"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {BANDS.map((b, i) => (
                    <div key={b.name} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: 9, background: b.color, borderRadius: 3, opacity: i === bandIdx ? 1 : 0.3 }} />
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: i === bandIdx ? "#193231" : "rgba(28,43,34,.45)", marginTop: 7 }}>{b.range}</div>
                      <div style={{ fontSize: 9.5, color: "rgba(28,43,34,.5)", marginTop: 2, lineHeight: 1.2 }}>{b.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-dark" style={{ marginTop: 14, padding: "18px 18px" }}>
                <div style={{ fontSize: 10.5, letterSpacing: ".14em", fontWeight: 800, color: "#C8D9A7", marginBottom: 10 }}>
                  WHAT THIS MEANS FOR YOU
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 14.5, lineHeight: 1.5, color: "#F9F7F2", fontWeight: 600 }}>
                  {BAND_CONTENT[bandIdx].lead}
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.55, color: "#A8BEB7" }}>
                  {BAND_CONTENT[bandIdx].body}
                </p>
                <div style={{ display: "grid", gap: 7 }}>
                  {[...BAND_CONTENT[bandIdx].points, ...flags].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, lineHeight: 1.4, color: "#A8BEB7" }}>
                      <span style={{ color: "#C9A84C", fontWeight: 800, flex: "none" }}>{"\u2022"}</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 10.5, color: "rgba(28,43,34,.5)", margin: "10px 0 0", lineHeight: 1.5 }}>
                Asian-Indian cut-offs are lower than the scale shown {DASH} overweight starts
                at 23. Screening signal only, not a diagnosis.
              </p>

              <div className="cta-wrap" style={{ paddingTop: 20 }}>
                <button type="button" className="cta cta-primary" onClick={next} style={{ padding: 18, fontSize: 17 }}>
                  Unlock my plan {ARROW}
                </button>
              </div>
            </div>
          )}

          {/* ---------- register ---------- */}
          {step === S.REGISTER && (
            <div className="pane">
              <h2 className="q-h2" style={{ fontSize: "clamp(25px,6.4vw,33px)", margin: "0 0 22px" }}>
                Last step to unlock your{" "}
                <span className="serif">personalised fat-loss plan.</span>
              </h2>

              <div style={{ display: "grid", gap: 11 }}>
                <input
                  type="text" className="field" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" autoComplete="name"
                  style={{ padding: "18px 20px", fontSize: 16.5 }}
                  aria-label="Your name"
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ background: "#fff", border: "1.5px solid rgba(28,43,34,.14)", borderRadius: 16, padding: "18px 16px", fontSize: 16.5, fontWeight: 700, color: "#193231", flex: "none" }}>
                    +91
                  </div>
                  <input
                    type="tel" className="field" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="WhatsApp number" inputMode="numeric" maxLength={10}
                    autoComplete="tel-national"
                    style={{ flex: 1, minWidth: 0, padding: "18px 20px", fontSize: 16.5 }}
                    aria-label="WhatsApp number"
                  />
                </div>
              </div>

              <label className="consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  I agree to be contacted about my enquiry and accept the{" "}
                  <a href="/users/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  {" and "}
                  <a href="/users/terms" target="_blank" rel="noopener noreferrer">Terms</a>.
                </span>
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, flex: 1, minHeight: 130, maxHeight: 190, marginTop: 16 }}>
                {DOCTORS.map((d) => (
                  <div key={d.name} style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 34px rgba(25,50,49,.18)" }}>
                    <img src={d.img} alt={d.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 12%" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(14,20,17,.05) 40%,rgba(14,20,17,.88))" }} />
                    <div style={{ position: "absolute", inset: "auto 0 0 0", padding: "10px 11px" }}>
                      <div style={{ fontWeight: 800, fontSize: 12.5, color: "#F9F7F2", lineHeight: 1.2 }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: "#C8D9A7", fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>{d.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              {sendError && <p className="err">{sendError}</p>}

              <div className="cta-wrap" style={{ paddingTop: 20 }}>
                <button
                  type="button"
                  className={`cta ${canSubmit && !sending ? "cta-primary" : "cta-idle"}`}
                  onClick={submit}
                  disabled={!canSubmit || sending}
                >
                  {sending ? "Sending..." : `Unlock my plan ${ARROW}`}
                </button>
              </div>
              <p className="fine" style={{ fontSize: 10.5, marginTop: 11 }}>
                No medication without a doctor&apos;s evaluation.
              </p>
            </div>
          )}

          {/* ---------- done ---------- */}
          {step === S.DONE && (
            <div className="pane" style={{ justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#193231", color: "#C8D9A7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 26px", boxShadow: "0 20px 46px rgba(25,50,49,.3)", animation: "fnPop .5s both" }}>
                {TICK}
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(30px,8.5vw,44px)", letterSpacing: "-.035em", lineHeight: 1.04, margin: "0 0 14px", color: "#193231" }}>
                You&apos;re in, <span className="serif">{firstName}.</span>
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.5, color: "rgba(28,43,34,.62)", margin: "0 0 34px" }}>
                We&apos;ll message you on WhatsApp within 24 hours.
              </p>
              <button type="button" className="cta cta-primary" onClick={restart} style={{ background: "transparent", color: "rgba(28,43,34,.45)", boxShadow: "none", fontSize: 14.5, padding: 0, marginTop: 4 }}>
                Start over
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
