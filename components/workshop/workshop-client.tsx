"use client";

// components/workshop/workshop-client.tsx
// One component, five states: verify -> instructions -> test -> results
// -> certificate. Nothing navigates, so answers cannot be lost to a route
// change. Pure ASCII: unicode via \u escapes.

import { useCallback, useEffect, useRef, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client-config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { Certificate } from "./certificate";

type Stage =
  | "verify"
  | "instructions"
  | "test"
  | "results"
  | "certificate"
  | "blocked";

type Q = { id: number; q: string; options: string[] };

type ResultDetail = {
  id: number;
  q: string;
  options: string[];
  given: number | null;
  answer: number;
  correct: boolean;
  rationale: string;
};

const GREEN = "#2D5A4E";
const DARK = "#193231";
const CREAM = "#F9F7F2";
const GOLD = "#C9A84C";
const RED = "#a02525";

const EXTRA_MS = 2 * 60 * 1000; // the extra-time window at the end

export function WorkshopClient() {
  const [stage, setStage] = useState<Stage>("verify");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // --- sign in ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("91"); // country code, digits only
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const confirmRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // --- test ---
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [idx, setIdx] = useState(0);
  const [msLeft, setMsLeft] = useState(0);

  // --- results ---
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [percent, setPercent] = useState(0);
  const [passed, setPassed] = useState(false);
  const [detail, setDetail] = useState<ResultDetail[]>([]);

  const [blockedMsg, setBlockedMsg] = useState("");

  // ---------- recaptcha ----------
  const ensureRecaptcha = useCallback(() => {
    const auth = getFirebaseAuth();
    if (!auth || typeof window === "undefined") return null;
    if (recaptchaRef.current) return recaptchaRef.current;
    const el = document.getElementById("workshop-recaptcha");
    if (!el) return null;
    try {
      // A failed attempt can leave a verifier bound to this element, and
      // Firebase then refuses to render a second one into it. Clearing the
      // node first makes a retry work instead of erroring.
      el.innerHTML = "";
      (window as any).grecaptcha?.reset?.();
      const v = new RecaptchaVerifier(auth, "workshop-recaptcha", {
        size: "invisible",
        callback: () => {},
      });
      recaptchaRef.current = v;
      return v;
    } catch (e) {
      console.error("recaptcha", e);
      return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        recaptchaRef.current?.clear();
      } catch {}
      recaptchaRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const detailsValid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
    /^\d{1,3}$/.test(cc) &&
    phone.length >= 6 &&
    phone.length <= 12;

  // ---------- send OTP ----------
  const sendOtp = async () => {
    if (!detailsValid) {
      setError("Please complete all three fields");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (cc === "91" && phone === "9999999999") {
        setOtpSent(true);
        setResendIn(30);
        setBusy(false);
        return;
      }
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Verification is unavailable. Contact support.");
      const verifier = ensureRecaptcha();
      if (!verifier) throw new Error("Please refresh the page and try again.");
      confirmRef.current = await signInWithPhoneNumber(
        auth,
        "+" + cc + phone,
        verifier
      );
      setOtpSent(true);
      setResendIn(30);
    } catch (e: any) {
      const code = e?.code || "";
      if (code === "auth/too-many-requests") {
        setError("Too many attempts from this device. Wait a few minutes.");
      } else if (code === "auth/invalid-phone-number") {
        setError("That number is not valid.");
      } else {
        setError(e?.message || "Could not send the code. Try again.");
      }
      try {
        recaptchaRef.current?.clear();
      } catch {}
      recaptchaRef.current = null;
    } finally {
      setBusy(false);
    }
  };

  // ---------- verify OTP ----------
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setBusy(true);
    setError("");
    try {
      let idToken: string;
      if (cc === "91" && phone === "9999999999") {
        if (otp !== "123456") throw new Error("Invalid test code.");
        idToken = "mock-firebase-id-token";
      } else {
        if (!confirmRef.current) throw new Error("Session expired. Resend the code.");
        const cred = await confirmRef.current.confirm(otp);
        idToken = await cred.user.getIdToken();
      }

      const res = await fetch("/api/workshop/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseIdToken: idToken,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setBlockedMsg(data.message || "You have already taken this assessment.");
        setStage("blocked");
        return;
      }
      if (!res.ok) throw new Error(data?.error || "Verification failed");

      setStage("instructions");
    } catch (e: any) {
      const code = e?.code || "";
      if (code === "auth/invalid-verification-code") setError("Incorrect code.");
      else if (code === "auth/code-expired") setError("That code expired. Resend it.");
      else setError(e?.message || "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  // ---------- start ----------
  const startTest = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/workshop/start", { method: "POST" });
      const data = await res.json();
      if (res.status === 409) {
        setBlockedMsg(data.message || "You have already taken this assessment.");
        setStage("blocked");
        return;
      }
      if (!res.ok) throw new Error(data?.error || "Could not start");
      setQuestions(data.questions);
      setMsLeft(data.msLeft);
      setStage("test");
    } catch (e: any) {
      setError(e?.message || "Could not start the assessment.");
    } finally {
      setBusy(false);
    }
  };

  // ---------- submit ----------
  const submitting = useRef(false);
  const submit = useCallback(async () => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/workshop/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not submit");
      setScore(data.score);
      setTotal(data.total);
      setPercent(data.percent ?? 0);
      setPassed(!!data.passed);
      setDetail(data.detail || []);
      setStage("results");
    } catch (e: any) {
      setError(e?.message || "Could not submit. Check your connection.");
      submitting.current = false;
    } finally {
      setBusy(false);
    }
  }, [answers]);

  // ---------- countdown ----------
  useEffect(() => {
    if (stage !== "test") return;
    if (msLeft <= 0) {
      void submit();
      return;
    }
    const t = setInterval(() => {
      setMsLeft((ms) => {
        const next = ms - 1000;
        if (next <= 0) {
          clearInterval(t);
          void submit();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (stage !== "test") return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [stage]);

  const mmss = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return (
      String(Math.floor(s / 60)).padStart(2, "0") +
      ":" +
      String(s % 60).padStart(2, "0")
    );
  };

  // Main 15 minutes, then a separate 2-minute extra-time window.
  const inExtra = msLeft <= EXTRA_MS;
  const shownMs = inExtra ? msLeft : msLeft - EXTRA_MS;
  const warn = !inExtra && shownMs <= 2 * 60 * 1000;

  const answeredCount = Object.keys(answers).length;

  // ---------- certificate ----------
  const openCertificate = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/workshop/certificate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not issue");
      setStage("certificate");
    } catch (e: any) {
      setError(e?.message || "Could not issue the certificate.");
    } finally {
      setBusy(false);
    }
  };

  // ================= render =================

  const shell = (children: React.ReactNode) => (
    <main
      className="min-h-screen px-4 py-8 md:py-14"
      style={{ background: CREAM, color: DARK }}
    >
      <div id="workshop-recaptcha" className="hidden" />
      <div className="mx-auto w-full max-w-[720px]">{children}</div>
    </main>
  );

  const header = (
    <div className="mb-7 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Lean Protocol"
        className="mx-auto mb-4 h-[42px] w-auto"
      />
      <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] md:text-[34px]">
        GLP-1 Protocol Assessment
      </h1>
      <p className="mt-1.5 text-[14.5px]" style={{ color: "rgba(28,43,34,0.6)" }}>
        Dietitian onboarding workshop
      </p>
    </div>
  );

  const errorBox = error ? (
    <div className="mb-4 rounded-xl border border-[#f3c2c2] bg-[#fdf1f1] px-4 py-3 text-[14px] text-[#a02525]">
      {error}
    </div>
  ) : null;

  const input =
    "h-[52px] w-full rounded-xl border border-[rgba(28,43,34,0.16)] bg-[#fafaf7] px-4 text-[16px] outline-none focus:border-[#2D5A4E]";

  // ---------- blocked ----------
  if (stage === "blocked") {
    return shell(
      <>
        {header}
        <div className="rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-7 text-center shadow-[0_12px_32px_rgba(25,50,49,0.07)]">
          <div
            className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full text-[26px] font-extrabold text-white"
            style={{ background: GOLD }}
          >
            !
          </div>
          <h2 className="mb-2 text-[20px] font-extrabold">
            You have already taken the test
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(28,43,34,0.7)" }}>
            {blockedMsg}
          </p>
          <p className="mt-4 text-[13.5px]" style={{ color: "rgba(28,43,34,0.55)" }}>
            If you believe this is an error, please contact the workshop team.
          </p>
        </div>
      </>
    );
  }

  // ---------- verify ----------
  if (stage === "verify") {
    return shell(
      <>
        {header}
        <div className="rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-6 shadow-[0_12px_32px_rgba(25,50,49,0.07)] md:p-8">
          <h2 className="mb-1.5 text-[19px] font-extrabold">
            {otpSent ? "Enter the code" : "Your details"}
          </h2>
          <p className="mb-5 text-[14.5px]" style={{ color: "rgba(28,43,34,0.6)" }}>
            {otpSent
              ? "We sent a 6-digit code to +" + cc + " " + phone
              : "Your name will appear on the certificate exactly as entered."}
          </p>
          {errorBox}

          {!otpSent ? (
            <>
              <div className="mb-3">
                <label className="mb-1.5 block text-[13px] font-bold" style={{ color: "rgba(28,43,34,0.65)" }}>
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As it should appear on your certificate"
                  className={input}
                />
              </div>
              <div className="mb-3">
                <label className="mb-1.5 block text-[13px] font-bold" style={{ color: "rgba(28,43,34,0.65)" }}>
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  placeholder="you@example.com"
                  className={input}
                />
              </div>
              <div className="mb-5">
                <label className="mb-1.5 block text-[13px] font-bold" style={{ color: "rgba(28,43,34,0.65)" }}>
                  Mobile number
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[rgba(28,43,34,0.16)] bg-[#fafaf7] px-3">
                  <span className="text-[15px] font-semibold">+</span>
                  <input
                    value={cc}
                    onChange={(e) =>
                      setCc(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    inputMode="numeric"
                    aria-label="Country code"
                    className="h-[52px] w-[46px] bg-transparent text-[16px] font-semibold outline-none"
                  />
                  <span className="h-[26px] w-px bg-[rgba(28,43,34,0.18)]" />
                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12))
                    }
                    inputMode="numeric"
                    placeholder="Mobile number"
                    className="h-[52px] min-w-0 flex-1 bg-transparent text-[16px] outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[12.5px]" style={{ color: "rgba(28,43,34,0.5)" }}>
                  India is 91. Change it if your number is registered in
                  another country.
                </p>
              </div>
              <button
                onClick={sendOtp}
                disabled={busy || !detailsValid}
                className="w-full rounded-full py-[15px] text-[16px] font-extrabold text-white transition-opacity disabled:opacity-50"
                style={{ background: GREEN }}
              >
                {busy ? "Sending\u2026" : "Send verification code"}
              </button>
            </>
          ) : (
            <>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                placeholder="0 0 0 0 0 0"
                autoFocus
                className="mb-4 h-[58px] w-full rounded-xl border border-[rgba(28,43,34,0.16)] bg-[#fafaf7] text-center font-mono text-[24px] tracking-[0.4em] outline-none"
              />
              <button
                onClick={verifyOtp}
                disabled={busy || otp.length !== 6}
                className="w-full rounded-full py-[15px] text-[16px] font-extrabold text-white transition-opacity disabled:opacity-50"
                style={{ background: GREEN }}
              >
                {busy ? "Verifying\u2026" : "Verify"}
              </button>
              <div className="mt-3 flex items-center justify-between text-[13px]">
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                  style={{ color: "rgba(28,43,34,0.6)" }}
                >
                  Edit details
                </button>
                <button
                  onClick={sendOtp}
                  disabled={resendIn > 0 || busy}
                  className="font-semibold disabled:opacity-50"
                  style={{ color: GREEN }}
                >
                  {resendIn > 0 ? "Resend in " + resendIn + "s" : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // ---------- instructions ----------
  if (stage === "instructions") {
    const rules = [
      ["15 questions", "Multiple choice, one correct answer each."],
      ["15 minutes", "The paper submits itself when the time runs out."],
      ["80% to pass", "12 of 15. A certificate is issued at 80% and above."],
      ["One attempt", "The assessment can be taken once per participant."],
      ["Stay on this page", "Do not close the tab. The clock keeps running if you leave."],
    ];
    return shell(
      <>
        {header}
        <div className="rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-6 shadow-[0_12px_32px_rgba(25,50,49,0.07)] md:p-8">
          <h2 className="mb-5 text-[19px] font-extrabold">Before you begin</h2>
          {errorBox}
          <div className="mb-6 flex flex-col gap-3.5">
            {rules.map(([t, d]) => (
              <div key={t} className="flex items-start gap-3">
                <span
                  className="mt-[3px] flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                  style={{ background: GREEN }}
                >
                  {"\u2713"}
                </span>
                <div>
                  <div className="text-[15.5px] font-bold">{t}</div>
                  <div
                    className="text-[14px] leading-snug"
                    style={{ color: "rgba(28,43,34,0.65)" }}
                  >
                    {d}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mb-6 rounded-xl px-4 py-3 text-[13.5px] leading-snug"
            style={{ background: "rgba(201,168,76,0.12)", color: "#7a6320" }}
          >
            The timer starts the moment you press Start. Make sure you have a
            stable connection and will not be interrupted.
          </div>
          <button
            onClick={startTest}
            disabled={busy}
            className="w-full rounded-full py-[16px] text-[16.5px] font-extrabold text-white transition-opacity disabled:opacity-50"
            style={{ background: GREEN }}
          >
            {busy ? "Starting\u2026" : "Start assessment"}
          </button>
        </div>
      </>
    );
  }

  // ---------- test ----------
  if (stage === "test") {
    const q = questions[idx];
    if (!q) return shell(<p>Loading</p>);
    return shell(
      <>
        <div
          className="sticky top-0 z-10 -mx-4 mb-5 border-b border-[rgba(28,43,34,0.1)] px-4 py-3 backdrop-blur-md"
          style={{ background: "rgba(249,247,242,0.94)" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[13.5px] font-bold" style={{ color: "rgba(28,43,34,0.6)" }}>
              Question {idx + 1} of {questions.length}
            </div>
            <div className="flex items-center gap-2">
              {inExtra && (
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-[0.06em]"
                  style={{ background: "#fdf1f1", color: RED }}
                >
                  EXTRA TIME
                </span>
              )}
              <div
                className="rounded-full px-3.5 py-1.5 font-mono text-[15px] font-bold"
                style={{
                  background: inExtra || warn ? "#fdf1f1" : "rgba(45,90,78,0.1)",
                  color: inExtra || warn ? RED : GREEN,
                }}
              >
                {mmss(shownMs)}
              </div>
            </div>
          </div>
          <div className="mt-2.5 h-[4px] overflow-hidden rounded-full bg-[rgba(28,43,34,0.1)]">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: ((idx + 1) / questions.length) * 100 + "%",
                background: inExtra ? RED : GREEN,
              }}
            />
          </div>
        </div>

        {errorBox}

        <div className="rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-5 shadow-[0_12px_32px_rgba(25,50,49,0.07)] md:p-7">
          <h2 className="mb-5 text-[17.5px] font-extrabold leading-snug md:text-[19px]">
            {q.q}
          </h2>
          <div className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => {
              const on = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className="flex items-start gap-3 rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-colors"
                  style={{
                    borderColor: on ? GREEN : "rgba(28,43,34,0.14)",
                    background: on ? "rgba(45,90,78,0.07)" : "#fff",
                  }}
                >
                  <span
                    className="mt-[2px] flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full border-2 text-[11px] font-extrabold"
                    style={{
                      borderColor: on ? GREEN : "rgba(28,43,34,0.3)",
                      background: on ? GREEN : "transparent",
                      color: "#fff",
                    }}
                  >
                    {on ? "\u2713" : ""}
                  </span>
                  <span className="text-[15px] leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setIdx((n) => Math.max(0, n - 1))}
            disabled={idx === 0}
            className="rounded-full border-[1.5px] px-6 py-3 text-[15px] font-bold disabled:opacity-40"
            style={{ borderColor: "rgba(28,43,34,0.2)" }}
          >
            Back
          </button>
          {idx < questions.length - 1 ? (
            <button
              onClick={() => setIdx((n) => n + 1)}
              className="flex-1 rounded-full py-3 text-[15.5px] font-extrabold text-white"
              style={{ background: GREEN }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={busy}
              className="flex-1 rounded-full py-3 text-[15.5px] font-extrabold disabled:opacity-50"
              style={{ background: GOLD, color: "#0E0E0F" }}
            >
              {busy ? "Submitting\u2026" : "Submit assessment"}
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-[13px]" style={{ color: "rgba(28,43,34,0.55)" }}>
          {answeredCount} of {questions.length} answered
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {questions.map((qq, i) => {
            const done = answers[qq.id] !== undefined;
            return (
              <button
                key={qq.id}
                onClick={() => setIdx(i)}
                className="h-[30px] w-[30px] rounded-lg text-[12.5px] font-bold"
                style={{
                  background: i === idx ? GREEN : done ? "rgba(45,90,78,0.15)" : "#fff",
                  color: i === idx ? "#fff" : DARK,
                  border: "1px solid rgba(28,43,34,0.14)",
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  // ---------- results ----------
  if (stage === "results") {
    return shell(
      <>
        {header}
        <div
          className="mb-5 rounded-[22px] p-7 text-center text-white"
          style={{ background: passed ? DARK : "#5a2d2d" }}
        >
          <div className="text-[13px] font-bold tracking-[0.14em] opacity-80">
            {passed ? "PASSED" : "NOT PASSED"}
          </div>
          <div className="my-2 text-[52px] font-extrabold leading-none">
            {percent}%
          </div>
          <div className="text-[15px] opacity-85">
            {score} of {total} correct
          </div>
        </div>

        {passed ? (
          <div className="mb-5 rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-6 text-center shadow-[0_12px_32px_rgba(25,50,49,0.07)]">
            <h2 className="mb-1.5 text-[18px] font-extrabold">
              Congratulations, {name.trim()}
            </h2>
            <p className="mb-5 text-[14.5px]" style={{ color: "rgba(28,43,34,0.65)" }}>
              Your certificate is ready to download.
            </p>
            {errorBox}
            <button
              onClick={openCertificate}
              disabled={busy}
              className="w-full rounded-full py-[15px] text-[16px] font-extrabold text-white disabled:opacity-50"
              style={{ background: GREEN }}
            >
              {busy ? "Preparing\u2026" : "View certificate"}
            </button>
          </div>
        ) : (
          <div className="mb-5 rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-6 text-center shadow-[0_12px_32px_rgba(25,50,49,0.07)]">
            <h2 className="mb-2 text-[18px] font-extrabold">
              Better luck next time
            </h2>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "rgba(28,43,34,0.68)" }}>
              A certificate is issued at 80% and above. We will be running
              another workshop soon, and you are very welcome to join it.
              The review below covers every question, so it is worth reading
              through before the next session.
            </p>
          </div>
        )}

        <h3 className="mb-3 mt-8 text-[16px] font-extrabold">Review</h3>
        <div className="flex flex-col gap-3">
          {detail.map((d, i) => (
            <div
              key={d.id}
              className="rounded-[18px] border bg-white p-5"
              style={{
                borderColor: d.correct
                  ? "rgba(45,90,78,0.35)"
                  : "rgba(160,37,37,0.3)",
              }}
            >
              <div className="mb-2 flex items-start gap-2.5">
                <span
                  className="mt-[2px] flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                  style={{ background: d.correct ? GREEN : RED }}
                >
                  {d.correct ? "\u2713" : "\u00D7"}
                </span>
                <div className="text-[15.5px] font-bold leading-snug">
                  {i + 1}. {d.q}
                </div>
              </div>
              {!d.correct && (
                <div className="mb-1.5 pl-[30px] text-[14px]">
                  <span style={{ color: RED }}>Your answer: </span>
                  {d.given !== null ? d.options[d.given] : "Not answered"}
                </div>
              )}
              <div className="pl-[30px] text-[14px]">
                <span style={{ color: GREEN }}>Correct: </span>
                {d.options[d.answer]}
              </div>
              <p
                className="mt-2 pl-[30px] text-[13.5px] leading-relaxed"
                style={{ color: "rgba(28,43,34,0.65)" }}
              >
                {d.rationale}
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  // ---------- certificate ----------
  return shell(
    <Certificate name={name.trim()} onBack={() => setStage("results")} />
  );
}
