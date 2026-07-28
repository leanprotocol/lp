import { clinicalGap } from "@/content/innovation";
import { Section, SectionHeading, NoteBox } from "./InnovationUI";
import { FragmentedCareSection } from "./FragmentedCareSection";

export function ClinicalGapSection() {
  return (
    <Section id={clinicalGap.id} variant="plain">
      <SectionHeading
        eyebrow={clinicalGap.eyebrow}
        title={clinicalGap.headline}
        lead={clinicalGap.intro}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clinicalGap.problems.map((problem, i) => (
          <article key={problem.title} className="inv-card inv-card--raised">
            <span className="inv-num text-[12px]" style={{ color: "var(--inv-border-strong)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="inv-h3 mt-2 text-[16px]">{problem.title}</h3>
            <p className="inv-body mt-2">{problem.body}</p>
          </article>
        ))}
      </div>

      <FragmentedCareSection />

      <div className="mt-10 max-w-3xl">
        <NoteBox tone="caution">{clinicalGap.supporting}</NoteBox>
      </div>
    </Section>
  );
}
