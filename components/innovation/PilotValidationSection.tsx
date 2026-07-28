import { pilot, isVerified } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, NoteBox, StageChip } from "./InnovationUI";

export function PilotValidationSection() {
  return (
    <Section id={pilot.id} variant="surface">
      <SectionHeading
        eyebrow={pilot.eyebrow}
        title={pilot.headline}
        chip={<StageChip stage="planned" />}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-start lg:gap-14">
        <InnovationImage
          {...innovationAssets.pilotValidation}
          sizes="(max-width: 1024px) 100vw, 580px"
        />

        <div>
          <p className="inv-marker mb-4">Proposed parameters</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {pilot.parameters.map((param) => (
              <div key={param.label} className="inv-card">
                <p className="inv-small">{param.label}</p>
                <p
                  className="mt-1 font-medium"
                  style={{
                    color: isVerified(param.value) ? "var(--inv-blue)" : "var(--inv-muted)",
                    fontFamily: "var(--inv-mono)",
                    fontSize: isVerified(param.value) ? "20px" : "11.5px",
                  }}
                >
                  {param.value}
                </p>
              </div>
            ))}
          </div>

          <h3 className="inv-h3 mt-8 text-[16.5px]">Primary outcomes</h3>
          <ul className="inv-ticks mt-3">
            {pilot.primaryOutcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>

          <h3 className="inv-h3 mt-7 text-[16.5px]">Secondary exploratory outcomes</h3>
          <ul className="inv-ticks mt-3">
            {pilot.secondaryOutcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 max-w-3xl">
        <NoteBox tone="caution">{pilot.statement}</NoteBox>
      </div>
    </Section>
  );
}
