import { Stethoscope, Cpu, Building2, ArrowRight } from "lucide-react";
import { collaboration } from "@/content/innovation";
import { Section, SectionHeading } from "./InnovationUI";

const icons = {
  stethoscope: Stethoscope,
  cpu: Cpu,
  building: Building2,
} as const;

export function CollaborationSection() {
  return (
    <Section id={collaboration.id} variant="plain">
      <SectionHeading eyebrow={collaboration.eyebrow} title={collaboration.headline} />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {collaboration.paths.map((path) => {
          const Icon = icons[path.icon as keyof typeof icons] ?? Building2;
          return (
            <article key={path.title} className="inv-card inv-card--raised flex h-full flex-col">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: "var(--inv-surface-2)", color: "var(--inv-blue)" }}
              >
                <Icon size={18} aria-hidden />
              </span>
              <h3 className="inv-h3 mt-4 text-[17px]">{path.title}</h3>
              <p className="inv-body mt-2 flex-1">{path.body}</p>

              <a href="#contact" className="inv-btn inv-btn--secondary mt-5 w-full">
                {path.cta}
                <ArrowRight size={15} aria-hidden />
              </a>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
