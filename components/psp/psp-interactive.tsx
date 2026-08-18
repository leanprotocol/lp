"use client";

// components/psp/psp-interactive.tsx
// The only interactive parts of /psp. Everything else renders on the
// server in app/psp/page.tsx.

import { useEffect, useRef, useState } from "react";
import { NAV, CTA, FAQS, THERAPY_OPTIONS } from "@/content/psp";

/* ---------------- reveal ---------------- */

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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={"rv " + (seen ? "in " : "") + className}>
      {children}
    </div>
  );
}

/* ---------------- header ---------------- */

export function PspHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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

        <a href="#request" className="btn btn-sage hdr-cta">
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

/* ---------------- faq ---------------- */

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq">
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
                <span aria-hidden="true">{on ? "\u2212" : "+"}</span>
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

/* ---------------- form ---------------- */

export function RequestForm() {
  const [v, setV] = useState({
    name: "",
    email: "",
    company: "",
    designation: "",
    therapy: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (v.name.trim().length < 2) e.name = "Please enter your full name.";
    const email = v.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = "Please enter a valid work email address.";
    else if (/(gmail|yahoo|hotmail|outlook|rediffmail)\./.test(email))
      e.email = "Please use your work email address.";
    if (v.company.trim().length < 2) e.company = "Please enter your company.";
    if (v.designation.trim().length < 2)
      e.designation = "Please enter your designation.";
    if (!v.therapy) e.therapy = "Please select a therapy area.";

    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById("psp-" + Object.keys(e)[0])?.focus();
      return;
    }

    setState("sending");
    setServerError("");
    try {
      const res = await fetch("/api/psp/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...v,
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
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="form-card" role="status">
        <h3>Thank you.</h3>
        <p className="body" style={{ marginTop: 8 }}>
          We will be in touch to arrange a discussion around your therapy and
          a defined pilot.
        </p>
      </div>
    );
  }

  const f = (id: string, label: string, node: React.ReactNode, span = false) => (
    <div
      className={"field " + (errors[id] ? "field-err " : "") + (span ? "span2" : "")}
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

  const a = (id: string) => ({
    id: "psp-" + id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? "psp-" + id + "-err" : undefined,
  });

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="fg">
        {f("name", "Full name",
          <input {...a("name")} value={v.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />)}
        {f("email", "Work email",
          <input {...a("email")} type="email" inputMode="email" value={v.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />)}
        {f("company", "Company",
          <input {...a("company")} value={v.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />)}
        {f("designation", "Designation",
          <input {...a("designation")} value={v.designation} onChange={(e) => set("designation", e.target.value)} autoComplete="organization-title" />)}
        {f("therapy", "Therapy area",
          <select {...a("therapy")} value={v.therapy} onChange={(e) => set("therapy", e.target.value)}>
            <option value="">Select</option>
            {THERAPY_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>, true)}
        {f("message", "Message (optional)",
          <textarea {...a("message")} value={v.message} onChange={(e) => set("message", e.target.value)} />, true)}
      </div>

      {serverError && (
        <p className="err" role="alert" style={{ marginBottom: 12 }}>
          {serverError}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-green"
        disabled={state === "sending"}
        style={{ width: "100%" }}
      >
        {state === "sending" ? "Sending\u2026" : CTA.primary}
      </button>
    </form>
  );
}
