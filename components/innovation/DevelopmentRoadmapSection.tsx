import { roadmap } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, NoteBox, StageChip } from "./InnovationUI";

export function DevelopmentRoadmapSection() {
  return (
    <Section id={roadmap.id} variant="surface">
      <SectionHeading
        eyebrow={roadmap.eyebrow}
        title={roadmap.headline}
        chip={<StageChip stage="planned" />}
      />

      <div className="mt-10">
        <InnovationImage
          {...innovationAssets.prototypeRoadmap}
          sizes="(max-width: 1180px) 100vw, 1100px"
        />
      </div>

      {/* The period markers are the structure here: this is a real timeline,
          so ordering carries information the reader needs. */}
      <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roadmap.phases.map((phase, i) => (
          <li key={phase.period} className="inv-card h-full">
            <div className="flex items-baseline justify-between gap-3">
              <p className="inv-marker">{phase.period}</p>
              <span
                className="inv-num text-[12px]"
                style={{ color: "var(--inv-border-strong)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="inv-h3 mt-2 text-[16.5px]">{phase.title}</h3>
            <ul className="inv-ticks mt-4">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 max-w-3xl">
        <NoteBox tone="safe">
          <span className="inv-marker mr-2" style={{ color: "var(--inv-green)" }}>
            End state
          </span>
          {roadmap.endState}
        </NoteBox>
      </div>
    </Section>
  );
}
