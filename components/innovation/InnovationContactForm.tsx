"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { contactForm } from "@/content/innovation";
import { innovationContactSchema } from "@/lib/innovation-contact-schema";
import { Section, SectionHeading } from "./InnovationUI";

const initialValues = {
  fullName: "",
  organisation: "",
  role: "",
  workEmail: "",
  phone: "",
  collaborationType: "",
  message: "",
  consent: false,
  website: "", // honeypot
};

export function InnovationContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof typeof initialValues>(
    key: K,
    value: (typeof initialValues)[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = innovationContactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/innovation/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setFormError(
          data?.error ?? "The enquiry could not be sent. Try again in a moment."
        );
        setStatus("error");
        return;
      }

      setStatus("sent");
      setValues(initialValues);
    } catch {
      setFormError("The enquiry could not be sent. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Section id="contact" variant="plain">
        <div className="inv-card mx-auto max-w-xl text-center">
          <span
            className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "var(--inv-green-soft)", color: "var(--inv-green)" }}
          >
            <CheckCircle2 size={22} aria-hidden />
          </span>
          <h2 className="inv-h3 mt-4 text-[20px]">{contactForm.successTitle}</h2>
          <p className="inv-body mt-2">{contactForm.successBody}</p>
          <button
            type="button"
            className="inv-btn inv-btn--secondary mt-6"
            onClick={() => setStatus("idle")}
          >
            Send another enquiry
          </button>
        </div>
      </Section>
    );
  }

  const field = (key: string) => (errors[key] ? "inv-field--error" : "");

  return (
    <Section id="contact" variant="plain">
      <SectionHeading
        eyebrow={contactForm.eyebrow}
        title={contactForm.headline}
        lead={contactForm.intro}
      />

      <form onSubmit={handleSubmit} noValidate className="mt-9 max-w-3xl" aria-describedby="contact-form-status">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className={field("fullName")}>
            <label className="inv-label" htmlFor="inv-fullName">Full name</label>
            <input
              id="inv-fullName"
              className="inv-input"
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? <p className="inv-error">{errors.fullName}</p> : null}
          </div>

          <div className={field("organisation")}>
            <label className="inv-label" htmlFor="inv-organisation">Organisation</label>
            <input
              id="inv-organisation"
              className="inv-input"
              autoComplete="organization"
              value={values.organisation}
              onChange={(e) => update("organisation", e.target.value)}
              aria-invalid={Boolean(errors.organisation)}
            />
            {errors.organisation ? <p className="inv-error">{errors.organisation}</p> : null}
          </div>

          <div className={field("role")}>
            <label className="inv-label" htmlFor="inv-role">Role</label>
            <input
              id="inv-role"
              className="inv-input"
              autoComplete="organization-title"
              value={values.role}
              onChange={(e) => update("role", e.target.value)}
              aria-invalid={Boolean(errors.role)}
            />
            {errors.role ? <p className="inv-error">{errors.role}</p> : null}
          </div>

          <div className={field("workEmail")}>
            <label className="inv-label" htmlFor="inv-workEmail">Work email</label>
            <input
              id="inv-workEmail"
              type="email"
              className="inv-input"
              autoComplete="email"
              value={values.workEmail}
              onChange={(e) => update("workEmail", e.target.value)}
              aria-invalid={Boolean(errors.workEmail)}
            />
            {errors.workEmail ? <p className="inv-error">{errors.workEmail}</p> : null}
          </div>

          <div className={field("phone")}>
            <label className="inv-label" htmlFor="inv-phone">
              Phone <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              id="inv-phone"
              type="tel"
              className="inv-input"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            {errors.phone ? <p className="inv-error">{errors.phone}</p> : null}
          </div>

          <div className={field("collaborationType")}>
            <label className="inv-label" htmlFor="inv-collaborationType">Collaboration type</label>
            <select
              id="inv-collaborationType"
              className="inv-select"
              value={values.collaborationType}
              onChange={(e) => update("collaborationType", e.target.value)}
              aria-invalid={Boolean(errors.collaborationType)}
            >
              <option value="" disabled>Choose one</option>
              {contactForm.collaborationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.collaborationType ? (
              <p className="inv-error">{errors.collaborationType}</p>
            ) : null}
          </div>
        </div>

        <div className={`mt-5 ${field("message")}`}>
          <label className="inv-label" htmlFor="inv-message">Message</label>
          <textarea
            id="inv-message"
            className="inv-textarea"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us what you would like to explore together."
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? <p className="inv-error">{errors.message}</p> : null}
        </div>

        {/* Honeypot - hidden from people, tempting to bots. */}
        <div className="inv-honey" aria-hidden="true">
          <label htmlFor="inv-website">Website</label>
          <input
            id="inv-website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        <div className={`mt-5 ${field("consent")}`}>
          <label className="flex cursor-pointer items-start gap-3 text-[14px]" htmlFor="inv-consent">
            <input
              id="inv-consent"
              type="checkbox"
              className="mt-[3px] h-[18px] w-[18px] flex-none"
              style={{ accentColor: "var(--inv-blue)" }}
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
            />
            <span style={{ color: "var(--inv-navy)" }}>{contactForm.consentLabel}</span>
          </label>
          {errors.consent ? <p className="inv-error">{errors.consent}</p> : null}
        </div>

        <div id="contact-form-status" aria-live="polite">
          {formError ? <p className="inv-error mt-4">{formError}</p> : null}
        </div>

        <button
          type="submit"
          className="inv-btn inv-btn--primary mt-6 w-full sm:w-auto"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
      </form>
    </Section>
  );
}
