"use client";

// app/course-quiz/quiz-funnel.tsx
//
// Served at forms.leanprotocol.in/course via a beforeFiles host rewrite in
// next.config.mjs (the plain array form runs after filesystem routing and
// never fires - HANDOVER s5). leanprotocol.in/course is untouched and still
// sells the same master class at Rs 99.
//
// Four questions drawn at random from a pool of eleven, a score as a
// percentage, then the master class at Rs 49 behind a pop-up.
//
// Two things worth knowing about the flow:
//   - the lead is written BEFORE Razorpay opens, so an abandoned payment is
//     still a lead a caller can follow up
//   - there is no way back to a question once answered, so a score cannot be
//     farmed by retrying
//
// Pure ASCII file.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  QUIZ_POOL, QUIZ_PER_RUN, QUIZ_CHAPTERS, QUIZ_PARTNERS,
  QUIZ_PRICE_INR, QUIZ_MRP_INR, QUIZ_MID_INR, QUIZ_OFFER_SECONDS,
  QUIZ_TESTIMONIAL,
  type QuizQuestion,
} from "@/content/course-quiz";
import { COURSE } from "@/content/course";

const RUPEE = "\u20b9";
const inr = (n: number) => RUPEE + n.toLocaleString("en-IN");

type RzpWindow = Window & {
  Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (x: { error?: { description?: string } }) => void) => void };
};

const S = { INTRO: 0, QUIZ: 1, RESULT: 2, SELL: 3, DONE: 4 } as const;
type Step = (typeof S)[keyof typeof S];

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as RzpWindow).Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("The payment window did not load. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

/* Fisher-Yates on a copy, so a returning visitor does not get the same four. */
function drawQuestions(): QuizQuestion[] {
  const a = QUIZ_POOL.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, QUIZ_PER_RUN);
}

function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const p = (k: string) => q.get(k) || "";
  return {
    utm_source: p("utm_source"), utm_medium: p("utm_medium"), utm_campaign: p("utm_campaign"),
    utm_content: p("utm_content"), utm_term: p("utm_term"), campaign_id: p("campaign_id"),
    gclid: p("gclid"), fbclid: p("fbclid"),
    page_url: window.location.href.slice(0, 1000),
    referrer: document.referrer.slice(0, 500),
  };
}

function Brand({ dark }: { dark?: boolean }) {
  return (
    <div className="brand">
      <Image src="/logo-cropped.png" alt="" width={28} height={28} priority />
      <span style={dark ? { color: "#C8D9A7" } : undefined}>LEAN PROTOCOL</span>
    </div>
  );
}

export default function QuizFunnel() {
  const [step, setStep] = useState<Step>(S.INTRO);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [showPop, setShowPop] = useState(false);
  const [phase, setPhase] = useState(0);          // price animation stage
  const [confetti, setConfetti] = useState(false);
  const [secs, setSecs] = useState(QUIZ_OFFER_SECONDS);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const attribution = useRef<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions(drawQuestions());
    setPicks(new Array(QUIZ_PER_RUN).fill(null));
    attribution.current = readAttribution();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [step, qi]);

  const score = useMemo(
    () => picks.reduce((a: number, p, i) => a + (questions[i] && p === questions[i].correct ? 1 : 0), 0),
    [picks, questions]
  );
  const pct = Math.round((score / QUIZ_PER_RUN) * 100);
  const fullMarks = score === QUIZ_PER_RUN && questions.length === QUIZ_PER_RUN;

  /* The price animation. Each stage is a setTimeout rather than a CSS chain
     so the form and the timer can be revealed at the exact end of it. */
  useEffect(() => {
    if (!showPop) return;
    if (fullMarks) { setPhase(4); return; }
    setPhase(0);
    const t: number[] = [];
    t.push(window.setTimeout(() => setPhase(1), 650));   // slash the MRP
    t.push(window.setTimeout(() => setPhase(2), 1350));  // show the mid price
    t.push(window.setTimeout(() => setPhase(3), 1950));  // slash the mid price
    t.push(window.setTimeout(() => { setPhase(4); setConfetti(true); }, 2650));
    t.push(window.setTimeout(() => setConfetti(false), 6300));
    return () => t.forEach(window.clearTimeout);
  }, [showPop, fullMarks]);

  /* Countdown, once the form is on screen. It does NOT change the price at
     zero: expiring a real discount on a timer creates a refund argument. */
  useEffect(() => {
    if (!showPop || phase < 4) return;
    setSecs(QUIZ_OFFER_SECONDS);
    const id = window.setInterval(() => setSecs((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [showPop, phase]);

  /* Bring the form into view the moment it appears, and put the cursor in it. */
  useEffect(() => {
    if (!showPop || phase < 4) return;
    const t = window.setTimeout(() => {
      try { formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch { }
      nameRef.current?.focus({ preventScroll: true });
    }, 140);
    return () => window.clearTimeout(t);
  }, [showPop, phase]);

  useEffect(() => {
    if (!showPop) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowPop(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [showPop]);

  const pick = (n: number) => {
    if (picks[qi] !== null) return;
    setPicks((p) => { const next = p.slice(); next[qi] = n; return next; });
  };

  const ready = name.trim().length > 1 && /^[6-9]\d{9}$/.test(phone) && agreed;

  const submit = useCallback(async () => {
    if (!ready || busy) return;
    setBusy(true); setError(null);
    try {
      /* The lead first, always. An abandoned payment is still a lead. */
      const lead = await fetch("/api/course-quiz/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), phone, score, marketing, ...attribution.current,
        }),
      });
      const ld = await lead.json().catch(() => ({}));
      if (!lead.ok || !ld?.success) throw new Error(ld?.error || "Could not save your details. Please try again.");

      if (fullMarks) { setShowPop(false); setStep(S.DONE); setBusy(false); return; }

      const r = await fetch("/api/course-quiz/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone }),
      });
      const order = await r.json().catch(() => ({}));
      if (!r.ok || !order?.success) throw new Error(order?.error || "Could not start payment. Please try again.");

      await loadRazorpay();
      const W = window as RzpWindow;
      if (!W.Razorpay) throw new Error("The payment window did not load. Please try again.");

      const rzp = new W.Razorpay({
        key: order.keyId,
        amount: order.amount * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "Lean Protocol",
        description: "GLP weight loss master class",
        prefill: { name: name.trim(), contact: phone },
        theme: { color: "#193231" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const v = await fetch("/api/course-quiz/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              }),
            });
            const d = await v.json().catch(() => ({}));
            if (!v.ok || !d?.success) throw new Error("verify");
            const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
            try { w.gtag?.("event", "purchase", { transaction_id: resp.razorpay_payment_id, value: order.amount, currency: "INR" }); } catch { }
            try { w.fbq?.("track", "Purchase", { value: order.amount, currency: "INR" }); } catch { }
            setShowPop(false);
            setStep(S.DONE);
          } catch {
            setError(`Your payment went through, but we could not confirm it. Do not pay again. Email support@leanprotocol.in with reference ${resp.razorpay_payment_id}.`);
          } finally { setBusy(false); }
        },
      });
      rzp.on("payment.failed", (e) => {
        setError(e?.error?.description || "Payment failed. No money was taken. Please try again.");
        setBusy(false);
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }, [ready, busy, name, phone, score, marketing, fullMarks]);

  if (!questions.length) return <main className="cq"><div className="wrap" /></main>;

  const q = questions[qi];
  const answered = picks[qi] !== null;
  const dark = step === S.INTRO || step === S.RESULT || step === S.DONE;
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <main className={"cq" + (dark ? " dark" : "")} style={dark ? { background: "#193231" } : undefined}>
      <div className="wrap">

        {/* ---------------- intro ---------------- */}
        {step === S.INTRO && (
          <div className="step">
            <div className="bar">
              <Brand dark />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", color: "#8FA79A" }}>60 SECONDS</span>
            </div>
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, minHeight: 0, padding: "24px 0" }}>
              <h1 className="hook">You think you know well about GLP? <span style={{ color: "#C9A84C" }}>Let&rsquo;s see!!</span></h1>
              <div className="steps">
                <div><b>1</b><span>Answer four quick questions</span></div>
                <div><b>2</b><span>See your score and the real answers</span></div>
                <div className="gold"><b>3</b><span>Score full marks and the course is free</span></div>
              </div>
            </div>
            <div style={{ flex: "none" }}>
              <button type="button" className="cta lime" onClick={() => setStep(S.QUIZ)}>Start the quiz &rarr;</button>
              <p className="foot">Taught by a doctor and a senior health coach. Educational only.</p>
            </div>
          </div>
        )}

        {/* ---------------- questions ---------------- */}
        {step === S.QUIZ && (
          <div className="step" key={qi}>
            <div className="bar">
              <Brand />
              <span className="noback">NO GOING BACK</span>
            </div>
            <div className="prog">
              <div className="prog-bars">
                {questions.map((_, n) => <span key={n} className={"prog-bar" + (n <= qi ? " on" : "")} />)}
              </div>
              <p>QUESTION {qi + 1} OF {QUIZ_PER_RUN}</p>
            </div>
            <h2 className="q">{q.q}</h2>
            <div className="opts">
              {q.opts.map((o, n) => {
                let cls = "opt";
                if (answered && n === q.correct) cls += " right";
                else if (answered && n === picks[qi]) cls += " wrong";
                return (
                  <button key={n} type="button" className={cls} onClick={() => pick(n)} disabled={answered}>
                    <span className="k">{"ABCD"[n]}</span>
                    <span className="t">{o}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="explain">
                <p className="v">{picks[qi] === q.correct ? "CORRECT" : "NOT QUITE"}</p>
                <p>{q.why} <b>{q.chapter}</b> covers it in full.</p>
              </div>
            )}
            <div className="push">
              <button
                type="button"
                className="cta"
                disabled={!answered}
                onClick={() => (qi === QUIZ_PER_RUN - 1 ? setStep(S.RESULT) : setQi((v) => v + 1))}
              >
                {qi === QUIZ_PER_RUN - 1 ? "See my score" : "Next question"}
              </button>
              {!answered && <p className="foot">Pick an answer to continue.</p>}
            </div>
          </div>
        )}

        {/* ---------------- result ---------------- */}
        {step === S.RESULT && (
          <div className="step">
            <div className="bar"><Brand dark /></div>
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: "18px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flex: "none" }}>
                <div className="pct"><b>{pct}%</b><span>YOUR SCORE</span></div>
                <div style={{ minWidth: 0 }}>
                  <h2 className="big" style={{ color: "#F9F7F2" }}>
                    {fullMarks ? "Full marks." : pct >= 50 ? "Not bad." : "Plenty to learn."}
                  </h2>
                  <p style={{ margin: "7px 0 0", fontSize: 14, lineHeight: 1.45, color: "#B9CBC0" }}>
                    {score} of {QUIZ_PER_RUN} correct
                  </p>
                </div>
              </div>
              <div style={{ flex: "none" }}>
                <p className="eyebrow" style={{ color: "#8FA79A", marginBottom: 10 }}>INSIDE THE MASTER CLASS</p>
                <div className="chaps">
                  {QUIZ_CHAPTERS.map((c) => (
                    <div className="chap" key={c.n}>
                      <div className="thumb">
                        <em>{c.n}</em>
                        {c.img ? <Image src={c.img} alt="" fill sizes="220px" style={{ objectFit: "cover" }} /> : null}
                        <span className="play">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                        </span>
                      </div>
                      <p>{c.t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surprise">
                <p>{fullMarks
                  ? "You scored full marks, so the course is yours free. Claim it below."
                  : "You might have missed the chance for a free course, but we have a huge surprise for you."}</p>
              </div>
            </div>
            <div style={{ flex: "none" }}>
              <button type="button" className="cta lime" onClick={() => setStep(S.SELL)}>Unlock surprise &rarr;</button>
            </div>
          </div>
        )}

        {/* ---------------- the course ---------------- */}
        {step === S.SELL && (
          <div className="step">
            <div className="bar">
              <Brand />
              <button type="button" className="back" onClick={() => setStep(S.RESULT)} aria-label="Go back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
            </div>
            <h2 className="big" style={{ color: "#193231", paddingTop: 22, flex: "none" }}>
              You are one step away from the best and transformative GLP course in the world.
            </h2>
            <div className="who" style={{ paddingTop: 20, flex: "none" }}>
              <div>
                <div className="ph"><Image src="/course/instructors/abhinav-dobrial.webp" alt="" fill sizes="200px" /></div>
                <b>Abhinav Dobrial</b><small>Senior health coach</small>
              </div>
              <div>
                <div className="ph"><Image src="/course/instructors/dr-siddharth-garg.jpeg" alt="" fill sizes="200px" /></div>
                <b>Dr. Siddharth Garg</b><small>MBBS, MD Internal Medicine</small>
              </div>
            </div>
            <div style={{ paddingTop: 22, flex: "none" }}>
              <p className="eyebrow">WHAT YOU GET</p>
              <div className="gets">
                <div><b>13</b><span>video chapters, watched in the app</span></div>
                <div><b>5</b><span>diet charts for different stages of weight loss</span></div>
                <div><b>5</b><span>hidden ways to increase the GLP effects</span></div>
                <div><b style={{ fontSize: 15 }}>1k+</b><span>member community, included</span></div>
              </div>
            </div>
            <div style={{ paddingTop: 18, flex: "none" }}>
              {playing ? (
                <div className="vid">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${COURSE.intro.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title="Master class introduction"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button type="button" className="vid" onClick={() => setPlaying(true)} aria-label="Play the introduction">
                  <Image src={COURSE.intro.poster} alt="" fill sizes="470px" style={{ objectFit: "cover" }} />
                  <span className="play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                  </span>
                  <span className="cap">Master class introduction</span>
                </button>
              )}
            </div>
            <div style={{ paddingTop: 18, flex: "none" }}>
              <div className="quote">
                <p>&ldquo;{QUIZ_TESTIMONIAL.quote}&rdquo;</p>
                <b>{QUIZ_TESTIMONIAL.who}</b>
              </div>
            </div>
            <div style={{ paddingTop: 22, flex: "none" }}>
              <p className="eyebrow">TRUSTED PARTNERS</p>
              <div className="partners">
                {QUIZ_PARTNERS.map((p) => (
                  <div className="partner" key={p.alt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.alt} loading="lazy" decoding="async" />
                    <small>{p.sub}</small>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ paddingTop: 22, flex: "none" }}>
              <button type="button" className="cta" onClick={() => setShowPop(true)}>Avail your surprise offer</button>
              <p className="foot">Educational content, not medical advice.</p>
            </div>
          </div>
        )}

        {/* ---------------- done ---------------- */}
        {step === S.DONE && (
          <div className="step">
            <div className="bar"><Brand dark /></div>
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
              <div className="tick">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7" /></svg>
              </div>
              <h2 className="big" style={{ color: "#F9F7F2", fontSize: 34 }}>
                {fullMarks ? "Full marks, so it is on us." : "You are in."}
              </h2>
              <p className="lede">
                {fullMarks
                  ? `Our team will unlock the master class on +91 ${phone} shortly. Download the Lean Protocol app and sign in with that number.`
                  : `All 13 chapters are unlocked on +91 ${phone}. Download the Lean Protocol app and sign in with that number to start watching.`}
              </p>
            </div>
            <div style={{ flex: "none" }}>
              <a className="cta lime" href={COURSE.app.playStore} target="_blank" rel="noopener noreferrer">Get the app</a>
              <p className="foot">Questions? <a href="https://wa.me/919650491267" style={{ color: "#C8D9A7" }}>Message us on WhatsApp</a></p>
            </div>
          </div>
        )}

      </div>

      {/* ---------------- the offer pop-up ---------------- */}
      {showPop && (
        <div className="scrim" role="dialog" aria-modal="true" aria-labelledby="cq-pop-title" onClick={() => setShowPop(false)}>
          <div className="pop" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="popclose" onClick={() => setShowPop(false)} aria-label="Close">&times;</button>
            {confetti && (
              <div className="cq-conf" aria-hidden="true">
                {Array.from({ length: 42 }).map((_, i) => (
                  <i key={i} style={{
                    left: `${(i * 2.4 + (i % 5) * 3) % 100}%`,
                    background: ["#C8D9A7", "#C9A84C", "#2D5A4E", "#8DB87A"][i % 4],
                    animationDuration: `${1.9 + (i % 7) * 0.2}s`,
                    animationDelay: `${(i % 11) * 0.09}s`,
                  }} />
                ))}
              </div>
            )}

            <h3 id="cq-pop-title">
              {fullMarks ? "Your full-marks reward" : "Your surprising price for the course is"}
            </h3>

            <div className="stage">
              {fullMarks ? (
                <span className="price free">Free</span>
              ) : phase < 2 ? (
                <span className="price old">{inr(QUIZ_MRP_INR)}{phase === 1 && <span className="cq-slash" />}</span>
              ) : phase < 4 ? (
                <span className="price mid">{inr(QUIZ_MID_INR)}{phase === 3 && <span className="cq-slash" />}</span>
              ) : (
                <span className="price final">{inr(QUIZ_PRICE_INR)}</span>
              )}
            </div>

            {phase >= 4 && !fullMarks && (
              <div className="timerbar">Offer ends in <b>{mm}:{ss}</b></div>
            )}

            {phase >= 4 && (
              <div ref={formRef}>
                <div className="fld">
                  <label htmlFor="cq-nm">Your name</label>
                  <input id="cq-nm" ref={nameRef} className="field" type="text" autoComplete="name"
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </div>
                <div className="fld">
                  <label htmlFor="cq-ph">Mobile number</label>
                  <div className="phone">
                    <span className="cc">+91</span>
                    <input id="cq-ph" className="field" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national"
                      value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile" />
                  </div>
                </div>
                <label className="consent">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <span>I am 18 or older and accept the <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms</a>, <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund Policy</a>.</span>
                </label>
                <label className="consent">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                  <span>Send me health tips and offers on WhatsApp. Optional.</span>
                </label>
                {error && <p className="err" role="alert">{error}</p>}
                <button type="button" className="cta" disabled={!ready || busy} onClick={submit} style={{ marginTop: 4 }}>
                  {busy ? "Opening secure payment..." : fullMarks ? "Claim my free course" : "Avail your offer now"}
                </button>
                <p className="foot" style={{ marginTop: 10 }}>
                  {fullMarks ? "No payment needed." : "Secure payment by Razorpay."} The course unlocks on this number.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}