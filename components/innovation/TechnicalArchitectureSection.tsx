import { architecture } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, NoteBox, StageChip } from "./InnovationUI";

export function TechnicalArchitectureSection() {
  return (
    <Section id={architecture.id} variant="plain">
      <SectionHeading
        eyebrow={architecture.eyebrow}
        title={architecture.headline}
        chip={<StageChip stage="proposed" />}
      />

      <div className="mt-10">
        <InnovationImage
          {...innovationAssets.technicalArchitecture}
          sizes="(max-width: 1180px) 100vw, 1100px"
        />
      </div>

      {/* Accessible HTML architecture. Layer numbering is real - each layer
          only talks to the one directly above and below it. */}
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {architecture.layers.map((layer) => (
          <section key={layer.n} className="inv-card h-full">
            <p className="inv-marker">{layer.n}</p>
            <h3 className="inv-h3 mt-2 text-[16.5px]">{layer.title}</h3>
            <ul className="inv-ticks mt-4">
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        <NoteBox tone="caution">{architecture.disclaimer}</NoteBox>
      </div>
    </Section>
  );
}
