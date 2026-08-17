"use client";

// components/psp/psp-interactive.tsx
// Every interactive piece of the /psp site. Everything else is rendered
// as a server component in app/psp/page.tsx.
// Pure ASCII: unicode via \u escapes.

import { useEffect, useRef, useState } from "react";
import {
  NAV,
  CTA,
  STAKEHOLDERS,
  JOURNEY,
  CONTINUITY,
  FAQS,
  THERAPY_OPTIONS,
  PROGRAMME_STATUS,
  GEOGRAPHY_OPTIONS,
} from "@/content/psp";

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={"reveal " + (seen ? "in " : "") + className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function PspHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"hdr" + (scrolled ? " scrolled" : "")}>
      <div className="hdr-in">
        <a href="#top" className="hdr-logo" aria-label="Lean Protocol">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Lean Protocol" />
        </a>

        <nav className="hdr-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <a href="#request" className="btn btn-primary hdr-cta">
          {CTA.primary}
        </a>

        <button
          type="button"
          className="hdr-toggle"
          aria-expanded={open}
          aria-controls="psp-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "\u00D7" : "\u2261"}
        </button>
      </div>

      {open && (
        <div className="hdr-drawer" id="psp-drawer">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Stakeholder tabs                                                    */
/* ------------------------------------------------------------------ */

export function StakeholderTabs() {
  const [i, setI] = useState(0);

  return (
    <div>
      <div className="tablist" role="tablist" aria-label="Stakeholder views">
        {STAKEHOLDERS.columns.map((c, n) => (
          <button
            key={c.title}
            role="tab"
            id={"sh-tab-" + n}
            aria-selected={i === n}
            aria-controls={"sh-panel-" + n}
            tabIndex={i === n ? 0 : -1}
            className="tab"
            onClick={() => setI(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setI((v) => (v + 1) % STAKEHOLDERS.columns.length);
              if (e.key === "ArrowLeft")
                setI(
                  (v) =>
                    (v - 1 + STAKEHOLDERS.columns.length) %
                    STAKEHOLDERS.columns.length
                );
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {STAKEHOLDERS.columns.map((c, n) => (
        <div
          key={c.title}
          role="tabpanel"
          id={"sh-panel-" + n}
          aria-labelledby={"sh-tab-" + n}
          hidden={i !== n}
          className="card"
        >
          <h3>{c.title}</h3>
          <ul className="ticks" style={{ marginTop: 14 }}>
            {c.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Patient journey                                                     */
/* ------------------------------------------------------------------ */

export function Journey() {
  return (
    <div className="journey-rail" role="list">
      {JOURNEY.steps.map((s, n) => (
        <div className="jstep" role="listitem" key={s}>
          <div className="jnum" aria-hidden="true">
            {n + 1}
          </div>
          <div className="jbody">
            <span className="fine" style={{ display: "block", marginBottom: 2 }}>
              Milestone {n + 1}
            </span>
            {s}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Continuity calculator                                               */
/* ------------------------------------------------------------------ */

export function ContinuityCalculator() {
  const [patients, setPatients] = useState(500);
  const [baseline, setBaseline] = useState(4);
  const [uplift, setUplift] = useState(2);

  const incremental = Math.max(0, Math.round(patients * uplift));
  const baseTotal = Math.max(0, Math.round(patients * baseline));

  const num = (v: number) => v.toLocaleString("en-IN");

  return (
    <div className="card">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="calc-patients">Number of enrolled patients</label>
          <input
            id="calc-patients"
            type="number"
            min={0}
            max={100000}
            value={patients}
            onChange={(e) => setPatients(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="field">
          <label htmlFor="calc-base">
            Baseline average therapy duration (months)
          </label>
          <input
            id="calc-base"
            type="number"
            min={0}
            max={36}
            step={0.5}
            value={baseline}
            onChange={(e) => setBaseline(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="field span2">
          <label htmlFor="calc-uplift">
            Expected improvement in therapy duration (months)
          </label>
          <input
            id="calc-uplift"
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={uplift}
            onChange={(e) => setUplift(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--p-line)",
          marginTop: 6,
          paddingTop: 18,
        }}
        aria-live="polite"
      >
        <span className="fine" style={{ display: "block" }}>
          Baseline supported therapy-months
        </span>
        <b style={{ fontSize: 20, color: "var(--p-ink)" }}>{num(baseTotal)}</b>

        <span className="fine" style={{ display: "block", marginTop: 14 }}>
          Incremental supported therapy-months
        </span>
        <b className="stat-lg" style={{ display: "block" }}>
          {num(incremental)}
        </b>
      </div>

      <p className="fine" style={{ marginTop: 16 }}>
        {CONTINUITY.calculatorLabel}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((f, i) => {
        const on = open === i;
        return (
          <div className="acc" key={f.q}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="acc-btn"
                aria-expanded={on}
                aria-controls={"faq-" + i}
                onClick={() => setOpen(on ? null : i)}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" style={{ color: "var(--p-green)" }}>
                  {on ? "\u2212" : "+"}
                </span>
              </button>
            </h3>
            <div id={"faq-" + i} className="acc-panel" hidden={!on}>
              {f.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Request form                                                        */
/* ------------------------------------------------------------------ */

type Errors = Partial<Record<string, string>>;

export function RequestForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    designation: "",
    therapy: "",
    status: "",
    geography: "",
    message: "",
    blueprint: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");

  const set = (k: string, v: string | boolean) =>
    setValues((p) => ({ ...p, [k]: v }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (values.name.trim().length < 2) e.name = "Please enter your full name.";
    const email = values.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = "Please enter a valid work email address.";
    else if (/(gmail|yahoo|hotmail|outlook|rediffmail)\./.test(email))
      e.email = "Please use your work email address.";
    if (values.company.trim().length < 2) e.company = "Please enter your company.";
    if (values.designation.trim().length < 2)
      e.designation = "Please enter your designation.";
    if (!values.therapy) e.therapy = "Please select a therapy area.";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.getElementById("psp-" + Object.keys(e)[0]);
      first?.focus();
      return;
    }

    setState("sending");
    setServerError("");
    try {
      const res = await fetch("/api/psp/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success)
        throw new Error(data?.error || "Could not send. Please try again.");
      setState("done");
    } catch (err: any) {
      setServerError(err?.message || "Could not send. Please try again.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="card" role="status">
        <h3>Thank you. Your request has been received.</h3>
        <p style={{ marginTop: 8 }}>
          A member of the Lean Protocol partnerships team will be in touch to
          arrange a focused discussion around your therapy and proposed
          programme model.
        </p>
      </div>
    );
  }

  const field = (
    id: string,
    label: string,
    node: React.ReactNode,
    span = false
  ) => (
    <div
      className={
        "field " + (errors[id] ? "field-err " : "") + (span ? "span2" : "")
      }
    >
      <label htmlFor={"psp-" + id}>{label}</label>
      {node}
      {errors[id] && (
        <span className="err" id={"psp-" + id + "-err"} role="alert">
          {errors[id]}
        </span>
      )}
    </div>
  );

  const attrs = (id: string) => ({
    id: "psp-" + id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? "psp-" + id + "-err" : undefined,
  });

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="form-grid">
        {field(
          "name",
          "Full name",
          <input
            {...attrs("name")}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
        )}
        {field(
          "email",
          "Work email",
          <input
            {...attrs("email")}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        )}
        {field(
          "company",
          "Company",
          <input
            {...attrs("company")}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            autoComplete="organization"
          />
        )}
        {field(
          "designation",
          "Designation",
          <input
            {...attrs("designation")}
            value={values.designation}
            onChange={(e) => set("designation", e.target.value)}
            autoComplete="organization-title"
          />
        )}
        {field(
          "therapy",
          "Therapy area",
          <select
            {...attrs("therapy")}
            value={values.therapy}
            onChange={(e) => set("therapy", e.target.value)}
          >
            <option value="">Select</option>
            {THERAPY_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        {field(
          "status",
          "Current programme status",
          <select
            {...attrs("status")}
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="">Select</option>
            {PROGRAMME_STATUS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        {field(
          "geography",
          "Expected geography",
          <select
            {...attrs("geography")}
            value={values.geography}
            onChange={(e) => set("geography", e.target.value)}
          >
            <option value="">Select</option>
            {GEOGRAPHY_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>,
          true
        )}
        {field(
          "message",
          "Message",
          <textarea
            {...attrs("message")}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
          />,
          true
        )}
      </div>

      <label
        className="consent"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          fontSize: 14,
          lineHeight: 1.5,
          margin: "4px 0 18px",
        }}
      >
        <input
          type="checkbox"
          checked={values.blueprint}
          onChange={(e) => set("blueprint", e.target.checked)}
          style={{ marginTop: 3, width: 16, height: 16, flex: "none" }}
        />
        <span>
          Also send me the Post-Prescription Patient Support Blueprint.
        </span>
      </label>

      {serverError && (
        <p className="err" role="alert" style={{ marginBottom: 12 }}>
          {serverError}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-solid"
        disabled={state === "sending"}
        style={{ width: "100%" }}
      >
        {state === "sending" ? "Sending\u2026" : CTA.primary}
      </button>

      <p className="fine" style={{ marginTop: 12 }}>
        We use these details only to respond to your enquiry.
      </p>
    </form>
  );
}
