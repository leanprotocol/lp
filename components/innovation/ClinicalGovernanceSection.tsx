import { Stethoscope, Eye, Route, FileText, AlertTriangle } from "lucide-react";
import { governance } from "@/content/innovation";
import { Section, SectionHeading } from "./InnovationUI";

const icons = {
  stethoscope: Stethoscope,
  eye: Eye,
  route: Route,
  file: FileText,
} as const;

export function ClinicalGovernanceSection() {
  return (
    <Section id={governance.id} variant="plain">
      <SectionHeading eyebrow={governance.eyebrow} title={governance.headline} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {governance.cards.map((card) => {
          const Icon = icons[card.icon as keyof typeof icons] ?? Stethoscope;
          return (
            <article key={card.title} className="inv-card inv-card--raised h-full">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: "var(--inv-green-soft)", color: "var(--inv-green)" }}
              >
                <Icon size={18} aria-hidden />
              </span>
              <h3 className="inv-h3 mt-4 text-[16px]">{card.title}</h3>
              <p className="inv-body mt-2">{card.body}</p>
            </article>
          );
        })}
      </div>

      <div
        className="mt-10 rounded-[14px] border p-5 md:p-7"
        style={{ borderColor: "var(--inv-border)", background: "var(--inv-surface)" }}
      >
        <p className="inv-marker mb-4 flex items-center gap-2">
          <AlertTriangle size={13} aria-hidden />
          Scope and limitations
        </p>
        <ul className="grid gap-2.5 md:grid-cols-2">
          {governance.disclaimers.map((line) => (
            <li key={line} className="flex gap-2.5 text-[14px]" style={{ color: "var(--inv-navy)" }}>
              <span aria-hidden style={{ color: "var(--inv-muted)" }}>&mdash;</span>
              {line}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t pt-5" style={{ borderColor: "var(--inv-border)" }}>
          {governance.policies.map((policy) => (
            <a key={policy.label} href={policy.href} className="inv-link text-[13px]">
              {policy.label}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
