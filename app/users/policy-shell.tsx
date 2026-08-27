import Link from "next/link";
import type { Section } from "./policies-content";
import { policyMeta } from "./policies-content";

/**
 * Shared layout for the two enquiry-form policy pages.
 * Uses the same .users-page tokens as the funnel, so the styling
 * stays consistent without duplicating any CSS.
 */
export function PolicyShell({
  title,
  intro,
  sections,
  contactHeading,
  contactLines,
}: {
  title: string;
  intro: string;
  sections: Section[];
  contactHeading: string;
  contactLines: string[];
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#F9F7F2", padding: "0 0 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 760, margin: "0 auto", padding: "22px 20px" }}>
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <img src="/logo-cropped.png" alt="Lean Protocol" style={{ height: 44, width: "auto", display: "block" }} />
          <span className="brand-text">Lean Protocol</span>
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>
        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--lp-dark)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "var(--lp-muted)",
            marginTop: 8,
            fontWeight: 600,
          }}
        >
          Effective Date: {policyMeta.effectiveDate}
        </p>

        <p
          style={{
            fontSize: 15,
            color: "var(--lp-muted)",
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          {intro}
        </p>

        {sections.map((s) => (
          <section key={s.heading} style={{ marginTop: 30 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--lp-dark)",
                letterSpacing: "-0.01em",
              }}
            >
              {s.heading}
            </h2>

            {s.paras?.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 15,
                  color: "var(--lp-body)",
                  lineHeight: 1.65,
                  marginTop: 10,
                }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}

            {s.bullets && (
              <ul style={{ margin: "12px 0 0", paddingLeft: 0, listStyle: "none" }}>
                {s.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 15,
                      color: "var(--lp-body)",
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        flex: "none",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--lp-green)",
                        marginTop: 9,
                      }}
                    />
                    <span dangerouslySetInnerHTML={{ __html: b }} />
                  </li>
                ))}
              </ul>
            )}

            {s.after?.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 15,
                  color: "var(--lp-body)",
                  lineHeight: 1.65,
                  marginTop: 12,
                }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </section>
        ))}

        <section
          style={{
            marginTop: 34,
            background: "var(--lp-surface)",
            border: "1px solid var(--lp-border)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--lp-dark)" }}>
            {contactHeading}
          </h2>
          <div style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.75, color: "var(--lp-body)" }}>
            {contactLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div>
              Email:{" "}
              <a
                href={`mailto:${policyMeta.email}`}
                style={{ color: "var(--lp-green)", textDecoration: "underline" }}
              >
                {policyMeta.email}
              </a>
            </div>
            <div>Phone: {policyMeta.phone}</div>
          </div>
        </section>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, marginTop: 18 }}>
        <Link href="https://forms.leanprotocol.in/" style={{ color: "var(--lp-muted)", textDecoration: "underline" }}>
          Back to the form
        </Link>
      </p>
    </div>
  );
}
