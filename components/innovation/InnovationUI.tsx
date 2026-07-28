import type { ReactNode } from "react";
import { stages, type Stage } from "@/content/innovation";

/** Mono status chip. The page's signature device: every claim is stamped
 *  with the stage it is actually at. */
export function StageChip({ stage, label }: { stage: Stage; label?: string }) {
  return (
    <span className={`inv-chip inv-chip--${stage}`}>{label ?? stages[stage]}</span>
  );
}

export function Section({
  id,
  variant = "plain",
  className = "",
  children,
}: {
  id?: string;
  variant?: "plain" | "surface" | "band";
  className?: string;
  children: ReactNode;
}) {
  const variantClass =
    variant === "surface"
      ? "inv-section--surface"
      : variant === "band"
      ? "inv-section--band"
      : "";
  return (
    <section id={id} className={`inv-section ${variantClass} ${className}`}>
      <div className="inv-wrap">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  chip,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  chip?: ReactNode;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <header className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? <p className="inv-eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="inv-h2">{title}</h2>
      {chip ? <div className="mt-4">{chip}</div> : null}
      {lead ? <p className="inv-lead mt-4">{lead}</p> : null}
    </header>
  );
}

/** Boxed statement used for safety notes and disclaimers. */
export function NoteBox({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "safe" | "caution";
  children: ReactNode;
}) {
  const toneStyle =
    tone === "safe"
      ? { background: "var(--inv-green-soft)", borderColor: "rgba(46,125,91,.28)" }
      : tone === "caution"
      ? { background: "var(--inv-yellow-soft)", borderColor: "rgba(232,168,12,.34)" }
      : { background: "var(--inv-surface)", borderColor: "var(--inv-border)" };

  return (
    <p
      className="rounded-[12px] border p-4 text-[14px] leading-relaxed md:p-5"
      style={{ ...toneStyle, color: "var(--inv-navy)" }}
    >
      {children}
    </p>
  );
}
