import { workflow } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, NoteBox, StageChip } from "./InnovationUI";

export function ProductWorkflowSection() {
  return (
    <Section id={workflow.id} variant="surface">
      <SectionHeading
        eyebrow={workflow.eyebrow}
        title={workflow.headline}
        chip={<StageChip stage="proposed" />}
      />

      <div className="mt-10">
        <InnovationImage
          {...innovationAssets.clinicalWorkflow}
          sizes="(max-width: 1180px) 100vw, 1100px"
        />
      </div>

      {/* Accessible HTML version of the same workflow. The numbering is real:
          each step consumes the output of the one before it. */}
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {workflow.steps.map((step) => (
          <li key={step.n} className="inv-card h-full">
            <span
              className="inv-num inline-flex h-7 w-7 items-center justify-center rounded-[7px] text-[13px]"
              style={{ background: "var(--inv-surface-2)", color: "var(--inv-blue)" }}
            >
              {step.n}
            </span>
            <h3 className="inv-h3 mt-3 text-[16px]">{step.title}</h3>
            <p className="inv-body mt-2">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 max-w-3xl">
        <NoteBox tone="safe">{workflow.safety}</NoteBox>
      </div>
    </Section>
  );
}
